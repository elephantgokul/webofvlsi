// js/api.js  -  Centralized API utility for Google Apps Script & Supabase integration
// Department of VLSI Design and Technology, SIET

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtiC0y8Gwzr0gj5Mcb1wJaSogr44lWI2PlYQQOVj-wbTOKw2EyJmXvhnibGlRr7Idc/exec";

const API_CACHE_PREFIX = "vlsi_api_";
const API_CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache

/**
 * Fetch data from the Apps Script API with zero latency.
 * Instantly returns cached/fallback data and refreshes in the background.
 * @param {string} [action] - Optional action parameter
 * @returns {Promise<Object>}
 */
async function fetchWithAction(action) {
    const cacheKey = API_CACHE_PREFIX + (action || "all");

    // 1. Instantly check localStorage or sessionStorage for zero-latency load
    let cachedData = null;
    try {
        const raw = localStorage.getItem(cacheKey) || sessionStorage.getItem(cacheKey);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.data) {
                cachedData = parsed.data;
                if (Date.now() - parsed.timestamp < API_CACHE_TTL) {
                    return cachedData;
                }
            }
        }
    } catch (e) {}

    // 2. If we have cached data, return it immediately and revalidate in background
    if (cachedData) {
        revalidateInBackground(action, cacheKey);
        return cachedData;
    }

    // 3. Return fallback immediately (0ms latency) and revalidate in background
    const fallback = getFallbackData();
    revalidateInBackground(action, cacheKey);
    return fallback;
}

function revalidateInBackground(action, cacheKey) {
    let url = APPS_SCRIPT_URL;
    if (action) {
        url += (url.includes("?") ? "&" : "?") + "action=" + encodeURIComponent(action);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch(url, { method: "GET", redirect: "follow", signal: controller.signal })
        .then(res => res.ok ? res.text() : Promise.reject(new Error(res.statusText)))
        .then(text => {
            clearTimeout(timeoutId);
            const data = JSON.parse(text);
            if (data && (data.students || data.faculty || data.hod)) {
                try {
                    const payload = JSON.stringify({ data: data, timestamp: Date.now() });
                    localStorage.setItem(cacheKey, payload);
                    sessionStorage.setItem(cacheKey, payload);
                } catch (e) {}
            }
        })
        .catch(() => {
            clearTimeout(timeoutId);
        });
}

/**
 * Fetch all department data (HOD + Faculty + Students).
 * This is the main entry point used by page scripts.
 * @returns {Promise<Object>}
 */
async function fetchDepartmentData() {
    return withDefaultStudentFields(await fetchWithAction(null));
}

function withDefaultStudentFields(data) {
    const source = data || getFallbackData();
    const studentsList = (Array.isArray(source.students) && source.students.length > 0)
        ? source.students
        : getFallbackData().students;

    return Object.assign({}, source, {
        students: studentsList.map(student => {
            const registerNo = student.registerNo || student.rollno || "";
            const image = student.image || student.photoUrl || "";

            return Object.assign({
                achievementTitle: student.achievementTitle || "Achievement",
                achievement: "",
                description: "",
                universityNo: student.universityNo || "",
                programme: student.programme || "",
                linkedin: "",
                github: ""
            }, student, {
                registerNo: registerNo,
                rollno: student.rollno || registerNo,
                image: image,
                photoUrl: student.photoUrl || image,
                batch: student.batch || getBatchFromRegisterNo(registerNo),
                yearToken: getStudentYearToken(student.year)
            });
        })
    });
}

function getStudentYearToken(year) {
    const text = String(year || "").toUpperCase();
    if (text.includes("IV")) return "IV";
    if (text.includes("III")) return "III";
    if (text.includes("II")) return "II";
    if (/\bI\b/.test(text) || text === "I" || text.includes("FIRST") || text.includes("I YEAR")) return "I";
    return "III";
}

function getBatchFromRegisterNo(registerNo) {
    const match = String(registerNo || "").match(/^(\d{2})/);
    return match ? "20" + match[1] + " - 20" + (parseInt(match[1], 10) + 4) : "2024 - 2028";
}

/**
 * Helper to resolve asset paths for images (supporting both Supabase & local assets)
 */
function resolveAssetPath(src, bucket) {
    if (typeof window.resolveSupabaseImageUrl === 'function') {
        return window.resolveSupabaseImageUrl(src, bucket || (typeof SUPABASE_BUCKETS !== 'undefined' ? SUPABASE_BUCKETS.faculty : 'faculty'), src);
    }
    const value = String(src || '');
    if (!value || /^(https?:|data:|\/|\.\.?\/)/i.test(value)) return value;
    const isInsidePages = typeof window !== 'undefined' && window.location && window.location.pathname.replace(/\\/g, '/').includes('/pages/');
    return value.indexOf('assets/') === 0 ? (isInsidePages ? '../' : '') + value : value;
}

/**
 * Fallback data used when the API is unreachable or returns invalid data.
 * This ensures the website always displays full content.
 */
function getFallbackData() {
    return {
        hod: {
            name: "Dr. P. Dhilipkumar",
            designation: "Associate Professor & Head",
            qualification: "M.E., Ph.D.",
            message: "Welcome to the Department of VLSI Design and Technology at Sri Shakthi Institute of Engineering and Technology. Established in 2024, our department is committed to building strong fundamentals in VLSI, Embedded Systems, and semiconductor design through hands-on laboratories and an industry-aligned curriculum.",
            contact: "dhilipkumarece@siet.ac.in",
            phone: "+91-422-XXXXXXX",
            researchInterests: ["VLSI Design", "Embedded Systems", "Semiconductor Design"],
            photoUrl: "dhilipkumar.jpg"
        },
        faculty: [
            { id: 1, name: "Dr. P. Dhilipkumar", designation: "Associate Professor & Head", qualification: "M.E., Ph.D.", specialization: "VLSI Design and Technology", email: "dhilipkumarece@siet.ac.in", orcid: "", image: "dhilipkumar.jpg", photoUrl: "dhilipkumar.jpg" },
            { id: 2, name: "Mrs. C. Prema", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Premacece@siet.ac.in", orcid: "", image: "prema.jpg", photoUrl: "prema.jpg" },
            { id: 3, name: "Mrs. P. Priscillasophia", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Priscillasophiaece@siet.ac.in", orcid: "", image: "priscillasophia.jpg", photoUrl: "priscillasophia.jpg" },
            { id: 4, name: "Mrs. T. Renita Pearlin", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Trenitacdc@siet.ac.in", orcid: "", image: "renita.jpg", photoUrl: "renita.jpg" },
            { id: 5, name: "Mrs. R. Vasanthi", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Vasanthiece@siet.ac.in", orcid: "", image: "vasanthi.jpg", photoUrl: "vasanthi.jpg" }
        ],
        students: [
            {
                id: 1,
                name: "Harini D",
                registerNo: "24VL009",
                rollno: "24VL009",
                universityNo: "714024169009",
                programme: "B.E. EE (VDT)",
                year: "III Year",
                batch: "2024 - 2028",
                email: "harini6898@gmail.com",
                achievementTitle: "Industrial Training & Workshop Certification in VLSI",
                achievement: "Designed and implemented a High-Speed AMBA AXI4 Interconnect for SoC applications as an individual academic project, covering RTL design in Verilog HDL and the complete ASIC physical design flow  -  synthesis, placement, clock tree synthesis, routing, and timing analysis  -  using Synopsys tools including VCS, Design Compiler, IC Compiler II, PrimeTime, and Verdi, with a focus on optimizing area, timing, and power.\n\nCompleted 4 technical internships/trainings covering:\n- VLSI Layout Design and Digital & Hardware Implementation with Altera (Intel) FPGA at Chip Craft\n- PCB design and fabrication practices at Enthutech\n- Verilog HDL/SystemVerilog hands-on training at SM AI Mojo Tech\n- Circuit design and simulation using Proteus at Manfree\n\nAlso participated in a seminar on:\n\"Trends Towards 6G and AI Integration\"\n\nThis reflects continuous engagement with emerging technologies alongside core VLSI design expertise.",
                description: "",
                image: "harini-d.jpg",
                photoUrl: "harini-d.jpg",
                linkedin: "",
                github: ""
            },
            {
                id: 2,
                name: "Tharun M",
                registerNo: "24VL047",
                rollno: "24VL047",
                universityNo: "",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "selant473@gmail.com",
                achievementTitle: "Industrial Training, Internships & VLSI Projects",
                achievement: "- Completed VLSI Layout Design Internship and gained practical semiconductor design experience.\n- Completed Verilog HDL & SystemVerilog Internship with RTL design exposure.\n- Completed PCB Design Internship using KiCad.\n- Completed Embedded Systems Internship with Arduino and microcontroller applications.\n- Developed technical projects including:\n  - 16-bit RISC Processor\n  - UART\n  - 6T SRAM Cell",
                description: "",
                image: "tharun-m.jpg",
                photoUrl: "tharun-m.jpg",
                linkedin: "https://www.linkedin.com/in/tharun-m-a88691413",
                github: ""
            },
            {
                id: 3,
                name: "Nithikkannan J S",
                registerNo: "24VL024",
                rollno: "24VL024",
                universityNo: "714024169024",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "nithikkannan7@gmail.com",
                achievementTitle: "Industrial Training & Workshop Certifications in VLSI",
                achievement: "- Participated in the VLSI Test Workshop at PSG College of Technology organized by IEEE Computer Society TTTC.\n- Completed Custom IC Design Mastery using Cadence EDA Tools training by Abhiyantha / Entuple Technologies.\n- Completed an Internship Program in VLSI Layout Design with Chip Crafts.",
                description: "",
                image: "nithikkannan-js.jpg",
                photoUrl: "nithikkannan-js.jpg",
                linkedin: "https://www.linkedin.com/in/nithikkannan-j-s-90b47a334",
                github: ""
            },
            {
                id: 4,
                name: "Suman",
                registerNo: "24VL045",
                rollno: "24VL045",
                universityNo: "",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "suman.127418@gmail.com",
                achievementTitle: "Technical Workshops & Hackathons",
                achievement: "- Attended a 15-day Cadence Workshop conducted by Entuple.\n- Participated in a 24-hour Hackathon at RIT Chennai.\n- Participated in a Hackathon at KPR Institute of Engineering and Technology.",
                description: "",
                image: "suman.jpg",
                photoUrl: "suman.jpg",
                linkedin: "",
                github: ""
            },
            {
                id: 5,
                name: "Anand K",
                registerNo: "24VL003",
                rollno: "24VL003",
                universityNo: "",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "ffgb64545@gmail.com",
                achievementTitle: "VLSI Engineering, Technical Training & Industry Exposure",
                achievement: "Developed a strong foundation in VLSI Design, Digital Electronics, CMOS fundamentals, and ASIC design flow.\n\nGained hands-on exposure to Verilog and SystemVerilog, including combinational and sequential RTL design and testbench development.\n\nStudied and practiced the RTL-to-Gate-Level Synthesis flow, including RTL translation, optimization, and technology mapping.\n\nGained knowledge of Static Timing Analysis (STA), including setup time, hold time, timing constraints, and timing violations.\n\nAcquired practical exposure to Cadence EDA tools and semiconductor design workflows.\n\nWorked with MATLAB for signal processing concepts including convolution, FFT, frequency response, and signal analysis.\n\nGained experience with Proteus simulation for digital and embedded-system-based circuit implementations.\n\nCompleted multiple technical internships/training programs with:\n- Enthu Tech\n- Manfree\n- Career Ladders\n- SM AI MOJO TECH\n- ChipCrafts\n\nContinuously developing skills in RTL Design, Verification, Synthesis, STA, SystemVerilog, and EDA tools with the goal of pursuing a career in the semiconductor/VLSI industry.",
                description: "Motivated and enthusiastic VLSI Engineering student with a strong foundation in Digital Electronics, VLSI Design, RTL Design, Verilog/SystemVerilog, Synthesis, and Static Timing Analysis (STA).\n\nPossess hands-on exposure to EDA tools, MATLAB, Proteus, and semiconductor design concepts through academic projects, technical training, and internships.\n\nCompleted multiple industry-oriented training programs with Enthu Tech, Manfree, Career Ladders, SM AI MOJO TECH, and ChipCrafts.\n\nA quick learner with a strong interest in ASIC Design, RTL Development, Verification, and Semiconductor Technologies, seeking opportunities to apply technical knowledge and develop practical expertise in the VLSI industry.",
                image: "anand-k.jpg",
                photoUrl: "anand-k.jpg",
                linkedin: "https://www.linkedin.com/in/anand-k-bb0907338/",
                github: ""
            },
            {
                id: 6,
                name: "Udhaya R",
                registerNo: "24VL051",
                rollno: "24VL051",
                universityNo: "714024169051",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "u66991302@gmail.com",
                achievementTitle: "Synopsys VLSI Training & RTL-to-GDSII Project",
                achievement: "Completed industrial Synopsys training on the RTL-to-GDSII design flow and gained hands-on experience in RTL design, simulation, synthesis, and physical design concepts.\n\nWorked on VLSI projects including:\n- DDR Controller\n- Mini RISC-V Processor",
                description: "",
                image: "udhaya-r.jpg",
                photoUrl: "udhaya-r.jpg",
                linkedin: "https://www.linkedin.com/in/udhaya-r-27726a367",
                github: ""
            },
            {
                id: 7,
                name: "Tharum R.M",
                registerNo: "24VL049",
                rollno: "24VL049",
                universityNo: "",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "tharunrm1756@gmail.com",
                achievementTitle: "VLSI, Semiconductor Training, RTL-to-GDS & Technical Projects",
                achievement: "Completed 6 technical internships, workshops and industrial training programs in VLSI, semiconductor technology, PCB design, embedded systems and RTL-to-GDS design.\n\nCompleted Code to Chip  -  RTL to GDS Flow Using Synopsys Tools industry-oriented workshop conducted by VLSIMINDS, Bangalore.\n\nCompleted VLSI Layout Design Internship at Chip Crafts, gaining practical exposure to VLSI layout methodologies.\n\nCompleted a 2-week PCB Design and Fabrication Internship through Enthu-EdTech.\n\nCompleted Semiconductor & Manufacturing Workshop conducted by Ethical Edufabrica in association with Mechanica, IIT Madras.\n\nCompleted Embedded Programming for Arduino GPIOs training at Embuzz Technologies.\n\nParticipated in a PCB Design and Fabrication Workshop at KPR Institute of Engineering and Technology.\n\nSuccessfully developed multiple RTL/VLSI projects using Verilog, SystemVerilog and Synopsys EDA tools, including:\n- NoC Router\n- AMBA APB Controller\n- Automotive ADAS Processing Unit\n\nWorked on real-time VLSI design and verification projects covering RTL simulation, synthesis, timing analysis and physical design concepts.\n\nDeveloped an AI Accelerator / Matrix Multiplication Processing Unit using a systolic-array architecture as an advanced VLSI project.\n\nGained hands-on exposure to:\n- Synopsys Design Compiler\n- ICC2\n- VCS\n- Verdi\n\nthrough academic and project-based work.",
                description: "- Offline workshop at college for Digital Hardware Implementation with Altera FPGAs  -  2 days\n- Coordinated Cadence workshop conducted in college and mentored participants  -  2 days\n- Completed System-on-Chip project: Hand Gesture Control using Jetson Nano\n- Attended 4 internships\n- Coordinator of DM Club in college",
                image: "tharum-rm.jpg",
                photoUrl: "tharum-rm.jpg",
                linkedin: "",
                github: ""
            },
            {
                id: 8,
                name: "Tharun R",
                registerNo: "24VL048",
                rollno: "24VL048",
                universityNo: "",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "rajeshtharun2318@gmail.com",
                achievementTitle: "VLSI Internships, Synopsys Workshops & Technical Projects",
                achievement: "Attended 6 technical internships in areas such as VLSI Design, Embedded Systems, PCB Design, and software technologies, gaining practical industry exposure.\n\nParticipated in a 2-day offline workshop at IIT Madras, a 5-day hands-on training program on Synopsys EDA tools, and a 2-day workshop on Digital Hardware Implementation using Altera (Intel) FPGAs.\n\nServed as a Student Presenter at the PCB LAB Tech Park Inaugural Event, showcasing technical knowledge and project skills.\n\nCompleted 3 real-time VLSI projects using Synopsys tools and currently working on 4 additional projects to enhance design and verification expertise.\n\nAdditionally, completed 8 examinations under Madras Prachar Sabha for Hindi proficiency, demonstrating dedication towards language learning and continuous skill development.",
                description: "6 technical internships in areas such as VLSI Design, Embedded Systems, PCB Design, and software technologies. 3 real time projects using Synopsys EDA tools and working on advanced semiconductor architectures.",
                image: "tharun-r.jpg",
                photoUrl: "tharun-r.jpg",
                linkedin: "https://www.linkedin.com/search/results/all/?keywords=Tharun%20Rajesh",
                github: ""
            },
            {
                id: 9,
                name: "Kamalesh VK",
                registerNo: "24VL014",
                rollno: "24VL014",
                universityNo: "",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "vkkamalesh1@gmail.com",
                achievementTitle: "Technical Internships & Industry-Oriented Training",
                achievement: "Successfully completed technical internships and training programs at:\n- Manfree Technologies  -  Technical Internship\n- Career Ladder  -  Technical Training Program\n- AI Mojo Tech  -  Artificial Intelligence Training\n- Chip Craft  -  VLSI & Semiconductor Design Training\n\nGained practical exposure to:\n- Embedded Systems\n- IoT\n- Artificial Intelligence\n- VLSI Design\n- RTL Coding\n- Semiconductor Technologies\n\nDeveloped hands-on experience through industry-oriented projects, technical workshops, hardware and software implementation, and real-time problem-solving activities.\n\nThese internships strengthened programming, digital design, analytical thinking, teamwork, and professional skills while providing valuable exposure to current industrial practices and emerging technologies.",
                description: "",
                image: "kamalesh-vk.jpg",
                photoUrl: "kamalesh-vk.jpg",
                linkedin: "",
                github: ""
            },
            {
                id: 10,
                name: "Gokul P",
                registerNo: "24VL008",
                rollno: "24VL008",
                universityNo: "",
                programme: "B.E. VLSI Design and Technology",
                year: "III Year",
                batch: "2024 - 2028",
                email: "psivam574@gmail.com",
                achievementTitle: "AI Attendance & Money Management Systems, 6 Internships",
                achievement: "1. Attendance Monitoring System - Developed AI Attendance Monitoring System\n2. Money Management System - Built Money Management System\n3. Internships - Completed 6 Industry Internships\n4. Technical Skills - Developed Strong VLSI & Software Skills",
                description: "Designed and deployed a web-based attendance management system with real-time tracking, advisor dashboard, and automated reports. Created a web application for expense tracking, budget planning, and monthly financial reports. Gained hands-on experience in VLSI, Digital Hardware Design, SystemVerilog, PCB Design, Embedded Systems, Python, and OOP. Built expertise in SystemVerilog, Digital Hardware Design, Python, Web Development, and GitHub through projects and internships.",
                image: "gokul.jpg",
                photoUrl: "gokul.jpg",
                linkedin: "GOKUL P",
                github: "https://github.com/elephantgokul"
            }
        ]
    };
}
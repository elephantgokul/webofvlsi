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
            const linkedin = student.linkedin || student.linkedin_url || student.linkedinUrl || "";
            const github = student.github || student.github_url || student.githubUrl || "";
            const projectsOverview = student.projectsOverview || student.projects_overview || student.projects || student.project || "";

            return Object.assign({
                achievementTitle: student.achievementTitle || "Achievement",
                achievement: "",
                description: "",
                projectsOverview: projectsOverview,
                universityNo: student.universityNo || "",
                programme: student.programme || "",
                linkedin: linkedin,
                github: github
            }, student, {
                projectsOverview: projectsOverview,
                linkedin: linkedin,
                github: github,
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
            phone: "+91 96295 61731",
            researchInterests: ["VLSI Design", "Embedded Systems", "Semiconductor Design"],
            photoUrl: "dhilipkumar.jpg"
        },
        faculty: [
            { id: 1, name: "Dr. P. Dhilipkumar", designation: "Associate Professor & Head", qualification: "M.E., Ph.D.", specialization: "VLSI Design and Technology", email: "dhilipkumarece@siet.ac.in", orcid: "", image: "dhilipkumar.jpg", photoUrl: "dhilipkumar.jpg" },
            { id: 4, name: "Mrs. T. Renita Pearlin", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Trenitacdc@siet.ac.in", orcid: "", image: "renita.jpg", photoUrl: "renita.jpg" },
            { id: 3, name: "Mrs. P. Priscillasophia", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Priscillasophiaece@siet.ac.in", orcid: "", image: "priscillasophia.jpg", photoUrl: "priscillasophia.jpg" },
            { id: 2, name: "Mrs. C. Prema", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Premacece@siet.ac.in", orcid: "", image: "prema.jpg", photoUrl: "prema.jpg" },
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
                projectsOverview: "High-Speed AMBA AXI4 Interconnect for SoC; FPGA Implementation",
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
                projectsOverview: "16-bit RISC Processor, UART Controller, 6T SRAM Cell",
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
                projectsOverview: "Custom IC Design using Cadence EDA Tools; VLSI Layout",
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
                projectsOverview: "Cadence ASIC Design, 24-hour Hackathon IoT Prototype",
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
                projectsOverview: "RTL-to-GDSII ASIC Flow, SystemVerilog Verification, Static Timing Analysis",
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
                projectsOverview: "DDR Memory Controller, Mini RISC-V Processor Core",
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
                projectsOverview: "NoC Router, AMBA APB Controller, Systolic AI Accelerator",
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
                projectsOverview: "Real-time Synopsys VLSI Architectures, Digital FPGA Hardware",
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
                projectsOverview: "IoT & Embedded VLSI RTL Subsystems, AI Mojo Tech Hardware",
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
                projectsOverview: "AI Attendance System, Money Management System, SIET VLSI Portal",
                description: "Designed and deployed a web-based attendance management system with real-time tracking, advisor dashboard, and automated reports. Created a web application for expense tracking, budget planning, and monthly financial reports. Gained hands-on experience in VLSI, Digital Hardware Design, SystemVerilog, PCB Design, Embedded Systems, Python, and OOP. Built expertise in SystemVerilog, Digital Hardware Design, Python, Web Development, and GitHub through projects and internships.",
                image: "gokul.jpg",
                photoUrl: "gokul.jpg",
                linkedin: "",
                github: "https://github.com/elephantgokul"
            },
            {
                "id": 11,
                "name": "SANKAMES VS",
                "registerNo": "24VL036",
                "rollno": "24VL036",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "nsankames@gmail.com",
                "achievementTitle": "Project: Digital Clock Simulation",
                "achievement": "Designed and developed a Digital Clock Simulation project that displays the current time in digital format using hours, minutes, and seconds. The clock continuously updates the time and demonstrates the working of digital time-display systems.\n\nObjectives:\n- To design and develop a simple digital clock system\n- To display hours, minutes, and seconds accurately\n- To understand the working of digital time-display systems\n- To learn how timing and counting operations are used in digital systems\n- To provide a simple and user-friendly digital clock simulation",
                "projectsOverview": "Digital Clock Simulation",
                "description": "A Digital Clock Simulation is a project that displays the current time in digital format using hours, minutes, and seconds. The clock continuously updates the time and can be implemented using programming or digital electronic components. This project demonstrates understanding of timing, counting operations, and digital display systems.",
                "image": "sankames-vs.jpg",
                "photoUrl": "sankames-vs.jpg",
                "linkedin": "https://www.linkedin.com/in/sankames-sankames-4b2116339",
                "github": ""
            },
            {
                "id": 12,
                "name": "V T RAGHUL VASUN",
                "registerNo": "24VL029",
                "rollno": "24VL029",
                "universityNo": "714024169029",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "vtraghulvasun@gmail.com",
                "achievementTitle": "Internships, Training & Technical Programs",
                "achievement": "Completed multiple technical internships and training programs:\n- Chip Crafts \u2013 VLSI Layout Internship\n- Career Ladder \u2013 Java Programming\n- ENTHU \u2013 Internship / Technical Training\n- Manfree \u2013 Internship / Technical Training\n- SM MOJO TECH \u2013 Internship / Technical Training\n\nWorkshops:\n- FPGA Altera Workshop \u2013 Chip Crafts\n- Synopsys EDA Tools Workshop\n- Cadence EDA Tools Workshop",
                "projectsOverview": "8-bit ALU, Booth Multiplier, TCAM",
                "description": "1. 8-bit ALU: Design an 8-bit Arithmetic Logic Unit capable of performing arithmetic and logical operations using synthesizable RTL. Objectives include implementing arithmetic and bitwise logic operations, developing operation selection and status flag logic, verifying the ALU using a functional testbench, and synthesizing and analyzing the gate-level implementation.\n\n2. Booth Multiplier: Design a signed Booth Multiplier for efficient binary multiplication, focusing on arithmetic datapath design and ASIC synthesis. Objectives include implementing signed multiplication using Booth's algorithm, developing partial-product and control logic, verifying the multiplier for different input conditions, and analyzing synthesized timing and area characteristics.\n\n3. TCAM: Design a Ternary Content-Addressable Memory architecture that supports parallel pattern matching using binary and don't-care states. Objectives include implementing ternary comparison and search logic, developing match-line evaluation and result generation, verifying exact matches, masked matches, and no-match conditions, and analyzing the RTL architecture using ASIC synthesis tools.",
                "image": "v-t-raghul-vasun.jpg",
                "photoUrl": "v-t-raghul-vasun.jpg",
                "linkedin": "https://www.linkedin.com/in/raghul-vasun-vt-3a804941a",
                "github": ""
            },
            {
                "id": 13,
                "name": "Kavya M",
                "registerNo": "24VL016",
                "rollno": "24VL016",
                "universityNo": "714024169016",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "kavyamanoharan2006@gmail.com",
                "achievementTitle": "Hackathons, Workshops & Technical Events",
                "achievement": "1. ROBOCHIPX \u2013 A 24-Hours Hackathon (AI / CHIP / ROBOTICS) at Rajalakshmi Institute of Technology, Chennai \u2013 July 9 & 10, 2026 (2 days)\n2. RISC-V Hands-on Training Workshop at IIT Madras \u2013 March 21 & 22, 2026 (2 days)\n3. ECE Paper Presentation at FIESTAA'26, KPR Institute of Engineering and Technology \u2013 February 20 & 21, 2026\n4. ECE Workshops at FIESTAA'26, KPR Institute of Engineering and Technology \u2013 February 20 & 21, 2026\n5. Custom IC Design Mastery using Cadence EDA Tools at Sri Shakthi Institute (Abhiyantha / Entuple Technologies) \u2013 December 11\u201323, 2025 (13 days)\n6. VLSI Test Workshop at PSG College of Technology (IEEE TTTC) \u2013 October 10\u201312, 2025 (3 days)\n7. VLSI DAY 2025 at PSG College of Technology (VLSI Society of India) \u2013 September 20, 2025\n8. VDAT 30th Conference Fellowship at Jaypee Institute of Information Technology \u2013 August 20\u201322, 2025 (3 days)\n9. On-Campus Training: Chip Design using Cadence Tool Chain (RTL to GDSII) \u2013 July 16\u201322, 2026 (7 days)\n10. Workshop Fiasta at KPR Institute of Engineering and Technology \u2013 February 20 & 21",
                "projectsOverview": "",
                "description": "",
                "image": "kavya-m.jpg",
                "photoUrl": "kavya-m.jpg",
                "linkedin": "https://www.linkedin.com/in/kavya-m-9376a2322",
                "github": ""
            },
            {
                "id": 14,
                "name": "Subhashini N",
                "registerNo": "24VL043",
                "rollno": "24VL043",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "subhashininallasamy@gmail.com",
                "achievementTitle": "Workshops & Internships",
                "achievement": "Workshops:\n- PCB Design and Fabrication at KPR Institute of Engineering and Technology \u2013 March 14, 2025 (1 day)\n- VLSI TEST Workshop at PSG College of Technology \u2013 October 10\u201312, 2025 (3 days)\n- VLSI Design Flow from RTL to GDS at Chipxpert Technologies \u2013 November 1\u20132, 2025 (2 days)\n- Code to Chip: RTL to GDS flow using Synopsys tools at VLSI Minds \u2013 February 16\u201320, 2026 (5 days)\n- Digital Hardware Design and Implementation with Altera (Intel) FPGAs at Chipcrafts \u2013 November 18\u201319, 2025 (2 days)\n\nInternships:\n- Chip Crafts \u2013 VLSI Layout Design (September 3\u201310, 2025)\n- Career Ladder \u2013 Programming Paradigm using Java (September 11\u201316, 2025)\n- EnthuTech \u2013 PCB Designing",
                "projectsOverview": "RTL-to-GDSII Implementation of a Low-Power Edge-AI Safety Monitoring SoC, Edge-AI SoC for ADAS",
                "description": "1. RTL-to-GDSII Implementation of a Low-Power Edge-AI Safety Monitoring SoC for Real-Time Emergency Detection Using Synopsys ASIC Flow\n\n2. Design and FPGA/ASIC Implementation of an Edge-AI SoC for Advanced Driver Assistance Systems (ADAS) (Group Project)",
                "image": "subhashini-n.jpg",
                "photoUrl": "subhashini-n.jpg",
                "linkedin": "https://www.linkedin.com/in/subhashini-nallasamy-4ab745328",
                "github": ""
            },
            {
                "id": 15,
                "name": "Varsha V R",
                "registerNo": "24VL052",
                "rollno": "24VL052",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "varshavr24vl@srishakthi.ac.in",
                "achievementTitle": "Internships, Workshops & Hackathons",
                "achievement": "Internships:\n- SystemVerilog Internship at SM AI MOJO TECH\n- STM32 Microcontroller Design Intern at Manfree Technology\n- PCB Design & Fabrication Intern at Enthu EdTech\n- Embedded Systems Intern at Manfree Technology\n- Basic Java Programming Intern at Career Ladder\n- VLSI Layout Design Intern at Chip Crafts\n\nWorkshops:\n- Code to Chip \u2013 RTL to GDS Flow Using Synopsys Tools\n- Workshop on Digital Hardware Design with Altera (Intel) FPGAs\n- VLSI Test Workshop at PSG College of Technology\n\nHackathons:\n- RoboChipX at Rajalakshmi Institute of Technology, Chennai",
                "projectsOverview": "Adaptive Dynamic-Precision Sparse Neural Network Accelerator, AMBA AXI4-Lite Master/Slave, SPI Protocol Controller",
                "description": "Project 1: Adaptive Dynamic-Precision Sparse Neural Network Accelerator for Edge AI \u2013 Designed a neural network accelerator architecture utilizing dynamic precision scaling and sparsity techniques to improve computational efficiency and reduce power consumption. Implemented adaptive precision control and sparse data processing mechanisms. Developed and validated using Verilog HDL and the Synopsys RTL-to-GDSII ASIC design flow.\n\nProject 2: AMBA AXI4-Lite Master and Slave Interface Design \u2013 Designed and implemented an AMBA AXI4-Lite compliant Master and Slave interface for memory-mapped communication using Verilog HDL. Developed and verified read/write transaction handling, address decoding, and control logic. Synthesized through the Synopsys RTL-to-GDSII ASIC flow.\n\nProject 3: SPI Protocol Controller Design \u2013 Designed and implemented an SPI controller using Verilog HDL for synchronous serial communication between master and slave devices. Successfully completed ASIC implementation using the Tiny Tapeout flow, generating and analyzing the final GDSII chip layout and 3D visualization.",
                "image": "varsha-v-r.jpg",
                "photoUrl": "varsha-v-r.jpg",
                "linkedin": "https://www.linkedin.com/in/varsha-ramesh-58840a338",
                "github": ""
            },
            {
                "id": 16,
                "name": "Winston Churchil",
                "registerNo": "24VL053",
                "rollno": "24VL053",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "churchilerd@gmail.com",
                "achievementTitle": "Projects & Development",
                "achievement": "Developing innovative web-based projects combining 3D visualization and AI technologies for career guidance and portfolio presentation.",
                "projectsOverview": "3d Portfolio websites and AI career roadmap generator web application",
                "description": "3D Portfolio Websites and AI Career Roadmap Generator Web Application \u2013 Developing interactive 3D portfolio websites and an AI-powered career roadmap generator web application that helps users visualize career paths and plan their professional development.",
                "image": "winston-churchil.jpg",
                "photoUrl": "winston-churchil.jpg",
                "linkedin": "https://www.linkedin.com/in/winstonchurchil21",
                "github": ""
            },
            {
                "id": 17,
                "name": "K.R.Nitin",
                "registerNo": "24VL025",
                "rollno": "24VL025",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "nithunithu2720@gmail.com",
                "achievementTitle": "Internships & Workshops",
                "achievement": "Completed various internships and workshops related to VLSI design and semiconductor technology.",
                "projectsOverview": "RTL-to-GDSII Design and Physical Implementation of a 16-bit Multiply-Accumulate Unit Using Synopsys",
                "description": "RTL-to-GDSII Design and Physical Implementation of a 16-bit Multiply-Accumulate Unit Using the Synopsys ASIC Design Flow \u2013 This project presents the design and physical implementation of a 16-bit Multiply-Accumulate (MAC) unit realized through a complete RTL-to-GDSII ASIC design flow using industry-standard Synopsys EDA tools. The MAC unit, described in synthesizable Verilog HDL, computes the product of two 16-bit operands and accumulates the result in a 32-bit register under the control of a four-state Moore finite-state machine (FSM). Functional correctness was verified using Synopsys VCS, and the design was synthesized with Synopsys Design Compiler.",
                "image": "k-r-nitin.jpg",
                "photoUrl": "k-r-nitin.jpg",
                "linkedin": "https://www.linkedin.com/in/nitin-nitin-63640b",
                "github": ""
            },
            {
                "id": 18,
                "name": "Sakthishree D",
                "registerNo": "24VL033",
                "rollno": "24VL033",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "sakthishree610@gmail.com",
                "achievementTitle": "Rank Holder & Certifications",
                "achievement": "Academic Excellence: 1st Semester \u2013 3rd Rank Holder; 2nd, 3rd & 4th Semester \u2013 1st Rank Holder.\n\nInternships:\n- Chip Crafts \u2013 VLSI Design Layout\n- Manfree \u2013 Embedded Systems\n- Career Ladder \u2013 OOPS in Java\n- Enthu Technologies \u2013 PCB Designing\n- SM AI MOJO Tech \u2013 System Verilog and Basics of Digital Electronics\n\nWorkshops:\n- Industrial IOT Using LORAWAN Technology\n- STM32 & Renesas-based Embedded System\n- Emboss in IOT (Arduino)\n- Digital Hardware Design and Implementation with Altera FPGA\n\nCertifications:\n- VLSI on Chip Design by Maven Silicon\n- RISC-V Processor RV321 Base ISA by Maven Silicon\n- Verilog HDL \u2013 Udemy\n- Static Timing Analysis \u2013 Udemy",
                "projectsOverview": "32 bit RISC V BASED ADAPTIVE PRECISION ACCELERATOR, Multi-GPU Architecture, BIST Controller",
                "description": "1. 32-bit RISC V BASED ADAPTIVE PRECISION ACCELERATOR using AMBA APB protocol\n2. Multi-GPU Architecture with Predictive Task Migration and Fault-Tolerant Resource Management\n3. Build In Self Test Controller For ALU Verification\n4. Communication Protocols \u2013 UART, SPI, MAC, BOOTH MULTIPLIER",
                "image": "sakthishree-d.jpg",
                "photoUrl": "sakthishree-d.jpg",
                "linkedin": "https://www.linkedin.com/in/sakthishree-d-746115339",
                "github": ""
            },
            {
                "id": 19,
                "name": "Kiruthika S",
                "registerNo": "24VL017",
                "rollno": "24VL017",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "kiruthika.shanmugam006@gmail.com",
                "achievementTitle": "Workshops & Internships",
                "achievement": "10-Day Cadence VLSI Design Workshop \u2013 Entuple Technologies\n2-Day IoT Workshop \u2013 KALAM 2025\n2-Day FPGA Workshop \u2013 Chip Crafts\n1-Month Top-Out Training\n\nInternship/Training Certificates from Career Ladder, Enthu Tech, Embuzz Technologies, Chip Crafts, Manfree Technologies, SM AI MOJO TECH, and Maven Silicon\n\nCGPA: 8.77",
                "projectsOverview": "Fault Controller for Medical Devices, Booth Multiplier, SPI, BIST, UART, AXI4-Lite, MAC Unit, CAN Protocol",
                "description": "1. Fault Controller for Medical Devices \u2013 Designed a safety-oriented controller to monitor critical system signals, detect faults, and automatically switch the system to a predefined safe state.\n2. Automatic Timetable Management System using Tcl \u2013 Developed an automated timetable management system using Tcl/Tk and database integration.\n3. Automatic Attendance Management System using Perl \u2013 Developed an automated attendance management system using Perl.\n4. Booth Multiplier \u2013 Designed an RTL-based Booth multiplier for efficient signed binary multiplication.\n5. Pipelined Digital Design \u2013 Designed a pipelined digital architecture by dividing computation into multiple stages using registers.\n6. SPI Protocol \u2013 Designed an RTL-based SPI communication interface for serial data transfer.\n7. BIST \u2013 Built-In Self-Test \u2013 Designed a BIST architecture for testing digital circuits using test-pattern generation and response analysis.\n8. UART Communication \u2013 Designed an RTL-based UART transmitter and receiver for asynchronous serial communication.\n9. AXI4-Lite Interface \u2013 Designed an AXI4-Lite interface for register-level read and write communication.\n10. MAC Unit \u2013 Designed a Multiply-Accumulate unit for digital signal-processing applications.\n11. CAN Protocol \u2013 Designed and studied a CAN communication module for reliable communication between multiple electronic control units.",
                "image": "kiruthika-s.jpg",
                "photoUrl": "kiruthika-s.jpg",
                "linkedin": "https://www.linkedin.com/in/kiruthika-shanmugam-5a6092330",
                "github": ""
            },
            {
                "id": 20,
                "name": "Roobashri S",
                "registerNo": "24VL032",
                "rollno": "24VL032",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "roobashrisenthilmurugan@gmail.com",
                "achievementTitle": "Workshops, Internships & Hackathons",
                "achievement": "Workshops:\n- PCB Design and Fabrication at KPR Institute of Engineering and Technology \u2013 March 14, 2025\n- VLSI TEST Workshop at PSG College of Technology \u2013 October 10\u201312, 2025\n- VLSI Design Flow from RTL to GDS at Chipxpert Technologies \u2013 November 1\u20132, 2025\n- Code to Chip: RTL to GDS flow using Synopsys tools at VLSI Minds \u2013 February 16\u201320, 2026\n- Digital Hardware Design with Altera (Intel) FPGAs at Chipcrafts \u2013 November 18\u201319, 2025\n\nInternships:\n- Chip Crafts \u2013 VLSI Layout Design (September 3\u201310, 2025)\n- Career Ladder \u2013 Programming Paradigm using Java (September 11\u201316, 2025)\n- EnthuTech \u2013 PCB Designing\n\nHackathon:\n- Bharat AI-Soc Student Challenge (January\u2013March 2026)",
                "projectsOverview": "Reconfigurable Neuromorphic Processor, STM32F446RE PCB Controller Board, Smart 3S BMS",
                "description": "1. A Reconfigurable Neuromorphic Processor with Dynamic Synaptic Adaptation for Energy-Efficient Edge AI using Synopsys \u2013 A reconfigurable neuromorphic processor that mimics brain-inspired neural processing using adaptive synaptic weights and neuron models for energy-efficient and low-latency edge AI processing.\n\n2. STM32F446RE PCB Controller Board \u2014 6-Axis Robotic Arm \u2013 Designed and developed a custom multilayer STM32F446RE controller PCB in Altium Designer for synchronized control of a 6-axis robotic arm. Integrated motor-control interfaces and CAN communication.\n\n3. Smart 3S BMS with AI-Based SOC/SOH Estimation (Ongoing) \u2013 A dual-MCU PCB (STM32F446RE + ESP32-WROOM-32) for 3S Li-ion battery management, combining real-time protection with AI-based state estimation. Designed in KiCad.",
                "image": "roobashri-s.jpg",
                "photoUrl": "roobashri-s.jpg",
                "linkedin": "https://www.linkedin.com/in/roobashri-senthilmurugan",
                "github": ""
            },
            {
                "id": 21,
                "name": "Soorya Velaa P",
                "registerNo": "24VL040",
                "rollno": "24VL040",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "suryavela9120@gmail.com",
                "achievementTitle": "Workshops, Training & NCC",
                "achievement": "Workshops:\n- 10-day Cadence Workshop\n- 2-day IOT Workshop (KALAM 2025)\n- 2-day Workshop on FPGA by Chip Crafts\n\nTraining Certificate:\n- 10-day Cadence Workshop by Entuple Technologies\n\nInternship Certificates:\n- Career Ladder\n- Enthu Tech\n- Embuzz Technologies\n- Chip Crafts\n- Manfree Technologies\n- SM AI MOJO TECH\n\nAchievements:\n- NCC CADET \u2013 B Certificate holder with A grade",
                "projectsOverview": "Booth multiplier, PIPELINE, SPI, MFCC Accelerator",
                "description": "Projects: Booth Multiplier, Pipeline Design, SPI Protocol, MFCC Accelerator",
                "image": "soorya-velaa-p.jpg",
                "photoUrl": "soorya-velaa-p.jpg",
                "linkedin": "https://www.linkedin.com/in/soorya-velaa",
                "github": ""
            },
            {
                "id": 22,
                "name": "SRI VATSAN P",
                "registerNo": "24VL041",
                "rollno": "24VL041",
                "universityNo": "714024169041",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "srivatsan132006@gmail.com",
                "achievementTitle": "Internships, Workshops & Certifications",
                "achievement": "Internships / Industrial Training:\n- Embuzz Technologies Pvt. Ltd. \u2013 Embedded Programming using Arduino\n- Chip Craft \u2013 VLSI Layout Design & FPGA Implementation\n- Manfree Technologies \u2013 Embedded Programming & 8086 Microprocessor\n- Enthu Technology \u2013 PCB Design using KiCad\n- Career Ladder \u2013 C Programming\n- SM MOJO TECH \u2013 Internship Training\n\nWorkshops & Training:\n- Hardware Design and Implementation with Altera (Intel) FPGAs\n- Synopsys ASIC Design Flow Training\n- Cadence VLSI Design and Verification Training\n\nHackathons:\n- 24-Hour Hackathon \u2013 RIT College\n\nCertifications:\n- Synopsys ASIC Design Flow Certification\n- Government SoC Project Certification\n- Digital Hardware & FPGA Implementation Certification\n- VLSI Layout Design Certification\n- Embedded Systems & Arduino Certification\n- SystemVerilog Training Certificate\n- Arduino Programming Certificate",
                "projectsOverview": "Configurable Dynamic Memory-Aware AXI4-Stream Sparse Matrix Acceleration Engine, DDR SDRAM Controller",
                "description": "1. Configurable Dynamic Memory-Aware AXI4-Stream Sparse Matrix Acceleration Engine \u2013 Design and implement a configurable sparse matrix acceleration engine using AXI4-Stream, dual-bank ping-pong memory, and adaptive clock gating for efficient data processing.\n\n2. DDR SDRAM Controller Using Synopsys \u2013 Design and implement a DDR SDRAM controller using Verilog HDL and Synopsys ASIC design tools for efficient memory access and control.\n\n3. AXI Bus Protocol Controller (AMBA Interface) \u2013 Design and implement an AXI-based bus protocol controller using SystemVerilog.\n\n4. QoS-Aware AXI4 Interconnect with Adaptive Arbitration \u2013 Design and implement a QoS-aware AXI4 interconnect using SystemVerilog.\n\n5. ECC-Based Self-Scrubbing SRAM Memory IP \u2013 Design an SRAM memory IP with Error Correcting Code (ECC) and self-scrubbing functionality.",
                "image": "sri-vatsan-p.jpg",
                "photoUrl": "sri-vatsan-p.jpg",
                "linkedin": "https://www.linkedin.com/in/sri-vatsan-84990a338",
                "github": ""
            },
            {
                "id": 23,
                "name": "Pratheep D",
                "registerNo": "24VL026",
                "rollno": "24VL026",
                "universityNo": "714024169026",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "pratheepdcbe@gmail.com",
                "achievementTitle": "Certifications & Training",
                "achievement": "- Completed MATLAB Onramp Certification\n- Participated in an Inter-College Cadence Workshop covering Verilog HDL, testbench development, logic gates, Half Adder design, Xcelium simulation, and code coverage\n- Completed training in RISC Processor Architecture\n- Completed Java training through Career Ladder\n- Participated in VLSI-related academic and technical activities\n- Developed and worked on VLSI/embedded projects involving Verilog, Arduino, MATLAB, Proteus, Quartus, Microwind, and Cadence tools",
                "projectsOverview": "RTL-to-GDSII Implementation of a Sparse Multi-Head Attention Accelerator for Transformer-Based Large Language Model Inference",
                "description": "RTL-to-GDSII Implementation of a Sparse Multi-Head Attention Accelerator for Transformer-Based Large Language Model Inference Using Cadence Flow \u2013 This project focuses on designing and implementing a hardware accelerator for sparse multi-head attention, an important computation used in Transformer-based AI and Large Language Models. The project aims to develop the design from RTL using SystemVerilog/Verilog through synthesis and physical design toward GDSII, using the Cadence design flow.\n\nObjectives:\n- Design the sparse attention architecture at RTL level\n- Implement modules for attention-score calculation, scaling, sparse masking, softmax approximation, and value multiplication\n- Verify the RTL functionality using simulation and testbenches\n- Perform RTL synthesis and physical design using Cadence tools\n- Study the complete RTL-to-GDSII implementation flow\n- Explore hardware architectures suitable for efficient and low-power AI acceleration",
                "image": "pratheep-d.jpg",
                "photoUrl": "pratheep-d.jpg",
                "linkedin": "https://www.linkedin.com/in/pratheep-vlsi",
                "github": ""
            },
            {
                "id": 24,
                "name": "PUGAZHENDHI S",
                "registerNo": "24VL028",
                "rollno": "24VL028",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "spugazhendhi2007@gmail.com",
                "achievementTitle": "Training & Internships",
                "achievement": "- Chip Design Using Cadence Tool Chain (RTL to GDSII) \u2013 Sri Shakthi Institute, on-campus training, July 2026\n- Back-End Design of Digital Logic Circuits Using Cadence \u2013 Chip to Start-Up, June 2026\n- VLSI Layout Design Internship \u2013 Chip Crafts, September 2025\n- Embedded Systems Internship \u2013 Manfree Technologies, October 2025\n- Digital Hardware Design & FPGA Workshop \u2013 Chip Crafts, November 2025\n- Programming Paradigms Using Java \u2013 Career Ladder, September 2025",
                "projectsOverview": "RISC-V Processor with External Memory, PPA Optimization of Hardware Accelerator, Low Power 8-bit ALU",
                "description": "1. RISC-V Processor with External Memory and INT8 Systolic Array Accelerator for Edge AI \u2013 Computer Architecture / ASIC Design\n2. PPA Optimization of a Hardware Accelerator for Real-Time Agricultural Drone Image Analysis \u2013 VLSI Design\n3. Low Power 8-bit ALU \u2013 RTL-to-GDSII, 90nm\n4. Serial Peripheral Interface (SPI) Controller \u2013 RTL-to-GDSII, 90nm\n5. Traffic Flow Controller \u2013 FSM / Digital Design\n6. 8:1 Multiplexer - Schematic to Layout \u2013 CMOS / VLSI Layout",
                "image": "pugazhendhi-s.jpg",
                "photoUrl": "pugazhendhi-s.jpg",
                "linkedin": "https://www.linkedin.com/in/s-pugazh-pugazhendhi-657907338",
                "github": ""
            },
            {
                "id": 25,
                "name": "Mohammed Ayman M",
                "registerNo": "24VL021",
                "rollno": "24VL021",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "mohammedayman4381@gmail.com",
                "achievementTitle": "Projects, Internships & Hackathons",
                "achievement": "- VLSI & Semiconductor Domain Projects \u2013 Developed and explored practical projects focused on VLSI, digital design, embedded systems, and semiconductor-oriented applications\n- VLSI Internship \u2013 SM AI Mojo Tech \u2013 Gained practical exposure to VLSI concepts, semiconductor design methodologies, digital logic, and industry-oriented workflows\n- SEMICON / Semiconductor Hackathon Participation \u2013 Worked on SEMIRESTORE-AI, an AI-assisted semiconductor inspection concept\n- AI + VLSI Project Development \u2013 Explored the integration of AI and Computer Vision with semiconductor inspection and manufacturing\n- Technical Workshops & Hands-on Learning \u2013 Participated in technical learning activities covering VLSI design, FPGA, digital systems, embedded systems, AI/ML",
                "projectsOverview": "SEMIRESTORE-AI: AI-Based Restoration of Degraded Images for Semiconductor Inspection",
                "description": "SEMIRESTORE-AI: AI-Based Restoration of Degraded Images for Semiconductor Inspection \u2013 An AI-driven semiconductor inspection solution designed to enhance degraded inspection images affected by noise, low resolution, and image-quality limitations. The system focuses on restoring important visual features and improving the quality of semiconductor images to support reliable defect identification and analysis.\n\nObjectives:\n- Develop an AI-based image restoration pipeline for degraded semiconductor inspection images\n- Reduce noise and improve image quality while preserving critical semiconductor features\n- Enhance edges, patterns, and structural information required for defect analysis\n- Explore Computer Vision and Deep Learning techniques for semiconductor inspection\n- Build a foundation for intelligent, automated, and scalable semiconductor inspection systems",
                "image": "mohammed-ayman-m.jpg",
                "photoUrl": "mohammed-ayman-m.jpg",
                "linkedin": "https://www.linkedin.com/in/mohammed-ayman-m",
                "github": ""
            },
            {
                "id": 26,
                "name": "S. Thirumurugan",
                "registerNo": "24VL050",
                "rollno": "24VL050",
                "universityNo": "714024169050",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "thirumurugans2945@gmail.com",
                "achievementTitle": "Internships, Training & Workshops",
                "achievement": "Internships, Training & Technical Programs:\n- Chip Crafts \u2013 VLSI Layout Internship\n- Embuzz Technologies \u2013 Arduino GPIO Programming\n- Career Ladder \u2013 Java Programming\n- ENTHU \u2013 Internship / Technical Training\n- Manfree \u2013 Internship / Technical Training\n- SM MOJO TECH \u2013 Internship / Technical Training\n\nWorkshops:\n- FPGA Altera Workshop \u2013 Chip Crafts\n- Synopsys EDA Tools Workshop\n- Cadence EDA Tools Workshop",
                "projectsOverview": "RISC-V CPU, Secure VPU, 8-bit ALU, Booth Multiplier, TCAM",
                "description": "1. RISC-V CPU \u2013 Design and develop a RISC-V processor using Verilog/SystemVerilog, with a focus on processor architecture, functional verification, and ASIC implementation.\n\n2. Secure VPU \u2013 Design a Secure Vector Processing Unit with parallel vector computation and hardware security mechanisms for secure processing and data protection.\n\n3. 8-bit ALU \u2013 Design an 8-bit Arithmetic Logic Unit capable of performing arithmetic and logical operations using synthesizable RTL.\n\n4. Booth Multiplier \u2013 Design a signed Booth Multiplier for efficient binary multiplication, focusing on arithmetic datapath design and ASIC synthesis.\n\n5. TCAM \u2013 Design a Ternary Content-Addressable Memory architecture that supports parallel pattern matching using binary and don't-care states.",
                "image": "s-thirumurugan.jpg",
                "photoUrl": "s-thirumurugan.jpg",
                "linkedin": "https://linkedin.com/in/thiru-murugan-264111339",
                "github": ""
            },
            {
                "id": 27,
                "name": "SANJEEV GH",
                "registerNo": "24VL034",
                "rollno": "24VL034",
                "universityNo": "",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "sanjeevgh27@gmail.com",
                "achievementTitle": "Internships & Technical Achievements",
                "achievement": "Internships:\n- ChipCrafts \u2013 VLSI Internship (Microwind, digital circuit design, layout implementation)\n- Manfree Technologies \u2013 Embedded Systems Internship\n- Enthu Technology \u2013 PCB Design & Assembly Internship\n- Career Ladder \u2013 Java Internship\n- SM AI MOJO TECH \u2013 SystemVerilog Internship\n\nTechnical Achievements:\n- Completed 53+ VLSI projects using industry-standard tools including Synopsys and Cadence\n- Completed 3 industry-level VLSI projects with complete ASIC design flow\n- Developed BatterySense X \u2013 achieved 91.94% core utilization, zero DRC violations, and 0.0000 WNS after CTS optimization\n- Presented BatterySense X at department-level HR Conclave\n- Developed multiple Embedded Systems projects using Arduino, sensors, relays, motors\n- Developed ECG Signal Power-Line Noise Removal system using MATLAB\n- Worked on SpaceEdgeX exploring AI, edge computing, hardware acceleration, and space-based computing",
                "projectsOverview": "BatterySense X \u2013 Intelligent Battery Sensing & Health Monitoring ASIC, ECG Signal Power-Line Noise Removal",
                "description": "1. BatterySense X \u2013 Intelligent Battery Sensing & Health Monitoring ASIC: An ASIC design project focused on battery sensing and health monitoring, implemented through the VLSI design flow from RTL to GDSII. Achieved 91.94% core utilization, generated GDSII, zero DRC violations.\n\n2. ECG Signal Power-Line Noise Removal: A MATLAB-based DSP project using a notch filter to remove power-line noise from ECG signals.\n\n3. SpaceEdgeX: An innovative concept exploring AI, edge computing, hardware acceleration, and space-based computing for next-generation applications.\n\n4. Embedded Systems Projects: Multiple hardware-based projects developed using Arduino, sensors, relays, motors, and other electronic components.",
                "image": "sanjeev-gh.jpg",
                "photoUrl": "sanjeev-gh.jpg",
                "linkedin": "https://linkedin.com/in/sanjeevgh",
                "github": ""
            },
            {
                "id": 28,
                "name": "Santhosh Kumar S",
                "registerNo": "24VL037",
                "rollno": "24VL037",
                "universityNo": "714024169037",
                "programme": "B.E. VLSI Design and Technology",
                "year": "III Year",
                "batch": "2024 - 2028",
                "email": "santosh2005th@gmail.com",
                "achievementTitle": "Hackathons, Internships & Certifications",
                "achievement": "- 2nd Place \u2013 Cognicode Hackathon, NEXUS 2K26, GCT, Coimbatore\n- Participant \u2013 NeuraNexus 2K25, KPR Institute of Engineering and Technology\n- Participant \u2013 Hack Nexus 2025, Sri Ramakrishna College of Arts & Science\n- Embedded Systems Internship \u2013 Manfree Technologies\n- VLSI Layout Design Internship \u2013 Chip Crafts\n- Industrial Training in Java \u2013 Career Ladder\n- Custom IC Design using Cadence EDA Tools \u2013 Entuple Technologies\n- Digital Hardware Design with Altera (Intel) FPGAs \u2013 Chip Crafts\n- Java (Basic) Certification \u2013 HackerRank",
                "projectsOverview": "EventLens AI, SGPA / CGPA Calculator Web App, Health Buddy \u2013 AI-Driven Public Health Chatbot",
                "description": "1. EventLens AI \u2013 Selfie-Based Event Photo Finder: An AI-powered platform that uses FaceNet and facial recognition to find a user's photos from large event galleries using a single selfie. Built with Next.js, FastAPI, PyTorch and OpenCV.\n\n2. SGPA / CGPA Calculator Web App: A student-focused web application for calculating SGPA and CGPA, with secure login and saved semester history. Developed as a major project and deployed as a live web application.\n\n3. Health Buddy \u2013 AI-Driven Public Health Chatbot: An AI-based chatbot designed for public health and disease awareness. The project was developed as an innovation/research project and presented as a paper at ICIES 2025.",
                "image": "santhosh-kumar-s.jpg",
                "photoUrl": "santhosh-kumar-s.jpg",
                "linkedin": "https://www.linkedin.com/in/santhosh-kumar-a76796304",
                "github": ""
            }
        ]
    };
}
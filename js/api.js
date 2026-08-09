// js/api.js — Centralized API utility for Google Apps Script communication
// Department of VLSI Design and Technology, SIET

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxtiC0y8Gwzr0gj5Mcb1wJaSogr44lWI2PlYQQOVj-wbTOKw2EyJmXvhnibGlRr7Idc/exec";

const API_CACHE_PREFIX = "vlsi_api_";
const API_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch data from the Apps Script API with optional action parameter.
 * Uses sessionStorage caching to avoid redundant calls.
 * @param {string} [action] - Optional action parameter (e.g., 'faculty', 'hod', 'students')
 * @returns {Promise<Object>} The API response data
 */
async function fetchWithAction(action) {
    const cacheKey = API_CACHE_PREFIX + (action || "all");

    // Direct file opens should not depend on a network API round-trip.
    if (typeof window !== "undefined" && window.location && window.location.protocol === "file:") {
        return getFallbackData();
    }

    // Check sessionStorage cache
    try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < API_CACHE_TTL) {
                return data;
            }
            sessionStorage.removeItem(cacheKey);
        }
    } catch (e) { /* sessionStorage not available, continue */ }

    // Build URL with action parameter
    let url = APPS_SCRIPT_URL;
    if (action) {
        url += (url.includes("?") ? "&" : "?") + "action=" + encodeURIComponent(action);
    }

    // Retry logic (max 2 attempts)
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, {
                method: "GET",
                redirect: "follow",
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseErr) {
                console.warn("[API] Response is not valid JSON. Using fallback data.", parseErr);
                return getFallbackData();
            }

            // Cache the successful response
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    data: data,
                    timestamp: Date.now()
                }));
            } catch (e) { /* ignore storage errors */ }

            return data;

        } catch (error) {
            console.warn(`[API] Attempt ${attempt + 1} failed:`, error.message);
            if (attempt === 1) {
                console.warn("[API] All attempts failed. Using fallback data.");
                return getFallbackData();
            }
            // Wait 1s before retry
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    return getFallbackData();
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
    if (!Array.isArray(source.students)) return source;

    return Object.assign({}, source, {
        students: source.students.map(student => {
            const registerNo = student.registerNo || student.rollno || "";
            const image = student.image || student.photoUrl || "";

            return Object.assign({
                achievement: "",
                description: "",
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
    if (text.includes("I")) return "I";
    return "";
}

function getBatchFromRegisterNo(registerNo) {
    const match = String(registerNo || "").match(/^(\d{2})/);
    return match ? "20" + match[1] : "";
}

/**
 * Clear all API caches
 */
function clearApiCache() {
    try {
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith(API_CACHE_PREFIX)) {
                sessionStorage.removeItem(key);
            }
        });
    } catch (e) { /* ignore */ }
}

/**
 * Fallback data used when the API is unreachable or returns invalid data.
 * This ensures the website always displays content.
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
            photoUrl: "assets/images/faculty/dhilipkumar.jpg"
        },
        faculty: [
            { id: 1, name: "Dr. P. Dhilipkumar", designation: "Associate Professor & Head", qualification: "M.E., Ph.D.", specialization: "VLSI Design and Technology", email: "dhilipkumarece@siet.ac.in", orcid: "", image: "assets/images/faculty/dhilipkumar.jpg", photoUrl: "assets/images/faculty/dhilipkumar.jpg" },
            { id: 2, name: "Mrs. C. Prema", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Premacece@siet.ac.in", orcid: "", image: "assets/images/faculty/prema.jpg", photoUrl: "assets/images/faculty/prema.jpg" },
            { id: 3, name: "Mrs. P. Priscillasophia", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Priscillasophiaece@siet.ac.in", orcid: "", image: "assets/images/faculty/priscillasophia.jpg", photoUrl: "assets/images/faculty/priscillasophia.jpg" },
            { id: 4, name: "Mrs. T. Renita Pearlin", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Trenitacdc@siet.ac.in", orcid: "", image: "assets/images/faculty/renita.jpg", photoUrl: "assets/images/faculty/renita.jpg" },
            { id: 5, name: "Mrs. R. Vasanthi", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Vasanthiece@siet.ac.in", orcid: "", image: "assets/images/faculty/vasanthi.jpg", photoUrl: "assets/images/faculty/vasanthi.jpg" }
        ],
        students: [
            {
                id: 1,
                name: "Gokul P",
                registerNo: "24VL008",
                year: "III Year",
                email: "psivam574@gmail.com",
                achievement: "1. Attendance Monitoring System\n\nAchievement:\n\nDeveloped AI Attendance Monitoring System\n2. Money Management System\n\nAchievement:\n\nBuilt Money Management System\n3. Internships\n\nAchievement:\n\nCompleted 6 Industry Internships\n4. Technical Skills\n\nAchievement:\n\nDeveloped Strong VLSI & Software Skills",
                description: "Designed and deployed a web-based attendance management system with real-time tracking, advisor dashboard, and automated reports. Created a web application for expense tracking, budget planning, and monthly financial reports. Gained hands-on experience in VLSI, Digital Hardware Design, SystemVerilog, PCB Design, Embedded Systems, Python, and OOP. Built expertise in SystemVerilog, Digital Hardware Design, Python, Web Development, and GitHub through projects and internships.",
                image: "assets/images/students/gokul.jpg",
                linkedin: "GOKUL P",
                github: "https://github.com/elephantgokul"
            },
            {
                id: 2,
                name: "Tharun R",
                registerNo: "24VL048",
                year: "III Year",
                email: "rajeshtharun2318@gmail.com",
                achievement: "Attended 6 internships\n2-days offline workshop at IIT Madras\n5-days offline workshop at college for Hands-On training on Synopsys\n2-days Hands-On workshop on Digital Hardware Implementation with Altera(Intel) FPGAs\nStudent Presenter at PCB LAB on Tech Park Inaugural event.\n3 real time projects using Synopsys and 4 working on...\nB.A in HINDI (Completed 8 MADRAS PRACHAR SABHA EXAMS)",
                description: "6 technical internships in areas such as VLSI Design, Embedded Systems, PCB Design, and software technologies, gaining practical industry exposure. Participated in a 2-day offline workshop at IIT Madras, a 5-day hands-on training program on Synopsys EDA tools, and a 2-day workshop on Digital Hardware Implementation using Altera (Intel) FPGAs. Served as a Student Presenter at the PCB LAB Tech Park Inaugural Event, showcasing technical knowledge and project skills. Completed 3 real-time VLSI projects using Synopsys tools and currently working on 4 additional projects to enhance design and verification expertise. Additionally, completed 8 examinations under Madras Prachar Sabha for Hindi proficiency, demonstrating dedication towards language learning and continuous skill development.",
                image: "assets/images/students/tharunrajesh.jpg",
                linkedin: "https://linkedin.com/in/Tharun Rajesh",
                github: ""
            }
        ]
    };
}

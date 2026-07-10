// js/api.js — Centralized API utility for Google Apps Script communication
// Department of VLSI Design and Technology, SIET

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbypPWlc7QRVgFBvG2vzNGYfUFkXqUpk9UXfHx9WEa2o_1FjUNtDC4JYXBW2zNCkJ6Ek/exec";

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
    return fetchWithAction(null);
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
            name: "Dr. A. Sharma",
            designation: "Head of Department",
            qualification: "M.Tech, Ph.D. (VLSI Design)",
            message: "Welcome to the Department of VLSI Design and Technology at Sri Shakthi Institute of Engineering and Technology. Our department is committed to excellence in education and research in the fields of VLSI, Embedded Systems, and Nanotechnology. We believe in a hands-on, industry-aligned approach that ensures our students are prepared to meet the challenges of the rapidly evolving semiconductor industry. Our state-of-the-art laboratories, experienced faculty, and strong industry partnerships provide an ideal environment for learning and innovation.",
            contact: "hod.vlsi@sfriet.ac.in",
            phone: "+91-422-XXXXXXX",
            researchInterests: ["Low Power VLSI Design", "Nanoelectronics", "Mixed Signal IC Design", "System-on-Chip Architecture"],
            photoUrl: ""
        },
        faculty: [
            { id: 1, name: "Dr. B. Kumar", designation: "Professor", qualification: "Ph.D. (VLSI Design)", specialization: "VLSI Design, Digital IC", email: "bkumar@sfriet.ac.in", orcid: "0000-0001-2345-6789", photoUrl: "" },
            { id: 2, name: "Dr. C. Verma", designation: "Associate Professor", qualification: "Ph.D. (Embedded Systems)", specialization: "Embedded Systems, ARM Architecture", email: "cverma@sfriet.ac.in", orcid: "0000-0002-3456-7890", photoUrl: "" },
            { id: 3, name: "Mr. D. Singh", designation: "Assistant Professor", qualification: "M.Tech (Signal Processing)", specialization: "Signal Processing, DSP", email: "dsingh@sfriet.ac.in", orcid: "", photoUrl: "" },
            { id: 4, name: "Ms. E. Reddy", designation: "Assistant Professor", qualification: "M.Tech (Communication)", specialization: "RF & Antenna, Microwave", email: "ereddy@sfriet.ac.in", orcid: "", photoUrl: "" },
            { id: 5, name: "Dr. F. Khan", designation: "Professor", qualification: "Ph.D. (IoT)", specialization: "IoT & Networks, Wireless Sensor Networks", email: "fkhan@sfriet.ac.in", orcid: "0000-0003-4567-8901", photoUrl: "" },
            { id: 6, name: "Dr. G. Patel", designation: "Assistant Professor", qualification: "Ph.D. (VLSI)", specialization: "VLSI Design, FPGA Implementation", email: "gpatel@sfriet.ac.in", orcid: "0000-0004-5678-9012", photoUrl: "" }
        ],
        students: [
            { id: 1, name: "Aarav Patel", batch: "2024", year: "IV", rollno: "VLSI001", email: "aarav.p@sfriet.ac.in", photoUrl: "" },
            { id: 2, name: "Diya Sharma", batch: "2024", year: "IV", rollno: "VLSI002", email: "diya.s@sfriet.ac.in", photoUrl: "" },
            { id: 3, name: "Vihaan Kumar", batch: "2025", year: "III", rollno: "VLSI035", email: "vihaan.k@sfriet.ac.in", photoUrl: "" },
            { id: 4, name: "Myra Singh", batch: "2025", year: "III", rollno: "VLSI036", email: "myra.s@sfriet.ac.in", photoUrl: "" },
            { id: 5, name: "Kabir Verma", batch: "2026", year: "II", rollno: "VLSI080", email: "kabir.v@sfriet.ac.in", photoUrl: "" },
            { id: 6, name: "Ananya Reddy", batch: "2026", year: "II", rollno: "VLSI081", email: "ananya.r@sfriet.ac.in", photoUrl: "" },
            { id: 7, name: "Arjun Das", batch: "2027", year: "I", rollno: "VLSI120", email: "arjun.d@sfriet.ac.in", photoUrl: "" }
        ]
    };
}

var siteData = (function() {

  function normalizeStudents(students) {
    return (students || []).map(function(student) {
      var registerNo = student.registerNo || student.rollno || "";
      var image = student.image || student.photoUrl || "";
      return Object.assign({}, student, {
        achievement: student.achievement || "",
        description: student.description || "",
        linkedin: student.linkedin || "",
        github: student.github || "",
        registerNo: registerNo,
        rollno: student.rollno || registerNo,
        image: image,
        photoUrl: student.photoUrl || image,
        batch: student.batch || getBatchFromRegisterNo(registerNo),
        yearToken: getStudentYearToken(student.year)
      });
    });
  }

  function getStudentYearToken(year) {
    var text = String(year || "").toUpperCase();
    if (text.indexOf("IV") !== -1) return "IV";
    if (text.indexOf("III") !== -1) return "III";
    if (text.indexOf("II") !== -1) return "II";
    if (text.indexOf("I") !== -1) return "I";
    return "";
  }

  function getBatchFromRegisterNo(registerNo) {
    var match = String(registerNo || "").match(/^(\d{2})/);
    return match ? "20" + match[1] : "";
  }

  var data = {
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
      { id: 1, name: "Dr. P. Dhilipkumar", designation: "Associate Professor & Head", qualification: "M.E., Ph.D.", specialization: "VLSI Design and Technology", email: "dhilipkumarece@siet.ac.in", orcid: "", image: "assets/images/staff/dhilipkumar.jpg", photoUrl: "assets/images/staff/dhilipkumar.jpg" },
      { id: 2, name: "Mrs. C. Prema", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Premacece@siet.ac.in", orcid: "", image: "assets/images/staff/prema.jpg", photoUrl: "assets/images/staff/prema.jpg" },
      { id: 3, name: "Mrs. P. Priscillasophia", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Priscillasophiaece@siet.ac.in", orcid: "", image: "assets/images/staff/priscillasophia.jpg", photoUrl: "assets/images/staff/priscillasophia.jpg" },
      { id: 4, name: "Mrs. T. Renita Pearlin", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Trenitacdc@siet.ac.in", orcid: "", image: "assets/images/staff/renita.jpg", photoUrl: "assets/images/staff/renita.jpg" },
      { id: 5, name: "Mrs. R. Vasanthi", designation: "Assistant Professor", qualification: "M.E.", specialization: "VLSI Design and Technology", email: "Vasanthiece@siet.ac.in", orcid: "", image: "assets/images/staff/vasanthi.jpg", photoUrl: "assets/images/staff/vasanthi.jpg" }
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

  data.students = normalizeStudents(data.students);

  return {
    hod: data.hod,
    faculty: data.faculty,
    students: data.students
  };
})();
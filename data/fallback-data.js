// data/fallback-data.js - Authoritative static fallback data for SIET VLSI website
// Used strictly as a fallback when Supabase connection fails.

(function (window) {
  'use strict';

  var FALLBACK_DATA = {
    hod: {
      id: 1,
      name: "Dr. P. Dhilipkumar",
      designation: "Associate Professor & Head",
      qualification: "M.E., Ph.D.",
      department: "Department of Electronics Engineering (VLSI Design and Technology)",
      message: "Welcome to the Department of Electronics Engineering (VLSI Design and Technology) at Sri Shakthi Institute of Engineering and Technology. Established in 2024, our department is committed to building strong fundamentals in digital electronics, semiconductor devices, VLSI architecture, RTL design, verification, and physical design.",
      contact: "dhilipkumarece@siet.ac.in",
      phone: "+91 96295 61731",
      researchInterests: ["VLSI Design", "Embedded Systems", "Semiconductor Design"],
      photoUrl: "dhilipkumar.jpg",
      image: "dhilipkumar.jpg"
    },
    faculty: [
      {
        id: 1,
        name: "Dr. P. Dhilipkumar",
        designation: "Associate Professor & Head",
        qualification: "M.E., Ph.D.",
        department: "EE – VLSI Design and Technology",
        specialization: "VLSI Design and Technology",
        email: "dhilipkumarece@siet.ac.in",
        orcid: "",
        image: "dhilipkumar.jpg",
        photoUrl: "dhilipkumar.jpg",
        bio: "Leading the Department of Electronics Engineering – VLSI Design and Technology. Experienced in curriculum development aligned with semiconductor industry demands, ASIC design methodologies, and coordinating C2S MeitY initiatives."
      },
      {
        id: 2,
        name: "Mrs. T. Renita Pearlin",
        designation: "Assistant Professor",
        qualification: "M.E.",
        department: "EE – VLSI Design and Technology",
        specialization: "VLSI Design and Technology",
        email: "Trenitacdc@siet.ac.in",
        orcid: "",
        image: "renita.jpg",
        photoUrl: "renita.jpg",
        bio: "Specializing in digital VLSI systems, low-power design, and EDA tool implementation. Actively mentoring students in RTL synthesis and verification."
      },
      {
        id: 3,
        name: "Mrs. Priscilla Sophia",
        designation: "Assistant Professor",
        qualification: "M.E.",
        department: "EE – VLSI Design and Technology",
        specialization: "VLSI Design and Technology",
        email: "Priscillasophiaece@siet.ac.in",
        orcid: "",
        image: "priscillasophia.jpg",
        photoUrl: "priscillasophia.jpg",
        bio: "Staff Coordinator for departmental technical challenges including THE LOST SILICON. Focuses on digital electronics, hardware debugging, and integrated circuits."
      },
      {
        id: 4,
        name: "Mrs. C. Prema",
        designation: "Assistant Professor",
        qualification: "M.E.",
        department: "EE – VLSI Design and Technology",
        specialization: "VLSI Design and Technology",
        email: "Premacece@siet.ac.in",
        orcid: "",
        image: "prema.jpg",
        photoUrl: "prema.jpg",
        bio: "Mentoring students in ASIC design methodologies, front-end design, and digital system verification with industry-standard EDA tools."
      },
      {
        id: 5,
        name: "Mrs. Vasanthi",
        designation: "Assistant Professor",
        qualification: "M.E.",
        department: "EE – VLSI Design and Technology",
        specialization: "VLSI Design and Technology",
        email: "Vasanthiece@siet.ac.in",
        orcid: "",
        image: "vasanthi.jpg",
        photoUrl: "vasanthi.jpg",
        bio: "Specializing in semiconductor devices, microelectronics, and hands-on laboratory experimentation in VLSI circuits."
      }
    ],
    students: [
      {
        id: 1,
        name: "Harini D",
        programme: "B.E. EE (VDT)",
        year: "III Year",
        batch: "2024 - 2028",
        achievementTitle: "Industrial Training & Workshop Certification in VLSI",
        achievement: "Designed and implemented a High-Speed AMBA AXI4 Interconnect for SoC applications covering RTL design in Verilog HDL and complete ASIC physical design flow using Synopsys tools (VCS, Design Compiler, IC Compiler II, PrimeTime, and Verdi).\n\nCompleted technical trainings in VLSI Layout Design, Altera FPGA at Chip Craft, PCB design at Enthutech, and Verilog HDL at SM AI Mojo Tech.",
        projectsOverview: "High-Speed AMBA AXI4 Interconnect for SoC; FPGA Implementation",
        description: "High-Speed AMBA AXI4 Interconnect for SoC; FPGA Implementation",
        image: "harini-d.jpg",
        photoUrl: "harini-d.jpg",
        linkedin: "",
        github: ""
      },
      {
        id: 2,
        name: "Tharun M",
        programme: "B.E. VLSI Design and Technology",
        year: "III Year",
        batch: "2024 - 2028",
        achievementTitle: "Industrial Training, Internships & VLSI Projects",
        achievement: "Completed VLSI Layout Design Internship, Verilog HDL & SystemVerilog Internship with RTL design exposure, PCB Design using KiCad, and Embedded Systems Internship with Arduino.\n\nDeveloped technical projects including: 16-bit RISC Processor, UART Controller, and 6T SRAM Cell.",
        projectsOverview: "16-bit RISC Processor, UART Controller, 6T SRAM Cell",
        description: "16-bit RISC Processor, UART Controller, 6T SRAM Cell",
        image: "tharun-m.jpg",
        photoUrl: "tharun-m.jpg",
        linkedin: "https://www.linkedin.com/in/tharun-m-a88691413",
        github: ""
      }
    ]
  };

  window.DEPT_FALLBACK_DATA = FALLBACK_DATA;
})(typeof window !== 'undefined' ? window : this);

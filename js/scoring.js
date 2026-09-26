// js/scoring.js — Project-Based Points & Leaderboard Scoring Engine
// Department of VLSI Design and Technology, SIET
// This file contains structured project data, category definitions,
// and scoring logic for the VLSI Student Leaderboard.

(function (window) {
  'use strict';

  /* =========================================================================
     1. PROJECT CATEGORY DEFINITIONS & POINT VALUES
     ========================================================================= */
  var PROJECT_CATEGORIES = {
    'basic':        { label: 'Basic Academic',            points: 10, color: '#6b7280' },
    'hardware':     { label: 'Hardware / Embedded',       points: 15, color: '#d97706' },
    'fpga':         { label: 'FPGA Implementation',       points: 20, color: '#059669' },
    'rtl':          { label: 'RTL / Verilog / SV',        points: 25, color: '#7c3aed' },
    'verification': { label: 'Verification',              points: 25, color: '#2563eb' },
    'asic':         { label: 'ASIC / VLSI Design',        points: 30, color: '#dc2626' },
    'rtl-to-gdsii': { label: 'RTL-to-GDSII',             points: 40, color: '#be185d' },
    'silicon':      { label: 'Silicon / Real Hardware',   points: 45, color: '#b45309' },
    'software':     { label: 'Software / Web / AI',       points: 10, color: '#0891b2' }
  };

  var QUALITY_BONUSES = {
    'working-demo':    { label: 'Working Hardware/Demo',       points: 5 },
    'simulation':      { label: 'Simulation/Verification',     points: 5 },
    'github':          { label: 'GitHub/Source Code',           points: 3 },
    'documentation':   { label: 'Technical Documentation',     points: 3 },
    'presentation':    { label: 'Project Presentation/Demo',   points: 2 },
    'publication':     { label: 'Published Paper/Patent',      points: 10 }
  };

  var ACHIEVEMENT_POINTS = {
    'internship':   5,
    'workshop':     3,
    'hackathon':    8,
    'certification': 4,
    'paper':        10,
    'rank-holder':  10,
    'ncc':          5
  };

  /* =========================================================================
     2. STRUCTURED PROJECT DATA PER STUDENT (by rollNo)
     ========================================================================= */
  var STUDENT_PROJECTS = {
    // ---- Original 10 students ----
    '24VL009': [ // Harini D
      { title: 'High-Speed AMBA AXI4 Interconnect for SoC', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'Designed and implemented a High-Speed AMBA AXI4 Interconnect for SoC applications covering RTL design and complete ASIC physical design flow using Synopsys tools.' },
      { title: 'FPGA Implementation', category: 'fpga', bonuses: [], description: 'Digital Hardware Implementation with Altera (Intel) FPGA.' }
    ],
    '24VL047': [ // Tharun M
      { title: '16-bit RISC Processor', category: 'rtl', bonuses: ['simulation'], description: 'Designed a 16-bit RISC Processor using Verilog HDL.' },
      { title: 'UART Controller', category: 'rtl', bonuses: ['simulation'], description: 'Implemented UART serial communication controller.' },
      { title: '6T SRAM Cell', category: 'asic', bonuses: [], description: 'Designed a 6-Transistor Static RAM memory cell.' }
    ],
    '24VL024': [ // Nithikkannan J S
      { title: 'Custom IC Design using Cadence EDA Tools', category: 'asic', bonuses: ['simulation'], description: 'Custom IC Design Mastery using Cadence EDA Tools.' },
      { title: 'VLSI Layout Design', category: 'asic', bonuses: [], description: 'VLSI Layout Design with Chip Crafts.' }
    ],
    '24VL045': [ // Suman
      { title: 'Cadence ASIC Design', category: 'asic', bonuses: [], description: 'ASIC Design project during 15-day Cadence Workshop.' }
    ],
    '24VL003': [ // Anand K
      { title: 'RTL-to-Gate-Level Synthesis Flow', category: 'rtl', bonuses: ['simulation'], description: 'RTL translation, optimization, and technology mapping flow.' },
      { title: 'Static Timing Analysis', category: 'verification', bonuses: ['documentation'], description: 'Setup time, hold time, timing constraints, and timing violation analysis.' }
    ],
    '24VL051': [ // Udhaya R
      { title: 'DDR Controller', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'DDR Memory Controller implemented through RTL-to-GDSII flow using Synopsys.' },
      { title: 'Mini RISC-V Processor', category: 'rtl', bonuses: ['simulation'], description: 'Mini RISC-V Processor Core design.' }
    ],
    '24VL049': [ // Tharum R.M
      { title: 'NoC Router', category: 'rtl', bonuses: ['simulation'], description: 'Network-on-Chip Router design.' },
      { title: 'AMBA APB Controller', category: 'rtl', bonuses: ['simulation'], description: 'AMBA APB Bus Protocol Controller.' },
      { title: 'Systolic AI Accelerator', category: 'asic', bonuses: ['simulation'], description: 'AI Accelerator / Matrix Multiplication Processing Unit using systolic-array architecture.' },
      { title: 'Automotive ADAS Processing Unit', category: 'asic', bonuses: [], description: 'Automotive Advanced Driver Assistance System Processing Unit.' }
    ],
    '24VL048': [ // Tharun R
      { title: 'Real-time Synopsys VLSI Architectures', category: 'rtl-to-gdsii', bonuses: ['simulation', 'presentation'], description: '3 real-time VLSI projects using Synopsys EDA tools.' },
      { title: 'Digital FPGA Hardware', category: 'fpga', bonuses: ['working-demo'], description: 'Digital Hardware Implementation using Altera (Intel) FPGAs.' }
    ],
    '24VL014': [ // Kamalesh VK
      { title: 'IoT & Embedded VLSI RTL Subsystems', category: 'hardware', bonuses: [], description: 'IoT and Embedded VLSI RTL Subsystems development.' }
    ],
    '24VL008': [ // Gokul P
      { title: 'AI Attendance Monitoring System', category: 'software', bonuses: ['working-demo', 'github'], description: 'Designed and deployed a web-based attendance management system with real-time tracking.' },
      { title: 'Money Management System', category: 'software', bonuses: ['working-demo', 'github'], description: 'Web application for expense tracking, budget planning, and monthly financial reports.' },
      { title: 'SIET VLSI Department Portal', category: 'software', bonuses: ['working-demo', 'github'], description: 'Built the VLSI Department website with student profiles, leaderboard, and gallery.' }
    ],

    // ---- New 18 students ----
    '24VL036': [ // SANKAMES VS
      { title: 'Digital Clock Simulation', category: 'basic', bonuses: ['simulation'], description: 'Designed and developed a digital clock system displaying hours, minutes, and seconds accurately.' }
    ],
    '24VL029': [ // V T RAGHUL VASUN
      { title: '8-bit ALU', category: 'rtl', bonuses: ['simulation'], description: 'Design an 8-bit Arithmetic Logic Unit capable of performing arithmetic and logical operations using synthesizable RTL.' },
      { title: 'Booth Multiplier', category: 'rtl', bonuses: ['simulation'], description: 'Design a signed Booth Multiplier for efficient binary multiplication.' },
      { title: 'TCAM', category: 'rtl', bonuses: ['simulation'], description: 'Ternary Content-Addressable Memory for parallel pattern matching.' }
    ],
    '24VL016': [ // Kavya M — no projects listed
    ],
    '24VL043': [ // Subhashini N
      { title: 'Low-Power Edge-AI Safety Monitoring SoC', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'RTL-to-GDSII Implementation of a Low-Power Edge-AI Safety Monitoring SoC for Real-Time Emergency Detection Using Synopsys ASIC Flow.' },
      { title: 'Edge-AI SoC for ADAS', category: 'asic', bonuses: [], description: 'Design and FPGA/ASIC Implementation of an Edge-AI SoC for Advanced Driver Assistance Systems (Group Project).' }
    ],
    '24VL052': [ // Varsha V R
      { title: 'Adaptive Dynamic-Precision Sparse Neural Network Accelerator', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'Designed a neural network accelerator utilizing dynamic precision scaling and sparsity techniques. Developed using Verilog HDL and the Synopsys RTL-to-GDSII ASIC design flow.' },
      { title: 'AMBA AXI4-Lite Master and Slave Interface', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'Designed AMBA AXI4-Lite compliant Master and Slave interface. Synthesized through the Synopsys RTL-to-GDSII ASIC flow.' },
      { title: 'SPI Protocol Controller', category: 'silicon', bonuses: ['simulation', 'working-demo'], description: 'SPI controller using Verilog HDL. Completed ASIC implementation using the Tiny Tapeout flow, generating final GDSII chip layout and 3D visualization.' }
    ],
    '24VL053': [ // Winston Churchil
      { title: '3D Portfolio Website', category: 'software', bonuses: ['working-demo'], description: '3D interactive portfolio website.' },
      { title: 'AI Career Roadmap Generator', category: 'software', bonuses: ['working-demo'], description: 'AI-powered career roadmap generator web application.' }
    ],
    '24VL025': [ // K.R.Nitin
      { title: '16-bit Multiply-Accumulate Unit', category: 'rtl-to-gdsii', bonuses: ['simulation', 'documentation'], description: 'RTL-to-GDSII Design and Physical Implementation of a 16-bit MAC unit using Synopsys ASIC Design Flow with Moore FSM control.' }
    ],
    '24VL033': [ // Sakthishree D
      { title: '32-bit RISC-V Adaptive Precision Accelerator', category: 'asic', bonuses: ['simulation'], description: '32-bit RISC V BASED ADAPTIVE PRECISION ACCELERATOR using AMBA APB protocol.' },
      { title: 'Multi-GPU Architecture', category: 'asic', bonuses: ['simulation'], description: 'Multi-GPU Architecture with Predictive Task Migration and Fault-Tolerant Resource Management.' },
      { title: 'BIST Controller for ALU', category: 'verification', bonuses: ['simulation'], description: 'Build In Self Test Controller For ALU Verification.' },
      { title: 'Communication Protocols', category: 'rtl', bonuses: ['simulation'], description: 'UART, SPI, MAC, BOOTH MULTIPLIER communication protocols implementation.' }
    ],
    '24VL017': [ // Kiruthika S
      { title: 'Fault Controller for Medical Devices', category: 'rtl', bonuses: ['simulation'], description: 'Safety-oriented controller to monitor critical system signals, detect faults, and automatically switch to safe state.' },
      { title: 'Booth Multiplier', category: 'rtl', bonuses: ['simulation'], description: 'RTL-based Booth multiplier for efficient signed binary multiplication.' },
      { title: 'SPI Protocol', category: 'rtl', bonuses: ['simulation'], description: 'RTL-based SPI communication interface for serial data transfer.' },
      { title: 'BIST – Built-In Self-Test', category: 'verification', bonuses: ['simulation'], description: 'BIST architecture for testing digital circuits using test-pattern generation and response analysis.' },
      { title: 'UART Communication', category: 'rtl', bonuses: ['simulation'], description: 'RTL-based UART transmitter and receiver for asynchronous serial communication.' },
      { title: 'AXI4-Lite Interface', category: 'rtl', bonuses: ['simulation'], description: 'AXI4-Lite interface for register-level read and write communication.' },
      { title: 'MAC Unit', category: 'rtl', bonuses: ['simulation'], description: 'Multiply-Accumulate unit for digital signal-processing applications.' },
      { title: 'CAN Protocol', category: 'rtl', bonuses: ['simulation'], description: 'CAN communication module for reliable communication between multiple ECUs.' },
      { title: 'Pipelined Digital Design', category: 'rtl', bonuses: ['simulation'], description: 'Pipelined digital architecture by dividing computation into multiple stages.' },
      { title: 'Timetable Management System (Tcl)', category: 'software', bonuses: ['working-demo'], description: 'Automated timetable management system using Tcl/Tk.' },
      { title: 'Attendance Management System (Perl)', category: 'software', bonuses: ['working-demo'], description: 'Automated attendance management system using Perl.' }
    ],
    '24VL032': [ // Roobashri S
      { title: 'Reconfigurable Neuromorphic Processor', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'Reconfigurable neuromorphic processor with dynamic synaptic adaptation for energy-efficient edge AI using Synopsys.' },
      { title: 'STM32F446RE PCB Controller Board', category: 'hardware', bonuses: ['working-demo', 'documentation'], description: 'Custom multilayer STM32F446RE controller PCB for 6-Axis Robotic Arm with CAN communication.' },
      { title: 'Smart 3S BMS with AI-Based SOC/SOH Estimation', category: 'hardware', bonuses: ['simulation'], description: 'Dual-MCU PCB for 3S Li-ion battery management with AI-based state estimation (Ongoing).' }
    ],
    '24VL040': [ // Soorya Velaa P
      { title: 'Booth Multiplier', category: 'rtl', bonuses: ['simulation'], description: 'Signed binary multiplication using Booth\'s algorithm.' },
      { title: 'Pipeline Design', category: 'rtl', bonuses: ['simulation'], description: 'Pipelined digital architecture design.' },
      { title: 'SPI Protocol', category: 'rtl', bonuses: ['simulation'], description: 'SPI serial communication interface.' },
      { title: 'MFCC Accelerator', category: 'asic', bonuses: ['simulation'], description: 'Mel-Frequency Cepstral Coefficients hardware accelerator.' }
    ],
    '24VL041': [ // SRI VATSAN P
      { title: 'AXI4-Stream Sparse Matrix Acceleration Engine', category: 'asic', bonuses: ['simulation'], description: 'Configurable Dynamic Memory-Aware AXI4-Stream Sparse Matrix Acceleration Engine with dual-bank ping-pong memory and adaptive clock gating.' },
      { title: 'DDR SDRAM Controller', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'DDR SDRAM controller using Verilog HDL and Synopsys ASIC design tools.' },
      { title: 'AXI Bus Protocol Controller', category: 'rtl', bonuses: ['simulation'], description: 'AXI-based bus protocol controller using SystemVerilog.' },
      { title: 'QoS-Aware AXI4 Interconnect', category: 'rtl', bonuses: ['simulation'], description: 'QoS-aware AXI4 interconnect with adaptive arbitration using SystemVerilog.' },
      { title: 'ECC-Based Self-Scrubbing SRAM Memory IP', category: 'asic', bonuses: ['simulation'], description: 'SRAM memory IP with ECC and self-scrubbing functionality.' }
    ],
    '24VL026': [ // Pratheep D
      { title: 'Sparse Multi-Head Attention Accelerator for LLM Inference', category: 'rtl-to-gdsii', bonuses: ['simulation', 'documentation'], description: 'RTL-to-GDSII Implementation of a Sparse Multi-Head Attention Accelerator for Transformer-Based Large Language Model Inference Using Cadence Flow.' }
    ],
    '24VL028': [ // PUGAZHENDHI S
      { title: 'RISC-V Processor with INT8 Systolic Array Accelerator', category: 'asic', bonuses: ['simulation'], description: 'RISC-V Processor with External Memory and INT8 Systolic Array Accelerator for Edge AI.' },
      { title: 'PPA Optimization of Hardware Accelerator', category: 'asic', bonuses: ['simulation', 'documentation'], description: 'PPA Optimization of a Hardware Accelerator for Real-Time Agricultural Drone Image Analysis.' },
      { title: 'Low Power 8-bit ALU', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'Low Power 8-bit ALU – RTL-to-GDSII, 90nm process.' },
      { title: 'SPI Controller', category: 'rtl-to-gdsii', bonuses: ['simulation'], description: 'Serial Peripheral Interface Controller – RTL-to-GDSII, 90nm.' },
      { title: 'Traffic Flow Controller', category: 'rtl', bonuses: ['simulation'], description: 'Traffic Flow Controller using FSM / Digital Design.' },
      { title: '8:1 Multiplexer Layout', category: 'asic', bonuses: [], description: '8:1 Multiplexer - Schematic to Layout in CMOS / VLSI Layout.' }
    ],
    '24VL021': [ // Mohammed Ayman M
      { title: 'SEMIRESTORE-AI', category: 'software', bonuses: ['simulation', 'documentation'], description: 'AI-Based Restoration of Degraded Images for Semiconductor Inspection using Computer Vision and Deep Learning.' }
    ],
    '24VL050': [ // S. Thirumurugan
      { title: 'RISC-V CPU', category: 'rtl', bonuses: ['simulation'], description: 'Custom RISC-V processor RTL design with instruction execution and control logic.' },
      { title: 'Secure VPU', category: 'asic', bonuses: ['simulation'], description: 'Secure Vector Processing Unit with hardware security mechanisms.' },
      { title: '8-bit ALU', category: 'rtl', bonuses: ['simulation'], description: '8-bit Arithmetic Logic Unit with arithmetic and bitwise logic operations.' },
      { title: 'Booth Multiplier', category: 'rtl', bonuses: ['simulation'], description: 'Signed Booth Multiplier for efficient binary multiplication.' },
      { title: 'TCAM', category: 'rtl', bonuses: ['simulation'], description: 'Ternary Content-Addressable Memory for parallel pattern matching.' }
    ],
    '24VL034': [ // SANJEEV GH
      { title: 'BatterySense X – ASIC', category: 'rtl-to-gdsii', bonuses: ['simulation', 'documentation', 'presentation'], description: 'Intelligent Battery Sensing & Health Monitoring ASIC. 91.94% core utilization, zero DRC violations, 0.0000 WNS after CTS optimization.' },
      { title: 'ECG Signal Power-Line Noise Removal', category: 'basic', bonuses: ['simulation'], description: 'MATLAB-based DSP project using notch filter.' },
      { title: 'SpaceEdgeX', category: 'basic', bonuses: ['documentation'], description: 'AI, edge computing, hardware acceleration, and space-based computing concept.' },
      { title: 'Embedded Systems Projects', category: 'hardware', bonuses: ['working-demo'], description: 'Multiple projects using Arduino, sensors, relays, and motors.' }
    ],
    '24VL037': [ // Santhosh Kumar S
      { title: 'EventLens AI – Selfie-Based Event Photo Finder', category: 'software', bonuses: ['working-demo', 'documentation'], description: 'AI-powered platform using FaceNet and facial recognition. Built with Next.js, FastAPI, PyTorch and OpenCV.' },
      { title: 'SGPA / CGPA Calculator Web App', category: 'software', bonuses: ['working-demo'], description: 'Student-focused web app for SGPA/CGPA calculation with login and saved history.' },
      { title: 'Health Buddy – AI-Driven Chatbot', category: 'software', bonuses: ['working-demo', 'publication'], description: 'AI chatbot for public health and disease awareness. Presented as paper at ICIES 2025.' }
    ]
  };

  /* =========================================================================
     3. ACHIEVEMENT COUNTING FROM TEXT
     ========================================================================= */
  function countAchievements(achievementText) {
    var text = String(achievementText || '').toLowerCase();
    var counts = {};
    var total = 0;

    // Count internships
    var internshipMatches = text.match(/internship/gi);
    var internshipNames = text.match(/(chip crafts?|career ladder|enthu|manfree|embuzz|mojo tech|maven silicon|sm ai)/gi);
    var internshipCount = internshipNames ? internshipNames.length : (internshipMatches ? internshipMatches.length : 0);
    if (internshipCount > 0) { counts.internships = internshipCount; total += internshipCount * ACHIEVEMENT_POINTS.internship; }

    // Count workshops
    var workshopMatches = text.match(/workshop/gi);
    var workshopCount = workshopMatches ? workshopMatches.length : 0;
    if (workshopCount > 0) { counts.workshops = workshopCount; total += workshopCount * ACHIEVEMENT_POINTS.workshop; }

    // Count hackathons
    var hackathonMatches = text.match(/hackathon/gi);
    var hackathonCount = hackathonMatches ? hackathonMatches.length : 0;
    if (hackathonCount > 0) { counts.hackathons = hackathonCount; total += hackathonCount * ACHIEVEMENT_POINTS.hackathon; }

    // Count certifications
    var certMatches = text.match(/certif/gi);
    var certCount = certMatches ? certMatches.length : 0;
    if (certCount > 0) { counts.certifications = certCount; total += certCount * ACHIEVEMENT_POINTS.certification; }

    // Count papers/publications
    var paperMatches = text.match(/paper|publication|published|icies/gi);
    var paperCount = paperMatches ? Math.min(paperMatches.length, 3) : 0;
    if (paperCount > 0) { counts.papers = paperCount; total += paperCount * ACHIEVEMENT_POINTS.paper; }

    // Rank holder
    if (/rank holder|rank 1|first rank|1st rank/i.test(text)) {
      counts.rankHolder = 1; total += ACHIEVEMENT_POINTS['rank-holder'];
    }

    // NCC
    if (/ncc/i.test(text)) {
      counts.ncc = 1; total += ACHIEVEMENT_POINTS.ncc;
    }

    return { counts: counts, total: total };
  }

  /* =========================================================================
     4. PROJECT SCORE CALCULATION
     ========================================================================= */
  function calculateProjectScore(project) {
    var cat = PROJECT_CATEGORIES[project.category] || PROJECT_CATEGORIES['basic'];
    var basePoints = cat.points;
    var bonusPoints = 0;
    var bonusDetails = [];

    (project.bonuses || []).forEach(function(bonusKey) {
      var bonus = QUALITY_BONUSES[bonusKey];
      if (bonus) {
        bonusPoints += bonus.points;
        bonusDetails.push({ key: bonusKey, label: bonus.label, points: bonus.points });
      }
    });

    return {
      basePoints: basePoints,
      bonusPoints: bonusPoints,
      totalPoints: basePoints + bonusPoints,
      categoryLabel: cat.label,
      categoryColor: cat.color,
      bonusDetails: bonusDetails
    };
  }

  /* =========================================================================
     5. FULL STUDENT SCORING
     ========================================================================= */
  function computeStudentScore(student) {
    var rollNo = student.registerNo || student.rollno || '';
    var projects = STUDENT_PROJECTS[rollNo] || [];
    var projectScores = [];
    var totalProjectPoints = 0;
    var advancedProjectCount = 0;

    projects.forEach(function(proj) {
      var score = calculateProjectScore(proj);
      projectScores.push({
        title: proj.title,
        category: proj.category,
        categoryLabel: score.categoryLabel,
        categoryColor: score.categoryColor,
        description: proj.description || '',
        basePoints: score.basePoints,
        bonusPoints: score.bonusPoints,
        bonusDetails: score.bonusDetails,
        totalPoints: score.totalPoints
      });
      totalProjectPoints += score.totalPoints;

      // Count advanced projects (ASIC, RTL-to-GDSII, Silicon)
      if (['asic', 'rtl-to-gdsii', 'silicon'].indexOf(proj.category) !== -1) {
        advancedProjectCount++;
      }
    });

    // Achievement points
    var achievementData = countAchievements(student.achievement);

    return {
      projects: projectScores,
      projectCount: projects.length,
      advancedProjectCount: advancedProjectCount,
      totalProjectPoints: totalProjectPoints,
      achievementPoints: achievementData.total,
      achievementCounts: achievementData.counts,
      totalPoints: totalProjectPoints + achievementData.total
    };
  }

  /* =========================================================================
     6. LEADERBOARD GENERATION
     ========================================================================= */
  function generateLeaderboard(students) {
    var scored = students.map(function(student) {
      var scoring = computeStudentScore(student);
      return Object.assign({}, student, {
        scoring: scoring,
        totalPoints: scoring.totalPoints,
        projectCount: scoring.projectCount,
        advancedProjectCount: scoring.advancedProjectCount
      });
    });

    // Sort: total points desc → advanced projects desc → project count desc → name asc
    scored.sort(function(a, b) {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.advancedProjectCount !== a.advancedProjectCount) return b.advancedProjectCount - a.advancedProjectCount;
      if (b.projectCount !== a.projectCount) return b.projectCount - a.projectCount;
      return (a.name || '').localeCompare(b.name || '');
    });

    // Assign ranks (handle ties)
    var currentRank = 1;
    scored.forEach(function(s, i) {
      if (i > 0 && s.totalPoints === scored[i - 1].totalPoints &&
          s.advancedProjectCount === scored[i - 1].advancedProjectCount &&
          s.projectCount === scored[i - 1].projectCount) {
        s.rank = scored[i - 1].rank;
      } else {
        s.rank = currentRank;
      }
      currentRank = i + 2;
    });

    return scored;
  }

  /* =========================================================================
     7. EXPORTS
     ========================================================================= */
  window.PROJECT_CATEGORIES = PROJECT_CATEGORIES;
  window.QUALITY_BONUSES = QUALITY_BONUSES;
  window.STUDENT_PROJECTS = STUDENT_PROJECTS;
  window.computeStudentScore = computeStudentScore;
  window.generateLeaderboard = generateLeaderboard;
  window.calculateProjectScore = calculateProjectScore;

})(typeof window !== 'undefined' ? window : this);

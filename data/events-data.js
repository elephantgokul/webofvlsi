/* Unified Events Data for SIET VLSI Design and Technology
   Contains events Conducted by Department.
   Participated events are archived in PARTICIPATED_EVENTS_ARCHIVE.
   Used by events.html, events-conducted.html, event-detail.html, and homepage.
*/
(function (window) {
  'use strict';

  // Events Conducted by the Department
  var CONDUCTED_EVENTS = [
  {
    "id": "synopsys-frontend-workshop",
    "title": "Synopsys Front-End Design Workshop",
    "event_type": "Conducted by Department",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "23.10.2026 – 24.10.2026",
    "event_date": "2026-10-23",
    "day": "23",
    "month": "OCT",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "Two Days",
    "venue": "VLSI Research Lab, Sri Shakthi Tech Park",
    "theme": "VLSI Front-End Design",
    "description": "VLSI Front-End Design using Synopsys EDA Tools conducted for two batches: external participants covering RTL synthesis and verification, and 23 second-year internal participants covering RTL synthesis and simulation.",
    "highlights": [
      "Batch 1 (External Participants): Comprehensive RTL synthesis, simulation, and verification using Synopsys VCS and Design Compiler.",
      "Batch 2 (Internal Participants): 23 second-year VLSI students trained in hands-on RTL architecture, logic simulation, and timing constraints.",
      "Hands-on laboratory sessions in the VLSI Research Lab, Sri Shakthi Tech Park.",
      "Logic synthesis and optimization workflows with Synopsys Design Compiler."
    ],
    "outcomes": [
      "Participants across both batches mastered front-end design principles, logic synthesis, and verification workflows using industry-standard Synopsys suites."
    ],
    "students": 23,
    "staff": 4,
    "photos": [
      {
        "src": "../assets/images/events/synopsys-workshop/synopsys-workshop-session.jpg",
        "alt": "Synopsys Front-End Design Workshop at Sri Shakthi Tech Park"
      }
    ],
    "poster_url": "../assets/images/events/synopsys-workshop/synopsys-workshop-session.jpg"
  },
  {
    "id": "veltraxx26",
    "title": "VELTRAXX '26 – 24 Hours VLSI & Hardware Hackathon",
    "event_type": "Conducted by Department",
    "category": "hackathons",
    "cat": "hackathon",
    "dateLabel": "28.08.2026 – 29.08.2026",
    "event_date": "2026-08-28",
    "day": "28",
    "month": "AUG",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "24 Hours",
    "venue": "VLSI Research Lab, Sri Shakthi Institute of Engineering and Technology",
    "theme": "Innovation & Hardware Prototyping",
    "description": "24-hour intensive hardware & VLSI hackathon organized by the department. Teams of 4 worked continuously on RTL design, verification, and rapid hardware prototyping.",
    "highlights": [
      "24-hour team-based VLSI hackathon focused on innovation and chip design.",
      "Team size of 4 with over 150 participant submissions across technical tracks.",
      "Real-time RTL implementation, simulation, and hardware debugging."
    ],
    "outcomes": [
      "Students developed collaborative problem-solving capabilities, implementing innovative silicon and embedded prototypes under tight deadlines."
    ],
    "students": 150,
    "staff": 5,
    "photos": [
      {
        "src": "../assets/images/achievements/veltraxx26.jpg",
        "alt": "VELTRAXX '26 Hackathon participants"
      },
      {
        "src": "../assets/images/events/veltraxx26/veltraxx26-team.jpg",
        "alt": "VELTRAXX '26 team working in lab"
      }
    ],
    "poster_url": "../assets/images/achievements/veltraxx26.jpg"
  },
  {
    "id": "cadence-workshop-internal",
    "title": "Cadence Workshop for Internal Participants (Chip Design Using Cadence Tool Chain, RTL to GDSII)",
    "event_type": "Conducted by Department",
    "category": "technical-training",
    "cat": "workshop",
    "dateLabel": "18.07.2026 – 22.07.2026",
    "event_date": "2026-07-18",
    "day": "18",
    "month": "JUL",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Five Days",
    "venue": "VLSI Research Lab, SIET",
    "theme": "RTL to GDSII ASIC Flow",
    "description": "Hands-on chip design using the Cadence tool chain (RTL to GDSII) for 21 second-year internal participants, covering synthesis, floorplanning, CTS, routing, and tape-out verification.",
    "highlights": [
      "In-depth RTL-to-GDSII flow using Cadence Innovus, Genus, and Virtuoso.",
      "21 second-year EE-VDT student participants.",
      "Full physical design flow: synthesis, placement, CTS, routing, DRC, and LVS."
    ],
    "outcomes": [
      "Students completed full ASIC physical design implementations and generated clean GDSII database layouts."
    ],
    "students": 21,
    "staff": 5,
    "photos": [
      {
        "src": "../assets/images/events/chip-design/chip-design-training.jpg",
        "alt": "Internal students at Cadence RTL to GDSII workshop"
      }
    ],
    "poster_url": "../assets/images/events/chip-design/chip-design-training.jpg"
  },
  {
    "id": "backend-cadence",
    "title": "Back End Design of Digital Logic Circuits Using Cadence Tool",
    "event_type": "Conducted by Department",
    "category": "technical-training",
    "cat": "workshop",
    "dateLabel": "12.06.2026 – 13.06.2026",
    "event_date": "2026-06-12",
    "day": "12",
    "month": "JUN",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Two Days",
    "venue": "VLSI Research Lab, SIET",
    "theme": "Physical Design & Timing Closure",
    "description": "Students gained practical exposure to back-end VLSI design using Cadence tools, covering floorplanning, placement, clock tree synthesis, routing, and physical verification.",
    "highlights": [
      "Introduction to back-end design of digital logic circuits using Cadence tools.",
      "Hands-on exposure to floorplanning, placement, clock tree synthesis, and routing.",
      "Timing analysis and sign-off verification in the ASIC implementation flow."
    ],
    "outcomes": [
      "Students gained practical exposure to back-end VLSI design, bridging theoretical layout principles with industry tools."
    ],
    "students": 60,
    "staff": 5,
    "photos": [
      {
        "src": "../assets/images/events/backend-cadence/backend-cadence-lab.jpg",
        "alt": "Students working in Cadence back-end design lab"
      }
    ],
    "poster_url": "../assets/images/events/backend-cadence/backend-cadence-lab.jpg"
  },
  {
    "id": "the-lost-silicon",
    "title": "THE LOST SILICON – VLSI Technical Quiz & Debugging Challenge",
    "event_type": "Conducted by Department",
    "category": "competitions",
    "cat": "competition",
    "dateLabel": "12.03.2026",
    "event_date": "2026-03-12",
    "day": "12",
    "month": "MAR",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "One Day",
    "venue": "SIET Campus LH 46",
    "theme": "Silicon Debugging Challenge",
    "description": "Organized by TECKTORS featuring 3 competitive rounds: Boolean Logic, Circuit Challenge, and Debugging Arena. Staff Coordinator: Mrs. Priscilla Sophia; Student Coordinator: Subiksha L.",
    "highlights": [
      "Organized by the TECKTORS student club under department guidance.",
      "Round 1: Boolean Logic & Combinational Analysis.",
      "Round 2: Circuit Challenge & Timing Analysis.",
      "Round 3: Debugging Arena — real-time hardware fault isolation.",
      "Staff Coordinator: Mrs. Priscilla Sophia; Student Coordinator: Subiksha L."
    ],
    "outcomes": [
      "Tested participants on deep hardware understanding, logic synthesis bugs, and silicon diagnostic techniques."
    ],
    "students": 75,
    "staff": 3,
    "photos": [
      {
        "src": "../assets/images/achievements/lost_silicon.jpg",
        "alt": "THE LOST SILICON challenge event"
      }
    ],
    "poster_url": "../assets/images/achievements/lost_silicon.jpg"
  },
  {
    "id": "tecktors-kalam26",
    "title": "TECKTORS – CHIP CREATORS Kalam ’26 Workshop",
    "event_type": "Conducted by Department",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "12.03.2026 – 13.03.2026",
    "event_date": "2026-03-12",
    "day": "12",
    "month": "MAR",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Two Days",
    "venue": "SIET Campus",
    "theme": "Design an IC",
    "description": "Students gained practical exposure to the complete IC design flow, covering RTL synthesis, physical design, DFT, placement, routing, verification, and GDS II generation.",
    "highlights": [
      "Introduction to the complete IC design flow from chip specification to GDS II.",
      "Hands-on exposure to design entry, functional verification, and RTL synthesis.",
      "Senior Application Engineer Mr. Navaneetha Krishnan from Entuple Technologies."
    ],
    "outcomes": [
      "Students strengthened practical chip design skills and understood real-world foundry design constraints."
    ],
    "students": 60,
    "staff": 5,
    "photos": [
      {
        "src": "../assets/images/events/tecktors-kalam26/tecktors-kalam26-session.jpg",
        "alt": "TECKTORS Kalam 26 workshop session"
      }
    ],
    "poster_url": "../assets/images/events/tecktors-kalam26/tecktors-kalam26-session.jpg"
  },
  {
    "id": "synopsys-workshop-feb",
    "title": "5 Days Hands-on Workshop from RTL to GDS II Using Synopsys",
    "event_type": "Conducted by Department",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "16.02.2026 – 20.02.2026",
    "event_date": "2026-02-16",
    "day": "16",
    "month": "FEB",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Five Days",
    "venue": "VLSI Research Lab, SIET",
    "theme": "Synopsys Tool Flow",
    "description": "Hands-on Synopsys flow training in association with VLSI Minds CTO Mr. Chethan Kumar N. S., covering analog/custom layout, DRC, LVS, and physical verification.",
    "highlights": [
      "Introduction to Synopsys EDA tools and semiconductor design methodologies.",
      "Analog and custom layout design principles.",
      "Hands-on DRC, LVS, and physical verification exercises."
    ],
    "outcomes": [
      "Participants acquired strong competencies in Synopsys design suites and IC verification methodologies."
    ],
    "students": 60,
    "staff": 5,
    "photos": [
      {
        "src": "../assets/images/events/synopsys-workshop/synopsys-workshop-session.jpg",
        "alt": "Synopsys 5-day hands-on workshop in lab"
      }
    ],
    "poster_url": "../assets/images/events/synopsys-workshop/synopsys-workshop-session.jpg"
  },
  {
    "id": "frontend-cadence",
    "title": "Front End Design of Digital Logic Circuits Using Cadence Tool",
    "event_type": "Conducted by Department",
    "category": "technical-training",
    "cat": "workshop",
    "dateLabel": "05.02.2026 – 06.02.2026",
    "event_date": "2026-02-05",
    "day": "05",
    "month": "FEB",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Two Days",
    "venue": "VLSI Lab, SIET",
    "theme": "Front-End RTL Design",
    "description": "Hands-on training on RTL design, Verilog HDL coding, simulation, and logic synthesis using Cadence Genus.",
    "highlights": [
      "Hands-on exposure to RTL coding and simulation in Verilog.",
      "Logic synthesis and optimization with Cadence Genus.",
      "Functional verification and testbench writing."
    ],
    "outcomes": [
      "Students developed practical skills in RTL authoring, simulation, and synthesis workflows."
    ],
    "students": 50,
    "staff": 5,
    "photos": [
      {
        "src": "../assets/images/events/frontend-cadence/frontend-cadence-session.jpg",
        "alt": "Front-end Cadence session guided by faculty"
      }
    ],
    "poster_url": "../assets/images/events/frontend-cadence/frontend-cadence-session.jpg"
  },
  {
    "id": "cadence-rtl-gds",
    "title": "Cadence Full Flow from RTL to GDS – 10 Days Hands-on Workshop",
    "event_type": "Conducted by Department",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "10.12.2025 – 22.12.2025",
    "event_date": "2025-12-10",
    "day": "10",
    "month": "DEC",
    "year": "2025",
    "academicYear": "2025–2026",
    "duration": "Ten Days",
    "venue": "VLSI Research Lab, SIET",
    "theme": "Complete ASIC Flow",
    "description": "Ten-day comprehensive hands-on workshop led by Entuple Technologies Senior Application Engineer Mr. V. Navaneetha Krishnan covering complete RTL-to-GDSII flow.",
    "highlights": [
      "Complete RTL-to-GDSII flow using Cadence tools.",
      "Synthesis, floorplanning, placement, CTS, and routing.",
      "DRC, LVS, physical verification, and GDSII generation."
    ],
    "outcomes": [
      "Comprehensive 10-day hands-on mastery of full chip design pipeline from RTL to GDSII."
    ],
    "students": 30,
    "staff": 5,
    "photos": [
      {
        "src": "../assets/images/events/cadence-rtl-gds/cadence-rtl-gds-lab.jpg",
        "alt": "Cadence 10-day RTL to GDS workshop"
      }
    ],
    "poster_url": "../assets/images/events/cadence-rtl-gds/cadence-rtl-gds-lab.jpg"
  },
  {
    "id": "altera-fpga",
    "title": "Workshop on Digital Hardware Design and Implementation with Altera (Intel) FPGA",
    "event_type": "Conducted by Department",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "18.11.2025 – 19.11.2025",
    "event_date": "2025-11-18",
    "day": "18",
    "month": "NOV",
    "year": "2025",
    "academicYear": "2025–2026",
    "duration": "Two Days",
    "venue": "VLSI Lab, SIET",
    "theme": "FPGA Implementation",
    "description": "Students were introduced to digital hardware design and hands-on FPGA implementation using Altera (Intel) FPGA platforms with Chip Crafts CTO Mr. D. Ramesh.",
    "highlights": [
      "Digital hardware design on Altera (Intel) Cyclone FPGA boards.",
      "Verilog HDL synthesis and pin-mapping.",
      "Hardware debugging and live board programming."
    ],
    "outcomes": [
      "Students successfully synthesized and mapped digital circuits onto FPGA hardware platforms."
    ],
    "students": 56,
    "staff": 1,
    "photos": [
      {
        "src": "../assets/images/events/altera-fpga/altera-fpga-session.jpg",
        "alt": "Students at Altera FPGA workshop"
      }
    ],
    "poster_url": "../assets/images/events/altera-fpga/altera-fpga-session.jpg"
  },
  {
    "id": "cadence-workshop-external",
    "title": "Cadence Workshop for External Participants",
    "event_type": "Conducted by Department",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "Date: 2026",
    "event_date": "2026-01-01",
    "has_exact_date": false,
    "day": "--",
    "month": "2026",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Workshop",
    "venue": "VLSI Research Lab, SIET",
    "theme": "Chips to Startup Programme",
    "description": "Chip design with Cadence EDA tools, RTL to GDSII; organized in association with the Chips to Startup (C2S) Programme for external college participants.",
    "highlights": [
      "Organized in association with the Chips to Startup (C2S) Programme.",
      "Complete RTL-to-GDSII flow using Cadence EDA tools.",
      "Outreach to external engineering colleges and research scholars."
    ],
    "outcomes": [
      "Extended advanced chip design tools and EDA training to participants across higher education institutions."
    ],
    "students": 50,
    "staff": 4,
    "photos": [],
    "poster_url": ""
  }
];

  // Archive of Participated Events (external hackathons, symposiums, certifications)
  var PARTICIPATED_EVENTS_ARCHIVE = [
  {
    "id": "matlab-workshop",
    "title": "MATLAB Workshop",
    "event_type": "Participated",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "10.10.2026 – 11.10.2026",
    "event_date": "2026-10-10",
    "day": "10",
    "month": "OCT",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "Two Days",
    "venue": "PSG College of Technology, Coimbatore",
    "theme": "Signal Processing & Modeling",
    "description": "Hands-on MATLAB workshop covering signal processing, mathematical modeling, and engineering simulation.",
    "highlights": [
      "Hands-on technical sessions at PSG College of Technology.",
      "Signal processing and digital filtering in MATLAB/Simulink.",
      "Hardware co-simulation and algorithm verification."
    ],
    "outcomes": [
      "Participating students enhanced their computational modeling and digital signal processing skills for hardware applications."
    ],
    "students": 15,
    "staff": 0,
    "photos": [],
    "poster_url": ""
  },
  {
    "id": "neuromorphic-vlsi-workshop",
    "title": "Neuromorphic VLSI Outreach Workshop",
    "event_type": "Participated",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "26.09.2026",
    "event_date": "2026-09-26",
    "day": "26",
    "month": "SEP",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "One Day",
    "venue": "Adishia College of Engineering, Kerala (IEEE CAS)",
    "theme": "Brain-Inspired Neuromorphic Computing",
    "description": "IEEE CAS sponsored workshop on neuromorphic computing and bio-inspired VLSI architectures. Varsha VR won 1st Place in Circuit Design, Monika M 2nd Place in Quiz, Sasmitha S P 3rd Place in Paper Presentation, and Subiksha L 3rd Place in Innovation Showcase.",
    "highlights": [
      "IEEE Circuits and Systems Society (CAS) outreach programme.",
      "Varsha VR secured 1st Place in the Brain-Inspired Circuit Design Challenge.",
      "Monika M won 2nd Place in the VLSI Technical Quiz.",
      "Sasmitha S P won 3rd Place in Paper Presentation.",
      "Subiksha L won 3rd Place in the Innovation Showcase.",
      "Participation certificates earned by Sri Ram M R, Tharun M, Manova M, and Sanjeev G H."
    ],
    "outcomes": [
      "Students showcased national-level competitive excellence in neuromorphic circuit architectures and spike-based computation."
    ],
    "students": 8,
    "staff": 0,
    "photos": [
      {
        "src": "../assets/images/achievements/neuromorphic_varsha.jpg",
        "alt": "Varsha VR receiving 1st prize at Neuromorphic VLSI workshop"
      }
    ],
    "poster_url": "../assets/images/achievements/neuromorphic_varsha.jpg"
  },
  {
    "id": "quantum-pro-26",
    "title": "QUANTUM PRO '26 – Hands-on Quantum Workshop",
    "event_type": "Participated",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "21.09.2026 – 23.09.2026",
    "event_date": "2026-09-21",
    "day": "21",
    "month": "SEP",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "Three Days",
    "venue": "PSG Centenary Government College (PSG College Tech Park), Coimbatore",
    "theme": "Quantum Information Science",
    "description": "Three-day hands-on workshop exploring quantum computing fundamentals, quantum algorithms, and physical quantum hardware interfaces.",
    "highlights": [
      "Qubit representations, quantum gates, and circuit synthesis.",
      "Hands-on quantum algorithm development on simulator platforms.",
      "Interface between quantum architecture and silicon quantum dot processors."
    ],
    "outcomes": [
      "Students gained early exposure to cutting-edge quantum hardware paradigms and quantum algorithm implementation."
    ],
    "students": 12,
    "staff": 0,
    "photos": [],
    "poster_url": ""
  },
  {
    "id": "nptel-vlsi-interconnects",
    "title": "NPTEL Examination: VLSI Interconnects",
    "event_type": "Participated",
    "category": "academic",
    "cat": "academic",
    "dateLabel": "20.09.2026",
    "event_date": "2026-09-20",
    "day": "20",
    "month": "SEP",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "One Day",
    "venue": "KPR Institute of Engineering and Technology, Coimbatore",
    "theme": "On-Chip Interconnects & Parasitics",
    "description": "18 third and second-year VLSI students appeared for the national NPTEL certification exam on VLSI Interconnects. Three students earned Elite distinction: Nithikkanannan J S, Sakthishree D, and Harish R.",
    "highlights": [
      "National NPTEL examination on VLSI Interconnects and parasitic modeling.",
      "18 EE-VDT students from III & II year participated.",
      "Elite NPTEL Achievers: Nithikkanannan J S, Sakthishree D, Harish R."
    ],
    "outcomes": [
      "Demonstrated academic rigor with multiple Elite honours in advanced interconnect physics and parasitic extraction."
    ],
    "students": 18,
    "staff": 0,
    "photos": [
      {
        "src": "../assets/images/achievements/nptel_elite.jpg",
        "alt": "Elite NPTEL achievers from VLSI department"
      }
    ],
    "poster_url": "../assets/images/achievements/nptel_elite.jpg"
  },
  {
    "id": "semicon-india-2026",
    "title": "SEMICON India 2026",
    "event_type": "Participated",
    "category": "symposium",
    "cat": "symposium",
    "dateLabel": "17.09.2026 – 19.09.2026",
    "event_date": "2026-09-17",
    "day": "17",
    "month": "SEP",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "Three Days",
    "venue": "Yashobhoomi (IICC), New Delhi",
    "theme": "Global Semiconductor Ecosystem",
    "description": "India's premier semiconductor conference and expo, bringing together global industry leaders, foundries, EDA vendors, and policymakers to accelerate India's semiconductor mission.",
    "highlights": [
      "Attended premier national semiconductor conference in New Delhi.",
      "Interactions with global semiconductor equipment and EDA executives.",
      "Deep insights into India Semiconductor Mission (ISM) initiatives and foundry roadmaps."
    ],
    "outcomes": [
      "Gained profound industry perspective on silicon manufacturing, OSAT facilities, and emerging VLSI career trajectories."
    ],
    "students": 10,
    "staff": 0,
    "photos": [
      {
        "src": "../assets/images/achievements/semicon_india.jpg",
        "alt": "Department delegation at SEMICON India 2026, New Delhi"
      }
    ],
    "poster_url": "../assets/images/achievements/semicon_india.jpg"
  },
  {
    "id": "risc-v-symposium",
    "title": "3rd Digital India RISC-V Symposium 2026",
    "event_type": "Participated",
    "category": "symposium",
    "cat": "symposium",
    "dateLabel": "01.08.2026 – 02.08.2026",
    "event_date": "2026-08-01",
    "day": "01",
    "month": "AUG",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "Two Days",
    "venue": "IIT Madras, Chennai",
    "theme": "Open Architecture Microprocessors",
    "description": "26 student participants attended the 3rd Digital India RISC-V Symposium at IIT Madras, exploring Shakti processor microarchitecture and open-source silicon.",
    "highlights": [
      "26 EE-VDT students attended technical sessions at IIT Madras.",
      "In-depth presentations on RISC-V ISA extensions and Shakti cores.",
      "Direct engagement with leading processor architects and DIR-V contributors."
    ],
    "outcomes": [
      "Students gained hands-on awareness of open ISA CPU design, pipeline optimization, and FPGA emulation of RISC-V processors."
    ],
    "students": 26,
    "staff": 0,
    "photos": [],
    "poster_url": ""
  },
  {
    "id": "ai-ml-hackathon",
    "title": "AI-ML Hackathon",
    "event_type": "Participated",
    "category": "hackathons",
    "cat": "hackathon",
    "dateLabel": "22.07.2026 – 23.07.2026",
    "event_date": "2026-07-22",
    "day": "22",
    "month": "JUL",
    "year": "2026",
    "academicYear": "2026–2027",
    "duration": "Two Days",
    "venue": "Coimbatore",
    "theme": "Applied AI & Hardware Acceleration",
    "description": "Student team comprising Dharun Prasanna R, Jeevanandham B, and Sundaresh M received Special Mention for their innovative project 'Roleup' (Agentic AI for Career Growth and Development).",
    "highlights": [
      "Two-day competitive hackathon focused on applied AI solutions.",
      "Project 'Roleup' won Special Mention distinction.",
      "Team members: Dharun Prasanna R, Jeevanandham B, Sundaresh M."
    ],
    "outcomes": [
      "Demonstrated state-of-the-art capability in deploying agentic AI architectures for career growth."
    ],
    "students": 3,
    "staff": 0,
    "photos": [
      {
        "src": "../assets/images/achievements/roleup_hackathon.jpg",
        "alt": "Roleup AI team receiving award"
      }
    ],
    "poster_url": "../assets/images/achievements/roleup_hackathon.jpg"
  },
  {
    "id": "semiconductor-mfg-iit",
    "title": "Semiconductor and Manufacturing Workshop",
    "event_type": "Participated",
    "category": "workshops",
    "cat": "workshop",
    "dateLabel": "Date: 2026",
    "event_date": "2026-01-01",
    "has_exact_date": false,
    "day": "--",
    "month": "2026",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Workshop",
    "venue": "IIT Tirupati",
    "theme": "Semiconductor Fabrication",
    "description": "Advanced workshop on semiconductor physics, cleanroom fabrication techniques, photolithography, and silicon manufacturing processes at IIT Tirupati.",
    "highlights": [
      "Hosted at IIT Tirupati semiconductor research labs.",
      "Silicon wafer processing, lithography, etching, and thin-film deposition.",
      "Cleanroom protocol and semiconductor metrology."
    ],
    "outcomes": [
      "Students gained firsthand knowledge of commercial silicon fabrication and microelectronics cleanroom workflows."
    ],
    "students": 10,
    "staff": 0,
    "photos": [],
    "poster_url": ""
  },
  {
    "id": "iit-riscv-participation",
    "title": "IIT RISC-V Participation",
    "event_type": "Participated",
    "category": "symposium",
    "cat": "symposium",
    "dateLabel": "Date: 2026",
    "event_date": "2026-01-01",
    "has_exact_date": false,
    "day": "--",
    "month": "2026",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Symposium",
    "venue": "IIT Madras",
    "theme": "RISC-V Microarchitecture",
    "description": "Department student delegation including Subiksha L and Kavya M participated in advanced RISC-V architectural sessions and discussions at IIT Madras.",
    "highlights": [
      "Delegation including Subiksha L and Kavya M.",
      "Technical engagement with IIT Madras processor design teams.",
      "Exploration of open-source RISC-V SoC customization."
    ],
    "outcomes": [
      "Strengthened departmental competence in open-source RISC-V processor verification and SoC integration."
    ],
    "students": 5,
    "staff": 0,
    "photos": [],
    "poster_url": ""
  },
  {
    "id": "vdat-2026",
    "title": "VDAT 2026 – 30th International Symposium on VLSI Design & Test",
    "event_type": "Participated",
    "category": "symposium",
    "cat": "symposium",
    "dateLabel": "Date: 2026",
    "event_date": "2026-01-01",
    "has_exact_date": false,
    "day": "--",
    "month": "2026",
    "year": "2026",
    "academicYear": "2025–2026",
    "duration": "Three Days",
    "venue": "Jaypee Institute of Information Technology, Noida",
    "theme": "VLSI Design & Test",
    "description": "Participation in India's leading international VLSI design and test conference, engaging with global semiconductor researchers, test engineers, and EDA architects.",
    "highlights": [
      "30th International Symposium on VLSI Design and Test (VDAT 2026).",
      "Presentation and review of advances in testability, DFT, and silicon validation.",
      "Networking with international semiconductor luminaries."
    ],
    "outcomes": [
      "Enhanced academic exposure to test methodologies, built-in self-test (BIST), and post-silicon validation."
    ],
    "students": 6,
    "staff": 0,
    "photos": [
      {
        "src": "../assets/images/achievements/vdat_2026.jpg",
        "alt": "VDAT 2026 Symposium participation"
      }
    ],
    "poster_url": "../assets/images/achievements/vdat_2026.jpg"
  }
];

  window.EVENTS_DATA = CONDUCTED_EVENTS;
  window.EVENTS_CONDUCTED = CONDUCTED_EVENTS;
  window.PARTICIPATED_EVENTS_ARCHIVE = PARTICIPATED_EVENTS_ARCHIVE;

})(typeof window !== 'undefined' ? window : this);

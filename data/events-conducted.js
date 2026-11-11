/* IIC Activity Report, Academic Year 2025–2026.
   Event fields below are transcribed from the supplied report. Keep photos local to this archive. */
(function (window) {
  'use strict';

  if (window.EVENTS_DATA && Array.isArray(window.EVENTS_DATA)) {
    window.EVENTS_CONDUCTED = window.EVENTS_DATA;
    return;
  }

  window.EVENTS_CONDUCTED = [
    {
      id: 'altera-fpga',
      title: 'Workshop on Digital Hardware Design and Implementation with Altera (Intel) FPGA',
      dateLabel: '18.11.2025 – 19.11.2025',
      academicYear: '2025–2026',
      duration: 'Two Days',
      category: 'workshops',
      iicCategory: 'Self Driven',
      theme: 'Technology & Innovation',
      resourcePerson: 'Mr. D. Ramesh',
      designation: 'Chief Technology Officer (CTO)',
      organization: 'Chip Crafts, Coimbatore',
      speakerBio: 'Mr. D. Ramesh is an electronics and embedded-systems professional from Chip Crafts, Coimbatore, where he has served as Chief Technology Officer (CTO). He holds an M.Sc. in Electronics and has 14+ years of experience in microcontrollers, embedded systems, hardware design, PCB design, and verification. His expertise includes 8/16/32-bit microcontrollers, PIC MCUs, communication protocols such as RS232, RS485, I²C, SPI and CAN, wireless technologies, PCB design, hardware verification, and new product development. He has also conducted professional training programs in Embedded Systems, IoT and PCB Design.',
      description: 'Students were introduced to digital hardware design and hands-on FPGA implementation using Altera (Intel) FPGA platforms, gaining clarity on concepts such as RTL design, Verilog HDL, synthesis, and hardware programming.',
      highlights: [
        'Overview of digital hardware design and implementation using Altera (Intel) FPGA platforms.',
        'Introduction to Verilog HDL, RTL design, synthesis, and FPGA programming for digital system development.',
        'Hands-on exposure to FPGA-based hardware implementation and prototyping, connecting theoretical concepts with practical applications.',
        'Interaction with the industry expert, Mr. D. Ramesh from Chip Crafts, addressing students’ queries on FPGA technologies, digital design, and career opportunities.'
      ],
      outcomes: [
        'Students were introduced to digital hardware design and hands-on FPGA implementation using Altera (Intel) FPGA platforms, gaining clarity on concepts such as RTL design, Verilog HDL, synthesis, and hardware programming. The workshop helped participants connect their classroom knowledge with practical digital system development and industry-oriented hardware implementation. The session also provided valuable insights into FPGA-based prototyping and motivated students to strengthen their skills in digital design, Verilog, and FPGA technologies for future academic projects and career opportunities.'
      ],
      students: 56,
      staff: 1,
      photos: [
        { src: '../assets/images/events/altera-fpga/altera-fpga-session.jpg', alt: 'Students attend the Altera FPGA digital hardware design workshop at SIET.' }
      ]
    },
    {
      id: 'cadence-rtl-gds',
      title: 'Cadence Full Flow from RTL to GDS – 10 Days Hands-on Workshop',
      dateLabel: '10.12.2025 – 22.12.2025',
      academicYear: '2025–2026',
      duration: 'Ten Days',
      category: 'workshops',
      iicCategory: 'Self Driven',
      theme: 'Technology & Innovation',
      resourcePerson: 'Mr. V. Navaneetha Krishnan',
      designation: 'Senior Application Engineer',
      organization: 'Entuple Technologies Pvt. Ltd., Bengaluru',
      speakerBio: 'Mr. V. Navaneetha Krishnan is a semiconductor professional specializing in VLSI design, EDA tools, and ASIC design flows. He has extensive expertise in Cadence-based RTL-to-GDSII flow, physical design, timing analysis, placement and routing, and DRC/LVS verification. As a Senior Application Engineer at Entuple Technologies, he conducts hands-on technical training and workshops, helping students bridge academic VLSI concepts with industry-oriented chip design practices.',
      description: 'Students gained hands-on exposure to the complete RTL-to-GDSII VLSI design flow using Cadence tools, covering synthesis, floorplanning, placement, routing, timing analysis, and physical verification.',
      highlights: [
        'Introduction to the complete RTL-to-GDSII VLSI design flow using Cadence tools.',
        'Hands-on training in RTL design, simulation, synthesis, and timing analysis.',
        'Practical exposure to floorplanning, placement, clock tree synthesis, and routing.',
        'Understanding of DRC, LVS, physical verification, and GDSII generation.',
        'Industry-oriented guidance on ASIC design methodologies and VLSI career opportunities.'
      ],
      outcomes: [
        'Students gained hands-on exposure to the complete RTL-to-GDSII VLSI design flow using Cadence tools, covering synthesis, floorplanning, placement, routing, timing analysis, and physical verification. The workshop strengthened their practical skills and provided industry-oriented knowledge essential for pursuing careers in VLSI and semiconductor design.'
      ],
      students: 30,
      staff: 5,
      verificationNote: 'The report gives a 10–22 December date range and a ten-day duration. Confirm the scheduled session dates.',
      photos: [
        { src: '../assets/images/events/cadence-rtl-gds/cadence-rtl-gds-lab.jpg', alt: 'Students work at Cadence design tools during the RTL-to-GDS workshop.' }
      ]
    },
    {
      id: 'frontend-cadence',
      title: 'Front End Design of Digital Logic Circuits Using Cadence Tool',
      dateLabel: '05.02.2026 – 06.02.2026',
      academicYear: '2025–2026',
      duration: 'Two Days',
      category: 'technical-training',
      iicCategory: 'Self Driven',
      theme: 'Technology & Innovation',
      resourcePerson: 'Dr. P. Dhilip Kumar, Mrs. C. Prema, Mrs. Priscilla Sophia, Mrs. Renita Pearlin',
      designation: 'EE-VDT faculty members',
      organization: 'Sri Shakthi Institute of Engineering and Technology',
      speakerBio: 'The faculty members of the EE–VDT department conducted a hands-on training session on Front-End Digital Design using Cadence tools. They provided practical guidance on RTL design, Verilog coding, simulation, synthesis, and functional verification. Their industry-oriented approach helped students strengthen their understanding of VLSI front-end design and gain practical exposure to EDA tools.',
      description: 'Students gained practical exposure to front-end digital logic design using Cadence tools, enhancing their understanding of RTL design, simulation, and verification.',
      highlights: [
        'Introduction to front-end design of digital logic circuits using Cadence tools.',
        'Hands-on exposure to RTL coding, simulation, and functional verification.',
        'Practical understanding of digital circuit design and implementation methodologies.',
        'Familiarization with industry-relevant EDA tools and VLSI design practices.',
        'Enhanced practical skills through hands-on learning and expert guidance.'
      ],
      outcomes: [
        'Students gained practical exposure to front-end digital logic design using Cadence tools, enhancing their understanding of RTL design, simulation, and verification. The workshop helped bridge theoretical knowledge with practical VLSI design applications and strengthened students’ confidence in using industry-relevant EDA tools.'
      ],
      students: 50,
      staff: 5,
      photos: [
        { src: '../assets/images/events/frontend-cadence/frontend-cadence-session.jpg', alt: 'A faculty member guides students during the front-end Cadence design session.' }
      ]
    },
    {
      id: 'synopsys-workshop',
      title: '5 Days Hands-on Workshop from RTL to GDS II Using Synopsys',
      dateLabel: '16.2.2026 – 20.02.2026',
      academicYear: '2025–2026',
      duration: 'Five Days',
      category: 'workshops',
      iicCategory: 'Self Driven',
      theme: 'Technology & Innovation',
      resourcePerson: 'Mr. Chethan Kumar N. S.',
      designation: 'Chief Technology Officer (CTO) & Lead Trainer',
      organization: 'VLSI Minds',
      speakerBio: 'Mr. Chethan Kumar N. S., CTO & Lead Trainer at VLSI Minds, is an experienced VLSI professional with expertise in analog layout and semiconductor design. He provides industry-oriented training in VLSI design methodologies and EDA tools, helping students gain practical exposure to real-world chip design.',
      description: 'Students gained practical insights into VLSI design and semiconductor technologies, with exposure to industry-relevant EDA tools and design methodologies.',
      highlights: [
        'Introduction to VLSI design methodologies and industry practices.',
        'Practical exposure to EDA tools and semiconductor design techniques.',
        'Insights into analog/custom layout, DRC, LVS, and physical verification.',
        'Interaction with an industry expert on VLSI career opportunities and skill development.'
      ],
      outcomes: [
        'Students gained practical insights into VLSI design and semiconductor technologies, with exposure to industry-relevant EDA tools and design methodologies. The session helped bridge academic concepts with real-world VLSI applications and motivated students to develop industry-ready skills.'
      ],
      students: 60,
      staff: 5,
      photos: [
        { src: '../assets/images/events/synopsys-workshop/synopsys-workshop-session.jpg', alt: 'An instructor leads the Synopsys RTL-to-GDS workshop in a VLSI lab.' }
      ]
    },
    {
      id: 'tecktors-kalam26',
      title: 'TECKTORS – CHIP CREATORS Kalam ’26 Workshop',
      dateLabel: '12.03.2026–13.06.2026',
      academicYear: '2025–2026',
      duration: 'Two Days',
      category: 'workshops',
      iicCategory: 'Self Driven',
      theme: 'Design an IC',
      resourcePerson: 'Mr. Navaneetha Krishnan',
      designation: 'Senior Application Engineer',
      organization: 'Entuple Technologies',
      speakerBio: 'Mr. V. Navaneetha Krishnan is a VLSI and semiconductor technology professional associated with Entuple Technologies. He has expertise in ASIC design flow, RTL synthesis, physical design, DFT, placement, clock tree synthesis, routing, and GDSII generation. He provides industry-oriented technical guidance and hands-on training, helping students understand the practical IC design flow from specification to GDSII.',
      description: 'Students gained practical exposure to the complete IC design flow, covering RTL synthesis, physical design, DFT, placement, routing, verification, and GDS II generation.',
      highlights: [
        'Introduction to the complete IC design flow from chip specification to GDS II.',
        'Hands-on exposure to design entry, functional verification, RTL synthesis, and chip partitioning.',
        'Practical understanding of DFT insertion, floorplanning, placement, CTS, and routing.',
        'Exposure to final verification and GDS II generation in the Cadence design environment.'
      ],
      outcomes: [
        'Students gained practical exposure to the complete IC design flow, covering RTL synthesis, physical design, DFT, placement, routing, verification, and GDS II generation. The workshop helped bridge theoretical VLSI concepts with industry-oriented chip design practices and enhanced students’ understanding of the ASIC design process.'
      ],
      students: 60,
      staff: 5,
      verificationNote: 'The report lists 12.03.2026–13.06.2026 and a two-day duration. The date range conflicts with the stated duration; it is shown as written and needs verification.',
      photos: [
        { src: '../assets/images/events/tecktors-kalam26/tecktors-kalam26-session.jpg', alt: 'Students attend the TECKTORS CHIP CREATORS workshop at SIET.' }
      ]
    },
    {
      id: 'backend-cadence',
      title: 'Back End Design of Digital Logic Circuits Using Cadence Tool',
      dateLabel: '12.06.2026 – 13.06.2026',
      academicYear: '2025–2026',
      duration: 'Two Days',
      category: 'technical-training',
      iicCategory: 'Self Driven',
      theme: 'Technology & Innovation',
      resourcePerson: 'Dr. P. Dhilip Kumar, Mrs. C. Prema, Mrs. Priscilla Sophia, Mrs. Renita Pearlin',
      designation: 'EE-VDT faculty members',
      organization: 'Sri Shakthi Institute of Engineering and Technology',
      speakerBio: 'The faculty members of the EE–VDT Department conducted hands-on training on Back-End VLSI Design using Cadence tools. They guided students through important physical design stages such as floorplanning, placement, clock tree synthesis, routing, timing analysis, and physical verification. Their practical guidance helped students understand the complete back-end design flow and develop industry-oriented skills in ASIC physical design.',
      description: 'Students gained practical exposure to back-end VLSI design using Cadence tools, covering floorplanning, placement, clock tree synthesis, routing, and physical verification.',
      highlights: [
        'Introduction to back-end design of digital logic circuits using Cadence tools.',
        'Hands-on exposure to floorplanning, placement, clock tree synthesis, and routing.',
        'Practical understanding of physical design and timing analysis in the VLSI flow.',
        'Introduction to physical verification and GDSII generation.',
        'Industry-oriented practical training to strengthen students’ VLSI physical design skills.'
      ],
      outcomes: [
        'Students gained practical exposure to back-end VLSI design using Cadence tools, covering floorplanning, placement, clock tree synthesis, routing, and physical verification. The workshop helped bridge theoretical knowledge with practical physical design and IC implementation skills.'
      ],
      students: 60,
      staff: 5,
      photos: [
        { src: '../assets/images/events/backend-cadence/backend-cadence-lab.jpg', alt: 'Students work in the Cadence lab during the back-end design workshop.' }
      ]
    },
    {
      id: 'chip-design',
      title: 'Chip Design Using Cadence Tool Chain (RTL to GDSII)',
      dateLabel: '16.07.2026 – 22.07.2026',
      academicYear: '2025–2026',
      duration: 'Five Days',
      category: 'technical-training',
      iicCategory: 'Self Driven',
      theme: 'Technology & Innovation / Chip Design',
      resourcePerson: 'Dr. P. Dhilip Kumar, Mrs. C. Prema, Mrs. Priscilla Sophia, Mrs. Renita Pearlin',
      designation: 'EE-VDT faculty members',
      organization: 'Sri Shakthi Institute of Engineering and Technology',
      speakerBio: 'The EE–VDT Department conducted a hands-on training programme on the complete Cadence VLSI design flow for internal students. The programme provided practical exposure to RTL design, simulation, synthesis, floorplanning, placement, clock tree synthesis, routing, timing analysis, physical verification, and GDSII generation. The training enabled students to understand the complete ASIC design flow and develop industry-oriented skills in VLSI design and implementation.',
      description: 'Students gained practical exposure to the complete chip design flow from RTL to GDSII using Cadence tools.',
      highlights: [
        'Hands-on training in RTL design and Verilog coding.',
        'Practical exposure to functional verification and logic synthesis using Genus.',
        'Training in STA, timing analysis, floorplanning, placement, and CTS.',
        'Hands-on exposure to global and detailed routing.',
        'Understanding of DRC, LVS verification, and GDSII generation.',
        'Complete overview of the Cadence RTL-to-GDSII tool chain and tape-out preparation.'
      ],
      outcomes: [
        'Students gained practical exposure to the complete chip design flow from RTL to GDSII using Cadence tools. The training strengthened their skills in Verilog, synthesis, physical design, timing analysis, verification, and GDSII generation, providing industry-oriented knowledge of the ASIC design process.'
      ],
      students: 30,
      staff: 5,
      verificationNote: 'The report lists 16.07.2026–22.07.2026 with a five-day duration, and its cover identifies the activities as Academic Year 2025–2026. Confirm the duration and academic-year assignment.',
      photos: [
        { src: '../assets/images/events/chip-design/chip-design-training.jpg', alt: 'Faculty lead a Cadence chip design tool-chain session in the VLSI lab.' }
      ]
    },
    {
      id: 'veltraxx26',
      title: 'VELTRAXX ’26 – 24 Hours Hackathon',
      dateLabel: '28.08.2026 – 29.08.2026',
      academicYear: '2025–2026',
      duration: '24 hours',
      category: 'hackathons',
      iicCategory: 'Self Driven',
      theme: 'Innovation & Entrepreneurship / Technology & Innovation',
      resourcePerson: 'Dr. P. Dhilip Kumar, Renita Pearlin',
      designation: 'EE faculty members',
      organization: 'Sri Shakthi Institute of Engineeing and Technology',
      speakerBio: 'The EE–VDT Department faculty organized a hands-on hackathon to encourage students to apply their technical knowledge in solving real-world engineering problems. The event provided an opportunity for students to work collaboratively, develop innovative solutions, and strengthen their skills in problem-solving, coding, VLSI design, and rapid prototyping.',
      description: 'Students gained practical experience in VLSI design, teamwork, coding, and problem-solving through a 24-hour intensive hackathon.',
      highlights: [
        '24-hour team-based VLSI hackathon focused on innovation and chip design.',
        'Participants developed solutions involving VLSI design, coding, and RTL-to-reality implementation.',
        'Encouraged students to design, develop, innovate, and solve real-world technical problems.',
        'Provided an opportunity for collaborative learning, rapid prototyping, and practical problem-solving.',
        'Prizes and e-certificates were provided to recognize participation and achievements.'
      ],
      outcomes: [
        'Students gained practical experience in VLSI design, teamwork, coding, and problem-solving through a 24-hour intensive hackathon. The activity encouraged innovation and helped participants apply their technical knowledge to develop real-world chip design solutions.'
      ],
      students: 150,
      staff: 0,
      staffLabel: 'NIL',
      verificationNote: 'The report labels this activity Academic Year 2025–2026 but dates it 28–29 August 2026. Confirm the academic-year assignment. The source also spells “Engineering” as “Engineeing” in the organization name.',
      photos: [
        { src: '../assets/images/events/veltraxx26/veltraxx26-team.jpg', alt: 'A VELTRAXX ’26 team works together on a laptop during the hackathon.' },
        { src: '../assets/images/events/veltraxx26/veltraxx26-workshop.jpg', alt: 'VELTRAXX ’26 participants collaborate on their hackathon work.' }
      ]
    }
  ];
}(window));

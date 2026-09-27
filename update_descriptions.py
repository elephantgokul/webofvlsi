import json, re

with open("js/api.js", "r", encoding="utf-8") as f:
    content = f.read()

# Expanded achievement + description data for each student (from user's original request)
updates = {
    "24VL036": {  # SANKAMES VS
        "achievement": "Designed and developed a Digital Clock Simulation project that displays the current time in digital format using hours, minutes, and seconds. The clock continuously updates the time and demonstrates the working of digital time-display systems.\n\nObjectives:\n- To design and develop a simple digital clock system\n- To display hours, minutes, and seconds accurately\n- To understand the working of digital time-display systems\n- To learn how timing and counting operations are used in digital systems\n- To provide a simple and user-friendly digital clock simulation",
        "description": "A Digital Clock Simulation is a project that displays the current time in digital format using hours, minutes, and seconds. The clock continuously updates the time and can be implemented using programming or digital electronic components. This project demonstrates understanding of timing, counting operations, and digital display systems."
    },
    "24VL029": {  # V T RAGHUL VASUN
        "achievement": "Completed multiple technical internships and training programs:\n- Chip Crafts – VLSI Layout Internship\n- Career Ladder – Java Programming\n- ENTHU – Internship / Technical Training\n- Manfree – Internship / Technical Training\n- SM MOJO TECH – Internship / Technical Training\n\nWorkshops:\n- FPGA Altera Workshop – Chip Crafts\n- Synopsys EDA Tools Workshop\n- Cadence EDA Tools Workshop",
        "description": "1. 8-bit ALU: Design an 8-bit Arithmetic Logic Unit capable of performing arithmetic and logical operations using synthesizable RTL. Objectives include implementing arithmetic and bitwise logic operations, developing operation selection and status flag logic, verifying the ALU using a functional testbench, and synthesizing and analyzing the gate-level implementation.\n\n2. Booth Multiplier: Design a signed Booth Multiplier for efficient binary multiplication, focusing on arithmetic datapath design and ASIC synthesis. Objectives include implementing signed multiplication using Booth's algorithm, developing partial-product and control logic, verifying the multiplier for different input conditions, and analyzing synthesized timing and area characteristics.\n\n3. TCAM: Design a Ternary Content-Addressable Memory architecture that supports parallel pattern matching using binary and don't-care states. Objectives include implementing ternary comparison and search logic, developing match-line evaluation and result generation, verifying exact matches, masked matches, and no-match conditions, and analyzing the RTL architecture using ASIC synthesis tools."
    },
    "24VL016": {  # Kavya M
        "achievement": "1. ROBOCHIPX – A 24-Hours Hackathon (AI / CHIP / ROBOTICS) at Rajalakshmi Institute of Technology, Chennai – July 9 & 10, 2026 (2 days)\n2. RISC-V Hands-on Training Workshop at IIT Madras – March 21 & 22, 2026 (2 days)\n3. ECE Paper Presentation at FIESTAA'26, KPR Institute of Engineering and Technology – February 20 & 21, 2026\n4. ECE Workshops at FIESTAA'26, KPR Institute of Engineering and Technology – February 20 & 21, 2026\n5. Custom IC Design Mastery using Cadence EDA Tools at Sri Shakthi Institute (Abhiyantha / Entuple Technologies) – December 11–23, 2025 (13 days)\n6. VLSI Test Workshop at PSG College of Technology (IEEE TTTC) – October 10–12, 2025 (3 days)\n7. VLSI DAY 2025 at PSG College of Technology (VLSI Society of India) – September 20, 2025\n8. VDAT 30th Conference Fellowship at Jaypee Institute of Information Technology – August 20–22, 2025 (3 days)\n9. On-Campus Training: Chip Design using Cadence Tool Chain (RTL to GDSII) – July 16–22, 2026 (7 days)\n10. Workshop Fiasta at KPR Institute of Engineering and Technology – February 20 & 21",
        "description": ""
    },
    "24VL043": {  # Subhashini N
        "achievement": "Workshops:\n- PCB Design and Fabrication at KPR Institute of Engineering and Technology – March 14, 2025 (1 day)\n- VLSI TEST Workshop at PSG College of Technology – October 10–12, 2025 (3 days)\n- VLSI Design Flow from RTL to GDS at Chipxpert Technologies – November 1–2, 2025 (2 days)\n- Code to Chip: RTL to GDS flow using Synopsys tools at VLSI Minds – February 16–20, 2026 (5 days)\n- Digital Hardware Design and Implementation with Altera (Intel) FPGAs at Chipcrafts – November 18–19, 2025 (2 days)\n\nInternships:\n- Chip Crafts – VLSI Layout Design (September 3–10, 2025)\n- Career Ladder – Programming Paradigm using Java (September 11–16, 2025)\n- EnthuTech – PCB Designing",
        "description": "1. RTL-to-GDSII Implementation of a Low-Power Edge-AI Safety Monitoring SoC for Real-Time Emergency Detection Using Synopsys ASIC Flow\n\n2. Design and FPGA/ASIC Implementation of an Edge-AI SoC for Advanced Driver Assistance Systems (ADAS) (Group Project)"
    },
    "24VL052": {  # Varsha V R
        "achievement": "Internships:\n- SystemVerilog Internship at SM AI MOJO TECH\n- STM32 Microcontroller Design Intern at Manfree Technology\n- PCB Design & Fabrication Intern at Enthu EdTech\n- Embedded Systems Intern at Manfree Technology\n- Basic Java Programming Intern at Career Ladder\n- VLSI Layout Design Intern at Chip Crafts\n\nWorkshops:\n- Code to Chip – RTL to GDS Flow Using Synopsys Tools\n- Workshop on Digital Hardware Design with Altera (Intel) FPGAs\n- VLSI Test Workshop at PSG College of Technology\n\nHackathons:\n- RoboChipX at Rajalakshmi Institute of Technology, Chennai",
        "description": "Project 1: Adaptive Dynamic-Precision Sparse Neural Network Accelerator for Edge AI – Designed a neural network accelerator architecture utilizing dynamic precision scaling and sparsity techniques to improve computational efficiency and reduce power consumption. Implemented adaptive precision control and sparse data processing mechanisms. Developed and validated using Verilog HDL and the Synopsys RTL-to-GDSII ASIC design flow.\n\nProject 2: AMBA AXI4-Lite Master and Slave Interface Design – Designed and implemented an AMBA AXI4-Lite compliant Master and Slave interface for memory-mapped communication using Verilog HDL. Developed and verified read/write transaction handling, address decoding, and control logic. Synthesized through the Synopsys RTL-to-GDSII ASIC flow.\n\nProject 3: SPI Protocol Controller Design – Designed and implemented an SPI controller using Verilog HDL for synchronous serial communication between master and slave devices. Successfully completed ASIC implementation using the Tiny Tapeout flow, generating and analyzing the final GDSII chip layout and 3D visualization."
    },
    "24VL053": {  # Winston Churchil
        "achievement": "Developing innovative web-based projects combining 3D visualization and AI technologies for career guidance and portfolio presentation.",
        "description": "3D Portfolio Websites and AI Career Roadmap Generator Web Application – Developing interactive 3D portfolio websites and an AI-powered career roadmap generator web application that helps users visualize career paths and plan their professional development."
    },
    "24VL025": {  # K.R.Nitin
        "achievement": "Completed various internships and workshops related to VLSI design and semiconductor technology.",
        "description": "RTL-to-GDSII Design and Physical Implementation of a 16-bit Multiply-Accumulate Unit Using the Synopsys ASIC Design Flow – This project presents the design and physical implementation of a 16-bit Multiply-Accumulate (MAC) unit realized through a complete RTL-to-GDSII ASIC design flow using industry-standard Synopsys EDA tools. The MAC unit, described in synthesizable Verilog HDL, computes the product of two 16-bit operands and accumulates the result in a 32-bit register under the control of a four-state Moore finite-state machine (FSM). Functional correctness was verified using Synopsys VCS, and the design was synthesized with Synopsys Design Compiler."
    },
    "24VL033": {  # Sakthishree D
        "achievement": "Academic Excellence: 1st Semester – 3rd Rank Holder; 2nd, 3rd & 4th Semester – 1st Rank Holder.\n\nInternships:\n- Chip Crafts – VLSI Design Layout\n- Manfree – Embedded Systems\n- Career Ladder – OOPS in Java\n- Enthu Technologies – PCB Designing\n- SM AI MOJO Tech – System Verilog and Basics of Digital Electronics\n\nWorkshops:\n- Industrial IOT Using LORAWAN Technology\n- STM32 & Renesas-based Embedded System\n- Emboss in IOT (Arduino)\n- Digital Hardware Design and Implementation with Altera FPGA\n\nCertifications:\n- VLSI on Chip Design by Maven Silicon\n- RISC-V Processor RV321 Base ISA by Maven Silicon\n- Verilog HDL – Udemy\n- Static Timing Analysis – Udemy",
        "description": "1. 32-bit RISC V BASED ADAPTIVE PRECISION ACCELERATOR using AMBA APB protocol\n2. Multi-GPU Architecture with Predictive Task Migration and Fault-Tolerant Resource Management\n3. Build In Self Test Controller For ALU Verification\n4. Communication Protocols – UART, SPI, MAC, BOOTH MULTIPLIER"
    },
    "24VL017": {  # Kiruthika S
        "achievement": "10-Day Cadence VLSI Design Workshop – Entuple Technologies\n2-Day IoT Workshop – KALAM 2025\n2-Day FPGA Workshop – Chip Crafts\n1-Month Top-Out Training\n\nInternship/Training Certificates from Career Ladder, Enthu Tech, Embuzz Technologies, Chip Crafts, Manfree Technologies, SM AI MOJO TECH, and Maven Silicon\n\nCGPA: 8.77",
        "description": "1. Fault Controller for Medical Devices – Designed a safety-oriented controller to monitor critical system signals, detect faults, and automatically switch the system to a predefined safe state.\n2. Automatic Timetable Management System using Tcl – Developed an automated timetable management system using Tcl/Tk and database integration.\n3. Automatic Attendance Management System using Perl – Developed an automated attendance management system using Perl.\n4. Booth Multiplier – Designed an RTL-based Booth multiplier for efficient signed binary multiplication.\n5. Pipelined Digital Design – Designed a pipelined digital architecture by dividing computation into multiple stages using registers.\n6. SPI Protocol – Designed an RTL-based SPI communication interface for serial data transfer.\n7. BIST – Built-In Self-Test – Designed a BIST architecture for testing digital circuits using test-pattern generation and response analysis.\n8. UART Communication – Designed an RTL-based UART transmitter and receiver for asynchronous serial communication.\n9. AXI4-Lite Interface – Designed an AXI4-Lite interface for register-level read and write communication.\n10. MAC Unit – Designed a Multiply-Accumulate unit for digital signal-processing applications.\n11. CAN Protocol – Designed and studied a CAN communication module for reliable communication between multiple electronic control units."
    },
    "24VL032": {  # Roobashri S
        "achievement": "Workshops:\n- PCB Design and Fabrication at KPR Institute of Engineering and Technology – March 14, 2025\n- VLSI TEST Workshop at PSG College of Technology – October 10–12, 2025\n- VLSI Design Flow from RTL to GDS at Chipxpert Technologies – November 1–2, 2025\n- Code to Chip: RTL to GDS flow using Synopsys tools at VLSI Minds – February 16–20, 2026\n- Digital Hardware Design with Altera (Intel) FPGAs at Chipcrafts – November 18–19, 2025\n\nInternships:\n- Chip Crafts – VLSI Layout Design (September 3–10, 2025)\n- Career Ladder – Programming Paradigm using Java (September 11–16, 2025)\n- EnthuTech – PCB Designing\n\nHackathon:\n- Bharat AI-Soc Student Challenge (January–March 2026)",
        "description": "1. A Reconfigurable Neuromorphic Processor with Dynamic Synaptic Adaptation for Energy-Efficient Edge AI using Synopsys – A reconfigurable neuromorphic processor that mimics brain-inspired neural processing using adaptive synaptic weights and neuron models for energy-efficient and low-latency edge AI processing.\n\n2. STM32F446RE PCB Controller Board — 6-Axis Robotic Arm – Designed and developed a custom multilayer STM32F446RE controller PCB in Altium Designer for synchronized control of a 6-axis robotic arm. Integrated motor-control interfaces and CAN communication.\n\n3. Smart 3S BMS with AI-Based SOC/SOH Estimation (Ongoing) – A dual-MCU PCB (STM32F446RE + ESP32-WROOM-32) for 3S Li-ion battery management, combining real-time protection with AI-based state estimation. Designed in KiCad."
    },
    "24VL040": {  # Soorya Velaa P
        "achievement": "Workshops:\n- 10-day Cadence Workshop\n- 2-day IOT Workshop (KALAM 2025)\n- 2-day Workshop on FPGA by Chip Crafts\n\nTraining Certificate:\n- 10-day Cadence Workshop by Entuple Technologies\n\nInternship Certificates:\n- Career Ladder\n- Enthu Tech\n- Embuzz Technologies\n- Chip Crafts\n- Manfree Technologies\n- SM AI MOJO TECH\n\nAchievements:\n- NCC CADET – B Certificate holder with A grade",
        "description": "Projects: Booth Multiplier, Pipeline Design, SPI Protocol, MFCC Accelerator"
    },
    "24VL041": {  # SRI VATSAN P
        "achievement": "Internships / Industrial Training:\n- Embuzz Technologies Pvt. Ltd. – Embedded Programming using Arduino\n- Chip Craft – VLSI Layout Design & FPGA Implementation\n- Manfree Technologies – Embedded Programming & 8086 Microprocessor\n- Enthu Technology – PCB Design using KiCad\n- Career Ladder – C Programming\n- SM MOJO TECH – Internship Training\n\nWorkshops & Training:\n- Hardware Design and Implementation with Altera (Intel) FPGAs\n- Synopsys ASIC Design Flow Training\n- Cadence VLSI Design and Verification Training\n\nHackathons:\n- 24-Hour Hackathon – RIT College\n\nCertifications:\n- Synopsys ASIC Design Flow Certification\n- Government SoC Project Certification\n- Digital Hardware & FPGA Implementation Certification\n- VLSI Layout Design Certification\n- Embedded Systems & Arduino Certification\n- SystemVerilog Training Certificate\n- Arduino Programming Certificate",
        "description": "1. Configurable Dynamic Memory-Aware AXI4-Stream Sparse Matrix Acceleration Engine – Design and implement a configurable sparse matrix acceleration engine using AXI4-Stream, dual-bank ping-pong memory, and adaptive clock gating for efficient data processing.\n\n2. DDR SDRAM Controller Using Synopsys – Design and implement a DDR SDRAM controller using Verilog HDL and Synopsys ASIC design tools for efficient memory access and control.\n\n3. AXI Bus Protocol Controller (AMBA Interface) – Design and implement an AXI-based bus protocol controller using SystemVerilog.\n\n4. QoS-Aware AXI4 Interconnect with Adaptive Arbitration – Design and implement a QoS-aware AXI4 interconnect using SystemVerilog.\n\n5. ECC-Based Self-Scrubbing SRAM Memory IP – Design an SRAM memory IP with Error Correcting Code (ECC) and self-scrubbing functionality."
    },
    "24VL026": {  # Pratheep D
        "achievement": "- Completed MATLAB Onramp Certification\n- Participated in an Inter-College Cadence Workshop covering Verilog HDL, testbench development, logic gates, Half Adder design, Xcelium simulation, and code coverage\n- Completed training in RISC Processor Architecture\n- Completed Java training through Career Ladder\n- Participated in VLSI-related academic and technical activities\n- Developed and worked on VLSI/embedded projects involving Verilog, Arduino, MATLAB, Proteus, Quartus, Microwind, and Cadence tools",
        "description": "RTL-to-GDSII Implementation of a Sparse Multi-Head Attention Accelerator for Transformer-Based Large Language Model Inference Using Cadence Flow – This project focuses on designing and implementing a hardware accelerator for sparse multi-head attention, an important computation used in Transformer-based AI and Large Language Models. The project aims to develop the design from RTL using SystemVerilog/Verilog through synthesis and physical design toward GDSII, using the Cadence design flow.\n\nObjectives:\n- Design the sparse attention architecture at RTL level\n- Implement modules for attention-score calculation, scaling, sparse masking, softmax approximation, and value multiplication\n- Verify the RTL functionality using simulation and testbenches\n- Perform RTL synthesis and physical design using Cadence tools\n- Study the complete RTL-to-GDSII implementation flow\n- Explore hardware architectures suitable for efficient and low-power AI acceleration"
    },
    "24VL028": {  # PUGAZHENDHI S
        "achievement": "- Chip Design Using Cadence Tool Chain (RTL to GDSII) – Sri Shakthi Institute, on-campus training, July 2026\n- Back-End Design of Digital Logic Circuits Using Cadence – Chip to Start-Up, June 2026\n- VLSI Layout Design Internship – Chip Crafts, September 2025\n- Embedded Systems Internship – Manfree Technologies, October 2025\n- Digital Hardware Design & FPGA Workshop – Chip Crafts, November 2025\n- Programming Paradigms Using Java – Career Ladder, September 2025",
        "description": "1. RISC-V Processor with External Memory and INT8 Systolic Array Accelerator for Edge AI – Computer Architecture / ASIC Design\n2. PPA Optimization of a Hardware Accelerator for Real-Time Agricultural Drone Image Analysis – VLSI Design\n3. Low Power 8-bit ALU – RTL-to-GDSII, 90nm\n4. Serial Peripheral Interface (SPI) Controller – RTL-to-GDSII, 90nm\n5. Traffic Flow Controller – FSM / Digital Design\n6. 8:1 Multiplexer - Schematic to Layout – CMOS / VLSI Layout"
    },
    "24VL021": {  # Mohammed Ayman M
        "achievement": "- VLSI & Semiconductor Domain Projects – Developed and explored practical projects focused on VLSI, digital design, embedded systems, and semiconductor-oriented applications\n- VLSI Internship – SM AI Mojo Tech – Gained practical exposure to VLSI concepts, semiconductor design methodologies, digital logic, and industry-oriented workflows\n- SEMICON / Semiconductor Hackathon Participation – Worked on SEMIRESTORE-AI, an AI-assisted semiconductor inspection concept\n- AI + VLSI Project Development – Explored the integration of AI and Computer Vision with semiconductor inspection and manufacturing\n- Technical Workshops & Hands-on Learning – Participated in technical learning activities covering VLSI design, FPGA, digital systems, embedded systems, AI/ML",
        "description": "SEMIRESTORE-AI: AI-Based Restoration of Degraded Images for Semiconductor Inspection – An AI-driven semiconductor inspection solution designed to enhance degraded inspection images affected by noise, low resolution, and image-quality limitations. The system focuses on restoring important visual features and improving the quality of semiconductor images to support reliable defect identification and analysis.\n\nObjectives:\n- Develop an AI-based image restoration pipeline for degraded semiconductor inspection images\n- Reduce noise and improve image quality while preserving critical semiconductor features\n- Enhance edges, patterns, and structural information required for defect analysis\n- Explore Computer Vision and Deep Learning techniques for semiconductor inspection\n- Build a foundation for intelligent, automated, and scalable semiconductor inspection systems"
    },
    "24VL050": {  # S. Thirumurugan
        "achievement": "Internships, Training & Technical Programs:\n- Chip Crafts – VLSI Layout Internship\n- Embuzz Technologies – Arduino GPIO Programming\n- Career Ladder – Java Programming\n- ENTHU – Internship / Technical Training\n- Manfree – Internship / Technical Training\n- SM MOJO TECH – Internship / Technical Training\n\nWorkshops:\n- FPGA Altera Workshop – Chip Crafts\n- Synopsys EDA Tools Workshop\n- Cadence EDA Tools Workshop",
        "description": "1. RISC-V CPU – Design and develop a RISC-V processor using Verilog/SystemVerilog, with a focus on processor architecture, functional verification, and ASIC implementation.\n\n2. Secure VPU – Design a Secure Vector Processing Unit with parallel vector computation and hardware security mechanisms for secure processing and data protection.\n\n3. 8-bit ALU – Design an 8-bit Arithmetic Logic Unit capable of performing arithmetic and logical operations using synthesizable RTL.\n\n4. Booth Multiplier – Design a signed Booth Multiplier for efficient binary multiplication, focusing on arithmetic datapath design and ASIC synthesis.\n\n5. TCAM – Design a Ternary Content-Addressable Memory architecture that supports parallel pattern matching using binary and don't-care states."
    },
    "24VL034": {  # SANJEEV GH
        "achievement": "Internships:\n- ChipCrafts – VLSI Internship (Microwind, digital circuit design, layout implementation)\n- Manfree Technologies – Embedded Systems Internship\n- Enthu Technology – PCB Design & Assembly Internship\n- Career Ladder – Java Internship\n- SM AI MOJO TECH – SystemVerilog Internship\n\nTechnical Achievements:\n- Completed 53+ VLSI projects using industry-standard tools including Synopsys and Cadence\n- Completed 3 industry-level VLSI projects with complete ASIC design flow\n- Developed BatterySense X – achieved 91.94% core utilization, zero DRC violations, and 0.0000 WNS after CTS optimization\n- Presented BatterySense X at department-level HR Conclave\n- Developed multiple Embedded Systems projects using Arduino, sensors, relays, motors\n- Developed ECG Signal Power-Line Noise Removal system using MATLAB\n- Worked on SpaceEdgeX exploring AI, edge computing, hardware acceleration, and space-based computing",
        "description": "1. BatterySense X – Intelligent Battery Sensing & Health Monitoring ASIC: An ASIC design project focused on battery sensing and health monitoring, implemented through the VLSI design flow from RTL to GDSII. Achieved 91.94% core utilization, generated GDSII, zero DRC violations.\n\n2. ECG Signal Power-Line Noise Removal: A MATLAB-based DSP project using a notch filter to remove power-line noise from ECG signals.\n\n3. SpaceEdgeX: An innovative concept exploring AI, edge computing, hardware acceleration, and space-based computing for next-generation applications.\n\n4. Embedded Systems Projects: Multiple hardware-based projects developed using Arduino, sensors, relays, motors, and other electronic components."
    },
    "24VL037": {  # Santhosh Kumar S
        "achievement": "- 2nd Place – Cognicode Hackathon, NEXUS 2K26, GCT, Coimbatore\n- Participant – NeuraNexus 2K25, KPR Institute of Engineering and Technology\n- Participant – Hack Nexus 2025, Sri Ramakrishna College of Arts & Science\n- Embedded Systems Internship – Manfree Technologies\n- VLSI Layout Design Internship – Chip Crafts\n- Industrial Training in Java – Career Ladder\n- Custom IC Design using Cadence EDA Tools – Entuple Technologies\n- Digital Hardware Design with Altera (Intel) FPGAs – Chip Crafts\n- Java (Basic) Certification – HackerRank",
        "description": "1. EventLens AI – Selfie-Based Event Photo Finder: An AI-powered platform that uses FaceNet and facial recognition to find a user's photos from large event galleries using a single selfie. Built with Next.js, FastAPI, PyTorch and OpenCV.\n\n2. SGPA / CGPA Calculator Web App: A student-focused web application for calculating SGPA and CGPA, with secure login and saved semester history. Developed as a major project and deployed as a live web application.\n\n3. Health Buddy – AI-Driven Public Health Chatbot: An AI-based chatbot designed for public health and disease awareness. The project was developed as an innovation/research project and presented as a paper at ICIES 2025."
    }
}

# Apply updates
for roll_no, data in updates.items():
    # Find and replace achievement
    if data.get("achievement"):
        # Find the student block by registerNo
        pattern = f'"registerNo": "{roll_no}"'
        if pattern in content:
            # Find achievement field for this student
            idx = content.index(pattern)
            # Find the achievement field after this point
            ach_start = content.index('"achievement":', idx)
            # Find the value (everything between the quotes after the colon)
            val_start = content.index('"', ach_start + len('"achievement":'))
            val_end = val_start + 1
            depth = 0
            while val_end < len(content):
                if content[val_end] == '\\':
                    val_end += 2
                    continue
                if content[val_end] == '"':
                    break
                val_end += 1
            old_val = content[val_start:val_end+1]
            new_val = json.dumps(data["achievement"])
            content = content[:val_start] + new_val + content[val_end+1:]
            print(f"Updated achievement for {roll_no}")
    
    if data.get("description"):
        pattern = f'"registerNo": "{roll_no}"'
        if pattern in content:
            idx = content.index(pattern)
            desc_start = content.index('"description":', idx)
            val_start = content.index('"', desc_start + len('"description":'))
            val_end = val_start + 1
            while val_end < len(content):
                if content[val_end] == '\\':
                    val_end += 2
                    continue
                if content[val_end] == '"':
                    break
                val_end += 1
            old_val = content[val_start:val_end+1]
            new_val = json.dumps(data["description"])
            content = content[:val_start] + new_val + content[val_end+1:]
            print(f"Updated description for {roll_no}")

with open("js/api.js", "w", encoding="utf-8") as f:
    f.write(content)

print("\nDone! All descriptions expanded.")

-- 20261114140000_seed_students_data.sql
-- Seed all 28 students into public.students table with upsert on (name, batch).
-- All 28 students have photo_url set to their public bucket URL in https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/
-- Local asset filenames are preserved in the image column as fallback.

BEGIN;

INSERT INTO public.students (
  name, programme, year, batch, achievement_title, achievement, description,
  projects_overview, image, photo_url, linkedin, linkedin_url, github_url
)
VALUES
  ('Harini D', 'B.E. EE (VDT)', 'III Year', '2024 - 2028', 'Industrial Training & Workshop Certification in VLSI', 'Designed and implemented a High-Speed AMBA AXI4 Interconnect for SoC applications as an individual academic project, covering RTL design in Verilog HDL and the complete ASIC physical design flow  -  synthesis, placement, clock tree synthesis, routing, and timing analysis  -  using Synopsys tools including VCS, Design Compiler, IC Compiler II, PrimeTime, and Verdi, with a focus on optimizing area, timing, and power.

Completed 4 technical internships/trainings covering:
- VLSI Layout Design and Digital & Hardware Implementation with Altera (Intel) FPGA at Chip Craft
- PCB design and fabrication practices at Enthutech
- Verilog HDL/SystemVerilog hands-on training at SM AI Mojo Tech
- Circuit design and simulation using Proteus at Manfree

Also participated in a seminar on:
"Trends Towards 6G and AI Integration"

This reflects continuous engagement with emerging technologies alongside core VLSI design expertise.', NULL, 'High-Speed AMBA AXI4 Interconnect for SoC; FPGA Implementation', 'harini-d.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/harini.jpeg', NULL, NULL, NULL),
  ('Tharun M', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Industrial Training, Internships & VLSI Projects', '- Completed VLSI Layout Design Internship and gained practical semiconductor design experience.
- Completed Verilog HDL & SystemVerilog Internship with RTL design exposure.
- Completed PCB Design Internship using KiCad.
- Completed Embedded Systems Internship with Arduino and microcontroller applications.
- Developed technical projects including:
  - 16-bit RISC Processor
  - UART
  - 6T SRAM Cell', NULL, '16-bit RISC Processor, UART Controller, 6T SRAM Cell', 'tharun-m.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/tharunm.jpeg', 'https://www.linkedin.com/in/tharun-m-a88691413', 'https://www.linkedin.com/in/tharun-m-a88691413', NULL),
  ('Nithikkannan J S', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Industrial Training & Workshop Certifications in VLSI', '- Participated in the VLSI Test Workshop at PSG College of Technology organized by IEEE Computer Society TTTC.
- Completed Custom IC Design Mastery using Cadence EDA Tools training by Abhiyantha / Entuple Technologies.
- Completed an Internship Program in VLSI Layout Design with Chip Crafts.', NULL, 'Custom IC Design using Cadence EDA Tools; VLSI Layout', 'nithikkannan-js.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/nithik.jpeg', 'https://www.linkedin.com/in/nithikkannan-j-s-90b47a334', 'https://www.linkedin.com/in/nithikkannan-j-s-90b47a334', NULL),
  ('Suman', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Technical Workshops & Hackathons', '- Attended a 15-day Cadence Workshop conducted by Entuple.
- Participated in a 24-hour Hackathon at RIT Chennai.
- Participated in a Hackathon at KPR Institute of Engineering and Technology.', NULL, 'Cadence ASIC Design, 24-hour Hackathon IoT Prototype', 'suman.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/suman.jpeg', NULL, NULL, NULL),
  ('Anand K', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'VLSI Engineering, Technical Training & Industry Exposure', 'Developed a strong foundation in VLSI Design, Digital Electronics, CMOS fundamentals, and ASIC design flow.

Gained hands-on exposure to Verilog and SystemVerilog, including combinational and sequential RTL design and testbench development.

Studied and practiced the RTL-to-Gate-Level Synthesis flow, including RTL translation, optimization, and technology mapping.

Gained knowledge of Static Timing Analysis (STA), including setup time, hold time, timing constraints, and timing violations.

Acquired practical exposure to Cadence EDA tools and semiconductor design workflows.

Worked with MATLAB for signal processing concepts including convolution, FFT, frequency response, and signal analysis.

Gained experience with Proteus simulation for digital and embedded-system-based circuit implementations.

Completed multiple technical internships/training programs with:
- Enthu Tech
- Manfree
- Career Ladders
- SM AI MOJO TECH
- ChipCrafts

Continuously developing skills in RTL Design, Verification, Synthesis, STA, SystemVerilog, and EDA tools with the goal of pursuing a career in the semiconductor/VLSI industry.', 'Motivated and enthusiastic VLSI Engineering student with a strong foundation in Digital Electronics, VLSI Design, RTL Design, Verilog/SystemVerilog, Synthesis, and Static Timing Analysis (STA).

Possess hands-on exposure to EDA tools, MATLAB, Proteus, and semiconductor design concepts through academic projects, technical training, and internships.

Completed multiple industry-oriented training programs with Enthu Tech, Manfree, Career Ladders, SM AI MOJO TECH, and ChipCrafts.

A quick learner with a strong interest in ASIC Design, RTL Development, Verification, and Semiconductor Technologies, seeking opportunities to apply technical knowledge and develop practical expertise in the VLSI industry.', 'RTL-to-GDSII ASIC Flow, SystemVerilog Verification, Static Timing Analysis', 'anand-k.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/anand.jpeg', 'https://www.linkedin.com/in/anand-k-bb0907338/', 'https://www.linkedin.com/in/anand-k-bb0907338/', NULL),
  ('Udhaya R', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Synopsys VLSI Training & RTL-to-GDSII Project', 'Completed industrial Synopsys training on the RTL-to-GDSII design flow and gained hands-on experience in RTL design, simulation, synthesis, and physical design concepts.

Worked on VLSI projects including:
- DDR Controller
- Mini RISC-V Processor', NULL, 'DDR Memory Controller, Mini RISC-V Processor Core', 'udhaya-r.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/udhaya.jpeg', 'https://www.linkedin.com/in/udhaya-r-27726a367', 'https://www.linkedin.com/in/udhaya-r-27726a367', NULL),
  ('Tharum R.M', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'VLSI, Semiconductor Training, RTL-to-GDS & Technical Projects', 'Completed 6 technical internships, workshops and industrial training programs in VLSI, semiconductor technology, PCB design, embedded systems and RTL-to-GDS design.

Completed Code to Chip  -  RTL to GDS Flow Using Synopsys Tools industry-oriented workshop conducted by VLSIMINDS, Bangalore.

Completed VLSI Layout Design Internship at Chip Crafts, gaining practical exposure to VLSI layout methodologies.

Completed a 2-week PCB Design and Fabrication Internship through Enthu-EdTech.

Completed Semiconductor & Manufacturing Workshop conducted by Ethical Edufabrica in association with Mechanica, IIT Madras.

Completed Embedded Programming for Arduino GPIOs training at Embuzz Technologies.

Participated in a PCB Design and Fabrication Workshop at KPR Institute of Engineering and Technology.

Successfully developed multiple RTL/VLSI projects using Verilog, SystemVerilog and Synopsys EDA tools, including:
- NoC Router
- AMBA APB Controller
- Automotive ADAS Processing Unit

Worked on real-time VLSI design and verification projects covering RTL simulation, synthesis, timing analysis and physical design concepts.

Developed an AI Accelerator / Matrix Multiplication Processing Unit using a systolic-array architecture as an advanced VLSI project.

Gained hands-on exposure to:
- Synopsys Design Compiler
- ICC2
- VCS
- Verdi

through academic and project-based work.', '- Offline workshop at college for Digital Hardware Implementation with Altera FPGAs  -  2 days
- Coordinated Cadence workshop conducted in college and mentored participants  -  2 days
- Completed System-on-Chip project: Hand Gesture Control using Jetson Nano
- Attended 4 internships
- Coordinator of DM Club in college', 'NoC Router, AMBA APB Controller, Systolic AI Accelerator', 'tharum-rm.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/tharunrm.jpeg', NULL, NULL, NULL),
  ('Tharun R', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'VLSI Internships, Synopsys Workshops & Technical Projects', 'Attended 6 technical internships in areas such as VLSI Design, Embedded Systems, PCB Design, and software technologies, gaining practical industry exposure.

Participated in a 2-day offline workshop at IIT Madras, a 5-day hands-on training program on Synopsys EDA tools, and a 2-day workshop on Digital Hardware Implementation using Altera (Intel) FPGAs.

Served as a Student Presenter at the PCB LAB Tech Park Inaugural Event, showcasing technical knowledge and project skills.

Completed 3 real-time VLSI projects using Synopsys tools and currently working on 4 additional projects to enhance design and verification expertise.

Additionally, completed 8 examinations under Madras Prachar Sabha for Hindi proficiency, demonstrating dedication towards language learning and continuous skill development.', '6 technical internships in areas such as VLSI Design, Embedded Systems, PCB Design, and software technologies. 3 real time projects using Synopsys EDA tools and working on advanced semiconductor architectures.', 'Real-time Synopsys VLSI Architectures, Digital FPGA Hardware', 'tharun-r.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/tharunr.jpeg', 'https://www.linkedin.com/search/results/all/?keywords=Tharun%20Rajesh', 'https://www.linkedin.com/search/results/all/?keywords=Tharun%20Rajesh', NULL),
  ('Kamalesh VK', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Technical Internships & Industry-Oriented Training', 'Successfully completed technical internships and training programs at:
- Manfree Technologies  -  Technical Internship
- Career Ladder  -  Technical Training Program
- AI Mojo Tech  -  Artificial Intelligence Training
- Chip Craft  -  VLSI & Semiconductor Design Training

Gained practical exposure to:
- Embedded Systems
- IoT
- Artificial Intelligence
- VLSI Design
- RTL Coding
- Semiconductor Technologies

Developed hands-on experience through industry-oriented projects, technical workshops, hardware and software implementation, and real-time problem-solving activities.

These internships strengthened programming, digital design, analytical thinking, teamwork, and professional skills while providing valuable exposure to current industrial practices and emerging technologies.', NULL, 'IoT & Embedded VLSI RTL Subsystems, AI Mojo Tech Hardware', 'kamalesh-vk.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/kamalesh.jpeg', NULL, NULL, NULL),
  ('Gokul P', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'AI Attendance & Money Management Systems, 6 Internships', '1. Attendance Monitoring System - Developed AI Attendance Monitoring System
2. Money Management System - Built Money Management System
3. Internships - Completed 6 Industry Internships
4. Technical Skills - Developed Strong VLSI & Software Skills', 'Designed and deployed a web-based attendance management system with real-time tracking, advisor dashboard, and automated reports. Created a web application for expense tracking, budget planning, and monthly financial reports. Gained hands-on experience in VLSI, Digital Hardware Design, SystemVerilog, PCB Design, Embedded Systems, Python, and OOP. Built expertise in SystemVerilog, Digital Hardware Design, Python, Web Development, and GitHub through projects and internships.', 'AI Attendance System, Money Management System, SIET VLSI Portal', 'gokul.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/gokul.jpeg', NULL, NULL, 'https://github.com/elephantgokul'),
  ('SANKAMES VS', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Project: Digital Clock Simulation', 'Designed and developed a Digital Clock Simulation project that displays the current time in digital format using hours, minutes, and seconds. The clock continuously updates the time and demonstrates the working of digital time-display systems.

Objectives:
- To design and develop a simple digital clock system
- To display hours, minutes, and seconds accurately
- To understand the working of digital time-display systems
- To learn how timing and counting operations are used in digital systems
- To provide a simple and user-friendly digital clock simulation', 'A Digital Clock Simulation is a project that displays the current time in digital format using hours, minutes, and seconds. The clock continuously updates the time and can be implemented using programming or digital electronic components. This project demonstrates understanding of timing, counting operations, and digital display systems.', 'Digital Clock Simulation', 'sankames-vs.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/sankames-vs.jpg', 'https://www.linkedin.com/in/sankames-sankames-4b2116339', 'https://www.linkedin.com/in/sankames-sankames-4b2116339', NULL),
  ('V T RAGHUL VASUN', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Internships, Training & Technical Programs', 'Completed multiple technical internships and training programs:
- Chip Crafts – VLSI Layout Internship
- Career Ladder – Java Programming
- ENTHU – Internship / Technical Training
- Manfree – Internship / Technical Training
- SM MOJO TECH – Internship / Technical Training

Workshops:
- FPGA Altera Workshop – Chip Crafts
- Synopsys EDA Tools Workshop
- Cadence EDA Tools Workshop', '1. 8-bit ALU: Design an 8-bit Arithmetic Logic Unit capable of performing arithmetic and logical operations using synthesizable RTL. Objectives include implementing arithmetic and bitwise logic operations, developing operation selection and status flag logic, verifying the ALU using a functional testbench, and synthesizing and analyzing the gate-level implementation.

2. Booth Multiplier: Design a signed Booth Multiplier for efficient binary multiplication, focusing on arithmetic datapath design and ASIC synthesis. Objectives include implementing signed multiplication using Booth''s algorithm, developing partial-product and control logic, verifying the multiplier for different input conditions, and analyzing synthesized timing and area characteristics.

3. TCAM: Design a Ternary Content-Addressable Memory architecture that supports parallel pattern matching using binary and don''t-care states. Objectives include implementing ternary comparison and search logic, developing match-line evaluation and result generation, verifying exact matches, masked matches, and no-match conditions, and analyzing the RTL architecture using ASIC synthesis tools.', '8-bit ALU, Booth Multiplier, TCAM', 'v-t-raghul-vasun.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/v-t-raghul-vasun.jpg', 'https://www.linkedin.com/in/raghul-vasun-vt-3a804941a', 'https://www.linkedin.com/in/raghul-vasun-vt-3a804941a', NULL),
  ('Kavya M', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Hackathons, Workshops & Technical Events', '1. ROBOCHIPX – A 24-Hours Hackathon (AI / CHIP / ROBOTICS) at Rajalakshmi Institute of Technology, Chennai – July 9 & 10, 2026 (2 days)
2. RISC-V Hands-on Training Workshop at IIT Madras – March 21 & 22, 2026 (2 days)
3. ECE Paper Presentation at FIESTAA''26, KPR Institute of Engineering and Technology – February 20 & 21, 2026
4. ECE Workshops at FIESTAA''26, KPR Institute of Engineering and Technology – February 20 & 21, 2026
5. Custom IC Design Mastery using Cadence EDA Tools at Sri Shakthi Institute (Abhiyantha / Entuple Technologies) – December 11–23, 2025 (13 days)
6. VLSI Test Workshop at PSG College of Technology (IEEE TTTC) – October 10–12, 2025 (3 days)
7. VLSI DAY 2025 at PSG College of Technology (VLSI Society of India) – September 20, 2025
8. VDAT 30th Conference Fellowship at Jaypee Institute of Information Technology – August 20–22, 2025 (3 days)
9. On-Campus Training: Chip Design using Cadence Tool Chain (RTL to GDSII) – July 16–22, 2026 (7 days)
10. Workshop Fiasta at KPR Institute of Engineering and Technology – February 20 & 21', NULL, NULL, 'kavya-m.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/kavya-m.jpg', 'https://www.linkedin.com/in/kavya-m-9376a2322', 'https://www.linkedin.com/in/kavya-m-9376a2322', NULL),
  ('Subhashini N', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Workshops & Internships', 'Workshops:
- PCB Design and Fabrication at KPR Institute of Engineering and Technology – March 14, 2025 (1 day)
- VLSI TEST Workshop at PSG College of Technology – October 10–12, 2025 (3 days)
- VLSI Design Flow from RTL to GDS at Chipxpert Technologies – November 1–2, 2025 (2 days)
- Code to Chip: RTL to GDS flow using Synopsys tools at VLSI Minds – February 16–20, 2026 (5 days)
- Digital Hardware Design and Implementation with Altera (Intel) FPGAs at Chipcrafts – November 18–19, 2025 (2 days)

Internships:
- Chip Crafts – VLSI Layout Design (September 3–10, 2025)
- Career Ladder – Programming Paradigm using Java (September 11–16, 2025)
- EnthuTech – PCB Designing', '1. RTL-to-GDSII Implementation of a Low-Power Edge-AI Safety Monitoring SoC for Real-Time Emergency Detection Using Synopsys ASIC Flow

2. Design and FPGA/ASIC Implementation of an Edge-AI SoC for Advanced Driver Assistance Systems (ADAS) (Group Project)', 'RTL-to-GDSII Implementation of a Low-Power Edge-AI Safety Monitoring SoC, Edge-AI SoC for ADAS', 'subhashini-n.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/subhashini-n.jpg', 'https://www.linkedin.com/in/subhashini-nallasamy-4ab745328', 'https://www.linkedin.com/in/subhashini-nallasamy-4ab745328', NULL),
  ('Varsha V R', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Internships, Workshops & Hackathons', 'Internships:
- SystemVerilog Internship at SM AI MOJO TECH
- STM32 Microcontroller Design Intern at Manfree Technology
- PCB Design & Fabrication Intern at Enthu EdTech
- Embedded Systems Intern at Manfree Technology
- Basic Java Programming Intern at Career Ladder
- VLSI Layout Design Intern at Chip Crafts

Workshops:
- Code to Chip – RTL to GDS Flow Using Synopsys Tools
- Workshop on Digital Hardware Design with Altera (Intel) FPGAs
- VLSI Test Workshop at PSG College of Technology

Hackathons:
- RoboChipX at Rajalakshmi Institute of Technology, Chennai', 'Project 1: Adaptive Dynamic-Precision Sparse Neural Network Accelerator for Edge AI – Designed a neural network accelerator architecture utilizing dynamic precision scaling and sparsity techniques to improve computational efficiency and reduce power consumption. Implemented adaptive precision control and sparse data processing mechanisms. Developed and validated using Verilog HDL and the Synopsys RTL-to-GDSII ASIC design flow.

Project 2: AMBA AXI4-Lite Master and Slave Interface Design – Designed and implemented an AMBA AXI4-Lite compliant Master and Slave interface for memory-mapped communication using Verilog HDL. Developed and verified read/write transaction handling, address decoding, and control logic. Synthesized through the Synopsys RTL-to-GDSII ASIC flow.

Project 3: SPI Protocol Controller Design – Designed and implemented an SPI controller using Verilog HDL for synchronous serial communication between master and slave devices. Successfully completed ASIC implementation using the Tiny Tapeout flow, generating and analyzing the final GDSII chip layout and 3D visualization.', 'Adaptive Dynamic-Precision Sparse Neural Network Accelerator, AMBA AXI4-Lite Master/Slave, SPI Protocol Controller', 'varsha-v-r.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/varsha-v-r.jpg', 'https://www.linkedin.com/in/varsha-ramesh-58840a338', 'https://www.linkedin.com/in/varsha-ramesh-58840a338', NULL),
  ('Winston Churchil', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Projects & Development', 'Developing innovative web-based projects combining 3D visualization and AI technologies for career guidance and portfolio presentation.', '3D Portfolio Websites and AI Career Roadmap Generator Web Application – Developing interactive 3D portfolio websites and an AI-powered career roadmap generator web application that helps users visualize career paths and plan their professional development.', '3d Portfolio websites and AI career roadmap generator web application', 'winston-churchil.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/winston-churchil.jpg', 'https://www.linkedin.com/in/winstonchurchil21', 'https://www.linkedin.com/in/winstonchurchil21', NULL),
  ('K.R.Nitin', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Internships & Workshops', 'Completed various internships and workshops related to VLSI design and semiconductor technology.', 'RTL-to-GDSII Design and Physical Implementation of a 16-bit Multiply-Accumulate Unit Using the Synopsys ASIC Design Flow – This project presents the design and physical implementation of a 16-bit Multiply-Accumulate (MAC) unit realized through a complete RTL-to-GDSII ASIC design flow using industry-standard Synopsys EDA tools. The MAC unit, described in synthesizable Verilog HDL, computes the product of two 16-bit operands and accumulates the result in a 32-bit register under the control of a four-state Moore finite-state machine (FSM). Functional correctness was verified using Synopsys VCS, and the design was synthesized with Synopsys Design Compiler.', 'RTL-to-GDSII Design and Physical Implementation of a 16-bit Multiply-Accumulate Unit Using Synopsys', 'k-r-nitin.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/k-r-nitin.jpg', 'https://www.linkedin.com/in/nitin-nitin-63640b', 'https://www.linkedin.com/in/nitin-nitin-63640b', NULL),
  ('Sakthishree D', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Rank Holder & Certifications', 'Academic Excellence: 1st Semester – 3rd Rank Holder; 2nd, 3rd & 4th Semester – 1st Rank Holder.

Internships:
- Chip Crafts – VLSI Design Layout
- Manfree – Embedded Systems
- Career Ladder – OOPS in Java
- Enthu Technologies – PCB Designing
- SM AI MOJO Tech – System Verilog and Basics of Digital Electronics

Workshops:
- Industrial IOT Using LORAWAN Technology
- STM32 & Renesas-based Embedded System
- Emboss in IOT (Arduino)
- Digital Hardware Design and Implementation with Altera FPGA

Certifications:
- VLSI on Chip Design by Maven Silicon
- RISC-V Processor RV321 Base ISA by Maven Silicon
- Verilog HDL – Udemy
- Static Timing Analysis – Udemy', '1. 32-bit RISC V BASED ADAPTIVE PRECISION ACCELERATOR using AMBA APB protocol
2. Multi-GPU Architecture with Predictive Task Migration and Fault-Tolerant Resource Management
3. Build In Self Test Controller For ALU Verification
4. Communication Protocols – UART, SPI, MAC, BOOTH MULTIPLIER', '32 bit RISC V BASED ADAPTIVE PRECISION ACCELERATOR, Multi-GPU Architecture, BIST Controller', 'sakthishree-d.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/sakthishree-d.jpg', 'https://www.linkedin.com/in/sakthishree-d-746115339', 'https://www.linkedin.com/in/sakthishree-d-746115339', NULL),
  ('Kiruthika S', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Workshops & Internships', '10-Day Cadence VLSI Design Workshop – Entuple Technologies
2-Day IoT Workshop – KALAM 2025
2-Day FPGA Workshop – Chip Crafts
1-Month Top-Out Training

Internship/Training Certificates from Career Ladder, Enthu Tech, Embuzz Technologies, Chip Crafts, Manfree Technologies, SM AI MOJO TECH, and Maven Silicon

CGPA: 8.77', '1. Fault Controller for Medical Devices – Designed a safety-oriented controller to monitor critical system signals, detect faults, and automatically switch the system to a predefined safe state.
2. Automatic Timetable Management System using Tcl – Developed an automated timetable management system using Tcl/Tk and database integration.
3. Automatic Attendance Management System using Perl – Developed an automated attendance management system using Perl.
4. Booth Multiplier – Designed an RTL-based Booth multiplier for efficient signed binary multiplication.
5. Pipelined Digital Design – Designed a pipelined digital architecture by dividing computation into multiple stages using registers.
6. SPI Protocol – Designed an RTL-based SPI communication interface for serial data transfer.
7. BIST – Built-In Self-Test – Designed a BIST architecture for testing digital circuits using test-pattern generation and response analysis.
8. UART Communication – Designed an RTL-based UART transmitter and receiver for asynchronous serial communication.
9. AXI4-Lite Interface – Designed an AXI4-Lite interface for register-level read and write communication.
10. MAC Unit – Designed a Multiply-Accumulate unit for digital signal-processing applications.
11. CAN Protocol – Designed and studied a CAN communication module for reliable communication between multiple electronic control units.', 'Fault Controller for Medical Devices, Booth Multiplier, SPI, BIST, UART, AXI4-Lite, MAC Unit, CAN Protocol', 'kiruthika-s.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/kiruthika-s.jpg', 'https://www.linkedin.com/in/kiruthika-shanmugam-5a6092330', 'https://www.linkedin.com/in/kiruthika-shanmugam-5a6092330', NULL),
  ('Roobashri S', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Workshops, Internships & Hackathons', 'Workshops:
- PCB Design and Fabrication at KPR Institute of Engineering and Technology – March 14, 2025
- VLSI TEST Workshop at PSG College of Technology – October 10–12, 2025
- VLSI Design Flow from RTL to GDS at Chipxpert Technologies – November 1–2, 2025
- Code to Chip: RTL to GDS flow using Synopsys tools at VLSI Minds – February 16–20, 2026
- Digital Hardware Design with Altera (Intel) FPGAs at Chipcrafts – November 18–19, 2025

Internships:
- Chip Crafts – VLSI Layout Design (September 3–10, 2025)
- Career Ladder – Programming Paradigm using Java (September 11–16, 2025)
- EnthuTech – PCB Designing

Hackathon:
- Bharat AI-Soc Student Challenge (January–March 2026)', '1. A Reconfigurable Neuromorphic Processor with Dynamic Synaptic Adaptation for Energy-Efficient Edge AI using Synopsys – A reconfigurable neuromorphic processor that mimics brain-inspired neural processing using adaptive synaptic weights and neuron models for energy-efficient and low-latency edge AI processing.

2. STM32F446RE PCB Controller Board — 6-Axis Robotic Arm – Designed and developed a custom multilayer STM32F446RE controller PCB in Altium Designer for synchronized control of a 6-axis robotic arm. Integrated motor-control interfaces and CAN communication.

3. Smart 3S BMS with AI-Based SOC/SOH Estimation (Ongoing) – A dual-MCU PCB (STM32F446RE + ESP32-WROOM-32) for 3S Li-ion battery management, combining real-time protection with AI-based state estimation. Designed in KiCad.', 'Reconfigurable Neuromorphic Processor, STM32F446RE PCB Controller Board, Smart 3S BMS', 'roobashri-s.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/roobashri-s.jpg', 'https://www.linkedin.com/in/roobashri-senthilmurugan', 'https://www.linkedin.com/in/roobashri-senthilmurugan', NULL),
  ('Soorya Velaa P', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Workshops, Training & NCC', 'Workshops:
- 10-day Cadence Workshop
- 2-day IOT Workshop (KALAM 2025)
- 2-day Workshop on FPGA by Chip Crafts

Training Certificate:
- 10-day Cadence Workshop by Entuple Technologies

Internship Certificates:
- Career Ladder
- Enthu Tech
- Embuzz Technologies
- Chip Crafts
- Manfree Technologies
- SM AI MOJO TECH

Achievements:
- NCC CADET – B Certificate holder with A grade', 'Projects: Booth Multiplier, Pipeline Design, SPI Protocol, MFCC Accelerator', 'Booth multiplier, PIPELINE, SPI, MFCC Accelerator', 'soorya-velaa-p.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/soorya-velaa-p.jpg', 'https://www.linkedin.com/in/soorya-velaa', 'https://www.linkedin.com/in/soorya-velaa', NULL),
  ('SRI VATSAN P', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Internships, Workshops & Certifications', 'Internships / Industrial Training:
- Embuzz Technologies Pvt. Ltd. – Embedded Programming using Arduino
- Chip Craft – VLSI Layout Design & FPGA Implementation
- Manfree Technologies – Embedded Programming & 8086 Microprocessor
- Enthu Technology – PCB Design using KiCad
- Career Ladder – C Programming
- SM MOJO TECH – Internship Training

Workshops & Training:
- Hardware Design and Implementation with Altera (Intel) FPGAs
- Synopsys ASIC Design Flow Training
- Cadence VLSI Design and Verification Training

Hackathons:
- 24-Hour Hackathon – RIT College

Certifications:
- Synopsys ASIC Design Flow Certification
- Government SoC Project Certification
- Digital Hardware & FPGA Implementation Certification
- VLSI Layout Design Certification
- Embedded Systems & Arduino Certification
- SystemVerilog Training Certificate
- Arduino Programming Certificate', '1. Configurable Dynamic Memory-Aware AXI4-Stream Sparse Matrix Acceleration Engine – Design and implement a configurable sparse matrix acceleration engine using AXI4-Stream, dual-bank ping-pong memory, and adaptive clock gating for efficient data processing.

2. DDR SDRAM Controller Using Synopsys – Design and implement a DDR SDRAM controller using Verilog HDL and Synopsys ASIC design tools for efficient memory access and control.

3. AXI Bus Protocol Controller (AMBA Interface) – Design and implement an AXI-based bus protocol controller using SystemVerilog.

4. QoS-Aware AXI4 Interconnect with Adaptive Arbitration – Design and implement a QoS-aware AXI4 interconnect using SystemVerilog.

5. ECC-Based Self-Scrubbing SRAM Memory IP – Design an SRAM memory IP with Error Correcting Code (ECC) and self-scrubbing functionality.', 'Configurable Dynamic Memory-Aware AXI4-Stream Sparse Matrix Acceleration Engine, DDR SDRAM Controller', 'sri-vatsan-p.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/sri-vatsan-p.jpg', 'https://www.linkedin.com/in/sri-vatsan-84990a338', 'https://www.linkedin.com/in/sri-vatsan-84990a338', NULL),
  ('Pratheep D', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Certifications & Training', '- Completed MATLAB Onramp Certification
- Participated in an Inter-College Cadence Workshop covering Verilog HDL, testbench development, logic gates, Half Adder design, Xcelium simulation, and code coverage
- Completed training in RISC Processor Architecture
- Completed Java training through Career Ladder
- Participated in VLSI-related academic and technical activities
- Developed and worked on VLSI/embedded projects involving Verilog, Arduino, MATLAB, Proteus, Quartus, Microwind, and Cadence tools', 'RTL-to-GDSII Implementation of a Sparse Multi-Head Attention Accelerator for Transformer-Based Large Language Model Inference Using Cadence Flow – This project focuses on designing and implementing a hardware accelerator for sparse multi-head attention, an important computation used in Transformer-based AI and Large Language Models. The project aims to develop the design from RTL using SystemVerilog/Verilog through synthesis and physical design toward GDSII, using the Cadence design flow.

Objectives:
- Design the sparse attention architecture at RTL level
- Implement modules for attention-score calculation, scaling, sparse masking, softmax approximation, and value multiplication
- Verify the RTL functionality using simulation and testbenches
- Perform RTL synthesis and physical design using Cadence tools
- Study the complete RTL-to-GDSII implementation flow
- Explore hardware architectures suitable for efficient and low-power AI acceleration', 'RTL-to-GDSII Implementation of a Sparse Multi-Head Attention Accelerator for Transformer-Based Large Language Model Inference', 'pratheep-d.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/pratheep-d.jpg', 'https://www.linkedin.com/in/pratheep-vlsi', 'https://www.linkedin.com/in/pratheep-vlsi', NULL),
  ('PUGAZHENDHI S', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Training & Internships', '- Chip Design Using Cadence Tool Chain (RTL to GDSII) – Sri Shakthi Institute, on-campus training, July 2026
- Back-End Design of Digital Logic Circuits Using Cadence – Chip to Start-Up, June 2026
- VLSI Layout Design Internship – Chip Crafts, September 2025
- Embedded Systems Internship – Manfree Technologies, October 2025
- Digital Hardware Design & FPGA Workshop – Chip Crafts, November 2025
- Programming Paradigms Using Java – Career Ladder, September 2025', '1. RISC-V Processor with External Memory and INT8 Systolic Array Accelerator for Edge AI – Computer Architecture / ASIC Design
2. PPA Optimization of a Hardware Accelerator for Real-Time Agricultural Drone Image Analysis – VLSI Design
3. Low Power 8-bit ALU – RTL-to-GDSII, 90nm
4. Serial Peripheral Interface (SPI) Controller – RTL-to-GDSII, 90nm
5. Traffic Flow Controller – FSM / Digital Design
6. 8:1 Multiplexer - Schematic to Layout – CMOS / VLSI Layout', 'RISC-V Processor with External Memory, PPA Optimization of Hardware Accelerator, Low Power 8-bit ALU', 'pugazhendhi-s.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/pugazhendhi-s.jpg', 'https://www.linkedin.com/in/s-pugazh-pugazhendhi-657907338', 'https://www.linkedin.com/in/s-pugazh-pugazhendhi-657907338', NULL),
  ('Mohammed Ayman M', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Projects, Internships & Hackathons', '- VLSI & Semiconductor Domain Projects – Developed and explored practical projects focused on VLSI, digital design, embedded systems, and semiconductor-oriented applications
- VLSI Internship – SM AI Mojo Tech – Gained practical exposure to VLSI concepts, semiconductor design methodologies, digital logic, and industry-oriented workflows
- SEMICON / Semiconductor Hackathon Participation – Worked on SEMIRESTORE-AI, an AI-assisted semiconductor inspection concept
- AI + VLSI Project Development – Explored the integration of AI and Computer Vision with semiconductor inspection and manufacturing
- Technical Workshops & Hands-on Learning – Participated in technical learning activities covering VLSI design, FPGA, digital systems, embedded systems, AI/ML', 'SEMIRESTORE-AI: AI-Based Restoration of Degraded Images for Semiconductor Inspection – An AI-driven semiconductor inspection solution designed to enhance degraded inspection images affected by noise, low resolution, and image-quality limitations. The system focuses on restoring important visual features and improving the quality of semiconductor images to support reliable defect identification and analysis.

Objectives:
- Develop an AI-based image restoration pipeline for degraded semiconductor inspection images
- Reduce noise and improve image quality while preserving critical semiconductor features
- Enhance edges, patterns, and structural information required for defect analysis
- Explore Computer Vision and Deep Learning techniques for semiconductor inspection
- Build a foundation for intelligent, automated, and scalable semiconductor inspection systems', 'SEMIRESTORE-AI: AI-Based Restoration of Degraded Images for Semiconductor Inspection', 'mohammed-ayman-m.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/mohammed-ayman-m.jpg', 'https://www.linkedin.com/in/mohammed-ayman-m', 'https://www.linkedin.com/in/mohammed-ayman-m', NULL),
  ('S. Thirumurugan', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Internships, Training & Workshops', 'Internships, Training & Technical Programs:
- Chip Crafts – VLSI Layout Internship
- Embuzz Technologies – Arduino GPIO Programming
- Career Ladder – Java Programming
- ENTHU – Internship / Technical Training
- Manfree – Internship / Technical Training
- SM MOJO TECH – Internship / Technical Training

Workshops:
- FPGA Altera Workshop – Chip Crafts
- Synopsys EDA Tools Workshop
- Cadence EDA Tools Workshop', '1. RISC-V CPU – Design and develop a RISC-V processor using Verilog/SystemVerilog, with a focus on processor architecture, functional verification, and ASIC implementation.

2. Secure VPU – Design a Secure Vector Processing Unit with parallel vector computation and hardware security mechanisms for secure processing and data protection.

3. 8-bit ALU – Design an 8-bit Arithmetic Logic Unit capable of performing arithmetic and logical operations using synthesizable RTL.

4. Booth Multiplier – Design a signed Booth Multiplier for efficient binary multiplication, focusing on arithmetic datapath design and ASIC synthesis.

5. TCAM – Design a Ternary Content-Addressable Memory architecture that supports parallel pattern matching using binary and don''t-care states.', 'RISC-V CPU, Secure VPU, 8-bit ALU, Booth Multiplier, TCAM', 's-thirumurugan.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/s-thirumurugan.jpg', 'https://linkedin.com/in/thiru-murugan-264111339', 'https://linkedin.com/in/thiru-murugan-264111339', NULL),
  ('SANJEEV GH', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Internships & Technical Achievements', 'Internships:
- ChipCrafts – VLSI Internship (Microwind, digital circuit design, layout implementation)
- Manfree Technologies – Embedded Systems Internship
- Enthu Technology – PCB Design & Assembly Internship
- Career Ladder – Java Internship
- SM AI MOJO TECH – SystemVerilog Internship

Technical Achievements:
- Completed 53+ VLSI projects using industry-standard tools including Synopsys and Cadence
- Completed 3 industry-level VLSI projects with complete ASIC design flow
- Developed BatterySense X – achieved 91.94% core utilization, zero DRC violations, and 0.0000 WNS after CTS optimization
- Presented BatterySense X at department-level HR Conclave
- Developed multiple Embedded Systems projects using Arduino, sensors, relays, motors
- Developed ECG Signal Power-Line Noise Removal system using MATLAB
- Worked on SpaceEdgeX exploring AI, edge computing, hardware acceleration, and space-based computing', '1. BatterySense X – Intelligent Battery Sensing & Health Monitoring ASIC: An ASIC design project focused on battery sensing and health monitoring, implemented through the VLSI design flow from RTL to GDSII. Achieved 91.94% core utilization, generated GDSII, zero DRC violations.

2. ECG Signal Power-Line Noise Removal: A MATLAB-based DSP project using a notch filter to remove power-line noise from ECG signals.

3. SpaceEdgeX: An innovative concept exploring AI, edge computing, hardware acceleration, and space-based computing for next-generation applications.

4. Embedded Systems Projects: Multiple hardware-based projects developed using Arduino, sensors, relays, motors, and other electronic components.', 'BatterySense X – Intelligent Battery Sensing & Health Monitoring ASIC, ECG Signal Power-Line Noise Removal', 'sanjeev-gh.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/sanjeev.jpeg', 'https://linkedin.com/in/sanjeevgh', 'https://linkedin.com/in/sanjeevgh', NULL),
  ('Santhosh Kumar S', 'B.E. VLSI Design and Technology', 'III Year', '2024 - 2028', 'Hackathons, Internships & Certifications', '- 2nd Place – Cognicode Hackathon, NEXUS 2K26, GCT, Coimbatore
- Participant – NeuraNexus 2K25, KPR Institute of Engineering and Technology
- Participant – Hack Nexus 2025, Sri Ramakrishna College of Arts & Science
- Embedded Systems Internship – Manfree Technologies
- VLSI Layout Design Internship – Chip Crafts
- Industrial Training in Java – Career Ladder
- Custom IC Design using Cadence EDA Tools – Entuple Technologies
- Digital Hardware Design with Altera (Intel) FPGAs – Chip Crafts
- Java (Basic) Certification – HackerRank', '1. EventLens AI – Selfie-Based Event Photo Finder: An AI-powered platform that uses FaceNet and facial recognition to find a user''s photos from large event galleries using a single selfie. Built with Next.js, FastAPI, PyTorch and OpenCV.

2. SGPA / CGPA Calculator Web App: A student-focused web application for calculating SGPA and CGPA, with secure login and saved semester history. Developed as a major project and deployed as a live web application.

3. Health Buddy – AI-Driven Public Health Chatbot: An AI-based chatbot designed for public health and disease awareness. The project was developed as an innovation/research project and presented as a paper at ICIES 2025.', 'EventLens AI, SGPA / CGPA Calculator Web App, Health Buddy – AI-Driven Public Health Chatbot', 'santhosh-kumar-s.jpg', 'https://jwtynencyqwiybsspiih.supabase.co/storage/v1/object/public/photo/students/saantosh.jpeg', 'https://www.linkedin.com/in/santhosh-kumar-a76796304', 'https://www.linkedin.com/in/santhosh-kumar-a76796304', NULL)
ON CONFLICT (name, batch) DO UPDATE SET
  programme = EXCLUDED.programme,
  year = EXCLUDED.year,
  achievement_title = EXCLUDED.achievement_title,
  achievement = EXCLUDED.achievement,
  description = EXCLUDED.description,
  projects_overview = EXCLUDED.projects_overview,
  image = EXCLUDED.image,
  photo_url = EXCLUDED.photo_url,
  linkedin = EXCLUDED.linkedin,
  linkedin_url = EXCLUDED.linkedin_url,
  github_url = EXCLUDED.github_url;

COMMIT;

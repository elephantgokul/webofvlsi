// All global data — referenced by sliders.js
// top-level var so it's reachable from other plain <script> tags

var newsData = [
  { id:1, date:"2026-06-25", tag:"Achievement", title:"VLSI Team Wins National Robotics Challenge", excerpt:"Final-year students secured first place at the National Robotics Championship with an autonomous navigation bot." },
  { id:2, date:"2026-06-18", tag:"Partnership",  title:"Department Signs MoU for New IoT Research Lab", excerpt:"A new collaboration brings industry-grade IoT hardware and mentorship directly into the research wing." },
  { id:3, date:"2026-06-10", tag:"Research",     title:"Faculty Paper Accepted at IEEE Signal Processing Conference", excerpt:"Research on low-power signal compression accepted for presentation at a leading IEEE conference." },
  { id:4, date:"2026-06-02", tag:"Placements",   title:"Pre-Final Years Secure Early Placement Offers", excerpt:"Twelve third-year students received pre-placement offers from leading semiconductor and telecom recruiters." }
];

var eventsData = [
  { id:1, day:"14", month:"JUL", title:"National Symposium on VLSI & Embedded Systems", venue:"Main Auditorium",  time:"9:30 AM" },
  { id:2, day:"21", month:"JUL", title:"Industry Expert Talk: 5G and Beyond",             venue:"Seminar Hall 2",  time:"2:00 PM" },
  { id:3, day:"02", month:"AUG", title:"Hands-on Workshop: PCB Design & Fabrication",     venue:"Electronics Lab 3",time:"10:00 AM" },
  { id:4, day:"16", month:"AUG", title:"Alumni Meet & Mentorship Day",                    venue:"Dept Block Lawn", time:"4:00 PM"  }
];

var noticesData = [
  { id:1, date:"Jun 28", isNew:true,  title:"Semester-end exam timetable released" },
  { id:2, date:"Jun 27", isNew:true,  title:"Internship registration opens for pre-final years" },
  { id:3, date:"Jun 24", isNew:false, title:"Lab manual submission deadline extended to July 5" },
  { id:4, date:"Jun 20", isNew:false, title:"Guest lecture venue changed to Seminar Hall 1" },
  { id:5, date:"Jun 15", isNew:false, title:"Merit scholarship application window now open" }
];

var testimonialsData = [
  { id:1, name:"Aravind S.", batch:"2025 Batch", role:"Design Engineer, Velocis Systems",     quote:"The signal processing labs here weren't just theory — by final year I was building the same filters I now design at work." },
  { id:2, name:"Divya R.",   batch:"2024 Batch", role:"Embedded Engineer, Trident Embedded", quote:"My professor pushed me to take embedded systems seriously in second year. That one decision shaped my entire career path." },
  { id:3, name:"Karthik M.", batch:"2025 Batch", role:"RF Engineer, Vertex Communications",  quote:"Our antenna design project went from a classroom exercise to a working prototype we demoed at a national expo." },
  { id:4, name:"Priya V.",   batch:"2023 Batch", role:"VLSI Engineer, Nexora Semiconductors",quote:"Small class sizes in the VLSI lab meant real one-on-one time with faculty. That made all the difference." },
  { id:5, name:"Sanjay K.",  batch:"2024 Batch", role:"IoT Developer, Pulsewave Technologies",quote:"I walked in knowing basic circuits and walked out having shipped a working IoT product during my final-year project." },
  { id:6, name:"Meena T.",   batch:"2025 Batch", role:"Test Engineer, Meridian Electronics",  quote:"The faculty's industry connections got me my internship — and that internship turned straight into a full-time offer." }
];

var recruitersData = [
  "Velocis Systems","Nexora Semiconductors","Quantara Technologies","Trident Embedded",
  "Orbital Microsystems","Vertex Communications","Helios Chip Works","Meridian Electronics",
  "Pulsewave Technologies","Ironclad Networks","Stratos Robotics","Lumina Circuits"
];

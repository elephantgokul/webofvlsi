const TECH_PATTERNS = {
  'Synopsys': /synopsys/gi,
  'Cadence': /cadence/gi,
  'VLSI': /vlsi/gi,
  'Verilog': /verilog/gi,
  'SystemVerilog': /systemverilog|system-verilog/gi,
  'VHDL': /vhdl/gi,
  'Python': /python/gi,
  'C/C++': /c\+\+|c\/c\+\+/gi,
  'MATLAB': /matlab/gi,
  'Tanner': /tanner/gi,
  'SPICE': /spice/gi,
  'FPGA': /fpga/gi,
  'ASIC': /asic/gi,
  'RTL': /rtl/gi,
  'DFT': /dft\b/gi,
  'STA': /sta\b|static timing/gi,
  'CDC': /cdc\b|clock domain/gi,
  'Low Power': /low power|upf|cpf/gi,
  'Physical Design': /physical design|place.*route|pnr/gi,
  'Verification': /verification|uvm|ovm/gi,
  'Analog': /analog/gi,
  'Layout': /layout/gi,
  'Perl': /perl/gi,
  'Tcl/Tk': /tcl\/tk|tcl/gi,
  'Linux': /linux/gi,
  'Git': /git\b/gi,
  'Jenkins': /jenkins/gi,
  'Docker': /docker/gi,
  'UVM': /uvm\b/gi,
  'OVM': /ovm\b/gi,
  'SystemC': /systemc/gi,
  'Specman': /specman|e\b/gi,
  'Vera': /vera\b/gi,
  'Formal': /formal verification|property checking/gi,
  'Emulation': /emulation|fpga prototyping/gi,
  'Simulation': /simulation/gi,
  'Synthesis': /synthesis/gi,
  'Place & Route': /place.*route|p\&r|pnr/gi,
  'Timing Analysis': /timing analysis|sta/gi,
  'Power Analysis': /power analysis/gi,
  'Clock Tree': /clock tree|cts/gi,
  'Floorplanning': /floorplan/gi,
  'Routing': /routing\b/gi,
  'DRC': /drc\b/gi,
  'LVS': /lvs\b/gi,
  'Antenna': /antenna/gi,
  'ERC': /erc\b/gi,
  'IR Drop': /ir drop/gi,
  'EM': /electromigration|em\b/gi,
  'Signal Integrity': /signal integrity|si\b/gi,
  'Crosstalk': /crosstalk/gi
};

function computeMetrics(data) {
  var students = data.students || [];
  var faculty = data.faculty || [];

  var totalStudents = students.length;
  var totalFaculty = faculty.length;

  var internshipCount = 0;
  var workshopCount = 0;
  var projectCount = 0;
  var companiesSet = new Set();
  var toolsSet = new Set();
  var linkedinCount = 0;
  var githubCount = 0;
  var yearCounts = { I: 0, II: 0, III: 0, IV: 0 };
  var totalScore = 0;
  var techFreq = {};

  Object.keys(TECH_PATTERNS).forEach(function(k) { techFreq[k] = 0; });

  students.forEach(function(s) {
    var ach = (s.achievement || '').toLowerCase();
    var yearToken = normalizeYear(s.yearToken || s.year);

    if (yearCounts.hasOwnProperty(yearToken)) yearCounts[yearToken]++;

    if (s.linkedin || (s.achievement && /linkedin\.com/gi.test(s.achievement))) linkedinCount++;
    if (s.github || (s.achievement && /github\.com/gi.test(s.achievement))) githubCount++;

    var matches = ach.match(/internship/gi);
    if (matches) internshipCount += matches.length;

    matches = ach.match(/workshop|training/gi);
    if (matches) workshopCount += matches.length;

    matches = ach.match(/project/gi);
    if (matches) projectCount += matches.length;

    Object.entries(TECH_PATTERNS).forEach(function(_ref) {
      var name = _ref[0], regex = _ref[1];
      var m = ach.match(regex);
      if (m) techFreq[name] += m.length;
    });

    var computed = computeLeaderboardScore(ach, s);
    totalScore += computed.score;
  });

  var sortedTech = Object.entries(techFreq)
    .filter(function(_ref) { return _ref[1] > 0; })
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 10);

  var avgScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;
  var linkedinPct = totalStudents > 0 ? Math.round((linkedinCount / totalStudents) * 100) : 0;
  var githubPct = totalStudents > 0 ? Math.round((githubCount / totalStudents) * 100) : 0;

  return {
    totalStudents: totalStudents,
    totalFaculty: totalFaculty,
    internships: internshipCount,
    workshops: workshopCount,
    projects: projectCount,
    avgScore: avgScore,
    linkedinPct: linkedinPct,
    githubPct: githubPct,
    yearCounts: yearCounts,
    topTech: sortedTech,
    techFreq: techFreq
  };
}

function computeLeaderboardScore(text, student) {
  text = (text || '').toLowerCase();
  var score = 0;
  var patterns = [
    { regex: /internship/gi, points: 15 },
    { regex: /hackathon/gi, points: 20 },
    { regex: /project/gi, points: 10 },
    { regex: /publication|paper|ieee/gi, points: 30 },
    { regex: /patent/gi, points: 50 },
    { regex: /workshop|training/gi, points: 8 },
    { regex: /first place|winner|rank 1/gi, points: 40 },
    { regex: /synopsys|cadence|vlsi/gi, points: 5 },
    { regex: /github\.com/gi, points: 10 },
    { regex: /linkedin\.com/gi, points: 5 }
  ];
  patterns.forEach(function(p) {
    var m = text.match(p.regex);
    if (m) score += m.length * p.points;
  });
  if (student.universityNo) score += 3;
  return { score: score };
}

function normalizeYear(token) {
  if (!token) return '';
  var t = String(token).toUpperCase();
  if (t.includes('I') && !t.includes('II') && !t.includes('III') && !t.includes('IV')) return 'I';
  if (t.includes('II') && !t.includes('III') && !t.includes('IV')) return 'II';
  if (t.includes('III')) return 'III';
  if (t.includes('IV')) return 'IV';
  return t;
}

function animateCounter(el, target, duration) {
  var start = 0;
  var startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.round(start + (target - start) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderCounters(metrics) {
  var container = document.getElementById('stats-counters');
  if (!container) return;

  var counters = [
    { label: 'Total Students', value: metrics.totalStudents, icon: 'fa-user-graduate', color: 'var(--clr-accent)' },
    { label: 'Faculty Members', value: metrics.totalFaculty, icon: 'fa-chalkboard-user', color: 'var(--clr-cyan)' },
    { label: 'Internships Completed', value: metrics.internships, icon: 'fa-briefcase', color: '#059669' },
    { label: 'Workshops Attended', value: metrics.workshops, icon: 'fa-chalkboard-teacher', color: '#7c3aed' },
    { label: 'Projects Built', value: metrics.projects, icon: 'fa-code', color: '#ea580c' },
    { label: 'Avg Achievement Score', value: metrics.avgScore, icon: 'fa-trophy', color: '#f59e0b' },
    { label: 'LinkedIn Profiles', value: metrics.linkedinPct + '%', icon: 'fa-brands fa-linkedin', color: '#0a66c2' },
    { label: 'GitHub Profiles', value: metrics.githubPct + '%', icon: 'fa-brands fa-github', color: '#24292e' }
  ];

  container.innerHTML = counters.map(function(c) {
    return [
      '<div class="stat-card" data-aos="zoom-in" data-aos-delay="100">',
        '<div class="stat-icon mb-3" style="color:' + c.color + '"><i class="fa-solid ' + c.icon + ' text-3xl"></i></div>',
        '<div class="stat-value" data-target="' + c.value + '" style="color:' + c.color + '">0</div>',
        '<div class="stat-label">' + c.label + '</div>',
      '</div>'
    ].join('');
  }).join('');

  container.querySelectorAll('.stat-value').forEach(function(el) {
    var target = el.dataset.target;
    var num = parseInt(target.replace(/,/g, '').replace('%', ''), 10);
    animateCounter(el, num, 1500);
  });
}

function renderTechBars(metrics) {
  var container = document.getElementById('tech-bars');
  if (!container) return;

  var topTech = metrics.topTech;
  var maxVal = topTech.length > 0 ? topTech[0][1] : 1;

  container.innerHTML = topTech.map(function(_ref, idx) {
    var name = _ref[0], count = _ref[1];
    var pct = Math.round((count / maxVal) * 100);
    return [
      '<div class="bar-row" data-aos="fade-right" data-aos-delay="' + (idx * 80) + '">',
        '<span class="bar-label">' + escapeHtml(name) + '</span>',
        '<div class="bar-track" role="progressbar" aria-valuenow="' + count + '" aria-valuemin="0" aria-valuemax="' + maxVal + '" aria-label="' + escapeHtml(name) + ': ' + count + ' mentions">',
          '<div class="bar-fill" style="width:0%" data-width="' + pct + '%"></div>',
        '</div>',
        '<span class="bar-value">' + count + '</span>',
      '</div>'
    ].join('');
  }).join('');

  setTimeout(function() {
    container.querySelectorAll('.bar-fill').forEach(function(bar) {
      bar.style.width = bar.dataset.width;
    });
  }, 100);
}

function renderDonutChart(metrics) {
  var svg = document.getElementById('year-donut');
  var legend = document.getElementById('year-legend');
  if (!svg || !legend) return;

  var yearCounts = metrics.yearCounts;
  var total = Object.values(yearCounts).reduce(function(a, b) { return a + b; }, 0);
  if (total === 0) {
    svg.innerHTML = '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="fill:var(--clr-text-muted);font-family:IBM Plex Sans">No data</text>';
    return;
  }

  var colors = {
    I: 'var(--clr-accent)',
    II: 'var(--clr-cyan)',
    III: '#7c3aed',
    IV: '#059669'
  };
  var yearLabels = { I: 'I Year', II: 'II Year', III: 'III Year', IV: 'IV Year' };

  var radius = 100;
  var strokeWidth = 24;
  var circumference = 2 * Math.PI * radius;
  var startAngle = -90;

  var segmentsHtml = '';
  var legendHtml = '';
  var currentAngle = startAngle;

  var order = ['I', 'II', 'III', 'IV'];
  order.forEach(function(year, idx) {
    var count = yearCounts[year] || 0;
    if (count === 0) return;
    var pct = count / total;
    var dashArray = pct * circumference;
    var dashOffset = circumference - (startAngle / 360) * circumference - dashArray;

    segmentsHtml += '<circle class="donut-segment" cx="140" cy="140" r="' + radius + '" stroke-width="' + strokeWidth + '" stroke="' + colors[year] + '" fill="none" stroke-dasharray="' + dashArray + ' ' + circumference + '" stroke-dashoffset="' + dashOffset + '" style="transition: stroke-dashoffset 1.2s cubic-bezier(.25,.8,.25,1);" data-aos="fade-in" data-aos-delay="' + (idx * 150) + '"></circle>';

    legendHtml += '<div class="donut-legend-item"><span class="donut-legend-color" style="background:' + colors[year] + '"></span><span>' + yearLabels[year] + ': ' + count + ' (' + Math.round(pct * 100) + '%)</span></div>';
  });

  svg.innerHTML = [
    '<svg width="280" height="280" viewBox="0 0 280 280" role="img" aria-label="Student distribution by year">',
    segmentsHtml,
    '<div class="donut-center">',
      '<div class="donut-center-value">' + total + '</div>',
      '<div class="donut-center-label">Total Students</div>',
    '</div>',
    '</svg>'
  ].join('');

  legend.innerHTML = legendHtml;
}

function renderWordCloud(metrics) {
  var container = document.getElementById('word-cloud');
  if (!container) return;

  var techFreq = metrics.techFreq;
  var entries = Object.entries(techFreq)
    .filter(function(_ref) { return _ref[1] > 0; })
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 40);

  if (!entries.length) {
    container.innerHTML = '<p style="color:var(--clr-text-muted)">No technology mentions found</p>';
    return;
  }

  var maxFreq = entries[0][1];
  var minSize = 0.75;
  var maxSize = 2.2;

  container.innerHTML = entries.map(function(_ref, idx) {
    var name = _ref[0], freq = _ref[1];
    var ratio = freq / maxFreq;
    var size = minSize + (maxSize - minSize) * ratio;
    var opacity = 0.5 + 0.5 * ratio;
    return '<span class="word-cloud-item" style="font-size:' + size + 'rem;opacity:' + opacity + '" data-aos="zoom-in" data-aos-delay="' + (idx * 20) + '">' + escapeHtml(name) + '</span>';
  }).join('');
}

async function initStats() {
  var timestampEl = document.getElementById('stats-timestamp');
  try {
    var data = await window.fetchDepartmentData();
    var metrics = computeMetrics(data);

    renderCounters(metrics);
    renderTechBars(metrics);
    renderDonutChart(metrics);
    renderWordCloud(metrics);

    if (timestampEl) {
      timestampEl.textContent = new Date().toLocaleString();
    }

    if (typeof AOS !== 'undefined') AOS.refreshHard();

  } catch (err) {
    console.error('[Stats] Error:', err);
    var container = document.getElementById('stats-counters');
    if (container) {
      container.innerHTML = '<div class="col-span-full py-12 text-center" style="color:var(--clr-text-secondary)"><i class="fa-solid fa-triangle-exclamation text-3xl mb-3" style="color:var(--clr-text-muted)"></i><p>Failed to load statistics</p></div>';
    }
  }
}

document.addEventListener('DOMContentLoaded', initStats);
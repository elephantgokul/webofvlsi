function computeScore(achievement, student) {
  var text = (achievement || '').toLowerCase();
  var score = 0;
  var breakdown = {};

  var patterns = [
    { key: 'internship', regex: /internship/gi, points: 15, label: 'Internships' },
    { key: 'hackathon', regex: /hackathon/gi, points: 20, label: 'Hackathons' },
    { key: 'project', regex: /project/gi, points: 10, label: 'Projects' },
    { key: 'publication', regex: /publication|paper|ieee/gi, points: 30, label: 'Publications' },
    { key: 'patent', regex: /patent/gi, points: 50, label: 'Patents' },
    { key: 'workshop', regex: /workshop|training/gi, points: 8, label: 'Workshops' },
    { key: 'firstPlace', regex: /first place|winner|rank 1/gi, points: 40, label: 'First Place' },
    { key: 'vlsiTools', regex: /synopsys|cadence|vlsi/gi, points: 5, label: 'VLSI Tools' },
    { key: 'github', regex: /github\.com/gi, points: 10, label: 'GitHub Profile' },
    { key: 'linkedin', regex: /linkedin\.com/gi, points: 5, label: 'LinkedIn Profile' },
    { key: 'universityNo', regex: null, points: 3, label: 'University No.' }
  ];

  patterns.forEach(function(p) {
    if (p.regex) {
      var matches = text.match(p.regex);
      if (matches) {
        breakdown[p.key] = { count: matches.length, points: matches.length * p.points, label: p.label };
        score += matches.length * p.points;
      }
    }
  });

  if (student.universityNo) {
    breakdown.universityNo = { count: 1, points: 3, label: 'University No.' };
    score += 3;
  }

  return { score: score, breakdown: breakdown };
}

function extractSkills(achievement) {
  var text = (achievement || '').toLowerCase();
  var skills = [];
  var skillPatterns = {
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
    'Layout': /layout/gi
  };

  Object.entries(skillPatterns).forEach(function(_ref) {
    var name = _ref[0], regex = _ref[1];
    if (regex.test(text)) skills.push(name);
  });

  return skills;
}

function buildTimeline(achievement) {
  var lines = achievement.split(/\n|•|-\s+|\*\s+/).map(function(l){ return l.trim(); }).filter(Boolean);
  return lines.map(function(line, i) {
    var yearMatch = line.match(/\b(20\d{2})\b/);
    return {
      text: line.replace(/^\d+\.\s*/, ''),
      year: yearMatch ? yearMatch[1] : null,
      index: i
    };
  });
}

function renderTimeline(milestones) {
  if (!milestones.length) return '<p style="color:var(--clr-text-muted)">No timeline data available</p>';
  return '<div class="achievement-timeline">' +
    milestones.map(function(m, i) {
      return [
        '<div class="timeline-item" data-aos="fade-left" data-aos-delay="' + (i * 60) + '">',
          '<div class="timeline-dot"></div>',
          '<div class="timeline-card surface-card rounded-xl p-4">',
            m.year ? '<span class="timeline-year">' + m.year + '</span>' : '',
            '<p class="text-sm" style="color:var(--clr-text-secondary);line-height:1.7">' + escapeHtml(m.text) + '</p>',
          '</div>',
        '</div>'
      ].join('');
    }).join('') +
  '</div>';
}

async function exportStudentPDF(student) {
  var btn = document.getElementById('export-pdf-btn');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Generating\u2026';
  try {
    var el = document.getElementById('student-detail-root');
    if (!el) throw new Error('Content element not found');
    var canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    var imgData = canvas.toDataURL('image/png');
    var jsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (!jsPDF) throw new Error('jsPDF not loaded');
    var pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    var w = pdf.internal.pageSize.getWidth();
    var h = (canvas.height * w) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, w, h);
    var filename = 'achievement-' + (student.registerNo || student.name || 'student').replace(/\s+/g,'-') + '.pdf';
    pdf.save(filename);
    window.showToast('PDF downloaded!', 'success');
  } catch(err) {
    console.error('[PDF Export] Error:', err);
    window.showToast('PDF export failed. Try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-file-pdf mr-2"></i>Download PDF';
  }
}

async function initStudentDetail() {
  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get('id');
  if (!id) {
    document.getElementById('student-detail-root').innerHTML = '<div class="surface-card p-12 text-center" style="border:1px solid var(--clr-border)"><i class="fa-solid fa-user-slash text-4xl mb-3" style="color:var(--clr-text-muted)"></i><p style="color:var(--clr-text-secondary)">No student ID provided</p></div>';
    return;
  }

  try {
    var data = await window.fetchDepartmentData();
    var student = (data.students || []).find(function(s) { return s.registerNo === id || s.name === id; });

    if (!student) {
      document.getElementById('student-detail-root').innerHTML = '<div class="surface-card p-12 text-center" style="border:1px solid var(--clr-border)"><i class="fa-solid fa-user-slash text-4xl mb-3" style="color:var(--clr-text-muted)"></i><p style="color:var(--clr-text-secondary)">Student not found</p></div>';
      return;
    }

    var computed = computeScore(student.achievement, student);
    var skills = extractSkills(student.achievement);
    var milestones = buildTimeline(student.achievement);

    document.title = student.name + ' \u2014 VLSI | SIET';
    document.getElementById('breadcrumb-name').textContent = student.name;

    document.getElementById('student-photo').src = student.photoUrl || 'https://picsum.photos/seed/' + encodeURIComponent(student.name) + '/400/500';
    document.getElementById('student-photo').alt = student.name;
    document.getElementById('student-name').textContent = student.name;
    document.getElementById('student-regno').textContent = student.registerNo || '';
    document.getElementById('student-year').textContent = student.year || '';
    document.getElementById('student-batch').textContent = student.batch || '';
    document.getElementById('student-univno').textContent = student.universityNo || 'N/A';
    document.getElementById('student-email').textContent = student.email || 'N/A';
    document.getElementById('student-email').href = 'mailto:' + (student.email || '');
    document.getElementById('student-phone').textContent = student.phone || 'N/A';

    var linksContainer = document.getElementById('student-links');
    var linksHtml = '';
    if (student.linkedin) linksHtml += '<a href="' + escapeHtml(student.linkedin) + '" target="_blank" rel="noopener" class="text-lg hover:text-cyan transition-colors" style="color:var(--clr-text-muted)" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>';
    if (student.github) linksHtml += '<a href="' + escapeHtml(student.github) + '" target="_blank" rel="noopener" class="text-lg hover:text-cyan transition-colors" style="color:var(--clr-text-muted)" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>';
    linksContainer.innerHTML = linksHtml || '<span style="color:var(--clr-text-muted)">No links</span>';

    var skillsContainer = document.getElementById('student-skills');
    skillsContainer.innerHTML = skills.slice(0, 12).map(function(s) {
      return '<span class="badge badge-primary">' + escapeHtml(s) + '</span>';
    }).join('') || '<span style="color:var(--clr-text-muted)">No skills detected</span>';

    document.getElementById('student-achievements').innerHTML = '<p style="white-space:pre-wrap">' + escapeHtml(student.achievement || 'No achievements recorded') + '</p>';

    document.getElementById('student-timeline').innerHTML = renderTimeline(milestones);

    var breakdownContainer = document.getElementById('score-breakdown');
    var breakdownHtml = '';
    var totalScore = computed.score;
    Object.entries(computed.breakdown).forEach(function(_ref) {
      var key = _ref[0], val = _ref[1];
      var pct = totalScore > 0 ? Math.round((val.points / totalScore) * 100) : 0;
      breakdownHtml += [
        '<div class="flex items-center gap-3">',
          '<span class="text-sm font-medium w-36" style="color:var(--clr-text-secondary)">' + escapeHtml(val.label) + '</span>',
          '<div class="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden" style="background:var(--clr-surface-2)">',
            '<div class="h-full bg-gradient-to-r from-accent to-cyan rounded-full transition-all duration-1000" style="width:' + pct + '%;background:linear-gradient(90deg,var(--clr-accent),var(--clr-cyan))"></div>',
          '</div>',
          '<span class="text-sm font-mono w-16 text-right" style="color:var(--clr-text-primary)">+' + val.points + '</span>',
        '</div>'
      ].join('');
    });
    breakdownHtml += '<div class="pt-2 border-t border-default flex items-center justify-between" style="border-color:var(--clr-border)"><span class="font-semibold" style="color:var(--clr-text-primary)">Total Score</span><span class="font-display text-xl font-bold" style="color:var(--clr-accent)">' + totalScore + '</span></div>';
    breakdownContainer.innerHTML = breakdownHtml;

    document.getElementById('action-email').href = 'mailto:' + (student.email || '');
    document.getElementById('action-phone').href = 'tel:' + (student.phone || '');
    document.getElementById('action-linkedin').href = student.linkedin || '#';
    document.getElementById('action-github').href = student.github || '#';
    if (!student.linkedin) document.getElementById('action-linkedin').classList.add('opacity-50', 'pointer-events-none');
    if (!student.github) document.getElementById('action-github').classList.add('opacity-50', 'pointer-events-none');

    document.getElementById('export-pdf-btn').addEventListener('click', function() { exportStudentPDF(student); });

    if (typeof AOS !== 'undefined') AOS.refreshHard();

  } catch (err) {
    console.error('[Student Detail] Error:', err);
    document.getElementById('student-detail-root').innerHTML = '<div class="surface-card p-12 text-center" style="border:1px solid var(--clr-border)"><i class="fa-solid fa-triangle-exclamation text-4xl mb-3" style="color:var(--clr-text-muted)"></i><p style="color:var(--clr-text-secondary)">Failed to load student data</p></div>';
  }
}

document.addEventListener('DOMContentLoaded', initStudentDetail);

function escapeHtml(v) {
  var d = document.createElement('div');
  d.textContent = v == null ? '' : String(v);
  return d.innerHTML;
}
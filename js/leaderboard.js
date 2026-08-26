function computeScore(achievement, student) {
  var text = (achievement || '').toLowerCase();
  var score = 0;
  var breakdown = {};

  var patterns = [
    { key: 'internship', regex: /internship/gi, points: 15 },
    { key: 'hackathon', regex: /hackathon/gi, points: 20 },
    { key: 'project', regex: /project/gi, points: 10 },
    { key: 'publication', regex: /publication|paper|ieee/gi, points: 30 },
    { key: 'patent', regex: /patent/gi, points: 50 },
    { key: 'workshop', regex: /workshop|training/gi, points: 8 },
    { key: 'firstPlace', regex: /first place|winner|rank 1/gi, points: 40 },
    { key: 'vlsiTools', regex: /synopsys|cadence|vlsi/gi, points: 5 },
    { key: 'github', regex: /github\.com/gi, points: 10 },
    { key: 'linkedin', regex: /linkedin\.com/gi, points: 5 },
    { key: 'universityNo', regex: null, points: 3 }
  ];

  patterns.forEach(function(p) {
    if (p.regex) {
      var matches = text.match(p.regex);
      if (matches) {
        breakdown[p.key] = matches.length * p.points;
        score += matches.length * p.points;
      }
    }
  });

  if (student.universityNo) {
    breakdown.universityNo = 3;
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
    'DFT': /dft/gi,
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

function getYearToken(student) {
  return student.yearToken || student.year || '';
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

function renderPodium(top3, maxScore) {
  var podium = document.getElementById('leaderboard-podium');
  if (!podium) return;

  var medals = ['🥇', '🥈', '🥉'];
  var html = '';

  top3.forEach(function(student, idx) {
    var pct = maxScore > 0 ? Math.round((student.computedScore / maxScore) * 100) : 0;
    var skills = student.skills.slice(0, 6);
    html += [
      '<div class="podium-place podium-' + (idx + 1) + '" data-aos="fade-up" data-aos-delay="' + (idx * 150) + '">',
        '<div class="podium-card">',
          '<div class="podium-rank">' + medals[idx] + '</div>',
          '<div class="podium-name">' + escapeHtml(student.name) + '</div>',
          '<div class="podium-score">' + student.computedScore + ' pts</div>',
          '<div class="badge-chips mt-3" style="justify-content:center">' +
            skills.map(function(s) { return '<span class="badge badge-primary">' + escapeHtml(s) + '</span>'; }).join('') +
          '</div>',
        '</div>',
        '<div class="podium-base"></div>',
      '</div>'
    ].join('');
  });

  podium.innerHTML = html;
}

function renderTable(students, maxScore) {
  var tbody = document.getElementById('leaderboard-body');
  var empty = document.getElementById('leaderboard-empty');
  if (!tbody) return;

  if (!students.length) {
    tbody.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');

  var html = '';
  students.forEach(function(student, idx) {
    var rank = student.rank;
    var pct = maxScore > 0 ? Math.round((student.computedScore / maxScore) * 100) : 0;
    var skills = student.skills.slice(0, 8);
    var breakdown = student.breakdown;
    var breakdownHtml = Object.entries(breakdown).map(function(_ref) {
      var k = _ref[0], v = _ref[1];
      var label = k.replace(/([A-Z])/g, ' $1').replace(/^./, function(m){ return m.toUpperCase(); });
      return '<span class="badge badge-cyan" title="' + escapeHtml(label) + ': ' + v + ' pts">' + v + '</span>';
    }).join(' ');

    html += [
      '<tr data-aos="fade-up" data-aos-delay="' + (idx * 20) + '">',
        '<td class="rank-col">#' + rank + '</td>',
        '<td class="font-medium">' + escapeHtml(student.name) + '</td>',
        '<td class="hidden md:table-cell">' + escapeHtml(student.year || '') + '</td>',
        '<td class="hidden lg:table-cell">',
          '<div class="score-bar-wrap">',
            '<div class="score-bar" style="width:' + pct + '%" role="progressbar" aria-valuenow="' + student.computedScore + '" aria-valuemin="0" aria-valuemax="' + maxScore + '"></div>',
          '</div>',
          '<span class="text-xs font-mono mt-1 block" style="color:var(--clr-text-muted)">' + student.computedScore + ' pts</span>',
        '</td>',
        '<td class="badge-chips">' + breakdownHtml + '</td>',
        '<td class="badge-chips">' + skills.map(function(s) { return '<span class="badge badge-primary">' + escapeHtml(s) + '</span>'; }).join('') + '</td>',
      '</tr>'
    ].join('');
  });

  tbody.innerHTML = html;
}

function triggerConfetti() {
  var colors = ['#fbbf24', '#f59e0b', '#2fe6dd', '#1652c4', '#fff'];
  for (var i = 0; i < 50; i++) {
    setTimeout(function() {
      var confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      confetti.style.width = confetti.style.height = (6 + Math.random() * 10) + 'px';
      document.body.appendChild(confetti);
      setTimeout(function() { confetti.remove(); }, 4000);
    }, i * 30);
  }
}

async function initLeaderboard() {
  var podium = document.getElementById('leaderboard-podium');
  var tbody = document.getElementById('leaderboard-body');
  var stats = document.getElementById('leaderboard-stats');
  var yearFilterBtns = document.querySelectorAll('.filter-btn[data-year]');
  var searchInput = document.getElementById('leaderboard-search');

  if (!podium || !tbody) return;

  try {
    var data = await window.fetchDepartmentData();
    var students = (data.students || []).map(function(s) {
      var computed = computeScore(s.achievement, s);
      var skills = extractSkills(s.achievement);
      return {
        ...s,
        computedScore: computed.score,
        breakdown: computed.breakdown,
        skills: skills,
        normalizedYear: normalizeYear(getYearToken(s))
      };
    }).sort(function(a, b) { return b.computedScore - a.computedScore; });

    students.forEach(function(s, i) { s.rank = i + 1; });

    var maxScore = students.length > 0 ? students[0].computedScore : 0;
    var top3 = students.slice(0, 3);
    var rest = students.slice(3);

    var currentYearFilter = 'all';
    var currentSearch = '';

    function applyFilters() {
      var filtered = students.filter(function(s) {
        var yearMatch = currentYearFilter === 'all' || s.normalizedYear === currentYearFilter;
        var searchMatch = !currentSearch || s.name.toLowerCase().includes(currentSearch.toLowerCase());
        return yearMatch && searchMatch;
      });

      filtered.forEach(function(s, i) { s.rank = i + 1; });

      var displayTop3 = filtered.slice(0, 3);
      var displayRest = filtered.slice(3);
      var displayMax = filtered.length > 0 ? filtered[0].computedScore : maxScore;

      renderPodium(displayTop3, displayMax);
      renderTable(displayRest, displayMax);

      if (stats) {
        stats.textContent = filtered.length + ' of ' + students.length + ' students' + (currentYearFilter !== 'all' ? ' · Year ' + currentYearFilter : '') + (currentSearch ? ' · Search: "' + currentSearch + '"' : '');
      }
    }

    yearFilterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        yearFilterBtns.forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentYearFilter = btn.dataset.year;
        applyFilters();
      });
    });

    var searchDebounce;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(function() {
        currentSearch = searchInput.value.trim();
        applyFilters();
      }, 150);
    });

    applyFilters();

    if (typeof AOS !== 'undefined') AOS.refreshHard();

    if (top3.length > 0) {
      setTimeout(function() {
        if (typeof gsap !== 'undefined') {
          gsap.from('.podium-place', {
            y: 200,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'back.out(1.7)'
          });
        }
        triggerConfetti();
      }, 300);
    }

  } catch (err) {
    console.error('[Leaderboard] Error:', err);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center" style="color:var(--clr-text-secondary)">Failed to load leaderboard data.</td></tr>';
    }
  }
}

document.addEventListener('DOMContentLoaded', initLeaderboard);
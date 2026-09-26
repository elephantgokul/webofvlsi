// js/leaderboard.js — VLSI Student Leaderboard (Project-Based Scoring)
// Uses scoring.js for point calculation

function escapeHtml(value) {
  var div = document.createElement('div');
  div.textContent = value == null ? '' : String(value);
  return div.innerHTML;
}

function resolveStudentPhoto(student) {
  var rawPhoto = student.photoUrl || student.image || '';
  if (typeof resolveSupabaseImageUrl === 'function') {
    return resolveSupabaseImageUrl(rawPhoto, (typeof SUPABASE_BUCKETS !== 'undefined' ? SUPABASE_BUCKETS.students : 'students'), rawPhoto);
  }
  if (typeof getLocalAssetFallback === 'function') {
    return getLocalAssetFallback(rawPhoto, 'students');
  }
  return rawPhoto;
}

function getPhotoHtml(student, size) {
  var sz = size || 40;
  var src = resolveStudentPhoto(student);
  var initials = String(student.name || '?').split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
  var fallbackDiv = '<div class="leaderboard-avatar-fallback" style="width:' + sz + 'px;height:' + sz + 'px;font-size:' + Math.round(sz * 0.38) + 'px">' + escapeHtml(initials) + '</div>';

  if (!src) return fallbackDiv;

  var localFallback = '';
  if (typeof getLocalAssetFallback === 'function') {
    localFallback = getLocalAssetFallback(student.photoUrl || student.image || '', 'students');
  }

  return '<div class="leaderboard-avatar" style="width:' + sz + 'px;height:' + sz + 'px">' +
    fallbackDiv +
    '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(student.name) + '" ' +
    'class="leaderboard-avatar-img" style="width:' + sz + 'px;height:' + sz + 'px" ' +
    'data-fallback="' + escapeHtml(localFallback) + '" ' +
    'onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){ this.src = this.dataset.fallback; } else { this.style.display=\'none\'; }">' +
    '</div>';
}

function renderPodium(top3) {
  var podium = document.getElementById('leaderboard-podium');
  if (!podium || !top3.length) return;

  var medals = ['🥇', '🥈', '🥉'];
  var podiumColors = [
    'linear-gradient(135deg, #fbbf24, #f59e0b)',
    'linear-gradient(135deg, #94a3b8, #cbd5e1)',
    'linear-gradient(135deg, #d97706, #b45309)'
  ];

  var html = '';
  top3.forEach(function(student, idx) {
    var scoring = student.scoring || {};
    var detailHref = 'student-detail.html?id=' + encodeURIComponent(student.id || student.registerNo || student.name);

    html += [
      '<div class="podium-place podium-' + (idx + 1) + '" data-aos="fade-up" data-aos-delay="' + (idx * 150) + '">',
        '<a href="' + detailHref + '" class="podium-card" style="text-decoration:none;color:inherit">',
          '<div class="podium-medal">' + medals[idx] + '</div>',
          '<div class="podium-photo">' + getPhotoHtml(student, 64) + '</div>',
          '<div class="podium-name">' + escapeHtml(student.name) + '</div>',
          '<div class="podium-roll font-mono">' + escapeHtml(student.registerNo || student.rollno || '') + '</div>',
          '<div class="podium-score">' + student.totalPoints + ' pts</div>',
          '<div class="podium-meta">',
            '<span><i class="fa-solid fa-microchip"></i> ' + (scoring.projectCount || 0) + ' projects</span>',
          '</div>',
        '</a>',
        '<div class="podium-base" style="background:' + podiumColors[idx] + '"></div>',
      '</div>'
    ].join('');
  });

  podium.innerHTML = html;
}

function renderTable(students) {
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
    var scoring = student.scoring || {};
    var detailHref = 'student-detail.html?id=' + encodeURIComponent(student.id || student.registerNo || student.name);

    // Build category badges
    var categoryBadges = '';
    (scoring.projects || []).forEach(function(p) {
      categoryBadges += '<span class="badge" style="background:' + p.categoryColor + '15;color:' + p.categoryColor + ';border:1px solid ' + p.categoryColor + '30;font-size:0.65rem;padding:2px 6px;margin:1px">' + escapeHtml(p.categoryLabel) + '</span>';
    });

    html += [
      '<tr data-aos="fade-up" data-aos-delay="' + Math.min(idx * 20, 200) + '">',
        '<td class="rank-col"><span class="rank-badge">#' + student.rank + '</span></td>',
        '<td>',
          '<a href="' + detailHref + '" class="leaderboard-student-link">',
            getPhotoHtml(student, 36),
            '<div>',
              '<div class="font-medium" style="color:var(--clr-text-primary)">' + escapeHtml(student.name) + '</div>',
              '<div class="font-mono text-xs" style="color:var(--clr-accent)">' + escapeHtml(student.registerNo || student.rollno || '') + '</div>',
            '</div>',
          '</a>',
        '</td>',
        '<td class="hidden md:table-cell text-center">',
          '<span class="font-mono font-semibold" style="color:var(--clr-accent)">' + (scoring.projectCount || 0) + '</span>',
        '</td>',
        '<td class="hidden lg:table-cell">',
          '<div class="flex flex-wrap gap-0.5">' + categoryBadges + '</div>',
        '</td>',
        '<td class="text-center">',
          '<div class="font-mono font-bold text-sm" style="color:var(--clr-text-primary)">' + student.totalPoints + '</div>',
          '<div class="text-xs" style="color:var(--clr-text-muted)">pts</div>',
        '</td>',
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
    var rawStudents = data.students || [];

    // Generate leaderboard with scores
    var allStudents = window.generateLeaderboard(rawStudents);
    var maxScore = allStudents.length > 0 ? allStudents[0].totalPoints : 0;

    var currentYearFilter = 'all';
    var currentSearch = '';

    function getYearToken(student) {
      var text = String(student.year || student.yearToken || '').toUpperCase();
      if (text.includes('IV')) return 'IV';
      if (text.includes('III')) return 'III';
      if (text.includes('II') && !text.includes('III')) return 'II';
      if (/\bI\b/.test(text) || text === 'I') return 'I';
      return 'III';
    }

    function applyFilters() {
      var filtered = allStudents.filter(function(s) {
        var yearMatch = currentYearFilter === 'all' || getYearToken(s) === currentYearFilter;
        var q = currentSearch.toLowerCase().trim();
        var searchMatch = !q ||
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.registerNo && s.registerNo.toLowerCase().includes(q)) ||
          (s.rollno && s.rollno.toLowerCase().includes(q));
        return yearMatch && searchMatch;
      });

      // Re-rank filtered list
      var currentRank = 1;
      filtered.forEach(function(s, i) {
        if (i > 0 && s.totalPoints === filtered[i - 1].totalPoints &&
            s.advancedProjectCount === filtered[i - 1].advancedProjectCount &&
            s.projectCount === filtered[i - 1].projectCount) {
          s.rank = filtered[i - 1].rank;
        } else {
          s.rank = currentRank;
        }
        currentRank = i + 2;
      });

      var displayTop3 = filtered.slice(0, 3);
      var displayRest = filtered.slice(3);

      renderPodium(displayTop3);
      renderTable(displayRest);

      if (stats) {
        stats.textContent = filtered.length + ' of ' + allStudents.length + ' students' +
          (currentYearFilter !== 'all' ? ' · Year ' + currentYearFilter : '') +
          (currentSearch ? ' · "' + currentSearch + '"' : '');
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
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(function() {
          currentSearch = searchInput.value.trim();
          applyFilters();
        }, 150);
      });
    }

    applyFilters();

    if (typeof AOS !== 'undefined') AOS.refreshHard();

    if (allStudents.length > 0) {
      setTimeout(function() {
        if (typeof gsap !== 'undefined') {
          gsap.from('.podium-place', {
            y: 200, opacity: 0, duration: 1,
            stagger: 0.15, ease: 'back.out(1.7)'
          });
        }
        triggerConfetti();
      }, 300);
    }

  } catch (err) {
    console.error('[Leaderboard] Error:', err);
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" class="py-8 text-center" style="color:var(--clr-text-secondary)">Failed to load leaderboard data.</td></tr>';
    }
  }
}

document.addEventListener('DOMContentLoaded', initLeaderboard);
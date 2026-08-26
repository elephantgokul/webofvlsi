var _searchIndex = [];
var _searchDataLoaded = false;

function buildSearchIndex(data) {
  var siteIndex = window.SITE_INDEX || [];
  _searchIndex = [];

  siteIndex.forEach(function(p) {
    _searchIndex.push({
      type: 'page',
      title: p.title,
      url: p.url,
      keywords: (p.keywords || []).join(' '),
      subtitle: '',
      photo: null
    });
  });

  (data.students || []).forEach(function(s) {
    _searchIndex.push({
      type: 'student',
      title: s.name,
      subtitle: (s.registerNo || '') + ' \u00b7 ' + (s.year || ''),
      url: 'pages/student-detail.html?id=' + encodeURIComponent(s.registerNo || s.name),
      keywords: [s.name, s.registerNo, s.universityNo, s.email, s.batch, s.achievement].filter(Boolean).join(' '),
      photo: s.photoUrl || s.image,
      yearToken: s.yearToken
    });
  });

  (data.faculty || []).forEach(function(f) {
    _searchIndex.push({
      type: 'faculty',
      title: f.name,
      subtitle: (f.designation || '') + ' \u00b7 ' + (f.specialization || ''),
      url: 'pages/faculty.html',
      keywords: [f.name, f.designation, f.specialization, f.qualification].filter(Boolean).join(' '),
      photo: f.photoUrl || f.image
    });
  });

  _searchDataLoaded = true;
}

function fuzzyScore(str, query) {
  str = str.toLowerCase(); query = query.toLowerCase();
  if (str.includes(query)) return 1.0;
  function bigrams(s) {
    var bg = {}; for(var i=0;i<s.length-1;i++) bg[s.slice(i,i+2)]=1; return bg;
  }
  var sb = bigrams(str), qb = bigrams(query), hits = 0, total = Object.keys(qb).length;
  if (!total) return 0;
  Object.keys(qb).forEach(function(b) { if (sb[b]) hits++; });
  return hits / total;
}

function renderSearchResults(query) {
  var container = document.getElementById('search-results');
  var emptyState = document.getElementById('search-empty');
  if (!container) return;

  if (!query || query.trim().length < 2) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  var results = _searchIndex.map(function(item) {
    var score = fuzzyScore(item.keywords, query);
    return { item: item, score: score };
  }).filter(function(r) { return r.score > 0.15; })
    .sort(function(a, b) { return b.score - a.score; })
    .slice(0, 20);

  if (!results.length) {
    container.innerHTML = '<div class="p-4 text-center" style="color:var(--clr-text-secondary)">No results for &ldquo;' + escapeHtml(query) + '&rdquo;</div>';
    return;
  }

  var grouped = {};
  results.forEach(function(r) {
    var type = r.item.type;
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(r);
  });

  var typeLabels = { page: 'Pages', student: 'Students', faculty: 'Faculty' };
  var typeIcons = { page: 'fa-file-lines', student: 'fa-user-graduate', faculty: 'fa-chalkboard-user' };

  var html = '';
  var typeOrder = ['page', 'student', 'faculty'];
  typeOrder.forEach(function(type) {
    if (!grouped[type]) return;
    html += '<div class="search-group" data-aos="fade-up">';
    html += '<h3 class="search-group-title" style="color:var(--clr-text-secondary);font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.75rem;padding-left:.5rem">' + typeLabels[type] + '</h3>';
    grouped[type].forEach(function(r, idx) {
      var item = r.item;
      var photoHtml = '';
      if (item.photo) {
        photoHtml = '<img src="' + escapeHtml(item.photo) + '" alt="" class="sr-photo" onerror="this.style.display=\'none\'">';
      } else {
        photoHtml = '<div class="sr-photo-placeholder"><i class="fa-solid ' + typeIcons[type] + '"></i></div>';
      }
      html += [
        '<a href="' + escapeHtml(item.url) + '" class="sr-item" tabindex="0" role="option" data-aos="fade-up" data-aos-delay="' + (idx * 30) + '">',
          '<div class="sr-media">' + photoHtml + '</div>',
          '<div class="sr-content">',
            '<div class="sr-header">',
              '<span class="sr-badge sr-badge--' + type + '">' + typeLabels[type].slice(0,-1) + '</span>',
              '<span class="sr-score" style="display:none">' + Math.round(r.score * 100) + '%</span>',
            '</div>',
            '<p class="sr-item-title">' + escapeHtml(item.title) + '</p>',
            '<p class="sr-item-subtitle">' + escapeHtml(item.subtitle) + '</p>',
          '</div>',
        '</a>'
      ].join('');
    });
    html += '</div>';
  });

  container.innerHTML = html;

  if (typeof AOS !== 'undefined') AOS.refreshHard();
  bindKeyboardNavigation(container);
}

function bindKeyboardNavigation(container) {
  var items = container.querySelectorAll('.sr-item');
  var currentIndex = -1;

  function clearFocus() {
    items.forEach(function(el) { el.classList.remove('sr-focused'); });
  }

  function focusIndex(idx) {
    clearFocus();
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('sr-focused');
      items[idx].focus();
      items[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      currentIndex = idx;
    }
  }

  container.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusIndex(Math.min(currentIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusIndex(Math.max(currentIndex - 1, 0));
    } else if (e.key === 'Enter' && currentIndex >= 0) {
      e.preventDefault();
      items[currentIndex].click();
    } else if (e.key === 'Escape') {
      var input = document.getElementById('search-input');
      if (input) { input.blur(); clearFocus(); currentIndex = -1; }
    }
  });

  items.forEach(function(item, idx) {
    item.addEventListener('focus', function() { currentIndex = idx; });
    item.addEventListener('mouseenter', function() { focusIndex(idx); });
  });
}

function initSearch() {
  var input = document.getElementById('search-input');
  var resultsContainer = document.getElementById('search-results');
  var overlay = document.getElementById('search-overlay');
  var trigger = document.getElementById('search-trigger');
  var closeBtn = document.getElementById('search-close');

  if (!input || !resultsContainer) return;

  var debounceTimer;
  input.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      renderSearchResults(input.value.trim());
    }, 120);
  });

  if (trigger && overlay) {
    trigger.addEventListener('click', function() {
      overlay.classList.remove('hidden');
      setTimeout(function() { input.focus(); }, 100);
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        overlay.classList.add('hidden');
        input.value = '';
        resultsContainer.innerHTML = '';
      });
    }
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
        input.value = '';
        resultsContainer.innerHTML = '';
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay && !overlay.classList.contains('hidden')) return;
      if (trigger) trigger.click();
    }
    if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
      overlay.classList.add('hidden');
      input.value = '';
      resultsContainer.innerHTML = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  if (window.fetchDepartmentData) {
    window.fetchDepartmentData().then(function(data) {
      buildSearchIndex(data);
      initSearch();
    }).catch(function() {
      initSearch();
    });
  } else {
    initSearch();
  }
});

window.buildSearchIndex = buildSearchIndex;
window.fuzzyScore = fuzzyScore;
window.renderSearchResults = renderSearchResults;
window.initSearch = initSearch;
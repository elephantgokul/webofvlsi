(function (window, document) {
  'use strict';

  var events = Array.isArray(window.EVENTS_CONDUCTED) ? window.EVENTS_CONDUCTED : [];
  var categoryLabels = {
    workshops: 'Workshops',
    'technical-training': 'Technical Training',
    'guest-lectures': 'Guest Lectures',
    hackathons: 'Hackathons',
    'innovation-activities': 'Innovation Activities'
  };
  var categories = [
    { id: 'all', label: 'All Events' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'technical-training', label: 'Technical Training' },
    { id: 'guest-lectures', label: 'Guest Lectures' },
    { id: 'hackathons', label: 'Hackathons' },
    { id: 'innovation-activities', label: 'Innovation Activities' }
  ];
  var selectedCategory = 'all';
  var selectedYear = 'all';

  function node(tagName, className, text) {
    var item = document.createElement(tagName);
    if (className) item.className = className;
    if (text !== undefined && text !== null) item.textContent = String(text);
    return item;
  }

  function append(parent, child) {
    parent.appendChild(child);
    return child;
  }

  function categoryName(event) {
    return categoryLabels[event.category] || 'Activity';
  }

  function renderStatistics() {
    var root = document.getElementById('event-statistics');
    if (!root) return;
    root.replaceChildren();

    var workshops = events.filter(function (event) { return event.category === 'workshops'; }).length;
    var hackathons = events.filter(function (event) { return event.category === 'hackathons'; }).length;
    var studentParticipations = events.reduce(function (total, event) {
      return total + (Number.isFinite(event.students) ? event.students : 0);
    }, 0);
    var stats = [
      { label: 'Total Events', value: String(events.length), note: 'Activities listed in the request' },
      { label: 'Total Student Participation', value: String(studentParticipations), note: 'Event attendance entries · not unique students' },
      { label: 'Total Workshops', value: String(workshops), note: 'Classified from the activity titles' },
      { label: 'Total Hackathons', value: String(hackathons), note: 'Classified from the activity titles' }
    ];

    stats.forEach(function (stat) {
      var card = append(root, node('div', 'ec-stat'));
      append(card, node('span', 'ec-stat-label', stat.label));
      append(card, node('strong', 'ec-stat-value', stat.value));
      append(card, node('span', 'ec-stat-note', stat.note));
    });
  }

  function renderCategoryFilters() {
    var root = document.getElementById('category-filters');
    if (!root) return;
    root.replaceChildren();

    categories.forEach(function (category) {
      var button = node('button', 'ec-filter', category.label);
      button.type = 'button';
      button.dataset.category = category.id;
      button.setAttribute('aria-pressed', String(selectedCategory === category.id));
      button.addEventListener('click', function () {
        selectedCategory = category.id;
        renderCategoryFilters();
        renderEvents();
      });
      append(root, button);
    });
  }

  function renderAcademicYears() {
    var select = document.getElementById('academic-year-filter');
    if (!select) return;

    var years = [];
    var hasUnverified = false;
    events.forEach(function (event) {
      if (event.academicYear && years.indexOf(event.academicYear) === -1) years.push(event.academicYear);
      if (!event.academicYear) hasUnverified = true;
    });
    years.sort(function (a, b) { return b.localeCompare(a); });
    select.replaceChildren();
    append(select, new Option('All academic years', 'all'));
    years.forEach(function (year) { append(select, new Option(year, year)); });
    if (hasUnverified) append(select, new Option('Academic year not verified', 'pending'));
    select.value = selectedYear;
    select.addEventListener('change', function () {
      selectedYear = select.value;
      renderEvents();
    });
  }

  function renderCard(event, index) {
    var article = node('article', 'ec-card');
    article.style.animationDelay = Math.min(index, 8) * 35 + 'ms';

    var visual = node('div', 'ec-visual');
    var photo = Array.isArray(event.photos) ? event.photos.find(function (item) {
      return item && /^\.\.\/assets\/images\/events\/[a-z0-9-]+\/[a-z0-9._-]+\.(?:avif|jpe?g|png|webp)$/i.test(item.src || '') &&
        typeof item.alt === 'string' && item.alt.trim();
    }) : null;
    if (photo) {
      var image = node('img', 'ec-card-image');
      image.src = photo.src;
      image.alt = photo.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', function () {
        visual.replaceChildren();
        visual.classList.add('ec-visual-placeholder');
        visual.setAttribute('role', 'img');
        visual.setAttribute('aria-label', 'Photograph unavailable for ' + event.title + '. Placeholder shown.');
      });
      append(visual, image);
    } else {
      visual.classList.add('ec-visual-placeholder');
      visual.setAttribute('role', 'img');
      visual.setAttribute('aria-label', 'No event photograph supplied for ' + event.title + '. A placeholder is shown.');
      var visualContent = node('div', '');
      var mark = node('span', 'ec-visual-mark');
      var icon = node('i', 'fa-solid fa-microchip');
      icon.setAttribute('aria-hidden', 'true');
      append(mark, icon);
      append(visualContent, mark);
      append(visualContent, node('span', 'ec-visual-label', 'Event photograph to be added'));
      append(visual, visualContent);
    }
    append(article, visual);

    var body = append(article, node('div', 'ec-card-body'));
    var meta = append(body, node('div', 'ec-card-meta'));
    append(meta, node('span', 'ec-date' + (event.dateLabel ? '' : ' is-pending'), event.dateLabel || 'Date pending report'));
    append(meta, node('span', 'ec-badge', categoryName(event)));
    append(body, node('h3', '', event.title));
    append(body, node('p', 'ec-card-description', event.description));
    if (event.duration) append(body, node('p', 'ec-duration', event.duration));

    var footer = append(body, node('div', 'ec-card-foot'));
    var staffCount = event.staffLabel || String(event.staff);
    append(footer, node('span', 'ec-participants', event.students + ' students · ' + staffCount + ' staff'));
    var link = node('a', 'ec-detail-link', 'View details');
    link.href = 'event-detail.html?event=' + encodeURIComponent(event.id);
    link.setAttribute('aria-label', 'View details for ' + event.title);
    var arrow = node('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    append(link, arrow);
    append(footer, link);
    return article;
  }

  function renderEvents() {
    var grid = document.getElementById('event-grid');
    var count = document.getElementById('event-result-count');
    if (!grid || !count) return;
    grid.replaceChildren();

    var filtered = events.filter(function (event) {
      var matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      var matchesYear = selectedYear === 'all' ||
        (selectedYear === 'pending' && !event.academicYear) ||
        event.academicYear === selectedYear;
      return matchesCategory && matchesYear;
    });

    count.textContent = filtered.length + (filtered.length === 1 ? ' activity' : ' activities');
    if (!filtered.length) {
      var empty = append(grid, node('div', 'ec-empty'));
      append(empty, node('strong', '', 'No activities in this selection'));
      append(empty, node('p', '', 'Try another category or academic year.'));
    } else {
      filtered.forEach(function (event, index) { append(grid, renderCard(event, index)); });
    }
    grid.setAttribute('aria-busy', 'false');
  }

  renderStatistics();
  renderCategoryFilters();
  renderAcademicYears();
  renderEvents();
}(window, document));

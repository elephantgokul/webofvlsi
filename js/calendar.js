const EVENTS = [
  { id: 1, title: 'VLSI Design Workshop', date: '2025-02-15', endDate: '2025-02-17', type: 'workshop', desc: '3-day hands-on workshop on Analog Layout Design using Cadence Virtuoso', location: 'VLSI Lab 1', link: '#' },
  { id: 2, title: 'Elecnova 2025 Symposium', date: '2025-03-10', endDate: '2025-03-11', type: 'event', desc: 'Annual technical symposium with paper presentations, project expo & industry talks', location: 'Main Auditorium', link: '#' },
  { id: 3, title: 'Synopsys Tool Training', date: '2025-01-20', endDate: '2025-01-22', type: 'workshop', desc: 'IC Compiler II & PrimeTime training by Synopsys engineers', location: 'Computer Center', link: '#' },
  { id: 4, title: 'IEEE VLSI Conference', date: '2025-04-05', endDate: '2025-04-07', type: 'event', desc: 'International conference on VLSI Design & Test', location: 'Hyderabad', link: '#' },
  { id: 5, title: 'Mid-Semester Exams', date: '2025-02-24', endDate: '2025-03-01', type: 'academic', desc: 'Theory examinations for all VLSI courses', location: 'Exam Halls', link: '#' },
  { id: 6, title: 'FPGA Hackathon', date: '2025-03-22', endDate: '2025-03-23', type: 'hackathon', desc: '24-hour FPGA design challenge with Xilinx/AMD support', location: 'VLSI Lab 2', link: '#' },
  { id: 7, title: 'Industry Expert Lecture', date: '2025-02-08', type: 'lecture', desc: 'Talk on "Advanced Node Challenges" by TSMC engineer', location: 'Seminar Hall', link: '#' },
  { id: 8, title: 'Cultural Fest - Tarang', date: '2025-03-28', endDate: '2025-03-30', type: 'cultural', desc: 'Annual cultural festival with competitions, performances & food', location: 'Campus Grounds', link: '#' },
  { id: 9, title: 'End-Semester Exams', date: '2025-05-12', endDate: '2025-05-20', type: 'academic', desc: 'Final theory & practical examinations', location: 'Exam Halls', link: '#' },
  { id: 10, title: 'Summer Internship Drive', date: '2025-04-15', endDate: '2025-04-30', type: 'career', desc: 'Campus placements & internship interviews for VLSI companies', location: 'Placement Cell', link: '#' },
  { id: 11, title: 'Research Paper Writing Workshop', date: '2025-01-25', type: 'workshop', desc: 'How to write & publish IEEE transactions papers', location: 'Library Seminar Room', link: '#' },
  { id: 12, title: 'Alumni Meet 2025', date: '2025-12-20', type: 'cultural', desc: 'Annual alumni gathering & networking event', location: 'Alumni Center', link: '#' }
];

const TYPE_COLORS = {
  workshop: 'var(--clr-accent)',
  event: 'var(--clr-cyan)',
  academic: '#7c3aed',
  hackathon: '#ea580c',
  lecture: '#059669',
  cultural: '#ec4899',
  career: '#d97706'
};

const TYPE_ICONS = {
  workshop: 'fa-screwdriver-wrench',
  event: 'fa-calendar-days',
  academic: 'fa-graduation-cap',
  hackathon: 'fa-code',
  lecture: 'fa-chalkboard-user',
  cultural: 'fa-music',
  career: 'fa-briefcase'
};

function getCurrentMonth() {
  return new Date();
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function isSameMonth(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

function getEventsForDay(date) {
  return EVENTS.filter(function(e) {
    var start = new Date(e.date + 'T00:00:00');
    var end = e.endDate ? new Date(e.endDate + 'T23:59:59') : start;
    return date >= start && date <= end;
  });
}

function getEventsForMonth(year, month) {
  return EVENTS.filter(function(e) {
    var start = new Date(e.date + 'T00:00:00');
    var end = e.endDate ? new Date(e.endDate + 'T23:59:59') : start;
    return (start.getFullYear() < year || (start.getFullYear() === year && start.getMonth() <= month)) &&
           (end.getFullYear() > year || (end.getFullYear() === year && end.getMonth() >= month));
  });
}

function renderMonthView(currentDate) {
  var container = document.getElementById('calendar-month');
  var listContainer = document.getElementById('calendar-list');
  if (!container) return;

  listContainer.classList.add('hidden');
  container.classList.remove('hidden');

  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();
  var today = new Date();
  today.setHours(0,0,0,0);

  var firstDay = new Date(year, month, 1);
  var lastDay = new Date(year, month + 1, 0);
  var startDay = firstDay.getDay();
  var daysInMonth = lastDay.getDate();

  var monthName = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  var html = [
    '<div class="surface-card overflow-hidden" style="border:1px solid var(--clr-border)">',
      '<div class="p-4 border-b border-default flex items-center justify-between" style="border-color:var(--clr-border)">',
        '<h2 class="font-display text-xl font-semibold" style="color:var(--clr-text-primary)">' + escapeHtml(monthName) + '</h2>',
      '</div>',
      '<div class="grid grid-cols-7 p-2 border-b border-default" style="border-color:var(--clr-border)">',
        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(function(d) {
          return '<div class="text-center py-2 text-xs font-semibold" style="color:var(--clr-text-muted)">' + d + '</div>';
        }).join(''),
      '</div>',
      '<div class="grid grid-cols-7 p-2 gap-0.5">'
  ];

  for (var i = 0; i < startDay; i++) {
    html.push('<div></div>');
  }

  for (var day = 1; day <= daysInMonth; day++) {
    var date = new Date(year, month, day);
    var events = getEventsForDay(date);
    var isToday = isSameDay(date, today);
    var hasEvents = events.length > 0;

    html.push('<div class="relative min-h-[100px] p-2 border rounded-xl ' + (isToday ? 'ring-2' : '') + '" style="border-color:var(--clr-border);' + (isToday ? 'border-color:var(--clr-accent);background:rgba(22,82,196,0.05)' : 'background:var(--clr-surface)') + '">');
    html.push('<span class="text-sm font-medium ' + (isToday ? 'text-accent' : '') + '" style="color:var(--clr-text-primary)">' + day + '</span>');

    if (hasEvents) {
      html.push('<div class="mt-1 space-y-1 max-h-[70px] overflow-y-auto">');
      events.slice(0, 3).forEach(function(e) {
        html.push('<div class="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80" style="background:' + TYPE_COLORS[e.type] + ';color:white;font-size:0.65rem" title="' + escapeHtml(e.title) + '">' + escapeHtml(e.title) + '</div>');
      });
      if (events.length > 3) {
        html.push('<div class="text-xs text-center" style="color:var(--clr-text-muted)">+' + (events.length - 3) + ' more</div>');
      }
      html.push('</div>');
    }
    html.push('</div>');
  }

  html.push('</div></div>');
  container.innerHTML = html.join('');
}

function renderListView(currentDate) {
  var container = document.getElementById('calendar-list');
  var monthContainer = document.getElementById('calendar-month');
  if (!container) return;

  monthContainer.classList.add('hidden');
  container.classList.remove('hidden');

  var view = document.getElementById('calendar-view').value;
  var events = EVENTS.slice().sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
  var today = new Date();
  today.setHours(0,0,0,0);

  if (view === 'upcoming') {
    events = events.filter(function(e) { return new Date(e.endDate || e.date) >= today; });
  } else if (view === 'month') {
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    events = events.filter(function(e) {
      var start = new Date(e.date + 'T00:00:00');
      var end = e.endDate ? new Date(e.endDate + 'T23:59:59') : start;
      return (start.getFullYear() < year || (start.getFullYear() === year && start.getMonth() <= month)) &&
             (end.getFullYear() > year || (end.getFullYear() === year && end.getMonth() >= month));
    });
  }

  var html = '';
  if (events.length === 0) {
    html = '<div class="surface-card p-12 text-center" style="border:1px solid var(--clr-border)"><i class="fa-solid fa-calendar-xmark text-4xl mb-3" style="color:var(--clr-text-muted)"></i><p style="color:var(--clr-text-secondary)">No events found</p></div>';
  } else {
    html = events.map(function(e, idx) {
      var start = new Date(e.date + 'T00:00:00');
      var end = e.endDate ? new Date(e.endDate + 'T23:59:59') : start;
      var isMultiDay = start.getTime() !== end.getTime();
      var isPast = end < today;
      return [
        '<article class="surface-card p-4 hover:shadow-lg transition-shadow" style="border:1px solid var(--clr-border);' + (isPast ? 'opacity-60' : '') + '" data-aos="fade-up" data-aos-delay="' + (idx * 50) + '">',
          '<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">',
            '<div class="flex items-start gap-4">',
              '<div class="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-xl" style="background:' + TYPE_COLORS[e.type] + ';color:white">',
                '<i class="fa-solid ' + TYPE_ICONS[e.type] + '"></i>',
              '</div>',
              '<div>',
                '<div class="flex items-center gap-2 mb-1">',
                  '<h3 class="font-display font-semibold" style="color:var(--clr-text-primary)">' + escapeHtml(e.title) + '</h3>',
                  '<span class="badge badge-primary text-xs">' + e.type.charAt(0).toUpperCase() + e.type.slice(1) + '</span>',
                  (isPast ? '<span class="badge badge-cyan text-xs">Past</span>' : '')
                '</div>',
                '<p class="text-sm" style="color:var(--clr-text-secondary)">' + escapeHtml(e.desc) + '</p>',
                '<div class="flex flex-wrap items-center gap-4 mt-2 text-sm" style="color:var(--clr-text-muted)">',
                  '<span><i class="fa-solid fa-calendar mr-1"></i>' + formatDate(start) + (isMultiDay ? ' - ' + formatDate(end) : '') + '</span>',
                  '<span><i class="fa-solid fa-location-dot mr-1"></i>' + escapeHtml(e.location) + '</span>',
                '</div>',
              '</div>',
            '</div>',
            '<a href="' + escapeHtml(e.link) + '" class="btn-secondary flex-shrink-0" style="white-space:nowrap">Details</a>',
          '</div>',
        '</article>'
      ].join('');
    }).join('');
  }
  container.innerHTML = html;
}

async function initCalendar() {
  var monthView = document.getElementById('calendar-month');
  var listView = document.getElementById('calendar-list');
  var viewSelect = document.getElementById('calendar-view');
  var prevBtn = document.getElementById('cal-prev');
  var nextBtn = document.getElementById('cal-next');
  var todayBtn = document.getElementById('cal-today');

  if (!monthView || !listView) return;

  var currentDate = getCurrentMonth();

  function updateView() {
    var view = viewSelect.value;
    if (view === 'month') {
      renderMonthView(currentDate);
    } else {
      renderListView(currentDate);
    }
  }

  viewSelect.addEventListener('change', updateView);
  prevBtn.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateView();
  });
  nextBtn.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateView();
  });
  todayBtn.addEventListener('click', function() {
    currentDate = getCurrentMonth();
    updateView();
  });

  updateView();
  if (typeof AOS !== 'undefined') AOS.refreshHard();
}

document.addEventListener('DOMContentLoaded', initCalendar);

function escapeHtml(v) {
  var d = document.createElement('div');
  d.textContent = v == null ? '' : String(v);
  return d.innerHTML;
}
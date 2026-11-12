// js/modal.js - Centralized Accessible Reusable Modal Component for SIET VLSI Website
// Supports Faculty, HOD, Events, Workshops, Achievements, and Student detail modals.
// Implements Escape key handling, outside click close, keyboard focus trapping, and scroll locking.

(function (window, document) {
  'use strict';

  var modalId = 'dept-unified-modal';
  var lastFocusedElement = null;

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getModal() {
    var existing = document.getElementById(modalId);
    if (existing) return existing;

    var dialog = document.createElement('dialog');
    dialog.id = modalId;
    dialog.className = 'dept-modal';
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'dept-modal-title');

    dialog.innerHTML = [
      '<div class="dept-modal-container">',
      '  <div class="dept-modal-header">',
      '    <div id="dept-modal-badge" class="dept-modal-badge"></div>',
      '    <button type="button" class="dept-modal-close" aria-label="Close modal (Esc)">',
      '      <i class="fa-solid fa-xmark"></i>',
      '    </button>',
      '  </div>',
      '  <div id="dept-modal-body" class="dept-modal-body"></div>',
      '  <div id="dept-modal-footer" class="dept-modal-footer">',
      '    <button type="button" class="dept-modal-btn-close">Close</button>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(dialog);

    // Event listeners
    var closeBtn = dialog.querySelector('.dept-modal-close');
    var footerCloseBtn = dialog.querySelector('.dept-modal-btn-close');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (footerCloseBtn) footerCloseBtn.addEventListener('click', closeModal);

    // Outside click close
    dialog.addEventListener('click', function (e) {
      var rect = dialog.getBoundingClientRect();
      var isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog || e.target === dialog) {
        closeModal();
      }
    });

    // Keyboard support: Escape & Focus trapping
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === 'Tab') {
        var focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    return dialog;
  }

  function openModal(options) {
    var dialog = getModal();
    lastFocusedElement = document.activeElement;

    var badgeElem = dialog.querySelector('#dept-modal-badge');
    var bodyElem = dialog.querySelector('#dept-modal-body');
    var footerElem = dialog.querySelector('#dept-modal-footer');

    if (badgeElem) {
      if (options.badge) {
        badgeElem.innerHTML = options.badge;
        badgeElem.style.display = 'inline-flex';
      } else {
        badgeElem.innerHTML = '';
        badgeElem.style.display = 'none';
      }
    }

    if (bodyElem) {
      bodyElem.innerHTML = options.body || '';
    }

    if (footerElem) {
      if (options.footer) {
        footerElem.innerHTML = options.footer;
        footerElem.style.display = 'flex';
      } else {
        footerElem.innerHTML = '<button type="button" class="dept-modal-btn-close">Close</button>';
        footerElem.style.display = 'flex';
        var btn = footerElem.querySelector('.dept-modal-btn-close');
        if (btn) btn.addEventListener('click', closeModal);
      }
    }

    // Scroll lock
    document.body.classList.add('dept-modal-open');

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    // Set focus inside modal
    var closeBtn = dialog.querySelector('.dept-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var dialog = document.getElementById(modalId);
    if (!dialog) return;

    if (typeof dialog.close === 'function') {
      try { dialog.close(); } catch (err) {}
    }
    dialog.removeAttribute('open');
    document.body.classList.remove('dept-modal-open');

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      try { lastFocusedElement.focus(); } catch (err) {}
    }
  }

  // Helper for resolving image paths inside modal
  function resolveModalPhoto(rawPhoto, category) {
    if (!rawPhoto) return '';
    var isInsidePages = typeof window !== 'undefined' && window.location && window.location.pathname.replace(/\\/g, '/').includes('/pages/');
    var prefix = isInsidePages ? '../assets/images/' : 'assets/images/';
    var filename = String(rawPhoto).split('/').pop();
    return prefix + (category || 'faculty') + '/' + filename;
  }

  /**
   * Open Faculty Member Detail Modal
   */
  function openFaculty(faculty) {
    if (!faculty) return;
    var photoSrc = resolveModalPhoto(faculty.photoUrl || faculty.image, 'faculty');
    var name = escapeHtml(faculty.name);
    var designation = escapeHtml(faculty.designation || 'Faculty Member');
    var qualification = escapeHtml(faculty.qualification || 'M.E.');
    var department = escapeHtml(faculty.department || 'Department of Electronics Engineering (VLSI Design and Technology)');
    var specialization = escapeHtml(faculty.specialization || 'VLSI Design and Technology');
    var email = faculty.email ? escapeHtml(faculty.email) : '';
    var bio = faculty.bio ? escapeHtml(faculty.bio) : 'Dedicated faculty mentor providing instruction and laboratory guidance in digital VLSI systems, semiconductor architecture, and hands-on EDA practice.';

    var bodyHtml = [
      '<div class="dept-modal-profile">',
      '  <div class="dept-modal-avatar-col">',
      '    <div class="dept-modal-avatar-wrapper">',
      '      <img src="' + photoSrc + '" alt="' + name + '" class="dept-modal-avatar" onerror="this.onerror=null;this.src=\'../assets/images/department_logo.png\';">',
      '    </div>',
      '  </div>',
      '  <div class="dept-modal-info-col">',
      '    <h2 id="dept-modal-title" class="dept-modal-name">' + name + '</h2>',
      '    <p class="dept-modal-designation">' + designation + '</p>',
      '    <div class="dept-modal-meta-list">',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-graduation-cap"></i> <span><strong>Qualification:</strong> ' + qualification + '</span></div>',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-building-columns"></i> <span><strong>Department:</strong> ' + department + '</span></div>',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-flask"></i> <span><strong>Specialization:</strong> ' + specialization + '</span></div>',
      email ? ('      <div class="dept-modal-meta-item"><i class="fa-solid fa-envelope"></i> <span><strong>Email:</strong> <a href="mailto:' + email + '" class="dept-modal-link">' + email + '</a></span></div>') : '',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="dept-modal-section">',
      '  <h3 class="dept-modal-section-title"><i class="fa-solid fa-user-tie"></i> Biography & Academic Profile</h3>',
      '  <p class="dept-modal-text">' + bio + '</p>',
      '</div>'
    ].join('\n');

    openModal({
      badge: '<span class="dept-badge-pill"><i class="fa-solid fa-chalkboard-user mr-1.5"></i>Faculty Profile</span>',
      body: bodyHtml,
      footer: [
        email ? ('<a href="mailto:' + email + '" class="dept-modal-btn-primary"><i class="fa-solid fa-envelope"></i> Contact via Email</a>') : '',
        '<button type="button" class="dept-modal-btn-close">Close</button>'
      ].join('\n')
    });
  }

  /**
   * Open HOD Detail Modal
   */
  function openHOD(hod) {
    var data = hod || (window.DEPT_FALLBACK_DATA ? window.DEPT_FALLBACK_DATA.hod : null);
    if (!data) return;

    var photoSrc = resolveModalPhoto(data.photoUrl || data.image, 'faculty');
    var name = escapeHtml(data.name || 'Dr. P. Dhilipkumar');
    var designation = escapeHtml(data.designation || 'Associate Professor & Head');
    var qualification = escapeHtml(data.qualification || 'M.E., Ph.D.');
    var department = escapeHtml(data.department || 'Department of Electronics Engineering (VLSI Design and Technology)');
    var email = escapeHtml(data.contact || 'dhilipkumarece@siet.ac.in');
    var phone = escapeHtml(data.phone || '+91 96295 61731');
    var message = escapeHtml(data.message || 'Welcome to the Department of Electronics Engineering (VLSI Design and Technology) at Sri Shakthi Institute of Engineering and Technology.');
    var interests = Array.isArray(data.researchInterests) ? data.researchInterests : ['VLSI Design', 'Embedded Systems', 'Semiconductor Design'];

    var interestsHtml = interests.map(function (item) {
      return '<span class="dept-modal-tag">' + escapeHtml(item) + '</span>';
    }).join(' ');

    var bodyHtml = [
      '<div class="dept-modal-profile">',
      '  <div class="dept-modal-avatar-col">',
      '    <div class="dept-modal-avatar-wrapper">',
      '      <img src="' + photoSrc + '" alt="' + name + '" class="dept-modal-avatar" onerror="this.onerror=null;this.src=\'../assets/images/department_logo.png\';">',
      '    </div>',
      '  </div>',
      '  <div class="dept-modal-info-col">',
      '    <h2 id="dept-modal-title" class="dept-modal-name">' + name + '</h2>',
      '    <p class="dept-modal-designation">' + designation + '</p>',
      '    <div class="dept-modal-meta-list">',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-graduation-cap"></i> <span><strong>Qualification:</strong> ' + qualification + '</span></div>',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-building-columns"></i> <span><strong>Department:</strong> ' + department + '</span></div>',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-envelope"></i> <span><strong>Email:</strong> <a href="mailto:' + email + '" class="dept-modal-link">' + email + '</a></span></div>',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-phone"></i> <span><strong>Phone:</strong> ' + phone + '</span></div>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="dept-modal-section">',
      '  <h3 class="dept-modal-section-title"><i class="fa-solid fa-quote-left"></i> Message from the Head of Department</h3>',
      '  <blockquote class="dept-modal-quote">' + message + '</blockquote>',
      '</div>',
      '<div class="dept-modal-section">',
      '  <h3 class="dept-modal-section-title"><i class="fa-solid fa-flask"></i> Research Interests</h3>',
      '  <div class="dept-modal-tag-container">' + interestsHtml + '</div>',
      '</div>'
    ].join('\n');

    openModal({
      badge: '<span class="dept-badge-pill"><i class="fa-solid fa-crown mr-1.5"></i>Head of Department</span>',
      body: bodyHtml,
      footer: [
        '<a href="mailto:' + email + '" class="dept-modal-btn-primary"><i class="fa-solid fa-envelope"></i> Contact HOD</a>',
        '<button type="button" class="dept-modal-btn-close">Close</button>'
      ].join('\n')
    });
  }

  /**
   * Open Event Detail Modal (e.g. THE LOST SILICON)
   */
  function openEvent(eventData) {
    var title = escapeHtml(eventData.title || 'Event Details');
    var badge = escapeHtml(eventData.badge || 'Department Event');
    var date = escapeHtml(eventData.date || 'To be updated');
    var venue = escapeHtml(eventData.venue || 'SIET Campus');
    var coordinator = escapeHtml(eventData.coordinator || 'Department Faculty');
    var description = eventData.descriptionHtml || ('<p class="dept-modal-text">' + escapeHtml(eventData.description || '') + '</p>');

    var bodyHtml = [
      '<div class="dept-modal-event-header">',
      '  <h2 id="dept-modal-title" class="dept-modal-name">' + title + '</h2>',
      '  <div class="dept-modal-meta-list mt-3">',
      '    <div class="dept-modal-meta-item"><i class="fa-solid fa-calendar-day"></i> <span><strong>Date:</strong> ' + date + '</span></div>',
      '    <div class="dept-modal-meta-item"><i class="fa-solid fa-location-dot"></i> <span><strong>Venue:</strong> ' + venue + '</span></div>',
      '    <div class="dept-modal-meta-item"><i class="fa-solid fa-user-check"></i> <span><strong>Coordinator:</strong> ' + coordinator + '</span></div>',
      '  </div>',
      '</div>',
      '<div class="dept-modal-section mt-6">',
      '  <h3 class="dept-modal-section-title"><i class="fa-solid fa-circle-info"></i> Event Overview & Schedule</h3>',
      '  ' + description,
      '</div>'
    ].join('\n');

    openModal({
      badge: '<span class="dept-badge-pill"><i class="fa-solid fa-calendar-check mr-1.5"></i>' + badge + '</span>',
      body: bodyHtml
    });
  }

  /**
   * Open Technical Workshops Detail Modal
   */
  function openWorkshops(data) {
    var title = escapeHtml(data.title || 'Faculty-Led Technical Training');
    var bodyHtml = [
      '<div class="dept-modal-event-header">',
      '  <h2 id="dept-modal-title" class="dept-modal-name">' + title + '</h2>',
      '  <p class="dept-modal-designation">Curriculum-integrated hands-on industry EDA tool training</p>',
      '</div>',
      '<div class="dept-modal-section space-y-4 mt-6">',
      '  <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">',
      '    <h4 class="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-microchip text-blue-600"></i> Cadence RTL to GDSII Workshop</h4>',
      '    <p class="text-xs text-slate-600 leading-relaxed">Comprehensive ASIC implementation flow utilizing Cadence digital toolsets. Covers logic synthesis (Genus), automated floorplanning, power planning, Clock Tree Synthesis (CTS), routing, and physical verification signoff (Innovus).</p>',
      '  </div>',
      '  <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">',
      '    <h4 class="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-laptop-code text-blue-600"></i> Synopsys Front-End Design Workshop</h4>',
      '    <p class="text-xs text-slate-600 leading-relaxed">SystemVerilog RTL architecture, functional simulation, and constraint generation. Hands-on labs with Synopsys VCS simulator, Verdi debug platform, and Design Compiler logic synthesis.</p>',
      '  </div>',
      '  <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">',
      '    <h4 class="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2"><i class="fa-solid fa-bolt text-blue-600"></i> VELTRAXX \'26 24-Hour Hackathon</h4>',
      '    <p class="text-xs text-slate-600 leading-relaxed">Department flagship 24-hour silicon hackathon challenging student teams to design, simulate, and verify innovative hardware solutions addressing real-world semiconductor computing problems.</p>',
      '  </div>',
      '</div>'
    ].join('\n');

    openModal({
      badge: '<span class="dept-badge-pill"><i class="fa-solid fa-screwdriver-wrench mr-1.5"></i>Technical Training</span>',
      body: bodyHtml
    });
  }

  /**
   * Open Achievement Detail Modal (Uncropped image, full untruncated text, winners list)
   */
  function openAchievement(data) {
    var title = escapeHtml(data.title || 'Achievement Details');
    var category = escapeHtml(data.category || 'Department Achievement');
    var date = escapeHtml(data.date || '2026');
    var venue = escapeHtml(data.venue || 'SIET');
    var imageSrc = data.image ? String(data.image) : '';
    var fullDescription = data.descriptionHtml || ('<p class="dept-modal-text">' + escapeHtml(data.description || '') + '</p>');
    var participantsHtml = data.participantsHtml || '';

    var imageBlock = imageSrc ? [
      '<div class="dept-modal-achievement-media">',
      '  <img src="' + escapeHtml(imageSrc) + '" alt="' + title + '" class="dept-modal-achievement-img" onerror="this.parentNode.style.display=\'none\';">',
      '</div>'
    ].join('\n') : '';

    var bodyHtml = [
      imageBlock,
      '<div class="p-1">',
      '  <h2 id="dept-modal-title" class="dept-modal-name mt-3">' + title + '</h2>',
      '  <div class="dept-modal-meta-list mt-3">',
      '    <div class="dept-modal-meta-item"><i class="fa-solid fa-trophy"></i> <span><strong>Category:</strong> ' + category + '</span></div>',
      '    <div class="dept-modal-meta-item"><i class="fa-solid fa-calendar-day"></i> <span><strong>Date:</strong> ' + date + '</span></div>',
      venue ? ('    <div class="dept-modal-meta-item"><i class="fa-solid fa-location-dot"></i> <span><strong>Venue:</strong> ' + venue + '</span></div>') : '',
      '  </div>',
      '  <div class="dept-modal-section mt-5">',
      '    <h3 class="dept-modal-section-title"><i class="fa-solid fa-align-left"></i> Full Description & Highlights</h3>',
      '    ' + fullDescription,
      '  </div>',
      participantsHtml ? [
        '  <div class="dept-modal-section mt-5">',
        '    <h3 class="dept-modal-section-title"><i class="fa-solid fa-users"></i> Awardees & Participants</h3>',
        '    ' + participantsHtml,
        '  </div>'
      ].join('\n') : '',
      '</div>'
    ].join('\n');

    openModal({
      badge: '<span class="dept-badge-pill"><i class="fa-solid fa-award mr-1.5"></i>' + category + '</span>',
      body: bodyHtml
    });
  }

  /**
   * Open Student Profile Detail Modal
   */
  function openStudent(student) {
    if (!student) return;
    var name = escapeHtml(student.name);
    var programme = escapeHtml(student.programme || 'B.E. VLSI Design and Technology');
    var year = escapeHtml(student.year || 'III Year');
    var batch = escapeHtml(student.batch || '2024 - 2028');
    var photoSrc = resolveModalPhoto(student.photoUrl || student.image, 'students');
    var achTitle = escapeHtml(student.achievementTitle || 'Achievements');
    var achievement = escapeHtml(student.achievement || 'To be updated');
    var projects = escapeHtml(student.projectsOverview || student.description || 'To be updated');
    var linkedin = student.linkedin ? escapeHtml(student.linkedin) : '';

    var bodyHtml = [
      '<div class="dept-modal-profile">',
      '  <div class="dept-modal-avatar-col">',
      '    <div class="dept-modal-avatar-wrapper">',
      '      <img src="' + photoSrc + '" alt="' + name + '" class="dept-modal-avatar" onerror="this.onerror=null;this.src=\'../assets/images/department_logo.png\';">',
      '    </div>',
      '  </div>',
      '  <div class="dept-modal-info-col">',
      '    <h2 id="dept-modal-title" class="dept-modal-name">' + name + '</h2>',
      '    <p class="dept-modal-designation">' + programme + '</p>',
      '    <div class="dept-modal-meta-list">',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-graduation-cap"></i> <span><strong>Year:</strong> ' + year + '</span></div>',
      '      <div class="dept-modal-meta-item"><i class="fa-solid fa-calendar"></i> <span><strong>Batch:</strong> ' + batch + '</span></div>',
      linkedin ? ('      <div class="dept-modal-meta-item"><i class="fa-brands fa-linkedin"></i> <span><strong>LinkedIn:</strong> <a href="' + linkedin + '" target="_blank" rel="noopener noreferrer" class="dept-modal-link">View Profile</a></span></div>') : '',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="dept-modal-section">',
      '  <h3 class="dept-modal-section-title"><i class="fa-solid fa-trophy"></i> ' + achTitle + '</h3>',
      '  <p class="dept-modal-text whitespace-pre-line">' + achievement + '</p>',
      '</div>',
      '<div class="dept-modal-section">',
      '  <h3 class="dept-modal-section-title"><i class="fa-solid fa-microchip"></i> Projects & Technical Portfolio</h3>',
      '  <p class="dept-modal-text whitespace-pre-line">' + projects + '</p>',
      '</div>'
    ].join('\n');

    openModal({
      badge: '<span class="dept-badge-pill"><i class="fa-solid fa-user-graduate mr-1.5"></i>Student Profile</span>',
      body: bodyHtml,
      footer: [
        linkedin ? ('<a href="' + linkedin + '" target="_blank" rel="noopener noreferrer" class="dept-modal-btn-primary"><i class="fa-brands fa-linkedin"></i> LinkedIn Profile</a>') : '',
        '<button type="button" class="dept-modal-btn-close">Close</button>'
      ].join('\n')
    });
  }

  // Export to window
  window.DeptModal = {
    open: openModal,
    close: closeModal,
    openFaculty: openFaculty,
    openHOD: openHOD,
    openEvent: openEvent,
    openWorkshops: openWorkshops,
    openAchievement: openAchievement,
    openStudent: openStudent
  };

})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : null);

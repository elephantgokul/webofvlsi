(function (window, document) {
  'use strict';

  var eventList = Array.isArray(window.EVENTS_CONDUCTED) ? window.EVENTS_CONDUCTED : [];
  var categories = {
    workshops: 'Workshops',
    'technical-training': 'Technical Training',
    'guest-lectures': 'Guest Lectures',
    hackathons: 'Hackathons',
    'innovation-activities': 'Innovation Activities'
  };
  var imagePathPattern = /^\.\.\/assets\/images\/events\/[a-z0-9-]+\/[a-z0-9._-]+\.(?:avif|jpe?g|png|webp)$/i;
  var currentPhotos = [];
  var currentPhotoIndex = 0;
  var transitionTimer = 0;

  function element(tagName, className, text) {
    var item = document.createElement(tagName);
    if (className) item.className = className;
    if (text !== undefined && text !== null) item.textContent = String(text);
    return item;
  }

  function add(parent, child) {
    parent.appendChild(child);
    return child;
  }

  function valueOrPending(value) {
    return value ? String(value) : 'Awaiting activity report';
  }

  function addFact(root, label, value) {
    var fact = add(root, element('div', 'ed-fact'));
    add(fact, element('span', 'ed-fact-label', label));
    add(fact, element('span', value ? 'ed-fact-value' : 'ed-fact-value ed-pending', valueOrPending(value)));
  }

  function addParticipation(root, label, value) {
    var row = add(root, element('div', 'ed-participation-row'));
    add(row, element('span', '', label));
    add(row, element('strong', '', value === null || value === undefined ? 'Pending' : String(value)));
  }

  function validPhotos(event) {
    return (Array.isArray(event.photos) ? event.photos : []).filter(function (photo) {
      return photo && typeof photo.src === 'string' && imagePathPattern.test(photo.src) &&
        typeof photo.alt === 'string' && photo.alt.trim().length > 0;
    });
  }

  function renderList(root, title, items) {
    var section = add(root, element('section', 'ed-panel'));
    add(section, element('h2', '', title));
    if (!Array.isArray(items) || items.length === 0) {
      add(section, element('p', 'ed-empty-list', 'Details will be added from the activity report.'));
      return;
    }
    var list = add(section, element('ul', 'ed-list'));
    items.forEach(function (item) { add(list, element('li', '', item)); });
  }

  function renderGallery(root, photos) {
    var section = add(root, element('section', 'ed-gallery'));
    var heading = add(section, element('div', 'ed-gallery-heading'));
    var titleBlock = add(heading, element('div'));
    add(titleBlock, element('h2', '', 'Photo gallery'));
    add(titleBlock, element('p', '', 'Department supplied photographs for this activity.'));

    if (!photos.length) {
      var empty = add(section, element('div', 'ed-gallery-empty'));
      var icon = add(empty, element('i', 'fa-regular fa-images'));
      icon.setAttribute('aria-hidden', 'true');
      add(empty, element('strong', '', 'Photographs will be added here'));
      add(empty, element('p', '', 'No event photographs were included with the available files. This gallery is ready for images supplied by the department.'));
      return;
    }

    var grid = add(section, element('div', 'ed-gallery-grid'));
    photos.forEach(function (photo, index) {
      var button = add(grid, element('button', 'ed-photo-button'));
      button.type = 'button';
      button.setAttribute('aria-label', 'Open photo ' + (index + 1) + ': ' + photo.alt);
      var image = add(button, element('img'));
      image.src = photo.src;
      image.alt = photo.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', function () { button.remove(); });
      button.addEventListener('click', function () { openLightbox(photos, index); });
    });
  }

  function renderEvent(event) {
    var root = document.getElementById('event-detail');
    if (!root) return;
    root.replaceChildren();

    var heading = add(root, element('section', 'ed-heading'));
    var breadcrumb = add(heading, element('nav', 'ed-breadcrumb'));
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    var home = add(breadcrumb, element('a', '', 'Home'));
    home.href = '../index.html';
    add(breadcrumb, element('span', '', '/'));
    var eventsLink = add(breadcrumb, element('a', '', 'Events'));
    eventsLink.href = 'events.html';
    add(breadcrumb, element('span', '', '/'));
    var archiveLink = add(breadcrumb, element('a', '', 'Events Conducted'));
    archiveLink.href = 'events-conducted.html';
    add(breadcrumb, element('span', '', '/'));
    add(breadcrumb, element('span', '', event.title));
    add(heading, element('p', 'ec-eyebrow', categories[event.category] || 'Activity'));
    add(heading, element('h1', 'ed-title', event.title));
    add(heading, element('p', 'ed-intro', event.description || 'An event summary and outcomes will be added from the IIC activity report.'));

    if (event.verificationNote) {
      var alert = add(heading, element('p', 'ed-alert'));
      var alertIcon = add(alert, element('i', 'fa-solid fa-triangle-exclamation'));
      alertIcon.setAttribute('aria-hidden', 'true');
      alert.appendChild(document.createTextNode(' ' + event.verificationNote));
    }

    var overview = add(root, element('section', 'ed-overview'));
    var factsPanel = add(overview, element('section', 'ed-panel'));
    add(factsPanel, element('h2', '', 'Event information'));
    var facts = add(factsPanel, element('div', 'ed-facts'));
    addFact(facts, 'Date', event.dateLabel);
    addFact(facts, 'Duration', event.duration);
    addFact(facts, 'Category', categories[event.category] || 'Activity');
    addFact(facts, 'IIC activity category', event.iicCategory);
    addFact(facts, 'Theme', event.theme);
    addFact(facts, 'Resource person', event.resourcePerson);
    addFact(facts, 'Designation', event.designation);
    addFact(facts, 'Organization', event.organization);
    addFact(facts, 'Academic year', event.academicYear);
    if (event.speakerBio) add(factsPanel, element('p', 'ed-speaker-bio', event.speakerBio));

    var participation = add(overview, element('section', 'ed-panel'));
    add(participation, element('h2', '', 'Participation'));
    var participationRows = add(participation, element('div', 'ed-participation'));
    addParticipation(participationRows, 'Students', event.students);
    addParticipation(participationRows, 'Staff', event.staffLabel || event.staff);

    var details = add(root, element('div', 'ed-detail-sections'));
    renderList(details, 'Key highlights', event.highlights);
    renderList(details, 'Learning outcomes', event.outcomes);
    renderGallery(root, validPhotos(event));

    var back = add(root, element('a', 'ec-back-link', '← Back to Events Conducted'));
    back.href = 'events-conducted.html';
    root.setAttribute('aria-busy', 'false');
    document.title = event.title + ' — VLSI | SIET';
    var description = document.querySelector('meta[name="description"]');
    if (description) description.content = event.title + ' — event information and photographs from the SIET VLSI Department.';
  }

  function renderNotFound() {
    var root = document.getElementById('event-detail');
    var section = element('section', 'ed-error');
    add(section, element('h1', '', 'Event not found'));
    add(section, element('p', '', 'This event link is invalid or the activity is not in the archive.'));
    var back = add(section, element('a', 'ec-back-link', '← Browse Events Conducted'));
    back.href = 'events-conducted.html';
    root.replaceChildren(section);
    root.setAttribute('aria-busy', 'false');
  }

  function updateLightbox() {
    if (!currentPhotos.length) return;
    var image = document.getElementById('lightbox-image');
    image.classList.add('is-changing');
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(function () {
      var photo = currentPhotos[currentPhotoIndex];
      image.src = photo.src;
      image.alt = photo.alt;
      document.getElementById('lightbox-count').textContent = (currentPhotoIndex + 1) + ' / ' + currentPhotos.length;
      document.getElementById('lightbox-caption').textContent = photo.alt;
      image.classList.remove('is-changing');
    }, 100);
  }

  function openLightbox(photos, index) {
    currentPhotos = photos;
    currentPhotoIndex = index;
    var dialog = document.getElementById('event-lightbox');
    updateLightbox();
    if (!dialog.open) dialog.showModal();
  }

  function movePhoto(direction) {
    if (!currentPhotos.length) return;
    currentPhotoIndex = (currentPhotoIndex + direction + currentPhotos.length) % currentPhotos.length;
    updateLightbox();
  }

  function setupLightbox() {
    var dialog = document.getElementById('event-lightbox');
    if (!dialog) return;
    document.getElementById('lightbox-close').addEventListener('click', function () { dialog.close(); });
    document.getElementById('lightbox-previous').addEventListener('click', function () { movePhoto(-1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { movePhoto(1); });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close();
    });
    document.getElementById('lightbox-fullscreen').addEventListener('click', function () {
      if (document.fullscreenElement === dialog) {
        document.exitFullscreen();
      } else if (dialog.requestFullscreen) {
        dialog.requestFullscreen().catch(function () { dialog.classList.toggle('is-fullscreen-fallback'); });
      } else {
        dialog.classList.toggle('is-fullscreen-fallback');
      }
    });
    document.addEventListener('keydown', function (event) {
      if (!dialog.open) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        movePhoto(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        movePhoto(1);
      }
    });
  }

  setupLightbox();
  var requestedId = new URLSearchParams(window.location.search).get('event') || '';
  var validId = /^[a-z0-9-]{1,64}$/.test(requestedId);
  var selectedEvent = validId ? eventList.find(function (event) { return event.id === requestedId; }) : null;
  if (selectedEvent) renderEvent(selectedEvent);
  else renderNotFound();
}(window, document));

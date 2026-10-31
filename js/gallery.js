(function () {
  'use strict';

  var grid = document.getElementById('gallery-grid');
  var dialog = document.getElementById('lightbox');
  var content = document.getElementById('lightbox-content');
  var status = document.getElementById('gallery-status');
  var items = [];
  var visibleItems = [];
  var currentIndex = 0;
  var returnFocus = null;
  var activeFilter = 'all';

  if (!grid || !dialog || !content) return;

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function categoryLabel(slug) {
    var labels = { labs: 'Laboratories', workshops: 'Workshops', seminars: 'Seminars', events: 'Events', campus: 'Campus' };
    return labels[slug] || 'Events';
  }

  function staticItems() {
    return (window.GALLERY_STATIC_MEDIA || []).map(function (item) {
      return {
        id: item.id,
        title: item.title,
        caption: item.caption || item.title,
        category: item.category || 'events',
        type: item.type,
        date: item.date || '',
        src: item.src,
        preview: item.poster || ''
      };
    });
  }

  async function signMedia(ids) {
    if (!ids.length || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return {};
    var response = await fetch(window.SUPABASE_URL.replace(/\/+$/, '') + '/functions/v1/gallery-media?action=sign', {
      method: 'POST',
      headers: {
        apikey: window.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + window.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mediaIds: ids.slice(0, 30) })
    });
    if (!response.ok) throw new Error('Gallery media could not be signed.');
    var result = await response.json();
    return (result.media || []).reduce(function (map, media) {
      map[media.id] = media;
      return map;
    }, {});
  }

  async function loadPublishedItems() {
    var client = window.supabaseClient;
    if (!client || !window.isSupabaseConfigured || !window.isSupabaseConfigured()) return [];
    var result = await client.from('gallery_media')
      .select('id,caption,media_kind,uploaded_at,gallery_categories(slug,name)')
      .eq('status', 'published')
      .order('uploaded_at', { ascending: false })
      .limit(100);
    if (result.error) throw result.error;
    var rows = result.data || [];
    var signed = {};
    for (var start = 0; start < rows.length; start += 30) {
      Object.assign(signed, await signMedia(rows.slice(start, start + 30).map(function (row) { return row.id; })));
    }
    return rows.filter(function (row) { return Boolean(signed[row.id]); }).map(function (row) {
      var category = Array.isArray(row.gallery_categories) ? row.gallery_categories[0] : row.gallery_categories;
      var signedItem = signed[row.id];
      return {
        id: row.id,
        title: row.caption || (row.media_kind === 'video' ? 'Event video' : 'Gallery photo'),
        caption: row.caption || '',
        category: category && category.slug || 'events',
        type: row.media_kind,
        date: row.uploaded_at || '',
        src: signedItem.url,
        preview: signedItem.thumbnailUrl || (row.media_kind === 'image' ? signedItem.url : ''),
        remote: true
      };
    });
  }

  function createCard(item, index) {
    var card = element('button', 'gallery-card gallery-card-video cursor-pointer group');
    card.type = 'button';
    card.dataset.category = item.category;
    card.setAttribute('aria-label', (item.type === 'video' ? 'Play ' : 'View ') + item.title);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((index % 4) * 50));

    if (item.type === 'image' && item.preview) {
      var image = element('img', 'gallery-card-image');
      image.alt = item.title;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.src = item.preview;
      if (item.remote) {
        image.addEventListener('error', function () {
          if (image.dataset.refreshed) return;
          image.dataset.refreshed = 'true';
          signMedia([item.id]).then(function (fresh) {
            if (fresh[item.id]) image.src = fresh[item.id].thumbnailUrl || fresh[item.id].url;
          }).catch(function () {});
        }, { once: true });
      }
      card.appendChild(image);
    } else {
      var tile = element('span', 'gallery-video-tile');
      var play = element('span', 'gallery-video-play', '▶');
      play.setAttribute('aria-hidden', 'true');
      tile.appendChild(play);
      tile.appendChild(element('span', 'gallery-video-label', item.type === 'video' ? 'VIDEO' : categoryLabel(item.category)));
      card.appendChild(tile);
    }

    var overlay = element('span', 'gallery-video-caption');
    overlay.appendChild(element('span', '', item.title));
    overlay.appendChild(element('small', '', categoryLabel(item.category)));
    card.appendChild(overlay);
    card.addEventListener('click', function () { openLightbox(item); });
    return card;
  }

  function render() {
    visibleItems = items.filter(function (item) { return activeFilter === 'all' || item.category === activeFilter; });
    grid.replaceChildren();
    visibleItems.forEach(function (item, index) { grid.appendChild(createCard(item, index)); });
    if (status) status.textContent = visibleItems.length ? visibleItems.length + ' gallery item' + (visibleItems.length === 1 ? '' : 's') + ' shown.' : 'No gallery media is available in this category yet.';
    if (window.AOS && typeof window.AOS.refreshHard === 'function') window.AOS.refreshHard();
  }

  function setMediaSource(item, video) {
    if (!item.remote) {
      video.src = item.src;
      return Promise.resolve();
    }
    return signMedia([item.id]).then(function (fresh) {
      if (!fresh[item.id]) throw new Error('This video is not available.');
      video.src = fresh[item.id].url;
    });
  }

  function showItem(index) {
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    var item = visibleItems[currentIndex];
    content.replaceChildren();

    if (item.type === 'video') {
      var playerFrame = element('div', 'gallery-lightbox-video-frame');
      if (item.preview) {
        var poster = element('img', 'gallery-lightbox-poster');
        poster.src = item.preview;
        poster.alt = '';
        playerFrame.appendChild(poster);
      }
      var playButton = element('button', 'gallery-lightbox-play', 'Play video');
      playButton.type = 'button';
      playButton.addEventListener('click', function () {
        playButton.disabled = true;
        playButton.textContent = 'Loading video…';
        var video = element('video', 'gallery-lightbox-video');
        video.controls = true;
        video.playsInline = true;
        video.preload = 'none';
        video.setAttribute('aria-label', item.title);
        setMediaSource(item, video).then(function () {
          playerFrame.replaceChildren(video);
          return video.play();
        }).catch(function () {
          playButton.disabled = false;
          playButton.textContent = 'Video could not be loaded. Try again';
        });
      });
      playerFrame.appendChild(playButton);
      content.appendChild(playerFrame);
    } else {
      var image = element('img', 'gallery-lightbox-image');
      image.alt = item.title;
      image.src = item.src;
      image.decoding = 'async';
      content.appendChild(image);
    }
    content.appendChild(element('p', 'gallery-lightbox-caption', item.caption || item.title));
    var counter = document.getElementById('lightbox-count');
    if (counter) counter.textContent = (currentIndex + 1) + ' / ' + visibleItems.length;
  }

  function openLightbox(item) {
    returnFocus = document.activeElement;
    var index = visibleItems.indexOf(item);
    showItem(index < 0 ? 0 : index);
    dialog.classList.add('is-active');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('lightbox-close').focus();
  }

  function closeLightbox() {
    if (!dialog.classList.contains('is-active')) return;
    var video = content.querySelector('video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    content.replaceChildren();
    dialog.classList.remove('is-active');
    dialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
  }

  function bindControls() {
    document.querySelectorAll('#gallery-filters [data-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.dataset.filter;
        document.querySelectorAll('#gallery-filters [data-filter]').forEach(function (other) {
          var active = other === button;
          other.classList.toggle('active', active);
          other.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        render();
      });
    });
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-previous').addEventListener('click', function () { showItem(currentIndex - 1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { showItem(currentIndex + 1); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) closeLightbox(); });
    document.addEventListener('keydown', function (event) {
      if (!dialog.classList.contains('is-active')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showItem(currentIndex - 1);
      if (event.key === 'ArrowRight') showItem(currentIndex + 1);
    });
  }

  async function init() {
    bindControls();
    items = staticItems();
    try {
      items = items.concat(await loadPublishedItems());
    } catch (error) {
      if (status) status.textContent = 'Showing locally available gallery media. Online gallery media could not be loaded.';
    }
    render();
  }

  init();
})();

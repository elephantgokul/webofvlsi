(async function initGallery() {
  var grid = document.getElementById('gallery-grid');
  var lightbox = document.getElementById('gallery-lightbox');
  if (!grid || !lightbox) return;

  var CATEGORIES = ['all','labs','events','cultural','workshops','achievements'];
  var currentCat = 'all';
  var allFiles = [];

  grid.innerHTML = generateGallerySkeletons(12);

  try {
    if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
      allFiles = await window.listSupabaseBucketFiles('gallery', { limit: 200 });
    }
    if (!allFiles || !allFiles.length) {
      allFiles = Array.from({length: 18}, function(_, i) {
        return {
          name: 'photo-' + i + '.jpg',
          publicUrl: 'https://picsum.photos/seed/vlsi' + i + '/600/' + (300 + (i % 3) * 100)
        };
      });
    }
    renderGallery(allFiles);
    setupFilters();
    setupLightbox();
  } catch (e) {
    console.error('[Gallery] Error:', e);
    grid.innerHTML = '<p class="text-center py-10" style="color:var(--clr-text-secondary)">Failed to load gallery.</p>';
  }

  function inferCategory(filename) {
    var fn = (filename || '').toLowerCase();
    if (fn.includes('lab')) return 'labs';
    if (fn.includes('event') || fn.includes('symposium') || fn.includes('elecnova')) return 'events';
    if (fn.includes('cultural') || fn.includes('sports')) return 'cultural';
    if (fn.includes('workshop') || fn.includes('fdp')) return 'workshops';
    if (fn.includes('award') || fn.includes('achieve') || fn.includes('prize')) return 'achievements';
    return 'events';
  }

  function renderGallery(files) {
    var filtered = currentCat === 'all' ? files : files.filter(function(f) { return inferCategory(f.name) === currentCat; });
    grid.innerHTML = '';
    filtered.forEach(function(file, idx) {
      var item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.cat = inferCategory(file.name);
      item.dataset.idx = idx;
      item.setAttribute('data-aos', 'zoom-in');
      item.setAttribute('data-aos-delay', String((idx % 6) * 50));
      item.innerHTML = [
        '<div class="gallery-img-wrap">',
          '<img src="' + escapeHtml(file.publicUrl) + '" alt="Gallery photo ' + escapeHtml(file.name) + '" loading="lazy" onerror="this.parentElement.parentElement.style.display=\'none\'">',
          '<div class="gallery-overlay">',
            '<button class="gallery-zoom-btn" aria-label="View full size" data-idx="' + idx + '">',
              '<i class="fa-solid fa-expand"></i>',
            '</button>',
          '</div>',
        '</div>'
      ].join('');
      grid.appendChild(item);
    });
    grid.querySelectorAll('.gallery-zoom-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { openLightbox(parseInt(btn.dataset.idx, 10)); });
    });
    if (typeof AOS !== 'undefined') AOS.refreshHard();
  }

  function setupFilters() {
    document.querySelectorAll('.gallery-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.gallery-filter-btn').forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentCat = btn.dataset.cat;
        grid.style.opacity = '0';
        setTimeout(function() {
          renderGallery(allFiles);
          grid.style.opacity = '1';
        }, 200);
      });
    });
  }

  var currentLightboxIdx = 0;
  var visibleFiles = [];

  function openLightbox(idx) {
    visibleFiles = currentCat === 'all' ? allFiles : allFiles.filter(function(f) { return inferCategory(f.name) === currentCat; });
    currentLightboxIdx = idx;
    showLightboxSlide(idx);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showLightboxSlide(idx) {
    var file = visibleFiles[idx];
    if (!file) return;
    var img = lightbox.querySelector('#lb-img');
    var counter = lightbox.querySelector('#lb-counter');
    img.style.opacity = '0';
    img.src = file.publicUrl;
    img.onload = function() { img.style.opacity = '1'; };
    counter.textContent = (idx + 1) + ' / ' + visibleFiles.length;
  }

  function setupLightbox() {
    lightbox.querySelector('#lb-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('#lb-prev').addEventListener('click', function() {
      currentLightboxIdx = (currentLightboxIdx - 1 + visibleFiles.length) % visibleFiles.length;
      showLightboxSlide(currentLightboxIdx);
    });
    lightbox.querySelector('#lb-next').addEventListener('click', function() {
      currentLightboxIdx = (currentLightboxIdx + 1) % visibleFiles.length;
      showLightboxSlide(currentLightboxIdx);
    });
    lightbox.querySelector('#lb-download').addEventListener('click', function() {
      var a = document.createElement('a');
      a.href = visibleFiles[currentLightboxIdx].publicUrl;
      a.download = visibleFiles[currentLightboxIdx].name;
      a.target = '_blank';
      a.rel = 'noopener';
      a.click();
    });
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lightbox.querySelector('#lb-next').click();
      if (e.key === 'ArrowLeft') lightbox.querySelector('#lb-prev').click();
    });
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        dx < 0 ? lightbox.querySelector('#lb-next').click() : lightbox.querySelector('#lb-prev').click();
      }
    });
  }

  function generateGallerySkeletons(n) {
    return Array.from({ length: n }).map(function(_, i) {
      var h = [200, 260, 180, 220, 300, 240][i % 6];
      return '<div class="skeleton-card gallery-skeleton" style="height:' + h + 'px"></div>';
    }).join('');
  }

  function escapeHtml(v) {
    var d = document.createElement('div');
    d.textContent = v == null ? '' : String(v);
    return d.innerHTML;
  }
})();
/* =========================================================================
   SLIDERS.JS — render dynamic content from site-data.js → DOM containers,
   then boot Swiper for the recruiter strip and testimonials carousel.
   ========================================================================= */

(function renderAndInit() {

  /* ─── tiny helpers ─────────────────────────────────────── */
  var $ = function(sel){ return document.querySelector(sel); };

  function fmtDate(iso){
    try { return new Date(iso).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}); }
    catch(e){ return iso; }
  }

  /* ─── NEWS CARDS ────────────────────────────────────────── */
  var newsEl = $("#news-container");
  if (newsEl && typeof newsData !== "undefined") {
    newsEl.innerHTML = newsData.slice(0,4).map(function(n){
      return [
        '<article style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:1.2rem;margin-bottom:1rem;transition:box-shadow .3s,border-color .3s" ',
            'onmouseover="this.style.boxShadow=\'0 12px 32px -16px rgba(11,27,51,.18)\';this.style.borderColor=\'#1652c4\'" ',
            'onmouseout="this.style.boxShadow=\'none\';this.style.borderColor=\'#e2e8f0\'">',
          '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem">',
            '<span style="font-size:.7rem;font-family:\'IBM Plex Mono\',monospace;color:#fff;background:#1652c4;padding:.2rem .55rem;border-radius:999px">',n.tag,'</span>',
            '<span style="font-size:.7rem;font-family:\'IBM Plex Mono\',monospace;color:#5b6478">',fmtDate(n.date),'</span>',
          '</div>',
          '<h4 style="font-family:\'Space Grotesk\',sans-serif;font-weight:600;font-size:.85rem;color:#0b1b33;line-height:1.4;margin-bottom:.4rem">',n.title,'</h4>',
          '<p style="font-size:.78rem;color:#5b6478;line-height:1.6">',n.excerpt,'</p>',
        '</article>'
      ].join("");
    }).join("");
  }

  /* ─── EVENTS LIST ───────────────────────────────────────── */
  var evEl = $("#events-container");
  if (evEl && typeof eventsData !== "undefined") {
    evEl.innerHTML = eventsData.slice(0,4).map(function(e){
      return [
        '<div style="display:flex;gap:.9rem;align-items:flex-start;background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:1rem;margin-bottom:.9rem">',
          '<div style="flex-shrink:0;width:3rem;height:3rem;border-radius:10px;background:#1652c4;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff">',
            '<span style="font-size:1.15rem;font-family:\'Space Grotesk\',sans-serif;font-weight:700;line-height:1">',e.day,'</span>',
            '<span style="font-size:.65rem;font-family:\'IBM Plex Mono\',monospace;margin-top:.1rem">',e.month,'</span>',
          '</div>',
          '<div>',
            '<p style="font-family:\'Space Grotesk\',sans-serif;font-weight:600;font-size:.83rem;color:#0b1b33;line-height:1.35">',e.title,'</p>',
            '<p style="font-size:.72rem;color:#5b6478;margin-top:.35rem">',
              '<i class="fa-solid fa-location-dot" style="color:#2fe6dd;margin-right:.3rem"></i>',e.venue,
              '&nbsp;&nbsp;<i class="fa-solid fa-clock" style="color:#2fe6dd;margin-right:.3rem"></i>',e.time,
            '</p>',
          '</div>',
        '</div>'
      ].join("");
    }).join("");
  }

  /* ─── NOTICE BOARD ──────────────────────────────────────── */
  var notEl = $("#notices-container");
  if (notEl && typeof noticesData !== "undefined") {
    notEl.innerHTML = noticesData.map(function(n){
      return [
        '<div style="border-bottom:1px solid #e2e8f0;padding:.85rem 1.2rem;display:flex;align-items:flex-start;gap:.7rem;transition:background .2s" ',
            'onmouseover="this.style.background=\'#f4f7fb\'" onmouseout="this.style.background=\'\'">',
          n.isNew
            ? '<span style="flex-shrink:0;margin-top:.45rem;width:7px;height:7px;border-radius:999px;background:#2fe6dd;box-shadow:0 0 0 3px rgba(47,230,221,.18);display:block"></span>'
            : '<span style="flex-shrink:0;margin-top:.45rem;width:7px;height:7px;display:block"></span>',
          '<div>',
            '<p style="font-size:.7rem;font-family:\'IBM Plex Mono\',monospace;color:#5b6478;margin-bottom:.2rem">',
              n.date,
              n.isNew ? '<span style="margin-left:.4rem;color:#2fe6dd;font-weight:700">NEW</span>' : '',
            '</p>',
            '<p style="font-size:.83rem;color:#0b1b33;font-weight:500;line-height:1.4">',n.title,'</p>',
          '</div>',
        '</div>'
      ].join("");
    }).join("");
  }

  /* ─── RECRUITER SLIDES ──────────────────────────────────── */
  var recEl = $("#recruiters-container");
  if (recEl && typeof recruitersData !== "undefined") {
    var doubled = recruitersData.concat(recruitersData); // seamless loop
    recEl.innerHTML = doubled.map(function(name){
      return '<div class="swiper-slide recruiter-slide"><span>'+name+'</span></div>';
    }).join("");
  }

  /* ─── TESTIMONIAL SLIDES ────────────────────────────────── */
  var tesEl = $("#testimonials-container");
  if (tesEl && typeof testimonialsData !== "undefined") {
    tesEl.innerHTML = testimonialsData.map(function(t){
      return [
        '<div class="swiper-slide">',
          '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:1.5rem;padding:2rem;height:100%;display:flex;flex-direction:column;box-sizing:border-box">',
            '<svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true" style="margin-bottom:1.2rem">',
              '<path d="M0 20V12.5C0 5.596 4.167 1.25 12.5 0l1.25 2.5C9.583 3.333 7.5 5.833 7.5 10H12.5V20H0ZM15.5 20V12.5C15.5 5.596 19.667 1.25 28 0l1.25 2.5C25.083 3.333 23 5.833 23 10H28V20H15.5Z" fill="#1652c4" opacity="0.15"/>',
            '</svg>',
            '<p style="color:#5b6478;line-height:1.75;font-size:.9rem;font-style:italic;flex:1">"',t.quote,'"</p>',
            '<div style="margin-top:1.4rem;padding-top:1.1rem;border-top:1px solid #e2e8f0;display:flex;align-items:center;gap:.75rem">',
              '<div style="width:2.4rem;height:2.4rem;border-radius:999px;background:linear-gradient(135deg,#1652c4,#2fe6dd);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.85rem;flex-shrink:0">',
                t.name.charAt(0),
              '</div>',
              '<div>',
                '<p style="font-family:\'Space Grotesk\',sans-serif;font-weight:600;font-size:.85rem;color:#0b1b33">',t.name,'</p>',
                '<p style="font-size:.72rem;color:#5b6478;margin-top:.15rem">',t.role,' &middot; ',t.batch,'</p>',
              '</div>',
            '</div>',
          '</div>',
        '</div>'
      ].join("");
    }).join("");
  }

  /* ─── SWIPER: Recruiter strip (continuous auto-scroll) ──── */
  if (typeof Swiper !== "undefined") {
    new Swiper(".recruiter-swiper", {
      slidesPerView: "auto",
      spaceBetween: 0,
      speed: 5000,
      autoplay: { delay: 0, disableOnInteraction: false },
      loop: true,
      freeMode: { enabled: true, momentum: false },
      allowTouchMove: false,
    });

    /* ─── SWIPER: Testimonials ─────────────────────────────── */
    new Swiper(".testimonial-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, pauseOnMouseEnter: true },
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768:  { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
      },
    });
  }

})();

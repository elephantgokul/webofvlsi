/* =========================================================================
   MAIN.JS — core interactions (no build step, no ES modules: this file is
   loaded with a plain <script defer> tag so the site works by just opening
   index.html, with no local server required)
   ========================================================================= */

/* ---- Utility: escapeHtml ------------------------------------------------ */
function escapeHtml(v) {
  var d = document.createElement('div');
  d.textContent = v == null ? '' : String(v);
  return d.innerHTML;
}
window.escapeHtml = escapeHtml;

/* ---- Loading screen ---------------------------------------------------- */
(function loadingScreen() {
  function hide() {
    var screen = document.getElementById("loading-screen");
    if (screen) {
      screen.classList.add("is-hidden");
      setTimeout(function() {
        if (screen && screen.parentNode) {
          screen.style.display = "none";
        }
      }, 300);
    }
  }

  // Dismiss immediately when DOM is ready for zero latency
  if (document.readyState === "complete" || document.readyState === "interactive") {
    hide();
  } else {
    document.addEventListener("DOMContentLoaded", hide);
  }

  window.addEventListener("load", hide);
  setTimeout(hide, 300); // Fail-safe: dismiss after 300ms max so it NEVER gets stuck
})();

/* ---- Header: sticky background + mobile menu --------------------------- */
(function headerNav() {
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (document.getElementById("hero")) {
    document.body.classList.add("home-page");
  }
  if (!header) return;

  const SCROLL_THRESHOLD = 60;

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.querySelector(".fa-bars")?.classList.toggle("hidden", isOpen);
      menuToggle.querySelector(".fa-xmark")?.classList.toggle("hidden", !isOpen);
    });

    // close mobile menu after tapping a link
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.querySelector(".fa-bars")?.classList.remove("hidden");
        menuToggle.querySelector(".fa-xmark")?.classList.add("hidden");
      });
    });
  }
})();

/* ---- Smooth scroll with fixed-header offset ----------------------------- */
(function smoothScroll() {
  const HEADER_OFFSET = 84;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

/* ---- Scroll progress bar ------------------------------------------------- */
(function scrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleX(${progress})`;
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();

/* ---- Back to top button --------------------------------------------------- */
(function backToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  function toggle() {
    btn.classList.toggle("is-visible", window.scrollY > 500);
  }
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ---- Footer year ----------------------------------------------------------- */
(function footerYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ---- Universal Toast System ---- */
(function toastSystem() {
  var container = document.createElement('div');
  container.id = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('role', 'status');
  document.body.appendChild(container);

  window.showToast = function(message, type, duration) {
    type = type || 'info'; duration = duration || 4000;
    var icons = {success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info', warning:'fa-triangle-exclamation'};
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = [
      '<i class="fa-solid ' + icons[type] + '"></i>',
      '<span>' + String(message) + '</span>',
      '<button class="toast-close" aria-label="Dismiss">&times;</button>'
    ].join('');
    container.appendChild(toast);
    requestAnimationFrame(function() { requestAnimationFrame(function() { toast.classList.add('is-visible'); }); });
    var closeBtn = toast.querySelector('.toast-close');
    function dismiss() {
      toast.classList.remove('is-visible');
      setTimeout(function() { if(toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }
    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, duration);
  };
})();

/* ---- PWA Install Prompt ---- */
(function pwaInstall() {
  var deferredPrompt;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    var banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.innerHTML = [
      '<div style="display:flex;align-items:center;gap:1rem;padding:.85rem 1.25rem;background:linear-gradient(135deg,#1652c4,#2fe6dd);color:#fff;border-radius:1rem;box-shadow:0 8px 32px rgba(22,82,196,.3);font-family:\'IBM Plex Sans\',sans-serif;font-size:.85rem">',
        '<i class="fa-solid fa-mobile-screen-button" style="font-size:1.2rem"></i>',
        '<span>Add VLSI Portal to your home screen for quick access</span>',
        '<button id="install-yes" style="margin-left:auto;background:rgba(255,255,255,.2);border:none;color:#fff;padding:.4rem 1rem;border-radius:.6rem;cursor:pointer;font-weight:600;white-space:nowrap">Install</button>',
        '<button id="install-no" style="background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:1rem;margin-left:.25rem">&times;</button>',
      '</div>'
    ].join('');
    Object.assign(banner.style, { position:'fixed', bottom:'1.5rem', left:'50%', transform:'translateX(-50%)', zIndex:'8000', width:'calc(100% - 2rem)', maxWidth:'560px' });
    document.body.appendChild(banner);
    document.getElementById('install-yes').addEventListener('click', function() {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(){ banner.remove(); deferredPrompt = null; });
    });
    document.getElementById('install-no').addEventListener('click', function() { banner.remove(); });
  });
})();

/* ---- AOS & Animation Safety Net ----------------------------------------- */
window.addEventListener("load", function () {
  if (typeof AOS === "undefined") {
    document.querySelectorAll("[data-aos]").forEach(function (el) {
      el.removeAttribute("data-aos");
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  } else {
    try { AOS.refresh(); } catch (e) {}
  }
});

/* ---- Hero Video Autoplay Assurance -------------------------------------- */
(function heroVideoAutoplay() {
  function ensureVideoPlaying() {
    var video = document.querySelector(".hero-bg-video");
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    var p = video.play();
    if (p !== undefined) {
      p.catch(function () {
        document.addEventListener("click", function () {
          video.play().catch(function () {});
        }, { once: true });
        document.addEventListener("touchstart", function () {
          video.play().catch(function () {});
        }, { once: true });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureVideoPlaying);
  } else {
    ensureVideoPlaying();
  }
  window.addEventListener("load", ensureVideoPlaying);
})();
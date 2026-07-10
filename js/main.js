/* =========================================================================
   MAIN.JS — core interactions (no build step, no ES modules: this file is
   loaded with a plain <script defer> tag so the site works by just opening
   index.html, with no local server required)
   ========================================================================= */

/* ---- Loading screen ---------------------------------------------------- */
(function loadingScreen() {
  const screen = document.getElementById("loading-screen");
  if (!screen) return;

  window.addEventListener("load", () => {
    // small minimum dwell so the load animation isn't a flash on fast connections
    setTimeout(() => screen.classList.add("is-hidden"), 500);
  });
})();

/* ---- Header: sticky background + mobile menu --------------------------- */
(function headerNav() {
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
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

/* ---- Dark Mode toggle --------------------------------------------------- */
(function darkMode() {
  // Inject button into every page
  var btn = document.createElement('button');
  btn.id = 'dark-toggle';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.innerHTML = '<i class="fa-solid fa-moon text-sm"></i>';
  document.body.appendChild(btn);

  var root = document.documentElement;
  var isDark = localStorage.getItem('siet-dark') === 'true';
  if (isDark) { root.classList.add('dark'); updateIcon(true); }

  btn.addEventListener('click', function () {
    isDark = !isDark;
    root.classList.toggle('dark', isDark);
    localStorage.setItem('siet-dark', isDark);
    updateIcon(isDark);
  });

  function updateIcon(dark) {
    btn.innerHTML = dark
      ? '<i class="fa-solid fa-sun text-sm" style="color:#fbbf24"></i>'
      : '<i class="fa-solid fa-moon text-sm"></i>';
  }
})();

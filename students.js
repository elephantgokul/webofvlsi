/* =========================================================================
   ANIMATIONS.JS — AOS scroll-reveal, GSAP hero sequence, readout counters
   ========================================================================= */

/* ---- AOS: scroll-reveal for content sections below the hero ------------- */
(function initAOS() {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
  });
})();

/* ---- GSAP: orchestrated hero load-in ------------------------------------- */
(function heroIntro() {
  if (typeof gsap === "undefined") return;

  const tl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.9 },
  });

  tl.from(".hero-eyebrow", { y: 16, opacity: 0 })
    .from(".hero-line", { y: "100%", opacity: 0, stagger: 0.12 }, "-=0.5")
    .from(".hero-subhead", { y: 20, opacity: 0 }, "-=0.5")
    .from(".hero-cta > *", { y: 16, opacity: 0, stagger: 0.1 }, "-=0.4")
    .from(".hero-badges", { y: 16, opacity: 0 }, "-=0.5")
    .from(".scroll-cue", { opacity: 0, duration: 0.6 }, "-=0.3");
})();

/* ---- GSAP + ScrollTrigger: readout-style stat counters -------------------- */
(function statCounters() {
  const cards = document.querySelectorAll(".readout-card");
  if (!cards.length) return;

  const hasGSAP = typeof gsap !== "undefined";
  if (hasGSAP && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  function animateCard(card) {
    if (card.dataset.animated === "true") return;
    card.dataset.animated = "true";
    card.classList.add("is-visible");

    const target = Number(card.dataset.target || 0);
    const suffix = card.dataset.suffix || "";
    const valueEl = card.querySelector(".readout-value");
    if (!valueEl) return;

    if (hasGSAP) {
      const counter = { value: 0 };
      gsap.to(counter, {
        value: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          valueEl.textContent = Math.round(counter.value).toLocaleString() + suffix;
        },
      });
    } else {
      // graceful fallback if GSAP fails to load
      valueEl.textContent = target.toLocaleString() + suffix;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) animateCard(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  cards.forEach((card) => observer.observe(card));
})();

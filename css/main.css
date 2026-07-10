/* =========================================================================
   SIET · DEPARTMENT OF VLSI — CUSTOM STYLESHEET
   Tailwind (CDN) handles utility classes. This file holds:
   design tokens, the signal-trace signature motif, and anything Tailwind
   utilities can't express cleanly (keyframes, SVG pattern backgrounds,
   focus/reduced-motion rules).
   ========================================================================= */

:root {
  /* ---- Color tokens ---- */
  --ink-navy: #0b1b33;
  --ink-navy-light: #122a4d;
  --circuit-blue: #1652c4;
  --circuit-blue-dark: #103e94;
  --signal-cyan: #2fe6dd;
  --paper: #ffffff;
  --mist: #f4f7fb;
  --slate-900: #16213d;
  --slate-500: #5b6478;
  --slate-200: #e2e8f0;

  /* ---- Type tokens ---- */
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "IBM Plex Sans", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
}

/* =========================================================================
   BASE
   ========================================================================= */

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--slate-900);
  background: var(--paper);
  overflow-x: hidden;
}

h1, h2, h3, h4, .font-display {
  font-family: var(--font-display);
}

.font-mono {
  font-family: var(--font-mono);
}

::selection {
  background: var(--signal-cyan);
  color: var(--ink-navy);
}

/* Visible keyboard focus everywhere — accessibility floor */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--signal-cyan);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Slim custom scrollbar (webkit) */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: var(--mist);
}
::-webkit-scrollbar-thumb {
  background: var(--circuit-blue);
  border-radius: 999px;
  border: 2px solid var(--mist);
}

/* =========================================================================
   LOADING SCREEN
   ========================================================================= */

#loading-screen {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--ink-navy);
  transition: opacity 0.6s ease, visibility 0.6s ease;
}

#loading-screen.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.loader-mark {
  font-family: var(--font-mono);
  font-size: 1.75rem;
  letter-spacing: 0.2em;
  color: var(--paper);
}

.loader-trace {
  width: 140px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
  border-radius: 999px;
}

.loader-trace::after {
  content: "";
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(90deg, transparent, var(--signal-cyan), transparent);
  animation: trace-sweep 1.1s ease-in-out infinite;
}

@keyframes trace-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

/* =========================================================================
   SCROLL PROGRESS BAR
   ========================================================================= */

#scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--circuit-blue), var(--signal-cyan));
  transform: scaleX(0);
  transform-origin: left;
  z-index: 90;
  will-change: transform;
}

/* =========================================================================
   HEADER
   ========================================================================= */

#site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 80;
  transition: background-color 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease;
  padding-block: 1.25rem;
}

#site-header.is-scrolled {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 rgba(11, 27, 51, 0.08), 0 12px 30px -18px rgba(11, 27, 51, 0.25);
  padding-block: 0.75rem;
}

#site-header .nav-link {
  color: rgba(255, 255, 255, 0.85);
}
#site-header .brand-text {
  color: var(--paper);
}
#site-header.is-scrolled .nav-link {
  color: var(--slate-500);
}
#site-header.is-scrolled .brand-text {
  color: var(--slate-900);
}
#site-header .nav-link:hover,
#site-header.is-scrolled .nav-link:hover {
  color: var(--signal-cyan);
}

/* Mobile menu panel */
#mobile-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}
#mobile-menu.is-open {
  max-height: 480px;
}

/* =========================================================================
   HERO — CIRCUIT SUBSTRATE
   ========================================================================= */

#hero {
  position: relative;
  background: radial-gradient(120% 100% at 15% 10%, var(--ink-navy-light) 0%, var(--ink-navy) 55%, #081326 100%);
  overflow: hidden;
}

/* Faint tiled circuit-grid texture */
#hero::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.16;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%232fe6dd' stroke-width='1'%3E%3Cpath d='M0 60H40M80 60H120M60 0V40M60 80V120'/%3E%3Ccircle cx='60' cy='60' r='3'/%3E%3Ccircle cx='40' cy='60' r='2'/%3E%3Ccircle cx='80' cy='60' r='2'/%3E%3Ccircle cx='60' cy='40' r='2'/%3E%3Ccircle cx='60' cy='80' r='2'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 120px 120px;
  pointer-events: none;
}

.hero-trace-line {
  position: absolute;
  pointer-events: none;
}

.hero-trace-line path {
  fill: none;
  stroke: var(--signal-cyan);
  stroke-width: 1.5;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(47, 230, 221, 0.55));
}

.trace-draw {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: trace-draw-in 2.4s cubic-bezier(0.65, 0, 0.35, 1) 0.3s forwards;
}

@keyframes trace-draw-in {
  to { stroke-dashoffset: 0; }
}

.trace-pulse {
  offset-path: path("M -20 90 C 150 10, 320 170, 520 60 S 780 -10, 980 90");
  animation: trace-pulse-move 4.5s linear 2.6s infinite;
  opacity: 0;
}

@keyframes trace-pulse-move {
  0% { offset-distance: 0%; opacity: 0; }
  5% { opacity: 1; }
  95% { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; }
}

.eyebrow-tag {
  font-family: var(--font-mono);
  letter-spacing: 0.18em;
  font-size: 0.75rem;
}

.scroll-cue {
  width: 22px;
  height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  position: relative;
}
.scroll-cue::before {
  content: "";
  position: absolute;
  top: 6px;
  left: 50%;
  width: 4px;
  height: 8px;
  background: var(--signal-cyan);
  border-radius: 999px;
  transform: translateX(-50%);
  animation: scroll-cue-bounce 1.6s ease-in-out infinite;
}
@keyframes scroll-cue-bounce {
  0%, 100% { transform: translate(-50%, 0); opacity: 1; }
  60% { transform: translate(-50%, 12px); opacity: 0; }
}

/* =========================================================================
   SECTION DIVIDER (signature motif, used sparingly)
   ========================================================================= */

.signal-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.signal-divider::before,
.signal-divider::after {
  content: "";
  height: 1px;
  flex: 1;
  background: linear-gradient(90deg, transparent, var(--slate-200));
}
.signal-divider::after {
  background: linear-gradient(90deg, var(--slate-200), transparent);
}
.signal-divider .signal-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--signal-cyan);
  box-shadow: 0 0 0 4px rgba(47, 230, 221, 0.18);
}

/* =========================================================================
   READOUT STAT CARDS
   ========================================================================= */

.readout-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.readout-card {
  position: relative;
}
.readout-card::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, var(--circuit-blue), var(--signal-cyan));
  transition: width 1.6s cubic-bezier(0.65, 0, 0.35, 1);
}
.readout-card.is-visible::after {
  width: 100%;
}

/* =========================================================================
   CARDS — quiet, disciplined, let hero carry the personality
   ========================================================================= */

.surface-card {
  background: var(--paper);
  border: 1px solid var(--slate-200);
  border-radius: 1rem;
  transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
}
.surface-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px -24px rgba(11, 27, 51, 0.22);
  border-color: rgba(22, 82, 196, 0.25);
}

.glass-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Notice ticker rows */
.notice-row {
  border-bottom: 1px solid var(--slate-200);
  transition: background-color 0.25s ease;
}
.notice-row:hover {
  background-color: var(--mist);
}
.notice-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--signal-cyan);
  box-shadow: 0 0 0 3px rgba(47, 230, 221, 0.18);
}

/* =========================================================================
   BUTTONS
   ========================================================================= */

.btn-primary {
  background: var(--circuit-blue);
  color: var(--paper);
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 12px 28px -14px rgba(22, 82, 196, 0.55);
}
.btn-primary:hover {
  background: var(--circuit-blue-dark);
  transform: translateY(-2px);
  box-shadow: 0 16px 32px -12px rgba(22, 82, 196, 0.6);
}

.btn-ghost {
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  color: var(--paper);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}
.btn-ghost:hover {
  border-color: var(--signal-cyan);
  background-color: rgba(47, 230, 221, 0.08);
}

/* =========================================================================
   SWIPER OVERRIDES — recruiters strip + testimonials
   ========================================================================= */

.recruiter-swiper .swiper-wrapper {
  transition-timing-function: linear !important;
}
.recruiter-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  padding-inline: 2.5rem;
}
.recruiter-slide span {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  color: var(--slate-500);
  white-space: nowrap;
  opacity: 0.7;
  transition: opacity 0.3s ease, color 0.3s ease;
}
.recruiter-slide:hover span {
  opacity: 1;
  color: var(--circuit-blue);
}

.testimonial-swiper .swiper-pagination-bullet {
  background: var(--slate-200);
  opacity: 1;
  width: 8px;
  height: 8px;
}
.testimonial-swiper .swiper-pagination-bullet-active {
  background: var(--circuit-blue);
  width: 22px;
  border-radius: 999px;
}
.testimonial-swiper .swiper-button-next,
.testimonial-swiper .swiper-button-prev {
  color: var(--circuit-blue);
  width: 2.75rem;
  height: 2.75rem;
  background: var(--paper);
  border-radius: 999px;
  box-shadow: 0 10px 24px -12px rgba(11, 27, 51, 0.3);
}
.testimonial-swiper .swiper-button-next::after,
.testimonial-swiper .swiper-button-prev::after {
  font-size: 1rem;
  font-weight: 700;
}

/* =========================================================================
   BACK TO TOP
   ========================================================================= */

#back-to-top {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: var(--circuit-blue);
  color: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 70;
  opacity: 0;
  transform: translateY(16px) scale(0.9);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
  box-shadow: 0 12px 28px -12px rgba(11, 27, 51, 0.4);
}
#back-to-top.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}
#back-to-top:hover {
  background: var(--circuit-blue-dark);
}

/* =========================================================================
   REDUCED MOTION — respected across every custom animation
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .trace-pulse {
    display: none;
  }
}

/* =========================================================================
   DARK MODE — toggle class "dark" on <html>
   ========================================================================= */
html.dark { color-scheme: dark; }

html.dark body                        { background:#0f172a; color:#e2e8f0; }
html.dark .surface-card               { background:#1e293b; border-color:#334155; }
html.dark .surface-card:hover         { border-color:rgba(47,230,221,.35); }
html.dark #site-header.is-scrolled    { background:rgba(15,23,42,.88); box-shadow:0 1px 0 rgba(255,255,255,.06); }
html.dark #site-header.is-scrolled .nav-link  { color:#94a3b8; }
html.dark #site-header.is-scrolled .brand-text{ color:#f1f5f9; }
html.dark #site-header.is-scrolled .nav-link:hover { color:#2fe6dd; }
html.dark .bg-white                   { background:#0f172a !important; }
html.dark .bg-mist                    { background:#1e293b !important; }
html.dark .text-ink-navy,
html.dark [style*="color:#0b1b33"]    { color:#f1f5f9 !important; }
html.dark [style*="color:#5b6478"]    { color:#94a3b8 !important; }
html.dark [style*="color:#aab4c8"]    { color:#64748b !important; }
html.dark [style*="border-color:#e2e8f0"],
html.dark [style*="border-top:1px solid #e2e8f0"],
html.dark [style*="border-bottom:1px solid #e2e8f0"]{ border-color:#334155 !important; }
html.dark [style*="background:#f0f4ff"]{ background:#1e293b !important; color:#7eb6ff !important; }
html.dark [style*="background:#f4f7fb"]{ background:#1e293b !important; }
html.dark [style*="background:#fff"]  { background:#1e293b !important; }
html.dark .notice-row:hover           { background:#1e293b; }
html.dark .notice-row                 { border-color:#334155; }
html.dark #loading-screen             { background:#0f172a; }
html.dark ::-webkit-scrollbar-track  { background:#1e293b; }

/* Dark mode toggle button */
#dark-toggle {
  position: fixed;
  bottom: 5.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: #1e293b;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 70;
  box-shadow: 0 8px 24px -8px rgba(0,0,0,.4);
  border: 1.5px solid #334155;
  cursor: pointer;
  transition: all .3s;
}
#dark-toggle:hover { background: #1652c4; border-color: #1652c4; }
html:not(.dark) #dark-toggle { background: #fff; color: #0b1b33; border-color: #e2e8f0; box-shadow: 0 8px 24px -8px rgba(11,27,51,.2); }
html:not(.dark) #dark-toggle:hover { background: #1652c4; color: #fff; border-color: #1652c4; }

/* =========================================================================
   ENHANCED FACULTY / STUDENT CARD STYLES
   ========================================================================= */

.faculty-card,
.student-card {
  transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
}
.faculty-card:hover,
.student-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 52px -24px rgba(11,27,51,.22);
  border-color: rgba(22,82,196,.3);
}

.filter-btn {
  transition: all .25s ease;
  cursor: pointer;
}
.filter-btn.active {
  background: var(--circuit-blue) !important;
  color: #fff !important;
  border-color: var(--circuit-blue) !important;
}
.filter-btn:hover:not(.active) {
  border-color: var(--circuit-blue) !important;
  color: var(--circuit-blue) !important;
}

/* =========================================================================
   SEARCH BAR
   ========================================================================= */

.search-input {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  border: 1.5px solid var(--slate-200);
  border-radius: 0.75rem;
  font-size: 0.85rem;
  color: var(--slate-900);
  background: var(--paper);
  outline: none;
  transition: border-color .3s ease, box-shadow .3s ease;
}
.search-input:focus {
  border-color: var(--circuit-blue);
  box-shadow: 0 0 0 3px rgba(22,82,196,.12);
}
.search-input::placeholder {
  color: var(--slate-500);
  opacity: 0.6;
}
.search-wrapper {
  position: relative;
}
.search-wrapper .search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--slate-500);
  font-size: 0.85rem;
  pointer-events: none;
}

/* =========================================================================
   VIEW TOGGLE (Card / Table)
   ========================================================================= */

.view-toggle {
  display: inline-flex;
  border: 1.5px solid var(--slate-200);
  border-radius: 0.75rem;
  overflow: hidden;
}
.view-toggle-btn {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all .25s ease;
  background: transparent;
  color: var(--slate-500);
  border: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.view-toggle-btn.active {
  background: var(--circuit-blue);
  color: #fff;
}
.view-toggle-btn:hover:not(.active) {
  background: var(--mist);
  color: var(--circuit-blue);
}

/* =========================================================================
   TABLE VIEW STYLES
   ========================================================================= */

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem;
}
.data-table th {
  background: var(--mist);
  color: var(--slate-900);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.85rem 1rem;
  text-align: left;
  border-bottom: 2px solid var(--slate-200);
  position: sticky;
  top: 0;
  z-index: 5;
}
.data-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--slate-200);
  color: var(--slate-500);
  vertical-align: middle;
}
.data-table tbody tr {
  transition: background-color .2s ease;
}
.data-table tbody tr:hover {
  background: var(--mist);
}
.data-table tbody tr:last-child td {
  border-bottom: none;
}

/* =========================================================================
   GALLERY LIGHTBOX
   ========================================================================= */

.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(11,27,51,.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity .3s ease, visibility .3s ease;
}
.lightbox-overlay.is-active {
  opacity: 1;
  visibility: visible;
}
.lightbox-content {
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 32px 64px rgba(0,0,0,.5);
  transform: scale(0.9);
  transition: transform .3s ease;
}
.lightbox-overlay.is-active .lightbox-content {
  transform: scale(1);
}
.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  background: rgba(255,255,255,.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  font-size: 1.2rem;
  transition: background .3s ease;
}
.lightbox-close:hover {
  background: rgba(255,255,255,.25);
}

.gallery-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, var(--ink-navy-light), var(--ink-navy));
  transition: transform .35s ease, box-shadow .35s ease;
}
.gallery-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 24px 48px -20px rgba(11,27,51,.35);
}
.gallery-card .gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(11,27,51,.7) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity .3s ease;
}
.gallery-card:hover .gallery-overlay {
  opacity: 1;
}

/* =========================================================================
   TAB COMPONENTS (Achievements)
   ========================================================================= */

.tab-nav {
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid var(--slate-200);
  margin-bottom: 2rem;
  overflow-x: auto;
}
.tab-btn {
  padding: 0.85rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--slate-500);
  position: relative;
  white-space: nowrap;
  transition: color .25s ease;
}
.tab-btn::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--circuit-blue);
  transform: scaleX(0);
  transition: transform .25s ease;
}
.tab-btn.active {
  color: var(--circuit-blue);
}
.tab-btn.active::after {
  transform: scaleX(1);
}
.tab-btn:hover:not(.active) {
  color: var(--circuit-blue);
}
.tab-panel {
  display: none;
}
.tab-panel.active {
  display: block;
  animation: fadeIn .4s ease;
}

/* =========================================================================
   ACCORDION (Resources / Downloads)
   ========================================================================= */

.accordion-item {
  border: 1px solid var(--slate-200);
  border-radius: 1rem;
  overflow: hidden;
  transition: border-color .3s ease, box-shadow .3s ease;
  margin-bottom: 0.75rem;
}
.accordion-item:hover {
  border-color: rgba(22,82,196,.25);
}
.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.15rem 1.5rem;
  cursor: pointer;
  background: var(--paper);
  border: none;
  width: 100%;
  text-align: left;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--slate-900);
  gap: 1rem;
  transition: background .2s ease;
}
.accordion-header:hover {
  background: var(--mist);
}
.accordion-icon {
  font-size: 0.8rem;
  color: var(--circuit-blue);
  transition: transform .3s ease;
}
.accordion-item.is-open .accordion-icon {
  transform: rotate(180deg);
}
.accordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height .4s ease;
  background: var(--mist);
}
.accordion-item.is-open .accordion-body {
  max-height: 2000px;
}
.accordion-content {
  padding: 1rem 1.5rem 1.5rem;
}

.download-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  background: var(--paper);
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--slate-200);
  transition: border-color .2s ease;
}
.download-item:hover {
  border-color: rgba(22,82,196,.25);
}
.download-item .file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.download-item .file-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.6rem;
  background: var(--mist);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--circuit-blue);
  font-size: 0.9rem;
  flex-shrink: 0;
}
.coming-soon-badge {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  padding: 0.25rem 0.65rem;
  border-radius: 0.5rem;
  background: rgba(47,230,221,.1);
  color: var(--signal-cyan);
  white-space: nowrap;
}

/* =========================================================================
   CONTACT FORM
   ========================================================================= */

.form-group {
  margin-bottom: 1.25rem;
}
.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--slate-900);
  margin-bottom: 0.4rem;
  font-family: var(--font-display);
}
.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid var(--slate-200);
  border-radius: 0.75rem;
  font-size: 0.85rem;
  font-family: var(--font-body);
  color: var(--slate-900);
  background: var(--paper);
  outline: none;
  transition: border-color .3s ease, box-shadow .3s ease;
}
.form-input:focus,
.form-textarea:focus {
  border-color: var(--circuit-blue);
  box-shadow: 0 0 0 3px rgba(22,82,196,.1);
}
.form-textarea {
  resize: vertical;
  min-height: 120px;
}

/* =========================================================================
   RESEARCH & PLACEMENT CARDS
   ========================================================================= */

.research-card {
  background: var(--paper);
  border: 1px solid var(--slate-200);
  border-radius: 1.25rem;
  padding: 2rem;
  transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
}
.research-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 52px -24px rgba(11,27,51,.2);
  border-color: rgba(22,82,196,.3);
}
.research-card .card-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  background: var(--paper);
  border: 1px solid var(--slate-200);
  border-radius: 1rem;
  padding: 1.75rem;
  text-align: center;
  transition: transform .3s ease, box-shadow .3s ease;
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px -20px rgba(11,27,51,.2);
}

/* =========================================================================
   SKELETON LOADING ANIMATION
   ========================================================================= */

.skeleton {
  background: linear-gradient(90deg, var(--mist) 25%, #e8edf5 50%, var(--mist) 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease infinite;
  border-radius: 0.5rem;
}
.skeleton-card {
  background: var(--paper);
  border: 1px solid var(--slate-200);
  border-radius: 1rem;
  overflow: hidden;
}
.skeleton-card .skeleton-img {
  width: 100%;
  height: 180px;
}
.skeleton-card .skeleton-text {
  height: 14px;
  margin: 1rem;
}
.skeleton-card .skeleton-text-short {
  height: 12px;
  width: 60%;
  margin: 0.5rem 1rem 1rem;
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* =========================================================================
   HOD PROFILE STYLES
   ========================================================================= */

.hod-profile-card {
  background: var(--paper);
  border: 1px solid var(--slate-200);
  border-radius: 1.5rem;
  overflow: hidden;
}
.hod-photo-section {
  background: linear-gradient(135deg, var(--ink-navy) 0%, var(--circuit-blue) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}
.hod-photo-placeholder {
  width: 160px;
  height: 160px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--circuit-blue), var(--signal-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255,255,255,.25);
  box-shadow: 0 24px 48px rgba(0,0,0,.25);
}
.hod-info-section {
  padding: 2.5rem;
}
.research-tag {
  display: inline-flex;
  padding: 0.35rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  background: rgba(22,82,196,.08);
  color: var(--circuit-blue);
  border: 1px solid rgba(22,82,196,.15);
}

/* =========================================================================
   ANIMATIONS
   ========================================================================= */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* =========================================================================
   TIMELINE (Achievements)
   ========================================================================= */

.timeline {
  position: relative;
  padding-left: 2rem;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--circuit-blue), var(--signal-cyan));
}
.timeline-item {
  position: relative;
  padding-bottom: 2rem;
  padding-left: 1.5rem;
}
.timeline-item::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--circuit-blue);
  border: 2px solid var(--paper);
  box-shadow: 0 0 0 3px rgba(22,82,196,.2);
}
.timeline-item:last-child {
  padding-bottom: 0;
}

/* =========================================================================
   PRINT STYLES
   ========================================================================= */

@media print {
  #loading-screen,
  #scroll-progress,
  #site-header,
  #back-to-top,
  #dark-toggle,
  .lightbox-overlay {
    display: none !important;
  }
  body {
    background: #fff !important;
    color: #000 !important;
    font-size: 12pt;
  }
  .surface-card {
    border: 1px solid #ccc !important;
    box-shadow: none !important;
  }
  a {
    color: #1652c4 !important;
  }
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
}

/* =========================================================================
   DARK MODE — Additional component dark styles
   ========================================================================= */

html.dark .search-input { background: #1e293b; border-color: #334155; color: #e2e8f0; }
html.dark .search-input:focus { border-color: var(--circuit-blue); }
html.dark .accordion-header { background: #1e293b; color: #e2e8f0; }
html.dark .accordion-header:hover { background: #334155; }
html.dark .accordion-body { background: #0f172a; }
html.dark .download-item { background: #1e293b; border-color: #334155; }
html.dark .form-input, html.dark .form-textarea { background: #1e293b; border-color: #334155; color: #e2e8f0; }
html.dark .data-table th { background: #1e293b; color: #e2e8f0; border-color: #334155; }
html.dark .data-table td { border-color: #334155; color: #94a3b8; }
html.dark .data-table tbody tr:hover { background: #1e293b; }
html.dark .research-card { background: #1e293b; border-color: #334155; }
html.dark .hod-profile-card { background: #1e293b; border-color: #334155; }
html.dark .tab-nav { border-color: #334155; }
html.dark .skeleton { background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%); background-size: 200% 100%; }
html.dark .view-toggle { border-color: #334155; }
html.dark .view-toggle-btn { color: #94a3b8; }
html.dark .view-toggle-btn:hover:not(.active) { background: #334155; }
html.dark .accordion-item { border-color: #334155; }
html.dark .research-tag { background: rgba(22,82,196,.15); border-color: rgba(22,82,196,.3); }
html.dark .gallery-card { background: linear-gradient(135deg, #1e293b, #0f172a); }

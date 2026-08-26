function escapeHtml(v) {
  var d = document.createElement('div');
  d.textContent = v == null ? '' : String(v);
  return d.innerHTML;
}

function initTheme() {
  var saved = localStorage.getItem('siet-dark');
  if (saved !== null) {
    if (saved === 'true') document.documentElement.classList.add('dark');
    return;
  }
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('siet-dark', 'true');
  }
}

function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('siet-dark', isDark);
}

document.addEventListener('DOMContentLoaded', function() {
  initTheme();

  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
  }

  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var mobileMenuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      var expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
    });
  }

  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html') || (href.includes(currentPath) && currentPath !== 'index.html'))) {
      link.classList.add('active');
    }
  });

  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 60 });
  }
});

/* ---- Universal Toast System ---- */
(function toastSystem() {
  var container = document.createElement('div');
  container.id = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('role', 'status');
  document.body.appendChild(container);

  var style = document.createElement('style');
  style.textContent = [
    '#toast-container{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.75rem;pointer-events:none}',
    '.toast{pointer-events:all;display:flex;align-items:center;gap:.75rem;padding:.9rem 1.25rem;border-radius:1rem;font-size:.85rem;font-family:"IBM Plex Sans",sans-serif;box-shadow:0 8px 32px rgba(11,27,51,.18);backdrop-filter:blur(12px);min-width:260px;max-width:380px;transform:translateX(120%);transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .35s;opacity:0}',
    '.toast.is-visible{transform:translateX(0);opacity:1}',
    '.toast--success{background:linear-gradient(135deg,#0d7a5f,#059669);color:#fff}',
    '.toast--error{background:linear-gradient(135deg,#b91c1c,#dc2626);color:#fff}',
    '.toast--info{background:linear-gradient(135deg,#1652c4,#2fe6dd);color:#fff}',
    '.toast--warning{background:linear-gradient(135deg,#d97706,#fbbf24);color:#0b1b33}',
    '.toast-close{margin-left:auto;background:none;border:none;color:inherit;opacity:.7;cursor:pointer;font-size:1rem;padding:0;line-height:1}'
  ].join('');
  document.head.appendChild(style);

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

window.escapeHtml = escapeHtml;
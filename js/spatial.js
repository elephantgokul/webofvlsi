// spatial.js - Spatial UI Interactive Logic (Performance Optimized)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Add ambient background (clean hardware-accelerated gradient)
    if (!document.querySelector('.ambient-bg')) {
        const bg = document.createElement('div');
        bg.className = 'ambient-bg';
        document.body.prepend(bg);
    }

    // 2. Setup theme toggle
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Create a floating theme toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'glass-pill theme-toggle-btn';
    toggleBtn.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid var(--glass-border); background: var(--glass-bg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); color: var(--text-primary); transition: transform 0.2s;';
    toggleBtn.setAttribute('aria-label', 'Toggle Theme');
    
    const updateIcon = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        toggleBtn.innerHTML = currentTheme === 'light' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    };
    
    toggleBtn.addEventListener('click', () => {
        let current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateIcon();
    });
    
    updateIcon();
    document.body.appendChild(toggleBtn);

    // 3. Ultra-efficient pointer light effect using event delegation & RAF
    // Only runs when hovering directly over a .surface-card (zero DOM thrashing)
    if (window.matchMedia("(hover: hover)").matches) {
        let mouseRaf = null;
        document.addEventListener('mousemove', (e) => {
            if (mouseRaf) return;
            mouseRaf = requestAnimationFrame(() => {
                mouseRaf = null;
                const card = e.target.closest('.surface-card');
                if (card) {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
                }
            });
        }, { passive: true });
    }

    // 4. Optional 3D tilt effect on hero cards (if any have data-tilt) — RAF throttled
    document.querySelectorAll('.surface-card[data-tilt]').forEach(card => {
        let tiltRaf = null;
        card.addEventListener('mousemove', e => {
            if (tiltRaf) return;
            tiltRaf = requestAnimationFrame(() => {
                tiltRaf = null;
                const rect = card.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (((e.clientY - rect.top) - centerY) / centerY) * -6;
                const rotateY = (((e.clientX - rect.left) - centerX) / centerX) * 6;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            if (tiltRaf) {
                cancelAnimationFrame(tiltRaf);
                tiltRaf = null;
            }
            card.style.transform = '';
        });
    });
});

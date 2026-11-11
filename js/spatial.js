// spatial.js - Spatial UI Interactive Logic (Performance Optimized)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Add ambient background (clean hardware-accelerated gradient)
    if (!document.querySelector('.ambient-bg')) {
        const bg = document.createElement('div');
        bg.className = 'ambient-bg';
        document.body.prepend(bg);
    }

    // 2. Enforce clean light theme
    document.documentElement.setAttribute('data-theme', 'light');
    try { localStorage.removeItem('theme'); } catch (e) { }

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

// spatial.js - Spatial UI Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Add ambient background (floating orbs)
    if (!document.querySelector('.ambient-bg')) {
        const bg = document.createElement('div');
        bg.className = 'ambient-bg';
        bg.innerHTML = `
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
        `;
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
    toggleBtn.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid var(--glass-border); background: var(--glass-bg); backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); color: var(--text-primary); transition: transform 0.2s;';
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

    // 3. Pointer light effect for cards (only for pointing devices)
    if (window.matchMedia("(hover: hover)").matches) {
        document.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.surface-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mx', `${x}px`);
                card.style.setProperty('--my', `${y}px`);
            });
        });
    }

    // 4. Retrofit existing DOM elements to match the Spatial UI
    // Ensure inputs look glassy
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.classList.add('glass-input');
    });
    
    // Ensure badges look glassy
    document.querySelectorAll('.badge, .status-badge, .status-present, .status-absent').forEach(el => {
        el.classList.add('glass-pill');
    });

    // Optional 3D tilt effect on hero cards (if any have data-tilt)
    document.querySelectorAll('.surface-card[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
});

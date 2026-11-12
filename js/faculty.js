// js/faculty.js - Faculty Directory with Resilient Loading, Deduplication & Detail Modal

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('faculty-grid');
    if (!grid) return;

    let facultyList = [];
    let isRendering = false;

    // Ordered list mapping
    const orderMap = {
        'dr. p. dhilipkumar': 1,
        'mrs. t. renita pearlin': 2,
        'mrs. renita pearlin': 2,
        'mrs. priscilla sophia': 3,
        'mrs. p. priscilla sophia': 3,
        'mrs. c. prema': 4,
        'mrs. vasanthi': 5,
        'mrs. r. vasanthi': 5
    };

    async function loadData() {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <i class="fa-solid fa-circle-notch fa-spin text-3xl" style="color:#1652c4"></i>
                <p class="mt-4 text-sm font-medium text-slate-600">Loading Faculty Directory...</p>
            </div>
        `;

        try {
            var data = null;
            if (typeof window.fetchDepartmentData === 'function') {
                data = await window.fetchDepartmentData();
            } else if (typeof fetchDepartmentData === 'function') {
                data = await fetchDepartmentData();
            }

            var rawList = (data && Array.isArray(data.faculty)) ? data.faculty : [];
            
            // Deduplicate faculty by both name and email
            var seen = new Set();
            facultyList = [];
            for (var i = 0; i < rawList.length; i++) {
                var f = rawList[i];
                if (!f) continue;
                var nameKey = (f.name || '').toLowerCase().trim();
                var emailKey = (f.email || '').toLowerCase().trim();
                if ((nameKey && seen.has(nameKey)) || (emailKey && seen.has(emailKey))) continue;
                if (nameKey) seen.add(nameKey);
                if (emailKey) seen.add(emailKey);
                facultyList.push(f);
            }

            // Fallback ensure all 5 members are present
            if (window.DEPT_FALLBACK_DATA && Array.isArray(window.DEPT_FALLBACK_DATA.faculty)) {
                window.DEPT_FALLBACK_DATA.faculty.forEach(function (fb) {
                    var fbName = (fb.name || '').toLowerCase().trim();
                    var fbEmail = (fb.email || '').toLowerCase().trim();
                    if ((fbName && seen.has(fbName)) || (fbEmail && seen.has(fbEmail))) return;
                    if (fbName) seen.add(fbName);
                    if (fbEmail) seen.add(fbEmail);
                    facultyList.push(fb);
                });
            }

            if (facultyList.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-12 text-slate-500">No faculty data available.</div>';
                return;
            }

            renderFaculty(facultyList);
            setupFilters();
        } catch (error) {
            console.error('[Faculty] Error loading faculty data:', error);
            if (typeof window.renderSupabaseError === 'function') {
                window.renderSupabaseError(grid, 'Could not load faculty data, please refresh', loadData);
            } else {
                grid.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <p class="text-red-500 font-semibold mb-3">Could not load faculty data, please refresh</p>
                        <button type="button" class="retry-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white">Retry</button>
                    </div>
                `;
                var btn = grid.querySelector('.retry-btn');
                if (btn) btn.addEventListener('click', loadData);
            }
        }
    }

    function renderFaculty(list) {
        if (isRendering) return;
        isRendering = true;

        grid.innerHTML = '';

        // Sort by canonical department hierarchy
        list.sort(function (a, b) {
            var nameA = (a.name || '').toLowerCase().trim();
            var nameB = (b.name || '').toLowerCase().trim();
            var orderA = orderMap[nameA] || 99;
            var orderB = orderMap[nameB] || 99;
            return orderA - orderB;
        });

        list.forEach(function (fac, index) {
            var isProf = fac.designation && fac.designation.toLowerCase().includes('head');
            var isAssoc = fac.designation && fac.designation.toLowerCase().includes('associate');
            var badgeBg = isProf ? '#1652c4' : (isAssoc ? '#7eb6ff' : '#2fe6a0');
            var badgeColor = isProf ? '#fff' : (isAssoc ? '#0b1b33' : '#0a3320');
            var outerBg = isProf ? 'linear-gradient(145deg,#e8edf5,#d0daea)' : 'linear-gradient(145deg,#edf0f5,#d8dae8)';

            var rawPhoto = fac.photoUrl || fac.image;
            var photoSrc = '';
            if (typeof resolveSupabaseImageUrl === 'function') {
                photoSrc = resolveSupabaseImageUrl(rawPhoto, 'faculty', rawPhoto);
            } else if (typeof resolveAssetPath === 'function') {
                photoSrc = resolveAssetPath(rawPhoto);
            } else {
                photoSrc = '../assets/images/faculty/' + String(rawPhoto).split('/').pop();
            }

            var localFallback = '../assets/images/faculty/' + String(rawPhoto).split('/').pop();
            var designationLabel = (fac.designation || '').replace('Assistant Professor', 'Asst. Prof').replace('Associate Professor & Head', 'Assoc. Prof & Head');
            var specialization = fac.specialization || 'VLSI Design and Technology';

            var card = document.createElement('article');
            card.className = 'faculty-item faculty-card surface-card rounded-2xl overflow-hidden interactive-detail-card focus:outline-none focus:ring-2 focus:ring-blue-500';
            card.dataset.spec = 'vlsi';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-haspopup', 'dialog');
            card.setAttribute('aria-label', `View profile of ${fac.name}`);
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', String((index % 4) * 60));

            card.innerHTML = `
              <div class="h-44 flex items-center justify-center relative" style="background:${outerBg}">
                <div class="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
                  <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(fac.name)}" loading="lazy" decoding="async" class="w-full h-full object-cover" data-fallback="${escapeHtml(localFallback)}" onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){ this.src = this.dataset.fallback; } else { this.onerror=null; this.src='../assets/images/department_logo.png'; }">
                </div>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium" style="background:${badgeBg};color:${badgeColor}">${escapeHtml(designationLabel)}</span>
              </div>
              <div class="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 class="font-display font-semibold text-base text-slate-900">${escapeHtml(fac.name)}</h3>
                  <p class="text-xs font-semibold text-blue-600 mt-0.5 mb-2">${escapeHtml(fac.designation)}</p>
                  <div class="space-y-1 mb-3 text-xs text-slate-600">
                    <p><i class="fa-solid fa-graduation-cap text-blue-600 w-4"></i> ${escapeHtml(fac.qualification)}</p>
                    <p><i class="fa-solid fa-flask text-blue-600 w-4"></i> ${escapeHtml(specialization)}</p>
                  </div>
                </div>
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span class="view-details-hint"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Profile</span>
                  ${fac.email ? `<a href="mailto:${escapeHtml(fac.email)}" onclick="event.stopPropagation();" aria-label="Email ${escapeHtml(fac.name)}" title="Email" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-all"><i class="fa-solid fa-envelope"></i></a>` : ''}
                </div>
              </div>
            `;

            // Click & keyboard activation for modal
            function triggerModal() {
                if (window.DeptModal && typeof window.DeptModal.openFaculty === 'function') {
                    window.DeptModal.openFaculty(fac);
                }
            }

            card.addEventListener('click', triggerModal);
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerModal();
                }
            });

            grid.appendChild(card);
        });

        if (typeof AOS !== 'undefined') {
            AOS.refreshHard();
        }

        isRendering = false;
    }

    function setupFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.faculty-item');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => {
                    b.classList.remove('active');
                    b.style.borderColor = '#e2e8f0';
                    b.style.color = '#5b6478';
                });
                btn.classList.add('active');

                const f = btn.dataset.filter;
                items.forEach(item => {
                    if (f === 'all' || item.dataset.spec === f) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    function escapeHtml(value) {
        return (value == null ? '' : String(value)).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // Initial load
    loadData();
});

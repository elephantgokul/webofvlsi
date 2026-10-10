document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('students-grid');
    if (!grid) return;

    let allStudents = [];
    let currentFilter = 'ALL';
    let currentSearch = '';
    let currentView = 'card'; // 'card', 'table', or 'circular'

    // Circular gallery state
    let circularAngle = 0;
    let circularRadius = 380;
    let circularCleanup = null; // stores cleanup function for event listeners

    // Initial Loading Skeleton
    grid.innerHTML = generateSkeletons(8);

    try {
        const data = await fetchDepartmentData();
        allStudents = (data.students || []).map(normalizeStudent);
        render();
        setupFilters();
        setupSearch();
        setupViewToggle();
    } catch (error) {
        console.error("Failed to load students:", error);
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-red-500 font-medium">
            <i class="fa-solid fa-triangle-exclamation text-3xl mb-3"></i>
            <p>Failed to load student data. Please try again later.</p>
        </div>`;
    }

    function render() {
        const filtered = allStudents.filter(student => {
            const matchesFilter = currentFilter === 'ALL' || student.yearToken === currentFilter;
            const q = currentSearch.toLowerCase().trim();
            const matchesSearch = !q ||
                (student.name && student.name.toLowerCase().includes(q)) ||
                (student.registerNo && student.registerNo.toLowerCase().includes(q)) ||
                (student.rollno && student.rollno.toLowerCase().includes(q)) ||
                (student.batch && student.batch.toLowerCase().includes(q)) ||
                (student.email && student.email.toLowerCase().includes(q)) ||
                (student.achievementTitle && student.achievementTitle.toLowerCase().includes(q)) ||
                (student.projectsOverview && student.projectsOverview.toLowerCase().includes(q));

            return matchesFilter && matchesSearch;
        });

        // Update count badge
        const countBadge = document.getElementById('student-count');
        if (countBadge) {
            countBadge.textContent = `${filtered.length} Student${filtered.length === 1 ? '' : 's'}`;
        }

        // Show/hide the correct containers
        const circularWrapper = document.getElementById('circular-gallery-wrapper');

        if (currentView === 'circular') {
            grid.style.display = 'none';
            if (circularWrapper) circularWrapper.style.display = 'block';
        } else {
            grid.style.display = '';
            if (circularWrapper) circularWrapper.style.display = 'none';
            // Clean up circular listeners if switching away
            if (circularCleanup) {
                circularCleanup();
                circularCleanup = null;
            }
        }

        if (filtered.length === 0) {
            if (currentView === 'circular') {
                const ring = document.getElementById('circular-ring');
                if (ring) ring.innerHTML = '';
                if (circularWrapper) {
                    circularWrapper.innerHTML = `<div class="text-center py-16">
                        <i class="fa-solid fa-user-slash text-4xl text-gray-300 mb-3"></i>
                        <p class="text-gray-500 font-medium">No students found matching your criteria.</p>
                    </div>`;
                }
            } else {
                grid.innerHTML = `<div class="col-span-full text-center py-16">
                    <i class="fa-solid fa-user-slash text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500 font-medium">No students found matching your criteria.</p>
                </div>`;
            }
            return;
        }

        if (currentView === 'card') {
            renderCardView(filtered);
        } else if (currentView === 'table') {
            renderTableView(filtered);
        } else if (currentView === 'circular') {
            renderCircularView(filtered);
        }
    }

    function renderCardView(students) {
        grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        grid.innerHTML = '';

        const yearColors = {
            'IV': { bg: 'linear-gradient(135deg,#1652c4,#2fe6dd)', badge: '#1652c4', text: '#fff' },
            'III': { bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', badge: '#7c3aed', text: '#fff' },
            'II': { bg: 'linear-gradient(135deg,#059669,#34d399)', badge: '#059669', text: '#fff' },
            'I': { bg: 'linear-gradient(135deg,#d97706,#fbbf24)', badge: '#d97706', text: '#fff' }
        };

        students.forEach((student, index) => {
            const colors = yearColors[student.yearToken] || yearColors['III'];
            const yearLabel = getYearLabel(student);
            const registerNo = student.registerNo || student.rollno || '';
            const detailHref = `student-detail.html?id=${encodeURIComponent(student.id || registerNo || student.name)}`;
            const rawPhoto = student.photoUrl || student.image;
            const photoSrc = typeof resolveSupabaseImageUrl === 'function'
                ? resolveSupabaseImageUrl(rawPhoto, (typeof SUPABASE_BUCKETS !== 'undefined' ? SUPABASE_BUCKETS.students : 'students'), rawPhoto)
                : resolveAssetPath(rawPhoto);

            const photoFallback = `<div class="w-16 h-16 rounded-full flex items-center justify-center" style="background:${colors.bg}"><i class="fa-solid fa-user-graduate text-white text-xl"></i></div>`;
            const batchHtml = student.batch
                ? `<span class="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono" style="background:rgba(11,27,51,0.06);color:#5b6478">Batch ${escapeHtml(student.batch)}</span>`
                : '';
            const batchLine = student.batch
                ? `<p><i class="fa-solid fa-calendar w-4" style="color:#2fe6dd"></i> Batch ${escapeHtml(student.batch)}</p>`
                : '';
            
            const achText = student.achievementTitle || student.achievement || '';
            const cleanAch = achText.replace(/^[-*â€¢\d.\s]+/, '').split('\n')[0];
            const achievementPreview = cleanAch
                ? `<p class="text-xs line-clamp-2 mt-2 pt-2" style="color:#5b6478;border-top:1px dashed #e2e8f0"><i class="fa-solid fa-trophy mr-1 text-[10px]" style="color:#d97706"></i>${escapeHtml(cleanAch)}</p>`
                : '';

            const projText = student.projectsOverview || student.projects_overview || student.projects || student.project || '';
            const cleanProj = String(projText).replace(/^[-*â€¢\d.\s]+/, '').split('\n')[0];
            const projectsPreview = cleanProj
                ? `<p class="text-xs line-clamp-2 mt-1.5 pt-1.5" style="color:#5b6478;border-top:1px dashed #e2e8f0"><i class="fa-solid fa-microchip mr-1 text-[10px]" style="color:#1652c4"></i><span class="font-medium" style="color:#0b1b33">Projects: </span>${escapeHtml(cleanProj)}</p>`
                : '';

            const linkedinHref = getExternalHref(student.linkedin || student.linkedin_url || student.linkedinUrl, 'linkedin');
            const linkedinBtn = linkedinHref
                ? `<a href="${escapeHtml(linkedinHref)}" target="_blank" rel="noopener" aria-label="LinkedIn Profile" title="LinkedIn Profile" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background='#1652c4';this.style.color='#fff'" onmouseout="this.style.background='#f0f4ff';this.style.color='#1652c4'"><i class="fa-brands fa-linkedin-in"></i></a>`
                : '';

            const localFallback = typeof getLocalAssetFallback === 'function'
                ? getLocalAssetFallback(rawPhoto, 'students')
                : resolveAssetPath(rawPhoto);

            const photoHtml = photoSrc
                ? `<div class="relative w-16 h-16 rounded-full">${photoFallback}<img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(student.name)}" class="absolute inset-0 w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white bg-white" data-fallback="${escapeHtml(localFallback)}" onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){ this.src = this.dataset.fallback; } else { this.style.display='none'; }"></div>`
                : photoFallback;

            // Compute points if scoring.js is loaded
            let pointsBadgeHtml = '';
            if (typeof computeStudentScore === 'function') {
                const scoring = computeStudentScore(student);
                if (scoring.totalPoints > 0) {
                    pointsBadgeHtml = `<div class="flex items-center gap-2 mt-2 pt-2" style="border-top:1px dashed #e2e8f0">
                        <span class="student-points-badge"><i class="fa-solid fa-star"></i> ${scoring.totalPoints} pts</span>
                        ${scoring.projectCount > 0 ? `<span class="student-points-badge"><i class="fa-solid fa-microchip"></i> ${scoring.projectCount} projects</span>` : ''}
                    </div>`;
                }
            }

            const card = document.createElement('article');
            card.className = 'student-item student-card surface-card rounded-2xl overflow-hidden';
            card.dataset.year = student.yearToken;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index % 4) * 60);

            card.innerHTML = `
              <div class="h-36 flex items-center justify-center relative" style="background:linear-gradient(145deg,#e8edf5,#d0daea)">
                ${photoHtml}
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-mono font-medium" style="background:${colors.badge};color:${colors.text}">${escapeHtml(yearLabel)}</span>
                ${batchHtml}
              </div>
              <div class="p-5">
                <h3 class="font-display font-semibold text-sm" style="color:#0b1b33">${escapeHtml(student.name)}</h3>
                <p class="text-xs mt-0.5 mb-3 font-mono" style="color:#1652c4">${escapeHtml(registerNo)}</p>
                <div class="space-y-1.5 text-[0.75rem]" style="color:#5b6478">
                  <p><i class="fa-solid fa-envelope w-4" style="color:#2fe6dd"></i> ${escapeHtml(student.email)}</p>
                  ${batchLine}
                </div>
                ${achievementPreview}
                ${projectsPreview}
                ${pointsBadgeHtml}
                <div class="flex gap-2 pt-3 mt-3" style="border-top:1px solid #e2e8f0">
                  <a href="mailto:${escapeHtml(student.email)}" aria-label="Email" title="Email" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background='#1652c4';this.style.color='#fff'" onmouseout="this.style.background='#f0f4ff';this.style.color='#1652c4'"><i class="fa-solid fa-envelope"></i></a>
                  ${linkedinBtn}
                  <a href="${detailHref}" aria-label="View details" title="View Details" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background='#1652c4';this.style.color='#fff'" onmouseout="this.style.background='#f0f4ff';this.style.color='#1652c4'"><i class="fa-solid fa-eye"></i></a>
                </div>
              </div>
            `;
            grid.appendChild(card);
        });

        if (typeof AOS !== 'undefined') AOS.refreshHard();
    }

    function renderTableView(students) {
        grid.className = '';
        grid.innerHTML = `
        <div class="surface-card rounded-2xl overflow-hidden overflow-x-auto">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Roll No</th>
                        <th>Year</th>
                        <th>Batch</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map((s, i) => `
                        <tr>
                            <td class="font-mono text-xs">${i + 1}</td>
                            <td class="font-semibold" style="color:#0b1b33">${escapeHtml(s.name)}</td>
                            <td class="font-mono text-xs" style="color:#1652c4">${escapeHtml(s.registerNo || s.rollno)}</td>
                            <td><span class="px-2 py-0.5 rounded-md text-xs font-mono" style="background:#f0f4ff;color:#1652c4">${escapeHtml(getYearLabel(s))}</span></td>
                            <td class="font-mono text-xs">${escapeHtml(s.batch)}</td>
                            <td><a href="mailto:${escapeHtml(s.email)}" class="text-xs hover:underline" style="color:#1652c4">${escapeHtml(s.email)}</a></td>
                            <td><a href="student-detail.html?id=${encodeURIComponent(s.id || s.registerNo || s.name)}" class="text-xs hover:underline" style="color:#1652c4">View</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
    }

    // =========================================================================
    //  3D CIRCULAR VIEW
    // =========================================================================

    function renderCircularView(students) {
        // Clean up any previous listeners
        if (circularCleanup) {
            circularCleanup();
            circularCleanup = null;
        }

        const wrapper = document.getElementById('circular-gallery-wrapper');
        const stage = document.getElementById('circular-stage');
        const ring = document.getElementById('circular-ring');
        const hint = document.getElementById('circular-hint');
        if (!wrapper || !stage || !ring) return;

        // Restore the wrapper structure if it was replaced by an empty-state message
        if (!document.getElementById('circular-stage')) {
            wrapper.innerHTML = `
                <div class="circular-gallery-hint" id="circular-hint">
                    <i class="fa-solid fa-computer-mouse"></i> Scroll or drag to rotate &bull; Click a card to view profile
                </div>
                <div class="circular-gallery-stage" id="circular-stage">
                    <div class="circular-gallery-ring" id="circular-ring"></div>
                </div>
                <div class="circular-gallery-controls">
                    <button id="circular-prev" class="circular-nav-btn" title="Rotate Left" aria-label="Rotate Left"><i class="fa-solid fa-chevron-left"></i></button>
                    <button id="circular-reset" class="circular-nav-btn" title="Reset View" aria-label="Reset View"><i class="fa-solid fa-rotate-left"></i></button>
                    <button id="circular-next" class="circular-nav-btn" title="Rotate Right" aria-label="Rotate Right"><i class="fa-solid fa-chevron-right"></i></button>
                </div>`;
        }

        const yearColors = {
            'IV': { bg: 'linear-gradient(135deg,#1652c4,#2fe6dd)', badge: '#1652c4' },
            'III': { bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', badge: '#7c3aed' },
            'II': { bg: 'linear-gradient(135deg,#059669,#34d399)', badge: '#059669' },
            'I': { bg: 'linear-gradient(135deg,#d97706,#fbbf24)', badge: '#d97706' }
        };

        // Sort students by roll number before laying out
        const sorted = students.slice().sort((a, b) => {
            const ra = String(a.registerNo || a.rollno || '').toLowerCase();
            const rb = String(b.registerNo || b.rollno || '').toLowerCase();
            return ra.localeCompare(rb, undefined, { numeric: true });
        });

        // Compute radius based on number of students and viewport
        const count = sorted.length;
        const vw = window.innerWidth;
        let cardW = 200;
        if (vw <= 480) cardW = 130;
        else if (vw <= 768) cardW = 150;
        else if (vw <= 1024) cardW = 170;

        // Large gap so cards don't collide — each card gets cardW + 80px breathing room
        const minRadius = Math.max(350, (count * (cardW + 80)) / (2 * Math.PI));
        circularRadius = Math.min(minRadius, 1200); // higher cap for many students

        const angleStep = 360 / count;

        // Build cards
        const currentRing = document.getElementById('circular-ring');
        currentRing.innerHTML = '';

        sorted.forEach((student, i) => {
            const colors = yearColors[student.yearToken] || yearColors['III'];
            const yearLabel = getYearLabel(student);
            const registerNo = student.registerNo || student.rollno || '';
            const detailHref = `student-detail.html?id=${encodeURIComponent(student.id || registerNo || student.name)}`;

            const rawPhoto = student.photoUrl || student.image;
            const photoSrc = typeof resolveSupabaseImageUrl === 'function'
                ? resolveSupabaseImageUrl(rawPhoto, (typeof SUPABASE_BUCKETS !== 'undefined' ? SUPABASE_BUCKETS.students : 'students'), rawPhoto)
                : resolveAssetPath(rawPhoto);
            const localFallback = typeof getLocalAssetFallback === 'function'
                ? getLocalAssetFallback(rawPhoto, 'students')
                : resolveAssetPath(rawPhoto);

            // Build photo HTML
            let photoInner = '';
            if (photoSrc) {
                photoInner = `<img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(student.name)}" loading="lazy" data-fallback="${escapeHtml(localFallback)}" onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){ this.src = this.dataset.fallback; } else { this.parentElement.innerHTML = '<div class=\\'circular-card-photo-fallback\\' style=\\'background:${colors.bg}\\'><i class=\\'fa-solid fa-user-graduate\\'></i></div>'; }">`;
            } else {
                photoInner = `<div class="circular-card-photo-fallback" style="background:${colors.bg}"><i class="fa-solid fa-user-graduate"></i></div>`;
            }

            // Points badge
            let pointsHtml = '';
            if (typeof computeStudentScore === 'function') {
                const scoring = computeStudentScore(student);
                if (scoring.totalPoints > 0) {
                    pointsHtml = `<span class="circular-card-points"><i class="fa-solid fa-star"></i> ${scoring.totalPoints} pts</span>`;
                }
            }

            const cardEl = document.createElement('a');
            cardEl.href = detailHref;
            cardEl.className = 'circular-card';
            cardEl.tabIndex = 0;
            cardEl.setAttribute('role', 'button');
            cardEl.setAttribute('aria-label', `View profile of ${student.name}`);

            // Position card around the cylinder
            const theta = angleStep * i;
            cardEl.style.transform = `rotateY(${theta}deg) translateZ(${circularRadius}px)`;

            cardEl.innerHTML = `
                <div class="circular-card-photo">
                    ${photoInner}
                    <span class="circular-card-year" style="background:${colors.badge}">${escapeHtml(yearLabel)}</span>
                </div>
                <div class="circular-card-info">
                    <div class="circular-card-name" title="${escapeHtml(student.name)}">${escapeHtml(student.name)}</div>
                    <div class="circular-card-roll">${escapeHtml(registerNo)}</div>
                    ${student.batch ? `<div class="circular-card-batch">Batch ${escapeHtml(student.batch)}</div>` : ''}
                    ${pointsHtml}
                </div>
            `;

            currentRing.appendChild(cardEl);
        });

        // Set initial rotation
        circularAngle = 0;
        updateRingTransform(currentRing);

        // Setup interactions
        circularCleanup = setupCircularInteractions(currentRing, stage, count, angleStep);
    }

    function updateRingTransform(ringEl) {
        if (!ringEl) ringEl = document.getElementById('circular-ring');
        if (!ringEl) return;
        ringEl.style.transform = `translateZ(-${circularRadius}px) rotateY(${circularAngle}deg)`;
    }

    function setupCircularInteractions(ringEl, stageEl, count, angleStep) {
        const cleanupFunctions = [];

        // --- MOUSE WHEEL ---
        let wheelAccumulator = 0;
        let wheelRAF = null;

        function onWheel(e) {
            // Only intercept when pointer is inside the stage
            e.preventDefault();
            e.stopPropagation();

            // Accumulate delta for smooth batching
            wheelAccumulator += e.deltaY;

            if (!wheelRAF) {
                wheelRAF = requestAnimationFrame(() => {
                    // Convert accumulated delta to angle (sensitivity tuning)
                    const delta = wheelAccumulator * 0.08;
                    circularAngle += delta;
                    updateRingTransform(ringEl);
                    wheelAccumulator = 0;
                    wheelRAF = null;
                });
            }
        }
        stageEl.addEventListener('wheel', onWheel, { passive: false });
        cleanupFunctions.push(() => stageEl.removeEventListener('wheel', onWheel));

        // --- MOUSE DRAG ---
        let isDragging = false;
        let dragStartX = 0;
        let dragStartAngle = 0;

        function onMouseDown(e) {
            if (e.target.closest('a.circular-card')) {
                // We'll handle click vs drag differentiation
            }
            isDragging = true;
            dragStartX = e.clientX;
            dragStartAngle = circularAngle;
            stageEl.style.cursor = 'grabbing';
            // Disable transition for responsive dragging
            ringEl.style.transition = 'none';
            e.preventDefault();
        }

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            circularAngle = dragStartAngle + dx * 0.35;
            updateRingTransform(ringEl);
        }

        function onMouseUp(e) {
            if (!isDragging) return;
            isDragging = false;
            stageEl.style.cursor = 'grab';
            // Re-enable smooth transition
            ringEl.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';

            // If drag distance was tiny, treat as click
            const dx = Math.abs(e.clientX - dragStartX);
            if (dx < 5) {
                const card = e.target.closest('a.circular-card');
                if (card && card.href) {
                    window.location.href = card.href;
                }
            }
        }

        stageEl.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        cleanupFunctions.push(() => {
            stageEl.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        });

        // --- TOUCH ---
        let touchStartX = 0;
        let touchStartAngle = 0;
        let touchDragDistance = 0;

        function onTouchStart(e) {
            if (e.touches.length !== 1) return;
            touchStartX = e.touches[0].clientX;
            touchStartAngle = circularAngle;
            touchDragDistance = 0;
            ringEl.style.transition = 'none';
        }

        function onTouchMove(e) {
            if (e.touches.length !== 1) return;
            const dx = e.touches[0].clientX - touchStartX;
            touchDragDistance = Math.abs(dx);
            circularAngle = touchStartAngle + dx * 0.35;
            updateRingTransform(ringEl);
            if (touchDragDistance > 10) {
                e.preventDefault(); // prevent page scroll when swiping the gallery
            }
        }

        function onTouchEnd(e) {
            ringEl.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            // If it was a tap (very small drag), navigate
            if (touchDragDistance < 10) {
                const card = e.target.closest('a.circular-card');
                if (card && card.href) {
                    window.location.href = card.href;
                }
            }
        }

        stageEl.addEventListener('touchstart', onTouchStart, { passive: true });
        stageEl.addEventListener('touchmove', onTouchMove, { passive: false });
        stageEl.addEventListener('touchend', onTouchEnd, { passive: true });
        cleanupFunctions.push(() => {
            stageEl.removeEventListener('touchstart', onTouchStart);
            stageEl.removeEventListener('touchmove', onTouchMove);
            stageEl.removeEventListener('touchend', onTouchEnd);
        });

        // --- KEYBOARD ---
        function onKeyDown(e) {
            if (currentView !== 'circular') return;
            // Only respond if the stage or a child is focused, or if no form element is focused
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;

            if (e.key === 'ArrowLeft') {
                circularAngle += angleStep;
                updateRingTransform(ringEl);
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                circularAngle -= angleStep;
                updateRingTransform(ringEl);
                e.preventDefault();
            }
        }
        document.addEventListener('keydown', onKeyDown);
        cleanupFunctions.push(() => document.removeEventListener('keydown', onKeyDown));

        // --- NAV BUTTONS ---
        const prevBtn = document.getElementById('circular-prev');
        const nextBtn = document.getElementById('circular-next');
        const resetBtn = document.getElementById('circular-reset');

        function onPrev() {
            circularAngle += angleStep;
            updateRingTransform(ringEl);
        }
        function onNext() {
            circularAngle -= angleStep;
            updateRingTransform(ringEl);
        }
        function onReset() {
            circularAngle = 0;
            updateRingTransform(ringEl);
        }

        if (prevBtn) { prevBtn.addEventListener('click', onPrev); cleanupFunctions.push(() => prevBtn.removeEventListener('click', onPrev)); }
        if (nextBtn) { nextBtn.addEventListener('click', onNext); cleanupFunctions.push(() => nextBtn.removeEventListener('click', onNext)); }
        if (resetBtn) { resetBtn.addEventListener('click', onReset); cleanupFunctions.push(() => resetBtn.removeEventListener('click', onReset)); }

        // --- Prevent card default click during drag ---
        function onCardClick(e) {
            // We handle navigation in mouseup/touchend, so prevent default click always
            // (This prevents double navigation)
            if (isDragging || touchDragDistance > 10) {
                e.preventDefault();
            }
        }
        stageEl.addEventListener('click', onCardClick);
        cleanupFunctions.push(() => stageEl.removeEventListener('click', onCardClick));

        // Return cleanup
        return function cleanup() {
            cleanupFunctions.forEach(fn => fn());
            if (wheelRAF) cancelAnimationFrame(wheelRAF);
        };
    }

    // =========================================================================
    //  FILTERS / SEARCH / VIEW TOGGLE
    // =========================================================================

    function setupFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = '';
                    b.style.color = '';
                });
                btn.classList.add('active');
                currentFilter = btn.dataset.filter || 'ALL';
                render();
            });
        });
    }

    function setupSearch() {
        const input = document.getElementById('student-search');
        if (!input) return;

        let debounceTimer;
        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentSearch = e.target.value;
                render();
            }, 200);
        });
    }

    function setupViewToggle() {
        const cardBtn = document.getElementById('view-card');
        const tableBtn = document.getElementById('view-table');
        const circularBtn = document.getElementById('view-circular');
        const allBtns = [cardBtn, tableBtn, circularBtn].filter(Boolean);

        function setActive(activeBtn, viewName) {
            allBtns.forEach(b => b.classList.remove('active'));
            activeBtn.classList.add('active');
            currentView = viewName;
            render();
        }

        if (cardBtn) {
            cardBtn.addEventListener('click', () => setActive(cardBtn, 'card'));
        }
        if (tableBtn) {
            tableBtn.addEventListener('click', () => setActive(tableBtn, 'table'));
        }
        if (circularBtn) {
            circularBtn.addEventListener('click', () => setActive(circularBtn, 'circular'));
        }
    }

    // =========================================================================
    //  UTILITY FUNCTIONS (preserved from original)
    // =========================================================================

    function normalizeStudent(student) {
        const registerNo = student.registerNo || student.rollno || '';
        const image = student.image || student.photoUrl || '';
        const linkedin = student.linkedin || student.linkedin_url || student.linkedinUrl || '';
        const projectsOverview = student.projectsOverview || student.projects_overview || student.projects || student.project || '';
        return Object.assign({}, student, {
            registerNo: registerNo,
            rollno: student.rollno || registerNo,
            image: image,
            photoUrl: student.photoUrl || image,
            linkedin: linkedin,
            projectsOverview: projectsOverview,
            batch: student.batch || getBatchFromRegisterNo(registerNo),
            yearToken: student.yearToken || getYearToken(student.year)
        });
    }

    function getYearToken(year) {
        const text = String(year || '').toUpperCase();
        if (text.includes('IV')) return 'IV';
        if (text.includes('III')) return 'III';
        if (text.includes('II')) return 'II';
        if (text.match(/\bI\b/) || text === 'I' || text.includes('FIRST') || text.includes('I YEAR')) return 'I';
        return 'III';
    }

    function getYearLabel(student) {
        const year = String(student.year || student.yearToken || '').trim();
        if (!year) return 'III Year';
        return year.toLowerCase().includes('year') ? year : `${year} Year`;
    }

    function getBatchFromRegisterNo(registerNo) {
        const match = String(registerNo || '').match(/^(\d{2})/);
        return match ? "20" + match[1] + " - 20" + (parseInt(match[1], 10) + 4) : "2024 - 2028";
    }

    function getExternalHref(value, type) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        if (/^https?:\/\//i.test(raw)) return raw.replace(/\s/g, '%20');
        if (/^www\./i.test(raw)) return 'https://' + raw.replace(/\s/g, '%20');
        if (/^(github|linkedin)\.com\//i.test(raw)) return 'https://' + raw.replace(/\s/g, '%20');
        if (type === 'github' && !/\s/.test(raw)) return 'https://github.com/' + encodeURIComponent(raw);
        if (type === 'linkedin' && /^in\/[a-zA-Z0-9_-]+/i.test(raw)) return 'https://www.linkedin.com/' + raw;
        return '';
    }

    function resolveAssetPath(src) {
        const value = String(src || '');
        if (!value || /^(https?:|data:|\/|\.\.?\/)/i.test(value)) return value;
        return value.indexOf('assets/') === 0 ? '../' + value : value;
    }

    function escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }

    function generateSkeletons(count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text-short"></div></div>`;
        }
        return html;
    }
});


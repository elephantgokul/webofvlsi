// js/students.js — Student data renderer with search, filter, and view toggle
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('students-grid');
    if (!grid) return;

    let allStudents = [];
    let currentView = 'card'; // 'card' or 'table'
    let currentFilter = 'all';
    let searchQuery = '';

    // Show loading skeleton
    grid.innerHTML = generateSkeletons(8);

    try {
        const data = await fetchDepartmentData();
        allStudents = (data.students || []).map(normalizeStudent);

        if (allStudents.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No student data available.</div>';
            return;
        }

        renderStudents();
        setupFilters();
        setupSearch();
        setupViewToggle();
    } catch (error) {
        console.error("Error loading student data:", error);
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-red-500">Failed to load student data. Please try again later.</div>';
    }

    function getFilteredStudents() {
        return allStudents.filter(s => {
            const matchesFilter = currentFilter === 'all' || s.yearToken === currentFilter || s.year === currentFilter;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q ||
                (s.name || '').toLowerCase().includes(q) ||
                (s.rollno || '').toLowerCase().includes(q) ||
                (s.registerNo || '').toLowerCase().includes(q) ||
                (s.email || '').toLowerCase().includes(q) ||
                (s.batch || '').toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
        });
    }

    function renderStudents() {
        const filtered = getFilteredStudents();

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-16">
                <i class="fa-solid fa-search text-4xl mb-4" style="color:#e2e8f0"></i>
                <p class="text-sm" style="color:#5b6478">No students found matching your criteria.</p>
            </div>`;
            return;
        }

        if (currentView === 'card') {
            renderCardView(filtered);
        } else {
            renderTableView(filtered);
        }
    }

    function renderCardView(students) {
        grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        grid.innerHTML = '';

        students.forEach((student, index) => {
            const yearColors = {
                'IV': { bg: 'linear-gradient(135deg,#1652c4,#2fe6dd)', badge: '#1652c4', text: '#fff' },
                'III': { bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', badge: '#7c3aed', text: '#fff' },
                'II': { bg: 'linear-gradient(135deg,#059669,#34d399)', badge: '#059669', text: '#fff' },
                'I': { bg: 'linear-gradient(135deg,#d97706,#fbbf24)', badge: '#d97706', text: '#fff' }
            };
            const colors = yearColors[student.yearToken] || yearColors['I'];
            const detailHref = `student-detail.html?id=${encodeURIComponent(student.id)}`;
            const yearLabel = getYearLabel(student);
            const registerNo = student.registerNo || student.rollno || '';
            const photoSrc = resolveAssetPath(student.photoUrl || student.image);
            const photoFallback = `<div class="w-16 h-16 rounded-full flex items-center justify-center" style="background:${colors.bg}"><i class="fa-solid fa-user-graduate text-white text-xl"></i></div>`;
            const batchHtml = student.batch
                ? `<span class="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono" style="background:rgba(0,0,0,.06);color:#5b6478">Batch ${escapeHtml(student.batch)}</span>`
                : '';
            const batchLine = student.batch
                ? `<p><i class="fa-solid fa-calendar w-4" style="color:#2fe6dd"></i> Batch ${escapeHtml(student.batch)}</p>`
                : '';
            const achievementPreview = student.achievement
                ? `<p class="achievement-text mt-3 text-xs" style="color:#5b6478">${escapeHtml(student.achievement)}</p>`
                : '';

            const photoHtml = photoSrc
                ? `<div class="relative w-16 h-16 rounded-full">${photoFallback}<img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(student.name)}" class="absolute inset-0 w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white bg-white" onerror="this.style.display='none'"></div>`
                : photoFallback;

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
                <div class="flex gap-2 pt-3 mt-3" style="border-top:1px solid #e2e8f0">
                  <a href="mailto:${escapeHtml(student.email)}" aria-label="Email" title="Email" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background='#1652c4';this.style.color='#fff'" onmouseout="this.style.background='#f0f4ff';this.style.color='#1652c4'"><i class="fa-solid fa-envelope"></i></a>
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
                            <td><a href="student-detail.html?id=${encodeURIComponent(s.id)}" class="text-xs hover:underline" style="color:#1652c4">View</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
    }

    function setupFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderStudents();
            });
        });
    }

    function setupSearch() {
        const searchInput = document.getElementById('student-search');
        if (!searchInput) return;
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = searchInput.value.trim();
                renderStudents();
            }, 250);
        });
    }

    function setupViewToggle() {
        const cardBtn = document.getElementById('view-card');
        const tableBtn = document.getElementById('view-table');
        if (!cardBtn || !tableBtn) return;

        cardBtn.addEventListener('click', () => {
            currentView = 'card';
            cardBtn.classList.add('active');
            tableBtn.classList.remove('active');
            renderStudents();
        });

        tableBtn.addEventListener('click', () => {
            currentView = 'table';
            tableBtn.classList.add('active');
            cardBtn.classList.remove('active');
            renderStudents();
        });
    }

    function normalizeStudent(student) {
        const registerNo = student.registerNo || student.rollno || '';
        const image = student.image || student.photoUrl || '';
        return Object.assign({}, student, {
            registerNo: registerNo,
            rollno: student.rollno || registerNo,
            image: image,
            photoUrl: student.photoUrl || image,
            batch: student.batch || getBatchFromRegisterNo(registerNo),
            yearToken: student.yearToken || getYearToken(student.year)
        });
    }

    function getYearToken(year) {
        const text = String(year || '').toUpperCase();
        if (text.includes('IV')) return 'IV';
        if (text.includes('III')) return 'III';
        if (text.includes('II')) return 'II';
        if (text.includes('I')) return 'I';
        return '';
    }

    function getYearLabel(student) {
        const year = String(student.year || student.yearToken || '').trim();
        if (!year) return 'Year';
        return year.toLowerCase().includes('year') ? year : `Year ${year}`;
    }

    function getBatchFromRegisterNo(registerNo) {
        const match = String(registerNo || '').match(/^(\d{2})/);
        return match ? '20' + match[1] : '';
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

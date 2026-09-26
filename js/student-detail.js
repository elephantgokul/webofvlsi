document.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById('student-detail-root');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const studentId = params.get('id');

    if (!studentId) {
        root.innerHTML = '<div class="surface-card rounded-2xl p-8 text-center text-red-500">Student ID is required in URL.</div>';
        return;
    }

    root.innerHTML = `
      <div class="surface-card rounded-2xl p-8 text-center">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl" style="color:#1652c4"></i>
        <p class="mt-4 text-sm" style="color:#5b6478">Loading Student Details...</p>
      </div>
    `;

    try {
        const data = await fetchDepartmentData();
        const students = (data.students || []).map(normalizeStudent);
        const qId = String(studentId).toLowerCase().trim();
        const student = students.find(s =>
            String(s.id).toLowerCase() === qId ||
            String(s.registerNo).toLowerCase() === qId ||
            String(s.rollno).toLowerCase() === qId ||
            String(s.universityNo || '').toLowerCase() === qId ||
            String(s.name).toLowerCase() === qId
        );

        if (!student) {
            root.innerHTML = '<div class="surface-card rounded-2xl p-8 text-center text-gray-500">Student not found.</div>';
            return;
        }

        renderStudent(student);
    } catch (error) {
        console.error("Error loading student detail:", error);
        root.innerHTML = '<div class="surface-card rounded-2xl p-8 text-center text-red-500">Failed to load student detail. Please try again later.</div>';
    }

    function renderStudent(student) {
        const yearColors = {
            'IV': { bg: 'linear-gradient(135deg,#1652c4,#2fe6dd)', badge: '#1652c4', text: '#fff' },
            'III': { bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', badge: '#7c3aed', text: '#fff' },
            'II': { bg: 'linear-gradient(135deg,#059669,#34d399)', badge: '#059669', text: '#fff' },
            'I': { bg: 'linear-gradient(135deg,#d97706,#fbbf24)', badge: '#d97706', text: '#fff' }
        };
        const colors = yearColors[student.yearToken] || yearColors['III'];
        const yearLabel = getYearLabel(student);
        const registerNo = student.registerNo || student.rollno || '';
        const rawPhoto = student.photoUrl || student.image;
        const photoSrc = typeof resolveSupabaseImageUrl === 'function'
            ? resolveSupabaseImageUrl(rawPhoto, (typeof SUPABASE_BUCKETS !== 'undefined' ? SUPABASE_BUCKETS.students : 'students'), rawPhoto)
            : resolveAssetPath(rawPhoto);

        const localFallback = typeof getLocalAssetFallback === 'function'
            ? getLocalAssetFallback(rawPhoto, 'students')
            : resolveAssetPath(rawPhoto);

        const photoFallback = `<div class="w-20 h-20 rounded-full flex items-center justify-center" style="background:${colors.bg}"><i class="fa-solid fa-user-graduate text-white text-2xl"></i></div>`;
        const photoHtml = photoSrc
            ? `<div class="relative w-20 h-20 rounded-full">${photoFallback}<img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(student.name)}" class="absolute inset-0 w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white bg-white" data-fallback="${escapeHtml(localFallback)}" onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){ this.src = this.dataset.fallback; } else { this.style.display='none'; }"></div>`
            : photoFallback;
        const linksHtml = renderLinks(student);
        const achievementHtml = renderAchievement(student);

        const univLine = student.universityNo
            ? `<p><i class="fa-solid fa-id-badge w-4" style="color:#2fe6dd"></i> Univ No: <span class="font-mono">${escapeHtml(student.universityNo)}</span></p>`
            : '';
        const progLine = student.programme
            ? `<p><i class="fa-solid fa-graduation-cap w-4" style="color:#2fe6dd"></i> ${escapeHtml(student.programme)}</p>`
            : '';

        root.innerHTML = `
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article class="surface-card rounded-2xl overflow-hidden" data-aos="fade-up">
              <div class="h-44 flex items-center justify-center relative" style="background:linear-gradient(145deg,#e8edf5,#d0daea)">
                ${photoHtml}
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-mono font-medium" style="background:${colors.badge};color:${colors.text}">${escapeHtml(yearLabel)}</span>
              </div>
              <div class="p-5">
                <h2 class="font-display font-semibold text-lg" style="color:#0b1b33">${escapeHtml(student.name)}</h2>
                <p class="text-xs mt-0.5 mb-4 font-mono font-semibold" style="color:#1652c4">Roll No: ${escapeHtml(registerNo)}</p>
                <div class="space-y-2 text-[0.8rem]" style="color:#5b6478">
                  ${univLine}
                  ${progLine}
                  <p><i class="fa-solid fa-envelope w-4" style="color:#2fe6dd"></i> <a href="mailto:${escapeHtml(student.email)}" class="hover:underline" style="color:#1652c4">${escapeHtml(student.email)}</a></p>
                  ${student.batch ? `<p><i class="fa-solid fa-calendar w-4" style="color:#2fe6dd"></i> Batch ${escapeHtml(student.batch)}</p>` : ''}
                </div>
                ${linksHtml ? `<div class="flex flex-wrap gap-2 pt-4 mt-4" style="border-top:1px solid #e2e8f0">${linksHtml}</div>` : ''}
              </div>
            </article>

            <article class="surface-card rounded-2xl p-6 lg:col-span-2 space-y-6" data-aos="fade-up" data-aos-delay="80">
              <div>
                <p class="text-xs font-mono uppercase tracking-widest font-semibold mb-2" style="color:#1652c4">ACHIEVEMENT</p>
                <h3 class="font-display font-bold text-lg md:text-xl" style="color:#0b1b33">${escapeHtml(student.achievementTitle || 'Technical Achievements & Training')}</h3>
              </div>
              
              <div class="text-sm leading-relaxed" style="color:#5b6478">
                ${achievementHtml}
              </div>

              ${student.projectsOverview ? `
              <div class="pt-6" style="border-top:1px solid #e2e8f0">
                <p class="text-xs font-mono uppercase tracking-widest font-semibold mb-2" style="color:#1652c4"><i class="fa-solid fa-microchip mr-1.5"></i>PROJECTS OVERVIEW</p>
                <div class="text-sm leading-relaxed" style="color:#5b6478">
                  ${formatContent(student.projectsOverview)}
                </div>
              </div>
              ` : ''}

              ${student.description ? `
              <div class="pt-6" style="border-top:1px solid #e2e8f0">
                <p class="text-xs font-mono uppercase tracking-widest font-semibold mb-2" style="color:#1652c4">DESCRIPTION & OBJECTIVES</p>
                <div class="text-sm leading-relaxed" style="color:#5b6478">
                  ${formatContent(student.description)}
                </div>
              </div>
              ` : ''}

              ${renderProjectScoring(student)}
            </article>
          </div>
        `;

        if (typeof AOS !== 'undefined') AOS.refreshHard();
    }

    function renderAchievement(student) {
        const achievement = String(student.achievement || '').trim();
        if (!achievement) {
            return '<p class="text-sm italic" style="color:#5b6478">No achievements listed yet.</p>';
        }
        return formatContent(achievement);
    }

    function formatContent(text) {
        const paragraphs = text.split(/\n\s*\n/);
        return paragraphs.map(p => {
            const lines = p.trim().split('\n');
            const isBulletGroup = lines.every(l => /^[-*•]|\s*-\s+/.test(l.trim()));
            
            if (isBulletGroup) {
                const items = lines.map(l => {
                    const clean = l.replace(/^[-*•\s]+/, '').trim();
                    return `<li class="flex items-start gap-2 mb-1.5"><span class="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style="background:#1652c4"></span><span>${escapeHtml(clean)}</span></li>`;
                }).join('');
                return `<ul class="space-y-1 mb-4 pl-1">${items}</ul>`;
            }

            // Mixed or regular paragraph with single lines
            const formattedLines = lines.map(l => {
                const trimmed = l.trim();
                if (/^[-*•]/.test(trimmed)) {
                    const clean = trimmed.replace(/^[-*•\s]+/, '').trim();
                    return `<div class="flex items-start gap-2 my-1 pl-2"><span class="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style="background:#1652c4"></span><span>${escapeHtml(clean)}</span></div>`;
                }
                return escapeHtml(trimmed);
            }).join('<br>');

            return `<p class="mb-4">${formattedLines}</p>`;
        }).join('');
    }

    function renderLinks(student) {
        const links = [];
        const githubHref = getExternalHref(student.github, 'github');
        const linkedinHref = getExternalHref(student.linkedin, 'linkedin');

        if (githubHref) {
            links.push(`<a href="${escapeHtml(githubHref)}" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background='#1652c4';this.style.color='#fff'" onmouseout="this.style.background='#f0f4ff';this.style.color='#1652c4'"><i class="fa-brands fa-github"></i></a>`);
        }

        if (linkedinHref) {
            links.push(`<a href="${escapeHtml(linkedinHref)}" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background='#1652c4';this.style.color='#fff'" onmouseout="this.style.background='#f0f4ff';this.style.color='#1652c4'"><i class="fa-brands fa-linkedin-in"></i></a>`);
        }

        return links.join('');
    }

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

    function escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }

    function renderProjectScoring(student) {
        if (typeof computeStudentScore !== 'function') return '';
        const scoring = computeStudentScore(student);
        if (!scoring.projects || scoring.projects.length === 0) {
            return '';
        }

        let projectCardsHtml = '';
        scoring.projects.forEach(function(proj) {
            const bonusHtml = proj.bonusDetails.map(function(b) {
                return `<span class="project-bonus-tag">+${b.points} ${escapeHtml(b.label)}</span>`;
            }).join('');

            projectCardsHtml += `
                <div class="project-detail-card">
                    <div class="project-detail-header">
                        <div>
                            <div class="project-detail-title">${escapeHtml(proj.title)}</div>
                            <span class="project-category-badge" style="background:${proj.categoryColor}15;color:${proj.categoryColor};border:1px solid ${proj.categoryColor}30;margin-top:4px">
                                <i class="fa-solid fa-microchip" style="font-size:0.55rem"></i> ${escapeHtml(proj.categoryLabel)}
                            </span>
                        </div>
                        <div class="project-detail-points">${proj.totalPoints} pts</div>
                    </div>
                    ${proj.description ? `<div class="project-detail-desc">${escapeHtml(proj.description)}</div>` : ''}
                    ${bonusHtml ? `<div class="project-bonus-tags">${bonusHtml}</div>` : ''}
                </div>
            `;
        });

        // Build achievement points summary
        let achievementSummary = '';
        if (scoring.achievementPoints > 0) {
            const counts = scoring.achievementCounts;
            const items = [];
            if (counts.internships) items.push(`Internships (${counts.internships}×5)`);
            if (counts.workshops) items.push(`Workshops (${counts.workshops}×3)`);
            if (counts.hackathons) items.push(`Hackathons (${counts.hackathons}×8)`);
            if (counts.certifications) items.push(`Certifications (${counts.certifications}×4)`);
            if (counts.papers) items.push(`Papers (${counts.papers}×10)`);
            if (counts.rankHolder) items.push('Rank Holder (+10)');
            if (counts.ncc) items.push('NCC (+5)');
            achievementSummary = `
                <div class="flex items-center justify-between text-xs" style="padding:0.5rem 0;color:var(--clr-text-secondary)">
                    <span><i class="fa-solid fa-trophy mr-1" style="color:#d97706"></i> Achievement Points: ${items.join(', ')}</span>
                    <span class="font-mono font-semibold" style="color:var(--clr-accent)">+${scoring.achievementPoints}</span>
                </div>
            `;
        }

        return `
            <div class="pt-6" style="border-top:1px solid #e2e8f0">
                <div class="flex items-center justify-between mb-4">
                    <p class="text-xs font-mono uppercase tracking-widest font-semibold" style="color:#1652c4">
                        <i class="fa-solid fa-star mr-1.5"></i>PROJECT SCORING
                    </p>
                    <span class="student-points-badge" style="font-size:0.75rem;padding:0.35rem 0.75rem">
                        <i class="fa-solid fa-star"></i> Total: ${scoring.totalPoints} pts
                    </span>
                </div>
                ${projectCardsHtml}
                <div style="margin-top:0.75rem;padding:0.75rem 1rem;background:linear-gradient(135deg, rgba(22,82,196,0.04), rgba(47,230,221,0.04));border-radius:0.75rem;border:1px solid rgba(22,82,196,0.1)">
                    <div class="flex items-center justify-between text-xs" style="color:var(--clr-text-secondary)">
                        <span><i class="fa-solid fa-microchip mr-1" style="color:var(--clr-accent)"></i> Project Points (${scoring.projectCount} projects)</span>
                        <span class="font-mono font-semibold" style="color:var(--clr-accent)">${scoring.totalProjectPoints}</span>
                    </div>
                    ${achievementSummary}
                    <div class="flex items-center justify-between text-sm font-semibold" style="padding-top:0.5rem;margin-top:0.5rem;border-top:1px solid rgba(22,82,196,0.1);color:var(--clr-text-primary)">
                        <span>Total Points</span>
                        <span class="font-mono" style="color:var(--clr-accent)">${scoring.totalPoints}</span>
                    </div>
                </div>
            </div>
        `;
    }
});
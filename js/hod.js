// js/hod.js - HOD profile renderer with Resilient Supabase loading & Detail Modal

document.addEventListener('DOMContentLoaded', async () => {
    const profileContainer = document.getElementById('hod-profile');
    if (!profileContainer) return;

    async function loadData() {
        profileContainer.innerHTML = `
            <div class="text-center py-16">
                <i class="fa-solid fa-circle-notch fa-spin text-3xl" style="color:#1652c4"></i>
                <p class="mt-4 text-sm font-medium text-slate-600">Loading HOD Profile...</p>
            </div>
        `;

        try {
            var data = null;
            if (typeof window.fetchDepartmentData === 'function') {
                data = await window.fetchDepartmentData();
            } else if (typeof fetchDepartmentData === 'function') {
                data = await fetchDepartmentData();
            }

            var hod = data ? data.hod : null;
            if (!hod && window.DEPT_FALLBACK_DATA) {
                hod = window.DEPT_FALLBACK_DATA.hod;
            }

            if (!hod) {
                profileContainer.innerHTML = '<div class="text-center py-12 text-slate-500">HOD profile data not available.</div>';
                return;
            }

            renderHODProfile(hod);
        } catch (error) {
            console.error('[HOD] Error loading HOD data:', error);
            if (typeof window.renderSupabaseError === 'function') {
                window.renderSupabaseError(profileContainer, 'Could not load HOD profile, please refresh', loadData);
            } else {
                profileContainer.innerHTML = `
                    <div class="text-center py-12">
                        <p class="text-red-500 font-semibold mb-3">Could not load HOD profile, please refresh</p>
                        <button type="button" class="retry-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white">Retry</button>
                    </div>
                `;
                var btn = profileContainer.querySelector('.retry-btn');
                if (btn) btn.addEventListener('click', loadData);
            }
        }
    }

    function renderHODProfile(hod) {
        const rawPhoto = hod.photoUrl || hod.image;
        var photoSrc = '';
        if (typeof resolveSupabaseImageUrl === 'function') {
            photoSrc = resolveSupabaseImageUrl(rawPhoto, 'faculty', rawPhoto);
        } else if (typeof resolveAssetPath === 'function') {
            photoSrc = resolveAssetPath(rawPhoto);
        } else {
            photoSrc = '../assets/images/faculty/' + String(rawPhoto).split('/').pop();
        }

        const localFallback = '../assets/images/faculty/' + String(rawPhoto).split('/').pop();

        const photoHtml = `
            <div class="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-600 shadow-md bg-white">
                <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(hod.name)}" class="w-full h-full object-cover" data-fallback="${escapeHtml(localFallback)}" onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){ this.src = this.dataset.fallback; } else { this.onerror=null; this.src='../assets/images/department_logo.png'; }">
            </div>
        `;

        const researchTags = (hod.researchInterests || []).map(tag =>
            `<span class="dept-modal-tag">${escapeHtml(tag)}</span>`
        ).join(' ');

        profileContainer.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Profile Card (Clickable to detail modal) -->
                <div class="lg:col-span-1" data-aos="fade-right">
                    <div id="hod-main-card" class="hod-profile-card surface-card rounded-2xl p-6 text-center interactive-detail-card focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" role="button" tabindex="0" aria-haspopup="dialog" aria-label="View full profile of ${escapeHtml(hod.name)}">
                        <div class="hod-photo-section">
                            ${photoHtml}
                        </div>
                        <div class="hod-info-section text-center">
                            <h2 class="font-display font-bold text-xl text-slate-900">${escapeHtml(hod.name)}</h2>
                            <p class="text-sm font-semibold mt-1 text-blue-600">${escapeHtml(hod.designation || 'Associate Professor & Head')}</p>
                            <p class="text-xs mt-1 text-slate-500">${escapeHtml(hod.qualification)}</p>

                            <div class="mt-6 pt-5 space-y-3 border-t border-slate-100">
                                ${hod.contact ? `<div class="flex items-center justify-center gap-2 text-xs text-slate-600">
                                    <i class="fa-solid fa-envelope text-blue-600"></i>
                                    <a href="mailto:${escapeHtml(hod.contact)}" onclick="event.stopPropagation();" class="hover:underline text-blue-600">${escapeHtml(hod.contact)}</a>
                                </div>` : ''}
                                ${hod.phone ? `<div class="flex items-center justify-center gap-2 text-xs text-slate-600">
                                    <i class="fa-solid fa-phone text-blue-600"></i>
                                    <span>${escapeHtml(hod.phone)}</span>
                                </div>` : ''}
                            </div>
                            
                            <div class="mt-5 pt-3 border-t border-slate-100">
                                <span class="view-details-hint"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Full Details</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Message & Details -->
                <div class="lg:col-span-2 space-y-8" data-aos="fade-left">
                    <!-- Message from HOD -->
                    <div class="surface-card rounded-2xl p-8">
                        <h3 class="font-display font-bold text-lg mb-5 flex items-center gap-2 text-slate-900">
                            <i class="fa-solid fa-quote-left text-blue-600"></i> Message from the HOD
                        </h3>
                        <blockquote class="dept-modal-quote">
                            <p style="color:#5b6478;line-height:1.85;font-size:.9rem;font-style:italic">${escapeHtml(hod.message)}</p>
                        </blockquote>
                    </div>

                    <!-- Research Interests -->
                    ${researchTags ? `
                    <div class="surface-card rounded-2xl p-8">
                        <h3 class="font-display font-bold text-lg mb-5 flex items-center gap-2 text-slate-900">
                            <i class="fa-solid fa-flask text-blue-600"></i> Research Interests
                        </h3>
                        <div class="flex flex-wrap gap-2">
                            ${researchTags}
                        </div>
                    </div>` : ''}

                    <!-- Quick Stats -->
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div class="surface-card rounded-xl p-5 text-center">
                            <p class="font-display font-bold text-2xl text-blue-600">10+</p>
                            <p class="text-xs font-mono mt-1 uppercase tracking-wider text-slate-500">Years Experience</p>
                        </div>
                        <div class="surface-card rounded-xl p-5 text-center">
                            <p class="font-display font-bold text-2xl text-blue-600">2024</p>
                            <p class="text-xs font-mono mt-1 uppercase tracking-wider text-slate-500">Established</p>
                        </div>
                        <div class="surface-card rounded-xl p-5 text-center col-span-2 md:col-span-1">
                            <p class="font-display font-bold text-2xl text-blue-600">C2S</p>
                            <p class="text-xs font-mono mt-1 uppercase tracking-wider text-slate-500">MeitY Initiatives</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Card modal activation
        const hodCard = document.getElementById('hod-main-card');
        if (hodCard) {
            function triggerHodModal() {
                if (window.DeptModal && typeof window.DeptModal.openHOD === 'function') {
                    window.DeptModal.openHOD(hod);
                }
            }
            hodCard.addEventListener('click', triggerHodModal);
            hodCard.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerHodModal();
                }
            });
        }

        if (typeof AOS !== 'undefined') {
            AOS.refreshHard();
        }
    }

    function escapeHtml(value) {
        return (value == null ? '' : String(value)).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    loadData();
});

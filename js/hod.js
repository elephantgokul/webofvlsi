document.addEventListener('DOMContentLoaded', function() {
    var profileContainer = document.getElementById('hod-profile');
    if (!profileContainer) return;

    profileContainer.innerHTML = '<div class="text-center py-10"><i class="fa-solid fa-circle-notch fa-spin text-3xl" style="color:#1652c4"></i><p class="mt-4 text-sm text-gray-500">Loading HOD Profile...</p></div>';

    fetch('../assets/data/hod.json')
        .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function(hod) {
            if (!hod) {
                profileContainer.innerHTML = '<div class="text-center py-10 text-gray-500">HOD profile data not available.</div>';
                return;
            }
            renderHODProfile(hod);
        })
        .catch(function(err) {
            console.error("Error loading HOD data:", err);
            profileContainer.innerHTML = '<div class="text-center py-10 text-red-500">Failed to load HOD profile.</div>';
        });

    function renderHODProfile(hod) {
        var photoHtml = hod.photoUrl
            ? '<img src="' + hod.photoUrl + '" alt="' + hod.name + '" class="w-40 h-40 rounded-full object-cover border-4 border-white/25 shadow-2xl">'
            : '<div class="hod-photo-placeholder"><i class="fa-solid fa-user text-white text-5xl"></i></div>';

        var researchTags = (hod.researchInterests || []).map(function(tag) {
            return '<span class="research-tag">' + tag + '</span>';
        }).join('');

        profileContainer.innerHTML = [
            '<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">',
                '<div class="lg:col-span-1" data-aos="fade-right">',
                    '<div class="hod-profile-card">',
                        '<div class="hod-photo-section">' + photoHtml + '</div>',
                        '<div class="hod-info-section text-center">',
                            '<h2 class="font-display font-bold text-xl" style="color:#0b1b33">' + hod.name + '</h2>',
                            '<p class="text-sm font-medium mt-1" style="color:#1652c4">' + (hod.designation || 'Head of Department') + '</p>',
                            '<p class="text-xs mt-1" style="color:#5b6478">' + hod.qualification + '</p>',
                            '<div class="mt-6 pt-5 space-y-3" style="border-top:1px solid #e2e8f0">',
                                (hod.contact ? '<div class="flex items-center justify-center gap-2 text-xs" style="color:#5b6478"><i class="fa-solid fa-envelope" style="color:#2fe6dd"></i><a href="mailto:' + hod.contact + '" class="hover:underline" style="color:#1652c4">' + hod.contact + '</a></div>' : ''),
                                (hod.phone ? '<div class="flex items-center justify-center gap-2 text-xs" style="color:#5b6478"><i class="fa-solid fa-phone" style="color:#2fe6dd"></i><span>' + hod.phone + '</span></div>' : ''),
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="lg:col-span-2 space-y-8" data-aos="fade-left">',
                    '<div class="surface-card rounded-2xl p-8">',
                        '<h3 class="font-display font-bold text-lg mb-5 flex items-center gap-2" style="color:#0b1b33"><i class="fa-solid fa-quote-left" style="color:#1652c4"></i> Message from the HOD</h3>',
                        '<blockquote style="border-left:3px solid #1652c4;padding-left:1.25rem;margin:0"><p style="color:#5b6478;line-height:1.85;font-size:.9rem;font-style:italic">' + hod.message + '</p></blockquote>',
                    '</div>',
                    (researchTags ? '<div class="surface-card rounded-2xl p-8"><h3 class="font-display font-bold text-lg mb-5 flex items-center gap-2" style="color:#0b1b33"><i class="fa-solid fa-flask" style="color:#1652c4"></i> Research Interests</h3><div class="flex flex-wrap gap-2">' + researchTags + '</div></div>' : ''),
                    '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">',
                        '<div class="surface-card rounded-xl p-5 text-center"><p class="font-display font-bold text-2xl" style="color:#1652c4">15+</p><p class="text-xs font-mono mt-1 uppercase tracking-wider" style="color:#5b6478">Years Experience</p></div>',
                        '<div class="surface-card rounded-xl p-5 text-center"><p class="font-display font-bold text-2xl" style="color:#1652c4">50+</p><p class="text-xs font-mono mt-1 uppercase tracking-wider" style="color:#5b6478">Publications</p></div>',
                        '<div class="surface-card rounded-xl p-5 text-center"><p class="font-display font-bold text-2xl" style="color:#1652c4">8+</p><p class="text-xs font-mono mt-1 uppercase tracking-wider" style="color:#5b6478">PhD Guided</p></div>',
                        '<div class="surface-card rounded-xl p-5 text-center"><p class="font-display font-bold text-2xl" style="color:#1652c4">5+</p><p class="text-xs font-mono mt-1 uppercase tracking-wider" style="color:#5b6478">Funded Projects</p></div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');

        if (typeof AOS !== 'undefined') AOS.refreshHard();
    }
});
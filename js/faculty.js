document.addEventListener('DOMContentLoaded', function() {
    var grid = document.getElementById('faculty-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="col-span-full text-center py-10"><i class="fa-solid fa-circle-notch fa-spin text-3xl" style="color:#1652c4"></i><p class="mt-4 text-sm text-gray-500">Loading Faculty Data...</p></div>';

    fetch('../assets/data/faculty.json')
        .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function(facultyList) {
            if (!facultyList || facultyList.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No faculty data available.</div>';
                return;
            }
            renderFaculty(facultyList);
            setupFilters();
        })
        .catch(function(err) {
            console.error("Error loading faculty data:", err);
            grid.innerHTML = '<div class="col-span-full text-center py-10 text-red-500">Failed to load faculty data.</div>';
        });

    function renderFaculty(facultyList) {
        grid.innerHTML = '';
        facultyList.forEach(function(fac, index) {
            var specCategory = 'all';
            var specLower = (fac.specialization || '').toLowerCase();
            if (specLower.indexOf('vlsi') !== -1) specCategory = 'vlsi';
            else if (specLower.indexOf('embedded') !== -1 || specLower.indexOf('arm') !== -1) specCategory = 'embedded';
            else if (specLower.indexOf('signal') !== -1 || specLower.indexOf('dsp') !== -1 || specLower.indexOf('image') !== -1) specCategory = 'signal';
            else if (specLower.indexOf('rf') !== -1 || specLower.indexOf('antenna') !== -1 || specLower.indexOf('communication') !== -1) specCategory = 'rf';
            else if (specLower.indexOf('iot') !== -1 || specLower.indexOf('network') !== -1 || specLower.indexOf('lora') !== -1) specCategory = 'iot';

            var isProf = fac.designation.toLowerCase().indexOf('professor') !== -1 && fac.designation.toLowerCase().indexOf('assistant') === -1 && fac.designation.toLowerCase().indexOf('associate') === -1;
            var isAssoc = fac.designation.toLowerCase().indexOf('associate') !== -1;

            var bgGradient = isProf ? 'linear-gradient(135deg,#1652c4,#2fe6dd)' : (isAssoc ? 'linear-gradient(135deg,#2d1652,#7eb6ff)' : 'linear-gradient(135deg,#166444,#2fe6a0)');
            var badgeBg = isProf ? '#1652c4' : (isAssoc ? '#7eb6ff' : '#2fe6a0');
            var badgeColor = isProf ? '#fff' : (isAssoc ? '#0b1b33' : '#0a3320');
            var outerBg = isProf ? 'linear-gradient(145deg,#e8edf5,#d0daea)' : (isAssoc ? 'linear-gradient(145deg,#edf0f5,#d8dae8)' : 'linear-gradient(145deg,#e8f5ee,#ceeada)');
            var photoSrc = resolveAssetPath(fac.photoUrl || fac.image);
            var photoFallback = '<div class="w-20 h-20 rounded-full flex items-center justify-center" style="background:' + bgGradient + '"><i class="fa-solid fa-user text-white text-3xl"></i></div>';
            var designationLabel = (fac.designation || '').replace('Assistant Professor', 'Asst. Prof').replace('Associate Professor', 'Assoc. Prof');
            var specialization = fac.specialization || '';

            var photoHtml = photoSrc
                ? '<div class="relative w-20 h-20 rounded-full">' + photoFallback + '<img src="' + escapeHtml(photoSrc) + '" alt="' + escapeHtml(fac.name) + '" loading="lazy" class="absolute inset-0 w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white bg-white" onerror="this.style.display=\'none\'"></div>'
                : photoFallback;

            var card = document.createElement('article');
            card.className = 'faculty-item faculty-card surface-card rounded-2xl overflow-hidden';
            card.dataset.spec = specCategory;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index % 4) * 60);

            var tagsHtml = specialization.split(',').map(function(s) {
                return '<span class="px-2 py-0.5 rounded-md text-[10px] font-mono" style="background:#f0f4ff;color:#1652c4">' + escapeHtml(s.trim()) + '</span>';
            }).join('');

            card.innerHTML = [
              '<div class="h-44 flex items-center justify-center relative" style="background:' + outerBg + '">',
                photoHtml,
                '<span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-mono font-medium" style="background:' + badgeBg + ';color:' + badgeColor + '">' + escapeHtml(designationLabel) + '</span>',
              '</div>',
              '<div class="p-5">',
                '<h3 class="font-display font-semibold text-sm" style="color:#0b1b33">' + escapeHtml(fac.name) + '</h3>',
                '<p class="text-xs mt-0.5 mb-3 font-medium" style="color:#1652c4">' + escapeHtml(fac.designation) + '</p>',
                '<div class="space-y-1.5 mb-4 text-[0.75rem]" style="color:#5b6478">',
                  '<p><i class="fa-solid fa-graduation-cap w-4" style="color:#2fe6dd"></i> ' + escapeHtml(fac.qualification) + '</p>',
                  '<p><i class="fa-solid fa-flask w-4" style="color:#2fe6dd"></i> ' + escapeHtml(specialization) + '</p>',
                '</div>',
                '<div class="flex flex-wrap gap-1.5 mb-4">' + tagsHtml + '</div>',
                '<div class="flex gap-2 pt-3" style="border-top:1px solid #e2e8f0">',
                  '<a href="mailto:' + escapeHtml(fac.email) + '" aria-label="Email" title="Email" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background=\'#1652c4\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'#f0f4ff\';this.style.color=\'#1652c4\'"><i class="fa-solid fa-envelope"></i></a>',
                  (fac.orcid ? '<a href="https://orcid.org/' + fac.orcid + '" target="_blank" aria-label="ORCID" title="ORCID" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background=\'#1652c4\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'#f0f4ff\';this.style.color=\'#1652c4\'"><i class="fa-brands fa-orcid"></i></a>' : ''),
                '</div>',
              '</div>'
            ].join('');
            grid.appendChild(card);
        });

        if (typeof AOS !== 'undefined') {
            AOS.refreshHard();
        }
    }

    function setupFilters() {
        var btns = document.querySelectorAll('.filter-btn');
        var items = document.querySelectorAll('.faculty-item');
        btns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                btns.forEach(function(b) {
                    b.classList.remove('active');
                    b.style.borderColor = '#e2e8f0';
                    b.style.color = '#5b6478';
                });
                btn.classList.add('active');
                var f = btn.dataset.filter;
                items.forEach(function(item) {
                    if (f === 'all' || item.dataset.spec === f) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    function resolveAssetPath(src) {
        var value = String(src || '');
        if (!value || /^(https?:|data:|\/|\.\.?\/)/i.test(value)) return value;
        return value.indexOf('assets/') === 0 ? '../' + value : value;
    }

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }
});
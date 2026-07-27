document.addEventListener('DOMContentLoaded', function() {
    var grid = document.getElementById('student-achievements-grid');
    if (!grid) return;

    fetch('../assets/data/students.json')
        .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function(students) {
            if (!students || students.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No student achievements yet.</div>';
                return;
            }
            grid.innerHTML = '';
            students.forEach(function(student, index) {
                var photoSrc = resolveAssetPath(student.image || student.photoUrl);
                var initial = (student.name || '?').charAt(0).toUpperCase();
                var photoHtml = photoSrc
                    ? '<img src="' + escapeHtml(photoSrc) + '" alt="' + escapeHtml(student.name) + '" loading="lazy" class="w-10 h-10 rounded-xl object-cover" onerror="this.style.display=\'none\'">'
                    : '<div class="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm" style="background:linear-gradient(135deg,#1652c4,#2fe6dd);color:#fff">' + initial + '</div>';

                var card = document.createElement('div');
                card.className = 'surface-card rounded-2xl p-7';
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-aos-delay', (index % 4) * 60);

                card.innerHTML = [
                  '<div class="flex items-center gap-3 mb-4">',
                    photoHtml,
                    '<div>',
                      '<h3 class="font-display font-semibold text-sm" style="color:#0b1b33">' + escapeHtml(student.name) + '</h3>',
                      '<span class="text-[10px] font-mono" style="color:#1652c4">' + escapeHtml(student.registerNo || '') + ' &middot; ' + escapeHtml(student.year || '') + '</span>',
                    '</div>',
                  '</div>',
                  '<p class="text-xs font-semibold mb-1" style="color:#0b1b33">' + escapeHtml(truncateText(student.achievement || '', 90)) + '</p>',
                  '<p class="text-xs" style="color:#5b6478;line-height:1.6">' + escapeHtml(truncateText(student.description || '', 150)) + '</p>',
                  '<div class="mt-3 flex items-center gap-3">',
                    '<a href="mailto:' + escapeHtml(student.email) + '" class="text-[10px] font-mono hover:underline" style="color:#1652c4"><i class="fa-solid fa-envelope mr-1"></i>' + escapeHtml(student.email) + '</a>',
                    (student.github ? '<a href="' + escapeHtml(getExternalHref(student.github, 'github')) + '" target="_blank" rel="noopener" class="text-[10px] font-mono hover:underline" style="color:#1652c4"><i class="fa-brands fa-github mr-1"></i>GitHub</a>' : ''),
                    (student.linkedin ? '<a href="' + escapeHtml(getExternalHref(student.linkedin, 'linkedin')) + '" target="_blank" rel="noopener" class="text-[10px] font-mono hover:underline" style="color:#1652c4"><i class="fa-brands fa-linkedin mr-1"></i>LinkedIn</a>' : ''),
                  '</div>',
                ].join('');
                grid.appendChild(card);
            });

            if (typeof AOS !== 'undefined') AOS.refreshHard();
        })
        .catch(function(err) {
            console.error('Error loading student achievements:', err);
            grid.innerHTML = '<div class="col-span-full text-center py-10 text-red-500">Failed to load achievements.</div>';
        });

    function resolveAssetPath(src) {
        var value = String(src || '');
        if (!value || /^(https?:|data:|\/|\.\.?\/)/i.test(value)) return value;
        return value.indexOf('assets/') === 0 ? '../' + value : value;
    }

    function getExternalHref(value, type) {
        var raw = String(value || '').trim();
        if (!raw) return '';
        if (/^https?:\/\//i.test(raw)) return raw.replace(/\s/g, '%20');
        if (/^www\./i.test(raw)) return 'https://' + raw.replace(/\s/g, '%20');
        if (/^(github|linkedin)\.com\//i.test(raw)) return 'https://' + raw.replace(/\s/g, '%20');
        if (type === 'github' && !/\s/.test(raw)) return 'https://github.com/' + encodeURIComponent(raw);
        if (type === 'linkedin') return 'https://www.linkedin.com/search/results/all/?keywords=' + encodeURIComponent(raw);
        return '';
    }

    function truncateText(text, maxLen) {
        if (!text || text.length <= maxLen) return text;
        return text.substring(0, maxLen) + '...';
    }

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }
});
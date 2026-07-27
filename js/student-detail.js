document.addEventListener('DOMContentLoaded', function() {
    var root = document.getElementById('student-detail-root');
    if (!root) return;

    root.innerHTML = '<div class="text-center py-10"><i class="fa-solid fa-circle-notch fa-spin text-3xl" style="color:#1652c4"></i><p class="mt-4 text-sm text-gray-500">Loading Student Data...</p></div>';

    var id = new URLSearchParams(window.location.search).get('id');

    fetch('../assets/data/students.json')
        .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function(data) {
            var students = (data || []).map(normalizeStudent);
            var student = null;
            for (var i = 0; i < students.length; i++) {
                if (String(students[i].id) === String(id)) {
                    student = students[i];
                    break;
                }
            }

            if (!student) {
                root.innerHTML = [
                  '<div class="surface-card rounded-2xl p-8 text-center">',
                    '<i class="fa-solid fa-user-slash text-3xl mb-4" style="color:#e2e8f0"></i>',
                    '<h2 class="font-display font-semibold text-lg" style="color:#0b1b33">Student not found</h2>',
                    '<p class="mt-2 text-sm" style="color:#5b6478">No student record matches the selected detail link.</p>',
                    '<a href="students.html" class="inline-flex mt-5 btn-primary text-sm font-semibold text-white px-4 py-2 rounded-xl">Back to Students</a>',
                  '</div>'
                ].join('');
                return;
            }

            renderStudent(student);
        })
        .catch(function(err) {
            console.error("Error loading student detail:", err);
            root.innerHTML = '<div class="surface-card rounded-2xl p-8 text-center text-red-500">Failed to load student detail.</div>';
        });

    function renderStudent(student) {
        var yearColors = {
            'IV': { bg: 'linear-gradient(135deg,#1652c4,#2fe6dd)', badge: '#1652c4', text: '#fff' },
            'III': { bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)', badge: '#7c3aed', text: '#fff' },
            'II': { bg: 'linear-gradient(135deg,#059669,#34d399)', badge: '#059669', text: '#fff' },
            'I': { bg: 'linear-gradient(135deg,#d97706,#fbbf24)', badge: '#d97706', text: '#fff' }
        };
        var colors = yearColors[student.yearToken] || yearColors['I'];
        var yearLabel = getYearLabel(student);
        var registerNo = student.registerNo || student.rollno || '';
        var photoSrc = resolveAssetPath(student.photoUrl || student.image);
        var photoFallback = '<div class="w-20 h-20 rounded-full flex items-center justify-center" style="background:' + colors.bg + '"><i class="fa-solid fa-user-graduate text-white text-2xl"></i></div>';
        var photoHtml = photoSrc
            ? '<div class="relative w-20 h-20 rounded-full">' + photoFallback + '<img src="' + escapeHtml(photoSrc) + '" alt="' + escapeHtml(student.name) + '" loading="lazy" class="absolute inset-0 w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white bg-white" onerror="this.style.display=\'none\'"></div>'
            : photoFallback;
        var linksHtml = renderLinks(student);
        var achievementHtml = renderAchievement(student);

        root.innerHTML = [
          '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">',
            '<article class="surface-card rounded-2xl overflow-hidden" data-aos="fade-up">',
              '<div class="h-44 flex items-center justify-center relative" style="background:linear-gradient(145deg,#e8edf5,#d0daea)">',
                photoHtml,
                '<span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-mono font-medium" style="background:' + colors.badge + ';color:' + colors.text + '">' + escapeHtml(yearLabel) + '</span>',
              '</div>',
              '<div class="p-5">',
                '<h2 class="font-display font-semibold text-lg" style="color:#0b1b33">' + escapeHtml(student.name) + '</h2>',
                '<p class="text-xs mt-0.5 mb-4 font-mono" style="color:#1652c4">' + escapeHtml(registerNo) + '</p>',
                '<div class="space-y-2 text-[0.8rem]" style="color:#5b6478">',
                  '<p><i class="fa-solid fa-envelope w-4" style="color:#2fe6dd"></i> <a href="mailto:' + escapeHtml(student.email) + '" class="hover:underline" style="color:#1652c4">' + escapeHtml(student.email) + '</a></p>',
                  (student.batch ? '<p><i class="fa-solid fa-calendar w-4" style="color:#2fe6dd"></i> Batch ' + escapeHtml(student.batch) + '</p>' : ''),
                '</div>',
                (linksHtml ? '<div class="flex flex-wrap gap-2 pt-4 mt-4" style="border-top:1px solid #e2e8f0">' + linksHtml + '</div>' : ''),
              '</div>',
            '</article>',
            '<article class="surface-card rounded-2xl p-5 lg:col-span-2" data-aos="fade-up" data-aos-delay="80">',
              '<p class="text-xs font-mono uppercase tracking-widest mb-3" style="color:#5b6478">Achievement</p>',
              achievementHtml,
            '</article>',
          '</div>'
        ].join('');

        if (typeof AOS !== 'undefined') AOS.refreshHard();
    }

    function renderAchievement(student) {
        var achievement = String(student.achievement || '').trim();
        var description = String(student.description || '').trim();

        if (!achievement) {
            return '<p class="text-sm" style="color:#5b6478">No achievements yet</p>';
        }

        var html = '<div class="space-y-5"><div><h3 class="font-display font-semibold text-lg" style="color:#0b1b33">Achievement Title</h3><p class="mt-3 text-sm leading-relaxed whitespace-pre-line" style="color:#5b6478">' + formatMultiline(achievement) + '</p></div>';
        if (description) {
            html += '<div style="border-top:1px solid #e2e8f0" class="pt-5"><h3 class="font-display font-semibold text-sm" style="color:#0b1b33">Description</h3><p class="mt-2 text-sm leading-relaxed" style="color:#5b6478">' + escapeHtml(description) + '</p></div>';
        }
        html += '</div>';
        return html;
    }

    function renderLinks(student) {
        var links = [];
        var githubHref = getExternalHref(student.github, 'github');
        var linkedinHref = getExternalHref(student.linkedin, 'linkedin');

        if (githubHref) {
            links.push('<a href="' + escapeHtml(githubHref) + '" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background=\'#1652c4\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'#f0f4ff\';this.style.color=\'#1652c4\'"><i class="fa-brands fa-github"></i></a>');
        }
        if (linkedinHref) {
            links.push('<a href="' + escapeHtml(linkedinHref) + '" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background=\'#1652c4\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'#f0f4ff\';this.style.color=\'#1652c4\'"><i class="fa-brands fa-linkedin-in"></i></a>');
        }
        return links.join('');
    }

    function normalizeStudent(student) {
        var registerNo = student.registerNo || student.rollno || '';
        var image = student.image || student.photoUrl || '';
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
        var text = String(year || '').toUpperCase();
        if (text.indexOf('IV') !== -1) return 'IV';
        if (text.indexOf('III') !== -1) return 'III';
        if (text.indexOf('II') !== -1) return 'II';
        if (text.indexOf('I') !== -1) return 'I';
        return '';
    }

    function getYearLabel(student) {
        var year = String(student.year || student.yearToken || '').trim();
        if (!year) return 'Year';
        return year.toLowerCase().indexOf('year') !== -1 ? year : 'Year ' + year;
    }

    function getBatchFromRegisterNo(registerNo) {
        var match = String(registerNo || '').match(/^(\d{2})/);
        return match ? '20' + match[1] : '';
    }

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

    function formatMultiline(value) {
        return escapeHtml(value).replace(/\n/g, '<br>');
    }

    function escapeHtml(value) {
        var div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('faculty-grid');
    if (!grid) return;

    // Show loading skeleton or spinner
    grid.innerHTML = '<div class="col-span-full text-center py-10"><i class="fa-solid fa-circle-notch fa-spin text-3xl" style="color:#1652c4"></i><p class="mt-4 text-sm text-gray-500">Loading Faculty Data...</p></div>';

    try {
        const data = await fetchDepartmentData();
        const facultyList = data.faculty || [];

        if (facultyList.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No faculty data available.</div>';
            return;
        }

        renderFaculty(facultyList);
        setupFilters();
    } catch (error) {
        console.error("Error loading faculty data:", error);
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-red-500">Failed to load faculty data. Please try again later.</div>';
    }

    function renderFaculty(facultyList) {
        grid.innerHTML = '';
        facultyList.forEach((fac, index) => {
            // Determine filter category based on specialization
            let specCategory = 'all';
            const specLower = (fac.specialization || '').toLowerCase();
            if (specLower.includes('vlsi')) specCategory = 'vlsi';
            else if (specLower.includes('embedded') || specLower.includes('arm')) specCategory = 'embedded';
            else if (specLower.includes('signal') || specLower.includes('dsp') || specLower.includes('image')) specCategory = 'signal';
            else if (specLower.includes('rf') || specLower.includes('antenna') || specLower.includes('communication')) specCategory = 'rf';
            else if (specLower.includes('iot') || specLower.includes('network') || specLower.includes('lora')) specCategory = 'iot';
            
            // Map designations to colors
            const isProf = fac.designation.toLowerCase().includes('professor') && !fac.designation.toLowerCase().includes('assistant') && !fac.designation.toLowerCase().includes('associate');
            const isAssoc = fac.designation.toLowerCase().includes('associate');
            
            let bgGradient = isProf ? 'linear-gradient(135deg,#1652c4,#2fe6dd)' : (isAssoc ? 'linear-gradient(135deg,#2d1652,#7eb6ff)' : 'linear-gradient(135deg,#166444,#2fe6a0)');
            let badgeBg = isProf ? '#1652c4' : (isAssoc ? '#7eb6ff' : '#2fe6a0');
            let badgeColor = isProf ? '#fff' : (isAssoc ? '#0b1b33' : '#0a3320');
            let outerBg = isProf ? 'linear-gradient(145deg,#e8edf5,#d0daea)' : (isAssoc ? 'linear-gradient(145deg,#edf0f5,#d8dae8)' : 'linear-gradient(145deg,#e8f5ee,#ceeada)');

            const photoHtml = fac.photoUrl 
                ? `<img src="${fac.photoUrl}" alt="${fac.name}" class="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white">`
                : `<div class="w-20 h-20 rounded-full flex items-center justify-center" style="background:${bgGradient}"><i class="fa-solid fa-user text-white text-3xl"></i></div>`;

            const card = document.createElement('article');
            card.className = 'faculty-item faculty-card surface-card rounded-2xl overflow-hidden';
            card.dataset.spec = specCategory;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index % 4) * 60);

            card.innerHTML = `
              <div class="h-44 flex items-center justify-center relative" style="background:${outerBg}">
                ${photoHtml}
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-mono font-medium" style="background:${badgeBg};color:${badgeColor}">${fac.designation.replace('Assistant Professor', 'Asst. Prof').replace('Associate Professor', 'Assoc. Prof')}</span>
              </div>
              <div class="p-5">
                <h3 class="font-display font-semibold text-sm" style="color:#0b1b33">${fac.name}</h3>
                <p class="text-xs mt-0.5 mb-3 font-medium" style="color:#1652c4">${fac.designation}</p>
                <div class="space-y-1.5 mb-4 text-[0.75rem]" style="color:#5b6478">
                  <p><i class="fa-solid fa-graduation-cap w-4" style="color:#2fe6dd"></i> ${fac.qualification}</p>
                  <p><i class="fa-solid fa-flask w-4" style="color:#2fe6dd"></i> ${fac.specialization}</p>
                </div>
                <div class="flex flex-wrap gap-1.5 mb-4">
                    ${fac.specialization.split(',').map(s => `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono" style="background:#f0f4ff;color:#1652c4">${s.trim()}</span>`).join('')}
                </div>
                <div class="flex gap-2 pt-3" style="border-top:1px solid #e2e8f0">
                  <a href="mailto:${fac.email}" aria-label="Email" title="Email" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background='#1652c4';this.style.color='#fff'" onmouseout="this.style.background='#f0f4ff';this.style.color='#1652c4'"><i class="fa-solid fa-envelope"></i></a>
                  ${fac.orcid ? `<a href="https://orcid.org/${fac.orcid}" target="_blank" aria-label="ORCID" title="ORCID" class="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all" style="background:#f0f4ff;color:#1652c4" onmouseover="this.style.background='#1652c4';this.style.color='#fff'" onmouseout="this.style.background='#f0f4ff';this.style.color='#1652c4'"><i class="fa-brands fa-orcid"></i></a>` : ''}
                </div>
              </div>
            `;
            grid.appendChild(card);
        });
        
        // Re-init AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refreshHard();
        }
    }

    function setupFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.faculty-item');
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => { 
                    b.classList.remove('active'); 
                    b.style.borderColor='#e2e8f0'; 
                    b.style.color='#5b6478'; 
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
});

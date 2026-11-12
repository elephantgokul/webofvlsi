// js/supabaseClient.js - Centralized Supabase Client & Query Layer for SIET VLSI Website
// Safe, resilient, single-source-of-truth with clean fallback and deduplication.

(function (window) {
  'use strict';

  var SUPABASE_URL = "https://jwtynencyqwiybsspiih.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_kAvMvNusvtNF0W0VZe9Uhw_h15G05As";
  var PUBLIC_STUDENT_FIELDS = 'id,name,programme,year,batch,achievementTitle,achievement,description,projectsOverview,image,photoUrl,linkedin,github';

  var client = null;

  function initClient() {
    if (client) return client;
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = client;
      } catch (err) {
        console.error('[SupabaseClient] Initialization error:', err.message || err);
      }
    }
    return client;
  }

  function getClient() {
    return client || initClient();
  }

  // Deduplicate array of objects by a primary key or key function
  function deduplicate(list, keyFn) {
    if (!Array.isArray(list)) return [];
    var seen = new Set();
    var result = [];
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (!item) continue;
      var key = String(keyFn(item)).trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      result.push(item);
    }
    return result;
  }

  /**
   * Safe fetch for department data (public_students, faculty, hod)
   * Wraps queries in try/catch, logs failures, and returns authoritative fallback on error.
   */
  async function fetchDepartmentData() {
    var fallback = (window.DEPT_FALLBACK_DATA && window.DEPT_FALLBACK_DATA.faculty)
      ? window.DEPT_FALLBACK_DATA
      : (typeof getFallbackData === 'function' ? getFallbackData() : null);

    var currentClient = getClient();
    if (!currentClient) {
      console.warn('[SupabaseClient] Supabase SDK not initialized. Using local fallback.');
      return fallback;
    }

    try {
      var promises = [
        currentClient.from('public_students').select(PUBLIC_STUDENT_FIELDS).then(function (res) {
          if (res.error) console.error('[SupabaseClient] Error querying "public_students":', res.error.message);
          return res;
        }),
        currentClient.from('faculty').select('*').then(function (res) {
          if (res.error) console.error('[SupabaseClient] Error querying "faculty":', res.error.message);
          return res;
        }),
        currentClient.from('hod').select('*').then(function (res) {
          if (res.error) console.error('[SupabaseClient] Error querying "hod":', res.error.message);
          return res;
        })
      ];

      var results = await Promise.all(promises);
      var studentsRes = results[0];
      var facultyRes = results[1];
      var hodRes = results[2];

      var students = [];
      if (!studentsRes.error && Array.isArray(studentsRes.data) && studentsRes.data.length > 0) {
        students = studentsRes.data;
      } else if (fallback && Array.isArray(fallback.students)) {
        students = fallback.students;
      }

      var faculty = [];
      if (!facultyRes.error && Array.isArray(facultyRes.data) && facultyRes.data.length > 0) {
        // Deduplicate faculty from DB by name or email
        var dbFaculty = deduplicate(facultyRes.data, function (f) {
          return (f.name || f.email || '').toLowerCase().trim();
        });

        // Ensure all 5 standard faculty members are present
        if (fallback && Array.isArray(fallback.faculty)) {
          var existingNames = new Set(dbFaculty.map(function (f) {
            return (f.name || '').toLowerCase().trim();
          }));

          fallback.faculty.forEach(function (fallbackMember) {
            var normName = (fallbackMember.name || '').toLowerCase().trim();
            if (!existingNames.has(normName)) {
              dbFaculty.push(fallbackMember);
              existingNames.add(normName);
            }
          });
        }
        faculty = dbFaculty;
      } else if (fallback && Array.isArray(fallback.faculty)) {
        faculty = fallback.faculty;
      }

      var hod = null;
      if (!hodRes.error && Array.isArray(hodRes.data) && hodRes.data.length > 0) {
        hod = hodRes.data[0];
      } else if (fallback) {
        hod = fallback.hod;
      }

      return {
        students: students,
        faculty: faculty,
        hod: hod
      };
    } catch (err) {
      console.error('[SupabaseClient] Exception during fetchDepartmentData:', err.message || err);
      return fallback;
    }
  }

  // Helper to render friendly error banner with retry button
  function renderErrorState(container, message, onRetry) {
    if (!container) return;
    container.innerHTML = `
      <div class="col-span-full text-center py-12 px-4">
        <div class="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl mb-3">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <p class="text-slate-800 font-semibold text-base mb-1">${message || 'Could not load data, please refresh'}</p>
        <p class="text-slate-500 text-xs mb-4">Please check your connection and try again.</p>
        <button type="button" class="retry-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <i class="fa-solid fa-rotate-right"></i> Retry
        </button>
      </div>
    `;
    var retryBtn = container.querySelector('.retry-btn');
    if (retryBtn && typeof onRetry === 'function') {
      retryBtn.addEventListener('click', onRetry);
    }
  }

  // Export to window
  window.initSupabaseClient = initClient;
  window.getSupabaseClient = getClient;
  window.supabaseClient = initClient();
  window.fetchDepartmentData = fetchDepartmentData;
  window.renderSupabaseError = renderErrorState;
  window.deduplicateEntities = deduplicate;

})(typeof window !== 'undefined' ? window : this);

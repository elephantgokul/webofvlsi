// js/events-manager.js — Supabase-backed Event Management System
// Department of VLSI Design and Technology, SIET
// Vanilla JS — loaded via plain <script> tag

(function (window) {
  'use strict';

  /* =========================================================================
     1. EVENT DATA LAYER — Fetch events from Supabase
     ========================================================================= */

  /**
   * Fetch published events.
   * Merges Supabase 'events' (if configured/available) with the static EVENTS_DATA dataset,
   * deduplicating by normalized title and event date.
   * @param {Object} [options] - { status: 'published', upcoming: true/false }
   * @returns {Promise<Array>}
   */
  async function fetchEvents(options) {
    var opts = options || {};
    var client = window.supabaseClient;
    var supabaseEvents = [];

    // 1. Try Supabase first
    if (client && typeof window.isSupabaseConfigured === 'function' && window.isSupabaseConfigured()) {
      try {
        var query = client.from('events').select('*');

        // By default, only show published events on public pages
        if (opts.status !== 'all') {
          query = query.eq('status', 'published');
        }

        query = query.order('event_date', { ascending: true });

        var result = await query;
        if (result.error) {
          console.warn('[Events] Supabase query error:', result.error.message);
        } else if (result.data && result.data.length > 0) {
          supabaseEvents = (result.data || []).map(normalizeSupabaseEvent);

          if (opts.upcoming === true) {
            var now = new Date();
            now.setHours(0, 0, 0, 0);
            supabaseEvents = supabaseEvents.filter(function (e) {
              return new Date(e.event_date) >= now;
            });
          } else if (opts.upcoming === false) {
            var now2 = new Date();
            now2.setHours(0, 0, 0, 0);
            supabaseEvents = supabaseEvents.filter(function (e) {
              return new Date(e.event_date) < now2;
            });
          }
        }
      } catch (err) {
        console.warn('[Events] Supabase fetch failed, using fallback data:', err);
      }
    }

    // 2. Fetch static events
    var staticEvents = getFallbackEvents(opts);

    // 3. Merge both if Supabase events exist, deduplicating by title + date (Supabase takes precedence)
    if (supabaseEvents.length > 0) {
      return mergeAndDedupeEvents(supabaseEvents, staticEvents, opts);
    }

    return staticEvents;
  }

  /**
   * Merge primary (Supabase) and secondary (static) events, deduplicating by title + date
   */
  function mergeAndDedupeEvents(primary, secondary, opts) {
    var seen = new Set();
    var merged = [];

    function makeKey(e) {
      var normTitle = (e.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      var normDate = (e.event_date || e.dateLabel || '').trim();
      return normTitle + '|' + normDate;
    }

    (primary || []).forEach(function (e) {
      var key = makeKey(e);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(e);
      }
    });

    (secondary || []).forEach(function (e) {
      var key = makeKey(e);
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(e);
      }
    });

    // Sort accordingly
    if (opts && opts.upcoming === true) {
      merged.sort(function (a, b) {
        return new Date(a.event_date) - new Date(b.event_date);
      });
    } else if (opts && opts.upcoming === false) {
      var dated = merged.filter(function (e) { return e.has_exact_date !== false; });
      var undated = merged.filter(function (e) { return e.has_exact_date === false; });
      dated.sort(function (a, b) {
        return new Date(b.event_date) - new Date(a.event_date);
      });
      merged = dated.concat(undated);
    }

    return merged;
  }

  /**
   * Fetch a single event by ID
   */
  async function fetchEventById(id) {
    var client = window.supabaseClient;
    if (client && typeof window.isSupabaseConfigured === 'function' && window.isSupabaseConfigured()) {
      try {
        var result = await client.from('events').select('*').eq('id', id).single();
        if (result.error) throw result.error;
        return normalizeSupabaseEvent(result.data);
      } catch (err) {
        console.warn('[Events] Failed to fetch event by ID:', err);
        return null;
      }
    }
    return null;
  }

  /**
   * Normalize a Supabase event row into a consistent format
   */
  function normalizeSupabaseEvent(row) {
    if (!row) return null;
    var eventDate = new Date(row.event_date);
    var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    return {
      id: row.id,
      title: row.title || '',
      category: row.category || 'event',
      event_date: row.event_date,
      event_time: row.event_time || '',
      end_date: row.end_date || null,
      venue: row.venue || '',
      description: row.description || '',
      poster_url: row.poster_url || '',
      registration_url: row.registration_url || '',
      registration_deadline: row.registration_deadline || null,
      status: row.status || 'draft',
      created_at: row.created_at,
      updated_at: row.updated_at,
      // Formatted fields for display
      day: String(eventDate.getDate()).padStart(2, '0'),
      month: months[eventDate.getMonth()],
      year: String(eventDate.getFullYear()),
      // Legacy compat fields
      cat: row.category || 'event',
      desc: row.description || '',
      time: row.event_time || '',
      reg: !!(row.registration_url && row.registration_url.trim()),
      link: row.registration_url || '#'
    };
  }

  /**
   * Fallback hardcoded events using unified EVENTS_DATA
   */
  function getFallbackEvents(opts) {
    var source = (typeof window !== 'undefined' && Array.isArray(window.EVENTS_DATA))
      ? window.EVENTS_DATA
      : [];

    var now = new Date();
    now.setHours(0, 0, 0, 0);

    if (opts && opts.upcoming === true) {
      return source.filter(function (e) {
        if (e.has_exact_date === false) return false;
        return new Date(e.event_date) >= now;
      }).sort(function (a, b) {
        return new Date(a.event_date) - new Date(b.event_date);
      });
    } else if (opts && opts.upcoming === false) {
      var dated = source.filter(function (e) {
        if (e.has_exact_date === false) return false;
        return new Date(e.event_date) < now;
      });
      var undated = source.filter(function (e) {
        return e.has_exact_date === false;
      });

      // Sort dated events: newest first
      dated.sort(function (a, b) {
        return new Date(b.event_date) - new Date(a.event_date);
      });

      // Undated events ("Date: 2026") placed at the end
      return dated.concat(undated);
    }

    return source;
  }

  /* =========================================================================
     2. CATEGORY STYLING
     ========================================================================= */

  var CATEGORY_COLORS = {
    symposium: '#1652c4',
    talk: '#0b6e8c',
    workshop: '#166444',
    competition: '#8c4516',
    cultural: '#c41652',
    alumni: '#6416c4',
    hackathon: '#ea580c',
    academic: '#7c3aed',
    lecture: '#059669',
    career: '#d97706',
    event: '#1652c4'
  };

  var CATEGORY_ICONS = {
    symposium: 'fa-calendar-days',
    talk: 'fa-chalkboard-user',
    workshop: 'fa-screwdriver-wrench',
    competition: 'fa-code',
    cultural: 'fa-music',
    alumni: 'fa-user-group',
    hackathon: 'fa-code',
    academic: 'fa-graduation-cap',
    lecture: 'fa-chalkboard-user',
    career: 'fa-briefcase',
    event: 'fa-calendar-days'
  };

  function getCategoryColor(cat) {
    return CATEGORY_COLORS[cat] || '#1652c4';
  }

  function getCategoryIcon(cat) {
    return CATEGORY_ICONS[cat] || 'fa-calendar-days';
  }

  /* =========================================================================
     3. EVENT CARD RENDERER
     ========================================================================= */

  function renderEventCard(ev, index) {
    var c = getCategoryColor(ev.cat || ev.category);
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var eventDate = new Date(ev.event_date);
    var isPast = ev.has_exact_date === false || eventDate < now;
    var descText = ev.desc || ev.description || '';
    if (descText.length > 180) {
      descText = descText.substring(0, 175) + '…';
    }

    var regButton = '';
    var registrationHref = safeHttpUrl(ev.registration_url);
    if (ev.reg && registrationHref) {
      regButton = '<a href="' + escapeHtml(registrationHref) + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-semibold text-white rounded-lg px-3 py-1.5 transition-all" style="background:' + c + '" onmouseover="this.style.opacity=\'.85\'" onmouseout="this.style.opacity=\'1\'"><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>Register Now</a>';
    } else if (ev.reg) {
      regButton = '<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-white rounded-lg px-3 py-1.5" style="background:' + c + '"><i class="fa-solid fa-registered text-[10px]"></i>Registration link unavailable</span>';
    } else {
      regButton = '<span class="inline-flex items-center gap-1.5 text-xs font-mono rounded-lg px-3 py-1.5" style="background:#f4f7fb;color:#64748b">' + (isPast ? 'Completed' : 'Free Entry') + '</span>';
    }

    var typeBadge = '';
    if (ev.event_type === 'Conducted by Department') {
      typeBadge = '<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1" style="background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd"><i class="fa-solid fa-building-columns text-[9px]"></i>Conducted by Department</span>';
    } else if (ev.event_type === 'Participated') {
      typeBadge = '<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1" style="background:#fef3c7;color:#92400e;border:1px solid #fde68a"><i class="fa-solid fa-users-viewfinder text-[9px]"></i>Participated</span>';
    }

    var dateBoxHtml = '';
    if (ev.has_exact_date === false) {
      dateBoxHtml = [
        '<div class="flex flex-col items-center justify-center px-4 py-6 flex-shrink-0 text-center" style="background:' + c + ';min-width:5.5rem">',
        '<span class="font-display font-bold text-white text-xl leading-none">2026</span>',
        '<span class="font-mono text-white text-[10px] mt-1 opacity-80 uppercase tracking-wider">Date: 2026</span>',
        '</div>'
      ].join('');
    } else {
      dateBoxHtml = [
        '<div class="flex flex-col items-center justify-center px-5 py-6 flex-shrink-0" style="background:' + c + ';min-width:5.5rem">',
        '<span class="font-display font-bold text-white text-3xl leading-none">' + escapeHtml(ev.day) + '</span>',
        '<span class="font-mono text-white text-xs mt-1 opacity-75">' + escapeHtml(ev.month) + '</span>',
        '<span class="font-mono text-white text-xs opacity-50">' + escapeHtml(ev.year) + '</span>',
        '</div>'
      ].join('');
    }

    var posterHtml = '';
    var posterSrc = safeHttpUrl(ev.poster_url, true);
    if (posterSrc) {
      posterHtml = '<div class="mb-3 rounded-xl overflow-hidden border border-slate-100" style="max-height:160px">' +
        '<img src="' + escapeHtml(posterSrc) + '" alt="' + escapeHtml(ev.title) + ' poster" class="w-full object-cover" style="max-height:160px" onerror="this.parentNode.style.display=\'none\'">' +
        '</div>';
    }

    var dateLabelHtml = ev.dateLabel
      ? '<span><i class="fa-solid fa-calendar mr-1" style="color:#1652c4"></i>' + escapeHtml(ev.dateLabel) + '</span>'
      : '';

    var detailsButton = '';
    if (ev.id) {
      detailsButton = '<a href="event-detail.html?id=' + encodeURIComponent(ev.id) + '" class="text-xs font-semibold hover:underline inline-flex items-center gap-1" style="color:#1652c4">Details <i class="fa-solid fa-arrow-right text-[10px]"></i></a>';
    }

    return [
      '<article class="ev-card surface-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-100 shadow-sm" data-aos="fade-up" data-aos-delay="' + ((index || 0) % 3 * 70) + '">',
      '<div class="flex items-stretch flex-1">',
      dateBoxHtml,
      '<div class="p-5 flex-1 min-w-0 flex flex-col justify-between">',
      '<div>',
      '<div class="flex flex-wrap items-center gap-2 mb-2">',
      '<span class="cat-dot" style="background:' + c + '"></span>',
      '<span class="text-[10px] font-mono uppercase tracking-wide font-semibold" style="color:' + c + '">' + escapeHtml(ev.cat || ev.category) + '</span>',
      typeBadge,
      '</div>',
      '<h3 class="font-display font-semibold text-sm leading-snug mb-2" style="color:#0b1b33">' + escapeHtml(ev.title) + '</h3>',
      posterHtml,
      '<p class="text-xs leading-relaxed mb-3" style="color:#5b6478">' + escapeHtml(descText) + '</p>',
      '</div>',
      '<div>',
      '<div class="flex flex-wrap gap-3 mb-3 text-xs" style="color:#64748b">',
      '<span><i class="fa-solid fa-location-dot mr-1" style="color:#1652c4"></i>' + escapeHtml(ev.venue) + '</span>',
      dateLabelHtml,
      '</div>',
      '<div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">',
      regButton,
      detailsButton,
      '</div>',
      '</div>',
      '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  /* =========================================================================
     4. UTILITY
     ========================================================================= */

  function escapeHtml(value) {
    return (value == null ? '' : String(value)).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function safeHttpUrl(value, allowRelative) {
    var raw = String(value || '').trim();
    if (!raw || /[\u0000-\u001f\u007f]/.test(raw)) return '';
    if (!allowRelative && !/^https?:\/\//i.test(raw)) return '';
    try {
      var parsed = new URL(raw, window.location.href);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
      return parsed.href;
    } catch (error) {
      return '';
    }
  }

  /* =========================================================================
     5. EXPORT
     ========================================================================= */

  window.EventsManager = {
    fetchEvents: fetchEvents,
    fetchEventById: fetchEventById,
    renderEventCard: renderEventCard,
    getCategoryColor: getCategoryColor,
    getCategoryIcon: getCategoryIcon,
    CATEGORY_COLORS: CATEGORY_COLORS,
    CATEGORY_ICONS: CATEGORY_ICONS,
    getFallbackEvents: getFallbackEvents
  };

})(typeof window !== 'undefined' ? window : this);

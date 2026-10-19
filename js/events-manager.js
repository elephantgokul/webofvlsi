// js/events-manager.js — Supabase-backed Event Management System
// Department of VLSI Design and Technology, SIET
// Vanilla JS — loaded via plain <script> tag

(function (window) {
  'use strict';

  /* =========================================================================
     1. EVENT DATA LAYER — Fetch events from Supabase
     ========================================================================= */

  /**
   * Fetch published events from Supabase 'events' table.
   * Falls back to hardcoded data if Supabase is not configured or the table doesn't exist.
   * @param {Object} [options] - { status: 'published', upcoming: true/false }
   * @returns {Promise<Array>}
   */
  async function fetchEvents(options) {
    var opts = options || {};
    var client = window.supabaseClient;

    // Try Supabase first
    if (client && typeof window.isSupabaseConfigured === 'function' && window.isSupabaseConfigured()) {
      try {
        var query = client.from('events').select('*');

        // By default, only show published events on public pages
        if (opts.status !== 'all') {
          query = query.eq('status', 'published');
        }

        // Order by event_date
        query = query.order('event_date', { ascending: true });

        var result = await query;

        if (result.error) {
          console.warn('[Events] Supabase query error:', result.error.message);
          throw result.error;
        }

        var events = (result.data || []).map(normalizeSupabaseEvent);

        if (opts.upcoming === true) {
          var now = new Date();
          now.setHours(0, 0, 0, 0);
          events = events.filter(function (e) {
            var eventDate = new Date(e.event_date);
            return eventDate >= now;
          });
        } else if (opts.upcoming === false) {
          var now2 = new Date();
          now2.setHours(0, 0, 0, 0);
          events = events.filter(function (e) {
            var eventDate = new Date(e.event_date);
            return eventDate < now2;
          });
        }

        return events;
      } catch (err) {
        console.warn('[Events] Supabase fetch failed, using fallback data:', err);
      }
    }

    // Fallback: return hardcoded data from the existing events page
    return getFallbackEvents(opts);
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
   * Fallback hardcoded events (reusing existing data from events.html)
   */
  function getFallbackEvents(opts) {
    var catColors = { symposium: '#1652c4', talk: '#0b6e8c', workshop: '#166444', competition: '#8c4516', cultural: '#c41652', alumni: '#6416c4' };

    var allEvents = [
      { cat: "symposium", day: "14", month: "JUL", year: "2026", title: "ELECNOVA 2026 — National Technical Symposium", venue: "Main Auditorium", time: "9:00 AM", desc: "Annual national-level technical symposium featuring paper presentations, project expo, workshops, and guest lectures from industry leaders.", reg: true, event_date: "2026-07-14", category: "symposium" },
      { cat: "talk", day: "21", month: "JUL", year: "2026", title: "Expert Talk: 5G Networks & Open RAN Architecture", venue: "Seminar Hall 2", time: "2:00 PM", desc: "Industry expert from Ericsson India speaks on 5G NR, Open RAN, and what it means for VLSI engineers entering the workforce.", reg: true, event_date: "2026-07-21", category: "talk" },
      { cat: "workshop", day: "02", month: "AUG", year: "2026", title: "Hands-on: PCB Design & Rapid Prototyping", venue: "Electronics Lab 3", time: "10:00 AM", desc: "Full-day workshop — design a PCB in KiCad, generate Gerbers, fabricate using lab's CNC milling machine, and solder live.", reg: true, event_date: "2026-08-02", category: "workshop" },
      { cat: "competition", day: "10", month: "AUG", year: "2026", title: "Circuit Debugging Challenge 2026", venue: "Electronics Lab 1", time: "10:00 AM", desc: "Inter-batch circuit debugging competition. Teams of 2 race to identify and fix faults in pre-built PCBs within a time limit.", reg: true, event_date: "2026-08-10", category: "competition" },
      { cat: "alumni", day: "16", month: "AUG", year: "2026", title: "Alumni Meet & Mentorship Day 2026", venue: "Dept Block Lawn", time: "4:00 PM", desc: "Annual alumni gathering — networking, mentorship panels, career guidance sessions, and department project showcase.", reg: false, event_date: "2026-08-16", category: "alumni" },
      { cat: "cultural", day: "28", month: "AUG", year: "2026", title: "Freshers' Day 2026 — Welcome Celebration", venue: "College Auditorium", time: "5:30 PM", desc: "Welcome event for the new batch — cultural performances, faculty introductions, and department orientation.", reg: false, event_date: "2026-08-28", category: "cultural" },
      { cat: "symposium", day: "14", month: "MAR", year: "2026", title: "ELECNOVA 2025 — National Technical Symposium", venue: "Main Auditorium", time: "9:00 AM", desc: "800+ participants from 40 colleges. Best paper and best project awards presented. Keynote by IEEE Fellow from IIT Madras.", reg: false, event_date: "2026-03-14", category: "symposium" },
      { cat: "workshop", day: "14", month: "MAR", year: "2026", title: "PCB Design & Fabrication Workshop", venue: "Electronics Lab 3", time: "10:00 AM", desc: "85 students. End-to-end PCB design and fabrication. Students took home a self-designed board.", reg: false, event_date: "2026-03-14", category: "workshop" },
      { cat: "talk", day: "18", month: "DEC", year: "2025", title: "Industry Talk — 5G Architecture & Beyond", venue: "Main Auditorium", time: "2:00 PM", desc: "220 attendees. Expert from Ericsson India. Live 5G signal measurement demo.", reg: false, event_date: "2025-12-18", category: "talk" },
      { cat: "workshop", day: "22", month: "NOV", year: "2025", title: "Embedded Systems Workshop — RTOS", venue: "Embedded Lab", time: "10:00 AM", desc: "75 students. FreeRTOS on STM32. Motor control application built from scratch.", reg: false, event_date: "2025-11-22", category: "workshop" },
      { cat: "competition", day: "10", month: "OCT", year: "2025", title: "HackVLSI — Department Hackathon 2025", venue: "All Labs", time: "9:00 AM", desc: "24-hour hackathon. 30 teams. Problem statements from IoT, VLSI, and signal processing domains.", reg: false, event_date: "2025-10-10", category: "competition" },
      { cat: "alumni", day: "20", month: "SEP", year: "2025", title: "Alumni Guest Lecture Series — Batch 2020", venue: "Seminar Hall 1", time: "3:00 PM", desc: "4 alumni from TCS, Infosys, and Intel shared career journeys, placement tips, and industry insights.", reg: false, event_date: "2025-09-20", category: "alumni" }
    ];

    var now = new Date();
    now.setHours(0, 0, 0, 0);

    if (opts.upcoming === true) {
      return allEvents.filter(function (e) { return new Date(e.event_date) >= now; });
    } else if (opts.upcoming === false) {
      return allEvents.filter(function (e) { return new Date(e.event_date) < now; });
    }

    return allEvents;
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
    var isPast = eventDate < now;
    var descText = (ev.desc || ev.description || '').substring(0, 90);

    var regButton = '';
    if (ev.reg && ev.registration_url && ev.registration_url !== '#') {
      regButton = '<a href="' + escapeHtml(ev.registration_url) + '" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-xs font-semibold text-white rounded-lg px-3 py-1.5 transition-all" style="background:' + c + '" onmouseover="this.style.opacity=\'.85\'" onmouseout="this.style.opacity=\'1\'"><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>Register Now</a>';
    } else if (ev.reg) {
      regButton = '<a href="#" class="inline-flex items-center gap-1.5 text-xs font-semibold text-white rounded-lg px-3 py-1.5 transition-all" style="background:' + c + '" onmouseover="this.style.opacity=\'.85\'" onmouseout="this.style.opacity=\'1\'"><i class="fa-solid fa-registered text-[10px]"></i>Register Now</a>';
    } else {
      regButton = '<span class="inline-flex items-center gap-1.5 text-xs font-mono rounded-lg px-3 py-1.5" style="background:#f4f7fb;color:#aab4c8">' + (isPast ? 'Event Completed' : 'Free Entry') + '</span>';
    }

    var posterHtml = '';
    if (ev.poster_url) {
      posterHtml = '<div class="mb-3 rounded-xl overflow-hidden" style="max-height:180px">' +
        '<img src="' + escapeHtml(ev.poster_url) + '" alt="' + escapeHtml(ev.title) + ' poster" class="w-full object-cover" style="max-height:180px" onerror="this.parentNode.style.display=\'none\'">' +
        '</div>';
    }

    return [
      '<article class="ev-card surface-card rounded-2xl overflow-hidden" data-aos="fade-up" data-aos-delay="' + ((index || 0) % 3 * 70) + '">',
      '<div class="flex items-stretch">',
      '<div class="flex flex-col items-center justify-center px-5 py-6 flex-shrink-0" style="background:' + c + ';min-width:5rem">',
      '<span class="font-display font-bold text-white text-3xl leading-none">' + escapeHtml(ev.day) + '</span>',
      '<span class="font-mono text-white text-xs mt-1 opacity-75">' + escapeHtml(ev.month) + '</span>',
      '<span class="font-mono text-white text-xs opacity-50">' + escapeHtml(ev.year) + '</span>',
      '</div>',
      '<div class="p-5 flex-1 min-w-0">',
      '<div class="flex items-center gap-2 mb-2">',
      '<span class="cat-dot" style="background:' + c + '"></span>',
      '<span class="text-[10px] font-mono uppercase tracking-wide" style="color:' + c + '">' + escapeHtml(ev.cat || ev.category) + '</span>',
      isPast ? '<span class="text-[10px] font-mono px-2 py-0.5 rounded-full" style="background:#f4f7fb;color:#aab4c8">Past</span>' : '',
      '</div>',
      '<h3 class="font-display font-semibold text-sm leading-snug mb-2" style="color:#0b1b33">' + escapeHtml(ev.title) + '</h3>',
      posterHtml,
      '<p class="text-xs leading-relaxed mb-3" style="color:#5b6478">' + escapeHtml(descText) + '…</p>',
      '<div class="flex flex-wrap gap-3 mb-3" style="font-size:.72rem;color:#aab4c8">',
      '<span><i class="fa-solid fa-location-dot mr-1" style="color:#1652c4"></i>' + escapeHtml(ev.venue) + '</span>',
      '<span><i class="fa-solid fa-clock mr-1" style="color:#1652c4"></i>' + escapeHtml(ev.time || ev.event_time || '') + '</span>',
      '</div>',
      regButton,
      '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  /* =========================================================================
     4. UTILITY
     ========================================================================= */

  function escapeHtml(v) {
    var d = document.createElement('div');
    d.textContent = v == null ? '' : String(v);
    return d.innerHTML;
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

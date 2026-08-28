// js/supabase-config.js  -  Centralized Supabase Configuration & Storage Utilities
// Department of VLSI Design and Technology, SIET
// Vanilla JS only  -  NO ES6 module imports/exports (loaded via plain <script> tag)

(function (window) {
  'use strict';

  /* =========================================================================
     1. SUPABASE CREDENTIALS
     ========================================================================= */
  var SUPABASE_URL = "https://fptnqolkmagfyjpedbix.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdG5xb2xrbWFnZnlqcGVkYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MjkzNjQsImV4cCI6MjEwMzEwNTM2NH0.NdByMySJ_hRyX3F3OB5sUlxF8kEuXYCHd0_9B__iuWA";

  /* =========================================================================
     2. PUBLIC STORAGE BUCKET NAMES
     ========================================================================= */
  var SUPABASE_BUCKETS = {
    faculty: "faculty",           // Faculty and HOD photos
    students: "students",         // Student profile photos
    gallery: "gallery",           // Campus, lab, and event gallery images
    alumni: "alumni",             // Alumni portraits
    achievements: "achievements", // Achievement badge/trophy photos
    events: "events",             // Event posters and banners
    notices: "notices"            // Notice attachments and images
  };

  /* =========================================================================
     3. CLIENT INITIALIZATION
     ========================================================================= */
  var supabaseClient = null;

  function isConfigured() {
    return (
      typeof SUPABASE_URL === 'string' &&
      SUPABASE_URL.trim() !== '' &&
      !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
      typeof SUPABASE_ANON_KEY === 'string' &&
      SUPABASE_ANON_KEY.trim() !== '' &&
      !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
    );
  }

  function initSupabaseClient() {
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      if (isConfigured()) {
        try {
          supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (err) {
          console.warn('[Supabase] Client initialization failed:', err);
        }
      }
    }
    return supabaseClient;
  }

  // Initialize immediately if Supabase CDN is already loaded
  initSupabaseClient();

  /* =========================================================================
     4. REUSABLE STORAGE UTILITIES
     ========================================================================= */

  /**
   * Constructs the standard Supabase public object URL:
   * Pattern: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<file>
   *
   * @param {string} bucket - The public bucket name (e.g. 'faculty', 'students')
   * @param {string} filePath - Path or filename inside the bucket (e.g. 'dhilipkumar.jpg')
   * @returns {string} Fully qualified public URL
   */
  function getSupabasePublicUrl(bucket, filePath) {
    if (!bucket || !filePath) return '';
    var cleanFile = String(filePath).replace(/^\/+/, '');
    var baseUrl = (SUPABASE_URL || '').replace(/\/+$/, '');
    return baseUrl + '/storage/v1/object/public/' + encodeURIComponent(bucket) + '/' + cleanFile;
  }

  /**
   * Fetches a list of files from a public Supabase Storage bucket.
   * Works via Supabase JS Client or fallback REST fetch.
   *
   * @param {string} bucket - Storage bucket name
   * @param {Object} [options] - Optional list options ({ path: '', limit: 100, sortBy: { column: 'name', order: 'asc' } })
   * @returns {Promise<Array<{name: string, id: string, updated_at: string, publicUrl: string}>>}
   */
  async function listSupabaseBucketFiles(bucket, options) {
    var opts = options || {};
    var folderPath = opts.path || '';
    var limit = opts.limit || 100;
    var sortBy = opts.sortBy || { column: 'name', order: 'asc' };

    if (!isConfigured()) {
      return [];
    }

    // Try using Supabase JS client if available
    var client = supabaseClient || initSupabaseClient();
    if (client && client.storage) {
      try {
        var res = await client.storage.from(bucket).list(folderPath, {
          limit: limit,
          sortBy: sortBy
        });
        if (res.error) throw res.error;
        var files = res.data || [];
        return files
          .filter(function (item) { return item.name && item.name !== '.emptyFolderPlaceholder'; })
          .map(function (item) {
            var fullPath = folderPath ? (folderPath.replace(/\/+$/, '') + '/' + item.name) : item.name;
            return Object.assign({}, item, {
              publicUrl: getSupabasePublicUrl(bucket, fullPath)
            });
          });
      } catch (clientErr) {
        console.warn('[Supabase] Client list failed, trying direct REST API:', clientErr);
      }
    }

    // Fallback: direct REST call to Supabase Storage endpoint
    try {
      var endpoint = SUPABASE_URL.replace(/\/+$/, '') + '/storage/v1/object/list/' + encodeURIComponent(bucket);
      var response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prefix: folderPath,
          limit: limit,
          sortBy: sortBy
        })
      });

      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ': ' + response.statusText);
      }

      var items = await response.json();
      if (!Array.isArray(items)) return [];

      return items
        .filter(function (item) { return item.name && item.name !== '.emptyFolderPlaceholder'; })
        .map(function (item) {
          var fullPath = folderPath ? (folderPath.replace(/\/+$/, '') + '/' + item.name) : item.name;
          return Object.assign({}, item, {
            publicUrl: getSupabasePublicUrl(bucket, fullPath)
          });
        });
    } catch (restErr) {
      console.warn('[Supabase] REST list failed for bucket "' + bucket + '":', restErr);
      return [];
    }
  }

  /**
   * Intelligently resolves an image source:
   * - If already an absolute http/https/data URL, returns as-is.
   * - If configured with Supabase, converts filename/path to Supabase Public URL.
   * - If not configured or local path, formats local fallback path relative to caller.
   *
   * @param {string} pathOrFilename - The raw image name or path
   * @param {string} bucket - The Supabase bucket name (from SUPABASE_BUCKETS)
   * @param {string} [fallbackLocalPath] - Optional local fallback path (e.g. 'assets/images/faculty/prema.jpg')
   * @returns {string} Resolved image URL
   */
  function resolveSupabaseImageUrl(pathOrFilename, bucket, fallbackLocalPath) {
    var raw = String(pathOrFilename || fallbackLocalPath || '').trim();
    if (!raw) return '';

    // If it is already a full remote URL or data URL
    if (/^(https?:|data:)/i.test(raw)) {
      return raw;
    }

    // Instantly return local asset path for 0ms latency with zero network 404 delays
    var localPath = getLocalAssetFallback(raw, bucket);
    if (localPath) return localPath;

    // Otherwise resolve as a local path relative to current page location
    if (raw.indexOf('assets/') === 0) {
      var isInsidePagesFolder = typeof window !== 'undefined' &&
        window.location &&
        window.location.pathname.replace(/\\/g, '/').includes('/pages/');
      return (isInsidePagesFolder ? '../' : '') + raw;
    }

    return raw;
  }

  function getLocalAssetFallback(pathOrFilename, bucket) {
    var raw = String(pathOrFilename || '').trim();
    if (!raw) return '';
    if (/^(https?:|data:)/i.test(raw)) return '';
    var filename = raw.split('/').pop();
    var isInsidePagesFolder = typeof window !== 'undefined' &&
      window.location &&
      window.location.pathname.replace(/\\/g, '/').includes('/pages/');
    var prefix = isInsidePagesFolder ? '../assets/images/' : 'assets/images/';
    var folder = (bucket === 'faculty') ? 'faculty/' : ((bucket === 'students') ? 'students/' : '');
    return prefix + folder + filename;
  }

  /* =========================================================================
     5. EXPORT TO GLOBAL WINDOW OBJECT
     ========================================================================= */
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  window.SUPABASE_BUCKETS = SUPABASE_BUCKETS;
  window.supabaseClient = supabaseClient;
  window.isSupabaseConfigured = isConfigured;
  window.getSupabasePublicUrl = getSupabasePublicUrl;
  window.listSupabaseBucketFiles = listSupabaseBucketFiles;
  window.resolveSupabaseImageUrl = resolveSupabaseImageUrl;
  window.getLocalAssetFallback = getLocalAssetFallback;

})(typeof window !== 'undefined' ? window : this);
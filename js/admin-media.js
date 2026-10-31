(function (window) {
  'use strict';

  var auth = window.SiteAdminAuth;

  async function request(action, options) {
    var opts = options || {};
    if (!auth || !auth.client || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      throw new Error('The media service is not configured.');
    }
    var result = await auth.client.auth.getSession();
    var token = result.data && result.data.session && result.data.session.access_token;
    if (!token) throw new Error('Your session expired. Sign in again.');

    var query = new URLSearchParams({ action: action });
    if (opts.kind) query.set('kind', opts.kind);
    var response = await fetch(window.SUPABASE_URL.replace(/\/+$/, '') + '/functions/v1/gallery-media?' + query.toString(), {
      method: 'POST',
      headers: Object.assign({
        apikey: window.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + token
      }, opts.headers || {}),
      body: opts.body
    });
    var body = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(body.error || 'The media request failed.');
    return body;
  }

  async function upload(file, fields, kind) {
    var form = new FormData();
    form.append('file', file);
    Object.keys(fields || {}).forEach(function (key) {
      if (fields[key] != null) form.append(key, fields[key]);
    });
    return request('upload', { body: form, kind: kind });
  }

  window.AdminMedia = {
    uploadGallery: function (file, fields) { return upload(file, fields, ''); },
    uploadPoster: async function (file) {
      var result = await upload(file, {}, 'poster');
      return result.publicUrl;
    },
    deleteMedia: function (mediaId) {
      return request('delete', { body: JSON.stringify({ mediaId: mediaId }), headers: { 'Content-Type': 'application/json' } });
    },
    sign: function (mediaIds, includeDrafts) {
      var body = JSON.stringify({ mediaIds: mediaIds, includeDrafts: includeDrafts === true });
      return request('sign', { body: body, headers: { 'Content-Type': 'application/json' } });
    }
  };
})(window);

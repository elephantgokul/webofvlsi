(function (window) {
  'use strict';

  var ADMIN_EMAIL = 'hodvlsi@siet.ac.in';
  var client = window.supabaseClient || null;
  if (!client && window.supabase && typeof window.supabase.createClient === 'function' && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    });
  }

  function isAuthorized(user) {
    return !!user && String(user.email || '').toLowerCase() === ADMIN_EMAIL &&
      !!(user.app_metadata && user.app_metadata.site_admin === true);
  }

  async function getVerifiedUser() {
    if (!client) return null;
    var sessionResult = await client.auth.getSession();
    var session = sessionResult.data && sessionResult.data.session;
    if (!session) return null;

    var userResult = await client.auth.getUser(session.access_token);
    if (userResult.error || !isAuthorized(userResult.data && userResult.data.user)) return null;
    return userResult.data.user;
  }

  async function requireAdmin() {
    var user = null;
    try { user = await getVerifiedUser(); } catch (_) { user = null; }
    if (!user) {
      if (client) await client.auth.signOut({ scope: 'local' }).catch(function () {});
      window.location.replace('admin-login.html');
      return null;
    }
    return user;
  }

  if (document.documentElement.hasAttribute('data-admin-protected')) {
    window.addEventListener('pagehide', function () {
      document.documentElement.style.visibility = 'hidden';
    });
    window.addEventListener('pageshow', function (event) {
      if (!event.persisted) return;
      document.documentElement.style.visibility = 'hidden';
      getVerifiedUser().then(function (user) {
        if (!user) {
          if (client) client.auth.signOut({ scope: 'local' }).catch(function () {});
          document.querySelectorAll('#admin-events-list, #gallery-admin-list').forEach(function (node) {
            node.replaceChildren();
          });
          window.location.replace(new URL('admin-login.html', window.location.href).toString());
          return;
        }
        document.documentElement.style.visibility = '';
      }).catch(function () {
        window.location.replace(new URL('admin-login.html', window.location.href).toString());
      });
    });
  }

  window.SiteAdminAuth = {
    email: ADMIN_EMAIL,
    client: client,
    isAuthorized: isAuthorized,
    getVerifiedUser: getVerifiedUser,
    requireAdmin: requireAdmin
  };
})(window);

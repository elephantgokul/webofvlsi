(function () {
  'use strict';

  var auth = window.SiteAdminAuth;
  var client = auth && auth.client;
  var loginForm = document.getElementById('admin-login-form');
  var recoveryForm = document.getElementById('admin-recovery-form');
  var message = document.getElementById('admin-login-message');
  var recoveryMessage = document.getElementById('admin-recovery-message');
  var info = document.getElementById('admin-auth-info');
  var submitButton = document.getElementById('admin-login-submit');
  var recoveryButton = document.getElementById('admin-recovery-submit');

  function setMessage(el, value, isError) {
    el.textContent = value || '';
    el.style.color = isError ? '#b91c1c' : '#047857';
  }

  function setBusy(button, busy, label) {
    button.disabled = busy;
    var span = button.querySelector('span');
    if (span) span.textContent = busy ? label : button.dataset.defaultLabel;
  }

  function showRecoveryForm() {
    loginForm.hidden = true;
    recoveryForm.hidden = false;
    info.textContent = 'Choose a new password with at least 12 characters.';
    document.getElementById('new-password').focus();
  }

  async function verifyAuthorizedSession() {
    if (!auth || !client) return null;
    try { return await auth.getVerifiedUser(); } catch (_) { return null; }
  }

  async function redirectIfAuthorized() {
    var user = await verifyAuthorizedSession();
    if (user) window.location.replace('admin.html');
    else if (client) await client.auth.signOut({ scope: 'local' }).catch(function () {});
  }

  if (!client) {
    setMessage(message, 'Admin sign-in is temporarily unavailable. Supabase is not configured.', true);
  } else {
    client.auth.getSession().then(function (result) {
      var hash = new URLSearchParams(window.location.hash.slice(1));
      if (hash.get('type') === 'recovery') {
        verifyAuthorizedSession().then(function (user) {
          if (user) showRecoveryForm();
          else setMessage(message, 'This password reset link is invalid or expired. Request a new one.', true);
        });
        return;
      }
      if (result.data && result.data.session) redirectIfAuthorized();
    }).catch(function () {
      setMessage(message, 'Could not check your session. Please try again.', true);
    });

    client.auth.onAuthStateChange(function (event) {
      window.setTimeout(async function () {
        if (event === 'PASSWORD_RECOVERY') {
          var user = await verifyAuthorizedSession();
          if (user) showRecoveryForm();
          else setMessage(message, 'This password reset link is invalid or expired. Request a new one.', true);
        } else if (event === 'SIGNED_IN') {
          var signedInUser = await verifyAuthorizedSession();
          if (signedInUser) window.location.replace('admin.html');
          else {
            await client.auth.signOut({ scope: 'local' }).catch(function () {});
            setMessage(message, 'Sign-in was rejected. Check the administrator account and try again.', true);
          }
        }
      }, 0);
    });
  }

  document.getElementById('toggle-admin-password').addEventListener('click', function () {
    var input = document.getElementById('admin-password');
    var button = this;
    var visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(visible));
    button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    button.querySelector('i').className = visible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  });

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    setMessage(message, '', false);
    if (!client) return;

    var email = document.getElementById('admin-email').value.trim().toLowerCase();
    var password = document.getElementById('admin-password').value;
    if (email !== auth.email || !password) {
      setMessage(message, 'Use the authorized administrator email and password.', true);
      return;
    }

    setBusy(submitButton, true, 'Signing in…');
    try {
      var result = await client.auth.signInWithPassword({ email: auth.email, password: password });
      if (result.error) throw result.error;
      var user = result.data && result.data.user;
      if (!auth.isAuthorized(user)) {
        await client.auth.signOut({ scope: 'local' });
        throw new Error('Not authorized');
      }
      window.location.replace('admin.html');
    } catch (_) {
      setMessage(message, 'Sign-in failed. Check the credentials and administrator access, then try again.', true);
    } finally {
      setBusy(submitButton, false);
    }
  });

  document.getElementById('forgot-password').addEventListener('click', async function () {
    setMessage(message, '', false);
    if (!client) return;
    var email = document.getElementById('admin-email').value.trim().toLowerCase();
    if (email !== auth.email) {
      setMessage(message, 'Password recovery is available for the authorized administrator account only.', true);
      return;
    }

    this.disabled = true;
    try {
      var redirectTo = new URL('admin-login.html?recovery=1', window.location.href).toString();
      var result = await client.auth.resetPasswordForEmail(auth.email, { redirectTo: redirectTo });
      if (result.error) throw result.error;
      info.textContent = 'If the administrator account is enabled, a password reset link has been sent.';
    } catch (_) {
      setMessage(message, 'Could not send a reset link. Check the Supabase Auth email and redirect settings.', true);
    } finally {
      this.disabled = false;
    }
  });

  recoveryForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    setMessage(recoveryMessage, '', false);
    if (!client) return;

    var password = document.getElementById('new-password').value;
    var confirmation = document.getElementById('confirm-password').value;
    if (password.length < 12) {
      setMessage(recoveryMessage, 'Use at least 12 characters.', true);
      return;
    }
    if (password !== confirmation) {
      setMessage(recoveryMessage, 'The passwords do not match.', true);
      return;
    }

    setBusy(recoveryButton, true, 'Updating…');
    try {
      var user = await verifyAuthorizedSession();
      if (!user) throw new Error('Not authorized');
      var result = await client.auth.updateUser({ password: password });
      if (result.error) throw result.error;
      setMessage(recoveryMessage, 'Password updated. Sign in with your new password.', false);
      await client.auth.signOut();
      recoveryForm.hidden = true;
      loginForm.hidden = false;
      document.getElementById('admin-password').value = '';
      info.textContent = '';
    } catch (_) {
      setMessage(recoveryMessage, 'Could not update the password. The reset link may have expired.', true);
    } finally {
      setBusy(recoveryButton, false);
    }
  });

  submitButton.dataset.defaultLabel = 'Sign in';
  recoveryButton.dataset.defaultLabel = 'Update password';
})();

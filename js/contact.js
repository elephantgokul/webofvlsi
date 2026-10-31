document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var formStartedAt = 0;
  form.addEventListener('focusin', function () { if (!formStartedAt) formStartedAt = Date.now(); });

  var fields = {
    name:    { el: form.querySelector('#contact-name'),    rule: function(v){ return v.trim().length >= 2 && v.trim().length <= 120; },    msg: 'Name must be at least 2 characters.' },
    email:   { el: form.querySelector('#contact-email'),   rule: function(v){ return v.trim().length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: 'Enter a valid email address.' },
    subject: { el: form.querySelector('#contact-subject'), rule: function(v){ return v.trim().length >= 4 && v.trim().length <= 200; },    msg: 'Subject must be at least 4 characters.' },
    message: { el: form.querySelector('#contact-message'), rule: function(v){ return v.trim().length >= 20 && v.trim().length <= 10000; },   msg: 'Message must be at least 20 characters.' }
  };

  Object.values(fields).forEach(function(f) {
    if (!f.el) return;
    f.el.addEventListener('blur', function() { validateField(f); });
    f.el.addEventListener('input', function() { if (f.el.dataset.dirty) validateField(f); });
    f.el.addEventListener('blur', function() { f.el.dataset.dirty = 'true'; }, { once: true });
  });

  function validateField(f) {
    var val = f.el.value;
    var err = f.el.parentElement.querySelector('.field-error');
    if (!f.rule(val)) {
      f.el.classList.add('input-error'); f.el.classList.remove('input-ok');
      if (err) err.textContent = f.msg;
      return false;
    }
    f.el.classList.remove('input-error'); f.el.classList.add('input-ok');
    if (err) err.textContent = '';
    return true;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    var successMessage = document.getElementById('form-success');
    if (successMessage) successMessage.style.display = 'none';

    var honeypot = form.querySelector('#hp-field');
    if (honeypot && honeypot.value) return;

    var allValid = Object.values(fields).map(validateField).every(Boolean);
    if (!allValid) { window.showToast('Please fix the errors above.', 'error'); return; }

    var submitBtn = form.querySelector('#contact-submit');
    if (!submitBtn) return;
    var originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending\u2026';

    var payload = {
      name:       fields.name.el.value.trim(),
      email:      fields.email.el.value.trim(),
      subject:    fields.subject.el.value.trim(),
      message:    fields.message.el.value.trim(),
      page_url:   window.location.pathname,
      website:    honeypot ? honeypot.value : '',
      elapsed_ms: formStartedAt ? Date.now() - formStartedAt : 0
    };

    try {
      if (!window.isSupabaseConfigured || !window.isSupabaseConfigured() || !window.supabaseClient) {
        throw new Error('The contact service is not configured.');
      }
      var endpoint = window.SUPABASE_URL.replace(/\/+$/, '') + '/functions/v1/contact-message';
      var res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: window.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Contact submission was rejected.');
      if (successMessage) successMessage.style.display = 'flex';
      window.showToast('Message sent successfully! We\'ll reply within 24 hours.', 'success', 6000);
      form.reset();
      formStartedAt = 0;
      Object.values(fields).forEach(function(f){ if(f.el){ f.el.classList.remove('input-ok','input-error'); delete f.el.dataset.dirty; } });
    } catch(err) {
      window.showToast('Failed to send your message. Please email hodvlsi@siet.ac.in directly.', 'error', 8000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  });
});

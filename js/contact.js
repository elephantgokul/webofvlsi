document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var fields = {
    name:    { el: form.querySelector('#contact-name'),    rule: function(v){ return v.trim().length >= 2; },    msg: 'Name must be at least 2 characters.' },
    email:   { el: form.querySelector('#contact-email'),   rule: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: 'Enter a valid email address.' },
    subject: { el: form.querySelector('#contact-subject'), rule: function(v){ return v.trim().length >= 4; },    msg: 'Subject must be at least 4 characters.' },
    message: { el: form.querySelector('#contact-message'), rule: function(v){ return v.trim().length >= 20; },   msg: 'Message must be at least 20 characters.' }
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

    if (form.querySelector('#hp-field') && form.querySelector('#hp-field').value) return;

    var allValid = Object.values(fields).map(validateField).every(Boolean);
    if (!allValid) { window.showToast('Please fix the errors above.', 'error'); return; }

    var submitBtn = form.querySelector('#contact-submit');
    var originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending\u2026';

    var payload = {
      name:       fields.name.el.value.trim(),
      email:      fields.email.el.value.trim(),
      subject:    fields.subject.el.value.trim(),
      message:    fields.message.el.value.trim(),
      created_at: new Date().toISOString(),
      page_url:   window.location.href
    };

    try {
      if (window.isSupabaseConfigured && window.isSupabaseConfigured() && window.supabaseClient) {
        var res = await window.supabaseClient.from('contact_messages').insert([payload]);
        if (res.error) throw res.error;
      } else {
        console.info('[Contact] Supabase not configured. Message payload:', payload);
        await new Promise(function(r){ setTimeout(r, 1200); });
      }
      window.showToast('Message sent successfully! We\'ll reply within 24 hours.', 'success', 6000);
      form.reset();
      Object.values(fields).forEach(function(f){ if(f.el){ f.el.classList.remove('input-ok','input-error'); delete f.el.dataset.dirty; } });
    } catch(err) {
      console.error('[Contact] Submit error:', err);
      window.showToast('Failed to send message. Please email us directly at vlsi@siet.ac.in', 'error', 8000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  });
});
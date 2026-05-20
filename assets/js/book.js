// LeadaLine — Book a Demo form

document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('bookForm');
  const formWrap   = document.getElementById('formWrap');
  const successEl  = document.getElementById('successState');
  const submitBtn  = document.getElementById('submitBtn');

  if (!form) return;

  // ── Validation helpers ────────────────────────────────────────
  function validateField(input) {
    const group = input.closest('.form-group');
    const err   = group ? group.querySelector('.form-error') : null;
    let msg = '';

    if (input.required && !input.value.trim()) {
      msg = 'This field is required.';
    } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      msg = 'Please enter a valid email address.';
    } else if (input.type === 'tel' && input.value && !/^[\d\s\+\(\)\-]{7,}$/.test(input.value)) {
      msg = 'Please enter a valid phone number.';
    }

    if (msg) {
      input.classList.add('invalid');
      if (err) { err.textContent = msg; err.classList.add('show'); }
      return false;
    } else {
      input.classList.remove('invalid');
      if (err) { err.textContent = ''; err.classList.remove('show'); }
      return true;
    }
  }

  // Live validation on blur
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  // ── Submit ────────────────────────────────────────────────────
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all required fields
    let valid = true;
    form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) {
      const firstErr = form.querySelector('.invalid');
      if (firstErr) firstErr.focus();
      return;
    }

    // Build payload
    const payload = {
      name:                        form.querySelector('#name').value.trim(),
      business_name:               form.querySelector('#business_name').value.trim(),
      email:                       form.querySelector('#email').value.trim(),
      phone:                       form.querySelector('#phone').value.trim(),
      website_url:                 form.querySelector('#website_url').value.trim(),
      industry:                    form.querySelector('#industry').value,
      average_enquiries_per_month: form.querySelector('#enquiries').value,
      biggest_lead_problem:        form.querySelector('#lead_problem').value,
      message:                     form.querySelector('#message').value.trim(),
      source:                      'LeadaLine website book demo form',
    };

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span>&nbsp; Sending…';

    if (CONFIG.ENABLE_REAL_WEBHOOK) {
      try {
        await fetch(CONFIG.BOOKING_WEBHOOK_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        });
      } catch (err) {
        console.error('Webhook error:', err);
      }
    }

    // Always show success
    formWrap.style.display = 'none';
    successEl.classList.add('show');
    successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* Contact form: client-side validation with inline errors (copy from 6.7),
   AJAX submit to Netlify Forms, success state replaces the form.
   Spam: honeypot plus time-based check, no CAPTCHA. */

const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');
const startedAt = document.getElementById('started-at');

if (form) {
  const loadTime = Date.now();
  if (startedAt) startedAt.value = String(loadTime);

  const fields = {
    name: {
      input: document.getElementById('f-name'),
      error: document.getElementById('err-name'),
      valid: (v) => v.trim().length > 0,
    },
    email: {
      input: document.getElementById('f-email'),
      error: document.getElementById('err-email'),
      valid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    },
    question: {
      input: document.getElementById('f-question'),
      error: document.getElementById('err-question'),
      valid: (v) => v.trim().length > 0,
    },
  };

  function setFieldState(f, ok) {
    f.error.hidden = ok;
    f.input.closest('.field').classList.toggle('has-error', !ok);
    f.input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  }

  function validate() {
    let firstBad = null;
    for (const key of Object.keys(fields)) {
      const f = fields[key];
      const ok = f.valid(f.input.value);
      setFieldState(f, ok);
      if (!ok && !firstBad) firstBad = f;
    }
    return firstBad;
  }

  // Clear a field's error as soon as it becomes valid
  for (const key of Object.keys(fields)) {
    const f = fields[key];
    f.input.addEventListener('input', () => {
      if (!f.error.hidden && f.valid(f.input.value)) setFieldState(f, true);
    });
  }

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstBad = validate();
    if (firstBad) {
      firstBad.input.focus();
      return;
    }

    // Spam checks: honeypot filled or submitted unhumanly fast.
    // Pretend success so bots learn nothing.
    const honeypot = form.querySelector('input[name="website"]');
    const tooFast = Date.now() - loadTime < 4000;
    if ((honeypot && honeypot.value) || tooFast) {
      showSuccess();
      return;
    }

    const btn = form.querySelector('.form-submit');
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error('submit failed');
      if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({ event: 'form_submitted' });
      }
      showSuccess();
    } catch {
      // Network failure: fall back to a native POST to /thanks
      btn.disabled = false;
      form.removeAttribute('novalidate');
      form.submit();
    }
  });
}

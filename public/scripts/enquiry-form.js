/*
 * Submits every [data-enquiry-form] to /api/contact (contact page + homepage
 * signup box). Each form carries a hidden `kind` input and a
 * [data-enquiry-status] element for feedback. Vanilla IIFE, no framework.
 */
(function () {
  document.querySelectorAll('[data-enquiry-form]').forEach(function (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var status = form.querySelector('[data-enquiry-status]');
      var button = form.querySelector('button[type="submit"]');
      if (!status || !button) return;

      // Lock the button while in flight so a double-click can't send two emails
      button.disabled = true;
      status.classList.remove('hidden');
      status.textContent = 'Sending...';

      try {
        var res = await fetch('/api/contact', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        var data = await res.json().catch(function () { return {}; });

        if (res.ok && data && data.ok) {
          status.textContent = "Transmission received - we'll be in touch.";
          form.reset();
        } else {
          status.textContent = (data && data.error) || 'Something went wrong. Please try again.';
        }
      } catch (err) {
        status.textContent = 'Something went wrong. Please try again.';
      }
      button.disabled = false;
    });
  });
})();

(() => {
  const form = document.querySelector('#assessment-form');
  if (!form) return;
  const status = form.querySelector('.form-response');
  const button = form.querySelector('button[type="submit"]');
  const show = (msg, error = false) => {
    status.textContent = msg;
    status.classList.toggle('is-error', error);
    status.hidden = false;
    status.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';
    try {
      const res = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: {Accept: 'application/json'},
        body: new FormData(form)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === 'false') throw new Error(data.message || 'Request failed');
      form.reset();
      show('Thank you! Your assessment request was sent. We’ll contact you soon.');
    } catch (err) {
      show('Sorry, your request could not be sent. Please try again in a moment.', true);
    } finally {
      button.disabled = false;
      button.textContent = label;
    }
  });
})();

(() => {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Single blocks that fade in on their own
  const singles = [
    '.difference-intro', '.benefit-marketing', '.development-detail',
    '#roof-types .section-heading', '.material-bottom',
    '.brand-product-visual', '.brand-product-copy',
    '#how-it-works .section-heading', '.process-note',
    '#questions h2', '.assessment-copy', '.assessment-form'
  ];
  // Groups whose children fade in one after another
  const groups = ['.feature-grid', '.material-grid', '.steps', '.faqs', '.assessment-points'];
  const targets = [];
  singles.forEach(sel => document.querySelectorAll(sel).forEach(el => targets.push(el)));
  groups.forEach(sel => document.querySelectorAll(sel).forEach(group => {
    [...group.children].forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 0.09}s`);
      targets.push(child);
    });
  }));
  // Don't hide anything already on screen at load (e.g. when opening a #link)
  const vh = window.innerHeight;
  document.documentElement.classList.add('js-reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, {rootMargin: '0px 0px -8% 0px', threshold: 0.08});
  targets.forEach(el => {
    el.classList.add('reveal');
    if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('is-visible');
    else io.observe(el);
  });
  // Anchor jumps (nav links) reveal their destination right away
  window.addEventListener('hashchange', () => {
    const t = document.querySelector(location.hash);
    t?.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  });
})();

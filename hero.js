(() => {
  const hero = document.querySelector('.hero-premium');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-hero');

  // Headline: wrap each line in a mask so it can slide up
  const h1 = hero.querySelector('h1');
  if (h1) {
    const accent = h1.querySelector('span');
    const first = [...h1.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    const second = accent ? accent.textContent.trim() : '';
    h1.setAttribute('aria-label', `${first} ${second}`.trim());
    h1.innerHTML = '';
    const line = (text, cls, delay) => {
      const outer = document.createElement('span'); outer.className = 'sh-line'; outer.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span'); inner.textContent = text; if (cls) inner.className = cls;
      inner.style.setProperty('--d', `${delay}s`); outer.appendChild(inner); h1.appendChild(outer);
    };
    line(first, '', 0.25);
    if (second) line(second, 'sh-shine', 0.42);
  }

  // Supporting copy rises in, one after another
  const copy = hero.querySelector('.hero-premium-copy');
  const order = ['.eyebrow', '.hero-lead', '.hero-wins', '.hero-actions', '.hero-cta-note'];
  order.forEach((sel, i) => {
    const el = copy?.querySelector(sel);
    if (!el) return;
    el.classList.add('sh-rise');
    el.style.setProperty('--d', `${sel === '.eyebrow' ? 0.1 : 0.62 + i * 0.12}s`);
  });

  // Sheen + water beads layered on the roof photo
  const scene = hero.querySelector('.hero-scene');
  if (scene) {
    const sheen = document.createElement('div'); sheen.className = 'sh-sheen'; sheen.setAttribute('aria-hidden', 'true');
    const beads = document.createElement('div'); beads.className = 'sh-beads'; beads.setAttribute('aria-hidden', 'true');
    // Positions sit on the lower (roof) part of the photo, on the right where it isn't faded out
    const spots = [[62,72,9],[70,80,6],[78,68,11],[84,84,7],[88,74,5],[73,90,8],[93,88,10],[66,86,5],[81,93,6],[90,63,7],[58,90,6],[96,76,5]];
    spots.forEach(([x, y, s], i) => {
      const b = document.createElement('span'); b.className = 'sh-bead';
      b.style.left = `${x}%`; b.style.top = `${y}%`; b.style.width = b.style.height = `${s + 2}px`;
      b.style.setProperty('--d', `${1.5 + i * 0.16}s`);
      beads.appendChild(b);
    });
    // Insert before the gradient overlay (the ::after) so the fade still covers them
    scene.appendChild(sheen); scene.appendChild(beads);

    // Depth on scroll: headline block drifts up and fades a little faster than the photo
    let ticking = false;
    const update = () => {
      const y = Math.max(0, window.scrollY);
      // Only on wide screens, where text sits beside the photo (on phones they stack)
      if (y < hero.offsetHeight * 1.2 && copy && window.innerWidth > 900) {
        copy.style.setProperty('--sh-lift', `${Math.round(-y * 0.12)}px`);
        copy.style.setProperty('--sh-fade', String(Math.max(0.35, 1 - y / (hero.offsetHeight * 1.6)).toFixed(3)));
      }
      ticking = false;
    };
    window.addEventListener('resize', () => { if (window.innerWidth <= 900 && copy) { copy.style.removeProperty('--sh-lift'); copy.style.removeProperty('--sh-fade'); } });
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive: true});
    update();
  }
})();

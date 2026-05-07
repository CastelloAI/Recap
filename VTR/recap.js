// VTR Recap — scroll-driven motion

(function () {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // ---------- Scroll progress ----------
  const progress = $('#progress');
  function updateProgress() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    if (progress) progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ---------- In-view trigger ----------
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          // pillar bars
          if (e.target.classList.contains('pillar')) {
            const fill = e.target.querySelector('.pbar-fill');
            if (fill) fill.style.setProperty('--bar-w', fill.dataset.w);
            if (fill) fill.style.width = fill.dataset.w;
          }
          // capex bars
          if (e.target.id === 's-bet') {
            $$('.capex-fill', e.target).forEach((f) => {
              f.style.width = f.dataset.w;
            });
          }
        }
      });
    },
    { threshold: 0.15 }
  );
  $$('.beat, .hero, .close, .pillar, .reset').forEach((el) => io.observe(el));

  // ---------- Dot field (1409 properties) ----------
  // Mix: 850 senior housing (signal), ~420 medical/research (ink-2), ~139 nnn (ink-4)
  const TOTAL = 1409;
  const N_SHOP = 850;
  const N_OMR = 420;
  // remainder NNN
  const dotfield = $('#dotfield');
  const counter = $('#counter');

  function buildDots() {
    if (!dotfield) return;
    const W = 360, H = 540;
    const cols = 38;
    const rows = Math.ceil(TOTAL / cols);
    const stepX = W / cols;
    const stepY = (H - 20) / rows;
    const r = 1.6;
    const startX = stepX / 2;
    const startY = 12;

    const frag = document.createDocumentFragment();
    const types = [];
    for (let i = 0; i < N_SHOP; i++) types.push('shop');
    for (let i = 0; i < N_OMR; i++) types.push('omr');
    while (types.length < TOTAL) types.push('nnn');

    // mild shuffle: interleave so it doesn't look striped, but keep clusters
    for (let i = 0; i < TOTAL; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * stepX + (Math.random() - 0.5) * 1.5;
      const y = startY + row * stepY + (Math.random() - 0.5) * 1.5;
      const t = types[i];
      const fill =
        t === 'shop' ? 'var(--signal)' :
        t === 'omr'  ? 'var(--ink-2)' :
                       'var(--ink-4)';
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', x.toFixed(2));
      c.setAttribute('cy', y.toFixed(2));
      c.setAttribute('r', r);
      c.setAttribute('fill', fill);
      c.setAttribute('opacity', '0');
      c.dataset.idx = i;
      frag.appendChild(c);
    }
    dotfield.appendChild(frag);
  }
  buildDots();

  // animate dots in proportion to scroll progress through the section
  const scaleSection = $('#s-scale');
  const dots = dotfield ? $$('circle', dotfield) : [];
  let lastShown = -1;

  function updateDots() {
    if (!scaleSection || dots.length === 0) return;
    const rect = scaleSection.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress 0..1 across the section
    const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height * 0.6)));
    const target = Math.floor(p * TOTAL);
    if (target === lastShown) return;

    if (target > lastShown) {
      for (let i = lastShown + 1; i <= target; i++) {
        if (dots[i]) dots[i].setAttribute('opacity', '1');
      }
    } else {
      for (let i = lastShown; i > target; i--) {
        if (dots[i]) dots[i].setAttribute('opacity', '0');
      }
    }
    lastShown = target;
    if (counter) counter.textContent = Math.max(0, target).toLocaleString();
  }
  window.addEventListener('scroll', updateDots, { passive: true });
  window.addEventListener('resize', updateDots);
  updateDots();

  // ---------- Close-scene lights ----------
  const closeLights = document.querySelector('.close-lights');
  if (closeLights) {
    const svgNS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * 360;
      const y = 130 + Math.random() * 70;
      const w = 1.4 + Math.random() * 1.6;
      const h = 1.6 + Math.random() * 2.4;
      const r = document.createElementNS(svgNS, 'rect');
      r.setAttribute('x', x.toFixed(1));
      r.setAttribute('y', y.toFixed(1));
      r.setAttribute('width', w.toFixed(1));
      r.setAttribute('height', h.toFixed(1));
      r.setAttribute('fill', '#FFC58A');
      r.setAttribute('opacity', (0.4 + Math.random() * 0.5).toFixed(2));
      closeLights.appendChild(r);
    }
    // a few brighter "warm" anchor lights
    for (let i = 0; i < 8; i++) {
      const x = 30 + Math.random() * 300;
      const y = 140 + Math.random() * 50;
      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', x.toFixed(1));
      c.setAttribute('cy', y.toFixed(1));
      c.setAttribute('r', 1.2);
      c.setAttribute('fill', '#FFD9A8');
      closeLights.appendChild(c);
    }
  }

  // ---------- Hero parallax (light) ----------
  const heroArt = document.querySelector('.hero-art');
  function heroParallax() {
    if (!heroArt) return;
    const y = Math.min(window.scrollY, 400);
    heroArt.style.transform = `translateY(${y * 0.18}px)`;
  }
  window.addEventListener('scroll', heroParallax, { passive: true });
  heroParallax();
})();

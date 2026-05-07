/* KDP Recap — scroll-driven motion */

(function () {
  'use strict';

  const $ = (s, root) => (root || document).querySelector(s);
  const $$ = (s, root) => Array.from((root || document).querySelectorAll(s));

  // ============ Build dollar grid (100 cents) ============
  const grid = $('#dollarGrid');
  // costs in order: 46 cost-of-rev, 20 SG&A, 7 D&A, 5 Mkt, 3 interest = 81; remainder = 19 survive
  const buckets = [
    { n: 46, c: '#E05C5C' },
    { n: 20, c: '#5B8FD4' },
    { n:  7, c: '#F5A623' },
    { n:  5, c: '#7BC67E' },
    { n:  3, c: '#A78BFA' },
    { n: 19, c: '#1A1917', survives: true }, // black survivors
  ];
  let cents = [];
  let order = [];
  for (let b = 0; b < buckets.length; b++) {
    for (let i = 0; i < buckets[b].n; i++) {
      const cell = document.createElement('div');
      cell.className = 'cent';
      cell.dataset.color = buckets[b].c;
      if (buckets[b].survives) cell.classList.add('survives');
      cell.style.background = buckets[b].c;
      grid.appendChild(cell);
      cents.push(cell);
      order.push(cents.length - 1);
    }
  }

  // ============ Chrome scroll progress ============
  const fill = $('#chromeFill');
  function updateChrome() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, max)));
    fill.style.right = ((1 - p) * 100) + '%';
  }
  document.addEventListener('scroll', updateChrome, { passive: true });
  window.addEventListener('resize', updateChrome);

  // ============ Hero pour drawn down with scroll ============
  const pourStream = $('#pourStream');
  const drops = $$('#drops circle');
  const heroSection = $('.hero');
  function updateHero() {
    if (!heroSection || !pourStream) return;
    const r = heroSection.getBoundingClientRect();
    const total = r.height;
    // progress 0 → 1 across the hero
    const visible = Math.max(0, Math.min(total, total - r.top));
    const p = Math.max(0, Math.min(1, visible / (total * 0.9)));
    pourStream.style.transform = `scaleY(${p})`;
    drops.forEach((d, i) => {
      const start = 0.2 + i * 0.15;
      const o = Math.max(0, Math.min(1, (p - start) * 4));
      d.style.opacity = o;
      d.setAttribute('transform', `translate(0, ${(1 - o) * -10})`);
    });
  }
  document.addEventListener('scroll', updateHero, { passive: true });

  // ============ Number count-up ============
  function formatNum(el, value) {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const fmt = el.dataset.format || '';
    let str;
    if (fmt === 'comma') {
      str = Math.round(value).toLocaleString('en-US');
    } else {
      str = value.toFixed(decimals);
    }
    el.textContent = prefix + str + suffix;
  }
  function animateNumber(el) {
    if (el.dataset.played) return;
    el.dataset.played = '1';
    const target = parseFloat(el.dataset.count);
    const dur = 1200;
    const start = performance.now();
    function tick(t) {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      formatNum(el, target * eased);
      if (k < 1) requestAnimationFrame(tick);
      else formatNum(el, target);
    }
    formatNum(el, 0);
    requestAnimationFrame(tick);
  }

  // ============ IntersectionObserver — generic reveals + triggers ============
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // count-up numbers
      if (el.classList.contains('num') && el.dataset.count) {
        animateNumber(el);
      }

      // generic reveals
      if (el.classList.contains('enter-up')) {
        el.classList.add('visible');
      }

      // dollar grid: stagger-fill
      if (el === grid) {
        cents.forEach((c, i) => {
          setTimeout(() => c.classList.add('active'), i * 18);
        });
      }

      // margin bars
      if (el.classList.contains('bar-fill')) {
        const pct = parseFloat(el.dataset.pct || '0');
        el.style.width = pct + '%';
      }

      // growth arrow draw
      if (el.id === 'growthArrow') {
        const line = $('#growthLine');
        const dot = $('#growthDot');
        if (line) line.style.strokeDashoffset = '0';
        if (dot) dot.style.opacity = '1';
      }

      // beam tilt (debt-heavy → tip right)
      if (el.id === 'beam') {
        // debt 16.1 vs equity 25.5 — but in a recap tone we want to show the weight
        // tilt slightly toward debt side to dramatize leverage
        el.style.transform = 'rotate(6deg)';
      }

      io.unobserve(el);
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });

  $$('.num').forEach((n) => io.observe(n));
  $$('.bar-fill').forEach((b) => io.observe(b));
  $$('.enter-up').forEach((e) => io.observe(e));
  if (grid) io.observe(grid);
  const ga = $('#growthArrow'); if (ga) io.observe(ga);
  const beam = $('#beam'); if (beam) io.observe(beam);

  // ============ Scroll-bound: streams falling + beakers filling ============
  const streamsBeat = $('[data-beat="streams"]');
  const streamFalls = $$('.stream-fall');
  const beakerFills = $$('.beaker-fill');

  function streamProgress() {
    if (!streamsBeat) return;
    const r = streamsBeat.getBoundingClientRect();
    const winH = window.innerHeight;
    const start = winH * 0.85;
    const end = winH * 0.1;
    const p = Math.max(0, Math.min(1, (start - r.top) / (start - end)));

    // staggered falls
    streamFalls.forEach((s, i) => {
      const delay = i * 0.12;
      const sub = Math.max(0, Math.min(1, (p - delay) / 0.3));
      const fallH = sub * 186; // top of beaker at y=260; stream starts at y=74
      s.setAttribute('height', fallH);
    });
    beakerFills.forEach((b, i) => {
      const delay = 0.18 + i * 0.12;
      const sub = Math.max(0, Math.min(1, (p - delay) / 0.4));
      // KDP segments visual share — refreshment biggest, coffee mid, intl small
      const targetH = [62, 50, 30][i] || 40;
      const h = sub * targetH;
      b.setAttribute('height', h);
      b.setAttribute('y', 78 - h);
    });
  }

  // ============ Scroll-bound: footprint pour ============
  const fpBeat = $('[data-beat="footprint"]');
  const fpPour = $('.fp-pour');
  function fpProgress() {
    if (!fpBeat || !fpPour) return;
    const r = fpBeat.getBoundingClientRect();
    const winH = window.innerHeight;
    const p = Math.max(0, Math.min(1, (winH * 0.8 - r.top) / (winH * 0.6)));
    fpPour.setAttribute('height', p * 95);
  }

  // ============ Scroll-bound: bet split fills ============
  const betBeat = $('[data-beat="bet"]');
  const splitFills = $$('.split-fill');
  function splitProgress() {
    if (!betBeat) return;
    const r = betBeat.getBoundingClientRect();
    const winH = window.innerHeight;
    const p = Math.max(0, Math.min(1, (winH * 0.85 - r.top) / (winH * 0.7)));
    splitFills.forEach((f, i) => {
      const delay = i * 0.15;
      const sub = Math.max(0, Math.min(1, (p - delay) / 0.5));
      const target = 88;
      const h = sub * target;
      f.setAttribute('height', h);
      f.setAttribute('y', 120 - h);
    });
  }

  // ============ Scroll-bound: takeaway final pour ============
  const tkBeat = $('[data-beat="takeaway"]');
  const finalStreams = $$('.final-stream');
  const finalFills = $$('.final-fill');
  function takeawayProgress() {
    if (!tkBeat) return;
    const r = tkBeat.getBoundingClientRect();
    const winH = window.innerHeight;
    const p = Math.max(0, Math.min(1, (winH * 0.85 - r.top) / (winH * 0.7)));

    finalStreams.forEach((s, i) => {
      const delay = i * 0.1;
      const sub = Math.max(0, Math.min(1, (p - delay) / 0.4));
      s.setAttribute('height', sub * 180);
    });
    finalFills.forEach((f, i) => {
      const delay = 0.25 + i * 0.1;
      const sub = Math.max(0, Math.min(1, (p - delay) / 0.5));
      const target = 116;
      const h = sub * target;
      f.setAttribute('height', h);
      f.setAttribute('y', 130 - h);
    });
  }

  // ============ rAF ticker ============
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateChrome();
      updateHero();
      streamProgress();
      fpProgress();
      splitProgress();
      takeawayProgress();
      ticking = false;
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // ============ Apply enter-up to body content for graceful reveal ============
  $$('.beat .section-h, .beat .section-lede, .beat .eyebrow, .stream-card, .sg-tile, .cost-foot, .fp-foot, .weight-foot, .closing, .compete-foot, .bn-row').forEach((el) => {
    el.classList.add('enter-up');
    io.observe(el);
  });

})();

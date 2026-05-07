// =====================================================
// HOOD Recap — scroll behaviors & metaphor scene wiring
// =====================================================

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---------- Scroll progress hairline ----------
  const progressBar = $('#progressBar');
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progressBar.style.width = (p * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Decorative candle ticker in hero ----------
  const candles = $('#candles');
  if (candles) {
    const N = 56;
    let html = '';
    for (let i = 0; i < N; i++) {
      const isRed = Math.random() < 0.28;
      const h = 8 + Math.random() * Math.random() * 100;
      html += `<div class="c${isRed ? ' red' : ''}" style="height:${h}px"></div>`;
    }
    candles.innerHTML = html;
  }

  // ---------- 27M dot cloud ----------
  const dotcloud = $('#dotcloud');
  if (dotcloud) {
    const COLS = 20, ROWS = 10; // 200 dots
    let html = '';
    for (let i = 0; i < COLS * ROWS; i++) html += '<div class="d"></div>';
    dotcloud.innerHTML = html;
    // 27M / 135K ≈ 200 lit, but we want representation: actually fully lit would be uninteresting.
    // Light ~85% to convey "almost everyone in this 200-dot grid".
    const dots = $$('.d', dotcloud);
    const total = dots.length;
    // pre-shuffle indices
    const order = dots.map((_, i) => i).sort(() => Math.random() - 0.5);
    let lit = 0;
    const TARGET = Math.round(total * 0.85);
    const ioCloud = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        // animate lighting
        order.slice(0, TARGET).forEach((idx, k) => {
          setTimeout(() => dots[idx].classList.add('lit'), k * 8);
        });
        ioCloud.disconnect();
      });
    }, { threshold: 0.3 });
    ioCloud.observe(dotcloud);
  }

  // ---------- Dollar grid (100 cells) ----------
  const dollarGrid = $('#dollarGrid');
  if (dollarGrid) {
    // Color sequence per the JSON (truncated to ~64 spent cents; 36 remain dim)
    const buckets = [
      { color: '#E07B54', n: 18 }, // G&A
      { color: '#F2C94C', n: 14 }, // SBC
      { color: '#4F86C6', n: 12 }, // Tech
      { color: '#6DBF82', n: 10 }, // Ops
      { color: '#A97DC9', n: 10 }, // Marketing
    ];
    let html = '';
    for (let i = 0; i < 100; i++) html += `<div class="cell" data-i="${i}"></div>`;
    dollarGrid.innerHTML = html;
    const cells = $$('.cell', dollarGrid);
    let cursor = 0;
    const plan = [];
    buckets.forEach((b) => {
      for (let j = 0; j < b.n; j++) plan.push({ idx: cursor++, color: b.color });
    });
    const ioDollar = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        plan.forEach((p, k) => {
          setTimeout(() => {
            const c = cells[p.idx];
            if (!c) return;
            c.style.background = p.color;
            c.classList.add('lit');
          }, 30 + k * 22);
        });
        ioDollar.disconnect();
      });
    }, { threshold: 0.35 });
    ioDollar.observe(dollarGrid);
  }

  // ---------- Count-ups ----------
  function animateCount(el) {
    if (el.dataset.done) return;
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    el.dataset.done = '1';
    function step(t) {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = target * eased;
      const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
      // Preserve any inner <span class="unit"> tail
      const unitEl = el.querySelector('.unit');
      const unit = unitEl ? unitEl.outerHTML : '';
      el.innerHTML = prefix + formatted + suffix + unit;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counters = $$('[data-count]');
  const ioCount = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        ioCount.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => ioCount.observe(c));

  // ---------- Bar reveals (streams + competitors) ----------
  const bars = $$('.stream-row, .comp .row');
  const ioBars = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        ioBars.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach((b) => ioBars.observe(b));

  // ---------- General reveal-on-scroll ----------
  const revealEls = $$('.reveal, .display.lede, .display.pull, .interlude, .ticks .tick, .bet .move, .geo .map-wrap, .geo .row, .dollar, .footer .small');
  revealEls.forEach((el) => el.classList.add('reveal'));
  const ioReveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        ioReveal.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  revealEls.forEach((el) => ioReveal.observe(el));

  // ---------- Subtle parallax on hero glow ----------
  const heroGlow = $('.hero-glow');
  if (heroGlow) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 600);
      heroGlow.style.transform = `translateY(${y * 0.18}px)`;
    }, { passive: true });
  }
})();

/* MO Recap — scroll & interactivity */

(function () {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  /* ---------- 1. Scroll progress hairline ---------- */
  const progress = $('#progress');
  function updateProgress() {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    const pct = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- 2. Reveal-on-scroll ---------- */
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // For elements that need staggered child reveals, trigger them
        if (e.target.dataset.staggerSel) {
          const kids = $$(e.target.dataset.staggerSel, e.target);
          kids.forEach((k, i) => {
            k.style.transitionDelay = `${i * 60}ms`;
            k.classList.add('in');
          });
        }
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

  $$('section, .reset, .hero-copy, .scale-stats > *, .weight-stats > *, .div-stack > *, .ss, .ws, .ds, .cl').forEach(el => {
    el.classList.add('reveal');
    ro.observe(el);
  });

  /* ---------- 3. Dot grid (Marlboro 42% of 100 packs) ---------- */
  const dotgrid = $('#dotgrid');
  if (dotgrid) {
    // Distribute 42 lit cigarettes pseudo-randomly but stable
    const litIdx = new Set();
    const seed = [3, 7, 12, 18, 21, 24, 28, 31, 35, 39, 42, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98, 1, 6, 14, 20, 27, 33, 41, 48, 55, 63, 70, 78, 84];
    seed.forEach(i => litIdx.add(i));
    for (let i = 0; i < 100; i++) {
      const d = document.createElement('div');
      d.className = 'pc' + (litIdx.has(i) ? ' lit' : '');
      dotgrid.appendChild(d);
    }
  }

  /* ---------- 4. Cents grid + cost list ---------- */
  const costs = [
    { pct: 24, color: '#E05C5C', label: 'Cost of revenue (excise + COGS)' },
    { pct: 14, color: '#F4A261', label: 'Selling, general & administrative' },
    { pct: 8,  color: '#E9C46A', label: 'Tobacco settlement & litigation' },
    { pct: 7,  color: '#2A9D8F', label: 'Amortization & impairments' },
    { pct: 3,  color: '#457B9D', label: 'Research & development' }
  ];
  const cents = $('#cents');
  if (cents) {
    // Build 100 cents; assign each one a cost-bucket color in order; remainder = profit (gold)
    const totalCost = costs.reduce((a, c) => a + c.pct, 0); // 56
    const cellColors = [];
    costs.forEach(c => { for (let i = 0; i < c.pct; i++) cellColors.push(c.color); });
    while (cellColors.length < 100) cellColors.push(null); // null = profit/surplus

    cellColors.forEach((color, i) => {
      const c = document.createElement('div');
      c.className = 'c' + (color === null ? ' profit' : '');
      if (color) c.style.background = color;
      c.style.transitionDelay = `${i * 6}ms`;
      cents.appendChild(c);
    });
  }
  // Cost list
  const costList = $('#costList');
  if (costList) {
    costs.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="swatch" style="background:${c.color}"></span>
        <span class="lbl">${c.label}</span>
        <span class="pct">${c.pct}¢</span>`;
      costList.appendChild(li);
    });
    // Profit row
    const profit = document.createElement('li');
    profit.innerHTML = `
      <span class="swatch" style="background:linear-gradient(135deg,#ffd28a,#B8853A)"></span>
      <span class="lbl"><em style="color:var(--ember);font-family:var(--font-display);font-style:italic;">Operating profit (what survives)</em></span>
      <span class="pct" style="color:var(--ember-deep)">~44¢</span>`;
    costList.appendChild(profit);
  }

  /* ---------- 5. Volume vs Price scrubbed reveal ---------- */
  const vp = $('.volprice');
  const vpVol = $('#vp-vol');
  const vpPrice = $('#vp-price');
  const vpCross = $('.vp-cross');
  if (vp && vpVol && vpPrice) {
    let drawn = false;
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !drawn) {
          drawn = true;
          vpVol.style.transition = 'stroke-dashoffset 1800ms cubic-bezier(0.22,1,0.36,1)';
          vpPrice.style.transition = 'stroke-dashoffset 1800ms 200ms cubic-bezier(0.22,1,0.36,1)';
          vpVol.style.strokeDashoffset = 0;
          vpPrice.style.strokeDashoffset = 0;
          setTimeout(() => {
            vpCross.style.transition = 'opacity 400ms ease';
            vpCross.style.opacity = 1;
          }, 1400);
        }
      });
    }, { threshold: 0.4 });
    vio.observe(vp);
  }

  /* ---------- 6. Big-percentage count up ---------- */
  const bigPct = $('.big-pct');
  if (bigPct) {
    const target = parseInt(bigPct.dataset.target, 10);
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          let cur = 0;
          const start = performance.now();
          const dur = 1400;
          function tick(now) {
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            cur = Math.round(eased * target);
            bigPct.textContent = cur + '%';
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          cio.unobserve(bigPct);
        }
      });
    }, { threshold: 0.5 });
    cio.observe(bigPct);
  }

  /* ---------- 7. Pouch battle bars ---------- */
  const pb = $('.pouch-battle');
  if (pb) {
    const pio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          $('.pb-fill.zyn').style.width = '62%';
          $('.pb-fill.on').style.width = '12%';
          pio.unobserve(pb);
        }
      });
    }, { threshold: 0.4 });
    pio.observe(pb);
  }

  /* ---------- 8. Segment bar reveal ---------- */
  const seg = $('.seg-bar');
  if (seg) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          $$('.seg-piece').forEach(p => p.classList.add('in'));
          sio.unobserve(seg);
        }
      });
    }, { threshold: 0.4 });
    sio.observe(seg);
  }

  /* ---------- 9. Bubble pop reveal ---------- */
  const bubbles = $('#bubbles');
  if (bubbles) {
    const bio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          $$('.bb', bubbles).forEach((b, i) => {
            setTimeout(() => b.classList.add('in'), i * 140);
          });
          bio.unobserve(bubbles);
        }
      });
    }, { threshold: 0.3 });
    bio.observe(bubbles);
  }

  /* ---------- 10. Competitor accordion ---------- */
  $$('.cl').forEach(li => {
    const head = $('.cl-head', li);
    head.addEventListener('click', () => {
      li.classList.toggle('open');
    });
  });
  // Open the PM card by default — it's the most important
  const firstComp = $('.cl[data-key="pm"]');
  if (firstComp) firstComp.classList.add('open');

  /* ---------- 11. Dividend coin rain ---------- */
  const coinsG = $('.coins');
  if (coinsG) {
    const NS = 'http://www.w3.org/2000/svg';
    const coinCount = 22;
    for (let i = 0; i < coinCount; i++) {
      const c = document.createElementNS(NS, 'ellipse');
      const x = 80 + Math.random() * 200;
      const delay = Math.random() * 4;
      const dur = 3 + Math.random() * 2;
      c.setAttribute('cx', x);
      c.setAttribute('cy', 60);
      c.setAttribute('rx', 5 + Math.random() * 3);
      c.setAttribute('ry', 1.6);
      c.setAttribute('class', 'coin');
      c.style.fill = 'url(#coinG)';
      c.style.transformOrigin = `${x}px 60px`;
      c.style.animation = `coinFall ${dur}s ${delay}s linear infinite`;
      coinsG.appendChild(c);
    }
    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes coinFall {
        0% { transform: translateY(0) rotateX(0); opacity: 0; }
        10% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateY(180px) rotateX(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------- 12. Smoke parallax (hero) ---------- */
  const smoke = $('.smoke-back');
  const cig = $('.cig');
  if (smoke && cig) {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        smoke.style.transform = `translateY(${y * 0.32}px)`;
        cig.style.transform = `translateX(-50%) translateY(${y * 0.18}px)`;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

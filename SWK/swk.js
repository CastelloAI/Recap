// SWK Recap · scroll-driven page logic
(function () {
  'use strict';

  /* ---------- Sticky chrome scroll progress ---------- */
  const fill = document.getElementById('chromeFill');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    if (fill) fill.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- Tape ticks (hero) ---------- */
  (function buildTapeTicks() {
    const g = document.getElementById('tapeTicks');
    if (!g) return;
    // Distribute ticks roughly along the curved path. We sample by t along a quadratic.
    const SVG_NS = 'http://www.w3.org/2000/svg';
    // Sample the path with native getPointAtLength
    const path = document.getElementById('tapePath');
    if (!path) return;
    const len = path.getTotalLength();
    const N = 24;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const pt = path.getPointAtLength(t * len);
      // tangent
      const pt2 = path.getPointAtLength(Math.min(len, t * len + 1));
      const dx = pt2.x - pt.x, dy = pt2.y - pt.y;
      const mag = Math.hypot(dx, dy) || 1;
      const nx = -dy / mag, ny = dx / mag;
      const major = i % 4 === 0;
      const inset = major ? 7 : 4;
      const x1 = pt.x + nx * 2; const y1 = pt.y + ny * 2;
      const x2 = pt.x + nx * (2 + inset); const y2 = pt.y + ny * (2 + inset);
      const tick = document.createElementNS(SVG_NS, 'line');
      tick.setAttribute('x1', x1); tick.setAttribute('y1', y1);
      tick.setAttribute('x2', x2); tick.setAttribute('y2', y2);
      tick.setAttribute('stroke', '#1a1a1a');
      tick.setAttribute('stroke-width', major ? 1 : 0.6);
      g.appendChild(tick);
    }
  })();

  /* ---------- Pegboard dots (workbench backdrop + footprint map) ---------- */
  function fillPegboard(g, w, h, gx = 16, gy = 16, r = 1.2) {
    if (!g) return;
    const SVG_NS = 'http://www.w3.org/2000/svg';
    for (let y = gy / 2; y < h; y += gy) {
      for (let x = gx / 2; x < w; x += gx) {
        const c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r);
        g.appendChild(c);
      }
    }
  }
  fillPegboard(document.getElementById('pegboard'), 360, 200, 16, 16, 1.2);
  fillPegboard(document.getElementById('pegMapDots'), 360, 320, 14, 14, 1);

  /* ---------- Ruler ticks + scrubbed revenue counter ---------- */
  (function buildRuler() {
    const ticks = document.getElementById('rulerTicks');
    const labels = document.getElementById('rulerLabels');
    if (!ticks) return;
    const SVG_NS = 'http://www.w3.org/2000/svg';
    // 16 increments across; major every 4
    const N = 16;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * 360;
      const major = i % 4 === 0;
      const t = document.createElementNS(SVG_NS, 'line');
      t.setAttribute('x1', x); t.setAttribute('x2', x);
      t.setAttribute('y1', 20);
      t.setAttribute('y2', major ? 38 : 30);
      t.setAttribute('stroke', '#1a1a1a');
      t.setAttribute('stroke-width', major ? 1 : 0.6);
      ticks.appendChild(t);
      if (major && labels) {
        const lbl = document.createElementNS(SVG_NS, 'text');
        const dollarMark = (i / N) * 16; // $0..$16B
        lbl.setAttribute('x', x);
        lbl.setAttribute('y', 14);
        lbl.setAttribute('text-anchor', i === 0 ? 'start' : i === N ? 'end' : 'middle');
        lbl.textContent = '$' + dollarMark + 'B';
        labels.appendChild(lbl);
      }
    }
  })();

  /* ---------- Revenue counter scrubs as the user scrolls past the scale section ---------- */
  const revNum = document.getElementById('revNum');
  const scaleSection = document.querySelector('.scale');
  function fmtRev(v) {
    return '$' + v.toFixed(2) + 'B';
  }
  function updateRev() {
    if (!revNum || !scaleSection) return;
    const rect = scaleSection.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when section bottom is at viewport bottom; 1 when section top hits viewport top
    const total = rect.height + vh * 0.4;
    const traveled = vh - rect.top;
    let p = traveled / total;
    p = Math.max(0, Math.min(1, p));
    // ease
    const eased = 1 - Math.pow(1 - p, 2.4);
    const v = eased * 15.13;
    revNum.textContent = fmtRev(v);
  }
  window.addEventListener('scroll', updateRev, { passive: true });
  window.addEventListener('resize', updateRev);
  updateRev();

  /* ---------- 100-cent grid ---------- */
  (function buildCents() {
    const grid = document.getElementById('centsGrid');
    const legend = document.getElementById('centsLegend');
    if (!grid) return;

    const costs = [
      { pct: 70, color: '#2563EB', label: 'Cost of Revenue' },
      { pct: 14, color: '#16A34A', label: 'SG&A' },
      { pct: 4,  color: '#D97706', label: 'Depreciation & Amortization' },
      { pct: 3,  color: '#DC2626', label: 'Restructuring & Transformation' },
      { pct: 2,  color: '#7C3AED', label: 'Interest Expense' },
    ];
    const used = costs.reduce((a, c) => a + c.pct, 0);
    const surplus = 100 - used; // 7

    // Build sequence of 100 colors
    const seq = [];
    costs.forEach(c => {
      for (let i = 0; i < c.pct; i++) seq.push({ color: c.color, group: c.label });
    });
    for (let i = 0; i < surplus; i++) seq.push({ color: '#0E0D0C', group: 'surplus' });

    // Render dots
    seq.forEach((d, i) => {
      const el = document.createElement('div');
      el.className = 'cent' + (d.group === 'surplus' ? ' surplus' : '');
      el.style.background = d.color;
      el.dataset.idx = i;
      grid.appendChild(el);
    });

    // Legend
    costs.forEach(c => {
      const row = document.createElement('div');
      row.className = 'lg-row';
      row.innerHTML = `
        <span class="lg-swatch" style="background:${c.color}"></span>
        <span class="lg-label">${c.label}</span>
        <span class="lg-pct">${c.pct}¢</span>
      `;
      legend.appendChild(row);
    });
    const surplusRow = document.createElement('div');
    surplusRow.className = 'lg-row lg-row--surplus';
    surplusRow.innerHTML = `
      <span class="lg-swatch" style="background:#0E0D0C"></span>
      <span class="lg-label"><em>What survives</em> — operating + other</span>
      <span class="lg-pct">${surplus}¢</span>
    `;
    legend.appendChild(surplusRow);

    // Light up surplus dots when section enters view
    const centsSection = document.querySelector('.costs');
    let lit = false;
    function maybeLight() {
      if (lit || !centsSection) return;
      const rect = centsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.55) {
        lit = true;
        const dots = grid.querySelectorAll('.cent.surplus');
        dots.forEach((d, i) => {
          setTimeout(() => d.classList.add('lit'), 60 * i);
        });
      }
    }
    window.addEventListener('scroll', maybeLight, { passive: true });
    maybeLight();
  })();

  /* ---------- IntersectionObserver fade-ins on beat headers ---------- */
  (function initReveals() {
    const targets = document.querySelectorAll(
      '.beat-h, .beat-lede, .hero-title, .hero-lede, .close-h, .close-lede, .reset-line, .footnote, .rival, .scell, .wcell, .hstat'
    );
    targets.forEach(t => t.classList.add('fade-in'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    targets.forEach(t => io.observe(t));
  })();

  /* ---------- Animate rival bars when in view ---------- */
  (function rivalBars() {
    const bars = document.querySelectorAll('.rb-bar');
    const widths = Array.from(bars).map(b => b.style.width);
    bars.forEach(b => { b.style.width = '0%'; });
    const rivalSec = document.querySelector('.rivals');
    let done = false;
    function maybe() {
      if (done || !rivalSec) return;
      const r = rivalSec.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.7) {
        done = true;
        bars.forEach((b, i) => {
          setTimeout(() => { b.style.width = widths[i]; }, 100 + i * 130);
        });
      }
    }
    window.addEventListener('scroll', maybe, { passive: true });
    maybe();
  })();
})();

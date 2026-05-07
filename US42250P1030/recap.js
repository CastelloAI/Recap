/* =====================================================================
   DOC · Healthpeak Recap — scroll-driven interactions
   ===================================================================== */

// ---------- 1. Scroll progress ----------
const progressFill = document.getElementById('progressFill');
function updateProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
  progressFill.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ---------- 2. In-view observer ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      // also mark child .wing as in-view for staggered bar fills
      e.target.querySelectorAll('.wing').forEach(w => w.classList.add('in-view'));
      e.target.querySelectorAll('.bet-item').forEach(b => b.classList.add('in-view'));
    }
  });
}, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.beat, .close, .reset-dark, .map-wrap, .cost-building').forEach(el => observer.observe(el));

// ---------- 3. Hero building grid (background) ----------
(function buildHeroGrid() {
  const wrap = document.getElementById('heroGrid');
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 440 900');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');

  // Plan-view footprints — small rectangles in a slightly-jittered grid
  const cols = 11, rows = 22;
  const cellW = 440 / cols, cellH = 900 / rows;
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < 0.35) continue; // gaps
      const cx = c * cellW + cellW * 0.5 + (Math.random() - 0.5) * 4;
      const cy = r * cellH + cellH * 0.5 + (Math.random() - 0.5) * 4;
      const w = 8 + Math.random() * 14;
      const h = 6 + Math.random() * 10;
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', cx - w/2);
      rect.setAttribute('y', cy - h/2);
      rect.setAttribute('width', w);
      rect.setAttribute('height', h);
      rect.setAttribute('fill', 'none');
      rect.setAttribute('stroke', '#CFCBC0');
      rect.setAttribute('stroke-width', '0.6');
      // sprinkle a few coral
      if (Math.random() < 0.06) {
        rect.setAttribute('fill', '#FF7A57');
        rect.setAttribute('stroke', '#FF7A57');
        rect.setAttribute('opacity', '0.85');
      }
      svg.appendChild(rect);
      count++;
      if (count >= 689) break;
    }
    if (count >= 689) break;
  }
  wrap.appendChild(svg);
})();

// ---------- 4. Hero count-up (scroll-tied for first viewport, then fixed) ----------
(function heroCountUp() {
  const el = document.getElementById('heroCount');
  const target = 689;
  let started = false;
  function go() {
    if (started) return;
    started = true;
    const t0 = performance.now();
    const dur = 1400;
    function tick(now) {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  // small delay after load
  setTimeout(go, 300);
})();

// ---------- 5. Scale tessellation — 689 tiny building footprints ----------
(function scaleTess() {
  const svg = document.getElementById('scaleTessSvg');
  const NS = 'http://www.w3.org/2000/svg';
  const W = 380, H = 220;
  const cols = 31, rows = 23; // 31*23 = 713 cells
  const cellW = W / cols;
  const cellH = H / rows;

  let drawn = 0;
  for (let r = 0; r < rows && drawn < 689; r++) {
    for (let c = 0; c < cols && drawn < 689; c++) {
      const x = c * cellW + cellW * 0.18;
      const y = r * cellH + cellH * 0.22;
      const w = cellW * 0.6;
      const h = cellH * 0.55;
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', x.toFixed(2));
      rect.setAttribute('y', y.toFixed(2));
      rect.setAttribute('width', w.toFixed(2));
      rect.setAttribute('height', h.toFixed(2));
      // First 530 = outpatient (ink), next 139 = lab (coral), last ~20 = senior (paper-3)
      let fill = '#141414';
      if (drawn >= 530 && drawn < 669) fill = '#F25A37';
      else if (drawn >= 669) fill = '#A4A29C';
      rect.setAttribute('fill', fill);
      rect.setAttribute('opacity', '0');
      // staggered fade-in tied to in-view
      rect.style.transition = `opacity 800ms var(--ease-out) ${drawn * 1.2}ms`;
      svg.appendChild(rect);
      drawn++;
    }
  }
  // reveal once parent in view
  const parent = document.getElementById('scaleTess');
  const io = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (e.isIntersecting) {
        svg.querySelectorAll('rect').forEach(r => r.setAttribute('opacity', r.getAttribute('fill') === '#A4A29C' ? '0.7' : '1'));
        // count-up
        const numEl = document.getElementById('scaleNum');
        const t0 = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - t0) / 1500);
          const eased = 1 - Math.pow(1 - t, 3);
          numEl.textContent = Math.round(eased * 689);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(parent);
})();

// ---------- 6. Cost building floors ----------
(function costBuilding() {
  const data = [
    { pct: 28, color: '#4A90D9', label: 'Property operating' },
    { pct: 22, color: '#E67E22', label: 'Depreciation & amort.' },
    { pct: 16, color: '#8E44AD', label: 'Interest expense' },
    { pct: 5,  color: '#27AE60', label: 'General & admin.' },
    { pct: 5,  color: '#E74C3C', label: 'Development & leasing' },
  ];

  const NS = 'http://www.w3.org/2000/svg';
  const floors = document.getElementById('costFloors');

  // Building inner area: x 40..280 (240w), y 40..510 (470h)
  // Each floor sized proportional to pct, top-down
  const top = 40;
  const bottom = 510;
  const totalH = bottom - top;
  const totalPct = data.reduce((s, d) => s + d.pct, 0); // 76; remaining = margin

  let cursor = top;
  // Add a small gap between floors
  const floorGap = 4;
  const floorTotalCount = data.length + 1; // +1 for "what survives"
  const usableH = totalH - (floorTotalCount - 1) * floorGap;

  data.forEach((d, i) => {
    const fh = (d.pct / 100) * usableH;
    const g = document.createElementNS(NS, 'g');

    // Background slot
    const slot = document.createElementNS(NS, 'rect');
    slot.setAttribute('x', 40);
    slot.setAttribute('y', cursor);
    slot.setAttribute('width', 240);
    slot.setAttribute('height', fh);
    slot.setAttribute('fill', '#F4F2ED');
    g.appendChild(slot);

    // Filled bar (animated)
    const bar = document.createElementNS(NS, 'rect');
    bar.setAttribute('x', 40);
    bar.setAttribute('y', cursor);
    bar.setAttribute('width', 240);
    bar.setAttribute('height', fh);
    bar.setAttribute('fill', d.color);
    bar.setAttribute('class', 'cost-floor-bar');
    bar.style.transitionDelay = (i * 140) + 'ms';
    g.appendChild(bar);

    // Floor divider
    if (i > 0) {
      const div = document.createElementNS(NS, 'line');
      div.setAttribute('x1', 40); div.setAttribute('x2', 280);
      div.setAttribute('y1', cursor - floorGap/2);
      div.setAttribute('y2', cursor - floorGap/2);
      div.setAttribute('stroke', '#141414');
      div.setAttribute('stroke-width', '0.6');
      g.appendChild(div);
    }

    // Label inside the floor (right side)
    const labelY = cursor + fh / 2 + 3;
    const lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', 50);
    lbl.setAttribute('y', labelY);
    lbl.setAttribute('class', 'cost-floor-label');
    lbl.setAttribute('fill', '#FBFAF7');
    lbl.textContent = d.label;
    g.appendChild(lbl);

    const pct = document.createElementNS(NS, 'text');
    pct.setAttribute('x', 270);
    pct.setAttribute('y', labelY);
    pct.setAttribute('text-anchor', 'end');
    pct.setAttribute('class', 'cost-floor-pct');
    pct.setAttribute('fill', '#FBFAF7');
    pct.textContent = '−' + d.pct + '¢';
    g.appendChild(pct);

    floors.appendChild(g);
    cursor += fh + floorGap;
  });

  // What survives — bottom slot
  const remaining = bottom - cursor;
  const g = document.createElementNS(NS, 'g');
  const survive = document.createElementNS(NS, 'rect');
  survive.setAttribute('x', 40);
  survive.setAttribute('y', cursor);
  survive.setAttribute('width', 240);
  survive.setAttribute('height', remaining);
  survive.setAttribute('fill', 'none');
  survive.setAttribute('stroke', '#F25A37');
  survive.setAttribute('stroke-width', '1');
  survive.setAttribute('stroke-dasharray', '3 3');
  g.appendChild(survive);

  const slbl = document.createElementNS(NS, 'text');
  slbl.setAttribute('x', 50);
  slbl.setAttribute('y', cursor + remaining/2 - 2);
  slbl.setAttribute('class', 'cost-floor-label');
  slbl.setAttribute('fill', '#F25A37');
  slbl.textContent = 'What survives';
  g.appendChild(slbl);

  const sub = document.createElementNS(NS, 'text');
  sub.setAttribute('x', 50);
  sub.setAttribute('y', cursor + remaining/2 + 12);
  sub.setAttribute('class', 'cost-floor-pct');
  sub.setAttribute('fill', '#F25A37');
  sub.setAttribute('font-style', 'italic');
  sub.textContent = '~24¢ margin';
  g.appendChild(sub);

  floors.appendChild(g);

  // Build legend
  const legend = document.getElementById('costLegend');
  data.forEach(d => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="cost-legend-sw" style="background:${d.color}"></span><span>${d.label}</span><span class="cost-legend-pct">${d.pct}¢</span>`;
    legend.appendChild(li);
  });
  // remaining
  const li = document.createElement('li');
  li.innerHTML = `<span class="cost-legend-sw" style="background:transparent;border:1px dashed #F25A37"></span><span><em style="font-family:var(--font-display);font-style:italic;color:#F25A37">What survives</em></span><span class="cost-legend-pct" style="color:#F25A37">~24¢</span>`;
  legend.appendChild(li);
})();

// ---------- 7. US map (simplified plan-view) ----------
(function usMap() {
  const svg = document.getElementById('usMap');
  const NS = 'http://www.w3.org/2000/svg';
  // Region polygons — abstract plan-view of the US
  // West Coast (38%) — coral-400
  // Northeast (22%) — coral-300
  // Southeast & Sun Belt (18%) — coral-100
  // Midwest (12%) — paper-3
  // Other (10%) — paper-2

  const regions = [
    { name: 'West', tier: 1,
      d: 'M 30 60 L 70 50 L 95 80 L 90 130 L 75 175 L 50 195 L 30 175 L 25 120 Z' },
    { name: 'Mountain', tier: 4,
      d: 'M 95 80 L 145 70 L 165 130 L 155 180 L 75 175 L 90 130 Z' },
    { name: 'SunBelt', tier: 3,
      d: 'M 145 70 L 230 80 L 260 110 L 270 165 L 240 195 L 175 200 L 155 180 L 165 130 Z' },
    { name: 'Midwest', tier: 4,
      d: 'M 165 60 L 240 55 L 270 85 L 260 110 L 230 80 L 145 70 Z' },
    { name: 'Southeast', tier: 3,
      d: 'M 240 195 L 270 165 L 305 175 L 320 210 L 290 220 L 250 215 Z' },
    { name: 'Northeast', tier: 2,
      d: 'M 270 85 L 320 70 L 345 95 L 340 130 L 305 140 L 285 130 L 270 110 Z' },
    { name: 'MidAtl', tier: 3,
      d: 'M 285 130 L 305 140 L 305 175 L 270 165 L 260 140 Z' },
  ];

  regions.forEach(r => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', r.d);
    p.setAttribute('class', 'us-state tier-' + r.tier);
    svg.appendChild(p);
  });

  // Property pins — clusters where Healthpeak concentrates
  const pins = [
    // Bay Area cluster
    { x: 38, y: 110, r: 3.5 }, { x: 42, y: 115, r: 2.8 }, { x: 45, y: 108, r: 2.5 },
    { x: 36, y: 118, r: 3 },
    // SoCal
    { x: 50, y: 158, r: 3.5 }, { x: 56, y: 162, r: 3 }, { x: 48, y: 165, r: 2.6 },
    // Seattle
    { x: 52, y: 65, r: 2.8 },
    // Boston / Cambridge
    { x: 332, y: 100, r: 4 }, { x: 338, y: 105, r: 3 }, { x: 326, y: 95, r: 2.6 },
    // NJ / NYC
    { x: 318, y: 118, r: 3 }, { x: 322, y: 124, r: 2.8 },
    // Philadelphia
    { x: 308, y: 132, r: 2.6 },
    // Tennessee (HQ-adjacent)
    { x: 245, y: 175, r: 2.4 },
    // Wisconsin
    { x: 220, y: 90, r: 2.4 },
    // San Diego
    { x: 56, y: 175, r: 2.8 },
    // Atlanta
    { x: 265, y: 195, r: 2.6 },
  ];
  pins.forEach((pin, i) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', pin.x);
    c.setAttribute('cy', pin.y);
    c.setAttribute('r', pin.r);
    c.setAttribute('class', 'us-pin');
    c.style.transitionDelay = (i * 60) + 'ms';
    svg.appendChild(c);
  });
})();

// ---------- 8. Debt bar reveal ----------
(function debtBar() {
  const fill = document.getElementById('debtFill');
  const target = document.querySelector('.reset-dark');
  const io = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (e.isIntersecting) {
        // 9.8 / 20.3 ≈ 48.3%
        fill.style.width = '48.3%';
        io.disconnect();
      }
    });
  }, { threshold: 0.4 });
  io.observe(target);
})();

// ---------- 9. Competitor row toggling ----------
document.querySelectorAll('.comp-row-head').forEach(btn => {
  btn.addEventListener('click', () => {
    const row = btn.closest('.comp-row');
    const isOpen = row.dataset.open === 'true';
    row.dataset.open = isOpen ? 'false' : 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

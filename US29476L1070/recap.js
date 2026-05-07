/* ============ EQR RECAP — scroll motion + scenes ============ */

// ---------- HERO SKYLINE (parallax SVG) ----------
(function buildSkyline(){
  const el = document.getElementById('skyline');
  if (!el) return;
  const W = 440, H = 600;
  // three layers of towers, back-to-front
  const layers = [
    // back: dim, far
    { color: '#1A2A40', windowColor: 'rgba(242,201,76,0.18)', baseY: 480, towers: [
      [0, 220, 60], [55, 260, 70], [120, 180, 80], [195, 240, 65],
      [255, 200, 55], [305, 280, 70], [370, 230, 70]
    ]},
    // mid
    { color: '#0E1B2A', windowColor: 'rgba(242,201,76,0.32)', baseY: 540, towers: [
      [-10, 280, 75], [60, 340, 65], [120, 300, 80], [195, 380, 70],
      [260, 320, 60], [315, 360, 75], [385, 290, 70]
    ]},
    // front: tallest, sharpest
    { color: '#050A12', windowColor: 'rgba(242,201,76,0.55)', baseY: 600, towers: [
      [-20, 380, 90], [65, 460, 80], [140, 400, 70], [205, 500, 90],
      [290, 420, 75], [360, 480, 90]
    ]},
  ];

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYEnd slice');

  layers.forEach((layer, li) => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('data-depth', li);
    layer.towers.forEach(([x, h, w]) => {
      const r = document.createElementNS(svgNS, 'rect');
      r.setAttribute('x', x); r.setAttribute('y', layer.baseY - h);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('fill', layer.color);
      g.appendChild(r);
      // windows
      const cols = Math.max(2, Math.floor(w / 10));
      const rows = Math.max(4, Math.floor(h / 14));
      const padX = 4, padY = 8;
      const cw = (w - padX*2) / cols;
      const ch = (h - padY*2) / rows;
      for (let i=0; i<rows; i++){
        for (let j=0; j<cols; j++){
          if (Math.random() > 0.55) continue;
          const rect = document.createElementNS(svgNS, 'rect');
          rect.setAttribute('x', x + padX + j*cw + 1);
          rect.setAttribute('y', layer.baseY - h + padY + i*ch + 1);
          rect.setAttribute('width', Math.max(1, cw - 2));
          rect.setAttribute('height', Math.max(1, ch - 3));
          rect.setAttribute('fill', layer.windowColor);
          g.appendChild(rect);
        }
      }
    });
    svg.appendChild(g);
  });
  el.appendChild(svg);

  // parallax on scroll
  const groups = svg.querySelectorAll('g');
  function onScroll(){
    const y = window.scrollY;
    groups.forEach(g => {
      const d = parseInt(g.getAttribute('data-depth'),10);
      const factor = (d+1) * 0.08; // back slowest, front fastest
      g.setAttribute('transform', `translate(0, ${-y * factor})`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ---------- WINDOW GRID — 96% occupancy ----------
(function buildWindowGrid(){
  const grid = document.getElementById('windowGrid');
  if (!grid) return;
  // 10 x 14 = 140 cells. Light up 96% rounded → 134 lit, 6 dark.
  const total = 140;
  const lit = Math.round(total * 0.96);
  const arr = Array.from({length: total}, (_,i) => i);
  // pick 6 random dark indices, deterministic-ish
  const darkSet = new Set();
  while (darkSet.size < total - lit){
    darkSet.add(Math.floor(Math.random()*total));
  }
  for (let i=0; i<total; i++){
    const cell = document.createElement('i');
    cell.dataset.lit = darkSet.has(i) ? '0' : '1';
    grid.appendChild(cell);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const cells = grid.children;
      [...cells].forEach((c, i) => {
        if (c.dataset.lit === '1'){
          setTimeout(() => c.classList.add('lit'), i * 8);
        }
      });
      obs.disconnect();
    });
  }, { threshold: 0.3 });
  obs.observe(grid);
})();

// ---------- COST TOWER (top to bottom: surplus, GA, Interest, Taxes, OpEx, D&A) ----------
(function buildCostTower(){
  const tower = document.getElementById('costTower');
  if (!tower) return;
  // Listed in JSON: 28 D&A, 22 OpEx, 10 Int, 3 GA, 8 Taxes  → 71% of revenue
  // Surplus to revenue = 29% (label this as "what survives the floors")
  const floors = [
    { pct: 29, label: 'What survives', sub: 'Margin · cash flow', color: null, surplus: true },
    { pct: 3,  label: 'G & A', sub: 'Corporate', color: '#A97DC9' },
    { pct: 10, label: 'Interest', sub: 'Debt service', color: '#6DBF82' },
    { pct: 8,  label: 'Real estate taxes', sub: 'The cities’ cut', color: '#F2C94C' },
    { pct: 22, label: 'Property opex', sub: 'Run the buildings', color: '#E07B54' },
    { pct: 28, label: 'Depreciation', sub: 'Concrete ages', color: '#4F86C6' }
  ];
  // total height ~520px, allocate proportionally
  const totalPct = floors.reduce((a,f)=>a+f.pct,0); // 100
  const TOTAL_H = 520;

  floors.forEach((f) => {
    const div = document.createElement('div');
    div.className = 'cost-floor' + (f.surplus ? ' cost-floor--surplus' : '');
    const h = (f.pct / totalPct) * TOTAL_H;
    div.style.height = h + 'px';
    if (f.color) div.style.background = f.color;
    div.innerHTML = `
      ${f.surplus ? '' : '<span class="cost-floor-windows"></span>'}
      <span class="cost-floor-lbl"><em>${f.sub}</em>${f.label}</span>
      <span class="cost-floor-pct">${f.pct}¢</span>
    `;
    div.style.transform = 'scaleY(0)';
    tower.appendChild(div);
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      [...tower.children].forEach((c, i) => {
        setTimeout(() => {
          c.style.transition = 'transform 700ms var(--ease-out)';
          c.style.transform = 'scaleY(1)';
        }, i * 100);
      });
      obs.disconnect();
    });
  }, { threshold: 0.2 });
  obs.observe(tower);
})();

// ---------- GEO BARS ----------
(function buildGeoBars(){
  const wrap = document.getElementById('geoBars');
  if (!wrap) return;
  const data = [
    { pct: 16, label: 'NY Metro' },
    { pct: 16, label: 'So. California' },
    { pct: 14, label: 'SF Bay Area' },
    { pct: 12, label: 'D.C. Metro' },
    { pct: 10, label: 'Seattle' },
    { pct: 10, label: 'Boston' },
    { pct: 22, label: 'Expansion mkts', expansion: true }
  ];
  const max = 22;
  data.forEach(d => {
    const col = document.createElement('div');
    col.className = 'geo-col' + (d.expansion ? ' geo-col--expansion' : '');
    const targetH = (d.pct / max) * 100;
    col.innerHTML = `
      <span class="geo-col-pct">${d.pct}%</span>
      <span class="geo-col-bar" data-h="${targetH}"></span>
      <span class="geo-col-lbl">${d.label}</span>
    `;
    wrap.appendChild(col);
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      wrap.querySelectorAll('.geo-col-bar').forEach((b, i) => {
        setTimeout(() => { b.style.height = b.dataset.h + '%'; }, i * 80);
      });
      obs.disconnect();
    });
  }, { threshold: 0.2 });
  obs.observe(wrap);
})();

// ---------- CAPITAL FLOW (SVG sankey-ish) ----------
(function buildCapitalFlow(){
  const wrap = document.getElementById('capitalFlow');
  if (!wrap) return;
  const W = 380, H = 260;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');

  // Source bar at top: $1.65B
  const src = document.createElementNS(svgNS, 'rect');
  src.setAttribute('x', 60); src.setAttribute('y', 16);
  src.setAttribute('width', 260); src.setAttribute('height', 30);
  src.setAttribute('fill', '#0E1B2A');
  svg.appendChild(src);

  const srcLabel = document.createElementNS(svgNS, 'text');
  srcLabel.setAttribute('x', 190); srcLabel.setAttribute('y', 36);
  srcLabel.setAttribute('text-anchor', 'middle');
  srcLabel.setAttribute('fill', '#F4EFE6');
  srcLabel.setAttribute('font-family', 'Instrument Serif, serif');
  srcLabel.setAttribute('font-style', 'italic');
  srcLabel.setAttribute('font-size', '17');
  srcLabel.textContent = '$1.65B operating cash flow';
  svg.appendChild(srcLabel);

  // Three streams. Widths proportional to dollars.
  // dividends 1.05, buybacks 0.30, kept/other 0.30 (approx residual)
  const streams = [
    { x1: 90,  w1: 105, x2: 60,  w2: 90, color: '#F25A37', label: 'Dividends', sub: '$1.05B' },
    { x1: 195, w1: 30,  x2: 165, w2: 60, color: '#7B71F5', label: 'Buybacks', sub: '$300M' },
    { x1: 225, w1: 95,  x2: 235, w2: 130, color: '#2BB673', label: 'Reinvest', sub: '$300M+' }
  ];
  // Note: dispositions $1.1B is a separate inflow — we'll show as a side arrow

  streams.forEach((s, i) => {
    const path = document.createElementNS(svgNS, 'path');
    const y1 = 46;          // bottom of source
    const y2 = 170;          // top of dest
    const d = `M ${s.x1} ${y1}
               C ${s.x1} ${(y1+y2)/2}, ${s.x2} ${(y1+y2)/2}, ${s.x2} ${y2}
               L ${s.x2 + s.w2} ${y2}
               C ${s.x2 + s.w2} ${(y1+y2)/2}, ${s.x1 + s.w1} ${(y1+y2)/2}, ${s.x1 + s.w1} ${y1}
               Z`;
    path.setAttribute('d', d);
    path.setAttribute('fill', s.color);
    path.setAttribute('opacity', '0.85');
    path.setAttribute('class', 'flow-path');
    path.style.opacity = 0;
    path.style.transition = `opacity 700ms ease ${i*150+200}ms, transform 700ms ease ${i*150+200}ms`;
    svg.appendChild(path);

    // dest box
    const dest = document.createElementNS(svgNS, 'rect');
    dest.setAttribute('x', s.x2); dest.setAttribute('y', 170);
    dest.setAttribute('width', s.w2); dest.setAttribute('height', 28);
    dest.setAttribute('fill', s.color);
    svg.appendChild(dest);

    const t1 = document.createElementNS(svgNS, 'text');
    t1.setAttribute('x', s.x2 + s.w2/2); t1.setAttribute('y', 220);
    t1.setAttribute('text-anchor', 'middle');
    t1.setAttribute('fill', '#0E1B2A');
    t1.setAttribute('font-family', 'Instrument Serif, serif');
    t1.setAttribute('font-style', 'italic');
    t1.setAttribute('font-size', '15');
    t1.textContent = s.sub;
    svg.appendChild(t1);

    const t2 = document.createElementNS(svgNS, 'text');
    t2.setAttribute('x', s.x2 + s.w2/2); t2.setAttribute('y', 238);
    t2.setAttribute('text-anchor', 'middle');
    t2.setAttribute('fill', '#5C6B7E');
    t2.setAttribute('font-family', 'Geist Mono, monospace');
    t2.setAttribute('font-size', '9');
    t2.setAttribute('letter-spacing', '1.5');
    t2.textContent = s.label.toUpperCase();
    svg.appendChild(t2);
  });

  // Side inflow: dispositions $1.1B
  const sideArrow = document.createElementNS(svgNS, 'path');
  sideArrow.setAttribute('d', 'M 12 110 Q 40 110 60 130 L 50 130 M 60 130 L 50 122');
  sideArrow.setAttribute('fill', 'none');
  sideArrow.setAttribute('stroke', '#5C6B7E');
  sideArrow.setAttribute('stroke-width', '1');
  svg.appendChild(sideArrow);

  const sideTxt = document.createElementNS(svgNS, 'text');
  sideTxt.setAttribute('x', 8); sideTxt.setAttribute('y', 100);
  sideTxt.setAttribute('fill', '#5C6B7E');
  sideTxt.setAttribute('font-family', 'Geist Mono, monospace');
  sideTxt.setAttribute('font-size', '9');
  sideTxt.setAttribute('letter-spacing', '1.5');
  sideTxt.textContent = '+ $1.1B';
  svg.appendChild(sideTxt);
  const sideTxt2 = document.createElementNS(svgNS, 'text');
  sideTxt2.setAttribute('x', 8); sideTxt2.setAttribute('y', 88);
  sideTxt2.setAttribute('fill', '#5C6B7E');
  sideTxt2.setAttribute('font-family', 'Geist Mono, monospace');
  sideTxt2.setAttribute('font-size', '9');
  sideTxt2.setAttribute('letter-spacing', '1.5');
  sideTxt2.textContent = 'DISPOSITIONS';
  svg.appendChild(sideTxt2);

  wrap.appendChild(svg);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      svg.querySelectorAll('.flow-path').forEach(p => { p.style.opacity = 0.85; });
      // leverage bars
      document.querySelectorAll('.lev-bar > i').forEach(b => {
        // already animating from CSS keyframe — kick it
        const w = b.style.width;
        b.style.width = '0';
        requestAnimationFrame(() => { b.style.width = w; });
      });
      obs.disconnect();
    });
  }, { threshold: 0.2 });
  obs.observe(wrap);
})();

// ---------- COMPETITORS — rival towers, scaled by mkt cap ----------
(function buildRivals(){
  const wrap = document.getElementById('rivals');
  if (!wrap) return;
  const data = [
    { tk: 'AVB',  cap: 23.76, name: 'AvalonBay',     blurb: 'Most direct peer · same coastal markets · <em>+4.36%</em> rev growth YoY · P/E 22.6' },
    { tk: 'EQR',  cap: 22.84, name: 'Equity Resid.', isEqr: true, blurb: 'Equity Residential · 312 properties · <em>85,190 units</em> · P/E TTM in line with peers' },
    { tk: 'ESS',  cap: 15.99, name: 'Essex Property', blurb: 'West-coast only · SoCal, SF, Seattle · <em>+6.36%</em> rev growth · P/E 23.9' },
    { tk: 'INVH', cap: 15.75, name: 'Invitation Homes', blurb: 'Single-family rental REIT · same renter, <em>different door</em> · P/E 26.8' }
  ];
  const max = Math.max(...data.map(d => d.cap));
  data.forEach(d => {
    const col = document.createElement('div');
    col.className = 'rival' + (d.isEqr ? ' rival--eqr' : '');
    const h = (d.cap / max) * 100;
    col.innerHTML = `
      <span class="rival-tower" data-h="${h}">
        <span class="rival-cap">$${d.cap}B<small>MKT CAP</small></span>
      </span>
      <span class="rival-tk">${d.tk}</span>
      <span class="rival-name">${d.name}</span>
      <div class="rival-deep">${d.blurb}</div>
    `;
    col.addEventListener('click', () => {
      wrap.querySelectorAll('.rival').forEach(r => r !== col && r.classList.remove('is-open'));
      col.classList.toggle('is-open');
    });
    wrap.appendChild(col);
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      wrap.querySelectorAll('.rival-tower').forEach((t, i) => {
        setTimeout(() => { t.style.height = t.dataset.h + '%'; }, i * 120);
      });
      obs.disconnect();
    });
  }, { threshold: 0.2 });
  obs.observe(wrap);
})();

// ---------- CLOSE: keys grid (lit dots representing 85,190 units) ----------
(function buildCloseKeys(){
  const wrap = document.getElementById('closeKeys');
  if (!wrap) return;
  const cols = 20, rows = 6;
  const total = cols*rows; // 120 cells, each ≈ 710 units
  for (let i=0; i<total; i++){
    const c = document.createElement('i');
    wrap.appendChild(c);
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      [...wrap.children].forEach((c, i) => {
        setTimeout(() => c.classList.add('on'), i * 18);
      });
      obs.disconnect();
    });
  }, { threshold: 0.2 });
  obs.observe(wrap);
})();

// ---------- COUNT-UP NUMBERS ----------
(function countUps(){
  const els = document.querySelectorAll('.count');
  const fmt = (n, decimals) => {
    if (decimals) return n.toFixed(decimals);
    return Math.round(n).toLocaleString('en-US');
  };
  const animate = (el) => {
    const to = parseFloat(el.dataset.to);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const dur = 1400;
    const start = performance.now();
    function tick(t){
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * eased, decimals);
      if (k < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(to, decimals);
    }
    requestAnimationFrame(tick);
  };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      animate(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  els.forEach(el => obs.observe(el));
})();

// ---------- CHROME PROGRESS HAIRLINE ----------
(function progress(){
  const bar = document.getElementById('progress');
  if (!bar) return;
  function on(){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const k = h > 0 ? Math.min(1, window.scrollY / h) : 0;
    bar.style.width = (k * 100) + '%';
  }
  window.addEventListener('scroll', on, { passive: true });
  on();
})();

// ---------- REVEAL on scroll for beat headings & body ----------
(function reveals(){
  const targets = document.querySelectorAll('.beat-h2, .beat-body, .scale-since, .reset-copy, .leverage, .flow-legend, .q4-row, .close-foot, .close-mark');
  targets.forEach(t => t.classList.add('reveal'));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => obs.observe(t));
})();

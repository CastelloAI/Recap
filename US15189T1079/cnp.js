/* ============================================================
   CNP Recap — interactions
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. CHROME PROGRESS ---------- */
  const fill = document.getElementById('chrome-progress-fill');
  const updateProgress = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.right = ((1 - p) * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- 2. HERO METER CONSTELLATION ----------
     Render ~80 small stylized meter circles scattered, with
     tiny rotating "needles" — evokes 7M dials reduced to a
     single field. */
  const heroGrid = document.getElementById('hero-meters-grid');
  if (heroGrid) {
    const W = 420, H = 600;
    const NS = 'http://www.w3.org/2000/svg';
    // Poisson-ish jitter on a grid
    const cols = 9, rows = 13;
    const cellW = W / cols, cellH = H / rows;
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // skip cells in middle text band
        const cx = (c + 0.5) * cellW + (Math.random() - 0.5) * cellW * 0.5;
        const cy = (r + 0.5) * cellH + (Math.random() - 0.5) * cellH * 0.5;

        // Avoid central content area (where headline sits)
        const inText = cy > 110 && cy < 380 && cx > 30 && cx < 380;
        if (inText && Math.random() > 0.18) continue;

        const radius = 4 + Math.random() * 3;
        const opacity = 0.12 + Math.random() * 0.55;
        const angle = Math.random() * 360;
        const isLit = Math.random() < 0.18;

        const g = document.createElementNS(NS, 'g');
        g.setAttribute('transform', `translate(${cx.toFixed(1)},${cy.toFixed(1)})`);
        g.style.opacity = opacity.toFixed(2);

        const ring = document.createElementNS(NS, 'circle');
        ring.setAttribute('r', radius);
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', isLit ? '#FFB070' : '#6B6A65');
        ring.setAttribute('stroke-width', '0.7');
        g.appendChild(ring);

        const needle = document.createElementNS(NS, 'line');
        needle.setAttribute('x1', '0'); needle.setAttribute('y1', '0');
        needle.setAttribute('x2', '0'); needle.setAttribute('y2', (-radius + 0.6).toFixed(1));
        needle.setAttribute('stroke', isLit ? '#FFB070' : '#A4A29C');
        needle.setAttribute('stroke-width', '0.6');
        needle.setAttribute('stroke-linecap', 'round');
        needle.setAttribute('transform', `rotate(${angle.toFixed(1)})`);
        g.appendChild(needle);

        if (isLit) {
          const dot = document.createElementNS(NS, 'circle');
          dot.setAttribute('r', '0.8');
          dot.setAttribute('fill', '#FFB070');
          g.appendChild(dot);
        }

        // Slow rotate animation
        const dur = 12 + Math.random() * 30;
        needle.innerHTML = ''; // clear
        const anim = document.createElementNS(NS, 'animateTransform');
        anim.setAttribute('attributeName', 'transform');
        anim.setAttribute('type', 'rotate');
        anim.setAttribute('from', `${angle}`);
        anim.setAttribute('to', `${angle + (Math.random() < 0.5 ? 360 : -360)}`);
        anim.setAttribute('dur', `${dur}s`);
        anim.setAttribute('repeatCount', 'indefinite');
        needle.appendChild(anim);

        heroGrid.appendChild(g);
        i++;
      }
    }
  }

  /* ---------- 3. METER (BUSINESS SCENE) ---------- */
  const meterTicks = document.getElementById('meter-ticks');
  if (meterTicks) {
    const NS = 'http://www.w3.org/2000/svg';
    for (let a = 0; a < 360; a += 6) {
      const major = a % 30 === 0;
      const rad = (a - 90) * Math.PI / 180;
      const r1 = major ? 122 : 128;
      const r2 = 134;
      const x1 = 180 + Math.cos(rad) * r1;
      const y1 = 180 + Math.sin(rad) * r1;
      const x2 = 180 + Math.cos(rad) * r2;
      const y2 = 180 + Math.sin(rad) * r2;
      const tick = document.createElementNS(NS, 'line');
      tick.setAttribute('x1', x1.toFixed(1));
      tick.setAttribute('y1', y1.toFixed(1));
      tick.setAttribute('x2', x2.toFixed(1));
      tick.setAttribute('y2', y2.toFixed(1));
      tick.setAttribute('stroke', '#3B3835');
      tick.setAttribute('stroke-width', major ? '1.4' : '0.7');
      meterTicks.appendChild(tick);

      if (major) {
        const num = document.createElementNS(NS, 'text');
        const r3 = 110;
        const tx = 180 + Math.cos(rad) * r3;
        const ty = 180 + Math.sin(rad) * r3 + 3;
        num.setAttribute('x', tx.toFixed(1));
        num.setAttribute('y', ty.toFixed(1));
        num.setAttribute('text-anchor', 'middle');
        num.setAttribute('font-family', 'Geist Mono, monospace');
        num.setAttribute('font-size', '9');
        num.setAttribute('fill', '#3B3835');
        num.textContent = String((a / 30) === 0 ? 12 : a / 30);
        meterTicks.appendChild(num);
      }
    }
  }

  // Meter digit reels
  const meterDigits = document.getElementById('meter-digits');
  if (meterDigits) {
    const NS = 'http://www.w3.org/2000/svg';
    const value = '08704592'; // evokes $8.70B revenue
    const w = 18, total = value.length;
    const startX = -((total - 1) * w) / 2;
    for (let k = 0; k < total; k++) {
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', startX + k * w);
      t.setAttribute('y', '7');
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', 'Geist Mono, monospace');
      t.setAttribute('font-size', '20');
      t.setAttribute('font-weight', '500');
      t.setAttribute('fill', k < 4 ? '#FFB070' : '#6B6A65');
      t.textContent = value[k];
      meterDigits.appendChild(t);
    }
  }

  // Spin the needle slowly forever
  const meterNeedle = document.getElementById('meter-needle');
  if (meterNeedle) {
    let angle = 0;
    let lastT = performance.now();
    let speed = 0.15; // deg/ms baseline
    const tick = (t) => {
      const dt = t - lastT; lastT = t;
      angle = (angle + speed * dt) % 360;
      meterNeedle.setAttribute('transform', `translate(180,180) rotate(${angle.toFixed(2)})`);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- 4. COUNT-UP (SCALE SCENE) ---------- */
  const countUps = document.querySelectorAll('[data-countup]');
  const animateCount = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const cu = el.querySelector('.cu');
    const dur = 1500;
    const start = performance.now();
    const fmt = (n) => {
      if (decimals > 0) return n.toFixed(decimals);
      // group thousands
      return Math.round(n).toLocaleString('en-US');
    };
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      // ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      const v = target * eased;
      cu.textContent = fmt(v);
      if (p < 1) requestAnimationFrame(step);
      else cu.textContent = fmt(target);
    };
    requestAnimationFrame(step);
  };

  /* ---------- 5. COST PIPE (mandated hex) ---------- */
  const COSTS = [
    { pct: 22, color: '#59A14F', label: 'Operations & Maintenance' },
    { pct: 14, color: '#F28E2B', label: 'Depreciation & Amortization' },
    { pct: 9,  color: '#E15759', label: 'Interest Expense' },
    { pct: 8,  color: '#B07AA1', label: 'Taxes & Regulatory' },
    { pct: 6,  color: '#76B7B2', label: 'SG&A & Overhead' },
    { pct: 1,  color: '#4E79A7', label: 'Cost of Revenue' }
  ];
  const SURVIVES = 100 - COSTS.reduce((s, c) => s + c.pct, 0); // = 40

  const costPipe = document.getElementById('cost-pipe');
  const costLegend = document.getElementById('cost-legend');
  if (costPipe && costLegend) {
    // Top "survives" segment — what makes it past costs (margin/dividend/equity)
    const survivesSeg = document.createElement('div');
    survivesSeg.className = 'cost-seg cost-seg-survives';
    survivesSeg.style.height = SURVIVES + '%';
    survivesSeg.style.background =
      'repeating-linear-gradient(45deg, #FFE9D8 0 6px, #FFDFD3 6px 12px)';
    survivesSeg.style.borderBottom = '1px dashed #C46A2E';
    const sLbl = document.createElement('span');
    sLbl.className = 'cost-seg-pct dark';
    sLbl.innerHTML = '40¢ <span style="opacity:.6">survives</span>';
    survivesSeg.appendChild(sLbl);
    costPipe.appendChild(survivesSeg);

    // Cost segments: largest to smallest, top to bottom (so big O&M sits up)
    COSTS.forEach((c, i) => {
      const seg = document.createElement('div');
      seg.className = 'cost-seg';
      seg.style.background = c.color;
      seg.style.height = c.pct + '%';
      const pct = document.createElement('span');
      pct.className = 'cost-seg-pct';
      pct.textContent = c.pct + '¢';
      // For tiny segments hide label
      if (c.pct <= 6) pct.style.fontSize = '9px';
      if (c.pct < 4) pct.textContent = '';
      seg.appendChild(pct);
      costPipe.appendChild(seg);

      // Legend entry
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="leg-swatch" style="background:${c.color}"></span>
        <span class="leg-label">${c.label}</span>
        <span class="leg-pct">${c.pct}¢</span>
      `;
      costLegend.appendChild(li);
    });

    // Add survives row at top of legend
    const surv = document.createElement('li');
    surv.innerHTML = `
      <span class="leg-swatch" style="background:repeating-linear-gradient(45deg,#FFE9D8 0 4px,#FFDFD3 4px 8px); border:1px dashed #C46A2E;"></span>
      <span class="leg-label" style="color:var(--ink); font-style:italic; font-family:var(--font-display); font-size:14.5px;">what survives</span>
      <span class="leg-pct" style="color:var(--signal)">${SURVIVES}¢</span>
    `;
    costLegend.insertBefore(surv, costLegend.firstChild);
  }

  /* ---------- 6. CAPEX BARS (BET SCENE) ---------- */
  const betBars = document.getElementById('bet-bars');
  const betCumLine = document.getElementById('bet-cumline');
  if (betBars) {
    // 10-year program totaling $65B; rises slightly as program builds.
    // Stylized profile (sums to ~65).
    const yearly = [4.4, 5.0, 5.6, 6.0, 6.4, 6.7, 7.0, 7.3, 7.7, 8.9];
    const total = yearly.reduce((a, b) => a + b, 0);
    const max = Math.max(...yearly);
    const x0 = 36, x1 = 350, y0 = 56, y1 = 280;
    const innerW = x1 - x0;
    const innerH = y1 - y0;
    const barW = innerW / yearly.length * 0.62;
    const gap = innerW / yearly.length;
    const NS = 'http://www.w3.org/2000/svg';

    yearly.forEach((v, i) => {
      const cx = x0 + (i + 0.5) * gap;
      const h = (v / max) * innerH * 0.85;
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', (cx - barW / 2).toFixed(1));
      rect.setAttribute('y', y1.toFixed(1)); // start at floor
      rect.setAttribute('width', barW.toFixed(1));
      rect.setAttribute('height', '0');
      rect.setAttribute('rx', '2');
      rect.setAttribute('fill', 'url(#pipeGrad)');
      rect.dataset.targetH = h.toFixed(1);
      rect.dataset.targetY = (y1 - h).toFixed(1);
      betBars.appendChild(rect);

      // Year label
      if (i === 0 || i === yearly.length - 1) return; // already drawn in HTML
      const lbl = document.createElementNS(NS, 'text');
      lbl.setAttribute('x', cx.toFixed(1));
      lbl.setAttribute('y', '298');
      lbl.setAttribute('font-family', 'Geist Mono');
      lbl.setAttribute('font-size', '8');
      lbl.setAttribute('fill', '#5A5853');
      lbl.setAttribute('text-anchor', 'middle');
      lbl.textContent = "'" + (26 + i);
      betBars.appendChild(lbl);
    });

    // Cumulative path
    let cum = 0;
    const pts = yearly.map((v, i) => {
      cum += v;
      const cx = x0 + (i + 0.5) * gap;
      const cy = y1 - (cum / total) * innerH * 0.78;
      return [cx, cy];
    });
    const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
    betCumLine.setAttribute('d', d);
    betCumLine.setAttribute('stroke-dashoffset', '600');
    betCumLine.style.strokeDasharray = '600';
    betCumLine.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)';

    // bet num count up done via observer below
  }

  const animateBet = () => {
    const bars = document.querySelectorAll('#bet-bars rect');
    bars.forEach((r, i) => {
      setTimeout(() => {
        r.style.transition = 'y 0.7s cubic-bezier(0.22,1,0.36,1), height 0.7s cubic-bezier(0.22,1,0.36,1)';
        r.setAttribute('y', r.dataset.targetY);
        r.setAttribute('height', r.dataset.targetH);
      }, i * 80);
    });
    const line = document.getElementById('bet-cumline');
    if (line) setTimeout(() => { line.setAttribute('stroke-dashoffset', '0'); line.style.strokeDashoffset = '0'; }, 700);

    // bet num count up
    const betNum = document.getElementById('bet-num');
    if (betNum && !betNum.dataset.done) {
      betNum.dataset.done = '1';
      const dur = 1600;
      const start = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        betNum.textContent = Math.round(65 * eased).toString();
        if (p < 1) requestAnimationFrame(step);
        else betNum.textContent = '65';
      };
      requestAnimationFrame(step);
    }
  };

  /* ---------- 7. COMPETITORS ---------- */
  const COMPS = [
    {
      self: true,
      name: 'CenterPoint',
      ticker: 'NYSE: CNP',
      mcap: 28.19,
      rev: 8.70,
      pe: null,
      growth: 1.35,
      tag: 'Texas-domiciled. Heavy on rate base. <em>Slow-growing,</em> high-leverage.'
    },
    {
      name: 'Ameren',
      ticker: 'NYSE: AEE',
      mcap: 31.18,
      rev: 8.80,
      pe: 21.42,
      growth: 15.43,
      tag: 'A near-identical mirror — same scale, same rate-base playbook in <em>overlapping Midwest.</em>'
    },
    {
      name: 'CMS Energy',
      ticker: 'NYSE: CMS',
      mcap: 23.95,
      rev: 7.46,
      pe: 22.36,
      growth: 12.95,
      tag: 'Smaller mirror. Same thesis, <em>Great Lakes</em> footprint.'
    },
    {
      name: 'Atmos Energy',
      ticker: 'NYSE: ATO',
      mcap: 30.86,
      rev: 4.70,
      pe: 24.69,
      growth: 16.42,
      tag: 'Gas-only. Grows revenue <em>twelve times faster</em> — competitive pressure on CNP\'s gas segment.'
    }
  ];
  const compList = document.getElementById('comp-list');
  if (compList) {
    const maxMcap = Math.max(...COMPS.map(c => c.mcap));
    const maxRev = Math.max(...COMPS.map(c => c.rev));
    const maxGrowth = Math.max(...COMPS.map(c => c.growth));

    COMPS.forEach(c => {
      const row = document.createElement('div');
      row.className = 'comp-row' + (c.self ? ' is-self' : '');
      row.innerHTML = `
        <div class="comp-row-head">
          <span class="comp-name">${c.self ? '<em>' + c.name + '</em>' : c.name}</span>
          <span class="comp-tick">${c.ticker}</span>
        </div>
        <div class="comp-bars">
          <div class="comp-bar-row">
            <span class="comp-bar-lbl">Mkt cap</span>
            <span class="comp-bar-track"><span class="comp-bar-fill" data-w="${(c.mcap / maxMcap * 100).toFixed(1)}"></span></span>
            <span class="comp-bar-val">$${c.mcap.toFixed(2)}B</span>
          </div>
          <div class="comp-bar-row">
            <span class="comp-bar-lbl">Revenue</span>
            <span class="comp-bar-track"><span class="comp-bar-fill" data-w="${(c.rev / maxRev * 100).toFixed(1)}"></span></span>
            <span class="comp-bar-val">$${c.rev.toFixed(2)}B</span>
          </div>
          <div class="comp-bar-row">
            <span class="comp-bar-lbl">YoY rev</span>
            <span class="comp-bar-track"><span class="comp-bar-fill" data-w="${(c.growth / maxGrowth * 100).toFixed(1)}"></span></span>
            <span class="comp-bar-val">${c.growth.toFixed(2)}%</span>
          </div>
          <div class="comp-bar-row">
            <span class="comp-bar-lbl">P/E TTM</span>
            <span class="comp-bar-track"><span class="comp-bar-fill" data-w="${c.pe ? (c.pe / 30 * 100).toFixed(1) : 0}"></span></span>
            <span class="comp-bar-val">${c.pe ? c.pe.toFixed(2) : '—'}</span>
          </div>
        </div>
        <p class="comp-tag">${c.tag}</p>
      `;
      compList.appendChild(row);
    });
  }

  const animateCompBars = () => {
    document.querySelectorAll('.comp-bar-fill').forEach((f, i) => {
      const w = parseFloat(f.dataset.w);
      setTimeout(() => {
        f.style.right = (100 - w) + '%';
      }, i * 40);
    });
  };

  /* ---------- 8. COST PIPE TRIGGER ---------- */
  const animateCostPipe = () => {
    document.querySelectorAll('.cost-seg').forEach((seg, i) => {
      setTimeout(() => seg.classList.add('in'), i * 90);
    });
  };

  /* ---------- 9. INTERSECTION OBSERVER ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;

      if (el.hasAttribute('data-countup')) animateCount(el);
      if (el.classList.contains('scene-bet')) animateBet();
      if (el.classList.contains('scene-comp')) animateCompBars();
      if (el.classList.contains('scene-costs')) animateCostPipe();

      el.classList.add('in');
      io.unobserve(el);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('[data-countup], .scene-bet, .scene-comp, .scene-costs').forEach(el => io.observe(el));

  // Reveal-on-scroll for misc blocks
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.scene-headline, .reset-text, .scene-lede, .close-line-2, .close-line-4').forEach(el => {
    el.classList.add('reveal');
    ro.observe(el);
  });

  /* ---------- 10. SUBTLE PARALLAX ON HERO METERS ---------- */
  const heroSvg = document.querySelector('.hero-meters-svg');
  if (heroSvg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 800) {
          heroSvg.style.transform = `translateY(${y * 0.18}px) scale(${1 + y * 0.0003})`;
          heroSvg.style.opacity = Math.max(0, 1 - y / 700);
        }
        ticking = false;
      });
    }, { passive: true });
  }

})();

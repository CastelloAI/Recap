/* ============================================================
   SWKS Recap — interactions
   ============================================================ */

(function () {
  // ============ STICKY CHROME PROGRESS ============
  const progressFill = document.getElementById('progressFill');
  function updateProgress() {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
    progressFill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ============ HERO BACKGROUND WAVES ============
  // Soft sine waves layered, parallaxing slightly with scroll
  (function buildHeroWaves() {
    const g = document.getElementById('heroWaves');
    if (!g) return;
    const W = 390, H = 560;
    const lines = [];
    function sine(amp, period, yOff, phase) {
      let d = '';
      const step = 4;
      for (let x = -10; x <= W + 10; x += step) {
        const y = yOff + Math.sin((x / period) * Math.PI * 2 + phase) * amp;
        d += (x === -10 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(2) + ' ';
      }
      return d;
    }
    // 26 horizontal wave lines, increasing density toward middle
    for (let i = 0; i < 26; i++) {
      const t = i / 25; // 0..1
      const yOff = 80 + t * 420;
      const amp = 8 + Math.sin(t * Math.PI) * 26;
      const period = 90 + i * 4;
      const phase = i * 0.42;
      const isAccent = i === 12 || i === 13;
      const stroke = isAccent ? '#FF7A57' : '#3B3A37';
      const opacity = isAccent ? 0.85 : (0.06 + Math.sin(t * Math.PI) * 0.18);
      const w = isAccent ? 1.4 : 0.9;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', sine(amp, period, yOff, phase));
      path.setAttribute('stroke', stroke);
      path.setAttribute('stroke-width', w);
      path.setAttribute('opacity', opacity);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      g.appendChild(path);
      lines.push({ el: path, baseAmp: amp, period, yOff, phase, isAccent });
    }

    // Animate phases on scroll velocity
    let lastY = window.scrollY;
    let rafId = null;
    function tick() {
      const y = window.scrollY;
      const v = (y - lastY);
      lastY = y;
      const t = performance.now() / 1000;
      lines.forEach((L, i) => {
        const newPhase = L.phase + t * (L.isAccent ? 0.5 : 0.15);
        const amp = L.baseAmp * (1 + Math.min(0.4, Math.abs(v) / 80));
        let d = '';
        const step = 4;
        for (let x = -10; x <= 390 + 10; x += step) {
          const yy = L.yOff + Math.sin((x / L.period) * Math.PI * 2 + newPhase) * amp;
          d += (x === -10 ? 'M' : 'L') + x.toFixed(1) + ' ' + yy.toFixed(2) + ' ';
        }
        L.el.setAttribute('d', d);
      });
      rafId = requestAnimationFrame(tick);
    }
    tick();
  })();

  // ============ COUNT-UP NUMBERS ============
  function countUp(el, target, decimals, prefix, format) {
    const start = performance.now();
    const dur = 1100;
    function frame(t) {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = target * eased;
      let display;
      if (format === 'comma') {
        display = Math.round(v).toLocaleString();
      } else {
        display = v.toFixed(decimals || 0);
      }
      el.textContent = (prefix || '') + display;
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const numEls = document.querySelectorAll('.pct-num');
  const numObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.played) {
        e.target.dataset.played = '1';
        const target = parseFloat(e.target.dataset.target);
        const decimals = parseInt(e.target.dataset.decimals || '0', 10);
        const prefix = e.target.dataset.prefix || '';
        const format = e.target.dataset.format || '';
        countUp(e.target, target, decimals, prefix, format);
      }
    });
  }, { threshold: 0.4 });
  numEls.forEach((el) => numObserver.observe(el));

  // ============ BUSINESS WAVES — two frequencies ============
  function makeWave(pathId, freq, amp, color) {
    const W = 360, H = 70, mid = 35;
    let d = '';
    for (let x = 0; x <= W; x += 2) {
      const y = mid + Math.sin((x / W) * Math.PI * 2 * freq) * amp;
      d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(2) + ' ';
    }
    const el = document.getElementById(pathId);
    if (el) el.setAttribute('d', d);
  }
  // mobile = high freq, lower amp (smartphone GHz feel); broad = low freq, fuller amp
  makeWave('waveMobile', 7, 18, '#FF7A57');
  makeWave('waveBroad', 3, 22, '#3B3A37');

  // Animate wave drawing on enter
  const waveSvgs = document.querySelectorAll('.wave-svg path');
  waveSvgs.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)';
  });
  const waveObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const p = e.target.querySelector('path');
        if (p) p.style.strokeDashoffset = '0';
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.wave-svg').forEach((s) => waveObs.observe(s));

  // ============ COSTS — SPECTRUM BAR ============
  const COSTS = [
    { pct: 59, color: '#E05C5C', label: 'Cost of Revenue' },
    { pct: 17, color: '#5B8FF9', label: 'Research & Development' },
    { pct: 5,  color: '#5AD8A6', label: 'Selling, General & Admin' },
    { pct: 5,  color: '#F6BD16', label: 'Amortization of Intangibles' },
    { pct: 3,  color: '#A371F7', label: 'Stock-Based Compensation' },
  ];
  const REMAINDER = 100 - COSTS.reduce((s, c) => s + c.pct, 0);
  const bar = document.getElementById('spectrumBar');
  const legend = document.getElementById('spectrumLegend');
  if (bar && legend) {
    COSTS.forEach((c) => {
      const seg = document.createElement('div');
      seg.className = 'spec-seg';
      seg.style.background = c.color;
      seg.style.width = '0%';
      seg.dataset.target = c.pct + '%';
      bar.appendChild(seg);
    });
    // remainder = operating income (~11%)
    const rem = document.createElement('div');
    rem.className = 'spec-seg spec-rem';
    rem.style.background = 'var(--paper-3)';
    rem.style.width = '0%';
    rem.dataset.target = REMAINDER + '%';
    rem.style.borderLeft = '1px dashed var(--ink-4)';
    bar.appendChild(rem);

    COSTS.forEach((c) => {
      const row = document.createElement('div');
      row.className = 'legend-row';
      row.innerHTML = `
        <span class="legend-swatch" style="background:${c.color}"></span>
        <span class="legend-label">${c.label}</span>
        <span class="legend-pct">${c.pct}<span style="font-size:14px">%</span></span>
      `;
      legend.appendChild(row);
    });
    // remainder row
    const remRow = document.createElement('div');
    remRow.className = 'legend-row';
    remRow.innerHTML = `
      <span class="legend-swatch" style="background:var(--paper-3); border:1px dashed var(--ink-4)"></span>
      <span class="legend-label" style="font-style:italic; font-family:var(--font-display); font-size:17px;">what's left</span>
      <span class="legend-pct" style="color:var(--coral-500)">${REMAINDER}<span style="font-size:14px">%</span></span>
    `;
    legend.appendChild(remRow);

    // Animate bar fill on enter
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          [...bar.children].forEach((seg, i) => {
            setTimeout(() => { seg.style.width = seg.dataset.target; }, i * 80);
          });
        }
      });
    }, { threshold: 0.4 });
    obs.observe(bar);
  }

  // ============ FOOTPRINT — SIGNAL RINGS ============
  const GEO = [
    { pct: 35, region: 'China' },
    { pct: 22, region: 'United States' },
    { pct: 15, region: 'South Korea' },
    { pct: 12, region: 'Taiwan' },
    { pct: 9,  region: 'Europe, M.E. & Africa' },
    { pct: 7,  region: 'Other Asia-Pacific' },
  ];
  const ringsGroup = document.getElementById('ringsGroup');
  if (ringsGroup) {
    const cx = 180, cy = 180;
    const maxPct = 35;
    const maxR = 165;
    GEO.forEach((g, i) => {
      const r = (g.pct / maxPct) * maxR;
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', cx); ring.setAttribute('cy', cy); ring.setAttribute('r', 0);
      ring.setAttribute('class', 'geo-ring');
      ring.style.transition = `r 1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms, opacity 600ms ${i * 80}ms`;
      ringsGroup.appendChild(ring);

      // label angle around top arc
      const angle = (-Math.PI / 2) + (i / (GEO.length - 1)) * Math.PI * 1.05 - Math.PI * 0.05;
      const lx = cx + Math.cos(angle) * (r + 6);
      const ly = cy + Math.sin(angle) * (r + 6);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', lx);
      label.setAttribute('y', ly);
      label.setAttribute('class', 'geo-label');
      label.setAttribute('text-anchor', lx < cx - 10 ? 'end' : (lx > cx + 10 ? 'start' : 'middle'));
      label.textContent = g.region.toUpperCase().slice(0, 14);
      label.style.opacity = 0;
      label.style.transition = `opacity 500ms ${i * 80 + 600}ms`;
      ringsGroup.appendChild(label);

      // store for animation
      ring._target = r;
      ring._label = label;
    });

    const ringsObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          [...ringsGroup.querySelectorAll('circle')].forEach((c) => {
            c.setAttribute('r', c._target);
            c.style.opacity = 0.55;
            if (c._label) c._label.style.opacity = 1;
          });
        }
      });
    }, { threshold: 0.3 });
    ringsObs.observe(document.getElementById('ringsSvg'));
  }

  // populate geo list with bars
  const geoList = document.getElementById('geoList');
  if (geoList) {
    GEO.forEach((g) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="geo-pct">${g.pct}<span style="font-size:14px">%</span></span>
        <span class="geo-region">${g.region}</span>
        <span class="geo-bar"><span class="geo-bar-fill" data-pct="${g.pct}"></span></span>
      `;
      geoList.appendChild(li);
    });
    const fillObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          geoList.querySelectorAll('.geo-bar-fill').forEach((b, i) => {
            const pct = parseFloat(b.dataset.pct);
            setTimeout(() => { b.style.width = (pct / 35 * 100) + '%'; }, i * 60);
          });
        }
      });
    }, { threshold: 0.3 });
    fillObs.observe(geoList);
  }

  // ============ MERGE — TWO WAVES INTO ONE ============
  (function buildMerge() {
    const W = 360, H = 200;
    function buildPath(yStart, yEnd, freq, amp, phase) {
      let d = '';
      for (let x = 0; x <= W; x += 3) {
        const t = x / W;
        const yMid = yStart + (yEnd - yStart) * t;
        const damp = amp * (1 - t * 0.85);
        const y = yMid + Math.sin((x / W) * Math.PI * 2 * freq + phase) * damp;
        d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(2) + ' ';
      }
      return d;
    }
    function buildOut(yStart, freq, amp, phase) {
      let d = '';
      for (let x = 0; x <= W; x += 3) {
        const t = x / W;
        const damp = amp * t * 0.4;
        const y = yStart + Math.sin((x / W) * Math.PI * 2 * freq + phase) * damp;
        d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(2) + ' ';
      }
      return d;
    }
    const a = document.getElementById('mergeA');
    const b = document.getElementById('mergeB');
    const c = document.getElementById('mergeC');
    if (!a) return;
    a.setAttribute('d', buildPath(40, 100, 6, 14, 0));
    b.setAttribute('d', buildPath(160, 100, 4, 14, Math.PI));
    c.setAttribute('d', buildOut(100, 5, 14, 0));

    [a, b, c].forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms';
    });
    const lbl = document.getElementById('mergeLabelOut');

    const mergeObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !e.target.dataset.played) {
          e.target.dataset.played = '1';
          a.style.strokeDashoffset = '0';
          b.style.strokeDashoffset = '0';
          setTimeout(() => {
            c.style.opacity = '1';
            c.style.strokeDashoffset = '0';
            if (lbl) { lbl.style.transition = 'opacity 600ms'; lbl.style.opacity = '1'; }
          }, 1100);
        }
      });
    }, { threshold: 0.4 });
    mergeObs.observe(document.getElementById('mergeSvg'));
  })();

  // ============ COMPETITORS ============
  const COMPS = [
    {
      name: 'Cirrus Logic',
      ticker: 'CRUS',
      mcap: 8.56,
      rev: 1.90,
      pe: 21.19,
      growth: 7.04,
      flag: 'Apple rival',
      desc: `Competes for analog &amp; mixed-signal sockets <em class="serif">inside the iPhone</em> — both companies depend on Apple as their largest customer.`
    },
    {
      name: 'Qorvo',
      ticker: 'QRVO',
      mcap: 7.59,
      rev: 3.72,
      pe: 22.29,
      growth: -1.34,
      flag: 'Pending merger',
      merge: true,
      desc: `Skyworks' most direct RF rival. <em class="coral serif">Pending merger announced October 2025</em> — the duopoly becomes a single.`
    },
    {
      name: 'NXP',
      ticker: 'NXPI',
      mcap: 54.59,
      rev: 12.27,
      pe: 27.01,
      growth: -2.74,
      flag: 'Bigger, broader',
      desc: `An emerging threat in <em class="serif">automotive</em> connectivity, V2X, and secure IoT — exactly where Skyworks' Broad Markets bet lives.`
    },
  ];
  const SWKS_MCAP = 8.87;
  const rivals = document.getElementById('rivals');
  if (rivals) {
    // size scale: max 88px for SWKS, others scale by sqrt(mcap)
    const allCaps = [SWKS_MCAP, ...COMPS.map((c) => c.mcap)];
    const maxCap = Math.max(...allCaps);
    function sizeFor(mcap) {
      // sqrt area, max 88
      const area = Math.sqrt(mcap / maxCap);
      return Math.max(28, area * 88);
    }
    const swksSize = sizeFor(SWKS_MCAP);
    COMPS.forEach((c) => {
      const sz = sizeFor(c.mcap);
      const sign = c.growth >= 0 ? '+' : '';
      const negCls = c.growth < 0 ? ' neg' : '';
      const row = document.createElement('div');
      row.className = 'rival-row';
      if (c.merge) row.dataset.merge = 'true';
      row.innerHTML = `
        <div class="rival-head">
          <div class="rival-circle-wrap">
            <span class="rival-self" style="width:${swksSize}px;height:${swksSize}px"></span>
            <span class="rival-circle" style="width:${sz}px;height:${sz}px">${c.ticker}</span>
          </div>
          <div class="rival-meta">
            <div class="rival-name">${c.name}</div>
            <div class="rival-tag">${c.ticker} · $${c.mcap}B cap</div>
            <span class="rival-flag">${c.flag}</span>
          </div>
        </div>
        <div class="rival-stats">
          <div class="rival-stat"><div class="mono-meta">REVENUE</div><div class="rival-stat-val">$${c.rev}B</div></div>
          <div class="rival-stat"><div class="mono-meta">P/E TTM</div><div class="rival-stat-val">${c.pe}</div></div>
          <div class="rival-stat"><div class="mono-meta">GROWTH YoY</div><div class="rival-stat-val"><span class="${negCls.trim()}">${sign}${c.growth}%</span></div></div>
        </div>
        <p class="rival-desc">${c.desc}</p>
      `;
      rivals.appendChild(row);
    });
  }

  // ============ PAYOUT BAR ============
  const payoutBar = document.getElementById('payoutBar');
  const payoutPct = document.getElementById('payoutPct');
  if (payoutBar) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !e.target.dataset.played) {
          e.target.dataset.played = '1';
          // 100% = 222px in svg coords; 108.17% overshoots
          const fullWidth = 240 * (108.17 / 100); // overshoot past the line
          payoutBar.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
          // animate via attr change since SVG width is attribute
          let start = performance.now(), dur = 1200;
          function tick(t) {
            const k = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - k, 3);
            payoutBar.setAttribute('width', fullWidth * eased);
            if (payoutPct) payoutPct.textContent = (108.17 * eased).toFixed(1) + '%';
            if (k < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(document.getElementById('pipeSvg'));
  }

  // ============ REVEAL ============
  const revealEls = document.querySelectorAll('.beat, .reset');
  revealEls.forEach((el) => el.classList.add('reveal'));
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.08 });
  revealEls.forEach((el) => revObs.observe(el));
})();

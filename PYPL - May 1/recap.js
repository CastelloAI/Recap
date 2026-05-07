/* ============================================================
   PYPL Recap — interactivity
   - Scroll progress
   - Reveal-on-enter
   - Count-ups
   - Cost donut + interactive legend
   - Hero flow particles
   - Footprint dot-map
   - Bar fills
   - Competition tap-to-expand
   - Chrome dark-mode swap over dark beats
   ============================================================ */

(function () {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // ========== 1. Scroll progress hairline ==========
  const progress = $('#progress');
  const chrome   = $('#chrome');
  const stage    = $('#stage');

  function updateProgress () {
    const max = stage.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, max)));
    progress.style.setProperty('--p', (p * 100).toFixed(2) + '%');

    // Chrome inverts when over a dark beat
    const chromeBottom = chrome.getBoundingClientRect().bottom;
    let onDark = false;
    document.querySelectorAll('.dark-beat, .reset.dark, .footprint').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top <= chromeBottom + 1 && r.bottom >= chromeBottom + 1) onDark = true;
    });
    chrome.classList.toggle('dark', onDark);
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ========== 2. Reveal on enter ==========
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // Cascade reveals to direct children with .reveal
        $$('.reveal', e.target).forEach((el, i) => {
          setTimeout(() => el.classList.add('in'), 80 * i);
        });
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  $$('section, .reset').forEach(el => io.observe(el));
  $$('.reveal').forEach(el => io.observe(el));

  // ========== 3. Count-ups ==========
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1300;
      const t0 = performance.now();
      const isFloat = target % 1 !== 0;
      function tick (t) {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        const v = target * eased;
        el.textContent = (isFloat ? v.toFixed(1) : Math.round(v)) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  // ========== 4. Bar fills ==========
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const row = e.target;
      const ratio = parseFloat(row.dataset.bar);
      const fill = row.querySelector('.fill');
      if (fill) fill.style.width = (ratio * 100) + '%';
      barIO.unobserve(row);
    });
  }, { threshold: 0.4 });
  $$('[data-bar]').forEach(el => barIO.observe(el));

  // SVG bar-anim (the buyback / div bars in dark beat)
  const svgBarIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const r = e.target;
      const w = parseFloat(r.dataset.w);
      r.style.transition = 'width 1100ms cubic-bezier(.22,1,.36,1)';
      requestAnimationFrame(() => { r.setAttribute('width', w); });
      svgBarIO.unobserve(r);
    });
  }, { threshold: 0.4 });
  $$('.bar-anim').forEach(el => svgBarIO.observe(el));

  // ========== 5. Cost donut ==========
  const costData = [
    { pct: 53, color: '#4F86C6', label: 'Cost of revenue', sub: 'transaction expense + losses' },
    { pct: 9,  color: '#F4A261', label: 'Research & development', sub: 'platform engineering' },
    { pct: 7,  color: '#2A9D8F', label: 'Sales & marketing', sub: 'merchant + consumer acq.' },
    { pct: 5,  color: '#E76F51', label: 'General & administrative', sub: 'corporate overhead' },
    { pct: 4,  color: '#8338EC', label: 'Customer support & ops', sub: 'service the rails' },
  ];
  const RAD = 100;
  const STROKE = 46;
  const C = 2 * Math.PI * RAD;
  const slicesG = $('#costSlices');
  const totalPct = costData.reduce((a, b) => a + b.pct, 0); // 78
  let runningPct = 0;

  costData.forEach((d, i) => {
    const len = (d.pct / 100) * C;
    const offset = (runningPct / 100) * C;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', RAD);
    c.setAttribute('fill', 'none');
    c.setAttribute('stroke', d.color);
    c.setAttribute('stroke-width', STROKE);
    c.setAttribute('stroke-dasharray', `0 ${C}`);
    c.setAttribute('transform', 'rotate(-90)');
    c.style.transition = 'stroke-dasharray 1100ms cubic-bezier(.22,1,.36,1), opacity 220ms ease, stroke-width 220ms ease';
    c.dataset.target = `${len} ${C}`;
    c.dataset.offset = offset;
    c.dataset.idx = i;
    // Use stroke-dashoffset for placement
    c.setAttribute('stroke-dashoffset', -offset);
    slicesG.appendChild(c);
    runningPct += d.pct;
  });

  // Animate slices on visibility
  const pieIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      $$('#costSlices circle').forEach((c, i) => {
        setTimeout(() => {
          c.setAttribute('stroke-dasharray', c.dataset.target);
        }, i * 120);
      });
      pieIO.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  pieIO.observe($('#costPie'));

  // Legend rendering
  const legend = $('#costLegend');
  costData.forEach((d, i) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.idx = i;
    row.innerHTML = `
      <span class="swatch" style="background:${d.color}"></span>
      <span class="lab">${d.label}<br><span style="font-family:var(--font-mono); font-size:9.5px; letter-spacing:.1em; color:var(--ink-3); text-transform:uppercase;">${d.sub}</span></span>
      <span class="pct">${d.pct}%</span>
    `;
    legend.appendChild(row);
  });

  // Other 22%
  const other = document.createElement('div');
  other.className = 'row';
  other.innerHTML = `
    <span class="swatch" style="background:transparent; border:1px dashed var(--line-strong);"></span>
    <span class="lab" style="color:var(--ink-2); font-style:italic; font-family:var(--font-display); font-size:15px;">What survives — operating margin & residuals</span>
    <span class="pct" style="color:var(--ink-2);">22%</span>
  `;
  legend.appendChild(other);

  // Legend hover/tap = highlight slice
  $$('#costLegend .row').forEach(row => {
    row.addEventListener('click', () => {
      const idx = row.dataset.idx;
      $$('#costLegend .row').forEach(r => r.classList.toggle('active', r === row));
      const slices = $$('#costSlices circle');
      const center = $('#costCenterPct');
      const lab = $('#costCenterLab');
      if (idx === undefined) return;
      slices.forEach((c, i) => {
        c.style.opacity = (String(i) === idx) ? '1' : '0.18';
        c.style.strokeWidth = (String(i) === idx) ? '54' : '46';
      });
      const d = costData[idx];
      if (d) {
        center.innerHTML = `${d.pct}<tspan font-size="22" font-style="italic" fill="${d.color}">¢</tspan>`;
        lab.textContent = d.label.toUpperCase();
      }
    });
  });

  // Reset highlight when leaving legend
  legend.addEventListener('mouseleave', () => {
    $$('#costSlices circle').forEach(c => { c.style.opacity = '1'; c.style.strokeWidth = '46'; });
    $$('#costLegend .row').forEach(r => r.classList.remove('active'));
    $('#costCenterPct').innerHTML = `78<tspan font-size="22" font-style="italic" fill="#4F86C6">¢</tspan>`;
    $('#costCenterLab').textContent = 'PER DOLLAR OUT';
  });

  // ========== 6. Hero flow particles ==========
  const flowDots = $('#flowDots');
  if (flowDots) {
    // Path: buyer (56,140) -> middle (190,140) -> merchant (324,140), arched
    function dot (delay, dir) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', '3');
      c.setAttribute('fill', '#4F86C6');
      c.setAttribute('opacity', '0');
      flowDots.appendChild(c);
      const path = (dir === 'fwd')
        ? [{x:56,y:140},{x:122,y:90},{x:190,y:140}]   // buyer to middle (top arch)
        : [{x:190,y:140},{x:258,y:90},{x:324,y:140}]; // middle to merchant (top arch)
      const dur = 1800;
      function start (t0) {
        function tick (t) {
          const k = ((t - t0) / dur) % 1;
          const e = k;
          // quadratic bezier
          const x = (1-e)*(1-e)*path[0].x + 2*(1-e)*e*path[1].x + e*e*path[2].x;
          const y = (1-e)*(1-e)*path[0].y + 2*(1-e)*e*path[1].y + e*e*path[2].y;
          c.setAttribute('cx', x);
          c.setAttribute('cy', y);
          // fade in/out at edges
          const o = Math.sin(k * Math.PI);
          c.setAttribute('opacity', (o * 0.85).toFixed(2));
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
      setTimeout(() => start(performance.now()), delay);
    }
    // Forward dots (buyer→PYPL)
    for (let i = 0; i < 5; i++) dot(i * 360, 'fwd');
    // Onward (PYPL→merchant), staggered
    for (let i = 0; i < 5; i++) dot(180 + i * 360, 'mer');
  }

  // ========== 7. Footprint dot map ==========
  const dotMap = $('#dotMap');
  if (dotMap) {
    // Two abstract continents formed by dot grids: left = Americas, right = world
    function makeDots (cx, cy, rx, ry, count, color) {
      const out = [];
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());
        const x = cx + Math.cos(a) * r * rx + (Math.random() - 0.5) * 4;
        const y = cy + Math.sin(a) * r * ry + (Math.random() - 0.5) * 4;
        out.push({x, y, color});
      }
      return out;
    }
    const usDots = makeDots(118, 100, 60, 38, 110, '#7AB1E8');
    const exDots = makeDots(262, 100, 80, 50, 130, '#3D5A80');
    [...exDots, ...usDots].forEach(d => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', d.x); c.setAttribute('cy', d.y);
      c.setAttribute('r', 1.5); c.setAttribute('fill', d.color);
      c.setAttribute('opacity', 0.55 + Math.random() * 0.35);
      dotMap.appendChild(c);
    });
  }

  // ========== 8. Competition tap-to-expand ==========
  $$('.comp-row').forEach(row => {
    if (row.classList.contains('pypl')) return; // benchmark stays open look-only
    row.addEventListener('click', (e) => {
      const expanded = row.classList.toggle('expanded');
      // ripple
      const rect = row.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'tap-ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      ripple.style.width = ripple.style.height = '40px';
      row.style.position = 'relative';
      row.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
      // hint text
      const hint = row.querySelector('.tap-hint');
      if (hint && hint.textContent.startsWith('TAP')) {
        hint.textContent = expanded ? '— TAP TO COLLAPSE —' : 'TAP TO EXPAND →';
      }
    });
  });

  // PYPL row starts expanded
  document.querySelector('.comp-row.pypl').classList.add('expanded');

})();

/* ============================================================
   Morgan Stanley Recap — scroll-driven motion
   ============================================================ */

(() => {
  // ---------- Scroll progress hairline ----------
  const bar = document.getElementById('progress-bar');
  const updateProgress = () => {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    const pct = Math.max(0, Math.min(1, h.scrollTop / max));
    bar.style.width = (pct * 100).toFixed(2) + '%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ---------- Counter on enter ----------
  const fmt = (val, decimals, comma) => {
    let s = val.toFixed(decimals);
    if (comma && decimals === 0) {
      s = Number(s).toLocaleString('en-US');
    }
    return s;
  };
  const animateCounter = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const to = parseFloat(el.dataset.to);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const comma = 'comma' in el.dataset;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1100;
    const t0 = performance.now();
    const innerNum = el.querySelector('.num');
    const target = innerNum || el;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      // ease-out cubic
      const e = 1 - Math.pow(1 - t, 3);
      const v = to * e;
      target.textContent = prefix + fmt(v, decimals, comma) + (innerNum ? '' : '');
      if (innerNum) target.textContent = fmt(v, decimals, comma);
      else target.textContent = prefix + fmt(v, decimals, comma) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ---------- IntersectionObserver: counters + cost bars + weights + comp bars ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.matches('[data-counter]')) {
        animateCounter(el);
      }
      if (el.matches('.cost-row, .weight, .comp-row')) {
        el.classList.add('in');
      }
      io.unobserve(el);
    });
  }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('[data-counter], .cost-row, .weight, .comp-row').forEach((el) => io.observe(el));

  // Force counters inside hero to run almost immediately on load
  setTimeout(() => {
    document.querySelectorAll('#beat-hero [data-counter]').forEach(animateCounter);
  }, 250);

  // ---------- 2 · Streams: build scroll-driven river paths ----------
  const buildStreams = () => {
    const beat = document.getElementById('beat-streams');
    if (!beat) return;
    const r1 = document.getElementById('river-1');
    const r2 = document.getElementById('river-2');
    const r3 = document.getElementById('river-3');

    // Layout: 3 stripes at x=60,180,300. Streams start narrow at top and
    // widen to their final share by 70% scroll progress.
    // 33.1, 31.8, 6.0 → relative widths
    const W = 360, H = 720;
    const totals = [33.1, 31.8, 6.0];
    const max = Math.max(...totals);
    const finalWidths = totals.map((t) => 56 + (t / max) * 56); // px
    const centers = [60, 180, 300];

    const draw = (path, cx, finalW, progress) => {
      // Width grows from 6 to finalW with progress
      const w = 6 + (finalW - 6) * progress;
      const top = 0, bot = H;
      // Subtle wavering S-curve
      const sway = 14 * progress;
      const c1y = H * 0.25;
      const c2y = H * 0.75;
      const left  = (y) => `${cx - w/2 + Math.sin(y/H * Math.PI * 2) * sway} ${y}`;
      const right = (y) => `${cx + w/2 + Math.sin(y/H * Math.PI * 2) * sway} ${y}`;
      const d = `
        M ${cx - 3} 0
        C ${cx - w/2} ${c1y}, ${cx - w/2} ${c2y}, ${left(bot)}
        L ${right(bot)}
        C ${cx + w/2} ${c2y}, ${cx + w/2} ${c1y}, ${cx + 3} 0
        Z`;
      path.setAttribute('d', d);
    };

    const update = () => {
      const rect = beat.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when beat top is at viewport bottom; 1 when beat bottom is at viewport top
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      // Smooth easing
      const e = p < 0.05 ? 0 : Math.min(1, (p - 0.05) / 0.7);
      draw(r1, centers[0], finalWidths[0], e);
      draw(r2, centers[1], finalWidths[1], e);
      draw(r3, centers[2], finalWidths[2], e);
    };

    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  };
  buildStreams();

  // ---------- 5 · Geo: concentric wedges that fill on scroll ----------
  const buildGeo = () => {
    const g = document.getElementById('geo-wedges');
    if (!g) return;
    const beat = document.getElementById('beat-geo');
    const data = [
      { pct: 68, color: '#0E2240', r: 150 }, // Americas — outer
      { pct: 18, color: '#1F3D72', r: 110 }, // EMEA
      { pct: 14, color: '#FF7A57', r: 70  }, // APAC
    ];
    const cx = 180, cy = 180;

    const arc = (cx, cy, r, startDeg, endDeg) => {
      const sa = (startDeg - 90) * Math.PI / 180;
      const ea = (endDeg - 90) * Math.PI / 180;
      const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
      const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
      const large = endDeg - startDeg > 180 ? 1 : 0;
      return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    };

    // Build wedges (initially zero degrees)
    data.forEach((d, i) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', d.color);
      path.setAttribute('opacity', '0.92');
      path.dataset.i = i;
      g.appendChild(path);
    });

    const update = () => {
      const rect = beat.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      const e = Math.max(0, Math.min(1, (p - 0.1) / 0.55));
      const eased = 1 - Math.pow(1 - e, 3);
      const paths = g.querySelectorAll('path');
      data.forEach((d, i) => {
        const deg = 360 * (d.pct / 100) * eased;
        if (deg <= 0.01) {
          paths[i].setAttribute('d', '');
          return;
        }
        // Anchor each wedge starting at -deg/2 so it grows symmetrically from the top
        const start = -deg / 2;
        const end = deg / 2;
        // Wedge path centered on top
        paths[i].setAttribute('d', arc(cx, cy, d.r, start + 360, end + 360));
      });
    };
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  };
  buildGeo();

  // ---------- 6 · Vault arc fills with scroll over the bet section ----------
  const buildVault = () => {
    const arc = document.getElementById('vault-arc');
    const beat = document.getElementById('beat-bet');
    if (!arc || !beat) return;
    const update = () => {
      const rect = beat.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      // Map middle-end of section to arc fill
      const e = Math.max(0, Math.min(1, (p - 0.45) / 0.4));
      const eased = 1 - Math.pow(1 - e, 3);
      // 15.0% of 100 = 15 of pathLength 100 — but visual: scale to 60% arc for drama
      const filled = 60 * eased;
      arc.setAttribute('stroke-dasharray', `${filled} ${100 - filled}`);
    };
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  };
  buildVault();

  // ---------- 7 · Competitor expand/collapse ----------
  const list = document.getElementById('comp-list');
  if (list) {
    list.addEventListener('click', (ev) => {
      const btn = ev.target.closest('.comp-btn');
      if (!btn) return;
      const row = btn.closest('.comp-row');
      if (!row || row.classList.contains('comp-self')) return;
      const wasActive = row.hasAttribute('data-active');
      // Single-open (excluding self)
      list.querySelectorAll('.comp-row:not(.comp-self)').forEach((r) => r.removeAttribute('data-active'));
      if (!wasActive) row.setAttribute('data-active', '');
    });
  }
})();

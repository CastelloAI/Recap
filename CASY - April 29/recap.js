/* Casey's Recap — scroll-driven motion + builds */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- 1. PROGRESS BAR ---------- */
  const bar = $('#bar');
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
    bar.style.width = (pct * 100) + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. HERO PIN FIELD — 2,900 dots, US-shaped scatter ---------- */
  // Stylized US bbox in px relative to hero width (430-ish max). We use CSS % positioning.
  // Use a pseudo-distribution: dense in upper-middle (Midwest), medium in lower-middle (South),
  // sparse on the coasts to keep the feeling of a Casey's footprint without literally mapping.
  const pinfield = $('#pinfield');
  const W = 100, H = 100; // percent space
  // Region rectangles: [xMin, xMax, yMin, yMax, density 0..1, isCasey]
  const regions = [
    // Casey's heartland — upper midwest
    [28, 62, 18, 50, 1.00, true],
    // Casey's south expansion
    [38, 70, 50, 78, 0.55, true],
    // Coasts / non-Casey filler — muted
    [4,  22, 22, 60, 0.25, false], // west
    [76, 96, 22, 70, 0.25, false], // east
    [10, 30, 60, 88, 0.18, false], // SW
  ];
  const pins = [];
  // 2900 stores → render 290 pins (each pin = 10 stores) for performance/legibility
  const TARGET = 290;
  let made = 0, attempts = 0;
  while (made < TARGET && attempts < 8000) {
    attempts++;
    const r = regions[(Math.random() * regions.length) | 0];
    if (Math.random() > r[4]) continue;
    const x = r[0] + Math.random() * (r[1] - r[0]);
    const y = r[2] + Math.random() * (r[3] - r[2]);
    pins.push({ x, y, casey: r[5] });
    made++;
  }
  pins.forEach((p, i) => {
    const el = document.createElement('span');
    el.className = 'pin' + (p.casey ? '' : ' pin--mute');
    el.style.left = p.x + '%';
    el.style.top = p.y + '%';
    el.style.animationDelay = (Math.min(i, 200) * 6 + Math.random() * 200) + 'ms';
    pinfield.appendChild(el);
  });

  /* ---------- 3. INTERSECTION REVEAL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
      }
    });
  }, { threshold: 0.25 });

  // mark common elements as reveal
  $$('.beat, .reset, .stream, .map, .cents-grid, .flow-tree, .scale-row').forEach(el => {
    io.observe(el);
  });

  /* ---------- 4. COUNT-UPS ---------- */
  const countUp = (el, end, decimals = 0, dur = 1400) => {
    const start = performance.now();
    const from = 0;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const v = from + (end - from) * ease(t);
      const formatted = decimals
        ? v.toFixed(decimals)
        : Math.round(v).toLocaleString('en-US');
      el.textContent = formatted;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = $$('[data-count]');
  const cIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = "1";
        const end = parseFloat(e.target.dataset.count);
        const dec = parseInt(e.target.dataset.decimals || '0', 10);
        countUp(e.target, end, dec);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cIo.observe(el));

  /* ---------- 5. CENTS GRID — 100 cells, colored per cost ---------- */
  const cents = $('#cents');
  const palette = [
    { c: '#E63946', n: 55 },
    { c: '#F4A261', n: 21 },
    { c: '#2A9D8F', n: 11 },
    { c: '#457B9D', n: 3  },
    { c: '#8338EC', n: 3  },
    // remaining 7 cells stay default — "what survives"
  ];
  // Build sequence of 100 colors
  const seq = [];
  palette.forEach(p => {
    for (let i = 0; i < p.n; i++) seq.push(p.c);
  });
  while (seq.length < 100) seq.push(''); // empty = default paper

  const frag = document.createDocumentFragment();
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement('span');
    cell.className = 'cent';
    if (seq[i]) {
      cell.dataset.c = seq[i];
      cell.style.setProperty('--cc', seq[i]);
    }
    cell.style.transitionDelay = (i * 14) + 'ms';
    frag.appendChild(cell);
  }
  cents.appendChild(frag);

  /* ---------- 6. MAP — generate stylized US tile-shape + pins ---------- */
  const states = $('#map-states');
  const mapPins = $('#map-pins');
  // Hand-laid grid of state tiles in an (approx) US silhouette.
  // Coords are SVG (viewBox 320x220). r=row, c=col, region: mw|s|o
  const tile = (x, y, w, h, region) => {
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', w); r.setAttribute('height', h);
    r.setAttribute('rx', 2);
    r.setAttribute('class', region);
    states.appendChild(r);
  };
  // Layout: 12 cols × 7 rows, cell ~ 22×22 with 2px gap
  const C = 22, GAP = 2;
  const offX = 18, offY = 22;
  const xy = (col, row) => [offX + col * (C + GAP), offY + row * (C + GAP)];
  // 'X' marks empty (ocean / off-map). 'm'=midwest, 's'=south, 'o'=other
  const grid = [
    // 12 cols
    "Xoo XXX XXX X".replace(/ /g, ''), // r0 — Pac NW + N
    "ooommmmmmoXX".slice(0,12),
    "ooommmmmmmoo",
    "ooomms ssmoo",
    "Xoss sssssoX",
    "Xoss ssss XX",
    "XXX ss XXXX X",
  ];
  // Custom hand-built layout (more readable)
  const layout = [
    // row 0
    [['o',0],['o',1],null,null,null,null,null,null,['o',8],['o',9],null,['o',11]],
    // row 1 — across the top
    [['o',0],['m',1],['m',2],['m',3],['m',4],['m',5],['m',6],['m',7],['o',8],['o',9],['o',10],['o',11]],
    // row 2 — heartland
    [['o',0],['m',1],['m',2],['m',3],['m',4],['m',5],['m',6],['m',7],['m',8],['o',9],['o',10],null],
    // row 3
    [['o',0],['m',1],['m',2],['m',3],['m',4],['m',5],['m',6],['m',7],['m',8],['o',9],['o',10],null],
    // row 4 — south band starts
    [null,['o',1],['s',2],['s',3],['s',4],['s',5],['s',6],['s',7],['s',8],['o',9],null,null],
    // row 5
    [null,['s',1],['s',2],['s',3],['s',4],['s',5],['s',6],['s',7],['s',8],null,null,null],
    // row 6 — gulf / florida
    [null,null,['s',2],['s',3],null,['s',5],['s',6],['s',7],['s',8],['s',9],null,null],
  ];
  layout.forEach((row, r) => {
    row.forEach(cell => {
      if (!cell) return;
      const [region, c] = cell;
      const [x, y] = xy(c, r);
      tile(x, y, C, C, region);
    });
  });

  // Footprint pins — denser on midwest tiles
  const pinSpec = [
    // [col, row, count]
    [2, 1, 4],[3, 1, 4],[4, 1, 5],[5, 1, 4],[6, 1, 4],
    [2, 2, 5],[3, 2, 6],[4, 2, 7],[5, 2, 7],[6, 2, 6],[7, 2, 5],
    [2, 3, 5],[3, 3, 6],[4, 3, 6],[5, 3, 6],[6, 3, 5],[7, 3, 4],
    [3, 4, 3],[4, 4, 3],[5, 4, 4],[6, 4, 3],
    [3, 5, 2],[4, 5, 2],[6, 5, 2],[7, 5, 2],
    [5, 6, 2],
  ];
  pinSpec.forEach(([col, row, n], idx) => {
    const [x0, y0] = xy(col, row);
    for (let k = 0; k < n; k++) {
      const cx = x0 + 3 + Math.random() * (C - 6);
      const cy = y0 + 3 + Math.random() * (C - 6);
      const cir = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      cir.setAttribute('cx', cx);
      cir.setAttribute('cy', cy);
      cir.setAttribute('r', 0.9);
      cir.style.transitionDelay = ((idx * 30) + (k * 12)) + 'ms';
      mapPins.appendChild(cir);
    }
  });

  // Trigger map "in" once visible
  const mapEl = $('.map');
  const mIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) mapEl.classList.add('in');
    });
  }, { threshold: 0.35 });
  mIo.observe(mapEl);

})();

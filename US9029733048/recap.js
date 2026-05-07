/* ============================================================
   USB · Recap — scroll-driven motion
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Scroll progress ---------- */
  const progressFill = $('#progressFill');
  const page = document.scrollingElement || document.documentElement;

  function updateProgress() {
    const max = page.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, page.scrollTop / max)) : 0;
    progressFill.style.width = (p * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- Hero ledger spine ---------- */
  const ledgerLines = $('#ledgerLines');
  if (ledgerLines) {
    const linesCount = 22;
    let html = '';
    for (let i = 0; i < linesCount; i++) {
      const y = 16 + i * 22;
      html += `<line x1="6" y1="${y}" x2="120" y2="${y}" stroke="url(#spineFade)" stroke-width="0.5"/>`;
    }
    ledgerLines.innerHTML = html;
  }

  /* hero lines stagger in */
  setTimeout(() => {
    $$('.hero-h .hero-line').forEach((el) => el.classList.add('in'));
  }, 120);

  /* ---------- IntersectionObserver: add .in to beats once on entry ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // streams: per-bar height
        if (e.target.classList.contains('business')) {
          $$('.stream', e.target).forEach((s, i) => {
            const pct = parseFloat(s.dataset.pct);
            // scale so 31% maps near 95% bar height
            const h = (pct / 31) * 95;
            s.style.setProperty('--h', h + '%');
            setTimeout(() => s.classList.add('in'), i * 140);
          });
        }
        if (e.target.classList.contains('scale')) {
          $$('.scale-num', e.target).forEach((el) => animateCount(el));
        }
      }
    });
  }, { threshold: 0.18 });

  $$('[data-beat]').forEach((b) => io.observe(b));

  /* ---------- Count up ---------- */
  function animateCount(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isFloat = !Number.isInteger(target);
    const dur = 1400;
    const t0 = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = target * eased;
      el.textContent = (isFloat ? v.toFixed(2) : Math.round(v)) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = (isFloat ? target.toFixed(target % 1 === 0 ? 0 : (target.toString().split('.')[1] || '').length) : target) + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Dollar broken into cents ---------- */
  // categories from biggest_costs sum to 63%; the remaining 37% are uncolored "other"
  const COSTS = [
    { pct: 33, color: '#1E3A5F', label: 'Compensation & Employee Benefits' }, // we re-tone the supplied colors slightly to fit our palette? No — must HONOR supplied hex on this chart only.
    { pct: 8,  color: '#E8734A', label: 'Provision for Credit Losses' },
    { pct: 7,  color: '#6DBF67', label: 'Technology & Communications' },
    { pct: 5,  color: '#9B59B6', label: 'Net Occupancy & Equipment' },
    { pct: 10, color: '#F1C40F', label: 'Professional Services & Other' },
  ];
  // Replace with the EXACT supplied hex per spec
  const COSTS_OFFICIAL = [
    { pct: 33, color: '#4A90D9', label: 'Compensation & Employee Benefits' },
    { pct: 10, color: '#F1C40F', label: 'Professional Services & Other' },
    { pct: 8,  color: '#E8734A', label: 'Provision for Credit Losses' },
    { pct: 7,  color: '#6DBF67', label: 'Technology & Communications' },
    { pct: 5,  color: '#9B59B6', label: 'Net Occupancy & Equipment' },
  ];

  const dollar = $('#dollarGrid');
  const legend = $('#costLegend');
  if (dollar && legend) {
    // build 100 cells
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('span');
      cell.className = 'cent';
      dollar.appendChild(cell);
    }
    const cells = $$('.cent', dollar);
    // assign colors by row order: fill from top-left across rows
    let i = 0;
    COSTS_OFFICIAL.forEach((c) => {
      for (let k = 0; k < c.pct; k++, i++) {
        cells[i].dataset.cat = c.label;
        cells[i].dataset.color = c.color;
      }
    });

    // legend
    legend.innerHTML = COSTS_OFFICIAL.map((c) => `
      <li class="cost-row" data-cat="${c.label}">
        <span class="cost-swatch" style="background:${c.color}"></span>
        <span class="cost-name">${c.label}</span>
        <span class="cost-pct">${c.pct}<small>¢</small></span>
      </li>
    `).join('');

    // animate fill on entry, staggered by row
    const dollarIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        cells.forEach((cell, idx) => {
          const col = idx % 10;
          const row = Math.floor(idx / 10);
          const delay = (row * 60 + col * 18);
          setTimeout(() => {
            if (cell.dataset.color) {
              cell.style.background = cell.dataset.color;
            }
          }, delay);
        });
        dollarIO.disconnect();
      });
    }, { threshold: 0.3 });
    dollarIO.observe(dollar);

    // hover cross-highlight
    $$('.cost-row', legend).forEach((row) => {
      row.addEventListener('mouseenter', () => {
        const cat = row.dataset.cat;
        cells.forEach((c) => {
          c.style.opacity = (c.dataset.cat === cat || !c.dataset.cat) ? '1' : '0.18';
        });
      });
      row.addEventListener('mouseleave', () => {
        cells.forEach((c) => { c.style.opacity = '1'; });
      });
    });
  }

  /* ---------- US map dots ---------- */
  const usDots = $('#usDots');
  if (usDots) {
    // hand-placed approximate city pins, weighted to USB's Midwest+West stronghold
    const pins = [
      // Midwest stronghold
      { x: 200, y: 100, r: 4.2, flagship: true, label: 'Minneapolis HQ' },
      { x: 215, y: 110, r: 2.6 },
      { x: 200, y: 122, r: 2.6 },
      { x: 178, y: 108, r: 2.4 },
      { x: 224, y: 132, r: 2.6 }, // Chicago-ish
      { x: 192, y: 138, r: 2.2 },
      { x: 168, y: 130, r: 2.0 },
      { x: 232, y: 122, r: 2.4 },
      { x: 245, y: 108, r: 2.0 },
      // West
      { x: 80,  y: 110, r: 2.8 }, // SF
      { x: 88,  y: 134, r: 2.6 }, // LA
      { x: 76,  y: 88,  r: 2.4 }, // Portland
      { x: 78,  y: 78,  r: 2.4 }, // Seattle
      { x: 110, y: 112, r: 2.0 },
      { x: 120, y: 132, r: 2.2 },
      { x: 105, y: 100, r: 2.0 },
      { x: 130, y: 145, r: 2.2 }, // Phoenix
      // Mountain / plains
      { x: 148, y: 110, r: 2.0 }, // Denver
      { x: 150, y: 90,  r: 1.8 },
      { x: 162, y: 145, r: 1.8 },
      // East coast (growing)
      { x: 282, y: 100, r: 2.4 }, // NYC
      { x: 270, y: 112, r: 2.0 }, // Philly
      { x: 268, y: 124, r: 2.0 }, // DC
      { x: 290, y: 92,  r: 1.8 }, // Boston
      { x: 280, y: 144, r: 1.8 }, // Charlotte
      { x: 275, y: 162, r: 1.8 }, // Atlanta
      // Texas
      { x: 200, y: 168, r: 2.4 }, // Dallas
      { x: 195, y: 182, r: 2.0 }, // Houston
      { x: 175, y: 178, r: 1.8 },
      // South
      { x: 240, y: 168, r: 1.8 },
      { x: 255, y: 180, r: 1.8 },
    ];
    const html = pins.map((p, i) => {
      const cls = 'pin' + (p.flagship ? ' pin-flagship' : '');
      const delay = 0.15 + (i * 0.025);
      return `<circle class="${cls}" cx="${p.x}" cy="${p.y}" r="${p.r}" style="transition-delay:${delay}s"/>` +
        (p.flagship ? `<circle cx="${p.x}" cy="${p.y}" r="${p.r + 4}" fill="none" stroke="${'var(--signal)'}" stroke-width="0.6" opacity="0.6"><animate attributeName="r" from="${p.r}" to="${p.r + 8}" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="2.2s" repeatCount="indefinite"/></circle>` : '');
    }).join('');
    usDots.innerHTML = html;
  }

  /* ---------- Back to top ---------- */
  const totop = $('#totop');
  if (totop) {
    totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Parallax on hero spine ---------- */
  const spine = $('.ledger-spine');
  function onScroll() {
    if (spine) {
      const y = window.scrollY * 0.18;
      spine.style.transform = `translateY(${-y}px)`;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

})();

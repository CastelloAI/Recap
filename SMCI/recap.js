/* ============================================================
   SMCI Recap — scroll choreography
   ============================================================ */

(function () {
  'use strict';

  // -------- Scroll progress hairline --------
  const progress = document.getElementById('progressFill');
  function onScroll() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
    progress.style.width = (p * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- Activate hero (data-active) --------
  const heroes = document.querySelectorAll('.hero');
  const heroObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.dataset.active = 'true';
    });
  }, { threshold: 0.15 });
  heroes.forEach(h => heroObs.observe(h));

  // -------- Generic in-view reveal --------
  const reveals = document.querySelectorAll('.beat, .reset');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in-view');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  // -------- Counter animation --------
  function animateCounter(el, to, decimals, prefix, suffix) {
    const dur = 1400;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const v = ease(t) * to;
      el.textContent = (prefix || '') + v.toFixed(decimals) + (suffix || '');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Hero counter
  document.querySelectorAll('.counter').forEach(el => {
    const to = parseFloat(el.dataset.to);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const heroEl = el.closest('.hero');
    if (!heroEl) return;
    let triggered = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !triggered) {
          triggered = true;
          animateCounter(el, to, decimals, '', '');
        }
      });
    }, { threshold: 0.4 });
    obs.observe(heroEl);
  });

  // Inline data-counter elements (rack blocks)
  document.querySelectorAll('[data-counter]').forEach(el => {
    const to = parseFloat(el.dataset.to);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    let triggered = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !triggered) {
          triggered = true;
          animateCounter(el, to, decimals, prefix, suffix);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  // -------- Rack block fill (sets --fill from data-fill) --------
  document.querySelectorAll('.rack-block').forEach(el => {
    const fill = parseFloat(el.dataset.fill || '0');
    el.style.setProperty('--fill', fill);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) el.classList.add('in-view');
      });
    }, { threshold: 0.3 });
    obs.observe(el);
  });

  // -------- Scale bars --------
  document.querySelectorAll('.scale-bar').forEach(el => {
    const w = parseFloat(el.dataset.w || '0');
    el.style.setProperty('--w', w);
    const beat = el.closest('.beat');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) el.classList.add('in-view');
      });
    }, { threshold: 0.3 });
    obs.observe(beat || el);
  });

  // -------- Build cents grid --------
  const centsGrid = document.getElementById('centsGrid');
  if (centsGrid) {
    // 100 dots, layout row-major top->bottom, left->right.
    // 89 = cost (#1A1714 dim), 11 = gross profit (amber), of which 5.7 ≈ 6 are operating (bright)
    // Strategy: top 89 cells = cost, bottom 11 cells = profit.
    // Bottom-right 6 cells of the gross 11 are operating-profit (brighter).
    for (let i = 0; i < 100; i++) {
      const cent = document.createElement('div');
      cent.className = 'cent';
      // We want gross profit to be the BOTTOM 11 dots (last row + 1 in row 9).
      // i 0..88 = cost (89 dots), i 89..99 = gross (11 dots), of which i 94..99 (6) = operating
      if (i < 89) {
        cent.classList.add('cent-cost');
      } else if (i < 94) {
        cent.classList.add('cent-gross');
      } else {
        cent.classList.add('cent-op');
      }
      // staggered delay for poured-in effect
      cent.style.setProperty('--d', (i * 8) + 'ms');
      cent.style.transitionDelay = (i * 8) + 'ms';
      centsGrid.appendChild(cent);
    }
    const centsObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) centsGrid.classList.add('in-view');
      });
    }, { threshold: 0.2 });
    centsObs.observe(centsGrid);
  }

  // -------- Cost stack segments --------
  const costStack = document.getElementById('costStack');
  if (costStack) {
    const costs = [
      { pct: 89, label: 'Cost of revenue', cls: 'cost-seg-89', h: 280 },
      { pct: 3,  label: 'Research & development', cls: 'cost-seg-3', h: 28 },
      { pct: 2,  label: 'Sales, general & admin', cls: 'cost-seg-2', h: 22, small: true },
      { pct: 1,  label: 'Stock-based comp', cls: 'cost-seg-1', h: 16, small: true }
    ];
    costs.forEach(c => {
      const seg = document.createElement('div');
      seg.className = 'cost-seg ' + c.cls + (c.small ? ' cost-seg-small' : '');
      seg.style.setProperty('--h', c.h + 'px');
      seg.innerHTML = `
        <span class="cost-seg-label">${c.label}</span>
        <span class="cost-seg-pct">${c.pct}<sup>%</sup></span>
      `;
      costStack.appendChild(seg);
    });
    const costObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) costStack.classList.add('in-view');
      });
    }, { threshold: 0.25 });
    costObs.observe(costStack);
  }

  // -------- Footprint stage --------
  const fpStage = document.getElementById('footprintStage');
  if (fpStage) {
    fpStage.querySelectorAll('.fp-bar i').forEach(el => {
      // already styled via inline --w
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) fpStage.classList.add('in-view');
      });
    }, { threshold: 0.2 });
    obs.observe(fpStage);
  }

  // -------- Comp bars --------
  document.querySelectorAll('.comp-bar').forEach(el => {
    const w = parseFloat(el.dataset.w || '0');
    el.style.setProperty('--w', w);
    const row = el.closest('.comp-row');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) el.classList.add('in-view');
      });
    }, { threshold: 0.3 });
    obs.observe(row || el);
  });

  // -------- Hero parallax (subtle) --------
  const heatGlow = document.getElementById('heatGlow');
  const hero = document.querySelector('.hero');
  if (heatGlow && hero) {
    window.addEventListener('scroll', () => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = -rect.top * 0.3;
      heatGlow.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
    }, { passive: true });
  }

})();

/* ============================================================
   NVR Recap — scroll observer + count-ups + buyback bars
   ============================================================ */

(function () {
  // ----- Scroll progress -----
  const fill = document.getElementById('progressFill');
  function updateProgress() {
    const doc = document.documentElement;
    const h = doc.scrollHeight - doc.clientHeight;
    const p = h > 0 ? (doc.scrollTop || document.body.scrollTop) / h : 0;
    fill.style.width = (Math.max(0, Math.min(1, p)) * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ----- IntersectionObserver: add .in-view to beats -----
  const beats = document.querySelectorAll('[data-beat]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  beats.forEach(b => io.observe(b));

  // Hero in-view immediately
  document.querySelector('.hero').classList.add('in-view');

  // ----- Set draw-on lengths for hero house parts -----
  document.querySelectorAll('.hl').forEach((el) => {
    try {
      const len = el.getTotalLength ? el.getTotalLength() : 200;
      el.style.setProperty('--len', len + 1);
    } catch (_) {
      el.style.setProperty('--len', 200);
    }
  });

  // ----- Count-up animation -----
  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const k = 1 - Math.pow(1 - t, 3);
      const v = target * k;
      el.textContent = prefix + (decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString()) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
    }
    requestAnimationFrame(step);
  }

  const numIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) animateCount(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => numIo.observe(el));

  // ----- Buyback bars: build many growing bars 1994 -> 2025 -----
  (function () {
    const g = document.getElementById('buybackBars');
    if (!g) return;
    const ns = 'http://www.w3.org/2000/svg';
    const x0 = 30, x1 = 330;
    const yBase = 180;
    const N = 32; // years 1994..2025
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const x = x0 + t * (x1 - x0);
      // growing-with-noise bar height
      const baseH = 6 + t * 78;
      const noise = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 4;
      const h = Math.max(3, baseH + noise);
      const w = (x1 - x0) / N - 2;
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', x.toFixed(2));
      r.setAttribute('y', yBase - h);
      r.setAttribute('width', w.toFixed(2));
      r.setAttribute('height', h.toFixed(2));
      // last bar is coral
      r.setAttribute('fill', i === N - 1 ? '#FF8B6A' : (i > N - 4 ? '#C9C6BF' : '#5A5853'));
      r.setAttribute('opacity', '0');
      r.style.transition = `opacity 0.5s ease ${(i * 28)}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${(i * 28)}ms`;
      r.style.transformOrigin = `${x.toFixed(2)}px ${yBase}px`;
      r.style.transform = 'scaleY(0)';
      g.appendChild(r);
    }
    const betEl = document.querySelector('.bet');
    const bbIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          [...g.children].forEach((c) => {
            c.setAttribute('opacity', '1');
            c.style.transform = 'scaleY(1)';
          });
          bbIo.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (betEl) bbIo.observe(betEl);
  })();

  // ----- Parallax: hero lot drifts as you scroll -----
  const lot = document.getElementById('theLot');
  const heroSvg = document.getElementById('heroSvg');
  if (lot && heroSvg) {
    let raf;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = Math.max(-40, Math.min(40, y * 0.08));
        lot.setAttribute('transform', `translate(40, ${380 + dy})`);
        heroSvg.style.opacity = Math.max(0.2, 1 - y / 700);
        raf = null;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

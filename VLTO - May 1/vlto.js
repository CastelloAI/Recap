/* Veralto Recap — scroll mechanics */
(() => {
  const progress = document.getElementById('progressFill');
  const beats    = document.querySelectorAll('.beat');
  const geoRows  = document.querySelectorAll('.geo-row');
  const rivals   = document.querySelectorAll('.rival');
  const segBars  = document.querySelectorAll('.seg-bar-fill');
  const segPcts  = document.querySelectorAll('.seg-pct');
  const costBars = document.querySelectorAll('.cost-bar');
  const scaleNums = document.querySelectorAll('.scale-num');

  /* ---------- Scroll progress hairline ---------- */
  function updateProgress() {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    const pct = Math.max(0, Math.min(1, h.scrollTop / max));
    progress.style.width = (pct * 100).toFixed(2) + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------- IntersectionObserver for in-view ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  beats.forEach(b => io.observe(b));
  geoRows.forEach(r => io.observe(r));
  rivals.forEach(r => io.observe(r));

  /* ---------- Segments: animate bars + count up percentages ---------- */
  const segObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = parseFloat(entry.target.getAttribute('data-target') || '0');
      entry.target.style.width = target + '%';
      segObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  segBars.forEach(b => segObserver.observe(b));

  const pctObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-num') || '0');
      animateNumber(el, 0, target, 1400, v => Math.round(v).toString());
      pctObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  segPcts.forEach(p => pctObserver.observe(p));

  /* ---------- Cost bars: animate widths to data-w ---------- */
  const costObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const w = parseFloat(entry.target.getAttribute('data-w') || '0');
      entry.target.setAttribute('width', w);
      costObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  costBars.forEach(b => costObserver.observe(b));

  /* ---------- Scale numbers: count up ---------- */
  const scaleObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count') || '0');
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const format = el.getAttribute('data-format') || '';
      const fmt = (v) => {
        if (format === 'int') return prefix + Math.round(v).toLocaleString() + suffix;
        if (format === 'year') return Math.round(v).toString();
        // default: 2 decimals
        return prefix + v.toFixed(2) + suffix;
      };
      animateNumber(el, 0, target, 1600, fmt);
      scaleObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  scaleNums.forEach(n => scaleObs.observe(n));

  /* ---------- helper: animate a number into an element ---------- */
  function animateNumber(el, from, to, dur, fmt) {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = from + (to - from) * eased;
      el.textContent = fmt(v);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Hero parallax: drop translates with scroll ---------- */
  const heroDrop = document.querySelector('.hero-drop');
  const ripples = document.querySelector('.ripples');
  function heroParallax() {
    const y = window.scrollY;
    if (y > window.innerHeight) return; // only while hero on screen
    if (heroDrop) heroDrop.style.transform = `translateY(${y * 0.18}px) scale(${1 - Math.min(0.1, y * 0.0002)})`;
    if (ripples) ripples.style.transform = `translateY(${y * 0.08}px)`;
  }
  document.addEventListener('scroll', heroParallax, { passive: true });
  heroParallax();
})();

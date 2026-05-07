/* ============================================================
   AEE Recap — scroll behavior, count-ups, reveal animations
   ============================================================ */

(() => {
  const progress = document.getElementById('progress');
  const page = document.getElementById('page');

  // ---------- scroll progress hairline ----------
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.max(0, Math.min(1, window.scrollY / Math.max(1, max)));
    progress.style.width = (pct * 100).toFixed(2) + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ---------- intersection-driven reveals ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // also kick child .pipe and .seg-bar elements
        e.target.querySelectorAll('.pipe, .seg-bar, .wave-path, .bill__seg, .bet-row, .ledger__row, .stairs')
          .forEach(el => el.classList.add('in'));
        // count-ups
        e.target.querySelectorAll('.countup, .countup-mini').forEach(runCountup);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll(
    '.beat, .reset, .stairs, .ledger__row, .peer'
  ).forEach(el => io.observe(el));

  // also a softer observer for peer bars
  const peerObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.peer').forEach(p => peerObs.observe(p));

  // ---------- count-ups ----------
  function runCountup(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const to = parseFloat(el.dataset.to);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const v = to * eased;
      el.textContent = v.toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = to.toFixed(decimals);
    }
    requestAnimationFrame(tick);
  }

  // ---------- peer expand/collapse ----------
  document.querySelectorAll('.peer--toggle').forEach((p) => {
    const head = p.querySelector('.peer__head');
    head.addEventListener('click', () => {
      const open = p.classList.toggle('open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // ---------- subtle parallax on hero lines ----------
  const lines = document.querySelector('.hero__lines');
  function parallax() {
    if (!lines) return;
    const y = window.scrollY;
    const max = window.innerHeight;
    if (y > max) return;
    const t = y / max;
    lines.style.transform = `translateY(${t * 30}px)`;
    lines.style.opacity = String(1 - t * 0.6);
  }
  document.addEventListener('scroll', parallax, { passive: true });
  parallax();
})();

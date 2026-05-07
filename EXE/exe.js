/* ============================================================
   EXE · scroll-driven motion + chrome progress
   ============================================================ */
(function () {
  // -------- progress bar --------
  const progress = document.getElementById('progressFill');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = Math.max(0, Math.min(100, pct)) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // -------- methane particle field in hero --------
  const field = document.getElementById('methaneField');
  if (field) {
    const N = 28;
    for (let i = 0; i < N; i++) {
      const p = document.createElement('div');
      p.className = 'methane-particle' + (Math.random() < 0.18 ? ' flare' : '');
      const x = Math.random() * 100;
      const startY = 90 + Math.random() * 30;
      const dur = 9 + Math.random() * 12;
      const delay = -Math.random() * dur;
      const drift = (Math.random() - 0.5) * 40;
      const size = 2 + Math.random() * 4;
      p.style.left = x + '%';
      p.style.top = startY + '%';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
      p.style.animation = `methaneRise ${dur}s linear ${delay}s infinite`;
      p.style.setProperty('--drift', drift + 'px');
      field.appendChild(p);
    }

    // also a slow scroll-tied vertical drift on the whole field
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 800);
      field.style.transform = `translateY(${y * 0.18}px)`;
    }, { passive: true });
  }

  // inject keyframes for methane (so we can use --drift)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes methaneRise {
      0%   { transform: translate(0, 0); opacity: 0; }
      8%   { opacity: var(--o, 0.5); }
      90%  { opacity: var(--o, 0.4); }
      100% { transform: translate(var(--drift, 0), -110vh); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // -------- IntersectionObserver — add .in to anim targets --------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // for scale rows, stagger via order
        if (e.target.classList.contains('scale-row')) {
          // already handled via individual observer
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  // animatable selectors
  const targets = document.querySelectorAll(
    '[data-anim], .scale-row, .mix-bar, .weight-bar-row, .rival, .close-arrow'
  );
  targets.forEach((t, i) => {
    // stagger scale-rows
    if (t.classList.contains('scale-row')) {
      t.style.transitionDelay = (i * 0.06) + 's';
    }
    io.observe(t);
  });

  // close-arrow lives on the wrapper; observe its child container
  const closeArrow = document.querySelector('.close-arrow');
  if (closeArrow) io.observe(closeArrow);

  // weight bar rows: trigger their fills when visible
  document.querySelectorAll('.weight-bar-row').forEach((row, i) => {
    const fill = row.querySelector('.weight-bar-fill');
    if (fill) fill.style.transitionDelay = (0.1 + i * 0.15) + 's';
  });

  // rival staggers
  document.querySelectorAll('.rival').forEach((r, i) => {
    const fill = r.querySelector('.rival-cap-fill');
    if (fill) fill.style.transitionDelay = (i * 0.1) + 's';
  });
})();

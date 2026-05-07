// Recap helpers — chrome rail, fade-in, count-up, scroll-tied die, etc.

(function() {
  const fill = document.getElementById('chromeFill');
  const chrome = document.getElementById('chrome');

  function onScroll() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.max(0, Math.min(1, window.scrollY / h));
    if (fill) fill.style.width = (pct * 100).toFixed(2) + '%';

    // chrome dark mode when over dark beats
    let dark = false;
    document.querySelectorAll('.beat--ink, .beat--green, .reset--ink, .reset--green').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top <= 56 && r.bottom > 56) dark = true;
    });
    chrome.classList.toggle('dark', dark);

    // die rotation tied to scroll
    const die = document.getElementById('hero-die');
    if (die) {
      const rot = window.scrollY * 0.4;
      die.setAttribute('transform', `rotate(${rot} 100 100)`);
    }
    // fan particles drift
    const drift = document.getElementById('fan-drift');
    if (drift) drift.setAttribute('transform', `translate(${(window.scrollY * 0.05) % 60} 0)`);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);

  // IntersectionObserver: fade-ins + count-ups + bars
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');

      // count-up
      el.querySelectorAll('[data-count]').forEach(n => {
        if (n.dataset.done) return;
        n.dataset.done = '1';
        const target = parseFloat(n.dataset.count);
        const decimals = parseInt(n.dataset.decimals || '0', 10);
        const dur = parseInt(n.dataset.dur || '1400', 10);
        const prefix = n.dataset.prefix || '';
        const suffix = n.dataset.suffix || '';
        const start = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = target * eased;
          n.textContent = prefix + v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
      // bar fills
      el.querySelectorAll('[data-fill]').forEach(b => {
        b.style.width = b.dataset.fill;
      });

      io.unobserve(el);
    });
  }, { threshold: 0.18 });

  // expose for beats.js to register
  window.__recap = {
    register(el) { io.observe(el); }
  };
})();

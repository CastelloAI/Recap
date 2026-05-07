/* Omnicom recap — scroll-driven behavior */

(function () {
  // ── 1. Scroll progress hairline ───────────────────────────────
  const progress = document.getElementById('progress');
  const onScroll = () => {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const p = total > 0 ? (h.scrollTop / total) * 100 : 0;
    progress.style.width = p.toFixed(2) + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── 2. Reveal-on-enter for [data-reveal] ──────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // Sub-elements that hang off the same trigger:
        e.target.querySelectorAll?.('.intake, .stub, .geo, .rivals, .bet-cards, .merger-svg')
          .forEach(el => el.classList.add('in'));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  // Also observe these directly so they animate even without parent [data-reveal]
  ['.intake', '.stub', '.geo', '.rivals', '.bet-cards', '.merger-svg', '.scale-figure']
    .forEach(sel => document.querySelectorAll(sel).forEach(el => {
      const sub = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            obs.unobserve(en.target);
          }
        });
      }, { threshold: 0.25 });
      sub.observe(el);
    }));

  // ── 3. 100-cent grid: 100 squares, 2.6 lit (round to 3 = 2.6%) ─
  // Operating margin is 2.6% — light up exactly 3 of 100 (rounding up
  // since "2.6 cents" rounded to whole cents = 3). Distribute them
  // visibly across the grid.
  const grid = document.getElementById('cent-grid');
  if (grid) {
    const litIdx = new Set([12, 47, 84]); // scattered, not clustered
    for (let i = 0; i < 100; i++) {
      const cell = document.createElement('span');
      if (litIdx.has(i)) cell.className = 'on';
      grid.appendChild(cell);
    }
    // light them sequentially when in view
    const gio = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const cells = grid.querySelectorAll('span.on');
          cells.forEach((c, k) => {
            c.style.opacity = '0';
            c.style.transform = 'scale(0.6)';
            setTimeout(() => {
              c.style.transition = 'opacity 380ms ease-out, transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)';
              c.style.opacity = '1';
              c.style.transform = 'scale(1)';
            }, 600 + k * 220);
          });
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    gio.observe(grid);
  }

  // ── 4. Hero count-up ── make the "$17.27B" feel earned: subtle weight slide
  // (we keep it static — the bignum is editorial, not a casino counter)

})();

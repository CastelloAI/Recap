/* ============================================================
   ZBH Recap — scroll & motion controller
============================================================ */

(function(){
  // Scroll progress hairline
  const fill = document.getElementById('progressFill');
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ============================================================
  // Intersection observer — generic reveal + section triggers
  // ============================================================
  const els = document.querySelectorAll(
    '.section-headline, .lead, .business-copy, .timeline, .bignum, ' +
    '.cost-bar, .cost-footnote, .globe-wrap, .region, .footprint-copy, ' +
    '.waterfall, .bet-headline, .acq-card, .rosa-card, .scale-wrap, .debt-copy, ' +
    '.comp-row, .comp-copy, .close-stack, .close-headline, .close-copy, .close-foot, ' +
    '.eyebrow-row, .reset-beat p'
  );
  els.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.parentElement && el.parentElement.classList.contains('bignums')) {
      const idx = Array.from(el.parentElement.children).indexOf(el);
      el.style.setProperty('--i', idx);
      el.style.transitionDelay = (idx * 80) + 'ms';
    }
    if (el.parentElement && el.parentElement.classList.contains('cost-stack')) {
      const idx = Array.from(el.parentElement.children).indexOf(el);
      el.style.transitionDelay = (idx * 100) + 'ms';
    }
    if (el.parentElement && el.parentElement.classList.contains('comp-stack')) {
      const idx = Array.from(el.parentElement.children).indexOf(el);
      el.style.transitionDelay = (idx * 120) + 'ms';
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        // trigger any associated animation
        triggerAnim(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  els.forEach(el => io.observe(el));

  // ============================================================
  // Specific animation triggers
  // ============================================================
  function triggerAnim(el) {
    // Count-up bignums
    if (el.classList.contains('bignum')) {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const counter = el.querySelector('.counter');
      countUp(counter, target, decimals, prefix, suffix, 1200);
    }

    // Timeline fill
    if (el.classList.contains('timeline')) {
      const tlFill = document.getElementById('timelineFill');
      if (tlFill) requestAnimationFrame(() => tlFill.style.width = '100%');
    }

    // Cost bar fills
    if (el.classList.contains('cost-bar')) {
      const fill = el.querySelector('.cost-fill');
      if (fill) {
        const pct = fill.dataset.pct;
        requestAnimationFrame(() => fill.style.width = pct + '%');
      }
    }

    // Region bars
    if (el.classList.contains('region')) {
      const bar = el.querySelector('.region-fill');
      if (bar) {
        const pct = bar.dataset.pct;
        requestAnimationFrame(() => bar.style.width = pct + '%');
      }
    }

    // Globe arc (Americas 57% of full circle)
    if (el.classList.contains('globe-wrap')) {
      const arc = el.querySelector('.arc-stroke');
      if (arc) {
        // animate stroke-dasharray from "0 100" to "57 43"
        setTimeout(() => {
          arc.style.strokeDasharray = '57 100';
        }, 100);
      }
    }

    // Waterfall branches
    if (el.classList.contains('waterfall')) {
      const line = el.querySelector('.ws-line');
      const branches = el.querySelectorAll('.ws-branch');
      if (line) line.style.height = '24px';
      branches.forEach((b, i) => {
        setTimeout(() => {
          b.style.strokeDashoffset = '0';
        }, 300 + i * 120);
      });
    }

    // Balance scale tilt — debt slightly heavier metaphorically
    if (el.classList.contains('scale-wrap')) {
      const beam = document.getElementById('balanceBeam');
      if (beam) {
        // Slight tilt — debt pan dips, equity rises
        // SVG beam goes from y1=90 to y2=80 (already pre-tilted right). Let's tilt left (debt heavier visual)
        // Actually equity > debt, so we want equity side to dip. Pre-set was tilted equity-up.
        // Reset: tilt so that equity (right) is slightly down — overall balanced but visualizing equity dominates
        beam.style.transform = 'rotate(-3deg)';
      }
    }

    // Competitor bars
    if (el.classList.contains('comp-row')) {
      const bar = el.querySelector('.comp-bar');
      if (bar) {
        const pct = bar.dataset.pct;
        requestAnimationFrame(() => bar.style.width = pct + '%');
      }
    }
  }

  // ============================================================
  // Count-up
  // ============================================================
  function countUp(el, target, decimals, prefix, suffix, duration) {
    if (!el) return;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      let formatted;
      if (target >= 1000) {
        formatted = Math.floor(val).toLocaleString();
      } else {
        formatted = val.toFixed(decimals);
      }
      el.textContent = prefix + formatted + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ============================================================
  // Hero parallax — joints float slightly with scroll
  // ============================================================
  const skel = document.querySelector('.hero-skeleton-wrap');
  if (skel) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < 800) {
        skel.style.transform = `translateY(${y * 0.18}px)`;
        skel.style.opacity = Math.max(0, 1 - y / 600);
      }
    }, { passive: true });
  }

  // ============================================================
  // Hero stat count-up on load
  // ============================================================
  window.addEventListener('load', () => {
    const heroStats = document.querySelectorAll('.hero-stat .stat-num');
    // hero numbers are static, but let's reveal them animated
  });

})();

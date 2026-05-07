// =====================================================
// BDX Recap — scroll-driven animations & count-ups
// =====================================================

(function () {
  'use strict';

  // ---------- Sticky chrome progress ----------
  const progressFill = document.getElementById('progressFill');
  function updateProgress() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressFill.style.width = pct + '%';
  }
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ---------- Count-ups via IntersectionObserver ----------
  const ease = t => 1 - Math.pow(1 - t, 3);

  function animateNumber(el, target, decimals, suffix, duration) {
    duration = duration || 1400;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = target * ease(t);
      el.textContent = v.toFixed(decimals) + (suffix || '');
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + (suffix || '');
    }
    requestAnimationFrame(tick);
  }

  const seenNumbers = new WeakSet();
  const numIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !seenNumbers.has(entry.target)) {
        seenNumbers.add(entry.target);
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const suffix = el.dataset.suffix || '';
        animateNumber(el, target, decimals, suffix, 1500);
      }
    });
  }, { threshold: 0.4, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.countup').forEach(el => numIO.observe(el));

  // ---------- Generic reveal-on-scroll ----------
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  // ---------- Hero vial fill on scroll ----------
  const vialLiquid = document.getElementById('vialLiquid');
  const vialMeniscus = document.getElementById('vialMeniscus');
  if (vialLiquid) {
    // start mostly empty, fill as user scrolls past hero
    function updateVial() {
      const max = window.innerHeight * 0.9;
      const t = Math.min(1, Math.max(0, window.scrollY / max));
      // y from 280 (empty) to 90 (full)
      const y = 280 - t * 190;
      vialLiquid.setAttribute('y', y);
      vialLiquid.setAttribute('height', 320 - y);
      if (vialMeniscus) {
        vialMeniscus.setAttribute('y1', y);
        vialMeniscus.setAttribute('y2', y);
      }
    }
    updateVial();
    window.addEventListener('scroll', updateVial, { passive: true });
  }

  // ---------- Syringe fills (segment widths) ----------
  const syringes = document.getElementById('syringes');
  if (syringes) {
    const sIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rows = entry.target.querySelectorAll('.syringe-row');
          rows.forEach((row, i) => {
            const pct = parseFloat(row.dataset.pct);
            const fill = row.querySelector('.syr-fill');
            // pct of total revenue; max 50% maps to full barrel
            const scale = Math.min(1, pct / 50);
            setTimeout(() => {
              fill.style.transform = 'scaleX(' + scale.toFixed(3) + ')';
            }, i * 220 + 100);
          });
          sIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    sIO.observe(syringes);
  }

  // ---------- Margin bars ----------
  document.querySelectorAll('.margin-fill, .geo-bar-fill, .comp-fill, .deploy-fill').forEach(bar => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pct = parseFloat(bar.dataset.pct);
          setTimeout(() => { bar.style.width = pct + '%'; }, 100);
          io.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });
    // observe nearest beat container
    let parent = bar.closest('.beat') || bar.parentElement;
    io.observe(parent);
  });

  // ---------- Cost barrel segments ----------
  const costSvg = document.getElementById('costSvg');
  if (costSvg) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const segs = entry.target.querySelectorAll('.cb-seg');
          segs.forEach((seg, i) => {
            const h = parseFloat(seg.dataset.h);
            const y0 = parseFloat(seg.dataset.y0);
            const color = seg.dataset.color;
            seg.setAttribute('fill', color);
            setTimeout(() => {
              seg.setAttribute('y', y0 - h);
              seg.setAttribute('height', h);
            }, i * 220 + 200);
          });
          cIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    cIO.observe(costSvg);
  }

  // ---------- Geo arcs draw-on ----------
  const geoSvg = document.getElementById('geoSvg');
  if (geoSvg) {
    const arcs = geoSvg.querySelectorAll('.geo-arc');
    arcs.forEach(a => {
      const len = a.getTotalLength();
      a.style.strokeDasharray = len;
      a.style.strokeDashoffset = len;
    });
    const gIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          arcs.forEach((a, i) => {
            setTimeout(() => { a.style.strokeDashoffset = '0'; }, i * 220 + 100);
          });
          gIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    gIO.observe(geoSvg);
  }

  // ---------- Balance scale tilt ----------
  const balBeam = document.getElementById('balBeam');
  if (balBeam) {
    const bIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Equity > Debt: equity side goes DOWN, debt side rises
          // beam rotates ~ -4deg (right-side down)
          setTimeout(() => {
            balBeam.style.transform = 'rotate(-4deg)';
          }, 400);
          bIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    bIO.observe(balBeam);
  }

  // ---------- RMT spinout animation ----------
  const rmtSpin = document.getElementById('rmtSpin');
  const rmtSvg = document.getElementById('rmtSvg');
  if (rmtSpin && rmtSvg) {
    const rIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            rmtSpin.setAttribute('cx', 280);
            rmtSpin.setAttribute('r', 18);
          }, 600);
          rmtSvg.classList.add('is-revealed');
          rIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    rIO.observe(rmtSvg);
  }

  // ---------- Dividend streak rail ----------
  const streakRail = document.getElementById('streakRail');
  if (streakRail) {
    // 54 vertical bars representing 54 years, each slightly taller than the last
    const N = 54;
    let html = '<svg viewBox="0 0 356 64" preserveAspectRatio="none" style="width:100%;height:100%;display:block">';
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1)) * 350 + 3;
      // height grows from 8 to 60
      const h = 8 + (i / (N - 1)) * 52;
      const y = 64 - h;
      html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="3" height="' + h.toFixed(1) + '" rx="1" class="streak-bar" data-i="' + i + '" style="opacity:0;transform-origin:bottom;transform:scaleY(0);transition:opacity 600ms var(--ease-out), transform 700ms var(--ease-out);transition-delay:' + (i * 20) + 'ms" fill="' + (i === N - 1 ? '#FF7A57' : '#1F4E8C') + '" />';
    }
    html += '</svg>';
    streakRail.innerHTML = html;

    const sIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.streak-bar').forEach(bar => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1)';
          });
          sIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    sIO.observe(streakRail);
  }

})();

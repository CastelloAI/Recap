// HPQ Recap — scroll/intersection logic

(function () {
  // -------- scroll progress hairline --------
  const fill = document.getElementById('progressFill');
  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? (h.scrollTop / max) : 0;
    fill.style.width = (p * 100).toFixed(2) + '%';
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -------- generic reveal --------
  const revealEls = document.querySelectorAll(
    'h1, .hero-lede, .beat-title, .beat-lede, .eyebrow, .reset-line, .seg-row, .seg-callout, .stat, .quarter, .bignum, .region-row, .rival, .scale-svg, .weight-lede, .flow, .bet-timeline, .bet-lede, .close-h, .close-lede, .close-foot, .close-scene'
  );
  revealEls.forEach((el) => el.classList.add('r-fade'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => io.observe(el));

  // -------- segment bars --------
  const segIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const fillEl = e.target.querySelector('.seg-bar-fill');
      const pct = e.target.querySelector('.seg-bar-fill').dataset.fill;
      requestAnimationFrame(() => { fillEl.style.width = pct + '%'; });
      segIO.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.seg-row').forEach((r) => segIO.observe(r));

  // -------- $55.30B count-up --------
  const bignum = document.querySelector('.bignum');
  if (bignum) {
    const target = parseFloat(bignum.dataset.countTo);
    const prefix = bignum.dataset.prefix || '';
    const suffix = bignum.dataset.suffix || '';
    const valEl = bignum.querySelector('.bignum-val');
    let played = false;
    const bnIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !played) {
          played = true;
          const start = performance.now();
          const dur = 1400;
          function tick(now) {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const v = (target * eased).toFixed(2);
            valEl.innerHTML = prefix + v + '<span class="bignum-suffix">' + suffix + '</span>';
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    bnIO.observe(bignum);
  }

  // -------- 100-cent grid build --------
  const grid = document.getElementById('centsGrid');
  if (grid) {
    // 79 blue, 7 red, 3 green, 1 amber, 10 blank
    const order = [];
    for (let i = 0; i < 79; i++) order.push('#2563EB');
    for (let i = 0; i < 7; i++)  order.push('#DC2626');
    for (let i = 0; i < 3; i++)  order.push('#16A34A');
    for (let i = 0; i < 1; i++)  order.push('#D97706');
    for (let i = 0; i < 10; i++) order.push('blank');
    // Place left-to-right, top-to-bottom in this order
    order.forEach((c) => {
      const div = document.createElement('div');
      div.className = 'cent' + (c === 'blank' ? ' cent-blank' : '');
      if (c !== 'blank') div.style.setProperty('--c', c);
      grid.appendChild(div);
    });

    let centPlayed = false;
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !centPlayed) {
          centPlayed = true;
          const cells = grid.querySelectorAll('.cent');
          cells.forEach((cell, i) => {
            setTimeout(() => cell.classList.add('on'), i * 14);
          });
        }
      });
    }, { threshold: 0.25 });
    cIO.observe(grid);
  }

  // -------- region bars --------
  const regIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.region-bar-fill').forEach((b) => b.classList.add('on'));
      // also ramp up globe regions
      const globe = e.target.closest('.globe') || e.target.parentElement;
      if (globe) {
        globe.classList.add('on');
        globe.querySelectorAll('.region').forEach((r) => r.classList.add('on'));
      }
      regIO.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.region-list').forEach((l) => regIO.observe(l));

  // -------- weight: tilt the beam more dramatically when in view --------
  const beam = document.getElementById('beam');
  const beamSection = document.querySelector('.beat-weight');
  if (beam && beamSection) {
    const wIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          beam.setAttribute('transform', 'rotate(-14 160 100)');
          wIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    wIO.observe(beamSection);
  }

  // -------- flow bars --------
  const fIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const bars = e.target.querySelectorAll('.flow-out-bar');
      bars.forEach((b, i) => setTimeout(() => b.classList.add('on'), i * 160));
      fIO.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.flow-out').forEach((f) => fIO.observe(f));

  // -------- bet timeline fill --------
  const betFill = document.getElementById('betFill');
  if (betFill) {
    const bIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          // fill from first dot to last (full width minus padding)
          betFill.style.width = 'calc(100% - 16px)';
          bIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    bIO.observe(betFill.parentElement);
  }

  // -------- rivals: animate radii from 0 to target --------
  const rivalsSvg = document.querySelector('.rivals-svg');
  if (rivalsSvg) {
    const circles = rivalsSvg.querySelectorAll('circle');
    const targets = [];
    circles.forEach((c) => { targets.push(c.getAttribute('r')); c.setAttribute('r', '0'); });
    const rvIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          circles.forEach((c, i) => {
            setTimeout(() => c.setAttribute('r', targets[i]), 80 + i * 120);
          });
          rvIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    rvIO.observe(rivalsSvg);
  }
})();

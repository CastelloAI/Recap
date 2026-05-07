// ============= GWW Recap interactions =============

// 1. Scroll progress
const progress = document.getElementById('progress');
function updateProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
  progress.style.width = p + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

// 2. Hero filled bins (random)
(function () {
  const g = document.getElementById('filled-bins');
  if (!g) return;
  const cols = 30, rows = 51;
  const filled = new Set();
  while (filled.size < 22) {
    const c = Math.floor(Math.random() * cols);
    const r = Math.floor(Math.random() * rows);
    filled.add(c + ',' + r);
  }
  filled.forEach(k => {
    const [c, r] = k.split(',').map(Number);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', c * 14 + 0.5);
    rect.setAttribute('y', r * 14 + 0.5);
    rect.setAttribute('width', 13);
    rect.setAttribute('height', 13);
    g.appendChild(rect);
  });
})();

// 3. Customer dots (184) and SKU dots (1200) — caps for visual density
(function () {
  const cust = document.getElementById('custDots');
  const sku  = document.getElementById('skuDots');
  if (cust) {
    for (let i = 0; i < 184; i++) {
      const s = document.createElement('span');
      cust.appendChild(s);
    }
  }
  if (sku) {
    // 1200 dots is too dense for mobile; show a 240-dot grid (each = 5 SKUs)
    for (let i = 0; i < 240; i++) {
      const s = document.createElement('span');
      sku.appendChild(s);
    }
  }
})();

// 4. Streak grid (54 squares)
(function () {
  const g = document.getElementById('streakGrid');
  if (!g) return;
  for (let i = 0; i < 54; i++) {
    const s = document.createElement('span');
    s.style.opacity = (0.35 + (i / 53) * 0.65).toFixed(2);
    g.appendChild(s);
  }
})();

// 5. Reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.beat, .reset').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// 6. Cost pipe segments grow on enter
const costIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.seg-cost').forEach((s, i) => {
        s.style.transformOrigin = 'left';
        s.style.transform = 'scaleX(0)';
        s.style.transition = `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { s.style.transform = 'scaleX(1)'; });
        });
      });
      costIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const pipe = document.getElementById('costPipe');
if (pipe) costIO.observe(pipe);

// 7. Big-number count-up on hero
(function () {
  // Just a subtle pulse on the hero figures rather than a full count-up to keep it editorial
  document.querySelectorAll('.hero .big-num em').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = `opacity 800ms var(--ease-out) ${300 + i * 180}ms, transform 800ms var(--ease-out) ${300 + i * 180}ms`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  });
})();

updateProgress();

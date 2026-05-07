// Scroll utilities and hooks for GDDY recap

const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

// ---- Scroll position (rAF-throttled) ----
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setY(window.scrollY || window.pageYOffset || 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return y;
}

// ---- Document height for progress ----
function useDocHeight() {
  const [h, setH] = useState(1);
  useEffect(() => {
    const update = () => {
      setH(Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    };
    update();
    window.addEventListener('resize', update);
    const t = setInterval(update, 500); // catch late layout shifts
    return () => { window.removeEventListener('resize', update); clearInterval(t); };
  }, []);
  return h;
}

// ---- Reveal on intersection ----
function useReveal(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.18, ...opts }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

// ---- Scroll progress through a specific element (0..1) ----
function useElementProgress(ref, opts = {}) {
  // Returns 0..1 representing how much of element is past the top of viewport,
  // bounded to a comfortable range (start when element top hits 80% of viewport,
  // finish when bottom hits 20% of viewport).
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * (opts.start ?? 0.85);
      const end = -r.height + vh * (opts.end ?? 0.2);
      // r.top from start (start) to end
      const total = start - end;
      const v = (start - r.top) / total;
      setP(Math.max(0, Math.min(1, v)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [ref, opts.start, opts.end]);
  return p;
}

// ---- Easing ----
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

// ---- Number formatter ----
function fmtNum(n, opts = {}) {
  const { decimals = 0, currency = false, suffix = '' } = opts;
  const fixed = Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (currency ? '$' : '') + fixed + suffix;
}

// ---- Animated count-up driven by reveal visibility ----
function useCountUp(target, visible, duration = 1400, opts = {}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setV(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);
  return v;
}

Object.assign(window, {
  useScrollY, useDocHeight, useReveal, useElementProgress,
  easeOutCubic, easeInOutCubic, easeOutQuart, fmtNum, useCountUp
});

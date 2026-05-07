// Scroll-driven hooks for VRTS recap

const { useState, useEffect, useRef, useLayoutEffect, useCallback } = React;

// Returns scroll progress (0..1) of an element through the viewport.
// 0 when the element's top hits the bottom of the viewport,
// 1 when its bottom passes the top.
function useScrollProgress(ref, { startOffset = 0, endOffset = 0 } = {}) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const start = vh - startOffset;             // when top crosses this Y, start
      const end   = -rect.height + endOffset;      // when bottom crosses top, end
      const range = start - end;
      const x = (start - rect.top) / range;
      setP(Math.max(0, Math.min(1, x)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [startOffset, endOffset]);
  return p;
}

// Whole-document scroll progress 0..1
function useDocProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const h = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      setP(Math.max(0, Math.min(1, window.scrollY / h)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

// returns true once `ref` has entered the viewport
function useInView(ref, threshold = 0.15) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return seen;
}

// detect when a particular section is dominantly in view (for chrome dark mode)
function useDarkChrome(ref) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // dark when section covers the top 80px of viewport
      setDark(r.top < 60 && r.bottom > 60);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('scroll', onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return dark;
}

// easing
const ease = {
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inOutCubic: t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2,
  outQuart: t => 1 - Math.pow(1 - t, 4),
  outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
};

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
const remap = (x, a, b, c = 0, d = 1) => clamp(((x - a) / (b - a)) * (d - c) + c, Math.min(c,d), Math.max(c,d));

// number formatting
function fmt(n, opts = {}) {
  const { dp = 0, prefix = '', suffix = '' } = opts;
  return prefix + n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }) + suffix;
}

Object.assign(window, {
  useScrollProgress, useDocProgress, useInView, useDarkChrome,
  ease, lerp, clamp, remap, fmt,
});

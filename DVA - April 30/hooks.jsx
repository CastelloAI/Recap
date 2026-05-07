/* Scroll-driven hooks — shared across scenes. */

const { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } = React;

/** Track scroll progress (0..1) of an element through the viewport.
 *  0 = element top hits viewport bottom; 1 = element bottom hits viewport top. */
function useScrollProgress(ref, opts = {}) {
  const [p, setP] = useState(0);
  const { start = 0, end = 1, clamp = true } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const compute = () => {
      raf = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // raw progress from -1 (below viewport) through 0 (entered) to 1 (passed top)
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      let prog = traveled / total;
      // remap [start,end] → [0,1]
      prog = (prog - start) / (end - start);
      if (clamp) prog = Math.max(0, Math.min(1, prog));
      setP(prog);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, start, end, clamp]);
  return p;
}

/** Reveal-on-enter helper. Returns ref + boolean. */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      });
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, shown];
}

/** Count up a number when `active` is true. */
function useCountUp(target, active, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf, t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setV(target * eased);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return v;
}

/** Top-of-page scroll progress (0..1) for the chrome hairline. */
function usePageScroll() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = (h.scrollHeight - h.clientHeight) || 1;
      setP(Math.max(0, Math.min(1, h.scrollTop / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const fmtMoney = (n) => {
  // n in millions; format short
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}B`;
  return `$${n.toFixed(0)}M`;
};
const fmtInt = (n) => Math.round(n).toLocaleString('en-US');

Object.assign(window, {
  useScrollProgress, useReveal, useCountUp, usePageScroll,
  lerp, clamp01, fmtMoney, fmtInt,
});

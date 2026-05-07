// useScrollProgress, useReveal, useCountUp
const { useEffect, useRef, useState, useCallback } = React;

function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref?.current || document.documentElement;
    const handler = () => {
      const target = ref?.current;
      if (target) {
        const total = target.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        setP(Math.max(0, Math.min(1, y / Math.max(1, total))));
      } else {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setP(Math.max(0, Math.min(1, window.scrollY / Math.max(1, total))));
      }
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [ref]);
  return p;
}

function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function useScrollPosition(ref, opts = {}) {
  // returns 0..1: where ref is in viewport. 0 = just entered bottom. 1 = leaving top.
  const [t, setT] = useState(0);
  useEffect(() => {
    const handler = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh;            // when top of el at bottom of viewport
      const end = -r.height;       // when bottom of el at top
      const range = start - end;
      const v = (start - r.top) / range;
      setT(Math.max(0, Math.min(1, v)));
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [ref]);
  return t;
}

function useCountUp(target, fire, { duration = 1300, decimals = 0, prefix = '', suffix = '' } = {}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!fire) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setV(target * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fire, target, duration]);
  const display = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return `${prefix}${display}${suffix}`;
}

Object.assign(window, { useScrollProgress, useReveal, useScrollPosition, useCountUp });

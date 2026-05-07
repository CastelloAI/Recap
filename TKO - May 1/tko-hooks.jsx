/* global React */
const { useEffect, useRef, useState } = React;

// IntersectionObserver hook — toggles "in" class on element
function useReveal(opts = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setSeen(true); el.classList.add('in'); }
      });
    }, { threshold: opts.threshold ?? 0.18, rootMargin: opts.rootMargin ?? '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

// Count up when in-view
function useCountUp(target, { duration = 1400, decimals = 0, prefix = '', suffix = '' } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !fired.current) {
          fired.current = true;
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(target * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  const formatted = (typeof target === 'number')
    ? val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : val;
  return [ref, prefix + formatted + suffix];
}

// Parallax scroll value tied to element offset
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return y;
}

window.useReveal = useReveal;
window.useCountUp = useCountUp;
window.useScrollY = useScrollY;

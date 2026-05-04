// Apple FY'25 Recap — scroll-driven mobile editorial page
// Single-file React app rendered into #root.

const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

/* ============================================================
   Hooks
   ============================================================ */

function useScrollY(targetRef) {
  // Scroll position relative to the container (window or scroller)
  const [y, setY] = useState(0);
  useEffect(() => {
    const el = targetRef?.current || window;
    const handler = () => {
      const v = el === window ? window.scrollY : el.scrollTop;
      setY(v);
    };
    handler();
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, [targetRef]);
  return y;
}

// Returns a 0..1 progress as the element passes through the viewport.
// 0 when the top of element hits the viewport bottom; 1 when bottom of element exits the viewport top.
function useScrollProgress(ref, { start = 0, end = 1 } = {}) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when rect.top == vh, 1 when rect.bottom == 0
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const raw = traveled / total;
      let pp = (raw - start) / (end - start);
      pp = Math.max(0, Math.min(1, pp));
      setP(pp);
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [ref, start, end]);
  return p;
}

function useInView(ref, threshold = 0.15) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return seen;
}

/* ============================================================
   Utilities
   ============================================================ */

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function fmtMoney(v) {
  // v in billions
  if (v >= 1000) return `$${(v / 1000).toFixed(2)}T`;
  return `$${v.toFixed(2)}B`;
}

function CountUp({ to, duration = 1200, prefix = '', suffix = '', decimals = 0, trigger = true }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setVal(easeOut(t) * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, trigger]);
  return (
    <span>
      {prefix}
      {val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ============================================================
   Persistent chrome
   ============================================================ */

function Chrome({ progress }) {
  return (
    <header className="chrome">
      <div className="chrome-row">
        <span className="chrome-ticker">AAPL</span>
        <span className="chrome-dot">·</span>
        <span className="chrome-name">Apple Inc.</span>
        <span className="chrome-spacer" />
        <span className="chrome-recap">RECAP · FY '25</span>
      </div>
      <div className="chrome-progress">
        <div className="chrome-progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </header>
  );
}

/* ============================================================
   1. HERO — the silhouette of an iPhone, rotating slightly with scroll
   ============================================================ */

function Hero() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.0, end: 0.7 });
  // Phone tilts and lifts as you scroll
  const tilt = lerp(-2, 8, p);
  const lift = lerp(0, -40, p);
  const opacity = lerp(1, 0.25, p);

  return (
    <section className="hero" ref={ref}>
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-mono">FY 2025 · ANNUAL RECAP</span>
      </div>

      <h1 className="hero-headline">
        <span className="hero-line">A trillion</span>
        <span className="hero-line">dollars and change,</span>
        <span className="hero-line italic">
          made <em>four</em> times over.
        </span>
      </h1>

      <p className="hero-sub">
        Apple closed FY 2025 at <em>$416.16B</em> in revenue — and a market cap
        that crossed <em>$3.97T</em>. One company, one campus, <em>2.5 billion</em>
        active devices.
      </p>

      <div
        className="hero-phone-wrap"
        style={{
          transform: `translateY(${lift}px) rotate(${tilt}deg)`,
          opacity,
        }}
      >
        <PhoneSilhouette />
      </div>

      <div className="hero-scroll">
        <span className="meta-mini">SCROLL</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}

function PhoneSilhouette() {
  return (
    <svg viewBox="0 0 220 440" width="100%" height="100%" className="phone-svg">
      <defs>
        <linearGradient id="phoneShade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d1d1f" />
          <stop offset="50%" stopColor="#2a2a2d" />
          <stop offset="100%" stopColor="#101012" />
        </linearGradient>
        <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0a0c" />
          <stop offset="100%" stopColor="#15151a" />
        </linearGradient>
        <radialGradient id="phoneGlow" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="rgba(255,122,87,0.25)" />
          <stop offset="100%" stopColor="rgba(255,122,87,0)" />
        </radialGradient>
      </defs>

      {/* Coral aura behind */}
      <ellipse cx="110" cy="180" rx="120" ry="90" fill="url(#phoneGlow)" />

      {/* Body */}
      <rect
        x="20"
        y="20"
        width="180"
        height="400"
        rx="36"
        ry="36"
        fill="url(#phoneShade)"
        stroke="#3a3a3d"
        strokeWidth="1"
      />
      {/* Screen */}
      <rect
        x="28"
        y="28"
        width="164"
        height="384"
        rx="30"
        ry="30"
        fill="url(#phoneScreen)"
      />
      {/* Dynamic island */}
      <rect x="92" y="40" width="36" height="10" rx="5" fill="#0a0a0c" />

      {/* Subtle screen text — the figure */}
      <text
        x="110"
        y="200"
        textAnchor="middle"
        fontFamily="Instrument Serif, serif"
        fontSize="32"
        fill="#FBFAF7"
        opacity="0.85"
        fontStyle="italic"
      >
        $209.59B
      </text>
      <text
        x="110"
        y="222"
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="8"
        fill="#FF7A57"
        letterSpacing="2"
      >
        IPHONE · FY25
      </text>

      {/* Bottom indicator */}
      <rect x="80" y="395" width="60" height="4" rx="2" fill="#3a3a3d" />
    </svg>
  );
}

/* ============================================================
   RESET BEAT — italic interlude
   ============================================================ */

function ResetBeat({ children, tone = 'paper' }) {
  const ref = useRef(null);
  const seen = useInView(ref, 0.2);
  return (
    <div className={`reset-beat reset-${tone} ${seen ? 'in' : ''}`} ref={ref}>
      <p className="reset-text">{children}</p>
    </div>
  );
}

/* ============================================================
   2. THE BUSINESS — five pillars of revenue, drawn as stacked tiles
   ============================================================ */

function Business() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.1, end: 0.85 });
  const seen = useInView(ref, 0.2);

  const segments = [
    { name: 'iPhone', value: 209.59, share: 50, hint: '~50% of revenue' },
    { name: 'Services', value: 109.16, share: 26, hint: 'crossed $100B' },
    { name: 'Wearables, Home & Accessories', value: 35.69, share: 9, hint: '' },
    { name: 'Mac', value: 33.71, share: 8, hint: '' },
    { name: 'iPad', value: 28.02, share: 7, hint: '' },
  ];

  return (
    <section className="business" ref={ref}>
      <div className="eyebrow-row">
        <span className="eyebrow">The business · five rivers</span>
      </div>

      <h2 className="section-h">
        Revenue arrives in <em>five</em> streams.
        <br />
        One is the river. <em>One is rising.</em>
      </h2>

      <p className="section-body">
        Most of every Apple dollar still comes from the phone in your pocket. But
        the second pillar — <em>Services</em> — quietly crossed{' '}
        <em>$100 billion</em> for the first time in FY 2025.
      </p>

      <div className="streams">
        {segments.map((s, i) => {
          const delay = i * 0.08;
          const t = clamp((p - delay) / 0.4, 0, 1);
          const w = easeOut(t) * s.share;
          return (
            <div className="stream" key={s.name}>
              <div className="stream-row">
                <span className="stream-name">{s.name}</span>
                <span className="stream-num">${s.value.toFixed(2)}B</span>
              </div>
              <div className="stream-track">
                <div
                  className={`stream-fill ${s.name === 'Services' ? 'is-rising' : ''}`}
                  style={{ width: `${w * 2}%` }}
                />
              </div>
              {s.hint && (
                <span className="stream-hint">
                  {s.name === 'Services' ? <em>{s.hint}</em> : s.hint}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="business-foot">
        <div className="foot-num">
          <span className="foot-mono">TOTAL · FY25</span>
          <span className="foot-big">
            <CountUp to={416.16} decimals={2} prefix="$" suffix="B" trigger={seen} />
          </span>
        </div>
        <div className="foot-divider" />
        <div className="foot-num">
          <span className="foot-mono">GROSS MARGIN</span>
          <span className="foot-big">
            <CountUp to={46.9} decimals={1} suffix="%" trigger={seen} />
          </span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3. THE SCALE — 2.5B devices visualized as a dot field
   ============================================================ */

function Scale() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.15);
  const p = useScrollProgress(ref, { start: 0.05, end: 0.7 });

  // Dot field — each dot represents ~10M devices. 250 dots total.
  const dots = useMemo(() => {
    const arr = [];
    const cols = 18;
    const rows = 14; // 252
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (arr.length >= 250) break;
        arr.push({
          x: c * 18 + 14 + (r % 2 ? 9 : 0),
          y: r * 18 + 14,
          d: Math.random() * 0.9,
        });
      }
    }
    return arr;
  }, []);

  return (
    <section className="scale" ref={ref}>
      <div className="eyebrow-row">
        <span className="eyebrow">The scale · 2.5 billion</span>
      </div>

      <h2 className="section-h">
        <em>Every dot</em> is ten million devices.
      </h2>

      <p className="section-body">
        Apple's installed base passed <em>2.5 billion active devices</em> in FY
        2025 — phones, tablets, watches, laptops, earbuds, all alive on the
        network on any given day.
      </p>

      <div className="dot-field-wrap">
        <svg
          viewBox="0 0 340 270"
          width="100%"
          height="auto"
          className="dot-field"
        >
          {dots.map((d, i) => {
            const t = clamp((p - d.d * 0.6) / 0.3, 0, 1);
            return (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={2.4}
                fill="var(--ink)"
                opacity={t * 0.85}
              />
            );
          })}
        </svg>
        <div className="dot-field-legend">
          <span className="meta-mini">1 DOT = 10M DEVICES</span>
        </div>
      </div>

      <div className="scale-grid">
        <div className="scale-tile">
          <span className="tile-mono">EMPLOYEES</span>
          <span className="tile-big">
            <CountUp to={166000} trigger={seen} />
          </span>
          <span className="tile-foot">worldwide, FY25</span>
        </div>
        <div className="scale-tile">
          <span className="tile-mono">MARKET CAP</span>
          <span className="tile-big">
            <CountUp to={3.97} decimals={2} prefix="$" suffix="T" trigger={seen} />
          </span>
          <span className="tile-foot">at FY25 close</span>
        </div>
        <div className="scale-tile">
          <span className="tile-mono">Q1 FY26</span>
          <span className="tile-big">
            <CountUp to={143.76} decimals={2} prefix="$" suffix="B" trigger={seen} />
          </span>
          <span className="tile-foot">record quarterly revenue</span>
        </div>
        <div className="scale-tile">
          <span className="tile-mono">Q1 EPS · YoY</span>
          <span className="tile-big">
            <CountUp to={19} suffix="%" trigger={seen} />
          </span>
          <span className="tile-foot">$2.84 diluted, up</span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4. WHERE THE MONEY GOES — rings (apple core)
   ============================================================ */

function Costs() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.0, end: 0.8 });
  const seen = useInView(ref, 0.15);

  const costs = [
    { pct: 53, color: '#4A90D9', label: 'Cost of Revenue' },
    { pct: 8, color: '#E8734A', label: 'R&D' },
    { pct: 7, color: '#5DBE8A', label: 'SG&A' },
    { pct: 3, color: '#A66CDB', label: 'Stock-Based Compensation' },
    { pct: 3, color: '#F0C040', label: 'Depreciation & Amortization' },
  ];
  const totalCost = costs.reduce((s, c) => s + c.pct, 0); // 74
  const margin = 100 - totalCost;

  // Ring geometry — concentric arcs from outside in, each cost a thick ring
  const ringWidth = 14;
  const gap = 4;
  const cx = 170;
  const cy = 170;
  let r = 150;

  return (
    <section className="costs" ref={ref}>
      <div className="eyebrow-row">
        <span className="eyebrow">A hundred cents in · 26 survive</span>
      </div>

      <h2 className="section-h">
        Of every dollar, <em>twenty-six cents</em> end up profit.
      </h2>

      <p className="section-body">
        Three quarters of every dollar Apple takes in goes back out the door —
        to suppliers, to engineers, to factories. <em>The rest is what's left
        to keep.</em>
      </p>

      <div className="cost-rings-wrap">
        <svg viewBox="0 0 340 340" className="cost-rings" width="100%">
          <defs>
            <radialGradient id="coreGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#FFE9DD" />
              <stop offset="60%" stopColor="#FFD3BD" />
              <stop offset="100%" stopColor="#FF9E82" />
            </radialGradient>
          </defs>

          {/* dollar circle outline */}
          <circle
            cx={cx}
            cy={cy}
            r={r + 6}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
            strokeDasharray="2 4"
            opacity="0.7"
          />

          {costs.map((c, i) => {
            const radius = r;
            const circ = 2 * Math.PI * radius;
            const len = (c.pct / 100) * circ;
            const t = clamp((p - i * 0.06) / 0.4, 0, 1);
            const drawn = easeOut(t) * len;
            const ring = (
              <g key={c.label}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth={ringWidth}
                  opacity="0.35"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={ringWidth}
                  strokeDasharray={`${drawn} ${circ}`}
                  strokeLinecap="butt"
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
              </g>
            );
            r -= ringWidth + gap;
            return ring;
          })}

          {/* core — the surplus */}
          <circle cx={cx} cy={cy} r={r + 4} fill="url(#coreGlow)" />
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fontFamily="Instrument Serif"
            fontSize="38"
            fontStyle="italic"
            fill="#1d1d1f"
          >
            26¢
          </text>
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            fontFamily="Geist Mono"
            fontSize="8"
            fill="#1d1d1f"
            letterSpacing="2"
          >
            NET MARGIN
          </text>
        </svg>

        <div className="cost-legend">
          {costs.map((c) => (
            <div className="legend-row" key={c.label}>
              <span
                className="legend-swatch"
                style={{ background: c.color }}
              />
              <span className="legend-label">{c.label}</span>
              <span className="legend-pct">{c.pct}%</span>
            </div>
          ))}
          <div className="legend-row legend-net">
            <span
              className="legend-swatch"
              style={{ background: 'var(--coral-300)' }}
            />
            <span className="legend-label">
              <em>What's left</em>
            </span>
            <span className="legend-pct">{margin}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   5. FOOTPRINT — geographic distribution as a pour
   ============================================================ */

function Footprint() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.05, end: 0.7 });

  const regions = [
    { pct: 43, region: 'Americas' },
    { pct: 27, region: 'Europe' },
    { pct: 15, region: 'Greater China' },
    { pct: 8, region: 'Rest of Asia Pacific' },
    { pct: 7, region: 'Japan' },
  ];

  return (
    <section className="footprint" ref={ref}>
      <div className="eyebrow-row">
        <span className="eyebrow">The footprint · five continents</span>
      </div>

      <h2 className="section-h">
        Forty-three cents of every dollar comes <em>home</em>.
      </h2>

      <p className="section-body">
        The rest comes from <em>everywhere else</em> — Europe, Greater China,
        the Pacific, Japan. A revenue map that mirrors a global supply chain.
      </p>

      <div className="globe-wrap">
        <svg viewBox="0 0 340 340" className="globe" width="100%">
          <defs>
            <radialGradient id="globeBody" cx="0.4" cy="0.4" r="0.6">
              <stop offset="0%" stopColor="#FBFAF7" />
              <stop offset="80%" stopColor="#ECEAE3" />
              <stop offset="100%" stopColor="#CFCBC0" />
            </radialGradient>
          </defs>
          <circle cx="170" cy="170" r="140" fill="url(#globeBody)" />
          {/* latitude lines */}
          {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
            <ellipse
              key={i}
              cx="170"
              cy="170"
              rx={140 * Math.sin(Math.PI * t)}
              ry="3"
              fill="none"
              stroke="var(--line)"
              strokeWidth="0.5"
              transform={`translate(0 ${(t - 0.5) * 280})`}
            />
          ))}
          {/* longitude lines */}
          {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
            <ellipse
              key={i}
              cx="170"
              cy="170"
              rx={140 * Math.sin(Math.PI * t)}
              ry="140"
              fill="none"
              stroke="var(--line)"
              strokeWidth="0.5"
            />
          ))}
          {/* equator */}
          <line
            x1="30"
            y1="170"
            x2="310"
            y2="170"
            stroke="var(--line-strong)"
            strokeWidth="0.8"
          />

          {/* region pins, sized by pct */}
          {[
            { x: 105, y: 145, pct: 43, lab: 'Americas', accent: true },
            { x: 195, y: 130, pct: 27, lab: 'Europe' },
            { x: 235, y: 158, pct: 15, lab: 'Greater China' },
            { x: 248, y: 200, pct: 8, lab: 'Rest of Asia Pacific' },
            { x: 258, y: 178, pct: 7, lab: 'Japan' },
          ].map((r, i) => {
            const t = clamp((p - i * 0.08) / 0.3, 0, 1);
            const radius = (r.pct * 0.55 + 4) * easeOut(t);
            return (
              <g key={i} opacity={t}>
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={radius + 6}
                  fill={r.accent ? 'rgba(255,122,87,0.18)' : 'rgba(20,20,20,0.06)'}
                />
                <circle
                  cx={r.x}
                  cy={r.y}
                  r={radius}
                  fill={r.accent ? 'var(--coral-400)' : '#1d1d1f'}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="region-list">
        {regions.map((r, i) => {
          const t = clamp((p - 0.1 - i * 0.06) / 0.3, 0, 1);
          return (
            <div className="region-row" key={r.region}>
              <span className="region-pct">{r.pct}%</span>
              <span className="region-name">{r.region}</span>
              <span className="region-bar">
                <span
                  className={`region-fill ${i === 0 ? 'is-home' : ''}`}
                  style={{ width: `${easeOut(t) * (r.pct / 43) * 100}%` }}
                />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   RESET BEAT 2 — dark interlude transitioning to capital allocation
   ============================================================ */

/* ============================================================
   6. THE BET — buybacks. $600B, climbing.
   ============================================================ */

function Bet() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.0, end: 0.85 });
  const seen = useInView(ref, 0.2);

  // Buybacks since 2012 — $600B+; recent year $90.71B
  // Visualize as a stair-stack growing.
  const stack = useMemo(() => {
    // 14 years of buybacks, illustrative growing pattern toward $600B+
    const years = [];
    for (let i = 0; i < 14; i++) {
      const h = 16 + i * 5 + (Math.sin(i) + 1) * 6;
      years.push({ y: 2012 + i, h });
    }
    return years;
  }, []);

  return (
    <section className="bet" ref={ref}>
      <div className="eyebrow-row dark">
        <span className="eyebrow eyebrow-dark">The bet · $600B back</span>
      </div>

      <h2 className="section-h dark">
        Apple's biggest investment is <em>itself</em>.
      </h2>

      <p className="section-body dark">
        Since 2012, Apple has bought back over <em>$600 billion</em> of its own
        stock — one of the largest repurchase programs in corporate history. In
        FY 2025 alone, <em>$90.71B</em> in buybacks and <em>$15.42B</em> in
        dividends.
      </p>

      <div className="bet-chart-wrap">
        <svg viewBox="0 0 340 220" className="bet-chart" width="100%">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A57" />
              <stop offset="100%" stopColor="#F25A37" />
            </linearGradient>
          </defs>
          <line
            x1="20"
            y1="200"
            x2="320"
            y2="200"
            stroke="rgba(244,242,237,0.15)"
            strokeWidth="0.5"
          />
          {stack.map((s, i) => {
            const t = clamp((p - i * 0.04) / 0.3, 0, 1);
            const h = easeOut(t) * s.h;
            const x = 24 + i * 21;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={200 - h}
                  width="14"
                  height={h}
                  fill={i === stack.length - 1 ? 'url(#barGrad)' : 'rgba(244,242,237,0.7)'}
                  rx="1"
                />
                {i % 3 === 0 && (
                  <text
                    x={x + 7}
                    y={214}
                    textAnchor="middle"
                    fontFamily="Geist Mono"
                    fontSize="7"
                    fill="rgba(244,242,237,0.5)"
                  >
                    '{String(s.y).slice(2)}
                  </text>
                )}
              </g>
            );
          })}
          {/* total callout */}
          <line
            x1="22"
            y1="40"
            x2="320"
            y2="40"
            stroke="rgba(255,122,87,0.4)"
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
          <text
            x="320"
            y="34"
            textAnchor="end"
            fontFamily="Geist Mono"
            fontSize="9"
            fill="#FF9E82"
            letterSpacing="2"
          >
            $600B+ SINCE 2012
          </text>
        </svg>
      </div>

      <div className="bet-stats">
        <div className="bet-stat">
          <span className="bet-mono">FY25 BUYBACKS</span>
          <span className="bet-big">
            <CountUp to={90.71} decimals={2} prefix="$" suffix="B" trigger={seen} />
          </span>
        </div>
        <div className="bet-stat">
          <span className="bet-mono">FY25 DIVIDENDS</span>
          <span className="bet-big">
            <CountUp to={15.42} decimals={2} prefix="$" suffix="B" trigger={seen} />
          </span>
        </div>
        <div className="bet-stat">
          <span className="bet-mono">2024 NEW AUTH.</span>
          <span className="bet-big">
            <CountUp to={110} prefix="$" suffix="B" trigger={seen} />
          </span>
        </div>
        <div className="bet-stat">
          <span className="bet-mono">FREE CASH FLOW</span>
          <span className="bet-big">
            <CountUp to={98.77} decimals={2} prefix="$" suffix="B" trigger={seen} />
          </span>
        </div>
      </div>

      <div className="bet-caveat">
        <span className="meta-mini">
          M&A · Q.AI ACQUIRED EARLY 2026, ~$2B · BOLT-ON, NEVER TRANSFORMATIVE
        </span>
      </div>
    </section>
  );
}

/* ============================================================
   7. THE COMPETITION — sized as celestial bodies
   ============================================================ */

function Competition() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.0, end: 0.8 });
  const seen = useInView(ref, 0.15);

  const players = [
    { name: 'NVIDIA', ticker: 'NVDA', cap: 4.9, rev: 215.94, growth: 65.47 },
    { name: 'Apple', ticker: 'AAPL', cap: 3.97, rev: 416.16, growth: null, isUs: true },
    { name: 'Microsoft', ticker: 'MSFT', cap: 3.14, rev: 281.72, growth: 16.67 },
    // Samsung intentionally absent here (no financial data) — referenced below
  ];

  const maxCap = 5.0;

  return (
    <section className="competition" ref={ref}>
      <div className="eyebrow-row">
        <span className="eyebrow">The neighbors · three trillion-dollar names</span>
      </div>

      <h2 className="section-h">
        Apple isn't alone at <em>this altitude</em>.
      </h2>

      <p className="section-body">
        Three of the world's most valuable companies are now within a trillion
        dollars of each other in market cap — competing for the same screens,
        the same chips, <em>the same future</em>.
      </p>

      <div className="orbits">
        <svg viewBox="0 0 340 340" width="100%" className="orbits-svg">
          {/* concentric orbit rings */}
          {[60, 100, 140].map((rad, i) => (
            <circle
              key={i}
              cx="170"
              cy="170"
              r={rad}
              fill="none"
              stroke="var(--line)"
              strokeWidth="0.5"
              strokeDasharray="2 4"
            />
          ))}
          {players.map((c, i) => {
            const angle = (i / players.length) * Math.PI * 2 - Math.PI / 2;
            const orbit = 110;
            const x = 170 + Math.cos(angle) * orbit;
            const y = 170 + Math.sin(angle) * orbit;
            const r = (c.cap / maxCap) * 50 + 10;
            const t = clamp((p - i * 0.1) / 0.4, 0, 1);
            return (
              <g key={c.name} opacity={t}>
                <circle
                  cx={x}
                  cy={y}
                  r={r * easeOut(t) + 8}
                  fill={c.isUs ? 'rgba(255,122,87,0.12)' : 'rgba(20,20,20,0.05)'}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={r * easeOut(t)}
                  fill={c.isUs ? 'var(--coral-400)' : '#1d1d1f'}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontFamily="Geist Mono"
                  fontSize="9"
                  fill={c.isUs ? '#fff' : '#fff'}
                  letterSpacing="1"
                >
                  {c.ticker}
                </text>
                <text
                  x={x}
                  y={y + r * easeOut(t) + 16}
                  textAnchor="middle"
                  fontFamily="Geist Mono"
                  fontSize="9"
                  fill="var(--ink-3)"
                  letterSpacing="1"
                >
                  ${c.cap}T
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="comp-rows">
        {players.map((c) => (
          <div className={`comp-row ${c.isUs ? 'is-us' : ''}`} key={c.name}>
            <div className="comp-row-head">
              <span className="comp-name">{c.name}</span>
              <span className="comp-ticker">{c.ticker}</span>
            </div>
            <div className="comp-row-stats">
              <div className="comp-stat">
                <span className="comp-mono">CAP</span>
                <span className="comp-val">${c.cap}T</span>
              </div>
              <div className="comp-stat">
                <span className="comp-mono">REVENUE</span>
                <span className="comp-val">${c.rev}B</span>
              </div>
              {c.growth !== null && (
                <div className="comp-stat">
                  <span className="comp-mono">YoY</span>
                  <span className="comp-val">+{c.growth}%</span>
                </div>
              )}
              {c.isUs && (
                <div className="comp-stat">
                  <span className="comp-mono">YOU</span>
                  <span className="comp-val">↗</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="comp-aside">
          <p className="comp-aside-text">
            Plus <em>Samsung Electronics</em> (005930.KS) — the longest-running
            rival in the IT sector, contesting Apple where the screens live.
          </p>
        </div>
      </div>

      <div className="comp-thesis">
        <p className="comp-thesis-text">
          <em>NVIDIA</em> sells the chips powering the cloud. <em>Microsoft</em>{' '}
          sells the productivity layer. Apple sells <em>the device in your
          hand</em> — and increasingly, the recurring software that runs on it.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   8. THE TAKEAWAY — close inverts open. We started with $209.59B inbound
   on the iPhone screen; we close on what survives, services + margin.
   ============================================================ */

function Takeaway() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.2);
  const p = useScrollProgress(ref, { start: 0.0, end: 0.8 });

  return (
    <section className="takeaway" ref={ref}>
      <div className="eyebrow-row">
        <span className="eyebrow">The close · what survives</span>
      </div>

      <h2 className="takeaway-h">
        We opened on <em>a phone</em>.
        <br />
        We close on what it <em>becomes.</em>
      </h2>

      <div className="takeaway-arc">
        <svg viewBox="0 0 340 220" width="100%" className="arc-svg">
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1d1d1f" />
              <stop offset="60%" stopColor="#FF7A57" />
              <stop offset="100%" stopColor="#FFC2AE" />
            </linearGradient>
          </defs>
          <path
            d="M 30 180 Q 170 -20 310 180"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="2"
            strokeDasharray="700"
            strokeDashoffset={(1 - easeOut(clamp(p * 1.4, 0, 1))) * 700}
          />
          {/* anchors */}
          <g>
            <circle cx="30" cy="180" r="5" fill="#1d1d1f" />
            <text
              x="30"
              y="205"
              textAnchor="start"
              fontFamily="Geist Mono"
              fontSize="9"
              fill="var(--ink-3)"
              letterSpacing="1"
            >
              IPHONE · $209.59B
            </text>
          </g>
          <g>
            <circle cx="310" cy="180" r="5" fill="#FF7A57" />
            <text
              x="310"
              y="205"
              textAnchor="end"
              fontFamily="Geist Mono"
              fontSize="9"
              fill="var(--coral-500)"
              letterSpacing="1"
            >
              SERVICES · $109.16B
            </text>
          </g>
          {/* peak label */}
          <text
            x="170"
            y="40"
            textAnchor="middle"
            fontFamily="Instrument Serif"
            fontSize="22"
            fontStyle="italic"
            fill="#1d1d1f"
            opacity={easeOut(p)}
          >
            $416.16B
          </text>
          <text
            x="170"
            y="58"
            textAnchor="middle"
            fontFamily="Geist Mono"
            fontSize="8"
            fill="var(--ink-3)"
            letterSpacing="2"
            opacity={easeOut(p)}
          >
            FY25 · TOTAL
          </text>
        </svg>
      </div>

      <p className="takeaway-body">
        FY 2025 was the year Services crossed <em>$100 billion</em>. The phone
        is still the river — <em>still half the company</em> — but the
        recurring layer underneath is what the next decade is being built on.
      </p>

      <div className="takeaway-grand">
        <span className="grand-mono">FY 2025 · IN ONE NUMBER</span>
        <span className="grand-big">
          <CountUp to={416.16} decimals={2} prefix="$" suffix="B" trigger={seen} duration={1800} />
        </span>
        <span className="grand-foot">
          <em>$98.77B</em> walked back out as <em>free cash flow</em>.
        </span>
      </div>

      <div className="takeaway-foot">
        <span className="foot-meta">RECAP · APPLE INC. · FY 2025</span>
        <span className="foot-meta-sub">
          Sources · Apple 10-K · Q1 FY26 release · M&A: Q.ai (~$2B, 2026)
        </span>
      </div>
    </section>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? clamp(window.scrollY / max, 0, 1) : 0);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return (
    <div className="page">
      <Chrome progress={progress} />

      <Hero />

      <ResetBeat tone="paper">
        You don't sell <em>a billion phones a year</em> by accident.
        Behind the glass, <em>five businesses</em> keep the river flowing.
      </ResetBeat>

      <Business />

      <ResetBeat tone="paper-2">
        Half the world owns one. <em>Two and a half billion</em> are switched on
        right now.
      </ResetBeat>

      <Scale />

      <ResetBeat tone="paper">
        For every dollar that comes in, <em>seventy-four cents</em> walk out
        again — to suppliers, to engineers, to silicon.
      </ResetBeat>

      <Costs />

      <ResetBeat tone="paper-2">
        And the dollars come from <em>everywhere</em>.
      </ResetBeat>

      <Footprint />

      <ResetBeat tone="dark">
        When you've made more cash than you can spend, <em>you buy yourself
        back.</em>
      </ResetBeat>

      <Bet />

      <ResetBeat tone="paper">
        Apple is <em>not alone</em> on this mountain.
      </ResetBeat>

      <Competition />

      <Takeaway />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

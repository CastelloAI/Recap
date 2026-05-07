// HIG Recap — main app
// All sections live here; helpers and SVG metaphor scenes inline.

const { useState, useEffect, useRef, useMemo } = React;

// ============== DATA ==============
const HIG = {
  ticker: "HIG",
  exchange: "NYSE",
  name: "The Hartford",
  founded: 1810,
  marketCap: "$38.36B",
  revenueFY: "$28.37B",
  netIncomeFY: "$3.84B",
  employees: "19,500",
  q1Eps: "$3.09",
  q1Rev: "$5.09B",
  segments: [
    { name: "Business Insurance", pct: 55, gloss: "Workers' comp, commercial property, liability, specialty" },
    { name: "Employee Benefits", pct: 26, gloss: "Group life, disability, voluntary benefits" },
    { name: "Personal Insurance", pct: 14, gloss: "Auto, home, AARP-branded" },
    { name: "Hartford Funds", pct: 4, gloss: "Mutual funds & asset management" },
    { name: "Other Operations", pct: 1, gloss: "P&C run-off, corporate" },
  ],
  costs: [
    { pct: 55, color: "#2563EB", label: "Benefits, losses & loss adjustment" },
    { pct: 16, color: "#16A34A", label: "Insurance operating costs" },
    { pct: 8,  color: "#D97706", label: "Amortization of policy acquisition" },
    { pct: 5,  color: "#7C3AED", label: "Technology & IT investment" },
    { pct: 2,  color: "#DB2777", label: "Interest expense & other" },
  ],
  geo: [
    { region: "United States", pct: 94 },
    { region: "United Kingdom", pct: 4 },
    { region: "Other International", pct: 2 },
  ],
  balance: {
    debt: "$4.37B",
    equity: "$18.98B",
    debtEquity: "0.23",
    opCF: "$5.92B",
    fcf: "$5.75B",
    capex: "$169M",
    dividends: "$592M",
    buybackQ: "$450M",
    buybackAuth: "$1.55B",
  },
  competitors: [
    {
      name: "American International Group",
      ticker: "AIG",
      mc: 42.22,
      rev: "$26.77B",
      pe: "13.64",
      growth: "-1.75%",
      growthClass: "neg",
      blurb: "Targets larger global accounts and complex risk placements where the two carriers frequently compete for the same broker-distributed commercial business.",
    },
    {
      name: "Arch Capital Group",
      ticker: "ACGL",
      mc: 34.77,
      rev: "$19.93B",
      pe: "7.90",
      growth: "+14.90%",
      growthClass: "pos",
      blurb: "Aggressive specialty-line expansion and a superior combined ratio make Arch a direct underwriting rival in the same broker channels.",
    },
    {
      name: "Ameriprise Financial",
      ticker: "AMP",
      mc: 42.49,
      rev: "$13.23B",
      pe: "11.93",
      growth: "+5.49%",
      growthClass: "pos",
      blurb: "Workplace benefits and asset-management push targeting the same employers — a growing convergence threat to Hartford Funds and group benefits.",
    },
  ],
};
const HIG_MC = 38.36; // for sizing competitor bars
const MAX_MC = 42.49;

// ============== HOOKS ==============
function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setSeen(true); io.disconnect(); }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setP(h > 0 ? Math.min(1, Math.max(0, y / h)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const on = () => setY(window.scrollY);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return y;
}

function useCountUp(target, opts = {}) {
  const { duration = 1400, decimals = 0 } = opts;
  const [ref, seen] = useReveal(0.4);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(target * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, duration]);
  return [ref, val.toFixed(decimals)];
}

// ============== CHROME ==============
function Chrome() {
  const p = useScrollProgress();
  return (
    <div className="chrome">
      <div className="chrome-inner">
        <div className="chrome-l">
          <span className="ticker">HIG</span>
          <span className="ticker-sep">·</span>
          <span className="ticker-name">The Hartford</span>
        </div>
        <span className="recap-label">Recap · FY '25</span>
      </div>
      <div className="scroll-progress">
        <div className="scroll-progress-fill" style={{ width: `${p * 100}%` }} />
      </div>
    </div>
  );
}

// ============== HERO ==============
function HeroLedgerLines() {
  const y = useScrollY();
  return (
    <svg className="hero-ledger" viewBox="0 0 420 800" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="ledger-lines" x="0" y={-y * 0.25} width="100%" height="32" patternUnits="userSpaceOnUse">
          <line x1="0" y1="32" x2="420" y2="32" stroke="#D6CDB7" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="420" height="800" fill="url(#ledger-lines)" />
    </svg>
  );
}

function Hero() {
  const [ref, seen] = useReveal(0.05);
  return (
    <section className="hero" ref={ref}>
      <HeroLedgerLines />
      <div className={`reveal ${seen ? "in" : ""}`}>
        <span className="hero-stamp">Est. 1810 · Hartford, CT</span>
      </div>
      <h1 className="hero-headline">
        <span className={`line reveal delay-1 ${seen ? "in" : ""}`}>Two hundred</span>
        <span className={`line reveal delay-2 ${seen ? "in" : ""}`}>and fifteen years</span>
        <span className={`line reveal delay-3 ${seen ? "in" : ""}`}>
          of <span className="it">paying claims.</span>
        </span>
      </h1>
      <p className={`hero-sub reveal delay-4 ${seen ? "in" : ""}`}>
        The Hartford writes the policies American businesses bind in workers' comp,
        property, and liability — and has been settling on them since
        <em> Madison was president.</em>
      </p>

      <div className="hero-meta">
        <div className="hero-meta-cell">
          <div className="label">Market cap</div>
          <div className="val">$38.36<span className="unit">B</span></div>
        </div>
        <div className="hero-meta-cell">
          <div className="label">Revenue FY'25</div>
          <div className="val">$28.37<span className="unit">B</span></div>
        </div>
        <div className="hero-meta-cell">
          <div className="label">Net income</div>
          <div className="val">$3.84<span className="unit">B</span></div>
        </div>
        <div className="hero-meta-cell">
          <div className="label">Employees</div>
          <div className="val">19.5<span className="unit">K</span></div>
        </div>
      </div>
    </section>
  );
}

// ============== EYEBROW ==============
function Eyebrow({ num, children }) {
  return (
    <div className="eyebrow-row">
      <span className="num">{num}</span>
      <span>{children}</span>
      <span className="rule" />
    </div>
  );
}

// ============== HOW IT MAKES MONEY ==============
function HowItWorks() {
  const [ref, seen] = useReveal(0.15);
  return (
    <section ref={ref}>
      <Eyebrow num="01">The business · five segments</Eyebrow>
      <h2 className={`display-md reveal ${seen ? "in" : ""}`}>
        Five lines of cover.<br />
        <span className="it signal">One promise.</span>
      </h2>
      <p className={`body reveal delay-1 ${seen ? "in" : ""}`} style={{ marginTop: 18 }}>
        The Hartford collects premiums across five segments. Business
        Insurance — workers' comp, commercial property, professional liability —
        carries the weight, with <em className="it">8% written-premium growth</em> in FY'25.
      </p>
      <div className="segment-stack">
        {HIG.segments.map((s, i) => (
          <div
            key={s.name}
            className={`segment-row reveal delay-${i + 1} ${seen ? "in active" : ""}`}
            style={{ "--w": `${s.pct}%` }}
          >
            <span className="segment-num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="segment-name">{s.name}</div>
              <div className="caption" style={{ marginTop: 4, color: "var(--ink-3)", textTransform: "none", letterSpacing: "0.02em", fontSize: 11 }}>
                {s.gloss}
              </div>
            </div>
            <div className="segment-pct">{s.pct}%</div>
            <div className="segment-bar-wrap">
              <div className="segment-bar-fill" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============== RESET BEAT ==============
function ResetBeat({ children, attrib }) {
  const [ref, seen] = useReveal(0.4);
  return (
    <div className="reset-beat" ref={ref}>
      <div className={`quote reveal ${seen ? "in" : ""}`}>{children}</div>
      {attrib && <div className={`attrib reveal delay-1 ${seen ? "in" : ""}`}>{attrib}</div>}
    </div>
  );
}

// ============== SCALE ==============
function ScaleCell({ label, meta, num, unit, italic, desc }) {
  const [ref, seen] = useReveal(0.4);
  return (
    <div className="scale-cell" ref={ref}>
      <div className="top">
        <span className="label">{label}</span>
        <span className="meta">{meta}</span>
      </div>
      <div className={`num ${italic ? "italic" : ""} reveal ${seen ? "in" : ""}`}>
        {num}{unit && <span className="unit">{unit}</span>}
      </div>
      <div className={`desc reveal delay-1 ${seen ? "in" : ""}`}>{desc}</div>
    </div>
  );
}

function Scale() {
  const [ref, seen] = useReveal(0.15);
  return (
    <section ref={ref}>
      <Eyebrow num="02">The scale · what 215 years buys</Eyebrow>
      <h2 className={`display-md reveal ${seen ? "in" : ""}`}>
        The numbers <span className="it signal">underneath</span> a benchmark insurer.
      </h2>
      <div style={{ marginTop: 32 }}>
        <ScaleCell label="Revenue FY'25" meta="Annual" num="$28.37" unit="B" desc="Premiums plus net investment income across all five segments." />
        <ScaleCell label="Net income FY'25" meta="≈ 13.5% margin" num="$3.84" unit="B" italic desc="What survives after losses, claims, and operating costs are paid." />
        <ScaleCell label="Most recent quarter" meta="Q1 2026" num="$5.09" unit="B" desc="Revenue. EPS came in at $3.09, on $450M of buybacks." />
        <ScaleCell label="Headcount" meta="Worldwide" num="19,500" desc="Across the U.S., the U.K., and select international hubs." />
        <ScaleCell label="Years of operation" meta="Since 1810" num="215" desc="One of the oldest insurance carriers in the United States." />
      </div>
    </section>
  );
}

// ============== A HUNDRED CENTS IN ==============
function CentsGrid() {
  const [ref, seen] = useReveal(0.2);
  // Build 100 cells, colored according to costs in cumulative order.
  const cells = useMemo(() => {
    const out = [];
    let i = 0;
    HIG.costs.forEach((c) => {
      for (let k = 0; k < c.pct; k++) {
        out.push({ idx: i, color: c.color, label: c.label });
        i++;
      }
    });
    while (out.length < 100) out.push({ idx: out.length, color: null, label: "Survives" });
    return out;
  }, []);
  return (
    <div ref={ref} className="cents-grid">
      {cells.map((c) => (
        <div
          key={c.idx}
          className={`cent ${seen ? "lit" : ""}`}
          style={{
            transitionDelay: seen ? `${c.idx * 9}ms` : "0ms",
            background: seen ? (c.color || "var(--paper-warm)") : "var(--paper-laid)",
            borderColor: seen ? (c.color ? c.color : "var(--signal)") : "var(--rule)",
          }}
        />
      ))}
    </div>
  );
}

function Cents() {
  const [ref, seen] = useReveal(0.1);
  return (
    <section ref={ref}>
      <Eyebrow num="03">A hundred cents in · five claims on the dollar</Eyebrow>
      <h2 className={`display-md reveal ${seen ? "in" : ""}`}>
        For every dollar of <span className="it">premium and</span><br />
        <span className="it">investment income</span>, this is who gets paid.
      </h2>
      <CentsGrid />
      <div className="cents-legend">
        {HIG.costs.map((c, i) => (
          <div key={i} className="cents-legend-row">
            <span className="swatch" style={{ background: c.color }} />
            <span className="label">{c.label}</span>
            <span className="val">{c.pct}¢</span>
          </div>
        ))}
        <div className="cents-legend-row" style={{ marginTop: 4 }}>
          <span className="swatch" style={{ background: "var(--paper-warm)", border: "1px solid var(--signal)" }} />
          <span className="label" style={{ color: "var(--signal)" }}>What survives — to operating margin</span>
          <span className="val" style={{ color: "var(--signal)" }}>14¢</span>
        </div>
      </div>
      <div className="cents-survive">
        <div className="lead">A penny for every promise kept</div>
        <div className="num">14<span className="cent-sym" style={{ fontFamily: "var(--font-display)" }}>¢</span></div>
        <div className="tail">survive to operating profit per dollar of revenue.</div>
      </div>
    </section>
  );
}

// ============== FOOTPRINT ==============
function GeoMap() {
  const [ref, seen] = useReveal(0.3);
  return (
    <div ref={ref} className="geo-figure">
      <svg viewBox="0 0 420 260" width="100%" height="100%" aria-hidden="true">
        {/* longitude/latitude lines for ledger feel */}
        <g stroke="var(--rule)" strokeWidth="0.5" opacity="0.7">
          {[40, 80, 120, 160, 200, 240].map((y) => (
            <line key={y} x1="20" x2="400" y1={y} y2={y} />
          ))}
          {[40, 100, 160, 220, 280, 340, 400].map((x) => (
            <line key={x} y1="20" y2="240" x1={x} x2={x} />
          ))}
        </g>
        {/* Stylized US continent (large) */}
        <path
          d="M40 130 C 50 110, 80 100, 110 102 C 130 95, 160 95, 175 105 L 195 105 L 200 95 L 215 100 L 215 115 L 205 130 L 200 145 L 185 160 L 165 170 L 130 175 L 100 170 L 75 165 L 55 155 Z"
          fill={seen ? "var(--signal)" : "var(--rule)"}
          opacity={seen ? 0.92 : 0.4}
          style={{ transition: "fill 1s var(--ease-out), opacity 1s var(--ease-out)" }}
        />
        {/* US label */}
        <text x="120" y="138" fontFamily="Geist Mono" fontSize="9" letterSpacing="2" fill="#fff" textAnchor="middle">
          UNITED STATES
        </text>
        <text x="120" y="152" fontFamily="Instrument Serif" fontSize="22" fill="#fff" textAnchor="middle" fontStyle="italic">
          94%
        </text>

        {/* UK */}
        <path
          d="M268 92 C 272 86, 278 84, 282 86 C 286 88, 286 95, 284 100 C 280 105, 274 106, 270 102 Z"
          fill={seen ? "var(--ledger)" : "var(--rule)"}
          style={{ transition: "fill 1.2s var(--ease-out)", transitionDelay: "200ms" }}
        />
        <line x1="282" y1="100" x2="310" y2="116" stroke="var(--ledger)" strokeWidth="0.5" />
        <text x="316" y="118" fontFamily="Geist Mono" fontSize="8" letterSpacing="1.5" fill="var(--ledger)">
          UK · 4%
        </text>

        {/* Other intl - tiny dots in Europe/Asia */}
        <circle cx="305" cy="128" r="2" fill="var(--ledger)" opacity={seen ? 0.5 : 0} style={{ transition: "opacity 1s", transitionDelay: "400ms" }} />
        <circle cx="345" cy="138" r="2" fill="var(--ledger)" opacity={seen ? 0.5 : 0} style={{ transition: "opacity 1s", transitionDelay: "500ms" }} />
        <circle cx="372" cy="152" r="2" fill="var(--ledger)" opacity={seen ? 0.5 : 0} style={{ transition: "opacity 1s", transitionDelay: "600ms" }} />
        <line x1="345" y1="138" x2="370" y2="200" stroke="var(--ledger)" strokeWidth="0.5" opacity="0.6" />
        <text x="372" y="208" fontFamily="Geist Mono" fontSize="8" letterSpacing="1.5" fill="var(--ledger)" textAnchor="end">
          OTHER · 2%
        </text>

        {/* compass */}
        <g transform="translate(48, 46)" opacity="0.5">
          <circle r="14" fill="none" stroke="var(--ledger)" strokeWidth="0.5" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="var(--ledger)" strokeWidth="0.5" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--ledger)" strokeWidth="0.5" />
          <text x="0" y="-16" fontFamily="Geist Mono" fontSize="7" fill="var(--ledger)" textAnchor="middle">N</text>
        </g>
      </svg>
    </div>
  );
}

function Footprint() {
  const [ref, seen] = useReveal(0.15);
  return (
    <section ref={ref}>
      <Eyebrow num="04">The footprint · domestic at heart</Eyebrow>
      <h2 className={`display-md reveal ${seen ? "in" : ""}`}>
        An <span className="it signal">American</span> insurer<br />
        with a small Atlantic crossing.
      </h2>
      <div className="geo-card">
        <GeoMap />
        <div className="geo-legend">
          {HIG.geo.map((g, i) => {
            return (
              <GeoRow key={g.region} region={g.region} pct={g.pct} delay={i} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GeoRow({ region, pct, delay }) {
  const [ref, seen] = useReveal(0.4);
  return (
    <div ref={ref} className={`geo-row ${seen ? "active" : ""}`} style={{ "--w": pct, transitionDelay: `${delay * 80}ms` }}>
      <span className="region">{region}</span>
      <div className="pct-bar"><div className="pct-bar-fill" /></div>
      <span className="pct">{pct}%</span>
    </div>
  );
}

// ============== THE BET (dark interlude) ==============
function BalanceScale() {
  const [ref, seen] = useReveal(0.3);
  // Equity ($18.98B) vs Debt ($4.37B) — roughly 4.3x weighting
  return (
    <div ref={ref} style={{ marginTop: 24 }}>
      <svg viewBox="0 0 360 220" width="100%" aria-hidden="true">
        <defs>
          <linearGradient id="bar-gold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#E0B85C" />
            <stop offset="1" stopColor="#B8923D" />
          </linearGradient>
        </defs>
        {/* fulcrum / pillar */}
        <rect x="178" y="60" width="4" height="120" fill="#3A322A" />
        <polygon points="170,180 190,180 195,200 165,200" fill="#3A322A" />

        {/* beam — tilts toward equity (down on right) */}
        <g
          style={{
            transition: "transform 1.6s var(--ease-out)",
            transform: seen ? "rotate(-7deg)" : "rotate(0deg)",
            transformOrigin: "180px 60px",
          }}
        >
          <rect x="40" y="58" width="280" height="4" fill="url(#bar-gold)" />
          {/* left pan ropes */}
          <line x1="80" y1="62" x2="80" y2="92" stroke="#5A4A35" strokeWidth="0.7" />
          <line x1="280" y1="62" x2="280" y2="92" stroke="#5A4A35" strokeWidth="0.7" />
          {/* left pan: DEBT - smaller */}
          <g>
            <ellipse cx="80" cy="100" rx="44" ry="6" fill="none" stroke="#5A4A35" strokeWidth="0.7" />
            <rect x="56" y="96" width="48" height="14" fill="#1F1A14" stroke="#5A4A35" strokeWidth="0.6" />
            <text x="80" y="106" fontFamily="Geist Mono" fontSize="9" fill="#8A8067" textAnchor="middle" letterSpacing="1.5">DEBT</text>
          </g>
          {/* right pan: EQUITY - larger */}
          <g>
            <ellipse cx="280" cy="118" rx="56" ry="7" fill="none" stroke="#5A4A35" strokeWidth="0.7" />
            <rect x="245" y="100" width="70" height="22" fill="#1F1A14" stroke="#E97455" strokeWidth="0.7" />
            <rect x="245" y="100" width="70" height="22" fill="none" stroke="#E97455" strokeWidth="0.7" opacity={seen ? 1 : 0} style={{ transition: "opacity 1s", transitionDelay: "1.2s" }} />
            <text x="280" y="115" fontFamily="Geist Mono" fontSize="10" fill="#E97455" textAnchor="middle" letterSpacing="1.5">EQUITY</text>
          </g>
        </g>

        {/* labels under the pans */}
        <text x="80" y="200" fontFamily="Instrument Serif" fontSize="20" fill="#F4EFE2" textAnchor="middle" fontStyle="italic">$4.37B</text>
        <text x="280" y="200" fontFamily="Instrument Serif" fontSize="20" fill="#E97455" textAnchor="middle" fontStyle="italic">$18.98B</text>
        <text x="80" y="214" fontFamily="Geist Mono" fontSize="8" fill="#8A8067" textAnchor="middle" letterSpacing="2">TOTAL DEBT</text>
        <text x="280" y="214" fontFamily="Geist Mono" fontSize="8" fill="#8A8067" textAnchor="middle" letterSpacing="2">TOTAL EQUITY</text>

        {/* fulcrum label */}
        <text x="180" y="40" fontFamily="Geist Mono" fontSize="9" fill="#8A8067" textAnchor="middle" letterSpacing="2.5">D/E · 0.23</text>
      </svg>
    </div>
  );
}

function TheBet() {
  const [ref, seen] = useReveal(0.1);
  return (
    <section className="dark-beat" ref={ref}>
      <Eyebrow num="05">The bet · capital allocation</Eyebrow>
      <h2 className={`display-md reveal ${seen ? "in" : ""}`}>
        Conservative on the<br />
        liability side.<br />
        <span className="it signal">Aggressive</span> on the buyback.
      </h2>
      <p className={`body reveal delay-1 ${seen ? "in" : ""}`} style={{ marginTop: 18 }}>
        The Hartford carries less debt than most insurers its size — and routes
        the cash it generates back to shareholders. <em style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#F4EFE2" }}>Dividends and
        buybacks did $1.04B</em> of work in FY'25; quarterly buybacks just stepped up
        to $450M.
      </p>
      <BalanceScale />
      <div className="bet-grid">
        <div className="bet-cell">
          <div className="label">Operating cash flow</div>
          <div className="val">$5.92<span className="unit">B</span></div>
          <div className="desc">FY'25</div>
        </div>
        <div className="bet-cell">
          <div className="label">Free cash flow</div>
          <div className="val">$5.75<span className="unit">B</span></div>
          <div className="desc">FY'25</div>
        </div>
        <div className="bet-cell">
          <div className="label">Capex</div>
          <div className="val">$169<span className="unit">M</span></div>
          <div className="desc">Asset-light insurer</div>
        </div>
        <div className="bet-cell">
          <div className="label">Dividends paid</div>
          <div className="val">$592<span className="unit">M</span></div>
          <div className="desc">FY'25</div>
        </div>
        <div className="bet-cell">
          <div className="label">Buyback / qtr</div>
          <div className="val">$450<span className="unit">M</span></div>
          <div className="desc">From Q1 2026</div>
        </div>
        <div className="bet-cell">
          <div className="label">Auth remaining</div>
          <div className="val">$1.55<span className="unit">B</span></div>
          <div className="desc">Repurchase room</div>
        </div>
      </div>
    </section>
  );
}

// ============== COMPETITORS ==============
function CompRow({ c, isHig }) {
  const [open, setOpen] = useState(false);
  const [ref, seen] = useReveal(0.3);
  const w = (c.mc / MAX_MC) * 100;
  return (
    <div
      ref={ref}
      className={`comp-row ${seen ? "active" : ""} ${open ? "open" : ""} ${isHig ? "is-hig" : ""}`}
      style={{ "--w": w }}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="head">
        <span className="name">{c.name}</span>
        <span className="ticker-sm">{c.ticker}</span>
      </div>
      <div className="mc-bar">
        <div className="track" />
        <div className="fill" />
        <span className="label-mc">${c.mc.toFixed(2)}B</span>
      </div>
      <div className="stats">
        <div className="stat"><div className="k">Revenue</div><div className="v">{c.rev}</div></div>
        <div className="stat"><div className="k">P/E TTM</div><div className="v">{c.pe}</div></div>
        <div className="stat"><div className="k">Rev YoY</div><div className={`v ${c.growthClass}`}>{c.growth}</div></div>
      </div>
      <div className="blurb"><p>{c.blurb}</p></div>
      {!isHig && <div className="expand-hint">{open ? "↑ Less" : "↓ Tap to expand"}</div>}
    </div>
  );
}

function Competitors() {
  const [ref, seen] = useReveal(0.1);
  return (
    <section ref={ref}>
      <Eyebrow num="06">The rivals · who's on the same broker line</Eyebrow>
      <h2 className={`display-md reveal ${seen ? "in" : ""}`}>
        Three carriers, <span className="it signal">three</span><br />
        different angles of attack.
      </h2>
      <p className={`body reveal delay-1 ${seen ? "in" : ""}`} style={{ marginTop: 18 }}>
        AIG bids on the global accounts. Arch Capital benchmarks the combined
        ratio. Ameriprise comes from the asset-management side, eyeing the same
        employers Hartford Funds calls on.
      </p>
      <div className="comp-list">
        <CompRow c={{ name: "The Hartford", ticker: "HIG", mc: 38.36, rev: "$28.37B", pe: "—", growth: "FY'25 ref", growthClass: "" }} isHig />
        {HIG.competitors.map((c) => <CompRow key={c.ticker} c={c} />)}
      </div>
    </section>
  );
}

// ============== CLOSE ==============
function Close() {
  const [ref, seen] = useReveal(0.15);
  return (
    <section className="close-section" ref={ref}>
      <Eyebrow num="07">The takeaway · the long arithmetic</Eyebrow>
      <h2 className={`close-headline reveal ${seen ? "in" : ""}`}>
        $28.37B of<br />
        premium <span className="it">in.</span><br />
        <span className="it">$3.84B</span><br />
        survives.
      </h2>
      <p className={`body reveal delay-1 ${seen ? "in" : ""}`} style={{ marginTop: 28 }}>
        The Hartford's job is the same one it had in 1810: collect premium, hold
        the float, settle the loss, do it again next year. <em style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--signal)" }}>Two hundred and
        fifteen years</em> of doing it well is what trades for $38B.
      </p>

      <div className="close-rule" />

      <div className="close-stat-row">
        <div className="close-stat">
          <div className="num">215<span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-3)", marginLeft: 4 }}>yrs</span></div>
          <div className="label">Operating</div>
        </div>
        <div className="close-stat">
          <div className="num">14<span style={{ fontFamily: "var(--font-display)" }}>¢</span></div>
          <div className="label">Per dollar in</div>
        </div>
        <div className="close-stat">
          <div className="num">$1.04<span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink-3)", marginLeft: 4 }}>B</span></div>
          <div className="label">Returned FY'25</div>
        </div>
      </div>

      <div className="colophon">
        <span>HIG · NYSE</span>
        <span>Recap · FY '25</span>
      </div>
    </section>
  );
}

// ============== APP ==============
function App() {
  return (
    <div className="page">
      <Chrome />
      <Hero />
      <ResetBeat attrib="— interlude · 01">
        Insurance is a promise <em>that ages</em> with you. The Hartford has been
        keeping its end of it since <em>Madison was president.</em>
      </ResetBeat>

      <HowItWorks />

      <ResetBeat attrib="— interlude · 02">
        Behind every dollar of premium, <em>a column of obligations.</em><br />
        What survives, survives <em>slowly</em>.
      </ResetBeat>

      <Scale />
      <Cents />

      <ResetBeat attrib="— interlude · 03">
        You don't run an insurer for two centuries on luck. <em>You run it on math —</em> and
        the patience to settle.
      </ResetBeat>

      <Footprint />
      <TheBet />
      <Competitors />

      <ResetBeat attrib="— interlude · 04">
        Two world wars. The Great Depression. <em>9/11. A pandemic.</em> The Hartford has
        paid claims through every one.
      </ResetBeat>

      <Close />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

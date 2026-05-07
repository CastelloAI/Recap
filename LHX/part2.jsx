/* global React */
const { useEffect, useRef, useState } = React;

// ============================================================
// Cost dollar — composition of revenue
// ============================================================
function CostDollar() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setShow(true)),
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  // From data:
  const rows = [
    { pct: 74, color: "#2563EB", label: "Cost of Revenue", code: "COGS" },
    { pct: 4,  color: "#9333EA", label: "Amortization of Intangibles", code: "AMORT" },
    { pct: 4,  color: "#DC2626", label: "SG&A", code: "SG&A" },
    { pct: 2,  color: "#16A34A", label: "Company-Funded R&D", code: "R&D" },
    { pct: 2,  color: "#EA580C", label: "LHX NeXt Restructuring", code: "RESTRUCT" },
  ];
  const sum = rows.reduce((a, b) => a + b.pct, 0); // 86%
  const residual = 100 - sum; // 14%

  // Operating income / revenue = 2.11 / 21.86 = 9.65%, ≈ 10¢
  const opMargin = 9.65;

  return (
    <div ref={ref}>
      {/* The dollar — horizontal stacked bar */}
      <div className="dollar-bar-wrap" style={{ marginBottom: 32, marginTop: 12 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            className="dollar-bar-seg"
            data-label={`${r.pct}¢ ${r.code}`}
            style={{
              width: show ? `${r.pct}%` : '0%',
              background: r.color,
              transition: `width 1.2s var(--ease-out) ${i * 100}ms`,
              opacity: 0.9,
            }}
          />
        ))}
        <div
          className="dollar-bar-seg"
          style={{
            width: show ? `${residual}%` : '0%',
            background: 'rgba(255,122,87,0.85)',
            transition: `width 1.2s var(--ease-out) ${rows.length * 100}ms`,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
          }}
        />
      </div>

      {/* Mono scale */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -28, marginBottom: 16 }}>
        <span className="mono" style={{ fontSize: 9 }}>0¢</span>
        <span className="mono" style={{ fontSize: 9 }}>50¢</span>
        <span className="mono" style={{ fontSize: 9 }}>$1.00</span>
      </div>

      {/* Detail rows */}
      <div className="dollar-stack">
        {rows.map((r, i) => (
          <div className="dollar-row reveal" key={i}>
            <div className="dollar-pct">{r.pct}<span className="small">¢</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="dollar-swatch" style={{ background: r.color }}></span>
              <div className="dollar-label">
                <span className="code">{r.code}</span>
                {r.label}
              </div>
            </div>
            <div className="mono" style={{ textAlign: 'right' }}>
              ${(21.86 * r.pct / 100).toFixed(2)}B
            </div>
          </div>
        ))}
      </div>

      {/* Residual — operating margin */}
      <div className="dollar-residual reveal">
        <div className="dollar-residual-label">What survives · 9.7% op margin</div>
        <div className="dollar-residual-num">≈<em>10</em>¢</div>
        <div className="dollar-residual-cap">
          On every dollar of revenue, ten cents make it to operating income — $2.11B in FY'25.
        </div>
      </div>
    </div>
  );
}

function Costs() {
  return (
    <section className="costs">
      <div className="costs-head reveal">
        <span className="eyebrow"><span className="signal">●</span>Where the money goes · 04</span>
        <h2 className="display" style={{ fontSize: 38, marginTop: 16 }}>
          A hundred cents <em>in.</em>
        </h2>
      </div>

      <div className="costs-figure reveal">
        <div className="costs-figure-num">$21.86<em>B</em></div>
        <div className="costs-figure-cap">
          Every dollar of revenue, broken down. <em>Three quarters</em> goes back out the door as cost of revenue — this is a fixed-price, cost-type contractor business.
        </div>
      </div>

      <CostDollar />
    </section>
  );
}

// ============================================================
// Globe — concentric circles, US dominant
// ============================================================
function GeoGlobe() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && setShow(true)),
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const cx = 200, cy = 200;

  // Regions sized by share. The US is the dominant ring; others are arc segments.
  // We build it as a polar chart: full ring at 78% sweep US, then 12, 6, 4.
  const regions = [
    { pct: 78, color: '#FF7A57', label: 'U.S.' },
    { pct: 12, color: '#6FE3C8', label: 'EUR · ME' },
    { pct: 6,  color: '#F4C430', label: 'APAC' },
    { pct: 4,  color: '#7B71F5', label: 'ROW' },
  ];

  let acc = 0;
  const arcs = regions.map(r => {
    const start = acc / 100 * 360 - 90;
    const end = (acc + r.pct) / 100 * 360 - 90;
    acc += r.pct;
    return { ...r, start, end };
  });

  function polar(r, a) {
    const rad = (a * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function arcPath(rOuter, rInner, start, end) {
    const [x1, y1] = polar(rOuter, start);
    const [x2, y2] = polar(rOuter, end);
    const [x3, y3] = polar(rInner, end);
    const [x4, y4] = polar(rInner, start);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4} Z`;
  }

  return (
    <div className="globe-wrap" ref={ref}>
      <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="globeFade" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(255,255,255,0.04)" stopOpacity="0" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
          </radialGradient>
        </defs>

        {/* Latitude ellipses — globe-feel */}
        {[60, 100, 140, 175].map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        {/* Longitudes */}
        {[0, 30, 60, 90, 120, 150].map((a, i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={175 * Math.abs(Math.cos((a * Math.PI) / 180)) + 0.001}
            ry={175}
            fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* Region arcs (donut) */}
        {arcs.map((r, i) => (
          <path
            key={i}
            d={arcPath(175, 130, r.start, r.end)}
            fill={r.color}
            opacity={show ? (r.label === 'U.S.' ? 0.85 : 0.55) : 0}
            style={{ transition: `opacity 800ms var(--ease-out) ${i * 120}ms` }}
          />
        ))}

        {/* Inner core */}
        <circle cx={cx} cy={cy} r={120} fill="#0B0D10" />
        <circle cx={cx} cy={cy} r={120} fill="url(#globeFade)" />

        {/* US callout in core */}
        <text x={cx} y={cy - 8} fill="#FF7A57" fontFamily="Instrument Serif, serif" fontSize="56" fontStyle="italic" textAnchor="middle">
          78%
        </text>
        <text x={cx} y={cy + 18} fill="#B8B3A8" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="2.5" textAnchor="middle">
          UNITED STATES
        </text>
        <line x1={cx - 30} y1={cy + 30} x2={cx + 30} y2={cy + 30} stroke="rgba(255,255,255,0.15)" />
        <text x={cx} y={cy + 46} fill="#7C7A73" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="2" textAnchor="middle">
          22% INTERNATIONAL
        </text>

        {/* Crosshair tick at 12 o'clock */}
        <line x1={cx} y1={20} x2={cx} y2={30} stroke="#FF7A57" strokeWidth="1" />
        <text x={cx + 6} y={28} fill="#FF7A57" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="1.5">N</text>
      </svg>
    </div>
  );
}

function Footprint() {
  const regions = [
    { pct: 78, name: 'United States', tag: 'CONUS' },
    { pct: 12, name: 'Europe & Middle East', tag: 'EMEA' },
    { pct: 6,  name: 'Asia-Pacific', tag: 'APAC' },
    { pct: 4,  name: 'Rest of World', tag: 'ROW' },
  ];

  return (
    <section className="footprint">
      <div className="footprint-head reveal">
        <span className="eyebrow"><span className="signal">●</span>The footprint · 05</span>
        <h2 className="display" style={{ fontSize: 38, marginTop: 16 }}>
          One flag, <em>mostly.</em>
        </h2>
      </div>

      <div className="footprint-figure reveal">
        <div className="footprint-figure-num">22<em>%</em></div>
        <div className="footprint-figure-text">
          comes from <em>somewhere else.</em> Allies, partners, foreign militaries — across 100+ countries.
        </div>
      </div>

      <GeoGlobe />

      <div className="region-list">
        {regions.map((r, i) => (
          <div key={i} className="region-row reveal">
            <span className="region-tag">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="region-name">{r.name}</div>
              <div className="mono" style={{ fontSize: 9, marginTop: 3 }}>{r.tag}</div>
            </div>
            <div className={`region-pct ${i === 0 ? 'signal' : ''}`}>
              {r.pct}<span className="small">%</span>
            </div>
            <div className="region-bar" style={{ width: `${r.pct}%` }}></div>
          </div>
        ))}
      </div>
    </section>
  );
}

window.LHXModule2 = { Costs, Footprint };

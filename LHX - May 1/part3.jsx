/* global React */
const { useEffect, useRef, useState } = React;

// ============================================================
// Capital allocation funnel
// ============================================================
function Bet() {
  const allocations = [
    { name: 'Share repurchases', amt: '$1.20', unit: 'B', meta: 'BUYBACKS · FY25', share: 44.8 },
    { name: 'Dividends paid', amt: '$903', unit: 'M', meta: 'SHAREHOLDER · FY25', share: 33.7 },
    { name: 'Capital expenditure', amt: '$424', unit: 'M', meta: 'CAPEX · FY25', share: 15.8 },
    { name: 'Held in cash', amt: '$153', unit: 'M', meta: 'BALANCE · RESIDUAL', share: 5.7 },
  ];

  return (
    <section className="bet">
      <div className="bet-head reveal">
        <span className="eyebrow"><span className="signal">●</span>The bet · 06</span>
        <h2 className="display" style={{ fontSize: 38, marginTop: 16 }}>
          Free cash, <em>spent.</em>
        </h2>
      </div>

      <div className="reveal">
        <div className="bet-fcf"><em>$2.68</em><span className="bet-fcf-unit">B</span></div>
        <div className="mono" style={{ marginTop: 4, marginBottom: 12 }}>FREE CASH FLOW · FY2025</div>
        <div className="bet-fcf-cap">
          From $3.11B in operating cash flow. <em>No long-term debt</em> outstanding under the commercial paper program — every dollar is allocated, not serviced.
        </div>
      </div>

      <div className="funnel-rows reveal">
        {allocations.map((a, i) => (
          <div key={i} className="funnel-row" style={{ position: 'relative' }}>
            <div className="funnel-row-arrow" style={{ opacity: 0.3 + (a.share / 60) }}></div>
            <div>
              <div className="funnel-row-name">{a.name}</div>
              <div className="funnel-row-meta">{a.meta} · {a.share.toFixed(1)}%</div>
            </div>
            <div className="funnel-row-amt">
              <em>{a.amt}</em><span style={{ fontSize: 14, color: 'var(--lhx-fg-2)' }}>{a.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bet-callout reveal">
        <div className="bet-callout-label">The standing bet</div>
        <div className="bet-callout-text">
          The company carries roughly <span style={{ color: 'var(--lhx-signal)', fontStyle: 'italic' }}>$7.3B</span> in acquisition-related intangibles — most of it from the Aerojet Rocketdyne deal. The book is heavy with goodwill, but the cash keeps coming.
        </div>
      </div>

      <div className="reveal" style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--lhx-ink-4)', border: '1px solid var(--lhx-ink-4)' }}>
        <div style={{ background: 'var(--lhx-ink)', padding: '16px 14px' }}>
          <div className="mono" style={{ fontSize: 9 }}>TOTAL EQUITY</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginTop: 6, color: 'var(--lhx-fg)' }}>$19.64<span style={{ fontSize: 16, color: 'var(--lhx-fg-2)' }}>B</span></div>
        </div>
        <div style={{ background: 'var(--lhx-ink)', padding: '16px 14px' }}>
          <div className="mono" style={{ fontSize: 9 }}>CASH ON HAND</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginTop: 6, color: 'var(--lhx-fg)' }}>$1.07<span style={{ fontSize: 16, color: 'var(--lhx-fg-2)' }}>B</span></div>
        </div>
        <div style={{ background: 'var(--lhx-ink)', padding: '16px 14px' }}>
          <div className="mono" style={{ fontSize: 9 }}>REVOLVER · 5YR</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginTop: 6, color: 'var(--lhx-fg)' }}>$2.50<span style={{ fontSize: 16, color: 'var(--lhx-fg-2)' }}>B</span></div>
        </div>
        <div style={{ background: 'var(--lhx-ink)', padding: '16px 14px' }}>
          <div className="mono" style={{ fontSize: 9 }}>REVOLVER · 364D</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginTop: 6, color: 'var(--lhx-fg)' }}>$500<span style={{ fontSize: 16, color: 'var(--lhx-fg-2)' }}>M</span></div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Competition — opposing radar contacts
// ============================================================
function CompetitorRadar({ rivals }) {
  // Place rivals on a half-radar facing LHX at center
  const cx = 200, cy = 160;
  return (
    <div className="comp-radar">
      <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="rivalFade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(255,122,87,0.04)" />
            <stop offset="100%" stopColor="rgba(255,122,87,0)" />
          </linearGradient>
        </defs>

        {/* Half rings */}
        {[60, 100, 140].map((r, i) => (
          <path
            key={i}
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={i === 2 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}
            strokeDasharray={i === 1 ? "2 4" : "none"}
          />
        ))}

        {/* Baseline */}
        <line x1={cx - 150} y1={cy} x2={cx + 150} y2={cy} stroke="rgba(255,255,255,0.1)" />

        {/* LHX center */}
        <circle cx={cx} cy={cy} r="6" fill="#FF7A57" />
        <circle cx={cx} cy={cy} r="14" fill="none" stroke="rgba(255,122,87,0.4)" />
        <text x={cx} y={cy + 22} fill="#FF7A57" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="2" textAnchor="middle">LHX · $65.4B</text>

        {/* Rivals — distance ≈ inverse market cap proximity */}
        {rivals.map((r, i) => {
          const angle = -160 + i * 50; // -160, -110, -60
          const rad = (angle * Math.PI) / 180;
          const dist = 60 + Math.abs(65.4 - r.cap) * 1.0;
          const dClamped = Math.min(140, dist);
          const x = cx + dClamped * Math.cos(rad);
          const y = cy + dClamped * Math.sin(rad);
          const blipR = Math.max(3, Math.sqrt(r.cap) * 0.7);
          return (
            <g key={r.ticker}>
              {/* Vector line */}
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" strokeDasharray="1 3" />
              <circle cx={x} cy={y} r={blipR} fill="#6FE3C8" opacity="0.9" />
              <circle cx={x} cy={y} r={blipR + 4} fill="none" stroke="rgba(111,227,200,0.4)" />
              <text x={x} y={y - blipR - 6} fill="#E8E5DE" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="2" textAnchor="middle">
                {r.ticker}
              </text>
              <text x={x} y={y + blipR + 12} fill="#7C7A73" fontFamily="Geist Mono, monospace" fontSize="7" letterSpacing="1" textAnchor="middle">
                ${r.cap}B
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Competition() {
  const competitors = [
    {
      name: "Huntington Ingalls",
      ticker: "HII",
      cap: 15.55,
      rev: "$12.48B",
      pe: "25.7",
      growth: "+8.2%",
      desc: "Direct rival in U.S. Navy shipbuilding and maritime systems integration. Fights for the same surface and submarine platform contracts where IMS provides competing sensors and mission systems.",
      tag: "MARITIME · BLOCK"
    },
    {
      name: "TransDigm Group",
      ticker: "TDG",
      cap: 71.49,
      rev: "$8.83B",
      pe: "35.3",
      growth: "+11.7%",
      desc: "Defense aerospace components and proprietary subsystems supplier. Larger market cap on smaller revenue — the market is paying for margin, not scale. Overlaps Communication Systems and SAS.",
      tag: "AEROSPACE · DENSE"
    },
    {
      name: "Kratos Defense",
      ticker: "KTOS",
      cap: 13.30,
      rev: "$1.35B",
      pe: "604.5",
      growth: "+18.5%",
      desc: "Emerging threat in unmanned systems, tactical comms, and space ground systems. Lower-cost, rapid-development model winning DoD contracts that legacy programs historically dominated.",
      tag: "INSURGENT · FAST"
    },
  ];

  return (
    <section className="competition">
      <div className="competition-head reveal">
        <span className="eyebrow"><span className="signal">●</span>The competition · 07</span>
        <h2 className="display" style={{ fontSize: 38, marginTop: 16 }}>
          Three contacts <em>on the scope.</em>
        </h2>
        <p className="body" style={{ marginTop: 14 }}>
          Sized by market cap, distanced by overlap. One is bigger, one is smaller, and one is <em>moving faster</em> than the legacy book is built to chase.
        </p>
      </div>

      <CompetitorRadar rivals={competitors} />

      <div className="comp-stack">
        {competitors.map((c, i) => (
          <div key={c.ticker} className="comp-card reveal">
            <div className="comp-corner"></div>
            <div className="comp-row">
              <span className="comp-ticker">{c.ticker}</span>
              <span className="comp-distance">{c.tag}</span>
            </div>
            <div className="comp-name">{c.name}</div>
            <div className="comp-desc">{c.desc}</div>
            <div className="comp-stats">
              <div className="comp-stat">
                <div className="comp-stat-label">Mkt Cap</div>
                <div className="comp-stat-val">${c.cap}B</div>
              </div>
              <div className="comp-stat">
                <div className="comp-stat-label">Revenue</div>
                <div className="comp-stat-val dim">{c.rev}</div>
              </div>
              <div className="comp-stat">
                <div className="comp-stat-label">YoY</div>
                <div className="comp-stat-val signal">{c.growth}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Closing thesis — invert the open
// ============================================================
function Closer() {
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

  return (
    <section className="closer" ref={ref}>
      <div className="closer-eyebrow reveal">
        <span className="eyebrow"><span className="signal">●</span>The takeaway · 08</span>
      </div>

      <div className="reveal">
        <div className="mono" style={{ marginBottom: 12 }}>CONTRACTED · ALREADY ON THE BOOKS</div>
        <div className="closer-figure">
          <em>$38.7</em><span className="closer-figure-unit">B</span>
        </div>
      </div>

      <div className="closer-thesis reveal">
        We opened with five domains and one contractor. Close on this: the next two years of revenue are <em>already signed.</em> The bet isn't whether the work comes in — it's how much margin survives once it does.
      </div>

      {/* A small final SVG mark — receding rings */}
      <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center' }} className="reveal">
        <svg viewBox="0 0 200 80" style={{ width: 220 }}>
          {[1, 2, 3, 4].map((i) => (
            <circle key={i} cx="100" cy="40" r={i * 9}
              fill="none"
              stroke="#FF7A57"
              strokeWidth="1"
              opacity={show ? (1 - i * 0.18) : 0}
              style={{ transition: `opacity 1s var(--ease-out) ${i * 200}ms` }}
            />
          ))}
          <circle cx="100" cy="40" r="2" fill="#FF7A57" />
        </svg>
      </div>

      <div className="closer-foot">
        <span className="closer-foot-left">LHX · NYSE · FY'25</span>
        <span className="closer-foot-right">END OF RECAP</span>
      </div>
    </section>
  );
}

window.LHXModule3 = { Bet, Competition, Closer };

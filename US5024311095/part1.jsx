/* global React */
const { useEffect, useRef, useState } = React;

// ============================================================
// Sticky chrome with progress hairline
// ============================================================
function Chrome() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop || window.scrollY) / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="chrome">
      <div className="chrome-row">
        <div className="chrome-left">
          <span className="chrome-ticker">
            <span className="chrome-ticker-dot"></span>LHX
          </span>
          <span className="chrome-name">L3Harris Technologies</span>
        </div>
        <span className="chrome-label">Recap · FY '25</span>
      </div>
      <div className="chrome-progress">
        <div className="chrome-progress-fill" style={{ width: `${progress * 100}%` }}></div>
      </div>
    </div>
  );
}

// ============================================================
// Radar — five-domain SVG with sweep
// ============================================================
function Radar() {
  const ref = useRef(null);
  const [scrollProg, setScrollProg] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // 1 when radar is fully on screen near top
      const t = 1 - Math.min(1, Math.max(0, r.top / vh));
      setScrollProg(t);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Five domains placed around the rings
  const domains = [
    { label: 'AIR',   angle: -90, ring: 1 },
    { label: 'LAND',  angle: -22, ring: 2 },
    { label: 'SEA',   angle: 50,  ring: 3 },
    { label: 'SPACE', angle: 145, ring: 4 },
    { label: 'CYBER', angle: 215, ring: 2.5 },
  ];

  const cx = 200, cy = 200;
  const ringRadii = [50, 90, 130, 170];

  return (
    <div className="hero-radar" ref={ref}>
      <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <radialGradient id="radarFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,122,87,0.18)" />
            <stop offset="60%" stopColor="rgba(255,122,87,0.04)" />
            <stop offset="100%" stopColor="rgba(255,122,87,0)" />
          </radialGradient>
          <linearGradient id="sweepGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,122,87,0)" />
            <stop offset="100%" stopColor="rgba(255,122,87,0.6)" />
          </linearGradient>
        </defs>

        {/* Outer halo */}
        <circle cx={cx} cy={cy} r={185} fill="url(#radarFade)" />

        {/* Concentric rings */}
        {ringRadii.map((r, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={i === ringRadii.length - 1 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}
            strokeWidth="1"
            strokeDasharray={i === 1 ? '2 4' : 'none'}
          />
        ))}

        {/* Crosshairs */}
        <line x1={cx - 185} y1={cy} x2={cx + 185} y2={cy} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1={cx} y1={cy - 185} x2={cx} y2={cy + 185} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Sweep wedge — rotates with scroll */}
        <g style={{
          transform: `rotate(${scrollProg * 360 - 90}deg)`,
          transformOrigin: '200px 200px',
          transition: 'transform 80ms linear'
        }}>
          <path
            d={`M ${cx} ${cy} L ${cx + 170} ${cy} A 170 170 0 0 0 ${cx + 170 * Math.cos(-Math.PI / 4)} ${cy + 170 * Math.sin(-Math.PI / 4)} Z`}
            fill="url(#sweepGrad)"
            opacity="0.7"
          />
          <line x1={cx} y1={cy} x2={cx + 170} y2={cy}
                stroke="#FF7A57" strokeWidth="1.5" opacity="0.85" />
        </g>

        {/* Center mark */}
        <circle cx={cx} cy={cy} r="3" fill="#FF7A57" />
        <circle cx={cx} cy={cy} r="8" fill="none" stroke="rgba(255,122,87,0.4)" strokeWidth="1" />

        {/* Domain blips */}
        {domains.map((d, i) => {
          const r = ringRadii[Math.min(d.ring | 0, ringRadii.length - 1)];
          const rad = (d.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          // Label offset
          const labelR = r + 18;
          const lx = cx + labelR * Math.cos(rad);
          const ly = cy + labelR * Math.sin(rad);
          return (
            <g key={d.label}>
              <circle cx={x} cy={y} r="4" fill="#FF7A57" style={{ animation: `blip 3s ease-in-out infinite ${i * 0.6}s` }} />
              <circle cx={x} cy={y} r="9" fill="none" stroke="rgba(255,122,87,0.35)" strokeWidth="1" />
              <text
                x={lx} y={ly}
                fill="#B8B3A8"
                fontFamily="Geist Mono, monospace"
                fontSize="10"
                letterSpacing="2"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Compass marks */}
        {['N', 'E', 'S', 'W'].map((c, i) => {
          const angle = i * 90 - 90;
          const rad = (angle * Math.PI) / 180;
          const x = cx + 192 * Math.cos(rad);
          const y = cy + 192 * Math.sin(rad);
          return (
            <text key={c} x={x} y={y} fill="#54534E" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="2" textAnchor="middle" dominantBaseline="middle">{c}</text>
          );
        })}
      </svg>
    </div>
  );
}

// ============================================================
// Hero
// ============================================================
function Hero() {
  return (
    <section className="hero">
      <div className="hero-meta">
        <span className="eyebrow"><span className="bar"></span>Thesis · 01</span>
        <span className="mono">NYSE · MELBOURNE, FL</span>
      </div>

      <Radar />

      <h1 className="hero-headline">
        Five domains.<br/>One <em>contractor.</em>
      </h1>
      <p className="hero-sub">
        Air, land, sea, space, cyber. L3Harris builds <em>mission-critical</em> systems for whichever flag is paying — across more than 100 countries, on contracts already signed.
      </p>

      <div className="hero-readouts">
        <div className="hero-readout">
          <div className="hero-readout-label">Market cap</div>
          <div className="hero-readout-value">$65.44<span className="small-unit">B</span></div>
        </div>
        <div className="hero-readout">
          <div className="hero-readout-label">FY'25 Revenue</div>
          <div className="hero-readout-value">$21.86<span className="small-unit">B</span></div>
        </div>
        <div className="hero-readout">
          <div className="hero-readout-label">Employees</div>
          <div className="hero-readout-value">45,000</div>
        </div>
        <div className="hero-readout">
          <div className="hero-readout-label">Countries</div>
          <div className="hero-readout-value">100+</div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Reset beat
// ============================================================
function ResetBeat({ children, mark = "§" }) {
  return (
    <div className="reset-beat reveal">
      <span className="reset-beat-mark">{mark}</span>
      <div className="reset-beat-quote">{children}</div>
    </div>
  );
}

// ============================================================
// Segments — four signal stacks
// ============================================================
function Segments() {
  const segs = [
    {
      code: "CS · Communication Systems",
      name: "Software-defined comms & EW",
      desc: "Resilient radios, electronic warfare suites, and the encrypted pipes that connect everything else.",
    },
    {
      code: "IMS · Integrated Mission Systems",
      name: "Aircraft & maritime missionization",
      desc: "Sensors, mission computers, and surface-and-submarine platforms — the fight at sea and in the air.",
    },
    {
      code: "SAS · Space & Airborne Systems",
      name: "Classified airborne & space programs",
      desc: "Black-box programs, satellites, and the airborne sensors that don't appear on press releases.",
    },
    {
      code: "AR · Aerojet Rocketdyne",
      name: "Missiles, munitions & propulsion",
      desc: "Solid-rocket motors, hypersonic propulsion, and the ordnance the rest of the portfolio launches.",
    },
  ];

  return (
    <section className="segments">
      <div className="segments-head reveal">
        <span className="eyebrow"><span className="signal">●</span>The business · 02</span>
        <h2 className="display segments-head-display" style={{ fontSize: 38, marginTop: 16 }}>
          Four segments. <em>One customer</em> in chief.
        </h2>
        <p className="body" style={{ marginTop: 14, maxWidth: '40ch' }}>
          The U.S. government writes most of the checks — fixed-price and cost-type contracts on programs that span decades. <em>22 cents</em> of every dollar comes from somewhere else.
        </p>
      </div>

      <div className="segment-stack">
        {segs.map((s, i) => (
          <div key={i} className="segment-row reveal">
            <div className="segment-row-top">
              <span className="segment-code">{s.code}</span>
              <span className="mono" style={{ color: 'var(--lhx-fg-3)' }}>{String(i + 1).padStart(2, '0')}/04</span>
            </div>
            <div className="segment-name">{s.name}</div>
            <div className="segment-desc">{s.desc}</div>
            <div className="segment-bar">
              <div className="segment-bar-fill" style={{ width: `${[78, 88, 70, 60][i]}%`, transitionDelay: `${i * 80}ms` }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Scale — revenue + backlog tower
// ============================================================
function BacklogTower() {
  // A "tower" of contract-stripes building up; height = $38.7B vs $21.86B revenue
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

  // Backlog vs revenue ratio: 38.7 / 21.86 ≈ 1.77 years of work
  const stripes = 22; // representing notional contract lots

  return (
    <div className="backlog-tower" ref={ref}>
      <svg viewBox="0 0 200 280" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="towerFade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#FF7A57" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF7A57" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ground line */}
        <line x1="10" y1="270" x2="190" y2="270" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <text x="10" y="282" fill="#54534E" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="1.5">$0</text>

        {/* Revenue mark — at 56.5% (21.86 / 38.7 = 56.5%) */}
        <line x1="10" y1="156" x2="190" y2="156" stroke="rgba(255,255,255,0.25)" strokeDasharray="2 3" strokeWidth="1" />
        <text x="14" y="152" fill="#B8B3A8" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1">REVENUE · $21.86B</text>

        {/* Top mark — backlog */}
        <line x1="10" y1="20" x2="190" y2="20" stroke="rgba(255,122,87,0.6)" strokeDasharray="2 3" strokeWidth="1" />
        <text x="14" y="14" fill="#FF7A57" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1">BACKLOG · $38.7B</text>

        {/* Stripes — animated build */}
        {Array.from({ length: stripes }).map((_, i) => {
          const y = 268 - i * 11;
          const isRevenue = i < Math.round(stripes * 0.565);
          return (
            <rect
              key={i}
              x={50 + (i % 2) * 4}
              y={y}
              width={100 - (i % 3) * 6}
              height="6"
              fill={isRevenue ? "rgba(255,122,87,0.35)" : "url(#towerFade)"}
              opacity={show ? 1 : 0}
              style={{ transition: `opacity 600ms var(--ease-out) ${i * 50}ms` }}
            />
          );
        })}

        {/* Multiplier label */}
        <text x="170" y="100" fill="#FF7A57" fontFamily="Instrument Serif, serif" fontSize="22" fontStyle="italic" textAnchor="end">
          1.77×
        </text>
        <text x="170" y="115" fill="#7C7A73" fontFamily="Geist Mono, monospace" fontSize="7" letterSpacing="1.5" textAnchor="end">
          YEARS BOOKED
        </text>
      </svg>
    </div>
  );
}

function Scale() {
  return (
    <section className="scale">
      <div className="scale-head reveal">
        <span className="eyebrow"><span className="signal">●</span>The scale · 03</span>
      </div>
      <div className="reveal">
        <div className="scale-figure">
          <em>$21.86</em><span className="scale-figure-unit">B</span>
        </div>
        <div className="scale-caption">
          FY2025 revenue, earned predominantly under U.S. government contracts. Q4 alone landed <em>$5.65B</em> with non-GAAP diluted EPS of $2.86.
        </div>
      </div>

      <div className="backlog-wrap reveal">
        <span className="eyebrow" style={{ marginBottom: 12, display: 'block' }}>
          <span className="phosphor">●</span>The backlog
        </span>
        <div className="backlog-row">
          <BacklogTower />
          <div>
            <div className="backlog-stat"><em>$38.7</em><span className="backlog-stat-unit">B</span></div>
            <div className="backlog-stat-label">Contracted backlog · FYE'25</div>
            <div className="body" style={{ marginTop: 18, fontSize: 13 }}>
              Nearly <em>two years</em> of revenue already on the books before the calendar even turns.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.LHXModule1 = { Chrome, Hero, ResetBeat, Segments, Scale };

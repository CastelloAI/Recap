// SVG metaphor scenes for the Visa recap

// ===== Hero scene: a single card and the network arcs flowing from it =====
const HeroScene = () => {
  const ref = React.useRef(null);
  const [t, setT] = React.useState(0); // 0..1 scroll-tied "flow"

  React.useEffect(() => {
    const handler = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when fully below, 1 when its top has passed -50px
      const p = Math.max(0, Math.min(1, 1 - (r.top + r.height * 0.4) / vh));
      setT(p);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // 6 arcs, each "fires" at increasing offsets
  const arcs = [
    { d: "M 186 200 C 120 220, 60 240, 30 300", delay: 0 },
    { d: "M 186 200 C 140 240, 100 290, 70 360", delay: 0.08 },
    { d: "M 186 200 C 200 250, 220 320, 240 380", delay: 0.16 },
    { d: "M 186 200 C 240 230, 290 250, 340 280", delay: 0.04 },
    { d: "M 186 200 C 240 240, 270 310, 300 380", delay: 0.20 },
    { d: "M 186 200 C 160 250, 120 310, 80 360", delay: 0.12 },
  ];

  return (
    <svg ref={ref} className="hero-scene" viewBox="0 0 372 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#142A5A"/>
          <stop offset="1" stopColor="#0A1F44"/>
        </linearGradient>
        <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F7B600"/>
          <stop offset="1" stopColor="#E89F00"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F7B600" stopOpacity="0.5"/>
          <stop offset="1" stopColor="#F7B600" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Background dots faintly suggesting the global network */}
      {[...Array(40)].map((_, i) => {
        const cx = (i * 53) % 372;
        const cy = ((i * 37) % 380) + 10;
        return <circle key={i} cx={cx} cy={cy} r="1" fill="#0A1F44" opacity="0.06"/>;
      })}

      {/* Glow behind card */}
      <ellipse cx="186" cy="170" rx="120" ry="70" fill="url(#glow)" opacity={0.3 + t*0.5}/>

      {/* The arcs — flow outward as scroll progresses */}
      {arcs.map((a, i) => {
        const local = Math.max(0, Math.min(1, (t - a.delay) * 1.6));
        return (
          <g key={i}>
            <path d={a.d} fill="none" stroke="#0A1F44" strokeOpacity="0.12" strokeWidth="1"/>
            <path
              d={a.d}
              fill="none"
              stroke="url(#goldG)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="200 400"
              strokeDashoffset={200 - local * 200}
              opacity={local > 0 ? 1 : 0}
            />
          </g>
        );
      })}

      {/* Endpoints — merchants, banks, consumers as small dots */}
      {[
        [30,300],[70,360],[240,380],[340,280],[300,380],[80,360]
      ].map((p, i) => {
        const local = Math.max(0, Math.min(1, (t - arcs[i].delay) * 1.6));
        return (
          <g key={i} opacity={local}>
            <circle cx={p[0]} cy={p[1]} r="6" fill="#F4EFE4"/>
            <circle cx={p[0]} cy={p[1]} r="6" fill="none" stroke="#0A1F44" strokeWidth="1.5"/>
            <circle cx={p[0]} cy={p[1]} r="2" fill="#F7B600"/>
          </g>
        );
      })}

      {/* The card — slightly tilts on scroll */}
      <g transform={`translate(186 170) rotate(${-3 + t*4}) translate(-90 -56)`}>
        <rect width="180" height="112" rx="10" fill="url(#cardG)"/>
        <rect x="14" y="20" width="32" height="22" rx="3" fill="#F7B600"/>
        {/* chip lines */}
        <line x1="20" y1="26" x2="40" y2="26" stroke="#0A1F44" strokeOpacity="0.25"/>
        <line x1="20" y1="32" x2="40" y2="32" stroke="#0A1F44" strokeOpacity="0.25"/>
        <line x1="20" y1="38" x2="40" y2="38" stroke="#0A1F44" strokeOpacity="0.25"/>
        {/* number */}
        <text x="14" y="74" fill="#F4EFE4" opacity="0.9" fontFamily="Geist Mono, monospace" fontSize="11" letterSpacing="2">4716 ···· ···· ···· </text>
        <text x="14" y="98" fill="#F4EFE4" opacity="0.55" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="1.5">VISANET · WORLDWIDE</text>
        {/* gold V swoosh */}
        <path d="M 130 14 L 168 14 L 152 100 L 138 100 Z" fill="#F7B600" opacity="0.92"/>
      </g>
    </svg>
  );
};

// ===== Network beat: a clean four-sided diagram =====
const NetworkScene = () => {
  return (
    <svg className="network-art art" viewBox="0 0 372 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#F7B600"/>
        </marker>
      </defs>
      {/* Center: VisaNet */}
      <g>
        <circle cx="186" cy="140" r="46" fill="#0A1F44"/>
        <circle cx="186" cy="140" r="46" fill="none" stroke="#F7B600" strokeWidth="1" opacity="0.6"/>
        <text x="186" y="136" textAnchor="middle" fill="#F4EFE4" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="18">VisaNet</text>
        <text x="186" y="152" textAnchor="middle" fill="#F7B600" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="2">FOUR-SIDED</text>
      </g>

      {/* Four nodes */}
      {[
        { x: 50, y: 50, lbl: 'CONSUMERS', sub: '4.7B+ cards' },
        { x: 322, y: 50, lbl: 'MERCHANTS', sub: 'global reach' },
        { x: 50, y: 230, lbl: 'BANKS', sub: 'issuers / acquirers' },
        { x: 322, y: 230, lbl: 'GOVERNMENTS', sub: 'rails + compliance' },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="22" fill="#F4EFE4" stroke="#0A1F44" strokeWidth="1.2"/>
          <circle cx={n.x} cy={n.y} r="3" fill="#0A1F44"/>
          <text x={n.x} y={n.y + (n.y < 140 ? -32 : 40)} textAnchor="middle"
                fill="#0A1F44" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.5">
            {n.lbl}
          </text>
          <text x={n.x} y={n.y + (n.y < 140 ? -20 : 52)} textAnchor="middle"
                fill="#5A6A88" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="11">
            {n.sub}
          </text>
        </g>
      ))}

      {/* Lines from each node into Visa */}
      {[[72,72],[300,72],[72,208],[300,208]].map((p, i) => {
        const x2 = 186, y2 = 140;
        const dx = x2 - p[0], dy = y2 - p[1];
        const len = Math.sqrt(dx*dx + dy*dy);
        const ex = p[0] + dx * (len - 48) / len;
        const ey = p[1] + dy * (len - 48) / len;
        return <line key={i} x1={p[0]} y1={p[1]} x2={ex} y2={ey} stroke="#F7B600" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 3"/>;
      })}
    </svg>
  );
};

// ===== Globe scene for geography =====
const GeoGlobe = ({ data, colors }) => {
  // Render arcs of a donut where each arc is a region
  const total = data.reduce((s, d) => s + d.pct, 0);
  let acc = 0;
  const r = 110, cx = 140, cy = 140;
  const innerR = 70;

  return (
    <svg className="geo-globe" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="globeGrad" cx="0.4" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#F4EFE4"/>
          <stop offset="1" stopColor="#E2D9C2"/>
        </radialGradient>
      </defs>
      {/* Globe sphere */}
      <circle cx={cx} cy={cy} r={innerR - 4} fill="url(#globeGrad)" stroke="#0A1F44" strokeOpacity="0.18"/>
      {/* Latitude lines */}
      {[0.3, 0.55, 0.8].map((p, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={innerR - 4} ry={(innerR - 4) * p} fill="none" stroke="#0A1F44" strokeOpacity="0.1"/>
      ))}
      {/* Longitude */}
      {[0.3, 0.6, 1].map((p, i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={(innerR - 4) * p} ry={innerR - 4} fill="none" stroke="#0A1F44" strokeOpacity="0.1"/>
      ))}

      {/* Donut arcs */}
      {data.map((d, i) => {
        const start = (acc / total) * Math.PI * 2 - Math.PI/2;
        acc += d.pct;
        const end = (acc / total) * Math.PI * 2 - Math.PI/2;
        const large = (end - start) > Math.PI ? 1 : 0;
        const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
        const x3 = cx + (innerR + 6) * Math.cos(end), y3 = cy + (innerR + 6) * Math.sin(end);
        const x4 = cx + (innerR + 6) * Math.cos(start), y4 = cy + (innerR + 6) * Math.sin(start);
        const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR + 6} ${innerR + 6} 0 ${large} 0 ${x4} ${y4} Z`;
        return <path key={i} d={path} fill={colors[i]} opacity="0.92"/>;
      })}

      {/* Tick lines from arcs to outside (hint of pin) */}
      {(() => {
        let acc2 = 0;
        return data.map((d, i) => {
          const mid = ((acc2 + d.pct/2) / total) * Math.PI * 2 - Math.PI/2;
          acc2 += d.pct;
          const x1 = cx + (r + 2) * Math.cos(mid);
          const y1 = cy + (r + 2) * Math.sin(mid);
          const x2 = cx + (r + 14) * Math.cos(mid);
          const y2 = cy + (r + 14) * Math.sin(mid);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[i]} strokeWidth="1.5"/>;
        });
      })()}
    </svg>
  );
};

// ===== The bet: dollar funnel — buybacks vs dividends vs capex =====
const BetScene = () => {
  // numbers from JSON
  // FCF $21.58B → buybacks $18.3B + dividends $4.63B + capex $1.48B
  const total = 24.41; // sum
  const items = [
    { label: 'Buybacks', amt: 18.3, color: '#F7B600' },
    { label: 'Dividends', amt: 4.63, color: '#142A5A' },
    { label: 'Capex', amt: 1.48, color: '#5A6A88' },
  ];

  const totalH = 240;
  let yAcc = 30;

  return (
    <svg className="art" viewBox="0 0 372 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pourG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7B600" stopOpacity="0"/>
          <stop offset="1" stopColor="#F7B600" stopOpacity="0.6"/>
        </linearGradient>
      </defs>

      {/* Source: FCF label */}
      <text x="20" y="22" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="2" fill="#5A6A88">FREE CASH FLOW · $21.58B</text>
      <line x1="20" y1="28" x2="180" y2="28" stroke="#0A1F44" strokeOpacity="0.25"/>

      {/* Stream pouring down */}
      <path d="M 100 30 L 100 80 Q 100 120 186 130 L 186 30 Z" fill="url(#pourG)" opacity="0.4"/>
      <line x1="100" y1="30" x2="100" y2="120" stroke="#F7B600" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="2 3"/>

      {/* Stacked bars on right */}
      {items.map((it, i) => {
        const h = (it.amt / total) * totalH;
        const y = yAcc;
        yAcc += h + 6;
        return (
          <g key={i}>
            <rect x="160" y={y} width="180" height={h} rx="3" fill={it.color} opacity={i === 0 ? 1 : 0.92}/>
            {/* label inside or beside */}
            <text x="172" y={y + 18} fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.5"
                  fill={it.color === '#F7B600' ? '#0A1F44' : '#F4EFE4'}>
              {it.label.toUpperCase()}
            </text>
            <text x="172" y={y + h - 10} fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="22"
                  fill={it.color === '#F7B600' ? '#0A1F44' : '#F4EFE4'}>
              ${it.amt}B
            </text>
          </g>
        );
      })}

      {/* annotation: 95% returned */}
      <line x1="160" y1="280" x2="20" y2="280" stroke="#0A1F44" strokeOpacity="0.2"/>
      <text x="20" y="298" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="2" fill="#5A6A88">RETURNED TO HOLDERS</text>
      <text x="20" y="316" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="22" fill="#0A1F44">~$22.9B · <tspan fill="#E89F00">94%</tspan></text>
    </svg>
  );
};

Object.assign(window, { HeroScene, NetworkScene, GeoGlobe, BetScene });

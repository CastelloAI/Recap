/* Bespoke SVG metaphor scenes for the DaVita recap. */

/* ---------- HERO DROPLET ---------- */
function HeroDroplet() {
  // A clinical filtration droplet with internal flow.
  return (
    <svg viewBox="0 0 280 380" className="droplet-stage" aria-hidden="true">
      <defs>
        <linearGradient id="dropFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9CBEDB" stopOpacity="0.55" />
          <stop offset="1" stopColor="#4A90D9" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="dropShine" cx="0.35" cy="0.3" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <clipPath id="dropClip">
          <path d="M150 20 C 150 80, 240 140, 240 220 C 240 282, 200 330, 150 330 C 100 330, 60 282, 60 220 C 60 140, 150 80, 150 20 Z" />
        </clipPath>
      </defs>
      {/* outline */}
      <g className="anim-pulse">
        <path d="M150 20 C 150 80, 240 140, 240 220 C 240 282, 200 330, 150 330 C 100 330, 60 282, 60 220 C 60 140, 150 80, 150 20 Z"
              fill="url(#dropFill)" />
        <path d="M150 20 C 150 80, 240 140, 240 220 C 240 282, 200 330, 150 330 C 100 330, 60 282, 60 220 C 60 140, 150 80, 150 20 Z"
              fill="url(#dropShine)" />
        {/* internal flow lines (membrane filaments) */}
        <g clipPath="url(#dropClip)" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1" fill="none">
          <path d="M70 140 Q 150 120, 230 140" className="anim-flow" />
          <path d="M60 180 Q 150 162, 240 180" className="anim-flow" style={{animationDelay: '0.3s'}} />
          <path d="M55 220 Q 150 205, 245 220" className="anim-flow" style={{animationDelay: '0.6s'}} />
          <path d="M60 260 Q 150 245, 240 260" className="anim-flow" style={{animationDelay: '0.9s'}} />
          <path d="M75 296 Q 150 282, 225 296" className="anim-flow" style={{animationDelay: '1.2s'}} />
        </g>
        {/* outer hairline */}
        <path d="M150 20 C 150 80, 240 140, 240 220 C 240 282, 200 330, 150 330 C 100 330, 60 282, 60 220 C 60 140, 150 80, 150 20 Z"
              fill="none" stroke="#275689" strokeOpacity="0.35" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* ---------- BUSINESS BEAT — DIALYSIS CYCLE ---------- */
function CycleScene() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.15, end: 0.7 });
  // p drives a "particle" traveling through the circuit
  const W = 360, H = 380;
  // Path keypoints (patient → out → filter → in → patient)
  const pathD = "M180 80 C 240 80 270 110 270 160 C 270 210 230 240 180 240 C 130 240 90 210 90 160 C 90 110 120 80 180 80 Z";
  // Filter is a vertical column on the right
  return (
    <div ref={ref} className="cycle-stage">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <linearGradient id="filterFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EAF1F7" />
            <stop offset="1" stopColor="#C9DCEC" />
          </linearGradient>
          <linearGradient id="bloodLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C84B2E" />
            <stop offset="1" stopColor="#8E2A18" />
          </linearGradient>
        </defs>

        {/* Patient (abstract figure — rounded rectangle "body") */}
        <g>
          <rect x="40" y="60" width="80" height="200" rx="40" fill="#EFEBE0" stroke="#DDD7C7" />
          <circle cx="80" cy="50" r="18" fill="#EFEBE0" stroke="#DDD7C7" />
          <text x="80" y="290" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#6E737B">PATIENT</text>
        </g>

        {/* Filter column */}
        <g transform="translate(240,40)">
          <rect x="0" y="0" width="60" height="240" rx="6" fill="url(#filterFill)" stroke="#9CBEDB" />
          {/* membrane lines inside filter */}
          {Array.from({length: 18}).map((_, i) => (
            <line key={i} x1="6" y1={14 + i*12} x2="54" y2={14 + i*12}
                  stroke="#4A90D9" strokeOpacity={0.3 + (i%3)*0.1} strokeWidth="1" />
          ))}
          {/* "filtered out" particles inside filter that drift up */}
          {[
            {x: 14, y: 60, d: '0s'},
            {x: 30, y: 110, d: '0.4s'},
            {x: 46, y: 160, d: '0.9s'},
            {x: 22, y: 200, d: '1.3s'},
          ].map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="2" fill="#3A75B5"
                    style={{animation: `drift 2s ease-in-out ${c.d} infinite alternate`, transformBox: 'fill-box', transformOrigin: 'center'}} />
          ))}
          <text x="30" y="262" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#6E737B">FILTER</text>
        </g>

        {/* Outbound line — patient → filter (top) */}
        <path d="M120 100 C 180 100, 220 80, 240 80"
              fill="none" stroke="url(#bloodLine)" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 100 C 180 100, 220 80, 240 80"
              fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"
              strokeDasharray="3 6" className="anim-flow" />

        {/* Return line — filter → patient (bottom) */}
        <path d="M240 240 C 220 240, 180 240, 120 220"
              fill="none" stroke="#4A90D9" strokeWidth="3" strokeLinecap="round" />
        <path d="M240 240 C 220 240, 180 240, 120 220"
              fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"
              strokeDasharray="3 6" className="anim-flow-rev" />

        {/* Cadence beat indicator — 3× per week */}
        <g transform="translate(40, 320)">
          <text x="0" y="0" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#6E737B">3× PER WEEK · FOR LIFE</text>
          <g transform="translate(0, 14)">
            {[0,1,2,3,4,5,6].map(i => {
              const isDialysis = [1,3,5].includes(i);
              return (
                <g key={i} transform={`translate(${i*36}, 0)`}>
                  <circle cx="6" cy="6" r={isDialysis ? 5 : 3}
                          fill={isDialysis ? '#4A90D9' : '#DDD7C7'}
                          className={isDialysis ? 'anim-pulse-soft' : ''}
                          style={isDialysis ? {animationDelay: `${i*0.2}s`} : {}} />
                  <text x="6" y="26" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" fill="#A4A8AE">
                    {['M','T','W','T','F','S','S'][i]}
                  </text>
                </g>
              );
            })}
          </g>
        </g>

        {/* labels */}
        <text x="180" y="68" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" fill="#C84B2E" letterSpacing="1.2">UNFILTERED</text>
        <text x="180" y="220" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" fill="#3A75B5" letterSpacing="1.2">RETURNED</text>
      </svg>
    </div>
  );
}

/* ---------- SCALE BEAT — CONSTELLATION OF CENTERS ---------- */
function ConstellationScene() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.05, end: 0.6 });
  // 50 dots representing centers, scaled by reveal progress
  const dots = useMemo(() => {
    const arr = [];
    const seed = (i) => Math.sin(i * 9301 + 49297) * 233280;
    const rand = (i) => (seed(i) - Math.floor(seed(i)));
    for (let i = 0; i < 80; i++) {
      const x = 8 + rand(i) * 84;
      const y = 8 + rand(i + 100) * 84;
      const isIntl = i >= 64; // ~20% intl visual count (88/12 doesn't really map but ~)
      arr.push({ x, y, isIntl, delay: i * 18 });
    }
    return arr;
  }, []);
  return (
    <div ref={ref} className="constellation">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
        {/* faint grid */}
        {Array.from({length: 9}).map((_, i) => (
          <line key={'h'+i} x1="0" y1={i*12.5} x2="100" y2={i*12.5} stroke="#E5DFCF" strokeWidth="0.1" />
        ))}
        {Array.from({length: 9}).map((_, i) => (
          <line key={'v'+i} x1={i*12.5} y1="0" x2={i*12.5} y2="100" stroke="#E5DFCF" strokeWidth="0.1" />
        ))}
        {dots.map((d, i) => {
          const reveal = clamp01(p * 1.4 - i / dots.length);
          return (
            <g key={i} opacity={reveal} transform={`translate(${d.x}, ${d.y})`}>
              <circle r={d.isIntl ? 0.6 : 0.9} fill={d.isIntl ? '#E8734A' : '#4A90D9'} />
              {!d.isIntl && reveal > 0.5 && (
                <circle r="2" fill="none" stroke="#4A90D9" strokeOpacity={0.2 * reveal} strokeWidth="0.15" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- COSTS — FILTRATION COLUMN ---------- */
function CostsColumn({ costs }) {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.05, end: 0.55 });
  // Stacked column — revenue enters top, costs filter out by hue, residue exits.
  const W = 160, H = 360;
  const totalPct = costs.reduce((s, c) => s + c.pct, 0);
  const residue = 100 - totalPct;
  let y = 30;
  const segs = costs.map((c) => {
    const h = (c.pct / 100) * 240 * Math.min(1, p * 1.2);
    const seg = { ...c, y, h };
    y += (c.pct / 100) * 240;
    return seg;
  });
  const residueY = 30 + 240 * Math.min(1, p * 1.2);
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="costs-svg-wrap" preserveAspectRatio="xMidYMid meet">
      {/* "Revenue in" label */}
      <text x={W/2} y="14" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" letterSpacing="1.5" fill="#6E737B">$13.64B IN</text>
      {/* funnel into column */}
      <path d={`M 30 22 L ${W-30} 22 L ${W-40} 30 L 40 30 Z`} fill="#EFEBE0" stroke="#DDD7C7" strokeWidth="0.5" />
      {/* column container */}
      <rect x="40" y="30" width={W-80} height="240" fill="#FBFAF7" stroke="#DDD7C7" strokeWidth="0.5" />
      {/* membrane gridlines */}
      {Array.from({length: 12}).map((_, i) => (
        <line key={i} x1="40" y1={36 + i*20} x2={W-40} y2={36 + i*20} stroke="#4A90D9" strokeOpacity="0.08" strokeWidth="0.5" />
      ))}
      {/* segments */}
      {segs.map((s, i) => (
        <g key={i}>
          <rect x="40" y={s.y} width={W-80} height={s.h} fill={s.color} opacity="0.92" />
          {/* connector tick to legend right */}
          <line x1={W-40} y1={s.y + s.h/2} x2={W-30} y2={s.y + s.h/2} stroke={s.color} strokeWidth="1" />
          <circle cx={W-28} cy={s.y + s.h/2} r="1.2" fill={s.color} />
        </g>
      ))}
      {/* residue line */}
      <line x1="40" y1={residueY} x2={W-40} y2={residueY} stroke="#14171C" strokeWidth="1" strokeDasharray="2 2" opacity={p > 0.6 ? 1 : 0} style={{transition: 'opacity 400ms'}} />
      {/* outflow at bottom — what survives */}
      <path d={`M 40 270 L ${W-40} 270 L ${W/2 + 14} 286 L ${W/2 - 14} 286 Z`} fill="#EFEBE0" stroke="#DDD7C7" strokeWidth="0.5" />
      <rect x={W/2 - 14} y="286" width="28" height="40" fill="#14171C" opacity={Math.min(1, p * 1.5)} />
      <text x={W/2} y="340" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" letterSpacing="1.5" fill="#14171C">{residue}¢ ON $1</text>
      <text x={W/2} y="352" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="7" letterSpacing="1.2" fill="#6E737B">OPERATING</text>
    </svg>
  );
}

/* ---------- PAYER SPLIT ---------- */
function PayerSplitScene() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.1, end: 0.6 });
  // Two streams converging — 68% gov + 32% commercial — but commercial reservoir is what fills the profit basin.
  const W = 360, H = 280;
  const flow = Math.min(1, p * 1.3);
  return (
    <div ref={ref} className="payer-stage">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <linearGradient id="govStream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9CBEDB" />
            <stop offset="1" stopColor="#4A90D9" />
          </linearGradient>
          <linearGradient id="commStream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFB098" />
            <stop offset="1" stopColor="#C84B2E" />
          </linearGradient>
        </defs>

        {/* Top labels */}
        <text x="80" y="20" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#6E737B">GOVERNMENT</text>
        <text x="80" y="34" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="22" fill="#14171C">68%</text>

        <text x="280" y="20" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#C84B2E">COMMERCIAL</text>
        <text x="280" y="34" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="22" fontStyle="italic" fill="#C84B2E">32%</text>

        {/* Streams pour down — width represents revenue share */}
        <path d={`M 50 50 L 110 50 L 200 ${130} L 160 ${130} Z`} fill="url(#govStream)" opacity={flow} />
        <path d={`M 250 50 L 310 50 L 220 ${130} L 200 ${130} Z`} fill="url(#commStream)" opacity={flow} />

        {/* Reservoir basin at midpoint */}
        <rect x="60" y="130" width="240" height="14" fill="#EFEBE0" stroke="#DDD7C7" strokeWidth="0.5" />
        <text x="180" y="124" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" letterSpacing="1.5" fill="#6E737B">REVENUE · $13.64B</text>

        {/* Profit funnel — narrows down to a basin labeled PROFIT */}
        <path d={`M 60 144 L 300 144 L 220 200 L 140 200 Z`} fill="#EFEBE0" stroke="#DDD7C7" strokeWidth="0.5" />

        {/* The commercial slice continues down through the funnel — it's "almost all profit" */}
        <path d={`M 200 144 L 300 144 L 220 200 L 200 200 Z`} fill="url(#commStream)" opacity={flow * 0.9} />
        {/* tiny gov drop into profit */}
        <path d={`M 140 200 L 200 200 L 200 144 L 195 144 Z`} fill="url(#govStream)" opacity={flow * 0.5} />

        {/* Profit basin */}
        <rect x="140" y="200" width="80" height="22" fill="#14171C" opacity={flow} />
        <text x="180" y="216" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" letterSpacing="1.5" fill="#F5F2EA" opacity={flow}>PROFIT</text>

        {/* Annotation */}
        <text x="180" y="248" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="14" fontStyle="italic" fill="#3A3F47">
          <tspan>Commercial pays </tspan>
          <tspan fill="#C84B2E">nearly all</tspan>
          <tspan> of the profit.</tspan>
        </text>
        <text x="180" y="268" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" letterSpacing="1.5" fill="#A4A8AE">68% PAYS THE BILLS · 32% PAYS THE SHAREHOLDERS</text>
      </svg>
    </div>
  );
}

/* ---------- FOOTPRINT ---------- */
function FootprintScene() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.05, end: 0.55 });
  // Two abstract continents as pill-shaped blobs, with center counts inside.
  const fill = Math.min(1, p * 1.3);
  return (
    <div ref={ref} className="footprint-stage">
      <svg viewBox="0 0 360 320" width="100%" height="100%">
        <defs>
          <pattern id="dots-us" patternUnits="userSpaceOnUse" width="6" height="6">
            <circle cx="3" cy="3" r="0.7" fill="#4A90D9" />
          </pattern>
          <pattern id="dots-intl" patternUnits="userSpaceOnUse" width="8" height="8">
            <circle cx="4" cy="4" r="0.7" fill="#E8734A" />
          </pattern>
        </defs>

        {/* "US" — large dotted shape on left */}
        <g opacity={fill}>
          <path d="M 20 80 C 40 60, 100 50, 160 60 C 200 66, 220 100, 220 150 C 220 200, 180 220, 130 220 C 80 220, 30 200, 20 160 Z"
                fill="url(#dots-us)" stroke="#9CBEDB" strokeOpacity="0.5" strokeWidth="0.5" />
          <text x="120" y="135" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="42" fill="#14171C">2,657</text>
          <text x="120" y="156" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#3A3F47">CENTERS · UNITED STATES</text>
          <text x="120" y="174" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="14" fontStyle="italic" fill="#3A75B5">~200,500 patients</text>
        </g>

        {/* "International" — smaller scattered shape on right */}
        <g opacity={fill}>
          <path d="M 240 100 C 260 88, 320 84, 340 110 C 350 130, 340 170, 310 180 C 280 190, 240 175, 232 150 C 226 130, 230 110, 240 100 Z"
                fill="url(#dots-intl)" stroke="#E8B198" strokeOpacity="0.7" strokeWidth="0.5" />
          <text x="290" y="138" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="22" fill="#14171C">585</text>
          <text x="290" y="152" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="7" letterSpacing="1" fill="#3A3F47">CENTERS · 14 COUNTRIES</text>
          <text x="290" y="166" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="10" fontStyle="italic" fill="#A7311A">94,500 patients</text>
        </g>

        {/* Connector — hairline dashed */}
        <line x1="218" y1="148" x2="232" y2="140" stroke="#A4A8AE" strokeWidth="0.5" strokeDasharray="2 2" />

        {/* Bottom split bar */}
        <g transform="translate(20, 250)">
          <rect x="0" y="0" width={320 * 0.88 * fill} height="14" fill="#4A90D9" />
          <rect x={320 * 0.88 * fill} y="0" width={320 * 0.12 * fill} height="14" fill="#E8734A" />
          <text x="0" y="-6" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#3A75B5">88% US</text>
          <text x="320" y="-6" textAnchor="end" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#A7311A">12% INTL</text>
          <text x="160" y="32" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontSize="13" fill="#6E737B">Revenue by region</text>
        </g>
      </svg>
    </div>
  );
}

/* ---------- THE BET — NEGATIVE EQUITY ---------- */
function EquityScene() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.1, end: 0.7 });
  // A balance scale that tips below zero; debt outweighs assets.
  const W = 360, H = 320;
  // Show stack of buybacks pushing the equity line below zero.
  const buybackHeight = Math.min(1, p * 1.5) * 110; // pushes down
  const debtHeight = Math.min(1, p * 1.4) * 140;
  return (
    <div ref={ref} className="bet-equity-stage">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        {/* zero line */}
        <line x1="20" y1="160" x2={W-20} y2="160" stroke="rgba(244,242,237,0.4)" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="24" y="156" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="rgba(244,242,237,0.5)">ZERO EQUITY</text>

        {/* Above the line: a thin stack representing what equity should look like (it doesn't exist) */}
        <g>
          <rect x="60" y={160 - 2} width="120" height="2" fill="rgba(244,242,237,0.2)" />
          <text x="60" y="148" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="rgba(244,242,237,0.5)">EQUITY EXPECTED</text>
        </g>

        {/* Below the line: equity sinks because of buybacks. */}
        <rect x="60" y="160" width="120" height={buybackHeight} fill="#FF8A6A" opacity="0.92" />
        <text x="120" y={160 + buybackHeight + 14} textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#FFB098">BUYBACKS · -$1.8B '25</text>
        <text x="120" y={160 + buybackHeight - 8} textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="22" fontStyle="italic" fill="#F5F2EA">-$651M</text>
        <text x="120" y={160 + buybackHeight + 4} textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="7" letterSpacing="1" fill="rgba(244,242,237,0.6)">TOTAL EQUITY</text>

        {/* Debt column on the right */}
        <g>
          <rect x="220" y="60" width="100" height={debtHeight} fill="none" stroke="#FF8A6A" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="220" y={200 - debtHeight + 60} width="100" height={debtHeight} fill="rgba(255,138,106,0.15)" />
          <text x="270" y="48" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#FFB098">LONG-TERM DEBT</text>
          <text x="270" y={200 - debtHeight/2 + 60 + 4} textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="26" fill="#F5F2EA">$10.2B</text>
        </g>

        {/* The pump arrow — buybacks pumping equity down */}
        <g transform="translate(190, 100)">
          <path d="M 0 0 L 0 50 M -6 44 L 0 52 L 6 44" stroke="#FF8A6A" strokeWidth="1.5" fill="none" />
          <text x="6" y="28" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontSize="12" fill="#FFB098">pumped</text>
        </g>
      </svg>
    </div>
  );
}

/* ---------- COMPETITORS ---------- */
function CompetitorsList({ companies }) {
  const [open, setOpen] = useState(null);
  const max = Math.max(...companies.map(c => c.mcap || 0));
  return (
    <div className="competitors-list">
      {companies.map((c, i) => {
        const isOpen = open === i;
        const pct = c.mcap ? (c.mcap / max) * 100 : 30;
        return (
          <div key={i} className="comp-row" onClick={() => setOpen(isOpen ? null : i)}>
            <div className="comp-head">
              <span className="comp-ticker">{c.ticker}</span>
              <span className="comp-name">{c.name}</span>
              <span className="comp-mcap">
                {c.mcap ? `$${c.mcap.toFixed(2)}` : '—'}
                <span className="small">{c.mcap ? 'B mcap' : ''}</span>
              </span>
            </div>
            <div className="comp-bar">
              <div className={'fill' + (c.isDva ? ' dva' : '')} style={{ width: pct + '%' }} />
            </div>
            <div className="comp-tag">{c.tag}</div>
            <div className="comp-detail" style={{ maxHeight: isOpen ? 240 : 0 }}>
              <div className="inner">
                {c.description}
                {c.stats && (
                  <div className="stats">
                    {c.stats.map((s, j) => (
                      <div key={j} className="s">
                        <div className="v">{s.v}</div>
                        <div className="l">{s.l}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- CLOSE — THE FILTER THAT FILTERS ITSELF ---------- */
function CloseScene() {
  const ref = useRef(null);
  const p = useScrollProgress(ref, { start: 0.1, end: 0.7 });
  const fill = Math.min(1, p * 1.3);
  return (
    <div ref={ref} className="close-stage">
      <svg viewBox="0 0 360 220" width="100%" height="100%">
        {/* A small inverted droplet — what survives */}
        <defs>
          <linearGradient id="closeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4A90D9" stopOpacity="0.6" />
            <stop offset="1" stopColor="#275689" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {/* The dollar arriving at the top */}
        <text x="180" y="22" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="10" letterSpacing="1.6" fill="#6E737B">A DOLLAR IN</text>
        <line x1="160" y1="32" x2="200" y2="32" stroke="#14171C" strokeWidth="1" />
        {/* Falling drops representing each cost being filtered out */}
        {[
          {pct: 68, color: '#4A90D9', label: 'Care', x: 60},
          {pct: 9,  color: '#E8734A', label: 'G&A',   x: 130},
          {pct: 4,  color: '#6DBF8A', label: 'D&A',   x: 200},
          {pct: 4,  color: '#B57BCC', label: 'Int',   x: 270},
        ].map((c, i) => {
          const opacity = clamp01(fill * 1.2 - i * 0.15);
          return (
            <g key={i} opacity={opacity}>
              <path d={`M ${c.x} 60 C ${c.x} 70, ${c.x+12} 80, ${c.x+12} 90 C ${c.x+12} 100, ${c.x} 106, ${c.x-6} 100 C ${c.x-12} 95, ${c.x-12} 78, ${c.x} 60 Z`}
                    transform={`translate(${-6}, 0)`}
                    fill={c.color} opacity="0.9" />
              <text x={c.x} y="124" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="8" letterSpacing="1.2" fill="#6E737B">{c.pct}¢ {c.label.toUpperCase()}</text>
            </g>
          );
        })}
        {/* The 15¢ residue at the bottom — survives */}
        <g opacity={fill}>
          <path d="M 180 150 C 180 160, 200 172, 200 184 C 200 196, 188 204, 180 204 C 172 204, 160 196, 160 184 C 160 172, 180 160, 180 150 Z"
                fill="url(#closeFill)" />
          <text x="180" y="190" textAnchor="middle" fontFamily="'Instrument Serif', serif" fontSize="20" fontStyle="italic" fill="#FFFFFF">15¢</text>
        </g>
        <text x="180" y="218" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="9" letterSpacing="1.5" fill="#3A75B5">SURVIVES TO OPERATING INCOME</text>
      </svg>
    </div>
  );
}

Object.assign(window, {
  HeroDroplet, CycleScene, ConstellationScene, CostsColumn,
  PayerSplitScene, FootprintScene, EquityScene, CompetitorsList, CloseScene,
});

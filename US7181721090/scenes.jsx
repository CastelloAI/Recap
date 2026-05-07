// Bespoke SVG metaphor scenes for the PM recap

// ---------- HERO: smoke trails ----------
function HeroSmoke({ progress = 0 }) {
  // progress 0..1 — how far past hero we've scrolled
  const drift = progress * 60;
  return (
    <svg className="smoke-canvas" viewBox="0 0 320 320" fill="none">
      <defs>
        <radialGradient id="sm1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E04A1F" stopOpacity="0.35"/>
          <stop offset="60%" stopColor="#E04A1F" stopOpacity="0.06"/>
          <stop offset="100%" stopColor="#E04A1F" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="sm2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2E7C8F" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#2E7C8F" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Two slow plumes — combustible (ember) drifting up, smoke-free (teal) drifting up alongside */}
      <g style={{ transform: `translateY(${-drift}px)`, transition: 'transform 200ms linear' }}>
        <circle cx="180" cy="120" r="120" fill="url(#sm1)"/>
        <circle cx="220" cy="80" r="80" fill="url(#sm1)"/>
        <circle cx="140" cy="200" r="100" fill="url(#sm2)"/>
      </g>
    </svg>
  );
}

// ---------- COMBUSTIBLE: lit cigarette burning down ----------
function CigaretteScene({ progress = 0 }) {
  // progress 0..1: how much of the cigarette has burned (capped)
  const p = Math.max(0, Math.min(1, progress));
  const totalLen = 280;       // px length of cig in viewBox
  const burnt = p * totalLen * 0.55;
  const filterX = 16;
  const cigY = 40;
  return (
    <svg viewBox="0 0 380 80" width="100%" height="80" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="cigPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FAF4E6"/>
          <stop offset="100%" stopColor="#E9DCBE"/>
        </linearGradient>
        <linearGradient id="cigFilter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A35A"/>
          <stop offset="100%" stopColor="#A87B36"/>
        </linearGradient>
        <radialGradient id="ember" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD680"/>
          <stop offset="40%" stopColor="#FF6A20"/>
          <stop offset="100%" stopColor="#9E2B0A"/>
        </radialGradient>
      </defs>
      {/* filter */}
      <rect x={filterX} y={cigY-9} width="60" height="18" rx="3" fill="url(#cigFilter)"/>
      <rect x={filterX+58} y={cigY-9} width="3" height="18" fill="#7A5A26"/>
      {/* paper portion */}
      <rect x={filterX+62} y={cigY-9} width={totalLen} height="18" fill="url(#cigPaper)"/>
      {/* burnt portion overlay */}
      <rect x={filterX+62+totalLen-burnt} y={cigY-9} width={burnt} height="18" fill="#2A2018"/>
      {/* ash flecks */}
      {[...Array(6)].map((_,i) => (
        <circle key={i} cx={filterX+62+totalLen-burnt+8+i*9} cy={cigY-12+(i%2)*22} r={1.2+Math.random()*0.6} fill="#6B6358" opacity="0.6"/>
      ))}
      {/* ember tip */}
      <circle cx={filterX+62+totalLen-burnt} cy={cigY} r="9" fill="url(#ember)"/>
      <circle cx={filterX+62+totalLen-burnt} cy={cigY} r="4" fill="#FFE7B0" opacity="0.9"/>
      {/* smoke wisps */}
      <g opacity={0.5}>
        <path d={`M${filterX+62+totalLen-burnt} ${cigY-12} q -8 -10 0 -22 q 8 -10 -2 -22`}
              stroke="#3A332A" strokeWidth="1.2" fill="none" opacity="0.5"/>
        <path d={`M${filterX+62+totalLen-burnt+6} ${cigY-12} q 6 -8 -2 -18 q -6 -8 4 -18`}
              stroke="#3A332A" strokeWidth="1" fill="none" opacity="0.35"/>
      </g>
    </svg>
  );
}

// ---------- SMOKE-FREE: ZYN pouch + IQOS device side-by-side, glowing ----------
function SmokeFreeScene() {
  return (
    <svg viewBox="0 0 380 80" width="100%" height="80" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="zynCan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5FAFB"/>
          <stop offset="100%" stopColor="#C8DDE2"/>
        </linearGradient>
        <linearGradient id="iqosBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4EFE6"/>
          <stop offset="100%" stopColor="#D4CCB8"/>
        </linearGradient>
        <radialGradient id="iqosGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7AC7D9"/>
          <stop offset="100%" stopColor="#2E7C8F" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* ZYN puck — circular can, side view */}
      <g transform="translate(60, 40)">
        <ellipse cx="0" cy="20" rx="40" ry="6" fill="#A8C6CC" opacity="0.5"/>
        <rect x="-40" y="-14" width="80" height="32" rx="4" fill="url(#zynCan)" stroke="#A8C6CC"/>
        <rect x="-40" y="-4" width="80" height="2" fill="#2E7C8F" opacity="0.5"/>
        <text x="0" y="3" fontFamily="Geist Mono, monospace" fontWeight="500" fontSize="13"
              textAnchor="middle" fill="#2E7C8F" letterSpacing="2">ZYN</text>
        <text x="0" y="14" fontFamily="Geist Mono, monospace" fontSize="6"
              textAnchor="middle" fill="#6B6358" letterSpacing="1">NICOTINE POUCHES</text>
      </g>
      {/* IQOS-like device — pen shape */}
      <g transform="translate(240, 40)">
        <circle cx="0" cy="0" r="36" fill="url(#iqosGlow)" opacity="0.6"/>
        <rect x="-50" y="-7" width="100" height="14" rx="7" fill="url(#iqosBody)" stroke="#A8A096"/>
        <rect x="-50" y="-7" width="22" height="14" rx="7" fill="#2E7C8F"/>
        <circle cx="-39" cy="0" r="3" fill="#7AC7D9"/>
        <rect x="44" y="-3" width="8" height="6" rx="1" fill="#3A332A"/>
        <text x="0" y="2.5" fontFamily="Geist Mono, monospace" fontWeight="500" fontSize="7"
              textAnchor="middle" fill="#3A332A" letterSpacing="1">IQOS</text>
      </g>
    </svg>
  );
}

// ---------- DONUT: cost breakdown shaped as a smoldering ring ----------
function CostDonut({ data, progress = 1 }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;
  const sw = 38;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  // Total of given costs
  const totalPct = data.reduce((s, d) => s + d.pct, 0);
  // The "left over" — operating margin etc.
  const leftover = 100 - totalPct;

  const allSegs = [...data, { pct: leftover, color: '#15110C', label: 'Operating profit + other', isMargin: true }];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2DAC8" strokeWidth={sw}/>
      {/* Segments */}
      {allSegs.map((seg, i) => {
        const len = (seg.pct / 100) * circ * progress;
        const offset = (acc / 100) * circ;
        acc += seg.pct;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={seg.isMargin ? sw - 4 : sw}
            strokeDasharray={`${len} ${circ}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            opacity={seg.isMargin ? 0.85 : 1}
            style={{ transition: 'stroke-dasharray 800ms ease-out' }}
          />
        );
      })}
      {/* Tick marks for percent labels */}
      {(() => {
        let t = 0;
        return data.map((seg, i) => {
          const mid = t + seg.pct / 2;
          t += seg.pct;
          const angle = (mid / 100) * 2 * Math.PI - Math.PI / 2;
          const tx = cx + Math.cos(angle) * (r + sw/2 + 12);
          const ty = cy + Math.sin(angle) * (r + sw/2 + 12);
          return (
            <text key={i} x={tx} y={ty}
                  fontFamily="Geist Mono, monospace"
                  fontSize="11"
                  fill="#3A332A"
                  textAnchor="middle"
                  dominantBaseline="middle">
              {seg.pct}
            </text>
          );
        });
      })()}
    </svg>
  );
}

// ---------- GEOGRAPHY: compass with weighted petals ----------
function GeoCompass({ data }) {
  const size = 280;
  const cx = size/2;
  const cy = size/2;
  // Each region is a wedge sized to its pct
  const total = data.reduce((s,d)=>s+d.pct, 0);
  let acc = 0;
  const segs = data.map((d) => {
    const startA = (acc / total) * 2 * Math.PI - Math.PI/2;
    acc += d.pct;
    const endA = (acc / total) * 2 * Math.PI - Math.PI/2;
    const r = 30 + (d.pct / 100) * 240;
    return { ...d, startA, endA, r };
  });

  function arc(startA, endA, r) {
    const x1 = cx + Math.cos(startA) * r;
    const y1 = cy + Math.sin(startA) * r;
    const x2 = cx + Math.cos(endA) * r;
    const y2 = cy + Math.sin(endA) * r;
    const large = endA - startA > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size}>
      <defs>
        <radialGradient id="geoG1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E04A1F" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#E04A1F" stopOpacity="0.35"/>
        </radialGradient>
      </defs>
      {/* concentric rings */}
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <circle key={i} cx={cx} cy={cy} r={30 + p*120} fill="none" stroke="#D9D1BF" strokeDasharray="1 3" strokeWidth="0.5"/>
      ))}
      {/* segments */}
      {segs.map((s, i) => (
        <path key={i} d={arc(s.startA, s.endA, s.r)}
              fill={i === 0 ? '#E04A1F' : i === 1 ? '#F58A66' : i === 2 ? '#2E7C8F' : '#7AB5C2'}
              opacity={0.8}
              stroke="#F4EFE6" strokeWidth="1.5"/>
      ))}
      {/* center cap */}
      <circle cx={cx} cy={cy} r="20" fill="#15110C"/>
      <text x={cx} y={cy-2} fontFamily="Instrument Serif, serif" fontSize="14"
            fill="#F4EFE6" textAnchor="middle">PMI</text>
      <text x={cx} y={cy+10} fontFamily="Geist Mono, monospace" fontSize="6"
            fill="#A39A8C" textAnchor="middle" letterSpacing="1">180 MARKETS</text>
      {/* Pct labels per segment */}
      {segs.map((s, i) => {
        const mid = (s.startA + s.endA) / 2;
        const lr = s.r + 12;
        const tx = cx + Math.cos(mid) * lr;
        const ty = cy + Math.sin(mid) * lr;
        return (
          <text key={i} x={tx} y={ty}
                fontFamily="Instrument Serif, serif"
                fontSize="20"
                fill="#15110C"
                textAnchor="middle"
                dominantBaseline="middle">
            {s.pct}<tspan fontSize="11" fill="#6B6358">%</tspan>
          </text>
        );
      })}
    </svg>
  );
}

Object.assign(window, {
  HeroSmoke, CigaretteScene, SmokeFreeScene, CostDonut, GeoCompass,
});

// Bespoke SVG metaphor scenes for Clorox
const { useRef, useEffect, useState } = React;

/* ============================================================
   HeroBottle — a Clorox-style bleach bottle, scroll-reactive
   The liquid level slowly lowers as the page scrolls (capital
   "draining" — a quiet metaphor for what survives per dollar).
============================================================ */
function HeroBottle({ progress = 0 }) {
  // bottle silhouette in svg
  const fill = 1 - Math.min(1, progress * 1.6); // 1 = full
  const liquidH = 220 * fill;
  const surfaceY = 70 + (220 - liquidH);

  return (
    <svg viewBox="0 0 220 320" width="160" height="232" style={{ display: 'block' }}>
      <defs>
        <clipPath id="bottle-clip">
          {/* bottle body */}
          <path d="M 70 60
                   L 70 50
                   Q 70 38 82 38
                   L 138 38
                   Q 150 38 150 50
                   L 150 60
                   Q 178 70 178 110
                   L 178 270
                   Q 178 296 152 296
                   L 68 296
                   Q 42 296 42 270
                   L 42 110
                   Q 42 70 70 60 Z" />
        </clipPath>
        <linearGradient id="liquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#41C7E5" />
          <stop offset="100%" stopColor="#0A4FA8" />
        </linearGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="110" cy="306" rx="78" ry="6" fill="rgba(10,23,34,0.12)" />

      {/* bottle outer */}
      <path d="M 70 60
               L 70 50
               Q 70 38 82 38
               L 138 38
               Q 150 38 150 50
               L 150 60
               Q 178 70 178 110
               L 178 270
               Q 178 296 152 296
               L 68 296
               Q 42 296 42 270
               L 42 110
               Q 42 70 70 60 Z"
            fill="#FFFFFF" stroke="#0E1722" strokeWidth="2" />

      {/* cap */}
      <rect x="78" y="14" width="64" height="26" rx="4" fill="#0A4FA8" />
      <rect x="80" y="18" width="60" height="3" fill="rgba(255,255,255,0.3)" />

      {/* liquid */}
      <g clipPath="url(#bottle-clip)">
        <rect x="0" y={surfaceY} width="220" height="260" fill="url(#liquid)" />
        {/* gentle wave on surface */}
        <path d={`M 0 ${surfaceY} Q 55 ${surfaceY - 4} 110 ${surfaceY} T 220 ${surfaceY} L 220 ${surfaceY + 8} L 0 ${surfaceY + 8} Z`} fill="rgba(255,255,255,0.2)" />
      </g>

      {/* label */}
      <rect x="58" y="140" width="104" height="92" rx="3" fill="#FFFFFF" stroke="#0E1722" strokeWidth="1.5" />
      <text x="110" y="170" textAnchor="middle"
            fontFamily="Instrument Serif, serif" fontSize="22"
            fill="#0A4FA8" fontStyle="italic">CLX</text>
      <line x1="68" y1="180" x2="152" y2="180" stroke="#0A4FA8" strokeWidth="1" />
      <text x="110" y="198" textAnchor="middle"
            fontFamily="Geist Mono, monospace" fontSize="8"
            letterSpacing="0.18em" fill="#0E1722">FY '25 RECAP</text>
      <text x="110" y="214" textAnchor="middle"
            fontFamily="Geist Mono, monospace" fontSize="7"
            letterSpacing="0.14em" fill="#6A7585">CONSUMER STAPLES · NYSE</text>
      <text x="110" y="226" textAnchor="middle"
            fontFamily="Geist Mono, monospace" fontSize="7"
            letterSpacing="0.14em" fill="#6A7585">EST. 1913 · OAKLAND, CA</text>
    </svg>
  );
}

/* ============================================================
   CostDroplets — five droplets sized by cost % using the
   palette supplied in biggest_costs. The largest is a full
   bleach bottle's worth; the smallest barely registers.
============================================================ */
function CostDroplets({ data, fire }) {
  // total area mapped to pct; render droplets in a horizontal cluster
  // We render a single composite scene where each droplet sits on a "spend line".
  const W = 372, H = 280;
  const max = Math.max(...data.map(d => d.pct));
  const sized = data.map(d => ({
    ...d,
    r: Math.sqrt(d.pct / max) * 70 + 12, // r 12..82
  }));

  // arrange descending across the width
  const sorted = [...sized].sort((a, b) => b.pct - a.pct);
  // x positions: largest on left, then proportional
  let xs = [];
  let cursor = 30;
  sorted.forEach((d, i) => {
    xs.push(cursor + d.r);
    cursor += d.r * 2 + 14;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {sorted.map((d, i) => (
          <linearGradient id={`drop-${i}`} key={i} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={d.color} stopOpacity="0.95"/>
            <stop offset="100%" stopColor={d.color} stopOpacity="1"/>
          </linearGradient>
        ))}
      </defs>

      {/* spend line — the dollar of revenue */}
      <line x1="20" y1="200" x2={W-20} y2="200" stroke="#DCE3EC" strokeWidth="1" />
      <text x="20" y="218" fontFamily="Geist Mono, monospace" fontSize="9"
        letterSpacing="0.14em" fill="#6A7585">$1.00 · IN</text>
      <text x={W-20} y="218" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="9"
        letterSpacing="0.14em" fill="#6A7585">15¢ · OUT</text>

      {sorted.map((d, i) => {
        const cx = xs[i];
        const r = fire ? d.r : 0;
        // teardrop shape
        return (
          <g key={i} style={{ transition: `all 1.0s cubic-bezier(0.22,1,0.36,1) ${i*120}ms` }}>
            <path
              d={`M ${cx} ${200 - r * 1.6}
                  C ${cx + r * 0.9} ${200 - r * 0.6}, ${cx + r} ${200}, ${cx} ${200}
                  C ${cx - r} ${200}, ${cx - r * 0.9} ${200 - r * 0.6}, ${cx} ${200 - r * 1.6} Z`}
              fill={`url(#drop-${i})`}
              stroke={d.color}
              strokeWidth="0.5"
            />
            {/* highlight */}
            <ellipse cx={cx - r*0.25} cy={200 - r*0.85} rx={r*0.18} ry={r*0.32}
              fill="rgba(255,255,255,0.45)" />
            {/* label */}
            <text x={cx} y={200 - r * 1.6 - 10}
                  textAnchor="middle"
                  fontFamily="Instrument Serif, serif"
                  fontSize="22"
                  fill="#0E1722">{d.pct}<tspan fontSize="13">%</tspan></text>
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
   USMap — coarse outline of US with Latin America wedge below.
   Used for geographic_distribution.
============================================================ */
function USMap({ fire }) {
  return (
    <svg viewBox="0 0 372 220" width="100%" style={{ display: 'block' }}>
      {/* US silhouette — coarse, hand-drawn */}
      <path
        d="M 30 60
           L 60 50 L 100 48 L 140 46 L 180 44 L 220 44 L 250 46 L 280 50 L 305 58 L 320 70
           L 330 90 L 332 105 L 326 118 L 320 122 L 314 122 L 312 116 L 306 116 L 300 122
           L 286 124 L 280 120 L 270 124 L 260 122 L 240 124 L 220 124 L 200 122
           L 178 124 L 160 122 L 140 124 L 120 122 L 100 122 L 80 118 L 60 112
           L 44 100 L 36 86 L 30 70 Z"
        fill={fire ? "#0A4FA8" : "#DCE3EC"}
        stroke="#0E1722"
        strokeWidth="1"
        style={{ transition: 'fill 1.0s var(--ease-out)' }}
      />
      {/* Florida bump */}
      <path d="M 270 124 L 274 138 L 278 148 L 282 154 L 280 142 L 276 130 Z"
        fill={fire ? "#0A4FA8" : "#DCE3EC"} stroke="#0E1722" strokeWidth="1"
        style={{ transition: 'fill 1.0s var(--ease-out)' }} />

      {/* Latin America wedge */}
      <path d="M 230 158 L 248 164 L 252 178 L 246 194 L 236 200 L 226 192 L 222 178 L 224 168 Z"
        fill={fire ? "#1E78D5" : "#ECEAE3"} stroke="#0E1722" strokeWidth="1"
        style={{ transition: 'fill 1.0s var(--ease-out) 200ms' }} />

      {/* Rest-of-world arc / dots — abstracted */}
      <g opacity={fire ? 0.6 : 0.3} style={{ transition: 'opacity 0.8s 400ms' }}>
        <circle cx="60" cy="190" r="4" fill="#6FB1E8"/>
        <circle cx="80" cy="200" r="3" fill="#6FB1E8"/>
        <circle cx="350" cy="80"  r="4" fill="#6FB1E8"/>
        <circle cx="346" cy="130" r="3" fill="#6FB1E8"/>
        <circle cx="356" cy="160" r="3" fill="#6FB1E8"/>
      </g>

      {/* labels */}
      <text x="180" y="92" textAnchor="middle" fontFamily="Instrument Serif, serif"
            fontStyle="italic" fontSize="32" fill={fire ? "#FFFFFF" : "#6A7585"}
            style={{ transition: 'fill 0.8s var(--ease-out)' }}>86%</text>
      <text x="180" y="108" textAnchor="middle" fontFamily="Geist Mono, monospace"
            fontSize="8" letterSpacing="0.16em" fill={fire ? "rgba(255,255,255,0.85)" : "#6A7585"}
            style={{ transition: 'fill 0.8s var(--ease-out)' }}>UNITED STATES</text>

      <text x="240" y="180" fontFamily="Instrument Serif, serif" fontSize="14" fill="#0E1722">8%</text>
      <text x="240" y="190" fontFamily="Geist Mono, monospace" fontSize="7"
            letterSpacing="0.12em" fill="#6A7585">LATIN AM.</text>

      <text x="340" y="60" textAnchor="end" fontFamily="Instrument Serif, serif" fontSize="14" fill="#0E1722">6%</text>
      <text x="340" y="70" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="7"
            letterSpacing="0.12em" fill="#6A7585">REST OF WORLD</text>
    </svg>
  );
}

/* ============================================================
   ScaleBalance — debt vs equity scale (the dark "weight" beat)
   Pan tilts based on the weight ratio.
============================================================ */
function ScaleBalance({ fire }) {
  // debt 2480, equity 321  → ratio 7.7:1
  // tilt scale visually but cap it at -22 deg
  const tilt = fire ? -22 : 0;

  return (
    <svg viewBox="0 0 360 240" width="100%" style={{ display: 'block' }}>
      {/* base */}
      <rect x="160" y="200" width="40" height="20" fill="#1A2330" />
      <rect x="140" y="220" width="80" height="6" fill="#1A2330" />
      {/* post */}
      <rect x="178" y="50" width="4" height="160" fill="#41C7E5" />

      {/* fulcrum (tilting beam) */}
      <g transform={`rotate(${tilt} 180 60)`} style={{ transition: 'transform 1.6s cubic-bezier(0.22,1,0.36,1)' }}>
        {/* beam */}
        <rect x="40" y="56" width="280" height="4" rx="2" fill="#41C7E5" />
        {/* left chains */}
        <line x1="70" y1="60" x2="70" y2="100" stroke="#41C7E5" strokeWidth="1" />
        <line x1="70" y1="100" x2="50" y2="115" stroke="#41C7E5" strokeWidth="1" />
        <line x1="70" y1="100" x2="90" y2="115" stroke="#41C7E5" strokeWidth="1" />
        {/* left pan — DEBT (heavy) */}
        <path d="M 30 115 L 110 115 L 100 165 L 40 165 Z" fill="#1A2330" stroke="#41C7E5" strokeWidth="1"/>
        <text x="70" y="148" textAnchor="middle"
              fontFamily="Instrument Serif, serif" fontStyle="italic"
              fontSize="26" fill="#FFFFFF">$2.48B</text>

        {/* right chains */}
        <line x1="290" y1="60" x2="290" y2="100" stroke="#41C7E5" strokeWidth="1" />
        <line x1="290" y1="100" x2="270" y2="115" stroke="#41C7E5" strokeWidth="1" />
        <line x1="290" y1="100" x2="310" y2="115" stroke="#41C7E5" strokeWidth="1" />
        {/* right pan — EQUITY (light) */}
        <path d="M 250 115 L 330 115 L 320 145 L 260 145 Z" fill="#1A2330" stroke="#41C7E5" strokeWidth="1"/>
        <text x="290" y="135" textAnchor="middle"
              fontFamily="Instrument Serif, serif" fontStyle="italic"
              fontSize="16" fill="#FFFFFF">$321M</text>
      </g>

      {/* labels under */}
      <text x="70" y="195" textAnchor="middle" fontFamily="Geist Mono, monospace"
            fontSize="9" letterSpacing="0.16em" fill="#8C95A4">DEBT</text>
      <text x="290" y="195" textAnchor="middle" fontFamily="Geist Mono, monospace"
            fontSize="9" letterSpacing="0.16em" fill="#8C95A4">EQUITY</text>
    </svg>
  );
}

/* ============================================================
   DollarHundredCents — 100 dots, 11 of them lit (net income).
   Used at the closing.
============================================================ */
function DollarHundredCents({ fire }) {
  // Net income margin = 810 / 7100 = 11.4% → light 11 of 100
  const lit = 11;
  const cells = Array.from({ length: 100 });
  return (
    <svg viewBox="0 0 372 200" width="100%" style={{ display: 'block' }}>
      {cells.map((_, i) => {
        const col = i % 20;
        const row = Math.floor(i / 20);
        const cx = 14 + col * 18;
        const cy = 16 + row * 30;
        const isLit = i < lit;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r="6"
            fill={fire && isLit ? "#0A4FA8" : "#ECEAE3"}
            style={{ transition: `fill 0.8s var(--ease-out) ${i * 24}ms` }}
          />
        );
      })}
    </svg>
  );
}

Object.assign(window, { HeroBottle, CostDroplets, USMap, ScaleBalance, DollarHundredCents });

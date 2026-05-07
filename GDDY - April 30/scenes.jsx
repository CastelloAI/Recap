// SVG metaphor scenes for GDDY recap.
// All hand-built. No imported chart libraries.

const { useRef: _useRef } = React;

// =========================================================
// HERO — "typed domains" backdrop
// A column of monospace domain entries that slowly drift up,
// like a registry log. Each row composed: pre + name + tld
// =========================================================
function HeroTypedBackdrop({ y = 0 }) {
  const domains = [
    ["acme-supply", "com"],
    ["mira.bakery", "shop"],
    ["northcreek-realestate", "com"],
    ["lightandshadow", "studio"],
    ["bluefoxcoffee", "co"],
    ["hayashi-dental", "com"],
    ["kestrel-design", "co"],
    ["thecorrigan", "family"],
    ["pivotal-yoga", "com"],
    ["margauxlabs", "ai"],
    ["fern-and-ivy", "shop"],
    ["sevenbridges-cap", "com"],
    ["cloudside-rentals", "net"],
    ["theresa-violin", "com"],
    ["wright-roofing", "biz"],
    ["meadowlark-press", "com"],
    ["tabula-cohousing", "org"],
    ["delphi-scheduling", "app"],
    ["foundryandforge", "com"],
    ["kira-illustrates", "studio"],
    ["mwgoods", "store"],
    ["plainspoken", "blog"],
    ["redoak-financial", "com"],
    ["the-otter-bakery", "com"],
    ["parker-and-co", "com"],
  ];
  // y from 0..1 over hero scroll — drift up by translateY
  const drift = y * -180;
  return (
    <div className="hero-typed" aria-hidden="true">
      <div style={{ transform: `translateY(${drift}px)`, transition: 'transform 80ms linear' }}>
        {domains.map(([n, tld], i) => {
          const cls = i % 5 === 0 ? "" : (i % 3 === 0 ? "dim" : "fade");
          return (
            <div key={i} className={`hero-typed-row ${cls}`}>
              <span className="pre">$ register —</span>
              <span className="name">{n}</span>
              <span style={{ color: 'var(--ink-4)' }}>.</span>
              <span className="tld">{tld}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================
// BUSINESS MODEL — TWO PIPES
// Money flows in from the top through two channels (Core / A&C)
// and pools at the bottom into FY25 revenue.
// Scroll progress drives flow length.
// =========================================================
function BusinessPipes({ progress = 0 }) {
  // Two pipes converging into a basin. Animated pulse markers along each.
  const W = 392, H = 380;
  const corePct = 62, acPct = 38;

  // Path for Core (left) and A&C (right): inputs at top, converging to bottom basin
  const coreD = `M 92 22 L 92 180 Q 92 220 132 232 L 196 240`;
  const acD   = `M 300 22 L 300 180 Q 300 220 260 232 L 196 240`;

  const coreLen = 280;
  const acLen = 280;

  // Animated pulse positions
  const pulses = [0.2, 0.55, 0.85];

  return (
    <svg className="pipes-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <linearGradient id="basinGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF7A57" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F25A37" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="coreGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3B3A37" />
          <stop offset="100%" stopColor="#141414" />
        </linearGradient>
        <linearGradient id="acGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF9E82" />
          <stop offset="100%" stopColor="#FF7A57" />
        </linearGradient>
      </defs>

      {/* Top labels */}
      <g fontFamily="Geist Mono, monospace" fontSize="9.5" letterSpacing="1.5">
        <text x="92" y="14" textAnchor="middle" fill="#6B6A65">CORE</text>
        <text x="300" y="14" textAnchor="middle" fill="#6B6A65">A&amp;C</text>
      </g>

      {/* Pipe outlines (background tracks) */}
      <path d={coreD} stroke="#E4E1D9" strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d={acD}   stroke="#E4E1D9" strokeWidth="14" fill="none" strokeLinecap="round" />

      {/* Pipe fills — drawn by progress */}
      <path d={coreD} stroke="url(#coreGrad)" strokeWidth="22" fill="none" strokeLinecap="round"
            strokeDasharray={coreLen} strokeDashoffset={coreLen * (1 - progress)} />
      <path d={acD} stroke="url(#acGrad)" strokeWidth="14" fill="none" strokeLinecap="round"
            strokeDasharray={acLen} strokeDashoffset={acLen * (1 - progress)} />

      {/* % labels on the pipes */}
      <g fontFamily="Instrument Serif, serif" fontStyle="italic">
        <text x="92" y="110" textAnchor="middle" fontSize="34" fill="#FBFAF7" fontWeight="400">62%</text>
        <text x="300" y="110" textAnchor="middle" fontSize="26" fill="#FBFAF7" fontWeight="400">38%</text>
      </g>

      {/* Sub-labels */}
      <g fontFamily="Geist, sans-serif" fontSize="9" letterSpacing="0.5">
        <text x="92" y="148" textAnchor="middle" fill="rgba(251,250,247,0.75)">domains · hosting</text>
        <text x="92" y="160" textAnchor="middle" fill="rgba(251,250,247,0.75)">aftermarket · security</text>
        <text x="300" y="148" textAnchor="middle" fill="rgba(251,250,247,0.85)">websites · email</text>
        <text x="300" y="160" textAnchor="middle" fill="rgba(251,250,247,0.85)">payments · commerce</text>
      </g>

      {/* Growth tags */}
      <g fontFamily="Geist Mono, monospace" fontSize="9" fontWeight="500" letterSpacing="0.5">
        <rect x="62" y="186" width="60" height="16" rx="3" fill="#FFF1EC" />
        <text x="92" y="197" textAnchor="middle" fill="#D6411F">+5% YOY</text>
        <rect x="270" y="186" width="60" height="16" rx="3" fill="#FFF1EC" />
        <text x="300" y="197" textAnchor="middle" fill="#D6411F">+14% YOY</text>
      </g>

      {/* Basin (pool of revenue) */}
      <ellipse cx="196" cy="290" rx="150" ry="40" fill="url(#basinGrad)" opacity={Math.min(1, progress * 1.2)} />
      <ellipse cx="196" cy="278" rx="150" ry="40" fill="#FBFAF7" />
      <ellipse cx="196" cy="278" rx="148" ry="38" fill="none" stroke="#F25A37" strokeWidth="1.2" opacity="0.5" />
      <ellipse cx="196" cy="278" rx="150" ry="40" fill="url(#basinGrad)" opacity={Math.min(1, progress * 1.4)} />

      {/* Basin label */}
      <g fontFamily="Geist Mono, monospace" fontSize="8.5" letterSpacing="1.5">
        <text x="196" y="262" textAnchor="middle" fill="#6B6A65">FY 2025 REVENUE</text>
      </g>
      <g fontFamily="Instrument Serif, serif" fontStyle="italic">
        <text x="196" y="298" textAnchor="middle" fontSize="42" fill="#FBFAF7" fontWeight="400">$4.95B</text>
      </g>

      {/* Pulses along the pipes */}
      {pulses.map((base, i) => {
        const t = (base + progress * 0.6) % 1;
        const cx1 = 92, cx2 = 300;
        // Approximate y along straight section
        const y1 = 22 + t * 200;
        const y2 = 22 + t * 200;
        return (
          <g key={i} opacity={progress > 0.1 ? 1 : 0}>
            <circle cx={cx1} cy={y1} r="2.5" fill="#FF7A57" />
            <circle cx={cx2} cy={y2} r="2" fill="#FFDFD3" />
          </g>
        );
      })}
    </svg>
  );
}

// =========================================================
// COST DOLLAR — 100 cents grid
// Each cent = a 1% slice. Colored by biggest_costs categories.
// What's left is "what survives" (operating margin proxy).
// =========================================================
function DollarOfCents({ visible = false }) {
  // Total assigned: 36 + 17 + 15 + 5 = 73. Remaining 27 = "left over"
  // (Note: this is over total revenue; we explicitly call this out as "what remains")
  const segments = [
    { pct: 36, color: "#4F86C6", label: "Cost of Revenue" },
    { pct: 17, color: "#F4A261", label: "R&D" },
    { pct: 15, color: "#2A9D8F", label: "SG&A" },
    { pct:  5, color: "#E76F51", label: "D&A" },
  ];
  const COLS = 10, ROWS = 10;
  const CELL = 30, GAP = 4, PAD = 8;
  const W = PAD * 2 + COLS * CELL + (COLS - 1) * GAP;
  const H = PAD * 2 + ROWS * CELL + (ROWS - 1) * GAP;

  // Build cell color map
  const cells = [];
  let i = 0;
  segments.forEach(seg => {
    for (let k = 0; k < seg.pct; k++) cells[i++] = seg.color;
  });
  // Remaining = highlighted "what survives"
  while (i < 100) cells[i++] = null;

  return (
    <svg className="cents-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <pattern id="surviveDot" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.8" fill="#F25A37" />
        </pattern>
      </defs>
      {Array.from({ length: 100 }).map((_, idx) => {
        const r = Math.floor(idx / COLS);
        const c = idx % COLS;
        const x = PAD + c * (CELL + GAP);
        const y = PAD + r * (CELL + GAP);
        const color = cells[idx];
        // staggered reveal
        const delay = idx * 12;
        const seen = visible;
        return (
          <g key={idx} style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(6px)', transition: `opacity 360ms ease-out ${delay}ms, transform 360ms ease-out ${delay}ms`, transformOrigin: `${x + CELL/2}px ${y + CELL/2}px` }}>
            {color ? (
              <rect x={x} y={y} width={CELL} height={CELL} rx="3" fill={color} />
            ) : (
              <g>
                <rect x={x} y={y} width={CELL} height={CELL} rx="3" fill="#FBFAF7" stroke="#F25A37" strokeWidth="1.2" />
                <rect x={x+1} y={y+1} width={CELL-2} height={CELL-2} rx="2" fill="url(#surviveDot)" />
              </g>
            )}
          </g>
        );
      })}
      {/* "1¢" label on top-left to anchor the metaphor */}
      <text x={PAD + 4} y={PAD + 12} fontFamily="Geist Mono, monospace" fontSize="7" fill="#FFFFFF" opacity="0.7">1¢</text>
      <text x={PAD + COLS*CELL + (COLS-1)*GAP - 12} y={PAD + ROWS*CELL + (ROWS-1)*GAP + 4} fontFamily="Geist Mono, monospace" fontSize="7" fill="#F25A37" opacity="0.85">100¢</text>
    </svg>
  );
}

// =========================================================
// FOOTPRINT — US vs International
// A horizontal flow diagram: a giant 68% block (US) connected
// to a smaller 32% (International). Hand-built, no map cliché.
// =========================================================
function FootprintScene({ progress = 0 }) {
  const W = 392, H = 220;
  const usW = 234;     // 68% of 344
  const intlW = 110;   // 32% of 344
  const x0 = 24;
  return (
    <svg className="geo-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <pattern id="usHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#141414" strokeWidth="1.5" />
        </pattern>
        <pattern id="intlDots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.4" fill="#F25A37" opacity="0.7" />
        </pattern>
      </defs>

      {/* Eyebrow */}
      <text x={x0} y="18" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="#6B6A65">REVENUE BY GEOGRAPHY</text>

      {/* US block */}
      <g style={{ transform: progress > 0 ? 'none' : 'translateX(-12px)', opacity: progress > 0 ? 1 : 0, transition: 'all 600ms ease-out' }}>
        <rect x={x0} y="34" width={usW} height="120" fill="#141414" />
        <rect x={x0} y="34" width={usW} height="120" fill="url(#usHatch)" opacity="0.18" />
        <text x={x0 + 14} y="62" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.4" fill="rgba(251,250,247,0.7)">UNITED STATES</text>
        <text x={x0 + 14} y="120" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="64" fill="#FBFAF7">68%</text>
        <text x={x0 + 14} y="140" fontFamily="Geist, sans-serif" fontSize="10" fill="rgba(251,250,247,0.7)">~$3.37B FY25 revenue</text>
      </g>

      {/* International block */}
      <g style={{ transform: progress > 0.2 ? 'none' : 'translateX(12px)', opacity: progress > 0.2 ? 1 : 0, transition: 'all 700ms ease-out 200ms' }}>
        <rect x={x0 + usW + 8} y="60" width={intlW} height="68" fill="#FFF1EC" stroke="#F25A37" strokeWidth="1" />
        <rect x={x0 + usW + 8} y="60" width={intlW} height="68" fill="url(#intlDots)" opacity="0.5" />
        <text x={x0 + usW + 18} y="80" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="1.4" fill="#A7311A">INTERNATIONAL</text>
        <text x={x0 + usW + 18} y="116" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="34" fill="#F25A37">32%</text>
      </g>

      {/* Connecting tick */}
      <line x1={x0 + usW} y1="94" x2={x0 + usW + 8} y2="94" stroke="#F25A37" strokeWidth="1.2" />

      {/* Footnote */}
      <text x={x0} y="178" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="0.8" fill="#6B6A65">81M domains · 21% of all global registrations</text>
      <text x={x0} y="194" fontFamily="Geist, sans-serif" fontSize="11" fill="#3B3A37" fontStyle="italic" fontFamily="Instrument Serif, serif">A US business with a passport.</text>
    </svg>
  );
}

// =========================================================
// DARK INTERLUDE — DEBT BALANCE
// Simple ledger-style balance with debt vs equity.
// $3.77B debt vs $215M equity — a 17.5x imbalance.
// =========================================================
function DebtBalance({ progress = 0 }) {
  const W = 392, H = 260;
  // Beam tilts based on progress, settling at extreme tilt
  const tiltDeg = -18 * Math.min(1, progress * 1.3);
  const debtY = 2 + Math.min(1, progress) * 18;   // sinks
  const equityY = 2 - Math.min(1, progress) * 16; // rises
  return (
    <svg className="scale-balance-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {/* Pivot post */}
      <line x1={W/2} y1="220" x2={W/2} y2="80" stroke="#3B3A37" strokeWidth="2" />
      <circle cx={W/2} cy="76" r="3" fill="#8C8A84" />

      {/* Beam group, rotates around pivot */}
      <g style={{ transform: `rotate(${tiltDeg}deg)`, transformOrigin: `${W/2}px 76px`, transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        {/* Beam */}
        <line x1="60" y1="76" x2={W-60} y2="76" stroke="#C9C6BF" strokeWidth="1.6" />
        {/* Left ropes */}
        <line x1="80" y1="76" x2="80" y2="116" stroke="#6B6A65" strokeWidth="0.8" />
        <line x1="160" y1="76" x2="160" y2="116" stroke="#6B6A65" strokeWidth="0.8" />
        {/* Right ropes */}
        <line x1={W-160} y1="76" x2={W-160} y2="116" stroke="#6B6A65" strokeWidth="0.8" />
        <line x1={W-80}  y1="76" x2={W-80}  y2="116" stroke="#6B6A65" strokeWidth="0.8" />

        {/* Left pan — DEBT (heavy) */}
        <g transform={`translate(0,${debtY})`}>
          <rect x="60" y="120" width="120" height="48" fill="#1A1917" stroke="#FF8B6A" strokeWidth="1" />
          <text x="120" y="138" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.5" fill="#8C8A84">TOTAL DEBT</text>
          <text x="120" y="160" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="22" fill="#FF8B6A">$3.77B</text>
        </g>

        {/* Right pan — EQUITY (light) */}
        <g transform={`translate(0,${equityY})`}>
          <rect x={W-180} y="120" width="120" height="22" fill="#1A1917" stroke="#3B3835" strokeWidth="1" />
          <text x={W-120} y="134" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="1.5" fill="#8C8A84">EQUITY</text>
          <text x={W-120} y="158" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="14" fill="#C9C6BF">$215M</text>
        </g>
      </g>

      {/* Ground */}
      <line x1="20" y1="220" x2={W-20} y2="220" stroke="#3B3835" strokeWidth="1" />
      <text x="20" y="238" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.5" fill="#6B6A65">17.5× LEVERAGE</text>
      <text x={W-20} y="238" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.5" fill="#6B6A65">FY 2025</text>
    </svg>
  );
}

// =========================================================
// BUYBACK BEAT — shrinking share count.
// Visual: a row of 100 small share-tokens, of which ~33 fade
// out as scroll progresses. The remaining cluster tightens.
// =========================================================
function ShrinkingShares({ progress = 0 }) {
  const W = 392, H = 230;
  const COLS = 14, ROWS = 7;
  const total = COLS * ROWS; // 98 ≈ 100
  const targetGone = Math.round(total * 0.33);
  const gone = Math.round(targetGone * progress);
  const cell = 18, gap = 6;
  const blockW = COLS * cell + (COLS - 1) * gap;
  const x0 = (W - blockW) / 2;
  const y0 = 30;

  return (
    <svg className="buyback-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {/* Header */}
      <text x={x0} y="18" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.5" fill="#6B6A65">SHARES OUTSTANDING — INDEXED 2021 = 100</text>

      {Array.from({ length: total }).map((_, i) => {
        const r = Math.floor(i / COLS);
        const c = i % COLS;
        const x = x0 + c * (cell + gap);
        const y = y0 + r * (cell + gap);
        // The last `gone` shares fade
        const isGone = i >= total - gone;
        return (
          <g key={i}>
            <rect x={x} y={y}
                  width={cell} height={cell} rx="2"
                  fill={isGone ? "#FFFFFF" : "#141414"}
                  stroke={isGone ? "#FFC2AE" : "none"}
                  strokeWidth="1"
                  strokeDasharray={isGone ? "2 2" : "0"}
                  style={{ transition: 'all 360ms ease-out' }} />
          </g>
        );
      })}

      {/* Annotation: line + label for the retired band */}
      <g>
        <line x1={x0} y1={y0 + ROWS * (cell+gap) + 6} x2={x0 + blockW} y2={y0 + ROWS * (cell+gap) + 6} stroke="#E4E1D9" strokeWidth="1" />
        <text x={x0} y={y0 + ROWS * (cell+gap) + 26} fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.2" fill="#6B6A65">RETIRED</text>
        <text x={x0 + blockW} y={y0 + ROWS * (cell+gap) + 26} textAnchor="end" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="20" fill="#F25A37">−33%</text>
      </g>
    </svg>
  );
}

Object.assign(window, {
  HeroTypedBackdrop, BusinessPipes, DollarOfCents, FootprintScene, DebtBalance, ShrinkingShares
});

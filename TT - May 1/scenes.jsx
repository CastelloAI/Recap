/* Bespoke SVG metaphor scenes for the Trane Technologies recap */

// ---------------- HERO: thermal gradient + duct ----------------
function HeroScene({ scrollPct = 0 }) {
  // crossfade hot -> cool as page scrolls deeper
  const heat = Math.max(0, 1 - scrollPct * 1.6);
  return (
    <svg viewBox="0 0 380 220" className="hero-scene-svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="hotcold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#FF7A57" stopOpacity={0.85 * heat + 0.05}/>
          <stop offset="35%"  stopColor="#F4C430" stopOpacity={0.6 * heat + 0.1}/>
          <stop offset="65%"  stopColor="#7B71F5" stopOpacity={0.55}/>
          <stop offset="100%" stopColor="#2563EB" stopOpacity={0.85}/>
        </linearGradient>
        <linearGradient id="ductSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0"/>
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14"/>
        </filter>
      </defs>

      {/* Big horizontal thermal band */}
      <rect x="0" y="60" width="380" height="100" rx="8" fill="url(#hotcold)" filter="url(#soft)" opacity="0.85"/>

      {/* HVAC duct cross-section */}
      <g transform="translate(0,0)">
        {/* main duct */}
        <rect x="20" y="100" width="340" height="38" rx="4" fill="#0B1220" opacity="0.92"/>
        <rect x="20" y="100" width="340" height="38" rx="4" fill="url(#ductSheen)"/>
        {/* slats */}
        {[...Array(12)].map((_, i) => (
          <line key={i} x1={36 + i * 28} y1="106" x2={36 + i * 28} y2="132" stroke="#2A3447" strokeWidth="1.5"/>
        ))}
        {/* T-joint going up */}
        <rect x="170" y="60" width="40" height="44" fill="#0B1220" opacity="0.92"/>
        <rect x="170" y="60" width="40" height="44" fill="url(#ductSheen)"/>
        <line x1="190" y1="64" x2="190" y2="100" stroke="#2A3447" strokeWidth="1.5"/>

        {/* airflow particles */}
        {[...Array(6)].map((_, i) => (
          <circle
            key={i}
            cx={60 + ((i * 53 + scrollPct * 320) % 280)}
            cy={119 + Math.sin(i + scrollPct * 6) * 4}
            r={2.2}
            fill="#FF7A57"
            opacity={0.7 - i * 0.08}
          />
        ))}
      </g>

      {/* sun on left, snowflake on right — both faint */}
      <g transform="translate(40,40)" opacity={heat}>
        <circle cx="0" cy="0" r="14" fill="#FF7A57" opacity="0.85"/>
        {[...Array(8)].map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line key={i}
              x1={Math.cos(a) * 18} y1={Math.sin(a) * 18}
              x2={Math.cos(a) * 26} y2={Math.sin(a) * 26}
              stroke="#FF7A57" strokeWidth="2" strokeLinecap="round" opacity="0.85"
            />
          );
        })}
      </g>
      <g transform="translate(340,180)" opacity={1 - heat * 0.7}>
        {[...Array(6)].map((_, i) => {
          const a = (i * Math.PI) / 3;
          return (
            <g key={i}>
              <line x1="0" y1="0" x2={Math.cos(a) * 14} y2={Math.sin(a) * 14} stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
              <line
                x1={Math.cos(a) * 9} y1={Math.sin(a) * 9}
                x2={Math.cos(a) * 9 + Math.cos(a + 1) * 4}
                y2={Math.sin(a) * 9 + Math.sin(a + 1) * 4}
                stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ---------------- BRAND GLYPHS ----------------
function TraneGlyph() {
  // schematic building w/ HVAC unit on top
  return (
    <svg viewBox="0 0 64 64" width="64" height="64">
      <rect x="8" y="22" width="48" height="36" fill="none" stroke="#0B1220" strokeWidth="1.5"/>
      {/* windows */}
      {[0,1,2].map(r => [0,1,2,3].map(c => (
        <rect key={`${r}-${c}`} x={12 + c*11} y={26 + r*9} width="6" height="5" fill="#2563EB" opacity={0.15 + r*0.1}/>
      )))}
      {/* HVAC unit */}
      <rect x="20" y="10" width="24" height="12" fill="#0B1220"/>
      <line x1="24" y1="14" x2="40" y2="14" stroke="#FF7A57" strokeWidth="1.2"/>
      <line x1="24" y1="18" x2="40" y2="18" stroke="#FF7A57" strokeWidth="1.2"/>
      {/* airflow */}
      <path d="M 14 8 Q 18 4, 22 8 T 30 8" fill="none" stroke="#2563EB" strokeWidth="1.2" opacity="0.6"/>
    </svg>
  );
}

function ThermoKingGlyph() {
  // schematic refrigerated truck
  return (
    <svg viewBox="0 0 64 64" width="64" height="64">
      {/* trailer */}
      <rect x="2" y="22" width="42" height="26" fill="none" stroke="#0B1220" strokeWidth="1.5"/>
      {/* refrigeration unit */}
      <rect x="4" y="14" width="14" height="9" fill="#0B1220"/>
      <circle cx="11" cy="18.5" r="2.5" fill="#FF7A57"/>
      {/* cab */}
      <path d="M 44 28 L 50 28 L 56 36 L 56 48 L 44 48 Z" fill="none" stroke="#0B1220" strokeWidth="1.5"/>
      <rect x="46" y="32" width="8" height="6" fill="#2563EB" opacity="0.2"/>
      {/* wheels */}
      <circle cx="14" cy="50" r="4" fill="#0B1220"/>
      <circle cx="34" cy="50" r="4" fill="#0B1220"/>
      <circle cx="50" cy="50" r="4" fill="#0B1220"/>
      {/* cold breath */}
      <circle cx="22" cy="34" r="1.5" fill="#2563EB" opacity="0.5"/>
      <circle cx="28" cy="36" r="1.2" fill="#2563EB" opacity="0.4"/>
      <circle cx="34" cy="34" r="1.5" fill="#2563EB" opacity="0.3"/>
    </svg>
  );
}

// ---------------- INSTALLED BASE FLYWHEEL ----------------
function FlywheelScene({ progress = 0 }) {
  const angle = progress * 360;
  return (
    <svg viewBox="0 0 380 280" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB"/>
          <stop offset="100%" stopColor="#FF7A57"/>
        </linearGradient>
      </defs>
      <g transform="translate(190,140)">
        {/* outer ring (equipment) */}
        <circle r="100" fill="none" stroke="#D7DDE5" strokeWidth="1"/>
        <circle r="100" fill="none" stroke="url(#ringGrad)" strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 100 * 0.67} ${2 * Math.PI * 100}`}
          transform={`rotate(${-90 + angle * 0.3})`}
          strokeLinecap="round"
        />
        {/* inner ring (aftermarket) */}
        <circle r="62" fill="none" stroke="#E9EDF1" strokeWidth="1"/>
        <circle r="62" fill="#FFFFFF"/>
        {/* spokes (services flowing inward) */}
        {[...Array(8)].map((_, i) => {
          const a = (i * Math.PI) / 4 + (progress * Math.PI / 2);
          return (
            <line key={i}
              x1={Math.cos(a) * 64} y1={Math.sin(a) * 64}
              x2={Math.cos(a) * 96} y2={Math.sin(a) * 96}
              stroke="#FF7A57" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"
            />
          );
        })}
        {/* center text */}
        <text textAnchor="middle" y="-4" fontFamily="Instrument Serif, serif" fontSize="32" fill="#0B1220">$21.32B</text>
        <text textAnchor="middle" y="14" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="2" fill="#5A6478">FY25 REVENUE</text>

        {/* labels */}
        <text x="0" y="-118" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9.5" letterSpacing="2" fill="#2563EB">EQUIPMENT · 67%</text>
        <text x="0" y="118" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9.5" letterSpacing="2" fill="#FF7A57">SERVICES · 33%</text>

        {/* installed base dots orbiting */}
        {[...Array(14)].map((_, i) => {
          const a = (i * (Math.PI * 2)) / 14 + progress * Math.PI * 0.6;
          const r = 100;
          return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="3" fill="#2563EB" opacity={0.3 + (i % 3) * 0.2}/>;
        })}
      </g>
    </svg>
  );
}

// ---------------- COST THERMOMETER ----------------
function CostThermometer({ progress = 0 }) {
  // stacked thermometer: 64 cost-of-rev, 10 SG&A, 2 R&D, 2 D&A, residual = 22 (operating + tax + interest band)
  // We'll show a literal thermometer filled to 100% with bands.
  const stops = [
    { pct: 64, color: '#2563EB', label: 'Cost of revenue' },
    { pct: 10, color: '#16A34A', label: 'SG&A' },
    { pct: 2,  color: '#D97706', label: 'R&D' },
    { pct: 2,  color: '#9333EA', label: 'D&A' },
    { pct: 22, color: '#FF7A57', label: 'Operating margin + below the line' },
  ];
  // Build segments top-down
  let acc = 0;
  const fillH = 460 * Math.min(1, progress * 1.4);
  return (
    <svg viewBox="0 0 220 540" style={{ width: '100%', height: '100%', maxHeight: 540 }}>
      <defs>
        <clipPath id="thermoClip">
          <rect x="60" y="20" width="60" height={fillH} rx="28"/>
        </clipPath>
        <linearGradient id="thermoEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* outer thermometer outline */}
      <rect x="60" y="20" width="60" height="460" rx="28" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <circle cx="90" cy="500" r="34" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)"/>

      {/* bulb fill */}
      <circle cx="90" cy="500" r="30" fill="#FF7A57" opacity={0.4 + progress * 0.6}/>

      {/* segmented fills */}
      <g clipPath="url(#thermoClip)">
        {stops.map((s, i) => {
          const y = 20 + (acc / 100) * 460;
          const h = (s.pct / 100) * 460;
          acc += s.pct;
          return <rect key={i} x="60" y={y} width="60" height={h} fill={s.color}/>;
        })}
        <rect x="60" y="20" width="60" height="460" fill="url(#thermoEdge)"/>
      </g>

      {/* tick labels on the right */}
      {(() => {
        let cumul = 0;
        return stops.map((s, i) => {
          const y = 20 + (cumul / 100) * 460 + (s.pct / 100) * 460 / 2;
          cumul += s.pct;
          return (
            <g key={i} transform={`translate(130, ${y})`}>
              <line x1="-6" y1="0" x2="6" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
              <text x="14" y="4" fontFamily="Geist Mono, monospace" fontSize="10" letterSpacing="1.4" fill="#E9EDF1">
                {s.pct}¢ · {s.label.toUpperCase()}
              </text>
            </g>
          );
        });
      })()}

      {/* tick marks on left */}
      {[0, 25, 50, 75, 100].map((t) => {
        const y = 20 + (t / 100) * 460;
        return (
          <g key={t}>
            <line x1="50" y1={y} x2="60" y2={y} stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            <text x="44" y={y + 3} textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="9" fill="#93A0B4">{t}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------- COMPETITORS — BUILDING SKYLINE ----------------
function CompetitorSkyline({ progress = 0 }) {
  // market cap: TT 105.38, CARR 51.23, JCI 86.22, PH 124.80
  const buildings = [
    { name: 'PH',   mcap: 124.80, color: '#5A6478', accent: '#93A0B4' },
    { name: 'TT',   mcap: 105.38, color: '#2563EB', accent: '#FF7A57', us: true },
    { name: 'JCI',  mcap:  86.22, color: '#5A6478', accent: '#93A0B4' },
    { name: 'CARR', mcap:  51.23, color: '#5A6478', accent: '#93A0B4' },
  ];
  const max = 124.80;
  const baseH = 280;
  return (
    <svg viewBox="0 0 380 320" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9EDF1" stopOpacity="0"/>
          <stop offset="100%" stopColor="#DBE8FF" stopOpacity="0.5"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="380" height="320" fill="url(#skyFade)"/>

      {/* ground line */}
      <line x1="0" y1="300" x2="380" y2="300" stroke="#D7DDE5" strokeWidth="1"/>

      {buildings.map((b, i) => {
        const w = 70;
        const x = 28 + i * 82;
        const h = (b.mcap / max) * baseH * Math.min(1, progress * 1.3);
        const y = 300 - h;
        const rows = Math.floor(h / 14);
        const cols = 3;
        return (
          <g key={b.name}>
            {/* building body */}
            <rect x={x} y={y} width={w} height={h} fill={b.color} opacity={b.us ? 1 : 0.85}/>
            {/* roof unit */}
            <rect x={x + 18} y={y - 8} width={w - 36} height="8" fill={b.us ? '#0B1220' : '#3B3A37'}/>
            {/* windows */}
            {[...Array(rows)].map((_, r) => (
              [...Array(cols)].map((__, c) => (
                <rect key={`${r}-${c}`}
                  x={x + 8 + c * 18}
                  y={y + 6 + r * 14}
                  width="12" height="7"
                  fill={b.accent}
                  opacity={b.us ? (0.45 + ((r + c) % 3) * 0.18) : 0.22}
                />
              ))
            ))}
            {/* label */}
            <text x={x + w / 2} y={316} textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="10" letterSpacing="1" fill={b.us ? '#0B1220' : '#5A6478'} fontWeight={b.us ? 600 : 400}>
              {b.name}
            </text>
            <text x={x + w / 2} y={y - 14} textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="14" fill={b.us ? '#0B1220' : '#5A6478'}>
              ${b.mcap.toFixed(0)}B
            </text>
          </g>
        );
      })}
    </svg>
  );
}

Object.assign(window, {
  HeroScene, TraneGlyph, ThermoKingGlyph, FlywheelScene, CostThermometer, CompetitorSkyline,
});

/* global React */
const { useEffect, useRef, useState, useMemo } = React;
const { useReveal, useCountUp, useScrollY } = window;

/* ============================================================
   HERO — Two cages. One company.
   ============================================================ */
function HeroBg() {
  const y = useScrollY();
  // Two glowing rings (cages) with parallax separation
  const off = Math.min(80, y * 0.25);
  return (
    <svg className="hero-bg" viewBox="0 0 440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="glowL" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8102E" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#C8102E" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#C8102E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowR" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A961" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#C9A961" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#C9A961" stopOpacity="0" />
        </radialGradient>
        <pattern id="hexPat" x="0" y="0" width="22" height="38" patternUnits="userSpaceOnUse">
          <path d="M11 0 L22 6.5 L22 19.5 L11 26 L0 19.5 L0 6.5 Z" fill="none" stroke="rgba(10,9,8,0.05)" strokeWidth="0.6"/>
        </pattern>
      </defs>
      <rect x="0" y="0" width="440" height="800" fill="url(#hexPat)" />
      {/* Left cage glow */}
      <circle cx={120 - off * 0.4} cy={500 + off * 0.3} r="180" fill="url(#glowL)" />
      {/* Right cage glow */}
      <circle cx={340 + off * 0.5} cy={620 - off * 0.4} r="200" fill="url(#glowR)" />
      {/* Octagon outline (UFC) */}
      <g transform={`translate(80 ${510 + off * 0.1}) rotate(0)`} opacity="0.55">
        <polygon points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22"
                 fill="none" stroke="#C8102E" strokeWidth="1.2" />
        <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
                 fill="none" stroke="#C8102E" strokeWidth="0.6" opacity="0.55" />
      </g>
      {/* Squared circle (WWE ring rope) */}
      <g transform={`translate(340 ${600 - off * 0.15})`} opacity="0.55">
        <rect x="-44" y="-30" width="88" height="60" fill="none" stroke="#C9A961" strokeWidth="1.2" />
        <rect x="-44" y="-18" width="88" height="0.6" fill="none" stroke="#C9A961" strokeWidth="0.6" />
        <rect x="-44" y="0" width="88" height="0.6" fill="none" stroke="#C9A961" strokeWidth="0.6" />
        <rect x="-44" y="18" width="88" height="0.6" fill="none" stroke="#C9A961" strokeWidth="0.6" />
        {/* turnbuckles */}
        <circle cx="-44" cy="-30" r="2" fill="#C9A961" />
        <circle cx="44" cy="-30" r="2" fill="#C9A961" />
        <circle cx="-44" cy="30" r="2" fill="#C9A961" />
        <circle cx="44" cy="30" r="2" fill="#C9A961" />
      </g>
    </svg>
  );
}

function Hero() {
  return (
    <section className="hero" data-bg="bone">
      <HeroBg />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="eyebrow" style={{ marginBottom: 24 }}>
          NYSE · TKO <span className="dot" /> Sports & Entertainment
        </div>
        <h1 className="hero-h1">
          Two cages.<br/>
          <span className="amp">&</span> <span className="it">one</span><br/>
          company.
        </h1>
        <p className="hero-sub">
          Born <span className="it">September 2023</span> when Endeavor’s UFC married WWE.
          Now reaching <span className="it">a billion households</span> across 210 countries —
          and 500+ live nights a year.
        </p>
      </div>
      <div className="hero-tape" style={{ position: 'relative', zIndex: 2 }}>
        <div className="cell">
          <span className="lab">Mkt Cap</span>
          <span className="val">$36.17<span className="small">B</span></span>
        </div>
        <div className="cell">
          <span className="lab">FY ’25 Rev</span>
          <span className="val">$4.74<span className="small">B</span></span>
        </div>
        <div className="cell">
          <span className="lab">EBITDA M</span>
          <span className="val">33.5<span className="small">%</span></span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   RESET BEAT
   ============================================================ */
function ResetBeat({ children, tone = 'dark' }) {
  const [ref] = useReveal();
  return (
    <section ref={ref} className={`reset-beat ${tone === 'bone' ? 'bone' : ''} reveal`} data-bg={tone === 'bone' ? 'bone' : 'dark'}>
      <span className="crest" />
      <p className="quote">{children}</p>
    </section>
  );
}

/* ============================================================
   THREE RINGS — UFC / WWE / IMG
   ============================================================ */
function ThreeRings() {
  const [ref, seen] = useReveal();
  // Revenue: UFC 1.50, WWE 1.71, IMG 1.37 — total 4.58 (gap to 4.74 = ~elim)
  const segs = [
    { name: 'WWE',  rev: 1.71, color: '#C9A961', desc: 'Wrestling — Netflix, ESPN, sites & sponsors', italic: true,  dash: 0.361 },
    { name: 'UFC',  rev: 1.50, color: '#C8102E', desc: 'Fighting — Paramount + global PPV',         italic: false, dash: 0.317 },
    { name: 'IMG',  rev: 1.37, color: '#F2EDE4', desc: 'Rights, hospitality, On Location, PBR',     italic: false, dash: 0.290 },
  ];
  const total = 4.58;
  // Ring math
  const cx = 190, cy = 165;
  const Ring = ({ r, color, frac, delay = 0 }) => {
    const C = 2 * Math.PI * r;
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(242,237,228,0.07)" strokeWidth="14" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="14" strokeLinecap="butt"
          strokeDasharray={`${seen ? C * frac : 0} ${C}`}
          style={{ transition: `stroke-dasharray 1400ms cubic-bezier(0.22,1,0.36,1) ${delay}ms` }}
          transform={`rotate(-90 ${cx} ${cy})`} />
      </g>
    );
  };
  return (
    <section ref={ref} className="section dark" data-bg="dark">
      <div className="eyebrow-row">
        <span className="eyebrow on-dark">The card · 3 segments</span>
      </div>
      <div className="serif" style={{ fontSize: 40, lineHeight: 1.02, letterSpacing: '-0.025em', color: 'var(--bone)' }}>
        Three rings,<br/>
        <span className="serif-it" style={{ color: 'var(--gold)' }}>one promotion.</span>
      </div>
      <p className="body" style={{ marginTop: 18, maxWidth: '34ch' }}>
        Of <span className="it">$4.74B</span> in FY ’25 revenue, three segments split the gate.
        Long-term media rights — Netflix, ESPN, Paramount — keep the room loud.
      </p>

      <div className="rings-wrap">
        <svg viewBox="0 0 380 330" aria-hidden="true">
          <Ring r={130} color="#C9A961" frac={1.71/total} delay={0} />
          <Ring r={106} color="#C8102E" frac={1.50/total} delay={180} />
          <Ring r={82}  color="#F2EDE4" frac={1.37/total} delay={360} />
          <text x={cx} y={cy - 10} textAnchor="middle"
            fontFamily="Instrument Serif" fontStyle="italic" fontSize="38" fill="#F2EDE4" letterSpacing="-1">
            $4.58B
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle"
            fontFamily="Geist Mono" fontSize="9" letterSpacing="2" fill="#7A716A">
            SEGMENT REV
          </text>
        </svg>
      </div>

      <div className="segments-list">
        {segs.map((s, i) => (
          <div className="seg-row" key={s.name} style={{ borderColor: 'rgba(242,237,228,0.10)' }}>
            <span className="name" style={{ color: s.color }}>
              {s.italic ? <span className="it">{s.name}</span> : s.name}
            </span>
            <span className="desc" style={{ color: 'var(--fg-d-sub)' }}>{s.desc}</span>
            <span className="rev" style={{ color: 'var(--bone)' }}>${s.rev.toFixed(2)}<span className="b">B</span></span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   SCALE — count-ups
   ============================================================ */
function ScaleCell({ lab, target, suffix = '', decimals = 0, prefix = '', sub, italic }) {
  const [ref, value] = useCountUp(target, { decimals, prefix, suffix });
  return (
    <div className="scale-cell" ref={ref}>
      <div className="lab">{lab}</div>
      <div className="v">
        {italic ? <span className="it">{value}</span> : value}
      </div>
      <div className="sub">{sub}</div>
    </div>
  );
}
function Scale() {
  return (
    <section className="section bone-2" data-bg="bone">
      <div className="eyebrow-row">
        <span className="eyebrow">The scale · FY ’25</span>
      </div>
      <div className="serif" style={{ fontSize: 42, lineHeight: 1.02, letterSpacing: '-0.025em' }}>
        A <span className="serif-it" style={{ color: 'var(--blood)' }}>billion</span><br/>
        households<br/>
        watching.
      </div>
      <p className="body" style={{ marginTop: 16, maxWidth: '34ch' }}>
        TKO’s footprint is <span className="it">global</span> and its calendar is relentless.
        Big rights deals provide a high-margin spine; live nights add the heat.
      </p>
      <div className="scale-grid">
        <ScaleCell lab="Households reached" target={1} suffix="B+" sub="across ~210 countries & territories" italic />
        <ScaleCell lab="Live events / yr" target={500} suffix="+" sub="UFC, WWE, IMG, On Location, PBR" />
        <ScaleCell lab="FY ’25 revenue" target={4.74} prefix="$" suffix="B" decimals={2} sub="+ 17.6% operating margin" italic />
        <ScaleCell lab="Adj. EBITDA" target={1.585} prefix="$" suffix="B" decimals={2} sub="33.5% margin on revenue" italic />
        <ScaleCell lab="Operating cash" target={1.29} prefix="$" suffix="B" decimals={2} sub="free cash flow $1.16B" />
        <ScaleCell lab="Net income" target={195.4} prefix="$" suffix="M" decimals={1} sub="dragged by D&A on WWE intangibles" />
      </div>
    </section>
  );
}

/* ============================================================
   COSTS — tale-of-the-tape stacked, dark bg
   ============================================================ */
function Costs() {
  const [ref, seen] = useReveal();
  const costs = [
    { pct: 40, color: '#E05C5C', label: 'Direct Operating Costs' },
    { pct: 22, color: '#5B8FD4', label: 'SG&A' },
    { pct: 12, color: '#F5A623', label: 'Depreciation & Amortization' },
    { pct: 5,  color: '#7DC87D', label: 'Interest Expense' },
    { pct: 3,  color: '#A97DC8', label: 'Equity-Based Compensation' },
  ];
  const totalCost = costs.reduce((a,b) => a + b.pct, 0); // 82
  const ebitdaMargin = 18; // residual visual; report 17.6 op margin / 33.5 EBITDA below
  return (
    <section ref={ref} className="section dark" data-bg="dark">
      <div className="eyebrow-row">
        <span className="eyebrow on-dark">The bill · ¢ on the dollar</span>
      </div>
      <div className="serif" style={{ fontSize: 40, lineHeight: 1.02, letterSpacing: '-0.025em', color: 'var(--bone)' }}>
        Where every<br/>
        dollar of revenue<br/>
        <span className="serif-it" style={{ color: 'var(--gold)' }}>actually goes.</span>
      </div>
      <p className="body" style={{ marginTop: 18, maxWidth: '36ch', color: 'var(--fg-d-mute)' }}>
        Production, talent, venues — staging the show is expensive.
        And <span className="it">D&A</span> on acquired WWE intangibles weighs heavy.
      </p>

      <div className="cost-stack">
        {costs.map((c, i) => (
          <div className={`cost-row ${seen ? 'in' : ''}`} key={c.label}
            style={{ '--w': `${c.pct}%`, transitionDelay: `${i * 90}ms` }}>
            <div className="bar-fill" style={{ background: c.color, transitionDelay: `${i * 90}ms` }} />
            <span className="pct-num">0{i+1}</span>
            <span className="name">{c.label}</span>
            <span className="pct">{c.pct}%</span>
          </div>
        ))}
      </div>

      <div className="cost-totals">
        <span className="left">17.6% Op margin</span>
        <span>33.5% Adj. EBITDA</span>
      </div>
    </section>
  );
}

/* ============================================================
   GEOGRAPHY — bone section, North America-heavy
   ============================================================ */
function Geo() {
  const [ref, seen] = useReveal();
  const regions = [
    { region: 'North America',         pct: 65 },
    { region: 'Europe',                pct: 15 },
    { region: 'Middle East & Africa',  pct: 10 },
    { region: 'Asia-Pacific',          pct: 7  },
    { region: 'Latin America',         pct: 3  },
  ];
  return (
    <section ref={ref} className="section" data-bg="bone">
      <div className="eyebrow-row">
        <span className="eyebrow">The map · 210 countries</span>
      </div>
      <div className="serif" style={{ fontSize: 40, lineHeight: 1.02, letterSpacing: '-0.025em' }}>
        America buys<br/>
        <span className="serif-it" style={{ color: 'var(--blood)' }}>two-thirds</span><br/>
        of the ticket.
      </div>
      <p className="body" style={{ marginTop: 16, maxWidth: '34ch' }}>
        Combat sports travel — <span className="it">Riyadh, Manchester, São Paulo</span> — but
        the home crowd still pays the gate.
      </p>

      <div className="geo-wrap">
        <svg viewBox="0 0 380 220" aria-hidden="true">
          <defs>
            <radialGradient id="naGlow" cx="22%" cy="42%" r="36%">
              <stop offset="0%" stopColor="#C8102E" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#C8102E" stopOpacity="0.0" />
            </radialGradient>
          </defs>
          {/* Stylized lat/long grid as the world */}
          {[40,80,120,160].map(y => (
            <line key={y} x1="0" y1={y} x2="380" y2={y} stroke="rgba(10,9,8,0.07)" />
          ))}
          {[60,120,180,240,300].map(x => (
            <line key={x} x1={x} y1="20" x2={x} y2="200" stroke="rgba(10,9,8,0.07)" />
          ))}
          {/* Region "bubbles" sized by share */}
          <circle cx="80"  cy="92"  r={seen ? 56 : 0} fill="url(#naGlow)" style={{ transition: 'r 1100ms cubic-bezier(0.22,1,0.36,1)' }}/>
          <circle cx="80"  cy="92"  r={seen ? 22 : 0} fill="#C8102E" style={{ transition: 'r 1100ms cubic-bezier(0.22,1,0.36,1) 50ms' }}/>
          <circle cx="200" cy="84"  r={seen ? 11 : 0} fill="#0A0908" style={{ transition: 'r 1100ms cubic-bezier(0.22,1,0.36,1) 200ms' }}/>
          <circle cx="240" cy="118" r={seen ? 9  : 0} fill="#C9A961" style={{ transition: 'r 1100ms cubic-bezier(0.22,1,0.36,1) 320ms' }}/>
          <circle cx="298" cy="108" r={seen ? 7  : 0} fill="#0A0908" style={{ transition: 'r 1100ms cubic-bezier(0.22,1,0.36,1) 440ms' }}/>
          <circle cx="120" cy="160" r={seen ? 5  : 0} fill="#0A0908" style={{ transition: 'r 1100ms cubic-bezier(0.22,1,0.36,1) 560ms' }}/>
          {/* labels */}
          <g fontFamily="Geist Mono" fontSize="9" letterSpacing="1.6" fill="#6B6058">
            <text x="80"  y="170" textAnchor="middle">N. AMERICA · 65%</text>
            <text x="200" y="60"  textAnchor="middle">EUROPE · 15%</text>
            <text x="240" y="142" textAnchor="middle">MEA · 10%</text>
            <text x="298" y="130" textAnchor="middle">APAC · 7%</text>
            <text x="120" y="180" textAnchor="middle">LATAM · 3%</text>
          </g>
        </svg>
      </div>

      <div className="geo-list">
        {regions.map((r, i) => (
          <div className={`geo-row ${seen ? 'in' : ''}`} key={r.region}
               style={{ '--w': `${r.pct}%`, transitionDelay: `${i * 80}ms` }}>
            <span className="reg">
              {i === 0 ? <span className="it">{r.region}</span> : r.region}
            </span>
            <span className="bar"><span className="fill" style={{ transitionDelay: `${i * 80 + 100}ms` }} /></span>
            <span className="pct">{r.pct}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   THE BET — capital structure (smoke)
   ============================================================ */
function Bet() {
  const [ref, seen] = useReveal();
  // Total returned: $185.16M divs + $866.8M buybacks = $1,051.96M ≈ $1.05B
  // Plus $1.0B announced Mar 2026 buyback authorization
  return (
    <section ref={ref} className="section smoke" data-bg="dark">
      <div className="eyebrow-row">
        <span className="eyebrow on-dark">The bet · capital allocation</span>
      </div>
      <div className="serif" style={{ fontSize: 42, lineHeight: 1.02, letterSpacing: '-0.025em', color: 'var(--bone)' }}>
        Money in.<br/>
        <span className="serif-it" style={{ color: 'var(--gold)' }}>Money out.</span><br/>
        Money queued.
      </div>
      <p className="body" style={{ marginTop: 18, color: 'var(--fg-d-mute)', maxWidth: '36ch' }}>
        TKO sits on <span className="it">$3.74B</span> of equity, <span className="it">$3.72B</span> of debt,
        and a checkbook pointed firmly back at shareholders.
      </p>

      <div className="bet-grid">
        <div className="bet-pillar">
          <span className="lab">Cash</span>
          <span className="name">on hand</span>
          <span className="v gold">$831M</span>
        </div>
        <div className="bet-pillar">
          <span className="lab">Debt</span>
          <span className="name"><span className="it">vs.</span> equity</span>
          <span className="v">$3.72B<span style={{ color: 'var(--fg-d-sub)' }}> / </span>$3.74B</span>
        </div>
        <div className="bet-pillar">
          <span className="lab">Total assets</span>
          <span className="name">mostly intangibles</span>
          <span className="v blood">$15.5B</span>
        </div>
      </div>

      <div style={{ marginTop: 36 }}>
        <div className="eyebrow on-dark" style={{ marginBottom: 18 }}>FY ’25 returned to equity</div>
        <div className="return-bar">
          <div className="track">
            <div className="seg buy" style={{ flex: seen ? 866.8 : 0, transition: 'flex 1100ms cubic-bezier(0.22,1,0.36,1)' }}>
              <span className="lab">BUYBACKS</span>
            </div>
            <div className="seg div" style={{ flex: seen ? 185.16 : 0, transition: 'flex 1100ms cubic-bezier(0.22,1,0.36,1) 120ms' }}>
              <span className="lab">DIV</span>
            </div>
            <div className="seg queue" style={{ flex: seen ? 1000 : 0, transition: 'flex 1100ms cubic-bezier(0.22,1,0.36,1) 240ms' }}>
              <span className="lab">+ $1B QUEUED MAR ’26</span>
            </div>
          </div>
          <div className="legend">
            <div>
              Buybacks
              <span className="v gold">$867M</span>
            </div>
            <div>
              Dividends
              <span className="v blood">$185M</span>
            </div>
            <div>
              Authorized
              <span className="v">+$1.0B</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   COMPETITORS — fight card matchups
   ============================================================ */
function Fightcard() {
  const [ref] = useReveal();
  const tko = { mc: 36.17, rev: 4.74, growth: null }; // baseline
  const opps = [
    {
      name: 'Live Nation',
      ticker: 'LYV',
      mc: 36.38, rev: 25.24, // quarterly $6.31B → annualized estimate not used; we report quarterly
      qrev: 6.31,
      pe: 73.35,
      growth: 8.83,
      ring: 'On Location · IMG hospitality',
      desc: 'They sell every couch in the stadium. TKO sells the seats up front.',
    },
    {
      name: 'Roblox',
      ticker: 'RBLX',
      mc: 42.76, rev: 4.89, growth: 35.77,
      ring: 'Youth attention · digital licensing',
      desc: 'They’re where the next generation already lives. TKO licenses its IP into their world.',
    },
    {
      name: 'Take-Two',
      ticker: 'TTWO',
      mc: 39.26, rev: 5.63, growth: 20.34,
      ring: 'Combat & wrestling gaming IP',
      desc: 'WWE 2K, UFC franchises — gaming dollars run through their pipes, not TKO’s.',
    },
  ];
  return (
    <section ref={ref} className="section" data-bg="bone">
      <div className="eyebrow-row">
        <span className="eyebrow">The card · main events</span>
      </div>
      <div className="serif" style={{ fontSize: 40, lineHeight: 1.02, letterSpacing: '-0.025em' }}>
        Three opponents,<br/>
        <span className="serif-it" style={{ color: 'var(--blood)' }}>three different</span><br/>
        weight classes.
      </div>
      <p className="body" style={{ marginTop: 18, maxWidth: '34ch' }}>
        TKO doesn’t compete with one rival; it fights on three undercards at once —
        live events, youth attention, and gaming IP.
      </p>

      <div className="fightcard">
        {opps.map((o) => {
          const tkoBeats = (cmp) => (cmp ?? 0) > 0;
          return (
            <div className="matchup" key={o.ticker}>
              <div className="matchup-head">
                <span className="vs-lab">TKO <span className="b">vs.</span> {o.name} · {o.ring}</span>
                <span className="ticker-tag">{o.ticker}</span>
              </div>
              <div className="name-row">
                <span className="l">TKO</span>
                <span className="vs">vs</span>
                <span className="r">{o.name}</span>
              </div>
              <div className="matchup-row" style={{ marginTop: 14 }}>
                <span className={`stat-l ${tko.mc < o.mc ? '' : 'win'}`}>${tko.mc}B</span>
                <span className="lab">Mkt Cap</span>
                <span className={`stat-r ${o.mc > tko.mc ? 'win' : ''}`}>${o.mc}B</span>
              </div>
              <div className="matchup-row">
                <span className={`stat-l ${tko.rev < o.rev ? '' : 'win'}`}>${tko.rev}B</span>
                <span className="lab">{o.qrev ? 'Rev (Q)' : 'Rev (TTM)'}</span>
                <span className={`stat-r ${(o.qrev || o.rev) > tko.rev ? 'win' : ''}`}>
                  ${o.qrev || o.rev}B
                </span>
              </div>
              {o.growth !== null && (
                <div className="matchup-row">
                  <span className="stat-l" style={{ color: 'var(--fg-sub)' }}>—</span>
                  <span className="lab">Growth YoY</span>
                  <span className="stat-r win">{o.growth}%</span>
                </div>
              )}
              {o.pe && (
                <div className="matchup-row">
                  <span className="stat-l" style={{ color: 'var(--fg-sub)' }}>—</span>
                  <span className="lab">P/E TTM</span>
                  <span className="stat-r" style={{ color: 'var(--fg-mute)' }}>{o.pe}</span>
                </div>
              )}
              <p className="desc">{o.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   IMG ACQUISITION — capex / strategic move
   ============================================================ */
function Acquisition() {
  const [ref, seen] = useReveal();
  return (
    <section ref={ref} className="section bone-2" data-bg="bone">
      <div className="eyebrow-row">
        <span className="eyebrow">The buy · Feb ’25</span>
      </div>
      <div className="serif" style={{ fontSize: 40, lineHeight: 1.02, letterSpacing: '-0.025em' }}>
        Three more<br/>
        properties,<br/>
        <span className="serif-it" style={{ color: 'var(--blood)' }}>$3.25B</span> in stock.
      </div>
      <p className="body" style={{ marginTop: 16, maxWidth: '34ch' }}>
        In February 2025, TKO bought <span className="it">IMG, On Location, and PBR</span> from
        Endeavor — all stock, no cash — folding agency, hospitality and bull riding under one roof.
      </p>

      <div style={{ marginTop: 28, display: 'grid', gap: 0 }}>
        {[
          { name: 'IMG',           kind: 'Media rights · talent · production' },
          { name: 'On Location',   kind: 'Premium event hospitality' },
          { name: 'PBR',           kind: 'Professional Bull Riders league' },
        ].map((p, i) => (
          <div key={p.name}
            className={seen ? 'reveal in' : 'reveal'}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 16, alignItems: 'baseline',
              borderTop: '1px solid var(--line)',
              padding: '18px 0',
              transitionDelay: `${i * 120}ms`,
            }}>
            <span className="serif-it" style={{ fontSize: 30, letterSpacing: '-0.02em', color: 'var(--blood)' }}>
              0{i+1}
            </span>
            <div>
              <div className="serif" style={{ fontSize: 26, letterSpacing: '-0.015em' }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-sub)', marginTop: 4 }}>
                {p.kind}
              </div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 16, marginTop: 8,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-sub)' }}>
            Total · all-stock
          </span>
          <span className="serif" style={{ fontSize: 38, letterSpacing: '-0.025em' }}>
            <span className="serif-it" style={{ color: 'var(--blood)' }}>$3.25</span>B
          </span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   THE CLOSE — penny grid · 33¢ EBITDA + buyback gold
   ============================================================ */
function Close() {
  const [ref, seen] = useReveal();
  // 100 cents: 82 spent (40+22+12+5+3), 18 op margin remaining
  // But we want EBITDA story: 33.5 EBITDA cents per dollar
  const cells = Array.from({ length: 100 }, (_, i) => i);
  const ebitdaCount = 34; // 33.5
  return (
    <section ref={ref} className="section dark" data-bg="dark">
      <div className="eyebrow-row">
        <span className="eyebrow on-dark">The close · 100¢</span>
      </div>
      <div className="serif" style={{ fontSize: 44, lineHeight: 1.02, letterSpacing: '-0.03em', color: 'var(--bone)' }}>
        A hundred cents in.<br/>
        <span className="serif-it" style={{ color: 'var(--gold)' }}>Thirty-three<br/>and a half</span><br/>
        make EBITDA.
      </div>
      <p className="body" style={{ marginTop: 20, color: 'var(--fg-d-mute)', maxWidth: '34ch' }}>
        Two cages opened this story. One number closes it: of every dollar that walks through
        the gate, <span className="it">33.5¢</span> survive as <span className="it">EBITDA</span> —
        the rest pays for the show.
      </p>

      <div className="penny-grid">
        {cells.map((i) => {
          const lit = i < ebitdaCount;
          return (
            <div key={i} className={`penny ${seen ? (lit ? 'lit' : 'spent') : ''}`}
                 style={{ transitionDelay: `${seen ? i * 8 : 0}ms` }} />
          );
        })}
      </div>
      <div className="penny-label">
        <span><span className="v gold">33.5¢</span><br/>EBITDA / $</span>
        <span style={{ textAlign: 'right' }}><span className="v">66.5¢</span><br/>The show</span>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER — wordmark beat
   ============================================================ */
function Footer() {
  return (
    <section className="footer" data-bg="dark">
      <div className="mark">
        TKO<span className="serif-it" style={{ color: 'var(--blood)' }}>.</span>
      </div>
      <div className="meta">
        <span className="b">FY ’25 RECAP</span> · NYSE: TKO · Market cap $36.17B<br/>
        Source: Company filings · Generated Apr ’26
      </div>
    </section>
  );
}

window.Hero = Hero;
window.ResetBeat = ResetBeat;
window.ThreeRings = ThreeRings;
window.Scale = Scale;
window.Costs = Costs;
window.Geo = Geo;
window.Bet = Bet;
window.Fightcard = Fightcard;
window.Acquisition = Acquisition;
window.Close = Close;
window.Footer = Footer;

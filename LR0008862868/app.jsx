/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

/* ---------- hooks ---------- */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function useInView(ref, threshold = 0.18) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return seen;
}

function useCountUp(target, ready, duration = 1400, decimals = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!ready) return;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const e = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - e, 3);
      setV(target * eased);
      if (e < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ready, duration]);
  return decimals === 0 ? Math.round(v) : v.toFixed(decimals);
}

function useElementProgress(ref) {
  // 0 when element bottom enters viewport, 1 when its top leaves the top of viewport
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const onScroll = () => {
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const passed = vh - r.top;
      setP(Math.max(0, Math.min(1, passed / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return p;
}

/* ---------- chrome ---------- */
function Chrome({ progress, dark }) {
  return (
    <div className={"chrome" + (dark ? " dark" : "")}>
      <div className="chrome-left">
        <span className="ticker">RCL</span>
        <span className="dot" />
        <span className="cname">Royal Caribbean</span>
      </div>
      <div className="recap-label">Recap · FY '25</div>
      <div className="progress-rail">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}

/* ---------- 1. HERO ---------- */
function Hero() {
  const ref = useRef(null);
  const p = useElementProgress(ref);
  // ship drifts horizontally as scroll advances
  const shipX = -20 + p * 80;
  const sunY = 32 - p * 6;
  return (
    <section className="hero" ref={ref} data-screen-label="01 Hero">
      <div className="ticker-strip">
        <span>NYSE · RCL</span>
        <span className="price">$77.23<span style={{ fontSize: 12, marginLeft: 4, fontStyle: 'normal', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>B MKT CAP</span></span>
      </div>

      <div className="sun" style={{ top: `${sunY}%` }} />
      <div className="horizon-line" />

      <svg className="ship-svg" width="320" height="60" viewBox="0 0 320 60" style={{ transform: `translateX(calc(-50% + ${shipX}px))` }}>
        {/* simplified cruise ship silhouette */}
        <g fill="rgba(255,255,255,0.92)">
          <rect x="40" y="34" width="240" height="10" rx="2" />
          <path d="M 30 44 L 40 34 L 280 34 L 296 44 Z" />
          <rect x="60" y="22" width="200" height="14" rx="1" />
          <rect x="80" y="14" width="160" height="10" rx="1" />
          <rect x="110" y="6" width="40" height="10" rx="1" />
          <rect x="170" y="6" width="40" height="10" rx="1" />
          {/* funnels */}
          <rect x="120" y="-4" width="8" height="10" fill="#FF7A57" />
          <rect x="180" y="-4" width="8" height="10" fill="#FF7A57" />
        </g>
        {/* tiny windows */}
        <g fill="rgba(11,22,32,0.6)">
          {[...Array(20)].map((_, i) => <rect key={i} x={50 + i * 12} y={37} width="5" height="3" />)}
        </g>
      </svg>

      {/* layered waves */}
      <svg className="hero-wave" viewBox="0 0 420 80" preserveAspectRatio="none">
        <path d="M0,40 C70,20 140,60 210,40 C280,20 350,60 420,40 L420,80 L0,80 Z"
              fill="#1F4A63" opacity="0.55" />
        <path d="M0,55 C70,35 140,75 210,55 C280,35 350,75 420,55 L420,80 L0,80 Z"
              fill="#0E2638" opacity="0.85" />
      </svg>

      <div className="copy">
        <div className="eyebrow">Thesis <span className="dot-sm" /> FY '25</div>
        <h1>
          Sixty-nine ships.<br />
          Seven seas.<br />
          <em>One ledger.</em>
        </h1>
        <p className="lede">
          Royal Caribbean operates a <em>floating economy</em> of three brands and a joint venture, sailing 1,000 destinations on every continent — and this year, $17.93B sailed through it.
        </p>
      </div>
      <div className="scroll-cue">↓ &nbsp; Scroll the recap</div>
    </section>
  );
}

/* ---------- Reset beats ---------- */
function Reset({ glyph, children }) {
  return (
    <section className="reset">
      <div className="glyph">{glyph}</div>
      <div className="quote">{children}</div>
    </section>
  );
}

/* ---------- 2. The business — two converging currents ---------- */
function Business() {
  const ref = useRef(null);
  const seen = useInView(ref);
  // two streams: passenger ticket ~ 64%, onboard ~ 36% (industry typical, paragraph references both as primary)
  return (
    <section className="beat currents" ref={ref} data-screen-label="02 Business">
      <div className="eyebrow">The business <span className="dot-sm" /> Two currents</div>
      <div className="spacer-sm" />
      <h2 className="display" style={{ fontSize: 40 }}>
        Fares come aboard.<br />
        <em className="coral">The wallet stays open.</em>
      </h2>
      <p className="body" style={{ marginTop: 16 }}>
        Two revenue streams flow into one hull. <em>Tickets</em> are paid before the horizon comes into view; <em className="sig">onboard</em> — food, beverage, excursions, casino, spa — fills the days at sea.
      </p>

      <div className="stage">
        <svg viewBox="0 0 380 360" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="streamA" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#4D7A8A" stopOpacity="0.15" />
              <stop offset="1" stopColor="#1F4A63" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="streamB" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#FF7A57" stopOpacity="0.18" />
              <stop offset="1" stopColor="#FF7A57" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* stream A — fares (left) */}
          <path
            d="M 30 0 C 60 90, 100 130, 130 180 C 150 220, 175 260, 190 310 L 190 360 L 0 360 L 0 0 Z"
            fill="url(#streamA)"
            style={{ transition: 'opacity 1.2s', opacity: seen ? 1 : 0 }}
          />
          {/* stream B — onboard (right) */}
          <path
            d="M 350 0 C 320 90, 280 130, 250 180 C 230 220, 205 260, 190 310 L 190 360 L 380 360 L 380 0 Z"
            fill="url(#streamB)"
            style={{ transition: 'opacity 1.2s 0.2s', opacity: seen ? 0.9 : 0 }}
          />

          {/* labels */}
          <g fontFamily="var(--font-mono)" fontSize="10" letterSpacing="2" fill="#0E2638">
            <text x="20" y="26">PASSENGER TICKETS</text>
            <text x="380" y="26" textAnchor="end" fill="#F25A37">ONBOARD &amp; OTHER</text>
          </g>
          <g fontFamily="var(--font-display)" fontStyle="italic" fontSize="34" fill="#0E2638">
            <text x="20" y="60">$17.93B</text>
          </g>
          <text x="20" y="80" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill="#4D7A8A">
            FY '25 TOTAL REVENUE · +Q4 EPS $2.80
          </text>

          {/* converging point */}
          <circle cx="190" cy="320" r="6" fill="#0E2638" />
          <text x="200" y="324" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill="#0E2638">
            ONE HULL
          </text>

          {/* ripples */}
          {[0, 1, 2].map(i => (
            <ellipse
              key={i}
              cx="190" cy="320"
              rx={12 + i * 14}
              ry={3 + i * 1.5}
              fill="none"
              stroke="#0E2638"
              strokeOpacity={0.28 - i * 0.08}
            />
          ))}
        </svg>
      </div>

      <div className="legend-row">
        <div className="legend-item">
          <div className="num">49.4<em>%</em></div>
          <div className="lbl">Gross margin</div>
        </div>
        <div className="legend-item" style={{ textAlign: 'right' }}>
          <div className="num">27.4<em>%</em></div>
          <div className="lbl">Operating margin</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. The scale ---------- */
function Scale() {
  const ref = useRef(null);
  const seen = useInView(ref);
  const rev = useCountUp(17.93, seen, 1600, 2);
  const ships = useCountUp(69, seen, 1200);
  const guests = useCountUp(1000, seen, 1400);
  const employees = useCountUp(108, seen, 1300);

  return (
    <section className="beat scale" ref={ref} data-screen-label="03 Scale">
      <div className="eyebrow">The scale <span className="dot-sm" /> A floating economy</div>
      <div className="spacer-sm" />
      <div className="bigfig">
        $<span className="count">{rev}</span><em>B</em>
      </div>
      <p className="kicker">
        in revenue, <span className="sig">a fleet of currents</span> flowing through one hull.
      </p>

      <div className="grid">
        <div className="stat">
          <div className="num"><span className="count">{ships}</span></div>
          <div className="lbl">Ships afloat</div>
          <div className="sub">3 brands + a 50% JV</div>
        </div>
        <div className="stat">
          <div className="num">~<span className="count">{guests}</span></div>
          <div className="lbl">Destinations</div>
          <div className="sub">Seven continents</div>
        </div>
        <div className="stat">
          <div className="num"><span className="count">{employees}</span><em>K</em></div>
          <div className="lbl">Employees</div>
          <div className="sub">Crew + corporate</div>
        </div>
        <div className="stat">
          <div className="num">$77<em>B</em></div>
          <div className="lbl">Market cap</div>
          <div className="sub">#2 cruise operator</div>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <FleetGeometry seen={seen} />
      </div>
    </section>
  );
}

/* Bespoke: 69 small ship-dots arranged like a fleet, scaling in */
function FleetGeometry({ seen }) {
  const ships = 69;
  const cols = 11;
  return (
    <div>
      <div className="eyebrow" style={{ color: 'var(--sea-3)' }}>
        Each mark <span className="dot-sm" /> one ship
      </div>
      <svg viewBox={`0 0 360 130`} width="100%" height="130" style={{ marginTop: 14 }}>
        {[...Array(ships)].map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const x = 12 + c * 31;
          const y = 12 + r * 18;
          const delay = i * 22;
          return (
            <g key={i} style={{
              transform: seen ? 'translateY(0)' : 'translateY(8px)',
              opacity: seen ? 1 : 0,
              transition: `all 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
              transformOrigin: `${x}px ${y}px`
            }}>
              <rect x={x} y={y} width="22" height="5" rx="1" fill="#1F4A63" />
              <rect x={x + 3} y={y - 3} width="16" height="3" rx="0.5" fill="#1F4A63" />
              <rect x={x + 8} y={y - 5} width="2" height="2" fill="#FF7A57" />
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span className="eyebrow" style={{ color: 'var(--sea-3)' }}>Royal Caribbean Intl.</span>
        <span className="eyebrow" style={{ color: 'var(--sea-3)' }}>Celebrity · Silversea · TUI JV</span>
      </div>
    </div>
  );
}

/* ---------- 4. Where the money goes — ship cross-section decks ---------- */
function Costs() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.12);

  const lines = [
    { pct: 51, color: '#4A90D9', label: 'Cost of revenue', sub: 'Cruise operating expenses' },
    { pct: 13, color: '#E8734A', label: 'SG&A',            sub: 'Selling, general & admin' },
    { pct: 8,  color: '#6DBF67', label: 'Depreciation',    sub: '& Amortization' },
    { pct: 5,  color: '#F5C842', label: 'Interest, net',   sub: 'Service on $18.2B debt' },
    { pct: 5,  color: '#A86CC1', label: 'Commissions',     sub: 'Transportation & other' },
  ];

  return (
    <section className="beat costs" ref={ref} data-screen-label="04 Costs">
      <div className="eyebrow">A hundred cents in <span className="dot-sm" /> The bill</div>
      <div className="spacer-sm" />
      <h2 className="display" style={{ fontSize: 40 }}>
        Cut the hull open.<br />
        <em className="coral">Watch the dollar settle.</em>
      </h2>
      <p className="body" style={{ marginTop: 14 }}>
        A cruise dollar doesn't sail home intact. Most of it pays for the ocean it crosses — fuel, food, port fees, crew. <em>What's left</em> works the rest of the deck.
      </p>

      {/* Ship cross-section */}
      <div style={{ marginTop: 30, marginBottom: 12 }}>
        <ShipCrossSection lines={lines} seen={seen} />
      </div>

      {/* Deck list */}
      <div style={{ marginTop: 14 }}>
        {lines.map((l, i) => (
          <div className="deck-row" key={i}>
            <div>
              <div className="deck-bar-track">
                <div
                  className="deck-bar-fill"
                  style={{
                    width: seen ? `${(l.pct / 51) * 100}%` : '0%',
                    background: l.color,
                    transitionDelay: `${i * 120}ms`
                  }}
                >
                  {l.pct >= 8 ? `${l.pct}%` : ''}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--sea-5)', marginTop: 6 }}>
                {l.label}<span style={{ color: 'rgba(11,22,32,0.5)' }}> &nbsp;· {l.sub}</span>
              </div>
            </div>
            <div className="deck-label" style={{ textAlign: 'right' }}>
              <span className="pct">{l.pct}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="spacer-md" />
      <p className="body">
        Add it up and roughly <em className="sig">82¢</em> of every revenue dollar funds the voyage. <em>27.4¢</em> stays as operating income — the surface tension of a high-volume, capital-heavy fleet.
      </p>
    </section>
  );
}

function ShipCrossSection({ lines, seen }) {
  // ship cross-section with 5 stacked decks, sized by pct
  const total = lines.reduce((s, l) => s + l.pct, 0); // 82
  const W = 360, H = 200;
  // hull area
  const hullTop = 30, hullBottom = 175;
  const hullH = hullBottom - hullTop;

  let yCursor = hullTop;
  const decks = lines.map((l) => {
    const h = (l.pct / total) * hullH;
    const top = yCursor;
    yCursor += h;
    return { ...l, top, h };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* sea */}
      <rect x="0" y={hullBottom + 2} width={W} height={H - hullBottom - 2} fill="#DCE5E8" />
      {/* hull mask */}
      <defs>
        <clipPath id="hull">
          <path d={`M 30 ${hullTop} L 330 ${hullTop} L 350 ${hullBottom - 8} Q 340 ${hullBottom + 2} 320 ${hullBottom + 2} L 40 ${hullBottom + 2} Q 20 ${hullBottom + 2} 10 ${hullBottom - 8} Z`} />
        </clipPath>
      </defs>
      {/* fill decks within hull */}
      <g clipPath="url(#hull)">
        {decks.map((d, i) => (
          <rect
            key={i}
            x="0"
            y={seen ? d.top : hullBottom}
            width={W}
            height={seen ? d.h : 0}
            fill={d.color}
            style={{ transition: `all 900ms cubic-bezier(0.22,1,0.36,1) ${i * 130}ms` }}
          />
        ))}
        {/* labels per deck */}
        {decks.map((d, i) => d.h > 12 && (
          <text
            key={`t${i}`}
            x="22"
            y={d.top + d.h / 2 + 3}
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="1.2"
            fill="white"
            opacity={seen ? 0.95 : 0}
            style={{ transition: `opacity 600ms ${600 + i * 130}ms` }}
          >
            {d.pct}% · {d.label.toUpperCase()}
          </text>
        ))}
      </g>
      {/* hull outline */}
      <path
        d={`M 30 ${hullTop} L 330 ${hullTop} L 350 ${hullBottom - 8} Q 340 ${hullBottom + 2} 320 ${hullBottom + 2} L 40 ${hullBottom + 2} Q 20 ${hullBottom + 2} 10 ${hullBottom - 8} Z`}
        fill="none"
        stroke="#0E2638"
        strokeWidth="1.5"
      />
      {/* superstructure */}
      <g fill="#0E2638">
        <rect x="60" y={hullTop - 14} width="240" height="14" />
        <rect x="100" y={hullTop - 22} width="160" height="8" />
        <rect x="140" y={hullTop - 28} width="22" height="6" fill="#FF7A57" />
        <rect x="200" y={hullTop - 28} width="22" height="6" fill="#FF7A57" />
      </g>
      {/* waterline ticks */}
      <g fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.5" fill="#4D7A8A">
        <text x={W - 4} y={hullTop - 4} textAnchor="end">WATERLINE OF THE DOLLAR</text>
        <line x1="0" y1={hullBottom + 1} x2={W} y2={hullBottom + 1} stroke="#4D7A8A" strokeOpacity="0.5" strokeDasharray="2 3" />
        <text x="2" y={hullBottom + 14}>SEA · WHAT THE COMPANY KEEPS BELOW</text>
      </g>
    </svg>
  );
}

/* ---------- 5. Footprint ---------- */
function Footprint() {
  const ref = useRef(null);
  const seen = useInView(ref);

  const regions = [
    { pct: 64, region: 'North America', cx: 90,  cy: 95 },
    { pct: 20, region: 'Europe',         cx: 200, cy: 78 },
    { pct: 9,  region: 'Asia-Pacific',   cx: 295, cy: 110 },
    { pct: 7,  region: 'Rest of World',  cx: 175, cy: 165 },
  ];

  return (
    <section className="beat footprint" ref={ref} data-screen-label="05 Footprint">
      <div className="eyebrow">Footprint <span className="dot-sm" /> The map runs north</div>
      <div className="spacer-sm" />
      <h2 className="display" style={{ fontSize: 40 }}>
        Two thirds of the wake<br />
        <em className="coral">is American.</em>
      </h2>
      <p className="body" style={{ marginTop: 14 }}>
        North America writes most of the deposits. Europe sails the rest of the summer; Asia-Pacific is the long horizon.
      </p>

      <svg viewBox="0 0 360 220" width="100%" style={{ marginTop: 24 }}>
        <defs>
          <radialGradient id="oceanG">
            <stop offset="0" stopColor="#DCE5E8" />
            <stop offset="1" stopColor="#9FB7C0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="360" height="220" fill="url(#oceanG)" opacity="0.5" />

        {/* stylized continents (very abstract, hand-built blobs) */}
        <g fill="#0E2638" opacity="0.85">
          {/* N. America */}
          <path d="M 30 60 Q 50 50 80 55 Q 110 60 115 80 Q 120 105 105 120 Q 90 132 65 128 Q 40 122 32 100 Z" />
          {/* S. America */}
          <path d="M 105 130 Q 118 130 122 150 Q 125 175 110 185 Q 100 188 95 175 Q 92 155 100 138 Z" />
          {/* Europe */}
          <path d="M 175 60 Q 195 55 215 60 Q 225 70 218 82 Q 205 92 188 88 Q 175 82 173 72 Z" />
          {/* Africa */}
          <path d="M 195 95 Q 215 90 220 110 Q 225 140 210 160 Q 195 168 188 150 Q 182 125 192 105 Z" />
          {/* Asia */}
          <path d="M 225 55 Q 270 50 305 65 Q 320 80 312 95 Q 290 105 260 100 Q 235 95 222 80 Z" />
          {/* Australia */}
          <path d="M 285 145 Q 310 140 320 150 Q 322 165 305 168 Q 290 168 282 158 Z" />
        </g>

        {/* shipping lanes (curves between regions) */}
        <g stroke="#FF7A57" strokeWidth="1" fill="none" opacity={seen ? 0.55 : 0}
           style={{ transition: 'opacity 1.2s 0.6s' }}>
          <path d="M 90 95 Q 140 60 200 78" strokeDasharray="2 3" />
          <path d="M 90 95 Q 180 130 175 165" strokeDasharray="2 3" />
          <path d="M 200 78 Q 260 90 295 110" strokeDasharray="2 3" />
        </g>

        {/* port nodes — sized by pct */}
        {regions.map((r, i) => {
          const radius = 6 + Math.sqrt(r.pct) * 4;
          return (
            <g key={i}>
              <circle
                cx={r.cx} cy={r.cy} r={radius}
                fill="#FF7A57"
                fillOpacity="0.18"
                style={{
                  transform: seen ? 'scale(1)' : 'scale(0)',
                  transformOrigin: `${r.cx}px ${r.cy}px`,
                  transition: `transform 800ms cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms`
                }}
              />
              <circle
                cx={r.cx} cy={r.cy} r={Math.max(3, radius / 2.2)}
                fill="#FF7A57"
                style={{
                  transform: seen ? 'scale(1)' : 'scale(0)',
                  transformOrigin: `${r.cx}px ${r.cy}px`,
                  transition: `transform 800ms cubic-bezier(0.34,1.56,0.64,1) ${100 + i * 120}ms`
                }}
              />
              <text
                x={r.cx} y={r.cy - radius - 5}
                fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2"
                textAnchor="middle" fill="#0E2638"
                opacity={seen ? 1 : 0}
                style={{ transition: `opacity 500ms ${400 + i * 120}ms` }}
              >
                {r.region.toUpperCase()}
              </text>
              <text
                x={r.cx} y={r.cy + radius + 12}
                fontFamily="var(--font-display)" fontStyle="italic"
                fontSize="16"
                textAnchor="middle" fill="#FF7A57"
                opacity={seen ? 1 : 0}
                style={{ transition: `opacity 500ms ${500 + i * 120}ms` }}
              >
                {r.pct}%
              </text>
            </g>
          );
        })}
      </svg>

      <p className="body" style={{ marginTop: 12 }}>
        <em className="sig">64% · 20% · 9% · 7%.</em> A geography of deposits, not destinations.
      </p>
    </section>
  );
}

/* ---------- 6. The bet — capex / buybacks ---------- */
function Bet() {
  const ref = useRef(null);
  const seen = useInView(ref);

  return (
    <section className="beat bet" ref={ref} data-screen-label="06 Bet">
      <div className="eyebrow">The bet <span className="dot-sm" /> Steel into water</div>
      <div className="spacer-sm" />
      <h2 className="display" style={{ fontSize: 40 }}>
        $5.23B of capex.<br />
        <em className="coral">New ships. New islands.</em>
      </h2>
      <p className="body" style={{ marginTop: 14 }}>
        RCL is pouring its operating cash back into the fleet — new hulls and private destinations — while still funneling cash to shareholders. <em>Two ledgers, one direction.</em>
      </p>

      <div style={{ marginTop: 28 }}>
        <CapexFlow seen={seen} />
      </div>

      <div className="spacer-md" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--sea-5)' }}>$6.46<em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>B</em></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(11,22,32,0.55)', textTransform: 'uppercase', marginTop: 6 }}>Operating cash flow</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--sea-5)' }}>$1.24<em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>B</em></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(11,22,32,0.55)', textTransform: 'uppercase', marginTop: 6 }}>Free cash flow</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--sea-5)' }}>$824<em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>M</em></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(11,22,32,0.55)', textTransform: 'uppercase', marginTop: 6 }}>FY '25 dividends</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--sea-5)' }}>$2.0<em style={{ fontStyle: 'italic', color: 'var(--coral)' }}>B</em></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(11,22,32,0.55)', textTransform: 'uppercase', marginTop: 6 }}>New buyback authorized</div>
        </div>
      </div>

      <div className="spacer-md" />
      <p className="body">
        <em>$1.9B</em> already returned to shareholders since July 2024. December '25: a fresh <em className="sig">$1.00 quarterly dividend</em>, alongside the $2B buyback.
      </p>
    </section>
  );
}

function CapexFlow({ seen }) {
  // sankey-ish: operating cash flow $6.46B fans out into capex ($5.23B), dividends ($824M), buybacks (rest)
  return (
    <svg viewBox="0 0 360 200" width="100%">
      <defs>
        <linearGradient id="capexFlow" x1="0" x2="1">
          <stop offset="0" stopColor="#1F4A63" />
          <stop offset="1" stopColor="#FF7A57" />
        </linearGradient>
      </defs>
      {/* trunk */}
      <rect x="0" y="80" width="100" height="40" fill="#1F4A63"
        style={{ transform: seen ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: '0 0', transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1)' }} />
      <text x="6" y="76" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.5" fill="#0E2638">OPERATING CASH FLOW</text>
      <text x="6" y="106" fontFamily="var(--font-display)" fontStyle="italic" fontSize="20" fill="white">$6.46B</text>

      {/* split lines */}
      <path d="M 100 80 C 150 80, 170 30, 220 30 L 360 30 L 360 60 L 220 60 C 170 60, 150 95, 100 100 Z"
            fill="#1F4A63" opacity={seen ? 0.85 : 0}
            style={{ transition: 'opacity 1.2s 0.4s' }} />
      <path d="M 100 100 C 150 100, 170 110, 220 110 L 360 110 L 360 138 L 220 138 C 170 138, 150 110, 100 110 Z"
            fill="#FF7A57" opacity={seen ? 0.9 : 0}
            style={{ transition: 'opacity 1.2s 0.6s' }} />
      <path d="M 100 110 C 150 110, 170 165, 220 165 L 360 165 L 360 185 L 220 185 C 170 185, 150 120, 100 120 Z"
            fill="#0E2638" opacity={seen ? 0.85 : 0}
            style={{ transition: 'opacity 1.2s 0.8s' }} />

      {/* labels */}
      <g fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.5" fill="#0E2638">
        <text x="358" y="22" textAnchor="end">CAPEX · $5.23B</text>
        <text x="358" y="103" textAnchor="end" fill="#F25A37">DIVIDENDS · $824M</text>
        <text x="358" y="158" textAnchor="end">BUYBACKS · $1.9B SINCE '24</text>
      </g>
    </svg>
  );
}

/* ---------- DEPTH — debt, dark interlude ---------- */
function Depth() {
  const ref = useRef(null);
  const seen = useInView(ref);
  const debt = useCountUp(18.2, seen, 1600, 1);
  const equity = useCountUp(10.04, seen, 1600, 2);
  const cash = useCountUp(825, seen, 1400);

  return (
    <section className="depth" ref={ref} data-screen-label="07 Depth">
      <div className="eyebrow">Below the waterline <span className="dot-sm" /> Debt</div>
      <h2>
        <em>$18.2B</em><br />
        rides under the hull.
      </h2>
      <p className="body">
        A capital-intensive fleet floats on borrowed steel. RCL carries <em>$18.2B</em> in long-term debt against <em className="sig">$10.04B</em> in equity, with <em>$825M</em> in cash on hand — investment-grade, but heavy.
      </p>

      <div className="depth-chart">
        <svg viewBox="0 0 360 240" width="100%">
          <defs>
            <linearGradient id="depthG" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#1F4A63" stopOpacity="0.6" />
              <stop offset="1" stopColor="#03080F" />
            </linearGradient>
          </defs>
          {/* surface line */}
          <line x1="0" y1="40" x2="360" y2="40" stroke="rgba(255,255,255,0.25)" strokeDasharray="3 4" />
          <text x="6" y="34" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.5" fill="rgba(255,255,255,0.55)">SURFACE</text>

          {/* equity (above water, smaller) */}
          <g style={{ transition: 'all 1s', opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(-10px)' }}>
            <rect x="60" y="20" width="60" height="20" fill="#FF7A57" opacity="0.85" />
            <text x="90" y="14" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="white">EQUITY · ${equity}B</text>
          </g>

          {/* anchor chain */}
          <line x1="180" y1="40" x2="180" y2="80" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

          {/* debt anchor (below) */}
          <g style={{ transition: 'all 1.2s 0.3s', opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(20px)' }}>
            <rect x="40" y="80" width="280" height="100" fill="url(#depthG)" stroke="#FF7A57" strokeOpacity="0.6" strokeWidth="1.5" />
            <text x="180" y="120" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontSize="48" fill="white">${debt}B</text>
            <text x="180" y="140" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.5" fill="rgba(255,255,255,0.7)">LONG-TERM DEBT</text>
            <text x="180" y="170" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.2" fill="rgba(255,255,255,0.45)">CASH ON HAND · ${cash}M</text>
          </g>

          {/* tiny bubbles */}
          {[...Array(8)].map((_, i) => (
            <circle key={i}
              cx={50 + (i * 41) % 300}
              cy={200 + (i % 3) * 6}
              r={1.5 + (i % 3)}
              fill="rgba(255,255,255,0.15)"
            />
          ))}
        </svg>
      </div>
    </section>
  );
}

/* ---------- COMPETITORS ---------- */
function Competitors() {
  const ref = useRef(null);
  const seen = useInView(ref);

  const me = { name: 'Royal Caribbean', ticker: 'RCL', cap: 77.23, color: '#FF7A57' };
  const peers = [
    { name: 'Carnival Corp',         ticker: 'CCL',  cap: 40.5,  desc: 'Largest cruise fleet · same ports, same itineraries.', growth: '+6.10% YoY' },
    { name: 'Airbnb',                ticker: 'ABNB', cap: 86.16, desc: 'Experiences platform · the wallet of the younger traveler.', growth: '+10.26% YoY' },
    { name: 'Marriott Intl.',        ticker: 'MAR',  cap: 100.13, desc: 'Resorts and Bonvoy · the all-inclusive land alternative.', growth: '+4.33% YoY' },
  ];

  const max = 100.13;

  return (
    <section className="beat competitors" ref={ref} data-screen-label="08 Competitors">
      <div className="eyebrow">The competition <span className="dot-sm" /> Wakes that cross</div>
      <div className="spacer-sm" />
      <h2 className="display" style={{ fontSize: 40 }}>
        Three wakes<br />
        <em className="coral">crossing the bow.</em>
      </h2>
      <p className="body" style={{ marginTop: 14 }}>
        One sails the same sea. <em>Two</em> compete on land for the same vacation dollar.
      </p>

      <div style={{ marginTop: 28 }}>
        {/* RCL row first */}
        <CompetitorShip {...me} max={max} seen={seen} delay={0} self
          desc="Three brands + a 50% JV. 69 ships. Defending the ocean."
          growth="$17.93B revenue"
        />
        {peers.map((p, i) => (
          <CompetitorShip key={i} {...p} max={max} seen={seen} delay={(i + 1) * 200} />
        ))}
      </div>

      <p className="body" style={{ marginTop: 22 }}>
        At <em>$77B</em>, RCL out-floats Carnival in market value but trails Marriott and Airbnb. The competition isn't only at sea — it's <em className="sig">on every itinerary</em> a traveler considers.
      </p>
    </section>
  );
}

function CompetitorShip({ name, ticker, cap, desc, growth, max, seen, delay, self }) {
  const [open, setOpen] = useState(false);
  const widthPct = (cap / max) * 100;
  const color = self ? '#FF7A57' : '#1F4A63';
  return (
    <div
      className={"deepen" + (open ? " open" : "")}
      onClick={() => setOpen(!open)}
      style={{ padding: '14px 0', borderBottom: '1px solid rgba(11,22,32,0.08)', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--sea-5)' }}>{name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(11,22,32,0.5)', marginLeft: 8 }}>{ticker}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: self ? 'var(--coral)' : 'var(--sea-5)' }}>
          ${cap}B
        </div>
      </div>
      {/* ship-bar */}
      <svg viewBox="0 0 360 28" width="100%" height="28" style={{ display: 'block' }}>
        <g style={{
          transform: seen ? 'translateX(0)' : 'translateX(-20px)',
          opacity: seen ? 1 : 0,
          transition: `all 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`
        }}>
          {/* hull */}
          <rect x="0" y="14" width={(widthPct / 100) * 320} height="8" rx="1" fill={color} />
          <path d={`M 0 22 L ${(widthPct / 100) * 320 + 12} 22 L ${(widthPct / 100) * 320} 14 L 0 14 Z`} fill={color} />
          {/* superstructure */}
          <rect x="6" y="9" width={Math.max(20, (widthPct / 100) * 240)} height="5" fill={color} />
          <rect x="14" y="5" width="6" height="4" fill={self ? '#FFB489' : '#FF7A57'} />
        </g>
      </svg>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'rgba(11,22,32,0.65)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span>{growth}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', color: self ? 'var(--coral)' : 'rgba(11,22,32,0.4)' }}>
          {open ? 'TAP TO COLLAPSE' : 'TAP FOR DETAILS'}
        </span>
      </div>
      <div className="reveal">
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 13.5, lineHeight: 1.5,
          color: 'var(--sea-5)', marginTop: 12, paddingLeft: 12,
          borderLeft: `2px solid ${color}`
        }}>{desc}</p>
      </div>
    </div>
  );
}

/* ---------- CLOSE ---------- */
function Close() {
  const ref = useRef(null);
  const seen = useInView(ref);
  const cents = useCountUp(27, seen, 1800);

  return (
    <section className="close" ref={ref} data-screen-label="09 Close">
      <div className="eyebrow">The takeaway <span className="dot-sm" /> What survives</div>
      <h2>
        <em>{cents}¢</em><br />
        make it back<br />
        to the surface.
      </h2>
      <p className="lede">
        Sixty-nine ships in. <em>Twenty-seven cents</em> of every revenue dollar returned to shareholders as operating income — and a fresh <em>$2B</em> buyback says management thinks the tide is theirs.
      </p>

      <div style={{ marginTop: 50 }}>
        <CentsGrid cents={27} seen={seen} />
      </div>

      <p className="lede" style={{ marginTop: 36 }}>
        The fleet keeps growing. The debt rides under it. The horizon, for now, <em style={{ color: '#FFB489' }}>holds.</em>
      </p>

      <div className="footer">
        <span>NYSE · RCL</span>
        <span>FY '25 · MIAMI, FL</span>
        <span>END</span>
      </div>
    </section>
  );
}

function CentsGrid({ cents, seen }) {
  // 100 cells; first `cents` are coral (operating income), rest are dim
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: 4,
        marginBottom: 12
      }}>
        {[...Array(100)].map((_, i) => {
          const lit = i < cents;
          return (
            <div key={i} style={{
              aspectRatio: '1 / 1',
              background: lit ? '#FF7A57' : 'rgba(255,255,255,0.08)',
              borderRadius: 2,
              opacity: seen ? 1 : 0,
              transform: seen ? 'scale(1)' : 'scale(0.4)',
              transition: `all 500ms cubic-bezier(0.34,1.56,0.64,1) ${i * 12}ms`
            }} />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)' }}>
        <span>1¢ — IN</span>
        <span style={{ color: 'var(--coral)' }}>27¢ — OPERATING INCOME</span>
        <span>100¢</span>
      </div>
    </div>
  );
}

/* ---------- APP ---------- */
function App() {
  const progress = useScrollProgress();
  // Chrome turns dark when over the depth section
  const [chromeDark, setChromeDark] = useState(false);
  const depthRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('depth-anchor');
      if (!el) return;
      const r = el.getBoundingClientRect();
      setChromeDark(r.top < 60 && r.bottom > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="page">
      <Chrome progress={progress} dark={chromeDark} />
      <Hero />
      <Reset glyph="·  ·  ·  TICKETS &amp; ONBOARD  ·  ·  ·">
        Two oceans of money, <span className="sig">one hull</span> to carry them.
      </Reset>
      <Business />
      <Reset glyph="·  ·  ·  THE SCALE  ·  ·  ·">
        A floating economy, sailing <span className="sig">$17.93B a year</span> across a thousand ports.
      </Reset>
      <Scale />
      <Costs />
      <Reset glyph="·  ·  ·  GEOGRAPHY  ·  ·  ·">
        The map runs <span className="sig">north and east.</span> The deposits don't move.
      </Reset>
      <Footprint />
      <Bet />
      <div id="depth-anchor" />
      <Depth />
      <Reset glyph="·  ·  ·  THE WAKES  ·  ·  ·">
        Every cruise dollar has <span className="sig">a land alternative.</span>
      </Reset>
      <Competitors />
      <Close />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

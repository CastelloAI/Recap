const { useState, useEffect, useRef, useMemo } = React;

/* =====================================================================
   Hooks
   ===================================================================== */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

/* Returns a 0..1 number: how far the element has progressed through the viewport.
   0 = top of element at bottom of viewport; 1 = bottom of element at top of viewport. */
function useElementScroll(ref) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when r.top === vh, 1 when r.bottom === 0
      const total = vh + r.height;
      const traveled = vh - r.top;
      setT(Math.min(1, Math.max(0, traveled / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [ref]);
  return t;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function CountUp({ to, prefix='', suffix='', decimals=0, duration=1400 }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let started = false; let raf;
    const io = new IntersectionObserver((es) => {
      es.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = (t) => {
            const k = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - k, 3);
            setV(eased * to);
            if (k < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  const fmt = (n) => {
    const fixed = n.toFixed(decimals);
    const [whole, dec] = fixed.split('.');
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return dec ? `${withCommas}.${dec}` : withCommas;
  };
  return <span ref={ref}>{prefix}{fmt(v)}{suffix}</span>;
}

/* =====================================================================
   Persistent Chrome
   ===================================================================== */
function Chrome() {
  const p = useScrollProgress();
  return (
    <div className="chrome">
      <div className="chrome-row">
        <div className="chrome-left">
          <span className="chrome-ticker">VST</span>
          <span className="chrome-name">Vistra Corp.</span>
        </div>
        <span className="chrome-label">Recap · FY '25</span>
      </div>
      <div className="progress"><div className="progress-fill" style={{ width: `${p*100}%` }} /></div>
    </div>
  );
}

/* =====================================================================
   1. HERO — "44,000 megawatts. Behind every plug in twenty states."
   Scene: a horizontal transmission line with current pulsing along it,
   tied to scroll. Big display number above.
   ===================================================================== */
function Hero() {
  const ref = useRef(null);
  const t = useElementScroll(ref);
  // Pulse positions along wire, tied to scroll
  const dashOffset = -t * 400;
  return (
    <section ref={ref} style={{ paddingTop: 56, paddingBottom: 80 }}>
      <div className="eyebrow" style={{ marginBottom: 28 }}>
        <span className="dot" /> The thesis · NYSE
      </div>
      <h1 className="display" style={{ fontSize: 64, lineHeight: 0.94, marginBottom: 24 }}>
        Forty-four<br/>thousand<br/><em>megawatts.</em>
      </h1>
      <p className="body" style={{ maxWidth: 360, marginBottom: 40 }}>
        Behind five million plugs across twenty states, the country's largest
        competitive power generator. Built in <i>1882</i>. Suddenly indispensable
        in <i>2026</i>.
      </p>

      {/* Transmission line scene */}
      <div style={{ margin: '0 -24px' }}>
        <svg viewBox="0 0 420 220" style={{ width: '100%', display: 'block' }}>
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#F6F2EA" />
              <stop offset="1" stopColor="#E6DFCF" />
            </linearGradient>
            <linearGradient id="wireGlow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#FF6A2C" stopOpacity="0" />
              <stop offset="0.5" stopColor="#FF6A2C" />
              <stop offset="1" stopColor="#FF6A2C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="420" height="220" fill="url(#sky)" />
          {/* Horizon hills */}
          <path d="M0,170 Q 80,150 140,165 T 280,160 T 420,170 L 420,220 L 0,220 Z" fill="#DCD2BE" opacity="0.6"/>
          <path d="M0,180 Q 100,170 200,178 T 420,180 L 420,220 L 0,220 Z" fill="#C9BFA8" opacity="0.7"/>

          {/* Pylons */}
          {[40, 140, 240, 340].map((x, i) => (
            <g key={i} stroke="#34302A" strokeWidth="1.2" fill="none">
              <line x1={x} y1="60" x2={x} y2="170" />
              <line x1={x-18} y1="80" x2={x+18} y2="80" />
              <line x1={x-14} y1="95" x2={x+14} y2="95" />
              <line x1={x-12} y1="60" x2={x} y2="80" />
              <line x1={x+12} y1="60" x2={x} y2="80" />
              <line x1={x-18} y1="80" x2={x-8} y2="170" />
              <line x1={x+18} y1="80" x2={x+8} y2="170" />
            </g>
          ))}
          {/* Wires (sagging) */}
          {[78, 92].map((y, i) => (
            <g key={i}>
              <path d={`M -10,${y} Q 90,${y+12} 190,${y} T 390,${y} L 430,${y}`}
                fill="none" stroke="#34302A" strokeWidth="0.9" opacity="0.55" />
              {/* Glowing pulse layer */}
              <path d={`M -10,${y} Q 90,${y+12} 190,${y} T 390,${y} L 430,${y}`}
                fill="none" stroke="url(#wireGlow)" strokeWidth="2.2"
                strokeDasharray="60 340" strokeDashoffset={dashOffset + i*40}
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,106,44,0.6))' }} />
            </g>
          ))}
          {/* Sun / dot */}
          <circle cx="340" cy="48" r="14" fill="#FF6A2C" opacity="0.18" />
          <circle cx="340" cy="48" r="6" fill="#FF6A2C" />
        </svg>
      </div>

      {/* Quick-look stat row — kept editorial, not boxy */}
      <div style={{ display:'flex', gap: 28, marginTop: 36, flexWrap: 'wrap' }}>
        <Stat big={<><span style={{fontFamily:'Instrument Serif'}}>$</span><CountUp to={55.34} decimals={2} /><span style={{fontSize:24}}>B</span></>} label="Market cap" />
        <Stat big={<><CountUp to={17.74} decimals={2} /><span style={{fontSize:24}}>B</span></>} label="FY'25 revenue" prefix="$"/>
        <Stat big={<><CountUp to={5} /><span style={{fontSize:24}}>M</span></>} label="Retail customers" />
      </div>
    </section>
  );
}
function Stat({ big, label }) {
  return (
    <div>
      <div className="display" style={{ fontSize: 38, lineHeight: 1 }}>{big}</div>
      <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vst-ink-3)', marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* =====================================================================
   RESET BEAT 1
   ===================================================================== */
function Reset({ marker, children }) {
  const r = useReveal();
  return (
    <div className="reset">
      <div className="marker">{marker}</div>
      <p className="quote reveal" ref={r}>{children}</p>
    </div>
  );
}

/* =====================================================================
   2. THE BUSINESS — two pillars: Wholesale + Retail
   Metaphor: power flows from a generation pillar (left) and meets a
   retail pillar (right) at a customer meter. Current animates on scroll.
   ===================================================================== */
function Business() {
  const ref = useRef(null);
  const t = useElementScroll(ref);
  // current dashes flow with t
  const off = -t * 600;
  return (
    <section ref={ref} className="raised">
      <div className="eyebrow" style={{ marginBottom: 22 }}>
        <span className="dot"/> Chapter 02 · How it makes money
      </div>
      <h2 className="display" style={{ fontSize: 44, lineHeight: 1.02, marginBottom: 22 }}>
        Two pillars. <em>One current.</em>
      </h2>
      <p className="body" style={{ marginBottom: 36 }}>
        Generation sells into <i>ERCOT</i> and <i>PJM</i> at wholesale.
        Retail signs the customer. The two hedge each other — when wholesale
        prices spike, retail margins compress; when they dip, retail buffers
        the fleet.
      </p>

      <div style={{ margin: '0 -8px' }}>
        <svg viewBox="0 0 400 280" style={{ width: '100%', display:'block' }}>
          <defs>
            <linearGradient id="pillarGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#34302A" />
              <stop offset="1" stopColor="#16140F" />
            </linearGradient>
            <linearGradient id="retailGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#FF8F62" />
              <stop offset="1" stopColor="#FF6A2C" />
            </linearGradient>
          </defs>

          {/* LEFT PILLAR — generation (cooling tower silhouette) */}
          <g transform="translate(40,40)">
            <path d="M10,200 L10,80 Q10,40 50,30 Q90,40 90,80 L90,200 Z" fill="url(#pillarGrad)"/>
            <path d="M0,200 L100,200 L96,212 L4,212 Z" fill="#16140F"/>
            {/* steam */}
            <ellipse cx="50" cy="22" rx="18" ry="6" fill="#EFEAE0" opacity="0.7"/>
            <ellipse cx="44" cy="10" rx="14" ry="5" fill="#EFEAE0" opacity="0.5"/>
            <ellipse cx="58" cy="2" rx="10" ry="4" fill="#EFEAE0" opacity="0.35"/>
            <text x="50" y="240" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" fill="#34302A" letterSpacing="1.5">WHOLESALE</text>
            <text x="50" y="256" textAnchor="middle" fontFamily="Instrument Serif" fontSize="18" fill="#16140F">~$13B</text>
          </g>

          {/* RIGHT PILLAR — retail (smart meter / building) */}
          <g transform="translate(260,40)">
            <rect x="10" y="40" width="80" height="160" fill="url(#retailGrad)"/>
            {/* windows lit */}
            {[0,1,2,3].map(row => [0,1,2].map(col => (
              <rect key={`${row}-${col}`} x={20 + col*22} y={54 + row*32} width="14" height="18"
                fill="#FFF1E5" opacity={0.55 + 0.1*((row+col)%3)} />
            )))}
            <rect x="0" y="200" width="100" height="12" fill="#16140F"/>
            <text x="50" y="240" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" fill="#34302A" letterSpacing="1.5">RETAIL</text>
            <text x="50" y="256" textAnchor="middle" fontFamily="Instrument Serif" fontSize="18" fill="#16140F">~$4.7B</text>
          </g>

          {/* CURRENT FLOW between them */}
          <path d="M 140,150 Q 200,110 260,150"
            fill="none" stroke="#34302A" strokeWidth="0.8" opacity="0.4" />
          <path d="M 140,150 Q 200,110 260,150"
            fill="none" stroke="#FF6A2C" strokeWidth="2"
            strokeDasharray="10 14" strokeDashoffset={off}
            style={{ filter: 'drop-shadow(0 0 3px rgba(255,106,44,0.7))' }} />

          {/* meter at midpoint */}
          <g transform="translate(190,110)">
            <circle r="14" fill="#F6F2EA" stroke="#34302A" strokeWidth="1.2" />
            <line x1="0" y1="0" x2={Math.cos((t*1.4 - 0.7)*Math.PI) * 9} y2={Math.sin((t*1.4 - 0.7)*Math.PI) * 9} stroke="#FF6A2C" strokeWidth="1.6" strokeLinecap="round"/>
            <circle r="2" fill="#16140F" />
          </g>
        </svg>
      </div>

      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Tile k="95–98%" v="Generation hedged" />
        <Tile k="10.7%" v="Op-margin FY'25" />
        <Tile k="$0.54" v="Q4'25 EPS" />
        <Tile k="5 segments" v="TX · East · West · Retail · Closure" />
      </div>
    </section>
  );
}
function Tile({ k, v }) {
  return (
    <div>
      <div className="display" style={{ fontSize: 30, lineHeight: 1 }}>{k}</div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--vst-ink-3)', marginTop: 6 }}>{v}</div>
    </div>
  );
}

/* =====================================================================
   3. SCALE — 44,000 MW + 5M customers, dramatized
   Metaphor: a horizontal bar that fills with little plant icons as you scroll.
   ===================================================================== */
function Scale() {
  const ref = useRef(null);
  const t = useElementScroll(ref);
  const filled = Math.round(t * 44);
  return (
    <section ref={ref}>
      <div className="eyebrow" style={{ marginBottom: 22 }}>
        <span className="dot"/> Chapter 03 · The scale
      </div>
      <h2 className="display" style={{ fontSize: 40, lineHeight: 1.02, marginBottom: 14 }}>
        Forty-four thousand megawatts is <em>not a number you feel.</em>
      </h2>
      <p className="body" style={{ marginBottom: 36 }}>
        It is enough to keep <i>thirty million homes</i> running on a hot
        Tuesday. Spread across natural gas, nuclear, coal, solar, batteries.
      </p>

      {/* 44 segment bar — fills with scroll */}
      <div style={{ marginBottom: 12 }}>
        <div className="mono" style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--vst-ink-3)', marginBottom: 10 }}>
          44,000 MW · drag of the cursor builds it
        </div>
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(22, 1fr)', gap: 3 }}>
          {Array.from({length: 44}).map((_, i) => (
            <div key={i} style={{
              height: 28,
              background: i < filled ? 'var(--vst-current)' : 'rgba(20,20,15,0.06)',
              transition: 'background 200ms',
              borderRadius: 1.5,
              boxShadow: i < filled ? '0 0 4px rgba(255,106,44,0.5)' : 'none',
            }}/>
          ))}
        </div>
      </div>

      {/* Fuel mix — proportional ticks (no chart library) */}
      <div style={{ marginTop: 36 }}>
        <div className="mono" style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--vst-ink-3)', marginBottom: 14 }}>
          Fuel mix · 5 forms of energy
        </div>
        {[
          {label:'Natural gas', mw: 19000, c:'#C9BFA8'},
          {label:'Coal', mw: 8000, c:'#34302A'},
          {label:'Nuclear', mw: 6500, c:'#FF6A2C'},
          {label:'Solar', mw: 1200, c:'#E8A33B'},
          {label:'Battery', mw: 1000, c:'#7B71F5'},
        ].map((row, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--vst-line)' }}>
            <div style={{ width: 88, fontSize: 13, color:'var(--vst-ink-2)' }}>{row.label}</div>
            <div style={{ flex: 1, height: 8, background: 'rgba(20,20,15,0.05)', position: 'relative', borderRadius: 1 }}>
              <div style={{
                position:'absolute', top:0, left:0, height:'100%',
                width: `${Math.min(100, (row.mw/19000)*100*Math.min(1, t*1.4))}%`,
                background: row.c, transition:'width 50ms linear', borderRadius: 1,
              }}/>
            </div>
            <div className="mono" style={{ fontSize: 11, color:'var(--vst-ink-3)', width: 56, textAlign:'right' }}>
              ~{(row.mw/1000).toFixed(1)}k MW
            </div>
          </div>
        ))}
      </div>

      <p className="body" style={{ marginTop: 32 }}>
        And the buyers are changing. <i>AWS</i> and <i>Meta</i> have already
        signed long-term power purchase agreements. The grid is becoming
        the substrate of artificial intelligence.
      </p>
    </section>
  );
}

/* =====================================================================
   4. WHERE THE MONEY GOES — uses the supplied hex colors only here.
   Metaphor: a smokestack ledger — each band is a cost slice, fuel at the
   base because that's how the company actually burns money.
   ===================================================================== */
const COSTS = [
  { pct: 45, color: '#E05C2A', label: 'Fuel & Purchased Power' },
  { pct: 18, color: '#3A7FBF', label: 'Operations & Maintenance' },
  { pct: 11, color: '#6DBF67', label: 'Depreciation & Amortization' },
  { pct:  7, color: '#9B59B6', label: 'Interest Expense' },
  { pct:  4, color: '#F0C040', label: 'SG&A' },
];
function Costs() {
  const ref = useRef(null);
  const t = useElementScroll(ref);
  // Build stack from bottom: fuel base, then O&M, etc.
  // Total band height in svg = 280
  const k = Math.min(1, Math.max(0, (t - 0.05) * 1.6));
  return (
    <section ref={ref} className="raised">
      <div className="eyebrow" style={{ marginBottom: 22 }}>
        <span className="dot"/> Chapter 04 · The bill
      </div>
      <h2 className="display" style={{ fontSize: 40, lineHeight: 1.02, marginBottom: 14 }}>
        Eighty-five cents <em>just to keep the lights on.</em>
      </h2>
      <p className="body" style={{ marginBottom: 28 }}>
        Burning fuel is the business — and the bill. Forty-five cents of
        every operating dollar goes to fuel and purchased power before the
        first switch flips.
      </p>

      <div style={{ display:'flex', gap: 24, alignItems:'flex-end', justifyContent:'center', marginBottom: 24 }}>
        {/* Smokestack */}
        <svg viewBox="0 0 140 320" style={{ width: 140, flexShrink: 0 }}>
          {/* steam */}
          <ellipse cx="70" cy="14" rx="28" ry="8" fill="#34302A" opacity={0.18 * k}/>
          <ellipse cx="62" cy="4"  rx="20" ry="6" fill="#34302A" opacity={0.12 * k}/>
          {/* Stack outline */}
          <rect x="20" y="20" width="100" height="280" fill="#EFEAE0" stroke="#16140F" strokeWidth="1.4"/>
          {/* base */}
          <rect x="10" y="296" width="120" height="16" fill="#16140F"/>
          {/* lip */}
          <rect x="14" y="20" width="112" height="6" fill="#16140F"/>

          {/* Bands — stacked from the bottom up */}
          {(() => {
            const total = COSTS.reduce((a,c)=>a+c.pct, 0); // 85
            const innerH = 270; // 25..295
            const innerY = 25;
            let y = innerY + innerH; // start at bottom
            return COSTS.map((c, i) => {
              const h = (c.pct / total) * innerH * k;
              y -= h;
              return (
                <g key={i}>
                  <rect x="21" y={y} width="98" height={h} fill={c.color} />
                  {h > 14 && (
                    <text x="70" y={y + h/2 + 3.5} textAnchor="middle"
                      fontFamily="Geist Mono" fontSize="9" fill="#fff" letterSpacing="0.5">
                      {c.pct}%
                    </text>
                  )}
                </g>
              );
            });
          })()}
        </svg>

        {/* Legend */}
        <div style={{ flex: 1 }}>
          {COSTS.map((c, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding: '8px 0' }}>
              <span style={{ width: 14, height: 14, background: c.color, flexShrink: 0, borderRadius: 2 }}/>
              <div style={{ fontSize: 12, lineHeight: 1.2 }}>
                <div style={{ color:'var(--vst-ink)', fontWeight: 500 }}>{c.label}</div>
                <div className="mono" style={{ fontSize: 10, color:'var(--vst-ink-3)' }}>{c.pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="body">
        The remaining fifteen cents is everything else: tax, the bet, and
        what survives — <i>operating margin of 10.7%.</i>
      </p>
    </section>
  );
}

/* =====================================================================
   RESET BEAT — bridge into footprint
   ===================================================================== */

/* =====================================================================
   5. FOOTPRINT — Texas glows. PJM hums. The rest is rounding.
   Stylized US map — abstract regions, not a literal geographic shape.
   ===================================================================== */
const REGIONS = [
  { pct: 52, label: 'Texas (ERCOT)' },
  { pct: 35, label: 'Midwest & Mid-Atlantic (PJM/MISO)' },
  { pct:  8, label: 'Northeast & Other US' },
  { pct:  5, label: 'West (CAISO & Other)' },
];
function Footprint() {
  const ref = useRef(null);
  const t = useElementScroll(ref);
  const k = Math.min(1, t * 1.3);
  return (
    <section ref={ref}>
      <div className="eyebrow" style={{ marginBottom: 22 }}>
        <span className="dot"/> Chapter 05 · The footprint
      </div>
      <h2 className="display" style={{ fontSize: 40, lineHeight: 1.02, marginBottom: 14 }}>
        Half the company <em>is Texas.</em>
      </h2>
      <p className="body" style={{ marginBottom: 28 }}>
        ERCOT is its own grid, its own market, its own weather. Vistra was
        born in it — TXU was the original Texas utility — and most of the
        fleet still sits inside its borders.
      </p>

      <div style={{ margin: '0 -8px' }}>
        <svg viewBox="0 0 400 240" style={{ width:'100%', display:'block' }}>
          {/* Stylized US — abstract blocks */}
          {/* West */}
          <g opacity={0.4 + 0.6*k}>
            <rect x="20" y="60" width="80" height="120" fill="#E6DFCF" stroke="#C9BFA8" strokeWidth="1"/>
            <text x="60" y="125" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" fill="#6B665C" letterSpacing="1">WEST</text>
            <text x="60" y="138" textAnchor="middle" fontFamily="Instrument Serif" fontSize="14" fill="#16140F">5%</text>
          </g>
          {/* Midwest / PJM */}
          <g opacity={0.5 + 0.5*k}>
            <rect x="105" y="40" width="135" height="100" fill="#D7C9A8" stroke="#B8A77E" strokeWidth="1"/>
            <text x="172" y="78" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" fill="#3B3A37" letterSpacing="1">PJM · MISO</text>
            <text x="172" y="100" textAnchor="middle" fontFamily="Instrument Serif" fontSize="22" fill="#16140F">35%</text>
            <text x="172" y="116" textAnchor="middle" fontFamily="Geist" fontSize="9" fill="#6B665C">midwest · mid-atlantic</text>
          </g>
          {/* Northeast */}
          <g opacity={0.4 + 0.6*k}>
            <rect x="245" y="40" width="60" height="60" fill="#E6DFCF" stroke="#C9BFA8" strokeWidth="1"/>
            <text x="275" y="68" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" fill="#6B665C" letterSpacing="1">NE+</text>
            <text x="275" y="82" textAnchor="middle" fontFamily="Instrument Serif" fontSize="14" fill="#16140F">8%</text>
          </g>
          {/* Texas — glowing, dominant */}
          <g>
            {/* glow */}
            <rect x="105" y="145" width="200" height="80" fill="#FF6A2C" opacity={0.12 + 0.18*k}
              style={{ filter: 'blur(14px)' }}/>
            <rect x="105" y="145" width="200" height="80" fill="#FF6A2C" opacity={0.85 * Math.min(1, k+0.2)} />
            <rect x="105" y="145" width="200" height="80" fill="none" stroke="#16140F" strokeWidth="1.2"/>
            <text x="205" y="180" textAnchor="middle" fontFamily="Geist Mono" fontSize="10" fill="#fff" letterSpacing="2">TEXAS · ERCOT</text>
            <text x="205" y="210" textAnchor="middle" fontFamily="Instrument Serif" fontSize="36" fill="#fff" fontStyle="italic">52%</text>
          </g>

          {/* HQ pin */}
          <g transform="translate(190,165)">
            <circle r="4" fill="#16140F" />
            <circle r="9" fill="none" stroke="#16140F" strokeWidth="1" opacity="0.4"/>
            <text x="14" y="3" fontFamily="Geist Mono" fontSize="8.5" fill="#16140F" letterSpacing="1">IRVING, TX · HQ</text>
          </g>
        </svg>
      </div>

      <div style={{ marginTop: 28, borderTop: '1px solid var(--vst-line)' }}>
        {REGIONS.map((r, i) => (
          <div key={i} style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid var(--vst-line)' }}>
            <div style={{ fontSize: 13, color:'var(--vst-ink-2)' }}>{r.label}</div>
            <div className="display" style={{ fontSize: 22, color: i===0 ? 'var(--vst-current)' : 'var(--vst-ink)' }}>{r.pct}%</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   6. THE BET — nuclear power for AI.
   Metaphor: a cooling tower next to a server rack, joined by a fat coral
   wire. Capex numbers stamp in.
   ===================================================================== */
function TheBet() {
  const ref = useRef(null);
  const t = useElementScroll(ref);
  const flow = -t * 800;
  return (
    <section ref={ref} className="deep">
      <div className="eyebrow" style={{ marginBottom: 22, color: 'rgba(244,240,230,0.55)' }}>
        <span className="dot"/> Chapter 06 · The bet
      </div>
      <h2 className="display" style={{ fontSize: 44, lineHeight: 1.02, marginBottom: 18 }}>
        Six thousand five hundred megawatts of <em>nuclear</em>, plugged
        into <em>artificial intelligence.</em>
      </h2>
      <p className="body" style={{ marginBottom: 32 }}>
        Hyperscalers want carbon-free power, twenty-four seven, for thirty
        years. Vistra has reactors at Comanche Peak and Beaver Valley.
        Talen and Constellation got there first; Vistra is racing to
        re-do the trick.
      </p>

      <div style={{ margin: '0 -8px 28px' }}>
        <svg viewBox="0 0 400 240" style={{ width:'100%', display:'block' }}>
          {/* night sky */}
          <rect width="400" height="240" fill="#16140F"/>
          {/* stars */}
          {Array.from({length: 18}).map((_, i) => {
            const x = (i*53.7) % 400;
            const y = (i*31.3) % 100 + 10;
            return <circle key={i} cx={x} cy={y} r="0.8" fill="#F4F0E6" opacity={0.3 + (i%5)*0.1}/>;
          })}

          {/* Cooling tower */}
          <g transform="translate(40,60)">
            {/* steam */}
            <ellipse cx="50" cy="-2" rx="22" ry="7" fill="#F4F0E6" opacity="0.25"/>
            <ellipse cx="44" cy="-12" rx="18" ry="6" fill="#F4F0E6" opacity="0.18"/>
            <ellipse cx="56" cy="-22" rx="14" ry="5" fill="#F4F0E6" opacity="0.12"/>
            {/* tower */}
            <path d="M10,160 L20,40 Q28,12 50,8 Q72,12 80,40 L90,160 Z" fill="#242220" stroke="#3B3835" strokeWidth="1"/>
            <ellipse cx="50" cy="8" rx="22" ry="5" fill="#0A0909"/>
            {/* glow inside */}
            <ellipse cx="50" cy="120" rx="20" ry="30" fill="#FF6A2C" opacity="0.35" style={{filter:'blur(10px)'}}/>
            <text x="50" y="180" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" fill="rgba(244,240,230,0.6)" letterSpacing="1">COMANCHE PEAK</text>
          </g>

          {/* Server rack */}
          <g transform="translate(280,70)">
            <rect x="0" y="0" width="80" height="150" fill="#242220" stroke="#3B3835" strokeWidth="1"/>
            {Array.from({length: 8}).map((_, i) => (
              <g key={i}>
                <rect x="6" y={8 + i*17} width="68" height="12" fill="#0A0909"/>
                <circle cx={14} cy={14 + i*17} r="1.5" fill="#FF6A2C" opacity={0.5 + 0.5*Math.sin(t*6 + i)}/>
                <circle cx={20} cy={14 + i*17} r="1.5" fill="#7B71F5" opacity="0.6"/>
                <line x1="30" y1={14 + i*17} x2="68" y2={14 + i*17} stroke="#3B3835" strokeWidth="0.6"/>
              </g>
            ))}
            <text x="40" y="170" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" fill="rgba(244,240,230,0.6)" letterSpacing="1">AWS · META</text>
          </g>

          {/* Fat power cable joining them */}
          <path d="M 130,140 C 180,140 220,140 280,140"
            fill="none" stroke="#34302A" strokeWidth="6" strokeLinecap="round"/>
          <path d="M 130,140 C 180,140 220,140 280,140"
            fill="none" stroke="#FF6A2C" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="20 14" strokeDashoffset={flow}
            style={{filter:'drop-shadow(0 0 6px rgba(255,106,44,0.7))'}}/>
        </svg>
      </div>

      {/* Capex stamps */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 18, borderTop: '1px solid rgba(244,240,230,0.12)', paddingTop: 28 }}>
        <Stamp k="$2.75B" v="Capex FY'25" />
        <Stamp k="$4.07B" v="Op cash flow" />
        <Stamp k="$1.0B" v="Buybacks (annual floor)" />
        <Stamp k="$306M" v="Dividends paid" />
      </div>

      <p className="body" style={{ marginTop: 28 }}>
        Recent acquisitions — <i>Lotus Infrastructure</i>, <i>Cogentrix Energy</i>,
        and <i>Energy Harbor</i> — added the reactors. The next bill is reinvestment:
        $2.75B of capex this year alone.
      </p>
    </section>
  );
}
function Stamp({ k, v }) {
  return (
    <div>
      <div className="display" style={{ fontSize: 32, lineHeight: 1, color:'#F4F0E6' }}>{k}</div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(244,240,230,0.55)', marginTop: 6 }}>{v}</div>
    </div>
  );
}

/* =====================================================================
   7. COMPETITION — sized power plants. Tap any to deepen.
   ===================================================================== */
const COMPS = [
  { ticker: 'VST', name: 'Vistra', mc: 55.34, rev: 17.74, growth: null, isUs: true,
    note: 'The competitive set: each chasing the same hyperscaler power contracts.' },
  { ticker: 'EXC', name: 'Exelon', mc: 48.10, rev: 24.26, pe: 17.38, growth: 5.34,
    note: 'Spun off Constellation, which set the Microsoft/Three Mile Island benchmark. Competes for industrial customers across PJM.' },
  { ticker: 'PEG', name: 'PSEG', mc: 40.69, rev: 12.17, pe: 19.27, growth: 18.25,
    note: 'Operates Hope Creek and Salem nuclear in NJ. Pursuing the same hyperscaler PPAs Vistra wants.' },
  { ticker: 'TLN', name: 'Talen Energy', mc: 16.59, rev: 2.58, growth: 22.03,
    note: 'Pioneered nuclear co-location with the AWS deal at Susquehanna. The template Vistra is racing to copy.' },
];
function Competition() {
  const [open, setOpen] = useState(null);
  const maxMc = Math.max(...COMPS.map(c => c.mc));
  return (
    <section>
      <div className="eyebrow" style={{ marginBottom: 22 }}>
        <span className="dot"/> Chapter 07 · The rivals
      </div>
      <h2 className="display" style={{ fontSize: 40, lineHeight: 1.02, marginBottom: 14 }}>
        Three rivals, <em>one trick</em> — sell nuclear to the cloud.
      </h2>
      <p className="body" style={{ marginBottom: 32 }}>
        Tap any tower to read what they're up to.
      </p>

      <div>
        {COMPS.map((c, i) => {
          const pct = c.mc / maxMc;
          const isOpen = open === i;
          return (
            <div key={i} onClick={() => setOpen(isOpen ? null : i)}
              style={{
                padding: '18px 0', borderBottom: '1px solid var(--vst-line)',
                cursor: 'pointer', userSelect: 'none',
              }}>
              <div style={{ display:'flex', alignItems:'flex-end', gap: 14 }}>
                {/* mini cooling tower sized by market cap */}
                <svg viewBox="0 0 60 80" style={{ width: 50, height: 70, flexShrink: 0 }}>
                  {(() => {
                    const h = 20 + 50 * pct;
                    const y0 = 78 - h;
                    return (
                      <g>
                        <path
                          d={`M12,78 L18,${y0+12} Q26,${y0+2} 30,${y0} Q34,${y0+2} 42,${y0+12} L48,78 Z`}
                          fill={c.isUs ? 'var(--vst-current)' : '#34302A'}/>
                        <ellipse cx="30" cy={y0} rx="12" ry="3" fill={c.isUs ? '#D6411F' : '#16140F'}/>
                        <rect x="6" y="78" width="48" height="2" fill="#16140F"/>
                      </g>
                    );
                  })()}
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
                    <div>
                      <span className="mono" style={{ fontSize: 11, color:'var(--vst-ink-3)', letterSpacing:'0.06em' }}>
                        {c.ticker}
                      </span>
                      <span style={{ marginLeft: 8, fontSize: 15, fontWeight: 500 }}>{c.name}</span>
                    </div>
                    <div className="display" style={{ fontSize: 22, color: c.isUs ? 'var(--vst-current)' : 'var(--vst-ink)' }}>
                      ${c.mc}B
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color:'var(--vst-ink-3)', marginTop: 4, letterSpacing:'0.04em' }}>
                    Rev ${c.rev}B {c.growth!=null ? ` · YoY +${c.growth}%` : ''} {c.pe ? ` · P/E ${c.pe}` : ''}
                  </div>
                </div>
                <div style={{ fontSize: 14, color:'var(--vst-ink-3)', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 220ms' }}>+</div>
              </div>
              <div style={{
                maxHeight: isOpen ? 200 : 0, overflow: 'hidden',
                transition: 'max-height 380ms cubic-bezier(0.65,0,0.35,1)',
              }}>
                <p className="body" style={{ marginTop: 14, fontSize: 14 }}>{c.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =====================================================================
   8. THE TAKEAWAY — invert the open
   Hero opened with 44,000 megawatts of capacity.
   Close lands on a single dollar — and what survives.
   ===================================================================== */
function Takeaway() {
  const ref = useRef(null);
  const t = useElementScroll(ref);
  const k = Math.min(1, t * 1.4);
  // 100 cent grid; first 11 lit (op income margin ~10.7%)
  const lit = Math.round(11 * k);
  return (
    <section ref={ref} className="raised" style={{ paddingBottom: 40 }}>
      <div className="eyebrow" style={{ marginBottom: 22 }}>
        <span className="dot"/> Chapter 08 · The takeaway
      </div>
      <h2 className="display" style={{ fontSize: 44, lineHeight: 1.02, marginBottom: 18 }}>
        Forty-four thousand megawatts in.<br/>
        <em>Eleven cents</em> out.
      </h2>
      <p className="body" style={{ marginBottom: 28 }}>
        After the fuel, the operators, the depreciation, the interest —
        what's left is operating margin. Eleven cents per revenue dollar.
        And of those, $1.0B is being routed back to shareholders this year.
      </p>

      {/* 100-cent grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(20, 1fr)', gap: 4, marginBottom: 24 }}>
        {Array.from({length: 100}).map((_, i) => (
          <div key={i} style={{
            aspectRatio: '1 / 1',
            background: i < lit ? 'var(--vst-current)' : 'rgba(20,20,15,0.07)',
            transition: `background 200ms`,
            borderRadius: 1.5,
            boxShadow: i < lit ? '0 0 4px rgba(255,106,44,0.4)' : 'none',
          }}/>
        ))}
      </div>
      <div className="mono" style={{ fontSize: 10.5, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--vst-ink-3)' }}>
        Op-income margin · 10.7% · FY '25
      </div>

      <p className="body" style={{ marginTop: 36, fontSize: 17, fontFamily: 'Instrument Serif', fontStyle: 'italic', color: 'var(--vst-ink)', lineHeight: 1.35 }}>
        The cheap power era ended when the data centers showed up.
        Vistra spent a hundred and forty years getting ready for it.
      </p>
    </section>
  );
}

/* =====================================================================
   APP
   ===================================================================== */
function App() {
  return (
    <div className="device">
      <Chrome />
      <Hero />

      <Reset marker="Interlude · 01">
        Wholesale lights the grid. <span className="hot">Retail signs the bill.</span>
        And one hedges the other when the weather turns.
      </Reset>

      <Business />

      <Reset marker="Interlude · 02">
        A megawatt is not a thing you can hold.
        <span className="hot"> It is a promise </span>
        — that the lights will be on a second from now.
      </Reset>

      <Scale />
      <Costs />

      <Reset marker="Interlude · 03">
        Most of the country is on someone else's grid.
        <span className="hot"> Texas is on its own.</span>
      </Reset>

      <Footprint />
      <TheBet />

      <Reset marker="Interlude · 04">
        Every rival is chasing the same contract.
        <span className="hot"> Whoever builds first, wins the decade.</span>
      </Reset>

      <Competition />
      <Takeaway />

      <div className="foot">
        <div className="meta">VST · NYSE · FY '25 RECAP</div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--vst-ink-3)', marginTop: 8 }}>
          End of recap · scroll to top
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

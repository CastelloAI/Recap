// MDLZ recap scenes — hand-built SVG metaphor scenes + count-up hooks
const { useEffect, useRef, useState, useMemo } = React;

// ---------- hooks ----------
function useInView(opts = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function useScrollProgressOf(ref) {
  // 0 when top of element hits bottom of viewport, 1 when bottom of element hits top.
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const passed = vh - r.top;
      setP(Math.max(0, Math.min(1, passed / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function CountUp({ to, decimals = 0, prefix = '', suffix = '', dur = 1400, trigger }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setV(to * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, to, dur]);
  const fmt = decimals === 0
    ? Math.round(v).toLocaleString()
    : v.toFixed(decimals);
  return <span className="tabular">{prefix}{fmt}{suffix}</span>;
}

// ============================================================
// HERO — giant Oreo splitting open as you scroll
// ============================================================
function Hero() {
  const ref = useRef(null);
  const p = useScrollProgressOf(ref);
  // p: 0..0.6 ish while hero on screen
  const split = Math.min(1, p * 2.2); // 0 closed → 1 fully split

  return (
    <section ref={ref} style={{
      minHeight: '105vh',
      padding: '40px 28px 80px',
      background: 'radial-gradient(120% 70% at 50% 30%, #FBF6EA 0%, #F4ECDB 55%, #EADFC7 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* tiny grain via SVG noise */}
      <svg style={{position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06, mixBlendMode:'multiply', pointerEvents:'none'}}>
        <filter id="grain"><feTurbulence baseFrequency="0.9" numOctaves="2"/></filter>
        <rect width="100%" height="100%" filter="url(#grain)"/>
      </svg>

      <div style={{display:'flex', flexDirection:'column', gap:18, marginTop:8}}>
        <span className="eyebrow"><span className="dot"></span> Stock recap · FY '25</span>
        <h1 className="serif" style={{fontSize:64, lineHeight:0.92, letterSpacing:'-0.03em', color:'var(--cocoa)'}}>
          Eight billion <span className="serif-it amber">Oreos</span><br/>
          a year.
        </h1>
        <p style={{fontFamily:'var(--font-display)', fontSize:21, fontStyle:'italic', lineHeight:1.3, color:'var(--cocoa-3)', maxWidth:'34ch', marginTop:6}}>
          And that's just the cookie. Mondelez owns the shelf — biscuits, chocolate, the in-between.
        </p>
        <div style={{display:'flex', gap:20, marginTop:14, fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--cocoa-4)'}}>
          <span>NASDAQ · MDLZ</span>
          <span>·</span>
          <span>$73.39B mkt cap</span>
        </div>
      </div>

      {/* The cookie */}
      <div style={{position:'relative', height:380, marginTop:36}}>
        <OreoSplit split={split}/>
      </div>

      <div style={{textAlign:'center', marginTop:8, fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--cocoa-soft, #8B6849)'}}>
        scroll ↓
      </div>
    </section>
  );
}

function OreoSplit({ split }) {
  // split 0..1 — open the cookie, reveal cream filling
  const topY = -split * 60;
  const botY = split * 60;
  const creamScale = 0.6 + split * 0.6;
  const creamOpac = Math.min(1, split * 1.6);
  const rot = split * 6;

  return (
    <svg viewBox="0 0 360 360" width="100%" height="100%" style={{display:'block'}}>
      <defs>
        <radialGradient id="wafer" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="#3a2418"/>
          <stop offset="55%" stopColor="#241510"/>
          <stop offset="100%" stopColor="#150a06"/>
        </radialGradient>
        <radialGradient id="cream-g" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#FFFCF1"/>
          <stop offset="100%" stopColor="#E8DCB6"/>
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6"/>
        </filter>
      </defs>

      {/* shadow */}
      <ellipse cx="180" cy="320" rx={130 - split*20} ry={14 - split*4} fill="#1A0F08" opacity={0.18 - split*0.05} filter="url(#soft)"/>

      {/* cream filling — visible when split */}
      <g transform={`translate(180 180) scale(${creamScale})`} opacity={creamOpac}>
        <circle r="100" fill="url(#cream-g)"/>
        {/* embossed MDLZ-ish letters in cream */}
        <text textAnchor="middle" y="6" fontFamily="Instrument Serif" fontStyle="italic" fontSize="38" fill="#B89548" opacity="0.6">M·D·L·Z</text>
      </g>

      {/* bottom wafer */}
      <g transform={`translate(180 ${180 + botY}) rotate(${rot})`}>
        <Wafer/>
      </g>

      {/* top wafer */}
      <g transform={`translate(180 ${180 + topY}) rotate(${-rot})`}>
        <Wafer/>
      </g>
    </svg>
  );
}

function Wafer() {
  // a single chocolate wafer with an embossed pattern (rosette ring + ridges)
  const dots = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    dots.push(<circle key={i} cx={Math.cos(a) * 80} cy={Math.sin(a) * 80} r={6} fill="#0d0604"/>);
  }
  const ridges = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const x1 = Math.cos(a) * 92;
    const y1 = Math.sin(a) * 92;
    const x2 = Math.cos(a) * 98;
    const y2 = Math.sin(a) * 98;
    ridges.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0a0503" strokeWidth="2" strokeLinecap="round"/>);
  }
  return (
    <g>
      <circle r="100" fill="url(#wafer)" stroke="#0a0503" strokeWidth="1"/>
      <circle r="98" fill="none" stroke="#0a0503" strokeWidth="1.5" opacity="0.6"/>
      {ridges}
      {dots}
      <circle r="32" fill="none" stroke="#0a0503" strokeWidth="1.5" opacity="0.6"/>
      <text textAnchor="middle" y="6" fontFamily="Instrument Serif" fontStyle="italic" fontSize="20" fill="#0a0503" opacity="0.7">OREO</text>
    </g>
  );
}

// ============================================================
// RESET BEAT
// ============================================================
function Reset({ children, dark = false, cream = false }) {
  const [ref, seen] = useInView({ threshold: 0.4 });
  return (
    <div ref={ref} className={`reset ${dark ? 'dark' : ''} ${cream ? 'cream' : ''} reveal ${seen ? 'in' : ''}`}>
      <p className="lead">{children}</p>
    </div>
  );
}

// ============================================================
// SCALE — the empire stat tiles, no cards, just typography
// ============================================================
function Scale() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  return (
    <section ref={ref} style={{padding:'72px 28px 64px', background:'var(--cream)'}}>
      <span className="eyebrow"><span className="dot"></span> The empire · FY '25</span>
      <h2 className="serif" style={{fontSize:42, marginTop:14, color:'var(--cocoa)', maxWidth:'12ch'}}>
        A pantry the size of <span className="serif-it amber">a planet.</span>
      </h2>

      <div style={{marginTop:40, display:'grid', gridTemplateColumns:'1fr', gap:0}}>
        <StatLine label="Annual revenue" value={<><span className="serif" style={{fontSize:80}}>$<CountUp to={38.54} decimals={2} trigger={seen}/></span><span style={{fontFamily:'var(--font-display)', fontSize:38, color:'var(--cocoa-3)'}}>B</span></>} note="FY 2025" />
        <Divider/>
        <StatLine label="Countries served" value={<><span className="serif" style={{fontSize:80}}><CountUp to={150} trigger={seen}/></span><span style={{fontFamily:'var(--font-display)', fontSize:36, color:'var(--cocoa-3)'}}>+</span></>} note="Six continents" />
        <Divider/>
        <StatLine label="Employees worldwide" value={<><span className="serif" style={{fontSize:80}}><CountUp to={91000} trigger={seen}/></span></>} note="One company, many ovens" />
        <Divider/>
        <StatLine label="Market cap" value={<><span className="serif" style={{fontSize:80}}>$<CountUp to={73.39} decimals={2} trigger={seen}/></span><span style={{fontFamily:'var(--font-display)', fontSize:38, color:'var(--cocoa-3)'}}>B</span></>} note="Second-largest in confectionery" />
      </div>
    </section>
  );
}

function StatLine({ label, value, note }) {
  return (
    <div style={{padding:'22px 0', display:'flex', flexDirection:'column', gap:8}}>
      <span className="kicker">{label}</span>
      <div style={{display:'flex', alignItems:'baseline', gap:6, color:'var(--cocoa)'}}>{value}</div>
      <span style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:16, color:'var(--cocoa-3)'}}>{note}</span>
    </div>
  );
}
function Divider() {
  return <div style={{height:1, background:'var(--line)', margin:'4px 0'}}/>;
}

// ============================================================
// CATEGORIES — chocolate bar broken into squares sized by share
// ============================================================
const CATEGORIES = [
  { label: 'Biscuits & baked snacks', pct: 48, rev: 18.39, brands: 'Oreo · Ritz · Tate\'s' },
  { label: 'Chocolate',                pct: 33, rev: 12.70, brands: 'Cadbury · Milka · Toblerone' },
  { label: 'Gum & candy',              pct: 11, rev: 4.06,  brands: 'Trident · Halls' },
  { label: 'Cheese & grocery',         pct: 6,  rev: 2.38,  brands: 'Philadelphia (intl)' },
  { label: 'Beverages',                pct: 3,  rev: 1.01,  brands: 'Tang · powdered' },
];

function Categories() {
  const [ref, seen] = useInView({ threshold: 0.25 });
  const [hi, setHi] = useState(0);
  return (
    <section ref={ref} style={{padding:'80px 28px 72px', background:'var(--cream-2)'}}>
      <span className="eyebrow"><span className="dot"></span> What's in the tin · $38.54B</span>
      <h2 className="serif" style={{fontSize:42, marginTop:14, color:'var(--cocoa)'}}>
        Biscuits do <span className="serif-it amber">half the lifting.</span>
      </h2>
      <p style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:18, color:'var(--cocoa-3)', marginTop:14, maxWidth:'34ch'}}>
        Five categories, one shelf. The cookie aisle pays for the chocolate aisle's bad year.
      </p>

      {/* the chocolate bar */}
      <ChocolateBar seen={seen} hi={hi} setHi={setHi}/>

      {/* legend rows */}
      <div style={{marginTop:28, display:'flex', flexDirection:'column'}}>
        {CATEGORIES.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setHi(i)}
            style={{
              all:'unset', cursor:'pointer',
              padding:'14px 0',
              borderBottom: i < CATEGORIES.length-1 ? '1px solid var(--line)' : 'none',
              display:'flex', alignItems:'baseline', gap:14,
              opacity: hi === i ? 1 : 0.55,
              transition: 'opacity 220ms',
            }}>
            <span style={{
              fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.08em',
              color:'var(--cocoa-4)', minWidth:28,
            }}>{String(i+1).padStart(2,'0')}</span>
            <div style={{flex:1, display:'flex', flexDirection:'column', gap:4}}>
              <span style={{fontSize:15, color:'var(--cocoa)', fontWeight:500}}>{c.label}</span>
              <span style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:13, color:'var(--cocoa-soft, #8B6849)'}}>{c.brands}</span>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
              <span style={{fontFamily:'var(--font-display)', fontSize:24, color:'var(--cocoa)'}}>${c.rev.toFixed(2)}<span style={{fontSize:14}}>B</span></span>
              <span style={{fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.1em', color:'var(--cocoa-4)'}}>{c.pct}%</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ChocolateBar({ seen, hi, setHi }) {
  // a bar of 100 squares (10x10), colored so each block of N matches a category's pct
  const W = 356, H = 200;
  const cols = 10, rows = 10;
  const cw = W / cols, ch = H / rows;
  const colors = ['#3D2316','#1F100A','#7A4A28','#A87545','#D9A441'];

  // compute which category each cell belongs to
  const cells = [];
  let acc = 0;
  for (let i = 0; i < CATEGORIES.length; i++) {
    for (let j = 0; j < CATEGORIES[i].pct; j++) {
      cells.push(i);
      acc++;
    }
  }
  while (cells.length < 100) cells.push(CATEGORIES.length - 1);

  return (
    <div style={{marginTop:32, position:'relative'}}>
      {/* foil wrap suggestion */}
      <div style={{position:'absolute', inset:'-12px -8px', background:'linear-gradient(180deg, #F0D88A 0%, #D9A441 50%, #C2861F 100%)', borderRadius:6, opacity:0.0}}/>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block', borderRadius:6, filter:'drop-shadow(0 18px 24px rgba(26,15,8,0.18))'}}>
        <defs>
          <linearGradient id="barShine" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.18"/>
            <stop offset="40%" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {Array.from({length: 100}).map((_, k) => {
          const cIdx = cells[k];
          const col = k % cols;
          const row = Math.floor(k / cols);
          const x = col * cw, y = row * ch;
          const dim = hi !== null && cIdx !== hi;
          const delay = (row * 40 + col * 12);
          return (
            <g key={k} onClick={() => setHi(cIdx)} style={{cursor:'pointer'}}>
              <rect
                x={x+1} y={y+1} width={cw-2} height={ch-2}
                rx={2}
                fill={colors[cIdx]}
                opacity={seen ? (dim ? 0.32 : 1) : 0}
                style={{transition: `opacity 700ms cubic-bezier(.22,1,.36,1) ${delay}ms`}}
              />
              {/* inner bevel */}
              <rect
                x={x+1} y={y+1} width={cw-2} height={ch-2}
                rx={2}
                fill="url(#barShine)"
                opacity={seen ? (dim ? 0.4 : 1) : 0}
                style={{transition: `opacity 700ms ${delay}ms`}}
                pointerEvents="none"
              />
            </g>
          );
        })}
      </svg>
      <div style={{marginTop:10, display:'flex', justifyContent:'space-between', fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--cocoa-4)'}}>
        <span>100 squares · 100¢</span>
        <span>tap a piece →</span>
      </div>
    </div>
  );
}

// ============================================================
// MARGINS / COCOA SQUEEZE
// ============================================================
function Margins() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  return (
    <section ref={ref} style={{padding:'80px 28px 80px', background:'var(--cocoa)', color:'var(--milk)', position:'relative', overflow:'hidden'}}>
      {/* drips of cocoa from top */}
      <svg viewBox="0 0 412 80" width="100%" style={{position:'absolute', top:-1, left:0, right:0}} preserveAspectRatio="none">
        <path d="M0 0 L412 0 L412 30 Q360 60 320 35 Q280 10 240 50 Q200 80 160 40 Q120 5 80 50 Q40 75 0 35 Z" fill="var(--cream-2)"/>
      </svg>

      <div style={{paddingTop:60}}>
        <span className="eyebrow" style={{color:'var(--caramel-bright)'}}><span className="dot" style={{background:'var(--caramel-bright)'}}></span> The cocoa squeeze · 2025</span>
        <h2 className="serif" style={{fontSize:46, marginTop:14, color:'var(--milk)', letterSpacing:'-0.025em'}}>
          A dollar in. <span className="serif-it" style={{color:'var(--caramel-bright)'}}>Nine cents out.</span>
        </h2>
        <p style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:18, color:'#D8C9A6', marginTop:18, maxWidth:'34ch'}}>
          Cocoa hit historic highs in 2025. Most of every dollar Mondelez collects went straight back into the bean, the bag, and the box.
        </p>
      </div>

      {/* dollar grid: 100 cells, colored by each cost bucket, with the survivor in caramel */}
      <DollarGrid seen={seen}/>

      <div style={{marginTop:48, display:'flex', flexDirection:'column', gap:0}}>
        <MarginRow label="Gross margin" v={28.4} seen={seen} hi={false}/>
        <MarginRow label="Operating margin" v={9.2} seen={seen} hi={true}/>
        <MarginRow label="Q4 EPS" v={0.72} seen={seen} prefix="$" decimals={2} hi={false}/>
      </div>
    </section>
  );
}

function DollarGrid({ seen }) {
  // 100 cells, 10x10. colors come from supplied biggest_costs hex.
  // 72 + 11 + 5 + 1 + 2 = 91; remaining 9 = operating margin survivor (caramel)
  const buckets = [
    { n: 72, color: '#E05C5C', label: 'Cost of revenue' },
    { n: 11, color: '#5B8FD4', label: 'SG&A' },
    { n: 5,  color: '#F4A83A', label: 'Advertising' },
    { n: 1,  color: '#6DBF8A', label: 'R&D' },
    { n: 2,  color: '#A97DC9', label: 'D&A' },
    { n: 9,  color: '#E89438', label: 'What survives', survivor: true },
  ];
  const cells = [];
  buckets.forEach((b, i) => {
    for (let k = 0; k < b.n; k++) cells.push({ ...b, bucketIdx: i });
  });
  const W = 356, cols = 10, cw = W / cols;
  const rows = Math.ceil(cells.length / cols);
  const H = rows * cw;

  return (
    <div style={{marginTop:36}}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:'block'}}>
        {cells.map((c, k) => {
          const col = k % cols, row = Math.floor(k / cols);
          const x = col * cw, y = row * cw;
          const delay = k * 18;
          return (
            <g key={k}>
              <rect
                x={x+2} y={y+2} width={cw-4} height={cw-4}
                rx={3}
                fill={c.color}
                opacity={seen ? (c.survivor ? 1 : 0.92) : 0}
                style={{transition: `opacity 600ms cubic-bezier(.22,1,.36,1) ${delay}ms, transform 600ms ${delay}ms`}}
              />
              {c.survivor && (
                <rect x={x+2} y={y+2} width={cw-4} height={cw-4} rx={3}
                  fill="none" stroke="#FFD9A8" strokeWidth="1" opacity={seen ? 0.7 : 0}
                  style={{transition: `opacity 600ms ${delay}ms`}}
                />
              )}
            </g>
          );
        })}
      </svg>
      {/* legend */}
      <div style={{marginTop:18, display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'10px 16px'}}>
        {buckets.map(b => (
          <div key={b.label} style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{width:10, height:10, borderRadius:2, background:b.color, flexShrink:0}}/>
            <span style={{fontFamily:'var(--font-mono)', fontSize:10.5, letterSpacing:'0.06em', color:'#D8C9A6'}}>
              {b.n}¢ · {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarginRow({ label, v, seen, hi, prefix='', decimals=1 }) {
  return (
    <div style={{padding:'18px 0', borderTop:'1px solid rgba(255,250,234,0.08)', display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
      <span style={{fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'#A89578'}}>{label}</span>
      <span className="serif" style={{fontSize:36, color: hi ? 'var(--caramel-bright)' : 'var(--milk)'}}>
        {prefix}<CountUp to={v} decimals={decimals} trigger={seen}/>{prefix==='$'?'':'%'}
      </span>
    </div>
  );
}

// ============================================================
// FOOTPRINT — geographic distribution as wrapped chocolate bars
// ============================================================
const REGIONS = [
  { label:'Europe',                pct:37, blurb:'Cadbury, Milka, Toblerone' },
  { label:'North America',         pct:29, blurb:'Oreo, Ritz, Tate\'s' },
  { label:'Asia, ME & Africa',     pct:20, blurb:'Local biscuits, growing fast' },
  { label:'Latin America',         pct:14, blurb:'Lacta, Trident' },
];

function Footprint() {
  const [ref, seen] = useInView({ threshold: 0.25 });
  return (
    <section ref={ref} style={{padding:'80px 28px 80px', background:'var(--cream)'}}>
      <span className="eyebrow"><span className="dot"></span> Footprint · 150+ countries</span>
      <h2 className="serif" style={{fontSize:42, marginTop:14, color:'var(--cocoa)'}}>
        <span className="serif-it">Europe</span> still buys<br/>the most chocolate.
      </h2>

      <div style={{marginTop:36, display:'flex', flexDirection:'column', gap:18}}>
        {REGIONS.map((r, i) => <RegionBar key={r.label} r={r} i={i} seen={seen}/>)}
      </div>

      <div style={{marginTop:24, fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:17, lineHeight:1.4, color:'var(--cocoa-3)', maxWidth:'34ch'}}>
        The map of revenue is also the map of taste — Cadbury where the kettle is, Oreo where the lunchbox is.
      </div>
    </section>
  );
}

function RegionBar({ r, i, seen }) {
  const W = 356;
  const widthPct = r.pct;
  const segments = Math.round(r.pct / 5); // each square = 5%
  const segW = (W - 16) / 20; // a "full bar" would be 20 segs
  return (
    <div style={{display:'flex', flexDirection:'column', gap:10}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <div style={{display:'flex', flexDirection:'column', gap:2}}>
          <span style={{fontSize:16, fontWeight:500, color:'var(--cocoa)'}}>{r.label}</span>
          <span style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:13, color:'var(--cocoa-soft, #8B6849)'}}>{r.blurb}</span>
        </div>
        <span className="serif" style={{fontSize:32, color:'var(--cocoa)'}}>{r.pct}<span style={{fontSize:18, color:'var(--cocoa-3)'}}>%</span></span>
      </div>
      {/* bar of segments */}
      <svg viewBox={`0 0 ${W} 28`} width="100%" style={{display:'block'}}>
        {Array.from({length: 20}).map((_, k) => {
          const lit = k < segments;
          const delay = i * 80 + k * 30;
          return (
            <rect
              key={k}
              x={k * segW + 2}
              y={2}
              width={segW - 4}
              height={24}
              rx={2}
              fill={lit ? '#3D2316' : '#E0D0AE'}
              opacity={seen ? 1 : 0}
              style={{transition: `opacity 500ms cubic-bezier(.22,1,.36,1) ${delay}ms`}}
            />
          );
        })}
        {/* shine */}
        <rect x={2} y={2} width={W-4} height={8} rx={2} fill="rgba(255,255,255,0.18)" pointerEvents="none"/>
      </svg>
    </div>
  );
}

// ============================================================
// THE BET — capital allocation
// ============================================================
function TheBet() {
  const [ref, seen] = useInView({ threshold: 0.25 });
  // jar of cookies — the buyback authorization
  return (
    <section ref={ref} style={{padding:'80px 28px 80px', background:'var(--cream-2)'}}>
      <span className="eyebrow"><span className="dot"></span> The bet · capital returned</span>
      <h2 className="serif" style={{fontSize:44, marginTop:14, color:'var(--cocoa)'}}>
        <span className="serif-it amber">$9 billion</span> in the cookie jar.
      </h2>
      <p style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:18, color:'var(--cocoa-3)', marginTop:14, maxWidth:'34ch'}}>
        Authorized December 2024, running through 2027. Mondelez is not waiting around to use it.
      </p>

      <CookieJar seen={seen}/>

      {/* allocation stack */}
      <div style={{marginTop:40}}>
        <div style={{fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--cocoa-4)', marginBottom:14}}>
          FY2025 cash deployed
        </div>
        <AllocStack seen={seen} items={[
          { v: 4.51, label: 'Operating cash in', kind:'in' },
          { v: 1.30, label: 'Capex (ovens, lines)', kind:'out' },
          { v: 2.49, label: 'Dividends to holders', kind:'out' },
          { v: 2.40, label: 'Shares repurchased', kind:'out' },
        ]}/>
        <div style={{marginTop:16, fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:15, color:'var(--cocoa-soft, #8B6849)'}}>
          Free cash flow: <span className="amber" style={{fontStyle:'normal'}}>$3.21B</span>. The jar refills itself.
        </div>
      </div>

      {/* M&A trail */}
      <div style={{marginTop:48}}>
        <div className="kicker" style={{marginBottom:12}}>The bolt-on trail</div>
        <div style={{display:'flex', flexDirection:'column', gap:0}}>
          {[
            ['Nabisco',  '2000', 'biscuit empire'],
            ['LU',       '2007', 'European biscuits'],
            ['Cadbury',  '2010', 'British chocolate'],
            ['Clif Bar', '2022', 'energy bars'],
            ['Chipita',  '2022', 'croissants'],
            ['Ricolino', '2022', 'Mexican candy'],
          ].map(([n, y, t], i) => (
            <div key={n} style={{
              display:'grid', gridTemplateColumns:'58px 1fr auto', alignItems:'baseline',
              padding:'14px 0', borderTop: i === 0 ? 'none' : '1px solid var(--line)',
            }}>
              <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--cocoa-4)', letterSpacing:'0.08em'}}>{y}</span>
              <span style={{fontFamily:'var(--font-display)', fontSize:24, color:'var(--cocoa)'}}>{n}</span>
              <span style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:14, color:'var(--cocoa-soft, #8B6849)'}}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CookieJar({ seen }) {
  // a glass jar with cookies stacked inside; cookies fill in as page loads
  return (
    <svg viewBox="0 0 360 280" width="100%" style={{display:'block', marginTop:32}}>
      <defs>
        <linearGradient id="glass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)"/>
          <stop offset="20%" stopColor="rgba(255,255,255,0.05)"/>
          <stop offset="80%" stopColor="rgba(255,255,255,0.05)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0.55)"/>
        </linearGradient>
        <linearGradient id="cookie-g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a2418"/>
          <stop offset="100%" stopColor="#1f100a"/>
        </linearGradient>
      </defs>
      {/* shelf shadow */}
      <ellipse cx="180" cy="262" rx="120" ry="6" fill="#1A0F08" opacity="0.18"/>

      {/* jar body */}
      <path d="M70 80 L70 250 Q70 262 82 262 L278 262 Q290 262 290 250 L290 80 Z" fill="rgba(220,206,177,0.55)" stroke="#6E4A33" strokeWidth="1.5"/>
      {/* lid */}
      <rect x="60" y="60" width="240" height="24" rx="6" fill="#9A5816" stroke="#6E4A33" strokeWidth="1.5"/>
      <rect x="60" y="58" width="240" height="6" rx="3" fill="#C8782B"/>
      <text x="180" y="78" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" letterSpacing="0.18em" fill="#FBF6EA">$9B BUYBACK · 2024–2027</text>

      {/* cookies stacked, animated in */}
      {[0,1,2,3,4,5].map(i => {
        const y = 240 - i * 24;
        const delay = 200 + i * 120;
        return (
          <g key={i} style={{transition: `opacity 500ms cubic-bezier(.22,1,.36,1) ${delay}ms, transform 600ms ${delay}ms`, transform: seen ? 'translateY(0)' : 'translateY(-30px)', opacity: seen ? 1 : 0}}>
            <ellipse cx="180" cy={y} rx="84" ry="9" fill="url(#cookie-g)" stroke="#0a0503" strokeWidth="0.8"/>
            <ellipse cx="180" cy={y - 4} rx="84" ry="3" fill="#FBF6EA" opacity="0.85"/>
            <ellipse cx="180" cy={y - 8} rx="84" ry="9" fill="url(#cookie-g)" stroke="#0a0503" strokeWidth="0.8"/>
          </g>
        );
      })}

      {/* glass shine */}
      <rect x="70" y="84" width="220" height="178" fill="url(#glass)" pointerEvents="none"/>
    </svg>
  );
}

function AllocStack({ items, seen }) {
  const max = 5; // $B-ish scale anchor
  return (
    <div style={{display:'flex', flexDirection:'column', gap:8}}>
      {items.map((it, i) => {
        const w = (it.v / max) * 100;
        const color = it.kind === 'in' ? 'var(--caramel)' : 'var(--cocoa-3)';
        return (
          <div key={it.label} style={{display:'flex', flexDirection:'column', gap:6}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
              <span style={{fontSize:13, color:'var(--cocoa-2)'}}>{it.label}</span>
              <span style={{fontFamily:'var(--font-display)', fontSize:22, color: it.kind==='in' ? 'var(--caramel)' : 'var(--cocoa)'}}>
                {it.kind==='in' ? '+' : '−'}${it.v.toFixed(2)}<span style={{fontSize:14}}>B</span>
              </span>
            </div>
            <div style={{height:6, background:'rgba(26,15,8,0.08)', borderRadius:3, overflow:'hidden'}}>
              <div style={{
                height:'100%',
                width: seen ? `${w}%` : '0%',
                background: color,
                transition: `width 900ms cubic-bezier(.22,1,.36,1) ${i*120}ms`,
              }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// COMPETITORS
// ============================================================
const COMPS = [
  { name:'MDLZ',     cap:73.39, rev:38.54, pe:null, growth:null, self:true, blurb:'Mondelez International' },
  { name:'HSY',      cap:39.04, rev:11.69, pe:44.20, growth:6.91, blurb:'Hershey · the rival, the once-target' },
  { name:'KDP',      cap:36.06, rev:16.60, pe:17.34, growth:8.16, blurb:'Keurig Dr Pepper · the converging neighbor' },
  { name:'FERRERO',  cap:null,  rev:null,  pe:null,  growth:null,  blurb:'Ferrero Group · private, Nutella-shaped' },
];

function Competitors() {
  const [ref, seen] = useInView({ threshold: 0.2 });
  const maxCap = 73.39;
  return (
    <section ref={ref} style={{padding:'80px 28px 80px', background:'var(--cream)'}}>
      <span className="eyebrow"><span className="dot"></span> The aisle · competitors</span>
      <h2 className="serif" style={{fontSize:42, marginTop:14, color:'var(--cocoa)'}}>
        Mondelez offered <span className="serif-it amber">$23B</span><br/>for Hershey in 2016.
      </h2>
      <p style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:18, color:'var(--cocoa-3)', marginTop:14, maxWidth:'34ch'}}>
        It didn't take. Today, MDLZ is nearly twice the size of its closest public rival.
      </p>

      {/* cookies of varying size */}
      <div style={{marginTop:36, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:10, paddingBottom:16, borderBottom:'1px solid var(--line)'}}>
        {COMPS.map((c, i) => {
          const size = c.cap ? Math.sqrt(c.cap / maxCap) * 110 : 50;
          const delay = i * 140;
          return (
            <div key={c.name} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10, flex:1}}>
              <CompCookie size={size} self={c.self} seen={seen} delay={delay} mystery={!c.cap}/>
              <div style={{textAlign:'center'}}>
                <div style={{fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.12em', color: c.self ? 'var(--caramel)' : 'var(--cocoa-3)'}}>{c.name}</div>
                <div style={{fontFamily:'var(--font-display)', fontSize:18, color:'var(--cocoa)', marginTop:2}}>
                  {c.cap ? `$${c.cap.toFixed(1)}B` : 'private'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* details */}
      <div style={{marginTop:8}}>
        {COMPS.filter(c => !c.self).map((c, i) => (
          <div key={c.name} style={{padding:'18px 0', borderBottom: i < 2 ? '1px solid var(--line)' : 'none'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
              <span style={{fontFamily:'var(--font-display)', fontSize:24, color:'var(--cocoa)'}}>{c.blurb.split(' · ')[0]}</span>
              <span style={{fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.14em', color:'var(--cocoa-4)'}}>{c.name}</span>
            </div>
            <div style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:14, color:'var(--cocoa-soft, #8B6849)', marginTop:2}}>
              {c.blurb.split(' · ')[1]}
            </div>
            {c.cap && (
              <div style={{display:'flex', gap:18, marginTop:12, fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.06em', color:'var(--cocoa-2)'}}>
                <span>Rev <span style={{color:'var(--cocoa)'}}>${c.rev}B</span></span>
                <span>P/E <span style={{color:'var(--cocoa)'}}>{c.pe.toFixed(1)}</span></span>
                <span>YoY <span style={{color:'var(--caramel-deep, #9A5816)'}}>+{c.growth}%</span></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CompCookie({ size, self, seen, delay, mystery }) {
  const s = Math.max(size, 30);
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{
      transition: `transform 700ms cubic-bezier(.34,1.56,.64,1) ${delay}ms, opacity 500ms ${delay}ms`,
      transform: seen ? 'scale(1)' : 'scale(0.4)',
      opacity: seen ? 1 : 0,
    }}>
      <defs>
        <radialGradient id={`waf-${size}`} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor={self ? '#D9A441' : '#3a2418'}/>
          <stop offset="100%" stopColor={self ? '#9A5816' : '#150a06'}/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={mystery ? 'rgba(26,15,8,0.18)' : `url(#waf-${size})`} stroke={self ? '#7A4313' : '#0a0503'} strokeWidth={self ? 2 : 1} strokeDasharray={mystery ? '3 3' : ''}/>
      {!mystery && Array.from({length:12}).map((_, i) => {
        const a = (i/12) * Math.PI * 2;
        return <circle key={i} cx={50+Math.cos(a)*36} cy={50+Math.sin(a)*36} r={2.5} fill={self ? '#5A2F08' : '#0a0503'}/>;
      })}
      {self && <text x="50" y="55" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="14" fill="#3D2316">us</text>}
      {mystery && <text x="50" y="56" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="22" fill="var(--cocoa-3)">?</text>}
    </svg>
  );
}

// ============================================================
// CLOSE — invert the open
// ============================================================
function Close() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  return (
    <section ref={ref} style={{padding:'88px 28px 80px', background:'radial-gradient(120% 80% at 50% 30%, #FBF6EA 0%, #F4ECDB 60%, #EADFC7 100%)', textAlign:'left'}}>
      <span className="eyebrow"><span className="dot"></span> The takeaway</span>
      <h2 className="serif" style={{fontSize:54, marginTop:16, color:'var(--cocoa)', letterSpacing:'-0.03em', lineHeight:0.94}}>
        Eight billion in.
        <br/>
        <span className="serif-it amber"><CountUp to={9.2} decimals={1} trigger={seen}/>¢</span> out.
      </h2>
      <p style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:20, color:'var(--cocoa-3)', marginTop:22, maxWidth:'32ch', lineHeight:1.32}}>
        Mondelez sells the world's snack. The world keeps buying. The cocoa bill keeps coming. And somewhere in Chicago, a board has $9 billion ready to spend on its own shares — <span className="amber" style={{fontStyle:'normal'}}>betting on the next bite.</span>
      </p>

      {/* a final cookie, full-bleed-ish */}
      <div style={{marginTop:42, opacity:0.95}}>
        <FinalCookie seen={seen}/>
      </div>
    </section>
  );
}

function FinalCookie({ seen }) {
  return (
    <svg viewBox="0 0 360 200" width="100%" style={{display:'block'}}>
      <defs>
        <radialGradient id="fc" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor="#3a2418"/>
          <stop offset="100%" stopColor="#0d0604"/>
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="180" rx="130" ry="10" fill="#1A0F08" opacity="0.16"/>
      <g style={{transition:'transform 1200ms cubic-bezier(.22,1,.36,1)', transform: seen ? 'translateY(0)' : 'translateY(20px)'}}>
        <circle cx="180" cy="100" r="92" fill="url(#fc)"/>
        <circle cx="180" cy="100" r="90" fill="none" stroke="#0a0503" opacity="0.5"/>
        {Array.from({length:18}).map((_, i) => {
          const a = (i/18) * Math.PI * 2;
          const x1 = 180 + Math.cos(a)*82;
          const y1 = 100 + Math.sin(a)*82;
          const x2 = 180 + Math.cos(a)*88;
          const y2 = 100 + Math.sin(a)*88;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0a0503" strokeWidth="1.5"/>;
        })}
        {Array.from({length:12}).map((_, i) => {
          const a = (i/12) * Math.PI * 2;
          return <circle key={i} cx={180+Math.cos(a)*64} cy={100+Math.sin(a)*64} r={4} fill="#0a0503"/>;
        })}
        <circle cx="180" cy="100" r="28" fill="none" stroke="#0a0503" opacity="0.55"/>
        <text x="180" y="106" textAnchor="middle" fontFamily="Instrument Serif" fontStyle="italic" fontSize="20" fill="var(--caramel-bright)">MDLZ.</text>
      </g>
    </svg>
  );
}

// ============================================================
// CHROME
// ============================================================
function Chrome() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="chrome">
      <div className="chrome-row">
        <div className="chrome-left">
          <span className="chrome-ticker">MDLZ</span>
          <span className="chrome-name">Mondelez Intl.</span>
        </div>
        <span className="chrome-label">Recap · FY '25</span>
      </div>
      <div className="chrome-progress">
        <div className="chrome-progress-bar" style={{width: `${pct}%`}}/>
      </div>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Foot() {
  return (
    <footer className="foot">
      <div style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:24, color:'var(--milk)', lineHeight:1.25, letterSpacing:'-0.01em', maxWidth:'30ch'}}>
        A recap, not a recommendation. Numbers from the FY 2025 reporting period.
      </div>
      <div style={{marginTop:32, display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span className="small">MDLZ · NASDAQ</span>
        <span className="small">↑ Back to top</span>
      </div>
    </footer>
  );
}

// ============================================================
// APP
// ============================================================
function App() {
  return (
    <div className="stage" data-screen-label="01 MDLZ Recap">
      <Chrome/>
      <Hero/>

      <Reset dark>
        Two wafers, one filling. The wafers are the world's pantries; the filling is <em>sugar, scale, and time.</em>
      </Reset>

      <Scale/>

      <Reset cream>
        The shelf is enormous. <em>The shelf is the moat.</em>
      </Reset>

      <Categories/>

      <Reset dark>
        But every cookie has a cost. <em>And in 2025, cocoa was the bill.</em>
      </Reset>

      <Margins/>

      <Reset cream>
        If chocolate is the headache, <em>biscuits are the painkiller</em> — and the war chest pays for both.
      </Reset>

      <Footprint/>

      <TheBet/>

      <Reset dark>
        You don't reach 150 countries by being polite about <em>the aisle next door.</em>
      </Reset>

      <Competitors/>

      <Close/>

      <Foot/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

// COSTS — building cross-section.
// We render the cost breakdown as a *building section* — floors stacked,
// each floor's height proportional to its share, colored by the supplied hex.
// Tap a floor to expand it (additive detail, not gating).

const Costs = () => {
  const ref = React.useRef(null);
  const [t, setT] = React.useState(0);
  const [open, setOpen] = React.useState(null);

  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh*0.4;
      const seen = Math.min(Math.max(vh - r.top, 0), total);
      setT(seen / total);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ordered for narrative — biggest to smallest
  const costs = [
    { pct:18, color:'#4F86C6', label:'Property Operating',  detail:'Utilities, security, maintenance, on-site staff. The cost of keeping the doors open.' },
    { pct:16, color:'#F4845F', label:'Depreciation & Amort.', detail:'Non-cash. The slow accounting of buildings becoming older.' },
    { pct:15, color:'#6DBF67', label:'Interest Expense',     detail:'$26B in debt charges rent, too. This is what it costs.' },
    { pct:5,  color:'#FBBF24', label:'Real Estate Taxes',    detail:'Owned land, owed taxes — every year, every parcel.' },
    { pct:4,  color:'#A78BFA', label:'General & Admin.',     detail:'Headquarters in Indianapolis. ~3,000 employees on payroll.' },
  ];
  const totalPct = costs.reduce((a,c)=>a+c.pct,0); // 58

  return (
    <section ref={ref} className="band-paper-2" style={{padding:'56px 0 48px', position:'relative', overflow:'hidden'}}>
      <div style={{padding:'0 24px 12px'}}>
        <div className="eyebrow"><span className="bar"></span><span>Where it goes · <span className="sig">{totalPct}¢ on the dollar</span></span></div>
        <h2 className="display" style={{fontSize:'40px', marginTop:14}}>
          A building, in cross-section.<br/>
          <em>This is what holds it up.</em>
        </h2>
        <p className="lede" style={{marginTop:14}}>
          Of every revenue dollar, <em className="signal">{totalPct} cents</em> are spent before profit shows up. Stacked floor-by-floor, the biggest line is the floor below your feet.
        </p>
      </div>

      {/* The building */}
      <div style={{padding:'28px 32px 0', display:'flex', gap:18}}>
        {/* Section drawing */}
        <div style={{flex:'0 0 150px'}}>
          <BuildingSection costs={costs} t={t} open={open}/>
        </div>

        {/* Legend / floor labels */}
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', paddingTop:8, paddingBottom:14}}>
          {costs.map((c,i)=>(
            <div key={i} className="tap" onClick={()=>setOpen(open===i?null:i)}
                 style={{padding:'6px 0', cursor:'pointer'}}>
              <div className="row center gap-2">
                <span style={{width:10, height:10, background:c.color, display:'inline-block', borderRadius:2}}/>
                <span className="mono" style={{fontSize:10.5, letterSpacing:'0.06em', color:'var(--ink-2)'}}>{c.pct}%</span>
              </div>
              <div style={{fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500, color:'var(--brand-ink)', marginTop:2}}>
                {c.label}
              </div>
              {open===i && (
                <div className="small" style={{marginTop:6, fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:13, color:'var(--ink-2)', lineHeight:1.35}}>
                  {c.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:'18px 24px 0'}}>
        <span className="tap-hint">tap a floor to read its line</span>
      </div>

      {/* Closing line for this beat */}
      <div style={{padding:'34px 24px 0', display:'flex', alignItems:'baseline', gap:12}}>
        <div className="display tnum" style={{fontSize:'58px', lineHeight:0.9}}>
          42<span className="ital signal">¢</span>
        </div>
        <div className="mono" style={{fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-3)'}}>
          Make it to<br/>operating profit
        </div>
      </div>
    </section>
  );
};

const BuildingSection = ({ costs, t, open }) => {
  const W = 150, H = 460;
  const ground = 410;
  const totalPct = costs.reduce((a,c)=>a+c.pct,0);
  const floorBase = ground - 350; // top of building
  // each floor's pixel height proportional to its pct, summed to 350
  const totalH = 350;
  let acc = floorBase;
  const floors = costs.map((c,i)=>{
    const h = (c.pct/totalPct) * totalH;
    const seg = { ...c, y: acc, h };
    acc += h;
    return seg;
  });
  // reveal floors progressively with t
  const reveal = Math.min(1, t*1.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{display:'block'}}>
      {/* ground line */}
      <line x1="0" y1={ground} x2={W} y2={ground} stroke="#1B2433" strokeWidth="1.2"/>
      {/* tiny ground hatch */}
      <g stroke="#1B2433" strokeOpacity="0.4" strokeWidth="0.8">
        {[...Array(10)].map((_,i)=>(
          <line key={i} x1={i*15} y1={ground} x2={i*15+8} y2={ground+8}/>
        ))}
      </g>
      {/* roof crown */}
      <line x1="20" y1={floorBase-6} x2={W-20} y2={floorBase-6} stroke="#1B2433" strokeOpacity="0.4"/>

      {/* Floors stacked */}
      {floors.map((f,i)=>{
        const visible = (i+1)/floors.length <= reveal + 0.05;
        const isOpen = open === i;
        return (
          <g key={i} opacity={visible ? 1 : 0.05}>
            <rect x="20" y={f.y} width={W-40} height={f.h-1.5}
                  fill={f.color} fillOpacity={isOpen ? 0.95 : 0.78}
                  stroke="#1B2433" strokeOpacity="0.5" strokeWidth="0.8"/>
            {/* windows on each floor */}
            {[...Array(Math.max(1, Math.round(f.h/14)))].map((_,wi)=>(
              <rect key={wi} x={28} y={f.y+6+wi*12} width={W-56} height={4}
                    fill="#FBFAF7" fillOpacity={visible?0.4:0.1}/>
            ))}
            <text x={26} y={f.y+12} fontFamily="Geist Mono, monospace" fontSize="7"
                  fill="#1B2433" fillOpacity="0.7" letterSpacing="0.5">
              FL {floors.length-i}
            </text>
            <text x={W-26} y={f.y+12} textAnchor="end"
                  fontFamily="Geist, sans-serif" fontSize="9" fontWeight="600"
                  fill="#1B2433" fillOpacity="0.9">
              {f.pct}%
            </text>
          </g>
        );
      })}

      {/* tiny entrance at bottom */}
      <rect x={W/2-9} y={ground-14} width="18" height="14" fill="#1B2433" fillOpacity="0.85"/>
      {/* coral signal — a person walking in */}
      <circle cx={W/2 - 22} cy={ground-4} r="2" fill="#F25A37"/>
    </svg>
  );
};

window.Costs = Costs;

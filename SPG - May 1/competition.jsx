// COMPETITION — adjacent buildings on the same block.
// Each rival is drawn as a tower, sized by market cap; SPG towers in the middle.
// Tap a rival to expand and read its line.

const Competition = () => {
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

  const rivals = [
    { ticker:'BAM', name:'Brookfield AM', cap:80.79, rev:3.94, growth:'+883.6%', pe:32.5,
      note:'Through Brookfield Properties Retail (former GGP malls), the most strategically significant head-to-head competitor in the Class A mall segment.' },
    { ticker:'SPG', name:'Simon Property', cap:65.41, rev:5.66, growth:'—', pe:null,
      note:'You are here.', self:true },
    { ticker:'O',   name:'Realty Income', cap:60.27, rev:5.75, growth:'+9.07%', pe:56.9,
      note:'Net-lease retail — freestanding stores that directly substitute for mall-based formats.' },
    { ticker:'PSA', name:'Public Storage', cap:52.96, rev:4.82, growth:'+2.74%', pe:29.7,
      note:'Not a retail competitor — a sector competitor, fighting for the same income-focused REIT investor.' },
  ];

  // shared scale: max market cap maps to max tower height
  const maxCap = Math.max(...rivals.map(r=>r.cap));

  return (
    <section ref={ref} className="band-paper-2" style={{padding:'56px 0 48px', position:'relative', overflow:'hidden'}}>
      <div style={{padding:'0 24px 12px'}}>
        <div className="eyebrow"><span className="bar"></span><span>The block · <span className="sig">neighbors</span></span></div>
        <h2 className="display" style={{fontSize:'40px', marginTop:14}}>
          The block, as drawn.<br/>
          <em>Four towers. One landlord.</em>
        </h2>
        <p className="lede" style={{marginTop:14}}>
          Sized by <em>market cap.</em> One stands alone in mall real estate. The others compete for the <em>same dollar</em> of REIT capital from a different angle.
        </p>
      </div>

      {/* Skyline */}
      <div style={{padding:'30px 18px 0'}}>
        <Skyline rivals={rivals} maxCap={maxCap} t={t} open={open} setOpen={setOpen}/>
      </div>

      {/* Detail rows */}
      <div style={{padding:'8px 24px 0'}}>
        {rivals.map((r,i)=>(
          <div key={i}
               className="tap"
               onClick={()=>setOpen(open===i?null:i)}
               style={{
                 padding:'14px 0',
                 borderTop:i?'1px solid var(--brand-line)':'none',
                 background: r.self ? 'transparent' : 'transparent'
               }}>
            <div className="row between center">
              <div className="row center gap-3">
                <span className="mono"
                      style={{fontSize:11, letterSpacing:'0.08em',
                              color: r.self ? 'var(--signal-deep)' : 'var(--brand-ink)',
                              fontWeight:600}}>
                  {r.ticker}
                </span>
                <span style={{fontFamily:'var(--font-sans)', fontSize:13, color: r.self?'var(--signal-deep)':'var(--ink-2)'}}>
                  {r.name}
                </span>
              </div>
              <div className="row center gap-3">
                <span className="display tnum" style={{fontSize:'22px', color:'var(--brand-ink)'}}>
                  ${r.cap.toFixed(1)}<span className="ital" style={{fontSize:14, color:'var(--ink-3)'}}>B</span>
                </span>
              </div>
            </div>
            {open===i && (
              <div className="small" style={{marginTop:8, fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:14, color:'var(--ink-2)', lineHeight:1.4}}>
                {r.note}
                {!r.self && (
                  <div className="row gap-4" style={{marginTop:8, fontFamily:'var(--font-mono)', fontStyle:'normal', fontSize:10.5, color:'var(--ink-3)', letterSpacing:'0.06em'}}>
                    <span>REV ${r.rev}B</span>
                    <span>YOY {r.growth}</span>
                    <span>P/E {r.pe}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div style={{paddingTop:8}}>
          <span className="tap-hint">tap a row to read the relationship</span>
        </div>
      </div>
    </section>
  );
};

const Skyline = ({ rivals, maxCap, t, open, setOpen }) => {
  const W = 374, H = 240;
  const ground = 220;
  const slot = W / rivals.length;
  const grow = Math.min(1, t*1.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{display:'block'}}>
      {/* ground */}
      <line x1="0" y1={ground} x2={W} y2={ground} stroke="#1B2433" strokeWidth="1.1"/>
      <g stroke="#1B2433" strokeOpacity="0.4" strokeWidth="0.7">
        {[...Array(20)].map((_,i)=>(
          <line key={i} x1={i*20} y1={ground} x2={i*20+8} y2={ground+8}/>
        ))}
      </g>

      {rivals.map((r,i)=>{
        const h = (r.cap/maxCap) * 180 * grow;
        const x = i*slot + slot*0.18;
        const w = slot*0.64;
        const y = ground - h;
        const isSelf = r.self;
        const isOpen = open === i;
        return (
          <g key={i}
             style={{cursor:'pointer'}}
             onClick={()=>setOpen(isOpen?null:i)}>
            <rect x={x} y={y} width={w} height={h}
                  fill={isSelf ? '#F25A37' : '#1B2433'}
                  fillOpacity={isOpen ? 0.95 : (isSelf ? 0.92 : 0.85)}
                  stroke={isSelf ? '#A7311A' : '#1B2433'} strokeWidth="0.8"/>
            {/* windows grid */}
            {h > 30 && [...Array(Math.floor(h/14))].map((_,row)=>(
              [...Array(3)].map((_,col)=>(
                <rect key={row+'-'+col}
                      x={x + 4 + col*((w-8)/3)}
                      y={y + 6 + row*14}
                      width={(w-12)/3} height={5}
                      fill={isSelf ? '#FFDFD3' : '#FBFAF7'}
                      fillOpacity={0.45}/>
              ))
            ))}
            {/* ticker label */}
            <text x={x+w/2} y={ground+18}
                  textAnchor="middle"
                  fontFamily="Geist Mono, monospace" fontSize="10"
                  fontWeight="600"
                  fill={isSelf ? '#F25A37' : '#1B2433'}
                  letterSpacing="0.6">
              {r.ticker}
            </text>
            {/* market cap on top */}
            <text x={x+w/2} y={y-6}
                  textAnchor="middle"
                  fontFamily="Instrument Serif, serif"
                  fontSize="13" fontStyle="italic"
                  fill={isSelf ? '#F25A37' : '#1B2433'}>
              ${r.cap.toFixed(0)}B
            </text>
          </g>
        );
      })}
    </svg>
  );
};

window.Competition = Competition;

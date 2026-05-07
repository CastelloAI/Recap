// FOOTPRINT — geographic distribution as parcels of plan-paper land.
// US gets the giant lot, then Europe, Asia, Canada as smaller plots.
// Sized proportionally; coral pin for SPG HQ in Indianapolis.

const Footprint = () => {
  const ref = React.useRef(null);
  const [t, setT] = React.useState(0);

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

  const reveal = Math.min(1, t*1.4);

  // 374 wide, 280 tall. We'll partition into a treemap-ish layout.
  const regions = [
    { pct:85, region:'United States',  x:0,  y:0,    w:262, h:280, color:'#1B2433', text:'#FBFAF7' },
    { pct:9,  region:'Europe',         x:262,y:0,    w:112, h:148, color:'#4F86C6', text:'#FBFAF7' },
    { pct:4,  region:'Asia',           x:262,y:148,  w:112, h:80,  color:'#F4845F', text:'#FBFAF7' },
    { pct:2,  region:'Canada & Other', x:262,y:228,  w:112, h:52,  color:'#A78BFA', text:'#FBFAF7' },
  ];

  return (
    <section ref={ref} className="band-paper" style={{padding:'56px 0 48px', position:'relative', overflow:'hidden'}}>
      <div className="grain"></div>
      <div style={{padding:'0 24px 12px'}}>
        <div className="eyebrow"><span className="bar"></span><span>The footprint · <span className="sig">85% domestic</span></span></div>
        <h2 className="display" style={{fontSize:'40px', marginTop:14}}>
          Mostly <em>American</em><br/>ground.
        </h2>
        <p className="lede" style={{marginTop:14}}>
          Premium Outlets, malls, and The Mills — the bulk sit on US lots. Europe and Asia round out the portfolio in smaller parcels.
        </p>
      </div>

      <div style={{padding:'24px 24px 0'}}>
        <svg viewBox="0 0 374 280" width="100%" height="auto" style={{display:'block', border:'1px solid var(--brand-line)'}}>
          {regions.map((r,i)=>{
            const opacity = i < reveal*4 + 0.5 ? 1 : 0.05;
            return (
              <g key={i} opacity={opacity}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color}/>
                {/* subtle hatch grid for plan-paper feel */}
                <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="url(#planHatch)" opacity="0.3"/>
                <text x={r.x+12} y={r.y+22}
                      fontFamily="Geist Mono, monospace" fontSize="9.5" letterSpacing="1.5"
                      fill={r.text} fillOpacity="0.7">
                  {r.region.toUpperCase()}
                </text>
                <text x={r.x+12} y={r.y+52}
                      fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize={r.pct>20?42:r.pct>5?22:16}
                      fill={r.text}>
                  {r.pct}%
                </text>
              </g>
            );
          })}
          <defs>
            <pattern id="planHatch" width="14" height="14" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="14" y2="14" stroke="#FBFAF7" strokeOpacity="0.12" strokeWidth="0.6"/>
            </pattern>
          </defs>

          {/* HQ pin in Indianapolis — middle of the US block */}
          <g transform="translate(112, 130)">
            <circle r="14" fill="none" stroke="#FF7A57" strokeOpacity="0.5"/>
            <circle r="4" fill="#FF7A57"/>
            <text x="10" y="4" fontFamily="Geist Mono, monospace" fontSize="8.5" letterSpacing="1.2" fill="#FBFAF7">
              HQ · INDIANAPOLIS
            </text>
          </g>
        </svg>

        <p className="lede" style={{marginTop:18}}>
          Headquarters at <em>225 W Washington St,</em> Indianapolis — same city the Simon brothers built the first strip mall in.
        </p>
      </div>
    </section>
  );
};

window.Footprint = Footprint;

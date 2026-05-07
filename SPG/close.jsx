// CLOSE — inverts the open.
// We opened with "America still walks in" and the $5.66B revenue figure.
// We close with what survives the hand-offs: $26B in debt holds up $65B in market cap;
// $0.42 of every dollar makes it past property costs to operating profit.

const Close = () => {
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

  return (
    <>
      <div className="reset">
        <div className="text">
          So what survives the walk-in, the lease, the slab, and the dividend?
        </div>
      </div>

      <section ref={ref} className="band-paper" style={{padding:'72px 0 80px', position:'relative', overflow:'hidden'}}>
        <div className="grain"></div>
        <div style={{padding:'0 24px 12px'}}>
          <div className="eyebrow"><span className="bar"></span><span>The takeaway</span></div>
          <h2 className="display" style={{fontSize:'48px', marginTop:14, lineHeight:0.96}}>
            <em>$26B</em> of debt<br/>
            holds up<br/>
            <span className="signal" style={{fontStyle:'italic'}}>$65B</span> of market cap.
          </h2>
          <p className="lede" style={{marginTop:18}}>
            <em>The landlord stands.</em> Through e-commerce, through the retail apocalypse, through whatever's next on the storefronts. Sixty-five years of leases. One company at the center.
          </p>
        </div>

        {/* The closing diagram — the floor plate from the hero, returned, smaller, with the survival number */}
        <div style={{padding:'30px 24px 0'}}>
          <svg viewBox="0 0 374 220" width="100%" height="auto" style={{display:'block'}}>
            {/* outer plot reduced */}
            <rect x="40" y="20" width="294" height="160" fill="none" stroke="#1B2433" strokeWidth="1" strokeOpacity="0.6"/>
            {/* inner plaza */}
            <rect x="120" y="60" width="134" height="80" fill="#FFDFD3" fillOpacity={0.4 + 0.3*Math.sin(t*Math.PI*2)}/>
            {/* you are here */}
            <circle cx="187" cy="100" r="4" fill="#F25A37"/>
            <circle cx="187" cy="100" r={6 + 4*Math.sin(t*4)} fill="none" stroke="#F25A37" strokeOpacity="0.4"/>
            {/* a few residual foot-traffic dots, slow */}
            {[...Array(8)].map((_,i)=>{
              const p = ((t*0.4) + i/8) % 1;
              const ang = (i/8)*Math.PI*2;
              const r = 90 - p*70;
              return <circle key={i} cx={187+Math.cos(ang)*r} cy={100+Math.sin(ang)*r*0.55} r="1.4" fill="#1B2433" opacity={0.5*(1-p)}/>;
            })}
            <text x="60" y="38" fontFamily="Geist Mono, monospace" fontSize="8" fill="#1B2433" fillOpacity="0.6" letterSpacing="0.5">
              SIMON · CENTER
            </text>
            <text x="320" y="200" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="8" fill="#1B2433" fillOpacity="0.5" letterSpacing="0.5">
              FY '23 · STILL HERE
            </text>
          </svg>
        </div>

        {/* A row that mirrors the hero's revenue figure, but for survival */}
        <div style={{padding:'30px 24px 0'}}>
          <div className="row" style={{borderTop:'1px solid var(--brand-line)', borderBottom:'1px solid var(--brand-line)'}}>
            <Closer top="$0.42" bot="Cents past property costs"/>
            <Closer top="$3.14B" bot="Free cash flow"/>
            <Closer top="$2.0B" bot="Coming back · 2026" last/>
          </div>
        </div>

        <p className="lede" style={{padding:'28px 24px 0'}}>
          The hero opened with <em>$5.66B walking in.</em> The page closes with what makes it back to shareholders — a dividend, a buyback, and the quiet permanence of being the largest landlord on the floor.
        </p>

        {/* Footer */}
        <div style={{padding:'48px 24px 0'}}>
          <div style={{borderTop:'1px solid var(--brand-rule)', paddingTop:18}}>
            <div className="mono" style={{fontSize:10, letterSpacing:'0.16em', color:'var(--ink-3)'}}>
              SIMON PROPERTY GROUP · NYSE: SPG
            </div>
            <div className="mono" style={{fontSize:9.5, letterSpacing:'0.14em', color:'var(--ink-4)', marginTop:6}}>
              Recap · FY '23 · Generated from filings
            </div>
          </div>
        </div>

        <div className="pad-bottom"/>
      </section>
    </>
  );
};

const Closer = ({ top, bot, last }) => (
  <div style={{flex:1, padding:'18px 6px',
       borderRight: last ? 'none' : '1px solid var(--brand-line)'}}>
    <div className="display tnum" style={{fontSize:'24px', color:'var(--brand-ink)'}}>{top}</div>
    <div className="mono" style={{fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-3)', marginTop:6, lineHeight:1.4}}>{bot}</div>
  </div>
);

window.Close = Close;

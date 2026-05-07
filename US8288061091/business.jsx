// BUSINESS + SCALE
// "How it makes money" — a single floor plate filling with tenants as you scroll.
// Each tenant is a rectangle that gets stamped down with a rent figure flowing up.
// Followed by the scale beat: count-up market cap, op margin gauge, employee row.

const Business = () => {
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

  // 24 tenant slots fill in order of t
  const tenants = React.useMemo(() => {
    const out = [];
    for (let r=0; r<6; r++){
      for (let c=0; c<4; c++){
        out.push({
          x: 30 + c*84, y: 30 + r*48,
          w: 76, h: 40,
          order: r*4 + c
        });
      }
    }
    return out;
  }, []);

  const filled = Math.floor(t * tenants.length * 1.6);

  return (
    <>
      {/* Reset beat */}
      <div className="reset">
        <div className="text">
          You don't build a portfolio of <span className="signal">three hundred properties</span> by accident — you sign the leases, one storefront at a time.
        </div>
      </div>

      <section ref={ref} className="band-paper" style={{padding:'56px 0 40px', position:'relative', overflow:'hidden'}}>
        <div className="grain"></div>
        <div style={{padding:'0 24px 12px'}}>
          <div className="eyebrow"><span className="bar"></span><span>The business · <span className="sig">leases</span></span></div>
          <h2 className="display" style={{fontSize:'40px', marginTop:14}}>
            One floor plate.<br/>
            <em>Every storefront pays rent.</em>
          </h2>
          <p className="lede" style={{marginTop:14}}>
            Lease income carries the model. <em>Tenant reimbursements, management fees,</em> and a stake or two in the retailers themselves fill in the rest.
          </p>
        </div>

        <div style={{position:'relative', padding:'12px 20px 0'}}>
          <svg viewBox="0 0 374 320" width="100%" height="auto" style={{display:'block'}}>
            <rect x="20" y="20" width="334" height="290" fill="none" stroke="#1B2433" strokeWidth="1" strokeOpacity="0.55"/>
            {tenants.map((te, i) => {
              const on = i < filled;
              return (
                <g key={i} transform={`translate(${te.x},${te.y})`} opacity={on?1:0.18}>
                  <rect x="0" y="0" width={te.w} height={te.h}
                    fill={on ? (i%9===0 ? '#FF7A57' : '#1B2433') : 'none'}
                    fillOpacity={i%9===0 ? 0.85 : 0.08}
                    stroke="#1B2433" strokeOpacity="0.5" strokeWidth="0.8"/>
                  <text x="6" y="13" fontFamily="Geist Mono, monospace" fontSize="6"
                        fill={i%9===0 ? '#FFF1EC' : '#1B2433'} fillOpacity={i%9===0 ? 0.95 : 0.55}>
                    UNIT · {String(i+1).padStart(2,'0')}
                  </text>
                  <text x="6" y="32" fontFamily="Geist, sans-serif" fontSize="9"
                        fill={i%9===0 ? '#FFF1EC' : '#1B2433'} fillOpacity={i%9===0 ? 0.95 : 0.7}>
                    {tenantName(i)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Scale row */}
        <div style={{padding:'40px 24px 0'}}>
          <div className="eyebrow"><span className="bar"></span><span>The scale</span></div>

          <div className="row" style={{alignItems:'baseline', gap:14, marginTop:16}}>
            <div className="display tnum" style={{fontSize:'68px', lineHeight:0.9}}>
              $65.41<span className="ital signal">B</span>
            </div>
          </div>
          <div className="mono" style={{fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-3)', marginTop:6}}>
            Market cap · S&P 100 component
          </div>

          {/* Operating margin gauge */}
          <div style={{marginTop:32}}>
            <div className="mono" style={{fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-3)'}}>
              Operating margin
            </div>
            <Gauge value={49.6} t={t}/>
            <p className="lede" style={{marginTop:10}}>
              <em>Forty-nine point six cents</em> of every revenue dollar makes it past property operating costs. Asset-light, by REIT standards.
            </p>
          </div>

          {/* Three vital signs */}
          <div className="row" style={{marginTop:36, borderTop:'1px solid var(--brand-line)'}}>
            <Vital n="3,000" label="Employees" />
            <Vital n="1993" label="IPO · NYSE" />
            <Vital n="1960" label="Founded · IN" last/>
          </div>

          <p className="lede" style={{marginTop:24}}>
            Built by <em>Melvin and Herbert Simon</em> in Indianapolis, who started with strip malls and ended up with the country's premier shopping destinations.
          </p>
        </div>
      </section>
    </>
  );
};

const tenantName = (i) => {
  const names = ['Apparel','Beauty','Café','Denim','Eyewear','Footwear','Gallery','Home',
    'Jeweler','Kids','Linen','Mens','Notions','Optical','Press','Quilts',
    'Records','Sports','Toys','Urban','Vintage','Wine','Xpress','Yoga'];
  return names[i % names.length];
};

const Gauge = ({ value, t }) => {
  // half-arc gauge from 0 to 100, animated draw
  const r = 80, cx = 100, cy = 90;
  const total = Math.PI; // semicircle
  const drawProgress = Math.min(1, t * 2.4);
  const valueAngle = (value/100) * total * drawProgress;
  const path = (a0, a1) => {
    const x0 = cx + r*Math.cos(Math.PI - a0);
    const y0 = cy - r*Math.sin(Math.PI - a0);
    const x1 = cx + r*Math.cos(Math.PI - a1);
    const y1 = cy - r*Math.sin(Math.PI - a1);
    const large = a1-a0 > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };
  return (
    <svg viewBox="0 0 200 110" width="100%" height="auto" style={{display:'block', marginTop:8}}>
      {/* track */}
      <path d={path(0, total)} fill="none" stroke="#D8D2C4" strokeWidth="10" strokeLinecap="round"/>
      {/* value */}
      <path d={path(0, valueAngle)} fill="none" stroke="#F25A37" strokeWidth="10" strokeLinecap="round"/>
      {/* tick at 100 */}
      <text x="195" y="100" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="8" fill="#6B6A65">100%</text>
      <text x="5" y="100" fontFamily="Geist Mono, monospace" fontSize="8" fill="#6B6A65">0%</text>
      <text x="100" y="80" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="36" fill="#1B2433">
        {(value*drawProgress).toFixed(1)}<tspan fontSize="18" fill="#F25A37">%</tspan>
      </text>
    </svg>
  );
};

const Vital = ({ n, label, last }) => (
  <div style={{flex:1, padding:'18px 4px', borderRight: last?'none':'1px solid var(--brand-line)'}}>
    <div className="display tnum" style={{fontSize:'30px', lineHeight:1}}>{n}</div>
    <div className="mono" style={{fontSize:9.5, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-3)', marginTop:6}}>{label}</div>
  </div>
);

window.Business = Business;

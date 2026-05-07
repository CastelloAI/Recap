// THE WEIGHT — dark interlude. The earned tonal departure of the page.
// A structural beam: $26B debt as a heavy slab compressing $3B of equity
// underneath. The number bleeds in coral.

const Weight = () => {
  const ref = React.useRef(null);
  const [t, setT] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh*0.3;
      const seen = Math.min(Math.max(vh - r.top, 0), total);
      setT(seen / total);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // beam compression ratio — equity squashes as scroll progresses
  const press = Math.min(1, t*1.5);

  return (
    <>
      {/* Reset beat (italic on paper) */}
      <div className="reset">
        <div className="text">
          Real estate is built on borrowed money. <span className="signal">All of it.</span> The question is only how much, and at what rate.
        </div>
      </div>

      <section ref={ref} className="band-ink" style={{padding:'72px 0 80px', position:'relative', overflow:'hidden'}}>
        <div style={{padding:'0 24px 12px'}}>
          <div className="eyebrow" style={{color:'rgba(246,242,234,0.6)'}}>
            <span className="bar" style={{background:'rgba(246,242,234,0.35)'}}></span>
            <span>The weight · <span style={{color:'var(--coral-300)'}}>$26B</span></span>
          </div>
          <h2 className="display" style={{fontSize:'42px', marginTop:14, color:'var(--brand-paper)'}}>
            Twenty-six billion<br/>
            <em style={{color:'var(--coral-300)'}}>presses down.</em>
          </h2>
          <p className="lede" style={{marginTop:14, color:'rgba(246,242,234,0.78)'}}>
            <em style={{color:'var(--brand-paper)', fontFamily:'var(--font-display)', fontStyle:'italic'}}>$26.03B</em> in total debt sits on top of just <em style={{color:'var(--brand-paper)', fontFamily:'var(--font-display)', fontStyle:'italic'}}>$3.02B</em> in equity. That is the REIT bargain — leverage in exchange for tax-advantaged distributions.
          </p>
        </div>

        {/* The beam diagram */}
        <div style={{padding:'24px 30px 0'}}>
          <svg viewBox="0 0 354 320" width="100%" height="auto" style={{display:'block'}}>
            {/* Top arrow indicating downward force */}
            <g stroke="rgba(255,158,130,0.6)" strokeWidth="1.1" fill="none">
              {[60, 130, 200, 270, 340].slice(0,5).map((x,i)=>(
                <g key={i}>
                  <line x1={x} y1="6" x2={x} y2={20+press*4}/>
                  <polyline points={`${x-3},${16+press*4} ${x},${22+press*4} ${x+3},${16+press*4}`}/>
                </g>
              ))}
            </g>

            {/* Debt slab — heavy, dark, coral edge */}
            <g>
              <rect x="20" y={28} width="314" height="80" fill="#0E1622" stroke="rgba(255,158,130,0.5)" strokeWidth="1"/>
              {/* hatched fill */}
              <defs>
                <pattern id="ihatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,158,130,0.18)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect x="20" y={28} width="314" height="80" fill="url(#ihatch)"/>
              <text x="34" y="58" fontFamily="Geist Mono, monospace" fontSize="10" letterSpacing="2" fill="rgba(246,242,234,0.7)">
                TOTAL DEBT
              </text>
              <text x="34" y="92" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="34" fill="#FF9E82">
                $26.03B
              </text>
              <text x="320" y="98" textAnchor="end" fontFamily="Geist Mono, monospace" fontSize="9" fill="rgba(246,242,234,0.45)">
                FY '23
              </text>
            </g>

            {/* Equity slab — compressed */}
            {(() => {
              const eqH = 26 - press*8; // 26 → 18 squeeze
              const eqY = 130 + press*6;
              return (
                <g>
                  <rect x="60" y={eqY} width="234" height={eqH}
                        fill="#FBFAF7" fillOpacity="0.92" stroke="rgba(246,242,234,0.4)"/>
                  <text x="70" y={eqY+eqH/2+4} fontFamily="Geist Mono, monospace" fontSize="9"
                        letterSpacing="2" fill="#1B2433">
                    EQUITY
                  </text>
                  <text x="284" y={eqY+eqH/2+4} textAnchor="end" fontFamily="Instrument Serif, serif"
                        fontStyle="italic" fontSize="14" fill="#1B2433">
                    $3.02B
                  </text>
                </g>
              );
            })()}

            {/* Cash cushion (small) */}
            <g>
              <rect x="100" y="180" width="154" height="14" fill="none" stroke="rgba(246,242,234,0.35)" strokeDasharray="2 3"/>
              <text x="108" y="190" fontFamily="Geist Mono, monospace" fontSize="8" fill="rgba(246,242,234,0.6)" letterSpacing="1.5">
                CASH · $1.17B
              </text>
            </g>

            {/* Ground / foundation */}
            <line x1="0" y1="220" x2="354" y2="220" stroke="rgba(246,242,234,0.4)" strokeWidth="1.2"/>
            {/* Foundation hatch */}
            <g stroke="rgba(246,242,234,0.25)" strokeWidth="0.8">
              {[...Array(20)].map((_,i)=>(
                <line key={i} x1={i*18} y1="220" x2={i*18+10} y2="232"/>
              ))}
            </g>

            {/* Cash flow arrows underground — the offset */}
            <g>
              <text x="177" y="262" textAnchor="middle" fontFamily="Geist Mono, monospace"
                    fontSize="10" letterSpacing="2" fill="rgba(246,242,234,0.55)">
                BUT THE PIPES STILL FLOW ↓
              </text>
              <text x="177" y="296" textAnchor="middle" fontFamily="Instrument Serif, serif"
                    fontStyle="italic" fontSize="32" fill="#FF9E82">
                $3.93B<tspan fontSize="14" fill="rgba(246,242,234,0.6)"> op cash</tspan>
              </text>
            </g>
          </svg>
        </div>

        <p className="lede" style={{padding:'20px 24px 0', color:'rgba(246,242,234,0.78)'}}>
          The slab presses down — but underneath, <em style={{color:'var(--coral-300)', fontFamily:'var(--font-display)', fontStyle:'italic'}}>$3.93B</em> of operating cash flows out, $3.14B free. Enough to pay the dividend, fund the redev, and start a $2B buyback in 2026.
        </p>

        {/* Three numbers tied to capital allocation */}
        <div className="row" style={{margin:'28px 16px 0', borderTop:'1px solid rgba(246,242,234,0.22)'}}>
          <DkVital n="60.4%" label="Payout ratio"/>
          <DkVital n="$793M" label="FY '23 capex"/>
          <DkVital n="$2.0B" label="Buyback · 2026" last/>
        </div>
      </section>
    </>
  );
};

const DkVital = ({ n, label, last }) => (
  <div style={{flex:1, padding:'18px 4px',
       borderRight: last ? 'none' : '1px solid rgba(246,242,234,0.22)'}}>
    <div className="display tnum" style={{fontSize:'26px', lineHeight:1, color:'var(--brand-paper)'}}>{n}</div>
    <div className="mono" style={{fontSize:9.5, letterSpacing:'0.14em', textTransform:'uppercase',
                                  color:'rgba(246,242,234,0.55)', marginTop:6}}>{label}</div>
  </div>
);

window.Weight = Weight;

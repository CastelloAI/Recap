// THE BET — capital allocation as parcels SPG owns
// $2B buyback · 22% Klepierre · 88% Taubman · steady dividend

const Bet = () => {
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
          The dividend is the deal. <span className="signal">The buyback is the conviction.</span>
        </div>
      </div>

      <section ref={ref} className="band-paper" style={{padding:'56px 0 48px', position:'relative', overflow:'hidden'}}>
        <div className="grain"></div>
        <div style={{padding:'0 24px 12px'}}>
          <div className="eyebrow"><span className="bar"></span><span>The bet · <span className="sig">consolidation</span></span></div>
          <h2 className="display" style={{fontSize:'40px', marginTop:14}}>
            Two stakes,<br/>
            <em>one buyback.</em>
          </h2>
          <p className="lede" style={{marginTop:14}}>
            SPG isn't just leasing — it's quietly assembling the publicly-traded mall map. Two minority positions, one majority, and a $2B vote of confidence in 2026.
          </p>
        </div>

        {/* Three "deeds" on the table */}
        <div style={{padding:'24px 24px 0', display:'flex', flexDirection:'column', gap:0}}>
          <Deed
            title="Taubman Realty Group"
            tag="MAJORITY"
            pct={88}
            note="Acquired-and-held majority stake. Adds Class A US malls."
            t={t} order={0}/>
          <Deed
            title="Klepierre"
            tag="MINORITY"
            pct={22}
            note="Roughly 22% of Europe's largest mall REIT. The continental shelf."
            t={t} order={1}/>
          <Deed
            title="Buyback program"
            tag="2026"
            amount="$2.0B"
            note="Announced 2026. Cash returned, share count down — the management vote."
            t={t} order={2}/>
        </div>

        <p className="lede" style={{padding:'30px 24px 0'}}>
          Plus the steady quarterly dividend at a <em className="signal">60.4% payout ratio</em> — paid through every retail apocalypse the headlines have written so far.
        </p>
      </section>
    </>
  );
};

const Deed = ({ title, tag, pct, amount, note, t, order }) => {
  // tile hatched like a deed/parcel; reveal staggered with t
  const visible = Math.min(1, Math.max(0, t*1.6 - order*0.18));
  return (
    <div style={{
      borderTop:'1px solid var(--brand-line)',
      padding:'22px 0 22px',
      opacity: 0.25 + 0.75*visible,
      transform:`translateY(${(1-visible)*8}px)`,
      transition:'transform 200ms var(--ease-out)'
    }}>
      <div className="row between center">
        <div className="mono" style={{fontSize:10, letterSpacing:'0.16em', color:'var(--ink-3)'}}>
          {tag}
        </div>
        <div className="mono" style={{fontSize:10, letterSpacing:'0.12em', color:'var(--signal-deep)'}}>
          DEED · {String(order+1).padStart(2,'0')}
        </div>
      </div>
      <div className="row between" style={{alignItems:'baseline', marginTop:8, gap:14}}>
        <div className="display" style={{fontSize:'22px', flex:1, color:'var(--brand-ink)'}}>{title}</div>
        <div className="display tnum" style={{fontSize:'40px', color:'var(--brand-ink)'}}>
          {pct ? <>{pct}<span className="ital signal">%</span></> : <span style={{color:'var(--signal-deep)', fontStyle:'italic'}}>{amount}</span>}
        </div>
      </div>
      <p className="small" style={{marginTop:8}}>{note}</p>
    </div>
  );
};

window.Bet = Bet;

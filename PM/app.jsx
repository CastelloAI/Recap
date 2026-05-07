const { useState, useEffect, useRef, useMemo } = React;

const COSTS = [
  { pct: 33, color: '#E05C5C', label: 'Cost of Revenue' },
  { pct: 19, color: '#5B8FF9', label: 'Marketing, Admin & Research' },
  { pct: 5,  color: '#5AD8A6', label: 'Depreciation & Amortization' },
  { pct: 5,  color: '#F6BD16', label: 'Income Tax Expense' },
  { pct: 3,  color: '#A371F7', label: 'Interest Expense (Net)' },
];

const GEO = [
  { pct: 42, region: 'European Union' },
  { pct: 30, region: 'South & Southeast Asia, CIS, Middle East / Africa' },
  { pct: 16, region: 'East Asia, Australia & Global Travel Retail' },
  { pct: 12, region: 'Americas' },
];

const COMPETITORS = [
  { name: 'Altria',          ticker: 'MO',   cap: 107.29, rev: '23.28B', pe: '15.44', growth: '-3.08%',
    note: 'Former parent. Exclusive U.S. licensee of Marlboro. PMI\u2019s ZYN aggressively captures U.S. nicotine pouch share against Altria\u2019s on!' },
  { name: 'British American', ticker: 'BTI',  cap: 89.90, rev: '12.07B', pe: '11.58', growth: '-0.99%',
    note: 'Direct global rival selling cigarettes, glo (heated tobacco), and Velo pouches across overlapping markets. Same combustible headwinds, head-to-head in smoke-free.' },
  { name: 'Monster Beverage', ticker: 'MNST', cap: 75.02, rev: '8.29B', pe: '39.37', growth: '+10.70%',
    note: 'Non-tobacco threat: competes for the same convenience-channel shelf and the stimulant occasion ZYN targets among adult consumers.' },
];

const PMI_CAP = 255.52;

// ---- Custom hooks ----
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function useElementProgress(ref) {
  // 0 when element top hits viewport bottom; 1 when element bottom passes top
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      setP(Math.max(0, Math.min(1, scrolled / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return p;
}

function useInView(ref, threshold = 0.2) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return seen;
}

// ---- Components ----
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const seen = useInView(ref, 0.15);
  return (
    <div ref={ref} className={`fade ${seen ? 'in' : ''} ${className}`}
         style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function CountUp({ to, duration = 1200, prefix = '', suffix = '', decimals = 0, trigger }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, trigger]);
  return <>{prefix}{v.toFixed(decimals)}{suffix}</>;
}

// ---- Sections ----
function Chrome({ progress }) {
  return (
    <div className="chrome">
      <div className="chrome-row">
        <div className="chrome-left">
          <span className="chrome-ticker">PM</span>
          <span className="chrome-name">Philip Morris Intl.</span>
        </div>
        <span className="chrome-label">Recap · FY '25</span>
      </div>
      <div className="chrome-progress">
        <div className="chrome-progress-fill"
             style={{ transform: `scaleX(${progress})` }}/>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.1);
  const heroProg = useElementProgress(ref);
  return (
    <section ref={ref} className="hero">
      <HeroSmoke progress={heroProg}/>
      <div className="eyebrow">PM <span className="dot">·</span> NYSE <span className="dot">·</span> Consumer Staples</div>
      <h1 className="hero-thesis">
        <span className="l1">A 178-year-old</span>
        <span className="l2"><em>tobacco company,</em></span>
        <span className="l3">mid-<span className="ember">pivot</span>.</span>
      </h1>
      <p className="hero-sub">
        180 countries. 84,900 employees. <em>43 million</em> adults
        already buying the smoke-free side of the house. The cigarette is
        still here — but the bet has moved.
      </p>
      <div className="hero-meta">
        <div className="cell"><span className="k">Market cap</span><span className="v">$255.5<span style={{fontSize:14, color:'var(--ink-3)'}}>B</span></span></div>
        <div className="cell"><span className="k">FY '25 rev</span><span className="v">$40.6<span style={{fontSize:14, color:'var(--ink-3)'}}>B</span></span></div>
        <div className="cell"><span className="k">Op margin</span><span className="v">36.6<span style={{fontSize:14, color:'var(--ink-3)'}}>%</span></span></div>
      </div>
    </section>
  );
}

function ResetBeat({ mark, children }) {
  return (
    <div className="reset-beat">
      <Reveal>
        {mark && <span className="mark">{mark}</span>}
        <p className="text">{children}</p>
      </Reveal>
    </div>
  );
}

function TwoEngines() {
  const ref = useRef(null);
  const prog = useElementProgress(ref);
  const seen = useInView(ref, 0.2);
  return (
    <section ref={ref} className="tonal">
      <div className="eyebrow">The two engines <span className="dot">·</span> $40.65B</div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 38, marginTop: 16, maxWidth: '14ch' }}>
          One business burns. <em className="it pivot-c">One doesn't.</em>
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="body-copy" style={{ marginTop: 18 }}>
          Marlboro and the rest of the combustible book still pay most of
          the bills. But every quarter, a larger share of revenue comes
          from products that <em>don't light on fire.</em>
        </p>
      </Reveal>

      <div className="engines">
        <Reveal delay={200}>
          <div className="engine comb">
            <span className="label">Combustible</span>
            <h3 className="name"><em>Marlboro</em> & co.</h3>
            <div className="cig-stage">
              <CigaretteScene progress={Math.max(0, (prog - 0.15) * 1.4)}/>
            </div>
            <div className="figure">
              ${seen ? <CountUp to={23.79} decimals={2} duration={1400} trigger={seen}/> : '0.00'}
              <span className="unit">B</span>
            </div>
            <div className="pct-bar">
              <div className="pct-fill" style={{ width: '58.5%', transform: `scaleX(${seen ? 1 : 0})`, transition: 'transform 1200ms 200ms cubic-bezier(.22,1,.36,1)' }}/>
            </div>
            <div className="growth"><span className="arrow">↗</span> 58.5% of revenue · +2.5% YoY on price</div>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="engine sf">
            <span className="label">Smoke-free</span>
            <h3 className="name">IQOS, <em>ZYN,</em> VEEV</h3>
            <div className="vape-stage">
              <SmokeFreeScene/>
            </div>
            <div className="figure">
              ${seen ? <CountUp to={16.85} decimals={2} duration={1400} trigger={seen}/> : '0.00'}
              <span className="unit">B</span>
            </div>
            <div className="pct-bar">
              <div className="pct-fill" style={{ width: '41.5%', transform: `scaleX(${seen ? 1 : 0})`, transition: 'transform 1200ms 350ms cubic-bezier(.22,1,.36,1)' }}/>
            </div>
            <div className="growth"><span className="arrow">↗</span> 41.5% of revenue · +15.0% YoY</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Scale() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.15);
  return (
    <section ref={ref}>
      <div className="eyebrow">The scale <span className="dot">·</span> 180 countries</div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 40, marginTop: 16, maxWidth: '14ch' }}>
          Across <em>106</em> smoke-free markets, the math is already enormous.
        </h2>
      </Reveal>
      <div className="scale-grid">
        <Reveal>
          <div className="cell">
            <span className="k">Adult smoke-free users</span>
            <span className="v">{seen ? <CountUp to={43} duration={1600} trigger={seen}/> : '0'}<span className="small"> M</span></span>
            <span className="sub">As of YE 2025, across 106 markets</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="cell">
            <span className="k">Employees</span>
            <span className="v">{seen ? <CountUp to={84.9} decimals={1} duration={1600} trigger={seen}/> : '0.0'}<span className="small"> K</span></span>
            <span className="sub">Across the global network</span>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="cell">
            <span className="k">Free cash flow</span>
            <span className="v">${seen ? <CountUp to={10.66} decimals={2} duration={1600} trigger={seen}/> : '0.00'}<span className="small"> B</span></span>
            <span className="sub">Op CF $12.23B · capex $1.57B</span>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="cell">
            <span className="k">Gross margin</span>
            <span className="v">{seen ? <CountUp to={67.1} decimals={1} duration={1600} trigger={seen}/> : '0.0'}<span className="small">%</span></span>
            <span className="sub">Premium-brand pricing power</span>
          </div>
        </Reveal>
        <Reveal delay={260}>
          <div className="cell full">
            <span className="k">Q1 2026 (most recent)</span>
            <span className="v" style={{ fontSize: 36 }}>
              ${seen ? <CountUp to={10.15} decimals={2} duration={1600} trigger={seen}/> : '0.00'}<span className="small"> B revenue</span>
              <span style={{ fontSize: 18, color: 'var(--ink-3)', marginLeft: 12 }}>
                · EPS ${seen ? <CountUp to={1.96} decimals={2} duration={1600} trigger={seen}/> : '0.00'}
              </span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Costs() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.2);
  return (
    <section ref={ref} className="ember-band">
      <div className="eyebrow">Where the dollar goes <span className="dot">·</span> 100¢ in</div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 38, marginTop: 16, maxWidth: '14ch' }}>
          Of every dollar in, <em className="it signal">35¢</em> is the line below the line.
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <p className="body-copy" style={{ marginTop: 18 }}>
          Cost of revenue is a third. Marketing and overhead another fifth.
          What's left, after the meter runs through D&A, taxes and
          interest, <em>becomes the war chest</em> the dividend and the
          pivot draw from.
        </p>
      </Reveal>
      <div className="donut-wrap">
        <CostDonut data={COSTS} progress={seen ? 1 : 0}/>
        <div className="donut-center">
          <span className="k">Operating margin</span>
          <span className="v"><em>{seen ? <CountUp to={36.6} decimals={1} duration={1600} trigger={seen}/> : '0.0'}¢</em></span>
          <span className="sub">survives per dollar</span>
        </div>
      </div>
      <div className="donut-legend">
        {COSTS.map((c, i) => (
          <div className="row" key={i}>
            <span className="swatch" style={{ background: c.color }}/>
            <span className="label">{c.label}</span>
            <span className="pct">{c.pct}¢</span>
          </div>
        ))}
        <div className="row">
          <span className="swatch" style={{ background: 'var(--ink)' }}/>
          <span className="label" style={{ fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: 17 }}>Operating profit + other</span>
          <span className="pct">35¢</span>
        </div>
      </div>
    </section>
  );
}

function Geography() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.15);
  return (
    <section ref={ref} className="tonal">
      <div className="eyebrow">Footprint <span className="dot">·</span> By region</div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 38, marginTop: 16, maxWidth: '14ch' }}>
          Europe still pays. <em>The rest is catching up.</em>
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="body-copy" style={{ marginTop: 16 }}>
          Unusually for a U.S.-listed staple, only <em>12%</em> of revenue
          is American. The center of gravity is the EU; the growth is
          everywhere else.
        </p>
      </Reveal>
      <div className="geo-wrap">
        <Reveal delay={200}>
          <GeoCompass data={GEO}/>
        </Reveal>
        <div className="geo-list">
          {GEO.map((g, i) => (
            <Reveal key={i} delay={300 + i * 80}>
              <div className="geo-row">
                <span className="num">{String(i+1).padStart(2,'0')}</span>
                <div className="body">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12 }}>
                    <span className="region">{g.region}</span>
                    <span className="pct-num">{g.pct}%</span>
                  </div>
                  <div className="pct-line">
                    <div className="fill" style={{ width: `${g.pct}%`, transform: `scaleX(${seen ? 1 : 0})`, transition: `transform 1200ms ${300 + i*100}ms cubic-bezier(.22,1,.36,1)` }}/>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TheBet() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.15);
  return (
    <section ref={ref} className="dark">
      <div className="eyebrow" style={{ color: '#908576' }}>The bet <span className="dot" style={{ color: '#FF8B6A' }}>·</span> Capital allocation</div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 40, marginTop: 16, maxWidth: '14ch', color:'#F4EFE6' }}>
          The dividend <em className="it" style={{ color:'#FF8B6A' }}>is the bet.</em>
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="body-copy" style={{ marginTop: 18, color:'#C9C0B0' }}>
          A <em>-$9.99B stockholders' deficit</em> isn't a bug; it's the
          shape of decades of capital returns and the 2022 Swedish Match
          deal. PMI bought the future and is paying it off in dividends.
        </p>
      </Reveal>
      <div className="bet-stack">
        <Reveal delay={200}>
          <div className="bet-card">
            <span className="k">Dividends paid · FY '25</span>
            <h3 className="v">$<em>8.62</em>B</h3>
            <p className="body">$5.88 per share annualized. <em>No buybacks in 2025</em> — focus is debt management & dividend sustainability.</p>
          </div>
        </Reveal>
        <Reveal delay={300}>
          <div className="bet-card">
            <span className="k">Swedish Match (2022)</span>
            <h3 className="v">~$<em>17.3</em>B goodwill</h3>
            <p className="body">The deal that brought ZYN in-house. Total goodwill + intangibles now <em>$28.15B</em> against $69.2B in total assets.</p>
          </div>
        </Reveal>
        <Reveal delay={400}>
          <div className="bet-card">
            <span className="k">Capex · FY '25</span>
            <h3 className="v">$<em>1.57</em>B</h3>
            <p className="body">Modest. <em>The pivot is paid for in marketing and dividends</em>, not factories. Cash flow does the heavy lifting.</p>
          </div>
        </Reveal>
        <Reveal delay={500}>
          <div className="bet-card">
            <span className="k">Total debt</span>
            <h3 className="v">$<em>168</em>M</h3>
            <p className="body">Against $4.87B cash. <em>Almost nothing</em> at the corporate level — the leverage lives in the equity story, not the balance sheet line.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Competitors() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.15);
  const [open, setOpen] = useState(null);
  const max = Math.max(PMI_CAP, ...COMPETITORS.map(c => c.cap));
  return (
    <section ref={ref}>
      <div className="eyebrow">The field <span className="dot">·</span> Sized by market cap</div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 38, marginTop: 16, maxWidth: '14ch' }}>
          The <em>biggest</em> in the room — but not alone.
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="body-copy" style={{ marginTop: 16 }}>
          Two direct rivals fighting the same combustible decline.
          One non-tobacco company chasing the same <em>convenience-channel
          shelf</em> for stimulant-occasion spend.
        </p>
      </Reveal>

      <div className="comp-list">
        {/* PMI itself for scale */}
        <Reveal>
          <div className="comp-row" style={{ background: 'var(--paper-2)' }}>
            <div className="comp-head">
              <span className="comp-name"><em>Philip Morris Intl.</em></span>
              <span className="comp-ticker">PM</span>
            </div>
            <div className="comp-bar-row">
              <div className="comp-bar pmi"><div className="fill" style={{ width: `${(PMI_CAP/max)*100}%`, transform: `scaleX(${seen?1:0})`, transition:'transform 1100ms cubic-bezier(.22,1,.36,1)' }}/></div>
              <span className="comp-cap">${PMI_CAP.toFixed(2)}B</span>
            </div>
          </div>
        </Reveal>

        {COMPETITORS.map((c, i) => (
          <Reveal key={c.ticker} delay={120 + i*80}>
            <div className="comp-row" onClick={() => setOpen(open === i ? null : i)}>
              <div className="comp-head">
                <span className="comp-name">{c.name}</span>
                <span className="comp-ticker">{c.ticker}</span>
              </div>
              <div className="comp-bar-row">
                <div className="comp-bar"><div className="fill" style={{ width: `${(c.cap/max)*100}%`, transform: `scaleX(${seen?1:0})`, transition:`transform 1100ms ${200+i*100}ms cubic-bezier(.22,1,.36,1)` }}/></div>
                <span className="comp-cap">${c.cap.toFixed(2)}B</span>
              </div>
              <div className="comp-detail" style={{ maxHeight: open === i ? 240 : 0, transition: 'max-height 360ms cubic-bezier(.22,1,.36,1)' }}>
                <div className="comp-detail-inner">
                  {c.note}
                  <div className="comp-stats">
                    <span className="stat">REV <b>${c.rev}</b></span>
                    <span className="stat">P/E <b>{c.pe}</b></span>
                    <span className="stat">YoY <b>{c.growth}</b></span>
                  </div>
                </div>
              </div>
              <span className="comp-tap-hint">{open === i ? '—  tap to close' : '+  tap for the read'}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Takeaway() {
  const ref = useRef(null);
  const seen = useInView(ref, 0.2);
  // Out of 100¢: 35¢ kept (op margin + other → ~36.6¢), 21¢ goes to dividends ($8.62B / $40.65B)
  const KEPT = 35;
  const DIV = 21;
  const cells = [...Array(100)].map((_, i) => {
    if (i < KEPT) return 'kept';
    if (i < KEPT + DIV) return 'div';
    return 'cost';
  });
  return (
    <section ref={ref} className="takeaway">
      <div className="eyebrow">The takeaway <span className="dot">·</span> 100¢ out</div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 46, marginTop: 14, maxWidth: '14ch' }}>
          A dollar in. <em className="it signal">Twenty-one cents</em> back to the shareholder.
        </h2>
      </Reveal>
      <Reveal delay={140}>
        <p className="body-copy" style={{ marginTop: 18, marginBottom: 8 }}>
          Of the dollar PMI takes in, roughly <em>35¢</em> survives to
          operating profit. From that, <em>21¢</em> is paid out as
          dividends — funded by the cigarette today, aimed at financing
          the pouch and the heat-stick tomorrow.
        </p>
      </Reveal>
      <Reveal delay={250}>
        <div className="penny-grid" aria-label="100 cent grid">
          {cells.map((kind, i) => (
            <span key={i}
                  className={`p ${seen ? kind : ''}`}
                  style={{ transitionDelay: `${seen ? i * 8 : 0}ms` }}/>
          ))}
        </div>
      </Reveal>
      <Reveal delay={350}>
        <div className="penny-key">
          <div className="row"><span className="sw" style={{background:'var(--ember)'}}/> 35¢ — operating profit + other</div>
          <div className="row"><span className="sw" style={{background:'var(--ink)'}}/> 21¢ — paid out as dividends ($8.62B)</div>
          <div className="row"><span className="sw" style={{background:'var(--line)'}}/> 60¢ — costs (revenue, SG&A, D&A, tax, interest)</div>
        </div>
      </Reveal>
      <Reveal delay={450}>
        <p className="body-copy" style={{ marginTop: 32, fontSize: 18 }}>
          The opening claim was a 178-year-old company mid-pivot. The
          closing claim is the <em>arithmetic that buys the pivot:</em>
          two decimals of margin, one quarterly cheque, and a smoke-free
          line growing fifteen percent a year.
        </p>
      </Reveal>
    </section>
  );
}

function App() {
  const progress = useScrollProgress();
  return (
    <>
      <Chrome progress={progress}/>
      <Hero/>
      <ResetBeat mark="—— a turn">
        You don't move a 178-year-old habit by accident.
        <em className="it signal"> You buy the alternative.</em>
      </ResetBeat>
      <TwoEngines/>
      <ResetBeat mark="—— scale">
        At this size, every percentage point is a <em className="it signal">small country.</em>
      </ResetBeat>
      <Scale/>
      <Costs/>
      <ResetBeat mark="—— the map">
        The <em className="it signal">U.S.</em> is the smallest segment on the board.
      </ResetBeat>
      <Geography/>
      <TheBet/>
      <ResetBeat mark="—— the field">
        Two rivals share the same <em className="it signal">headwinds.</em>
        A third doesn't sell tobacco at all.
      </ResetBeat>
      <Competitors/>
      <Takeaway/>
      <div className="footer">
        <div className="top">— end —</div>
        Recap · FY 2025 · Q1 2026<br/>
        Figures sourced from PM company filings
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App/>);

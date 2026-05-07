// Main Visa recap composition

const useReveal = () => {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

const useScrollProgress = () => {
  React.useEffect(() => {
    const fill = document.querySelector('.chrome-progress-fill');
    const handler = () => {
      const scrollY = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      if (fill) fill.style.width = (p * 100) + '%';
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
};

// CountUp visible only when in view
const CountUp = ({ to, decimals = 0, prefix = '', suffix = '', dur = 1400 }) => {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let started = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, dur]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
};

const Chrome = () => (
  <div className="chrome">
    <div className="chrome-row">
      <div className="chrome-left">
        <span className="chrome-ticker">V</span>
        <span className="chrome-name">Visa</span>
      </div>
      <span className="chrome-label">Recap · FY '25</span>
    </div>
    <div className="chrome-progress"><div className="chrome-progress-fill"></div></div>
  </div>
);

// Cost data — biggest_costs from JSON, with hex colors
const COSTS = [
  { pct: 39, color: '#4F86C6', label: 'Client Incentives' },
  { pct: 12, color: '#F4A261', label: 'Personnel Expenses' },
  { pct: 6,  color: '#2A9D8F', label: 'General & Administrative' },
  { pct: 4,  color: '#E76F51', label: 'Depreciation & Amortization' },
  { pct: 3,  color: '#8338EC', label: 'Marketing' },
];

const GEO = [
  { pct: 39, region: 'United States' },
  { pct: 22, region: 'Europe' },
  { pct: 17, region: 'Asia-Pacific' },
  { pct: 12, region: 'Latin America & Caribbean' },
  { pct: 10, region: 'Middle East & Africa' },
];
const GEO_COLORS = ['#0A1F44', '#F7B600', '#5A6A88', '#E89F00', '#142A5A'];

const COMPETITORS = [
  {
    name: 'Mastercard',
    nameItalic: 'Mastercard',
    ticker: 'MA',
    mcap: 464.90,
    rev: 32.79,
    growth: 16.42,
    pe: 31.06,
    blurb: "Visa's most direct global rival — same four-party model, the same banks, the same merchants. The mirror across the aisle.",
  },
  {
    name: 'American Express',
    nameItalic: 'American Express',
    ticker: 'AXP',
    mcap: 216.89,
    rev: 18.91,
    growth: 5.57,
    pe: 20.02,
    blurb: "A closed loop — issuer, acquirer, network in one. Targets the high-spend cardholder where Visa's interchange is fattest.",
  },
  {
    name: 'Itaú Unibanco',
    nameItalic: 'Itaú Unibanco',
    ticker: 'ITUB',
    mcap: 516.23,
    rev: 46.57,
    growth: 47.21,
    pe: 12.56,
    blurb: "Latin America's quiet threat. Pix-rails and proprietary digital payments cut at Visa's highest-growth non-US region.",
  },
];

const VISA_MCAP = 604.24;

const App = () => {
  useReveal();
  useScrollProgress();
  const [openComp, setOpenComp] = React.useState(null);

  return (
    <div className="stage">
      <Chrome />

      {/* ===== HERO / Thesis ===== */}
      <section className="hero" data-screen-label="01 Hero">
        <div className="eyebrow hero-eyebrow">
          <span className="dot"></span>
          <span className="num">001 ·</span>
          <span>The thesis</span>
        </div>
        <h1 className="reveal">
          Every swipe<br/>
          on Earth<br/>
          pays a <span className="gold">toll.</span>
        </h1>
        <p className="hero-sub reveal">
          Visa doesn't issue cards. It doesn't lend. It owns the rails — and rents them, 257.5 billion times a year.
        </p>
        <div className="hero-meta reveal">
          <div>NYSE<b>V</b></div>
          <div>Founded<b>1958</b></div>
          <div>HQ<b>San Francisco</b></div>
        </div>
        <HeroScene />
      </section>

      {/* Reset beat 1 */}
      <div className="reset-beat reveal" data-screen-label="Reset 1">
        <div className="marker">Interlude · 01</div>
        <div className="text">
          A network is invisible by design. <span className="gold">You only feel it</span> when something stops working.
        </div>
      </div>

      {/* ===== Network beat — the business ===== */}
      <section className="network-beat" data-screen-label="02 Business">
        <div className="eyebrow reveal">
          <span className="dot"></span>
          <span className="num">002 ·</span>
          <span>The business</span>
        </div>
        <div style={{height: 18}} />
        <div className="display reveal" style={{fontSize: '38px'}}>
          A four-sided<br/>
          <span style={{fontStyle:'italic', color:'#E89F00'}}>handshake</span>, paid in fees.
        </div>

        <NetworkScene />

        <div className="copy">
          <p className="body reveal">
            Consumers swipe. Merchants accept. Banks issue and acquire. Visa sits in the middle and clears the trade — earning <em>data processing</em>, <em className="gold">service</em>, and <em>cross-border</em> fees on every leg.
          </p>
          <p className="body reveal" style={{marginTop: 16}}>
            No credit risk. No card to print. <em>Asset-light</em> by construction — and that's the entire game.
          </p>
        </div>
      </section>

      {/* ===== Scale beat ===== */}
      <section className="scale-beat" data-screen-label="03 Scale">
        <div className="eyebrow reveal">
          <span className="dot"></span>
          <span className="num">003 ·</span>
          <span>The scale</span>
        </div>
        <div className="display reveal">
          <span className="gold">$14.2 trillion</span><br/>
          moved last year.
        </div>
        <p className="body reveal" style={{marginTop: 18}}>
          Across <em>200+ countries</em>. Roughly <em>30,400 transactions</em> per second, every second of the year.
        </p>

        <div className="stat-grid reveal">
          <div className="stat">
            <div className="num"><span className="italic">$</span><CountUp to={40.00} decimals={2} /><span className="italic">B</span></div>
            <div className="label">Revenue · FY25</div>
          </div>
          <div className="stat">
            <div className="num"><CountUp to={12.47} decimals={2} /><span className="italic">%</span></div>
            <div className="label">YoY Growth · TTM</div>
          </div>
          <div className="stat">
            <div className="num"><CountUp to={257.5} decimals={1} /><span className="italic">B</span></div>
            <div className="label">Transactions FY25</div>
          </div>
          <div className="stat">
            <div className="num"><span className="italic">$</span><CountUp to={604.24} decimals={2} /><span className="italic">B</span></div>
            <div className="label">Market Cap</div>
          </div>
          <div className="stat">
            <div className="num"><CountUp to={60} decimals={0} /><span className="italic">%</span></div>
            <div className="label">Operating Margin</div>
          </div>
          <div className="stat">
            <div className="num"><CountUp to={34} decimals={0} /><span className="italic">k+</span></div>
            <div className="label">Employees</div>
          </div>
        </div>
      </section>

      {/* Reset beat 2 */}
      <div className="reset-beat cream" data-screen-label="Reset 2">
        <div className="marker">Interlude · 02</div>
        <div className="text">
          A 60% margin doesn't happen by accident. It happens because <span className="gold">someone else owns the risk</span> — and Visa owns the toll booth.
        </div>
      </div>

      {/* ===== Cost beat ===== */}
      <section className="cost-beat" data-screen-label="04 Costs">
        <div className="eyebrow reveal">
          <span className="dot"></span>
          <span className="num">004 ·</span>
          <span>Where the dollar goes</span>
        </div>
        <div className="display reveal">
          The biggest cost<br/>
          isn't a cost. It's <span className="gold">the bribe</span>.
        </div>
        <p className="body reveal" style={{marginTop: 16, maxWidth: 360}}>
          Visa pays its issuing banks <em className="gold">$15.8B</em> in client incentives — 39¢ of every operating dollar — to keep their cards on top of your wallet.
        </p>

        <div className="cost-stage">
          {COSTS.map((c, i) => (
            <CostRow key={i} cost={c} index={i}/>
          ))}
        </div>

        <div className="cost-takeaway reveal">
          <div className="small-label">FY25 · Operating Margin</div>
          <div className="big">
            <span className="gold">60¢</span> of every dollar<br/>
            survives <span style={{fontStyle:'italic'}}>before tax</span>.
          </div>
        </div>
      </section>

      {/* ===== Geography ===== */}
      <section className="geo-beat" data-screen-label="05 Geography">
        <div className="eyebrow reveal">
          <span className="dot"></span>
          <span className="num">005 ·</span>
          <span>The footprint</span>
        </div>
        <div className="display reveal">
          A network<br/>
          shaped <span style={{fontStyle:'italic', color:'#E89F00'}}>like the world.</span>
        </div>
        <p className="body reveal" style={{marginTop: 14}}>
          The U.S. is still the heart — but <em>61%</em> of revenue now comes from outside it.
        </p>

        <div className="reveal">
          <GeoGlobe data={GEO} colors={GEO_COLORS}/>
        </div>

        <div className="geo-rows reveal">
          {GEO.map((g, i) => (
            <div key={i} className="geo-row">
              <span className="swatch" style={{background: GEO_COLORS[i]}}/>
              <span className="region">{g.region}</span>
              <span className="pct">{i === 0 ? <em>{g.pct}%</em> : `${g.pct}%`}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Reset beat 3 — gravity moment, dark */}
      <div className="reset-beat" data-screen-label="Reset 3">
        <div className="marker">Interlude · 03</div>
        <div className="text">
          When you can't grow by buying, you grow by <span className="gold">buying yourself.</span>
        </div>
      </div>

      {/* ===== The bet ===== */}
      <section className="bet-beat" data-screen-label="06 The Bet">
        <div className="eyebrow reveal">
          <span className="dot"></span>
          <span className="num">006 ·</span>
          <span>The bet · the buyback</span>
        </div>
        <div className="display reveal">
          $22.9B back<br/>
          to <span className="gold">shareholders</span>.
        </div>
        <p className="body reveal" style={{marginTop: 16, maxWidth: 360}}>
          With <em>$21.58B</em> of free cash flow and just <em>$1.48B</em> of capex, Visa has nowhere to put the money — so it sends it home. The board just authorized <em className="gold">$30B more</em>.
        </p>

        <div className="reveal">
          <BetScene />
        </div>

        <div className="bet-stats reveal">
          <div className="bet-stat">
            <div className="num">$<span className="gold">23.06</span>B</div>
            <div className="lbl">Operating Cash Flow</div>
          </div>
          <div className="bet-stat">
            <div className="num">$<span className="gold">0.670</span></div>
            <div className="lbl">Quarterly Dividend</div>
          </div>
          <div className="bet-stat">
            <div className="num"><span className="gold">$30</span>B</div>
            <div className="lbl">New Buyback Authorization</div>
          </div>
          <div className="bet-stat">
            <div className="num">$<span className="gold">19.6</span>B</div>
            <div className="lbl">Total Debt vs $37.9B Equity</div>
          </div>
        </div>
      </section>

      {/* Reset beat 4 */}
      <div className="reset-beat cream" data-screen-label="Reset 4">
        <div className="marker">Interlude · 04</div>
        <div className="text">
          Every empire has its <span className="gold">three rivals</span>. Visa's are not equally dangerous.
        </div>
      </div>

      {/* ===== Competitors ===== */}
      <section className="comp-beat" data-screen-label="07 Competitors">
        <div className="eyebrow reveal">
          <span className="dot"></span>
          <span className="num">007 ·</span>
          <span>The competition</span>
        </div>
        <div className="display reveal">
          Three rivals.<br/>
          <span className="gold">One mirror.</span>
        </div>
        <p className="body reveal" style={{marginTop: 14}}>
          Visa's <em>$604B</em> market cap dwarfs them all — but the threats look different from the front.
        </p>

        <div className="comp-list">
          {COMPETITORS.map((c, i) => (
            <CompCard key={i} comp={c} open={openComp === i} onTap={() => setOpenComp(openComp === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* ===== CLOSE — inversion of opening ===== */}
      <section className="close-beat" data-screen-label="08 Close">
        <div className="eyebrow">
          <span className="dot"></span>
          <span className="num">008 ·</span>
          <span>The takeaway</span>
        </div>
        <h2 className="reveal">
          Of every dollar<br/>
          that touches the rails,<br/>
          Visa keeps <span className="gold">just<br/>under fifteen<br/>cents.</span>
        </h2>

        <div className="cents-grid reveal">
          {[...Array(100)].map((_, i) => (
            <div key={i} className={`cent ${i < 15 ? 'kept' : 'spent'}`}/>
          ))}
        </div>
        <div className="cents-legend">
          <div><span className="sw" style={{background:'#F7B600'}}></span>Net income · <em style={{fontFamily:'Instrument Serif', fontStyle:'italic', color:'#E89F00'}}>$20.06B</em></div>
        </div>

        <p className="body reveal" style={{marginTop: 32, maxWidth: 360}}>
          The thesis was a <em>toll</em>. The takeaway is that <em className="gold">most of the road is free</em> — Visa just owns the bridge. <em>Fifteen cents</em> survive to the bottom line, and they fund the only thing left worth funding: <em className="gold">themselves.</em>
        </p>

        <div className="signoff">
          End of recap · FY '25 · Visa Inc.
        </div>
      </section>
    </div>
  );
};

const CostRow = ({ cost, index }) => {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => setW((cost.pct / 39) * 100), index * 120);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="cost-row" ref={ref}>
      <div className="pct-num"><em>{cost.pct}</em>%</div>
      <div className="pct-info">
        <div className="pct-label">{cost.label}</div>
        <div className="pct-bar"><div className="pct-bar-fill" style={{width: w + '%', background: cost.color}}/></div>
      </div>
    </div>
  );
};

const CompCard = ({ comp, open, onTap }) => {
  const ratio = (comp.mcap / VISA_MCAP) * 100;
  return (
    <div className={`comp-card ${open ? 'open' : ''}`} onClick={onTap}>
      <div className="head">
        <div className="name"><em>{comp.nameItalic}</em></div>
        <div className="ticker">{comp.ticker}</div>
      </div>
      <div className="scale-row">
        <div className="scale-track">
          <div className="scale-bar visa"/>
          <div className="scale-bar them" style={{width: ratio + '%', top: 'calc(50% + 6px)'}}/>
        </div>
        <div className="mcap">$<em>{comp.mcap}</em>B</div>
      </div>
      <div style={{display:'flex', gap: 14, marginTop: 10, fontFamily:'Geist Mono, monospace', fontSize: 10, letterSpacing:'0.08em', color:'rgba(244,239,228,0.55)', textTransform:'uppercase'}}>
        <span>Rev <span style={{color:'#F4EFE4'}}>${comp.rev}B</span></span>
        <span>YoY <span style={{color: comp.growth > 20 ? '#F7B600' : '#F4EFE4'}}>+{comp.growth}%</span></span>
        <span>P/E <span style={{color:'#F4EFE4'}}>{comp.pe}</span></span>
      </div>
      <div className="body-text">{comp.blurb.split(/(_[^_]+_)/).map((part, i) => part.startsWith('_') && part.endsWith('_') ? <em key={i}>{part.slice(1,-1)}</em> : part)}</div>
      <div className="tap-hint">{open ? '— Tap to collapse' : 'Tap to read →'}</div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

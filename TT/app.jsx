/* Main Trane Technologies stock recap app */

const { useState, useEffect, useRef, useMemo } = React;

// Count-up hook
function useCountUp(target, active, duration = 1400) {
  const [val, setVal] = useState(0);
  const startRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    let raf;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

// Reveal hook — adds .in when section enters viewport
function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            el.classList.add('in');
          }
        });
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

// Track scroll progress within an element (0..1)
function useElementProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const ratio = Math.max(0, Math.min(1, passed / total));
      setP(ratio);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return p;
}

// Top-level scroll progress 0..1
function useDocProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

// ---------------- BEATS ----------------

function Hero({ docProgress }) {
  const [ref] = useReveal();
  return (
    <section className="hero" ref={ref} data-screen-label="01 Hero · Thesis">
      <div className="mono" style={{ color: 'var(--steel)', letterSpacing: '0.18em' }}>
        Recap · FY '25
      </div>

      <h1 className="hero-thesis">
        The world keeps getting <span className="italic">hotter</span>.
        <br/>
        Someone has to keep it <span className="italic" style={{color: 'var(--steel)'}}>cool</span>.
      </h1>

      <p className="hero-sub">
        <span className="italic" style={{fontSize: '19px', color: 'var(--ink)'}}>Trane Technologies</span> sells the machinery of climate control —
        for buildings, for trucks, for a planet&nbsp;rebalancing&nbsp;itself.
      </p>

      <div className="hero-scene">
        <HeroScene scrollPct={docProgress}/>
      </div>

      <div className="hero-stat-row">
        <div className="hero-stat">
          <div className="num">$21.32<small>B</small></div>
          <div className="lbl">FY25 Revenue</div>
        </div>
        <div className="hero-stat">
          <div className="num">$105.4<small>B</small></div>
          <div className="lbl">Market Cap</div>
        </div>
        <div className="hero-stat">
          <div className="num">36,000</div>
          <div className="lbl">Employees</div>
        </div>
        <div className="hero-stat">
          <div className="num">100<small>+</small></div>
          <div className="lbl">Countries</div>
        </div>
      </div>
    </section>
  );
}

function ResetBeat({ children, dark = false, attrib }) {
  const [ref] = useReveal();
  return (
    <section className={`reset reveal ${dark ? 'dark' : ''}`} ref={ref}>
      <p className="quote">{children}</p>
      {attrib && <div className="attrib">{attrib}</div>}
    </section>
  );
}

function BusinessBeat() {
  const [ref] = useReveal();
  return (
    <section className="brands beat-pad reveal" ref={ref} data-screen-label="02 The Business">
      <div className="eyebrow">The business · Two brands</div>
      <h2 className="display">
        One sells <span className="heat-em">stillness</span> in the air.
        <br/>
        The other, <em>cold</em> on the move.
      </h2>
      <p className="body" style={{marginTop: 20, maxWidth: '36ch'}}>
        Incorporated in Ireland, run from North Carolina, sold in 100+ countries —
        Trane Technologies is two strategic brands aimed at the same physics problem.
      </p>

      <div style={{marginTop: 32}}>
        <div className="brand-card">
          <div className="brand-glyph"><TraneGlyph/></div>
          <div>
            <div className="brand-name">Trane</div>
            <div className="brand-desc">
              Commercial &amp; residential <span className="italic">HVAC</span>, building controls,
              energy services. The bones of the modern office, hospital, school, and data&nbsp;center.
            </div>
            <div className="brand-tag">Buildings · Stationary</div>
          </div>
        </div>
        <div className="brand-card">
          <div className="brand-glyph"><ThermoKingGlyph/></div>
          <div>
            <div className="brand-name">Thermo King</div>
            <div className="brand-desc">
              Transport refrigeration. Trailers, ships, rail — the cold chain that
              keeps food and medicine <span className="italic">at temperature</span> across continents.
            </div>
            <div className="brand-tag">Transport · In motion</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScaleBeat() {
  const [ref, seen] = useReveal();
  const rev   = useCountUp(21.32, seen);
  const mcap  = useCountUp(105.38, seen);
  const ocf   = useCountUp(3.19, seen);
  const fcf   = useCountUp(2.81, seen);
  const op    = useCountUp(18.6, seen);
  const eps   = useCountUp(2.86, seen);

  return (
    <section className="scale-section beat-pad reveal" ref={ref} data-screen-label="03 The Scale">
      <div className="eyebrow">The scale · FY 2025</div>
      <h2 className="display">
        Run the numbers and the <em>climate</em> shows up at <em>$21B</em>.
      </h2>

      <div className="scale-grid">
        <div className="scale-stat">
          <div className="num">${rev.toFixed(2)}<small>B</small></div>
          <div className="lbl">Revenue</div>
        </div>
        <div className="scale-stat">
          <div className="num">${mcap.toFixed(1)}<small>B</small></div>
          <div className="lbl">Market cap</div>
        </div>
        <div className="scale-stat">
          <div className="num">${ocf.toFixed(2)}<small>B</small></div>
          <div className="lbl">Operating cash flow</div>
        </div>
        <div className="scale-stat">
          <div className="num">${fcf.toFixed(2)}<small>B</small></div>
          <div className="lbl">Free cash flow</div>
        </div>
        <div className="scale-stat">
          <div className="num">{op.toFixed(1)}<small>%</small></div>
          <div className="lbl">Operating margin</div>
        </div>
        <div className="scale-stat">
          <div className="num">${eps.toFixed(2)}</div>
          <div className="lbl">Q4 adj. EPS · $5.14B Q rev</div>
        </div>
      </div>
    </section>
  );
}

function FlywheelBeat() {
  const ref = useRef(null);
  const progress = useElementProgress(ref);
  const [, seen] = useReveal();
  return (
    <section className="flywheel beat-pad" ref={ref} data-screen-label="04 The Flywheel">
      <div className="eyebrow">The model · Equipment + aftermarket</div>
      <h2 className="display">
        Sell the box. Then <em>service it</em> for twenty&nbsp;years.
      </h2>
      <p className="body" style={{marginTop: 20, maxWidth: '38ch'}}>
        Two-thirds of revenue is the equipment — chillers, rooftop units, refrigerated trailers.
        The remaining third is the <span className="italic">recurring</span> tail: maintenance contracts,
        parts, and a digital building-management layer that earns higher margins than the box itself.
      </p>

      <div className="flywheel-vis">
        <FlywheelScene progress={progress}/>
      </div>

      <div className="split-bar">
        <div className="split-equip">
          <div className="big">67%</div>
          <div>Equipment</div>
        </div>
        <div className="split-aft">
          <div className="big">33%</div>
          <div>Aftermarket</div>
        </div>
      </div>
      <p className="small" style={{marginTop: 14, color: 'var(--ink-3)'}}>
        Cost of revenue runs 63.8% of sales — operating margin lands at <span className="italic" style={{color:'var(--ink)'}}>18.6%</span>.
        The aftermarket is what makes the math work.
      </p>
    </section>
  );
}

function ResetBeatA() {
  return (
    <ResetBeat attrib="The aftermarket flywheel">
      Every chiller installed today becomes <em>a service contract tomorrow</em> — and a parts catalog for two decades after that.
    </ResetBeat>
  );
}

function CostBeat() {
  const ref = useRef(null);
  const progress = useElementProgress(ref);

  return (
    <section className="cost-section beat-pad" ref={ref} data-screen-label="05 The Cost Stack">
      <div style={{display: 'flex', gap: 32, alignItems: 'flex-start'}}>
        <div style={{flex: 1, minWidth: 0}}>
          <div className="eyebrow">A hundred cents in</div>
          <h2 className="display">
            Where every <em>dollar</em> goes.
          </h2>
          <p className="body" style={{marginTop: 18}}>
            Out of every dollar of revenue, sixty-four cents goes to the cost of the
            equipment itself — steel, copper, compressors, labor. The rest pays
            for selling, research, and depreciation.
          </p>

          <div className="cost-legend">
            {[
              { pct: 64, color: '#2563EB', label: 'Cost of revenue' },
              { pct: 10, color: '#16A34A', label: 'SG&A' },
              { pct: 2,  color: '#D97706', label: 'R&D' },
              { pct: 2,  color: '#9333EA', label: 'D&A' },
            ].map((s) => (
              <div className="cost-row" key={s.label}>
                <div className="cost-swatch" style={{background: s.color}}/>
                <div className="cost-name">{s.label}</div>
                <div className="cost-pct">{s.pct}¢</div>
              </div>
            ))}
          </div>

          <div className="cost-residual">
            <div className="num">≈22¢</div>
            <div className="lbl">Survives as operating income, then taxes &amp; interest</div>
          </div>
        </div>
        <div style={{width: 140, flexShrink: 0, marginTop: 32}}>
          <CostThermometer progress={progress}/>
        </div>
      </div>
    </section>
  );
}

function ResetBeatB() {
  return (
    <ResetBeat>
      Sixty-four cents to <em>build the box</em>. The remainder is everything that turns a manufacturer into a <em>compounder</em>.
    </ResetBeat>
  );
}

function GeographyBeat() {
  const [ref, seen] = useReveal();
  const regions = [
    { region: 'Americas', pct: 80, note: 'Commercial HVAC, residential, transport' },
    { region: 'EMEA', pct: 13, note: 'Europe / Middle East / Africa' },
    { region: 'Asia Pacific', pct: 7, note: 'Growth runway' },
  ];
  return (
    <section className="geo beat-pad reveal" ref={ref} data-screen-label="06 Geography">
      <div className="eyebrow">Footprint · 100+ countries</div>
      <h2 className="display">
        The map is <em>lopsided</em>, and that's the&nbsp;point.
      </h2>
      <p className="body" style={{marginTop: 18, maxWidth: '36ch'}}>
        Four out of every five dollars come from the Americas — a concentrated bet on a market still building data centers, hospitals, and homes.
      </p>

      <div className="geo-stack">
        {regions.map((r, i) => (
          <div className="geo-row" key={r.region}>
            <div className="top">
              <div className="region">{r.region}</div>
              <div className="pct">{r.pct}%</div>
            </div>
            <div className="geo-bar">
              <div className="geo-bar-fill" style={{ '--w': seen ? `${r.pct}%` : '0%', transitionDelay: `${i * 120}ms` }}/>
            </div>
            <div className="small" style={{marginTop: 8}}>{r.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BetBeat() {
  const [ref, seen] = useReveal();
  const cash = useCountUp(3.19, seen);

  // Allocations (FY25): Dividends 837.3M, Buybacks ~1.5B, M&A ~720M, Capex 383M
  const flows = [
    { name: 'Share repurchases', amt: '~$1.50B', cat: 'repurchase', pct: 47 },
    { name: 'Dividends paid',    amt: '$837.3M', cat: 'dividend',   pct: 26 },
    { name: 'Acquisitions (M&A)', amt: '~$720M',  cat: 'ma',         pct: 23 },
    { name: 'Capital expenditure', amt: '$383.0M', cat: 'capex',     pct: 12 },
  ];

  return (
    <section className="bet beat-pad reveal" ref={ref} data-screen-label="07 The Bet">
      <div className="eyebrow">The bet · Capital allocation</div>
      <h2 className="display">
        <em>${cash.toFixed(2)}B</em> in operating cash. <br/>
        Now <span className="heat-em">deploy it</span>.
      </h2>

      <div className="bet-cash-lbl" style={{marginTop: 24}}>FY25 Operating cash flow</div>

      <div className="bet-flows">
        {flows.map((f, i) => (
          <div className="bet-flow-row" data-cat={f.cat} key={f.name}>
            <div className="bet-flow-name">{f.name}</div>
            <div className="bet-flow-amt">{f.amt}</div>
            <div className="bet-flow-bar">
              <span style={{ '--w': seen ? `${f.pct * 2}%` : '0%', transitionDelay: `${300 + i * 140}ms` }}/>
            </div>
          </div>
        ))}
      </div>

      <p className="body" style={{marginTop: 32, maxWidth: '38ch'}}>
        Bolt-on acquisitions tilt toward <span className="italic">AI</span>, digital building management,
        and specialized refrigerated transport. Goodwill and intangibles already total
        <span className="italic"> ~$9.8B</span> on the balance sheet — a record of what's been bought.
      </p>

      <div style={{marginTop: 32, padding: '20px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16}}>
        <div>
          <div className="display" style={{fontSize: 36}}>$1.76<small style={{fontSize: 16, color:'var(--ink-3)'}}>B</small></div>
          <div className="mono" style={{color: 'var(--ink-3)', marginTop: 6}}>Cash on hand</div>
        </div>
        <div className="display" style={{fontSize: 36, color: 'var(--ink-3)'}}>vs.</div>
        <div style={{textAlign: 'right'}}>
          <div className="display" style={{fontSize: 36}}>$4.62<small style={{fontSize: 16, color:'var(--ink-3)'}}>B</small></div>
          <div className="mono" style={{color: 'var(--ink-3)', marginTop: 6}}>Total debt</div>
        </div>
      </div>
    </section>
  );
}

function ResetBeatC() {
  return (
    <ResetBeat dark>
      A balance sheet is a <em>memoir</em>. Every billion in goodwill is a&nbsp;company that used to&nbsp;exist.
    </ResetBeat>
  );
}

function CompetitorsBeat() {
  const ref = useRef(null);
  const progress = useElementProgress(ref);
  const [open, setOpen] = useState(null);

  const comps = [
    {
      key: 'tt',
      name: 'Trane Technologies',
      ticker: 'TT',
      mcap: '$105.38B',
      rev: '$21.32B',
      pe: '—',
      growth: '—',
      growthCls: '',
      blurb: 'The page you are reading.',
      us: true,
    },
    {
      key: 'carr',
      name: 'Carrier Global',
      ticker: 'CARR',
      mcap: '$51.23B',
      rev: '$21.75B',
      pe: '34.5x',
      growth: '−9.4%',
      growthCls: 'neg',
      blurb: 'The most direct rival — same buildings, same data centers, same retrofit pitch. Half the market cap on similar revenue.',
    },
    {
      key: 'jci',
      name: 'Johnson Controls',
      ticker: 'JCI',
      mcap: '$86.22B',
      rev: '$23.60B',
      pe: '25.4x',
      growth: '−9.9%',
      growthCls: 'neg',
      blurb: 'Overlap is heaviest in commercial HVAC, building management, and energy efficiency — large hospitals, factories, and campuses.',
    },
    {
      key: 'ph',
      name: 'Parker-Hannifin',
      ticker: 'PH',
      mcap: '$124.80B',
      rev: '$19.85B',
      pe: '35.3x',
      growth: '+2.8%',
      growthCls: 'pos',
      blurb: 'A converging threat from the industrial side — climate, filtration, precision data-center cooling. Different lineage, same kitchen.',
    },
  ];

  return (
    <section className="competitors beat-pad" ref={ref} data-screen-label="08 Competition">
      <div className="eyebrow">The competition · Skyline</div>
      <h2 className="display">
        Three rivals. <em>Three different</em> kinds of pressure.
      </h2>

      <div className="skyline-wrap">
        <CompetitorSkyline progress={progress}/>
      </div>

      <div className="comp-list">
        {comps.map((c) => (
          <div
            className={`comp-row ${c.us ? 'us' : ''} ${open === c.key ? 'open' : ''}`}
            key={c.key}
            onClick={() => setOpen(open === c.key ? null : c.key)}
          >
            <div className="top">
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div className="ticker-pill">{c.ticker}</div>
                <div className="comp-name">{c.name}</div>
              </div>
              <div className="comp-mcap">{c.mcap}</div>
            </div>
            <div className="comp-detail">
              <div className="comp-detail-inner">
                <div className="comp-stats">
                  <div className="comp-stat">
                    <div className="lbl">Revenue</div>
                    <div className="val">{c.rev}</div>
                  </div>
                  <div className="comp-stat">
                    <div className="lbl">P/E TTM</div>
                    <div className="val">{c.pe}</div>
                  </div>
                  <div className="comp-stat">
                    <div className="lbl">YoY rev</div>
                    <div className={`val ${c.growthCls}`}>{c.growth}</div>
                  </div>
                </div>
                <div className="comp-blurb">{c.blurb}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tap-hint">Tap any rival for detail</div>
    </section>
  );
}

function CloseBeat() {
  const [ref, seen] = useReveal();
  const fcf = useCountUp(2.81, seen);
  return (
    <section className="close reveal" ref={ref} data-screen-label="09 Close">
      <div className="eyebrow" style={{color: 'var(--steel)'}}>The takeaway</div>
      <h2 className="display" style={{fontSize: 56}}>
        $21B <em>flows in</em>.
        <br/>
        $<em>{fcf.toFixed(2)}B</em> survives.
        <br/>
        <span style={{color: 'var(--ink)'}}>The </span>
        <span className="italic" style={{fontSize: 56, color: 'var(--heat-deep)'}}>climate</span>
        <span style={{color: 'var(--ink)'}}> keeps changing.</span>
      </h2>

      <div className="close-cards">
        <div className="close-card">
          <div className="num">$<em>2.81B</em></div>
          <div className="lbl">Free cash flow · FY25</div>
        </div>
        <div className="close-card">
          <div className="num">$<em>837M</em></div>
          <div className="lbl">Returned as dividends</div>
        </div>
        <div className="close-card">
          <div className="num">~$<em>2.2B</em></div>
          <div className="lbl">Returned via buybacks &amp; M&amp;A</div>
        </div>
        <div className="close-card">
          <div className="num">$<em>9.8B</em></div>
          <div className="lbl">Goodwill — the receipts of past bets</div>
        </div>
      </div>

      <p className="body" style={{marginTop: 40, maxWidth: '36ch', color: 'var(--ink-2)'}}>
        Data centers run hotter. Hospitals run longer. Cold chains run further.
        The thesis is that <span className="italic" style={{color:'var(--heat-deep)'}}>thermal management</span> is no longer a building-services line item — it's <span className="italic">infrastructure</span>.
      </p>
    </section>
  );
}

function FooterCap() {
  return (
    <div className="footer-cap">
      <div className="meta-line">End of recap · NYSE: TT · FY 2025</div>
      <p className="small">
        Headquartered in Swords, Ireland. Operations centered in Davidson, North Carolina.
        Two strategic brands: Trane &amp; Thermo King.
        Figures sourced from FY2025 disclosures as of December 31, 2025.
        This page is a recap, not investment advice.
      </p>
    </div>
  );
}

function Chrome() {
  const p = useDocProgress();
  return (
    <div className="chrome">
      <div className="chrome-row">
        <div className="chrome-left">
          <span className="ticker">TT</span>
          <span className="chrome-name">Trane Technologies</span>
        </div>
        <span className="chrome-label">Recap · FY '25</span>
      </div>
      <div className="scroll-bar">
        <div className="scroll-bar-fill" style={{ '--scroll-pct': `${p * 100}%` }}/>
      </div>
    </div>
  );
}

function App() {
  const docP = useDocProgress();
  return (
    <div className="page">
      <Chrome/>
      <Hero docProgress={docP}/>
      <BusinessBeat/>
      <ScaleBeat/>
      <ResetBeatA/>
      <FlywheelBeat/>
      <ResetBeatB/>
      <CostBeat/>
      <GeographyBeat/>
      <ResetBeatC/>
      <BetBeat/>
      <CompetitorsBeat/>
      <CloseBeat/>
      <FooterCap/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

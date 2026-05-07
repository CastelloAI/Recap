/* DaVita Recap — main app */

const DATA = {
  ticker: 'DVA',
  name: 'DaVita',
  costs: [
    { pct: 68, color: '#4A90D9', label: 'Patient Care Costs' },
    { pct: 9,  color: '#E8734A', label: 'General & Administrative' },
    { pct: 4,  color: '#6DBF8A', label: 'Depreciation & Amortization' },
    { pct: 4,  color: '#B57BCC', label: 'Interest Expense' },
  ],
  competitors: [
    {
      ticker: 'DVA',
      name: 'DaVita Inc.',
      mcap: 9.88,
      isDva: true,
      tag: 'KIDNEY CARE · ~35% U.S. DIALYSIS',
      description: '2,657 U.S. centers serving 200,500 patients. The reference point for everyone else on this list.',
      stats: [
        { v: '$13.64B', l: 'FY25 REV' },
        { v: '15.0%', l: 'OP MARGIN' },
        { v: '78,000', l: 'EMPLOYEES' },
      ],
    },
    {
      ticker: 'EHC',
      name: 'Encompass Health',
      mcap: 10.58,
      tag: 'POST-ACUTE · OVERLAPS ON ESRD REFERRALS',
      description: 'Inpatient rehabilitation operator competing with DaVita in the post-acute and specialty care continuum, including for ESRD patient referrals from large health systems.',
      stats: [
        { v: '$5.94B', l: 'REV' },
        { v: '+10.5%', l: 'YoY' },
        { v: '18.7×', l: 'P/E' },
      ],
    },
    {
      ticker: 'BTSG',
      name: 'Brightspring Health',
      mcap: 9.15,
      tag: 'HOME & COMMUNITY · DIRECT HOME-DIALYSIS OVERLAP',
      description: 'Competes in home-based and community health services — directly overlapping where DaVita is expanding: home dialysis, integrated kidney care, infusion and pharmacy.',
      stats: [
        { v: '$12.91B', l: 'REV' },
        { v: '+14.6%', l: 'YoY' },
        { v: '48.0×', l: 'P/E' },
      ],
    },
    {
      ticker: 'FME',
      name: 'Fresenius Medical Care',
      mcap: null,
      tag: 'GLOBAL DIALYSIS · THE OTHER GIANT',
      description: 'The other half of the global dialysis duopoly. Competes with DVA across the Health Care sector.',
    },
  ],
};

function App() {
  const pageScroll = usePageScroll();
  return (
    <div className="stage">
      {/* PERSISTENT CHROME */}
      <div className="chrome">
        <div className="chrome-inner">
          <span className="chrome-ticker">DVA</span>
          <span className="chrome-name">DaVita Inc.</span>
          <span className="chrome-spacer" />
          <span className="chrome-label">Recap · FY '25</span>
        </div>
        <div className="chrome-progress" style={{ '--scroll': (pageScroll * 100) + '%' }} />
      </div>

      {/* HERO */}
      <section className="hero" data-screen-label="01 Hero">
        <HeroDroplet />
        <div className="hero-eyebrow eyebrow"><span className="eyebrow-num">01 ·</span> The thesis</div>
        <h1 className="display hero-headline">
          Three times <br/>a week.<br/>
          <span className="accent">For life.</span>
        </h1>
        <p className="hero-sub">
          DaVita runs America's dialysis machine — <em>2,657</em> U.S. centers,
          <em> ~200,500</em> patients, and a recurring business that keeps showing up Monday, Wednesday, Friday.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">$13.64<span style={{fontSize: '0.5em', verticalAlign: '0.4em', fontFamily: "var(--font-mono)"}}>B</span></div>
            <div className="lab">Revenue · FY '25</div>
          </div>
          <div className="hero-stat">
            <div className="num italic">~35%</div>
            <div className="lab">U.S. Dialysis Share</div>
          </div>
          <div className="hero-stat">
            <div className="num">$9.88<span style={{fontSize: '0.5em', verticalAlign: '0.4em', fontFamily: "var(--font-mono)"}}>B</span></div>
            <div className="lab">Market Cap</div>
          </div>
          <div className="hero-stat">
            <div className="num italic">25</div>
            <div className="lab">Years As DaVita · 2025</div>
          </div>
        </div>
      </section>

      {/* RESET BEAT 1 */}
      <section className="reset-beat" data-screen-label="02 Reset · cadence">
        <div className="reset-mark">— Interlude i</div>
        <div className="reset-text">
          A kidney never clocks out. Neither, then, can the <span className="hit">machine that replaces it.</span>
        </div>
      </section>

      {/* THE BUSINESS — DIALYSIS CYCLE */}
      <section className="beat" data-screen-label="03 The business">
        <div className="beat-eyebrow eyebrow"><span className="dot" /><span className="eyebrow-num">02 ·</span> The business</div>
        <h2 className="display" style={{fontSize: 36}}>
          Blood out, <span className="display-italic" style={{color:'var(--fluid-500)'}}>cleaner</span> blood back.
        </h2>
        <p className="body-copy" style={{marginTop: 18}}>
          <em>95.7%</em> of revenue comes from this cycle — dialysis services. The other <em>4.3%</em> is integrated kidney care, labs, transplant software, clinical research.
          ESRD patients return to the chair three times a week, for life. <span className="signal">The business model is a calendar.</span>
        </p>
        <CycleScene />
        <div className="cycle-caption">
          <div className="cap"><b>Hemodialysis</b>In-center, the dominant modality.</div>
          <div className="cap"><b>Peritoneal</b>Plus home-based options.</div>
          <div className="cap"><b>IKC</b>Integrated kidney care wraps the rest.</div>
        </div>
      </section>

      {/* THE SCALE */}
      <section className="beat" data-screen-label="04 The scale" style={{paddingTop: 40}}>
        <div className="beat-eyebrow eyebrow"><span className="dot" /><span className="eyebrow-num">03 ·</span> The footprint, in points</div>
        <h2 className="display" style={{fontSize: 36}}>
          Three thousand <span className="display-italic" style={{color:'var(--fluid-500)'}}>two hundred</span> & forty-two centers.
        </h2>
        <div className="scale-figures">
          <div className="scale-fig">
            <div className="num">2,657</div>
            <div className="lab">U.S. Centers</div>
          </div>
          <div className="scale-fig">
            <div className="num"><span className="it">585</span></div>
            <div className="lab">14 Other Countries</div>
          </div>
          <div className="scale-fig">
            <div className="num">295k</div>
            <div className="lab">Patients · Total</div>
          </div>
          <div className="scale-fig">
            <div className="num"><span className="it">78k</span></div>
            <div className="lab">Employees</div>
          </div>
        </div>
        <ConstellationScene />
        <p className="body-copy" style={{marginTop: 8, fontSize: 13}}>
          Each dot is a center. Blue dots are domestic; orange are the <em>14 countries</em> outside the U.S. that round out the network.
        </p>
      </section>

      {/* RESET BEAT 2 */}
      <section className="reset-beat" data-screen-label="05 Reset · the dollar">
        <div className="reset-mark">— Interlude ii</div>
        <div className="reset-text">
          A dollar shows up at the chair. <span className="hit">Most of it never leaves the room.</span>
        </div>
      </section>

      {/* THE COSTS */}
      <section className="beat" data-screen-label="06 Where the money goes">
        <div className="beat-eyebrow eyebrow"><span className="dot" /><span className="eyebrow-num">04 ·</span> Where the dollar goes</div>
        <h2 className="display" style={{fontSize: 36}}>
          Filter the revenue. <span className="display-italic" style={{color:'var(--fluid-500)'}}>Catch what's left.</span>
        </h2>
        <p className="body-copy" style={{marginTop: 16}}>
          Patient care is heavy by design — staff, supplies, the chair, the nurse, the membrane. <em>Sixty-eight cents</em> of every dollar
          gets used delivering the treatment itself.
        </p>
        <div className="costs-stage">
          <CostsColumn costs={DATA.costs} />
          <div className="costs-legend">
            {DATA.costs.map((c, i) => (
              <div key={i} className="legend-row">
                <span className="swatch" style={{ background: c.color }} />
                <span className="name">{c.label}</span>
                <span className="pct">{c.pct}<span className="small">%</span></span>
              </div>
            ))}
          </div>
        </div>
        <div className="costs-bottom">
          <div className="residue"><span className="it">15¢</span></div>
          <div className="residue-cap">Operating margin · what survives</div>
        </div>
      </section>

      {/* THE PAYERS */}
      <section className="beat" data-screen-label="07 The payers" style={{paddingTop: 32, background: 'var(--paper-2)'}}>
        <div className="beat-eyebrow eyebrow"><span className="dot" /><span className="eyebrow-num">05 ·</span> Two pipes, one basin</div>
        <h2 className="display" style={{fontSize: 32}}>
          The government pays the bills. <span className="display-italic" style={{color:'var(--signal)'}}>Commercial pays the shareholders.</span>
        </h2>
        <p className="body-copy" style={{marginTop: 14}}>
          Medicare and Medicaid send <em>68%</em> of the revenue. Commercial insurers send <em>32%</em> — but at reimbursement rates
          high enough that nearly all of the company's <span className="signal">profit</span> rides on that thinner stream.
        </p>
        <PayerSplitScene />
      </section>

      {/* FOOTPRINT */}
      <section className="beat" data-screen-label="08 Footprint">
        <div className="beat-eyebrow eyebrow"><span className="dot" /><span className="eyebrow-num">06 ·</span> Where it lives</div>
        <h2 className="display" style={{fontSize: 36}}>
          A <span className="display-italic" style={{color:'var(--fluid-500)'}}>domestic</span> business with a 14-country reach.
        </h2>
        <FootprintScene />
        <div className="footprint-num">
          <div className="row">
            <div className="num">88<span className="it" style={{fontStyle: 'italic', color:'var(--fluid-500)'}}>%</span></div>
            <div className="lab">U.S.</div>
          </div>
          <div className="row" style={{textAlign:'right'}}>
            <div className="num" style={{color:'var(--cost-ga)'}}>12<span style={{fontStyle:'italic'}}>%</span></div>
            <div className="lab">International</div>
          </div>
        </div>
      </section>

      {/* RESET BEAT 3 */}
      <section className="reset-beat" data-screen-label="09 Reset · the bet">
        <div className="reset-mark">— Interlude iii</div>
        <div className="reset-text">
          The cash flow is the easy part. <span className="signal-hit">What they do with it is the bet.</span>
        </div>
      </section>

      {/* THE BET — DARK INTERLUDE */}
      <section className="beat beat-dark" data-screen-label="10 The bet">
        <div className="beat-eyebrow eyebrow"><span className="dot" style={{background:'#FF8A6A'}}/><span className="eyebrow-num">07 ·</span> The bet · -$651M equity</div>
        <h2 className="display" style={{fontSize: 36}}>
          They aren't paying <span className="display-italic" style={{color:'#FF8A6A'}}>a dividend.</span><br/>
          They are buying themselves back.
        </h2>
        <p className="body-copy" style={{marginTop: 16}}>
          Operating cash flow of <em style={{color:'#FFB098'}}>$1.89B</em>, free cash flow of <em style={{color:'#FFB098'}}>$1.31B</em> — and the company spent
          <em style={{color:'#FFB098'}}> nearly $1.8B</em> on share buybacks in 2025 alone, on top of <em style={{color:'#FFB098'}}>$10.2B</em> of long-term debt.
          The result is a balance sheet with <span style={{color:'#FF8A6A', fontStyle:'italic', fontFamily:'var(--font-display)'}}>negative equity</span>.
        </p>
        <EquityScene />
        <div className="bet-figures">
          <div className="bet-fig">
            <div className="num signal">-$651M</div>
            <div className="lab">Total Equity</div>
          </div>
          <div className="bet-fig">
            <div className="num">$10.2B</div>
            <div className="lab">Long-term Debt</div>
          </div>
          <div className="bet-fig">
            <div className="num">$8.0B</div>
            <div className="lab">Buyback Authorization</div>
          </div>
          <div className="bet-fig">
            <div className="num">$0.00</div>
            <div className="lab">Common Dividend</div>
          </div>
        </div>
        <p className="body-copy" style={{marginTop: 22, fontSize: 13}}>
          November 2025 brought a refinancing: a new <em style={{color:'#FFB098'}}>$2.0B</em> Term Loan A-2, a <em style={{color:'#FFB098'}}>$1.5B</em> revolver, and <em style={{color:'#FFB098'}}>$1.0B</em> of 6.75% senior notes due 2033.
          Goodwill and intangibles sit near <em style={{color:'#FFB098'}}>$7.4B</em> — the residue of years of acquisition.
        </p>
      </section>

      {/* COMPETITORS */}
      <section className="beat" data-screen-label="11 The competition">
        <div className="beat-eyebrow eyebrow"><span className="dot" /><span className="eyebrow-num">08 ·</span> The competition</div>
        <h2 className="display" style={{fontSize: 36}}>
          A few <span className="display-italic" style={{color:'var(--fluid-500)'}}>peers,</span> one true rival.
        </h2>
        <p className="body-copy" style={{marginTop: 14}}>
          Tap a row to expand. Bars are sized to market cap.
        </p>
        <CompetitorsList companies={DATA.competitors} />
      </section>

      {/* CLOSE — INVERTS HERO */}
      <section className="close" data-screen-label="12 Close">
        <div className="beat-eyebrow eyebrow"><span className="dot" /><span className="eyebrow-num">09 ·</span> The takeaway</div>
        <h2 className="close-headline">
          Three times a week,<br/>
          <span className="it">fifteen cents</span><br/>
          make it through.
        </h2>
        <CloseScene />
        <p className="body-copy" style={{marginTop: 8}}>
          Of every dollar that arrives at the chair, <em>fifteen cents</em> reach operating income.
          The rest stays in the room — care, overhead, depreciation, interest. <span className="signal">It's a thin filter, run very wide.</span>
        </p>
        <div className="close-foot">
          <div className="l">DVA · Recap · FY '25</div>
          <div className="l">— end —</div>
        </div>
      </section>

      <div className="colophon">
        <div className="row">
          <span>Source · 10-K · 10-Q · Press releases</span>
          <span>Prepared 2026</span>
        </div>
        <div className="blurb">
          A long-form recap, not a recommendation. Figures rounded for narrative clarity.
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

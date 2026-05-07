/* JBL Recap — single-file React app
   Mounted to #root. Mobile-first editorial scroll. */

const { useEffect, useRef, useState, useMemo } = React;

/* ---------- Hooks ---------- */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { setSeen(true); io.disconnect(); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

/* Element-relative scroll progress 0..1 across viewport pass */
function useElementProgress() {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when bottom of vp meets top of el; 1 when top of vp meets bottom of el
      const start = vh;            // distance from top of vp to top of el at 0
      const end = -r.height;       // at 1
      const pos = vh - r.top;      // distance traversed
      const total = vh + r.height;
      setP(Math.min(1, Math.max(0, pos / total)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return [ref, p];
}

function useCountUp(target, run, { duration = 1400, fmt } = {}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const e = 1 - Math.pow(1 - t, 3);
      setV(target * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return fmt ? fmt(v) : v;
}

/* ---------- Sticky chrome ---------- */
function Chrome({ progress }) {
  return (
    <div className="chrome">
      <div className="chrome-row">
        <span className="chrome-tick">JBL</span>
        <span className="chrome-name">Jabil Inc.</span>
        <span className="chrome-spacer"></span>
        <span className="chrome-label">Recap · FY '25</span>
      </div>
      <div className="chrome-progress">
        <div className="chrome-progress-fill" style={{ '--p': `${(progress*100).toFixed(2)}%` }} />
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const [ref, seen] = useReveal();
  const [pRef, p] = useElementProgress();
  // Hero: animated stitched-line graphic that "draws" as user enters
  return (
    <section className="hero" ref={pRef}>
      <HeroLines p={p} />
      <div ref={ref} className={`reveal ${seen ? 'in' : ''}`}>
        <div className="eyebrow" style={{marginBottom: 18}}>
          <span className="dot"></span>
          <span>The recap · <span className="num">JBL</span></span>
        </div>
        <h1>
          The <em className="italic">hands</em><br/>
          behind the<br/>
          <em className="italic signal">hardware.</em>
        </h1>
        <p className="sub">
          You've never bought a Jabil product. You've bought hundreds. Jabil is the global contract manufacturer that designs, fabricates, and ships the things <em className="signal">other companies sell</em> — from AI servers to insulin pumps to EV inverters.
        </p>
        <div className="hero-meta">
          <div className="stat">
            <span className="v">$29.80B</span>
            <span className="l">FY25 Revenue</span>
          </div>
          <div className="stat">
            <span className="v">$33.94B</span>
            <span className="l">Market Cap</span>
          </div>
        </div>
      </div>
      <div className="hero-tick">
        <span>Scroll</span>
        <svg viewBox="0 0 10 16" fill="none">
          <path d="M5 0 V14" stroke="currentColor" strokeWidth="1"/>
          <path d="M1 10 L5 14 L9 10" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      </div>
    </section>
  );
}

function HeroLines({ p }) {
  // Decorative "schematic" lines that animate with scroll progress.
  // Suggests assembly / wiring.
  const dash = 1 - Math.min(1, Math.max(0, p * 1.6));
  return (
    <svg
      viewBox="0 0 400 600"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    >
      <defs>
        <pattern id="dotgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.7" fill="#16140F" opacity="0.18"/>
        </pattern>
      </defs>
      <rect width="400" height="600" fill="url(#dotgrid)" opacity="0.6" />
      <g stroke="#16140F" strokeWidth="0.8" fill="none" opacity="0.35"
         style={{ strokeDasharray: 1, strokeDashoffset: dash, pathLength: 1 }}>
        <path d="M -10 120 L 80 120 L 120 160 L 220 160 L 260 120 L 410 120" pathLength="1" />
        <path d="M -10 220 L 60 220 L 100 260 L 410 260" pathLength="1" />
        <path d="M -10 380 L 130 380 L 170 420 L 280 420 L 320 380 L 410 380" pathLength="1" />
      </g>
      <g fill="#FF7A57" opacity="0.85">
        <circle cx="80" cy="120" r="2.2"/>
        <circle cx="220" cy="160" r="2.2"/>
        <circle cx="100" cy="260" r="2.2"/>
        <circle cx="280" cy="420" r="2.2"/>
      </g>
    </svg>
  );
}

/* ---------- Reset beat ---------- */
function Reset({ children, dark, attrib }) {
  const [ref, seen] = useReveal();
  return (
    <div className={`reset ${dark ? 'dark' : ''}`}>
      <div ref={ref} className={`reveal ${seen ? 'in' : ''}`}>
        <div className="quote">{children}</div>
        {attrib && <div className="attrib">{attrib}</div>}
      </div>
    </div>
  );
}

/* ---------- Beat: business model ---------- */
function BusinessBeat() {
  const [ref, seen] = useReveal();
  return (
    <section className="beat">
      <div className="beat-head" ref={ref}>
        <div className={`reveal ${seen ? 'in' : ''}`}>
          <div className="eyebrow"><span className="dot"></span><span>Beat 02 · The business</span></div>
          <h2 style={{marginTop: 14}}>Three lines.<br/><em>One factory.</em></h2>
          <p className="lede">Jabil reports through three segments. Each is a different end of the same shop floor — design, fabricate, assemble, ship — for someone else's logo.</p>
        </div>
      </div>
      <div className="segments">
        <Segment
          n="01"
          name={<>Intelligent <em>Infrastructure</em></>}
          tags={['AI INFRA', 'CLOUD', 'NETWORKING', 'CAPITAL EQ.']}
          pull="+62%"
          pullLab="Q4 FY25 YoY"
        />
        <Segment
          n="02"
          name={<>Regulated <em>Industries</em></>}
          tags={['AUTOMOTIVE', 'HEALTHCARE', 'PACKAGING', 'RENEWABLES']}
          pull="$8.28B"
          pullLab="Q2 FY26 Revenue"
        />
        <Segment
          n="03"
          name={<>Connected <em>Living</em></>}
          tags={['DIGITALIZATION', 'WAREHOUSE AUTO.', 'ROBOTICS', 'COMMERCE']}
          pull="$2.69"
          pullLab="Q2 FY26 EPS"
        />
      </div>
    </section>
  );
}

function Segment({ n, name, tags, pull, pullLab }) {
  const [ref, seen] = useReveal();
  return (
    <div className={`seg reveal ${seen ? 'in' : ''}`} ref={ref}>
      <div className="seg-num">{n}</div>
      <div>
        <div className="seg-name">{name}</div>
        <div className="seg-tags">
          {tags.map(t => <span className="seg-tag" key={t}>{t}</span>)}
        </div>
        <div className="seg-pull">
          <span className="num">{pull}</span>
          <span className="lab">{pullLab}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Beat: scale ---------- */
function ScaleBeat() {
  const [ref, seen] = useReveal();
  const employees = useCountUp(135000, seen, { duration: 1600, fmt: v => Math.round(v).toLocaleString() });
  const sites = useCountUp(100, seen, { duration: 1300, fmt: v => Math.round(v) });
  const countries = useCountUp(30, seen, { duration: 1100, fmt: v => Math.round(v) });
  return (
    <section className="beat" ref={ref}>
      <div className="beat-head">
        <div className={`reveal ${seen ? 'in' : ''}`}>
          <div className="eyebrow"><span className="dot"></span><span>Beat 03 · The scale</span></div>
          <h2 style={{marginTop: 14}}>Built at <em>industrial</em> scale.</h2>
          <p className="lede">Founded near Detroit in 1966; headquartered today in St. Petersburg, Florida. The factory floor never really stopped growing.</p>
        </div>
      </div>
      <div className="scale-stack">
        <div className={`scale-row reveal ${seen ? 'in' : ''}`}>
          <div className="lab">Employees</div>
          <div className="v"><em>~</em>{employees}</div>
          <div className="desc">People who clock in to a Jabil site somewhere in the world this morning.</div>
        </div>
        <div className={`scale-row reveal ${seen ? 'in' : ''}`} style={{transitionDelay: '120ms'}}>
          <div className="lab">Sites</div>
          <div className="v med">~{sites}</div>
          <div className="desc">Manufacturing locations, design centers, and supply-chain hubs.</div>
        </div>
        <div className={`scale-row reveal ${seen ? 'in' : ''}`} style={{transitionDelay: '240ms'}}>
          <div className="lab">Countries</div>
          <div className="v sm">{countries}</div>
          <div className="desc">A footprint deliberately diversified — and now, deliberately re-routed.</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Beat: penny on the dollar ---------- */
function PennyBeat() {
  const [ref, seen] = useReveal();
  // Cost of revenue 91, SGA 2, R&D 1, Amort 1 → remaining 5 cents survive (operating margin 4%, plus residual gross)
  // We'll color the 100 grid: 91 blue (cor), 2 green (sga), 1 red (rd), 1 amber (amo), 5 coral (signal/survives)
  const cells = useMemo(() => {
    const arr = [];
    const fill = [
      ['cor', 91],
      ['sga', 2],
      ['rd', 1],
      ['amo', 1],
      ['srv', 5],
    ];
    fill.forEach(([k, n]) => { for (let i = 0; i < n; i++) arr.push(k); });
    return arr;
  }, []);

  return (
    <section className="beat" ref={ref}>
      <div className="beat-head">
        <div className={`reveal ${seen ? 'in' : ''}`}>
          <div className="eyebrow"><span className="dot"></span><span>Beat 04 · A hundred cents in</span></div>
          <h2 style={{marginTop: 14}}>Where the <em>dollar</em> goes.</h2>
          <p className="lede">A hundred cents of revenue in. Four cents of <em className="body" style={{fontStyle:'italic'}}>operating profit</em> out. Contract manufacturing is volume, not margin — and the volume has to be precise.</p>
        </div>
      </div>
      <div className="penny-wrap">
        <div className="penny-grid">
          {cells.map((k, i) => (
            <div
              key={i}
              className="penny reveal in"
              data-k={k}
              style={{
                transitionDelay: seen ? `${i * 6}ms` : '0ms',
                opacity: seen ? 1 : 0,
                transform: seen ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 320ms var(--ease-out), transform 320ms var(--ease-out)',
              }}
            />
          ))}
        </div>
        <div className="penny-legend">
          <LegendRow color="#2563EB" lab="Cost of revenue" pct="91%" />
          <LegendRow color="#16A34A" lab="Selling, general & admin." pct="2%" />
          <LegendRow color="#DC2626" lab="Research & development" pct="1%" />
          <LegendRow color="#D97706" lab="Amortization & stock comp." pct="1%" />
          <LegendRow color="#FF7A57" lab="What survives — operating margin & residual" pct="~5¢" emph />
        </div>
        <div className="penny-pull" style={{marginTop: 26}}>
          Gross margin <span className="signal">8.9%</span>. Operating margin <span className="signal">4.0%</span>. The math works only at <em className="italic">$29.80B</em> in volume.
        </div>
      </div>
    </section>
  );
}

function LegendRow({ color, lab, pct, emph }) {
  return (
    <div className="legend-row">
      <div className="legend-sw" style={{ background: color }} />
      <div className="legend-lab" style={emph ? { color: 'var(--jbl-ink)', fontWeight: 500 } : {}}>{lab}</div>
      <div className="legend-pct">{pct}</div>
    </div>
  );
}

/* ---------- Beat: AI surge ---------- */
function SurgeBeat() {
  const [ref, seen] = useReveal();
  const surge = useCountUp(62, seen, { duration: 1500, fmt: v => Math.round(v) });
  const ai = useCountUp(6.5, seen, { duration: 1500, fmt: v => v.toFixed(1) });

  // Build a draw-on path representing accelerating AI revenue
  const pathRef = useRef(null);
  useEffect(() => {
    if (!seen || !pathRef.current) return;
    const len = pathRef.current.getTotalLength?.() || 600;
    pathRef.current.style.strokeDasharray = `${len}`;
    pathRef.current.style.strokeDashoffset = `${len}`;
    pathRef.current.getBoundingClientRect();
    pathRef.current.style.transition = 'stroke-dashoffset 1700ms var(--ease-out)';
    pathRef.current.style.strokeDashoffset = '0';
  }, [seen]);

  return (
    <section className="beat" ref={ref}>
      <div className="beat-head">
        <div className={`reveal ${seen ? 'in' : ''}`}>
          <div className="eyebrow"><span className="dot"></span><span>Beat 05 · The surge</span></div>
          <h2 style={{marginTop: 14}}>And then <em>AI</em> showed up.</h2>
          <p className="lede">Intelligent Infrastructure jumped <em className="body" style={{fontStyle:'italic'}}>62% year-over-year</em> in Q4 FY25. AI-related demand alone reached roughly $6.5B for the full year — Jabil's standout growth engine.</p>
        </div>
      </div>
      <div className="surge">
        <div className="surge-chart">
          <svg viewBox="0 0 320 200" preserveAspectRatio="none">
            {/* gridlines */}
            {[0,1,2,3,4].map(i => (
              <line key={i} x1="0" x2="320" y1={i*50} y2={i*50}
                    stroke="#D8D3C4" strokeWidth="0.6" strokeDasharray="2 3"/>
            ))}
            {/* baseline (other segments — flat) */}
            <path
              d="M 0 150 L 60 148 L 120 152 L 180 150 L 240 146 L 320 148"
              fill="none" stroke="#3A372E" strokeWidth="1.4" opacity="0.55"
            />
            {/* AI surge — accelerating */}
            <path
              ref={pathRef}
              d="M 0 170 L 60 165 L 120 150 L 180 120 L 240 80 L 320 30"
              fill="none" stroke="#FF7A57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Endpoint marker */}
            {seen && (
              <circle cx="320" cy="30" r="4" fill="#FF7A57">
                <animate attributeName="r" values="3;6;4" dur="1500ms" begin="1.6s" />
              </circle>
            )}
            {/* Labels */}
            <text x="6" y="14" fill="#6E6A5C" fontSize="9" fontFamily="Geist Mono, monospace" letterSpacing="0.08em">AI INFRA →</text>
            <text x="220" y="160" fill="#6E6A5C" fontSize="9" fontFamily="Geist Mono, monospace" letterSpacing="0.08em">OTHER SEGMENTS</text>
          </svg>
        </div>
        <div className="surge-axis">
          <span>Q1 FY25</span><span>Q2</span><span>Q3</span><span>Q4 FY25</span>
        </div>
        <div className="surge-stat">
          <div>
            <div className="v signal">+{surge}%</div>
            <div className="l">Q4 FY25 YoY · Intelligent Infrastructure</div>
          </div>
          <div>
            <div className="v">${ai}B</div>
            <div className="l">FY25 AI-related demand · mgmt. estimate</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Beat: footprint ---------- */
function FootprintBeat() {
  const [ref, seen] = useReveal();
  const data = [
    { key: 'americas', region: 'Americas', pct: 46, color: 'var(--jbl-ink)' },
    { key: 'apac', region: 'Asia-Pacific', pct: 41, color: 'var(--jbl-blue)' },
    { key: 'emea', region: 'Europe, Middle East & Africa', pct: 13, color: 'var(--jbl-signal)' },
  ];

  // 100-dot grid coloring by share
  const dots = useMemo(() => {
    const arr = [];
    let i = 0;
    data.forEach(d => { for (let n = 0; n < d.pct; n++) { arr.push(d.key); i++; } });
    while (arr.length < 100) arr.push('off');
    return arr;
  }, []);

  return (
    <section className="beat" ref={ref}>
      <div className="beat-head">
        <div className={`reveal ${seen ? 'in' : ''}`}>
          <div className="eyebrow"><span className="dot"></span><span>Beat 06 · Footprint</span></div>
          <h2 style={{marginTop: 14}}>The <em>shop floor</em> is the world.</h2>
          <p className="lede">Roughly half in the Americas, two-fifths in Asia-Pacific, the remainder in EMEA. The mix moves as customers re-route supply chains — and Jabil moves with them.</p>
        </div>
      </div>
      <div className="foot">
        <div className="foot-bar">
          {data.map((d, i) => (
            <div
              key={d.key}
              className={`foot-seg ${d.key}`}
              style={{
                width: seen ? `${d.pct}%` : '0%',
                transition: `width 1200ms var(--ease-out) ${i*150}ms`,
              }}
            >
              {seen && d.pct >= 13 && <span>{d.pct}%</span>}
            </div>
          ))}
        </div>
        <div className="foot-list">
          {data.map(d => (
            <div className="foot-row" key={d.key}>
              <div className="foot-sw" style={{ background: d.color }} />
              <div className="foot-region">{d.region}</div>
              <div className="foot-pct">{d.pct}%</div>
            </div>
          ))}
        </div>

        <div className="foot-grid-wrap">
          <div className="foot-grid">
            {dots.map((k, i) => {
              const color =
                k === 'americas' ? 'var(--jbl-ink)' :
                k === 'apac' ? 'var(--jbl-blue)' :
                k === 'emea' ? 'var(--jbl-signal)' : 'var(--jbl-line)';
              return (
                <div
                  key={i}
                  className="foot-dot"
                  style={{
                    background: seen ? color : 'var(--jbl-line)',
                    transition: `background 360ms var(--ease-out) ${seen ? i * 5 : 0}ms`,
                  }}
                />
              );
            })}
          </div>
          <div className="foot-grid-cap">
            Each dot · 1% of revenue. <em className="signal">·</em>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Beat: the bet (capital allocation) ---------- */
function BetBeat() {
  const [ref, seen] = useReveal();
  // Allocation against $1.17B FCF (FY25): ~$1.0B buybacks, $36M dividends, M&A residual.
  // Capex $468M against $1.64B operating cash flow → FCF $1.17B.
  const rows = [
    { label: <>Operating cash flow</>, v: '$1.64B', cls: '', w: 100, cap: 'FY25 · cash from operations' },
    { label: <>Less <em>capital expenditures</em></>, v: '$468M', cls: 'blue', w: 28, cap: 'Reinvested in plants, tools, capacity' },
    { label: <>Free cash flow</>, v: '$1.17B', cls: '', w: 71, cap: 'FY25 · what management can deploy' },
    { label: <><em>~80%</em> to share buybacks</>, v: '$1.0B', cls: 'signal', w: 86, cap: 'Stated capital-allocation target' },
    { label: <>Dividends paid</>, v: '$36M', cls: 'blue', w: 3, cap: 'Payout ratio · 4.33%' },
    { label: <><em>~20%</em> to M&A</>, v: 'Hanley Energy +', cls: 'signal', w: 14, cap: 'Higher-value markets · incl. data-center power' },
  ];
  return (
    <section className="beat" ref={ref}>
      <div className="beat-head">
        <div className={`reveal ${seen ? 'in' : ''}`}>
          <div className="eyebrow"><span className="dot"></span><span>Beat 07 · The bet</span></div>
          <h2 style={{marginTop: 14}}>One bet, in <em>plain numbers.</em></h2>
          <p className="lede">$2.39B in debt, $1.51B of equity, $1.93B of cash. Cash-generative, leveraged, and pointed almost entirely at <em className="body" style={{fontStyle:'italic'}}>buybacks</em> — with a small slice held back for targeted M&A.</p>
        </div>
      </div>
      <div className="bet">
        <div className="bet-flow">
          {rows.map((r, i) => (
            <div className="bet-row" key={i}>
              <div className="lab">{r.label}</div>
              <div className={`v ${r.cls}`}>{r.v}</div>
              <div className="meter">
                <div
                  className={`meter-fill ${r.cls}`}
                  style={{
                    '--w': `${r.w}%`,
                    width: seen ? `${r.w}%` : '0%',
                    transition: `width 1100ms var(--ease-out) ${i*120}ms`,
                  }}
                />
              </div>
              <div className="meter-cap">{r.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Beat: competitors ---------- */
function CompBeat() {
  const [ref, seen] = useReveal();
  const [open, setOpen] = useState(null);
  const jbl = { name: 'Jabil', tick: 'JBL', mc: 33.94, rev: 29.80 };
  const comps = [
    {
      name: <>Flex <em>Ltd</em></>, tick: 'FLEX', mc: 30.09, rev: 25.81,
      stats: [{l:'P/E', v:'35.31'}, {l:'Rev YoY', v:'-41.45%', neg:true}],
      desc: 'The most direct global rival in EMS — competing head-to-head for the same OEM contracts across data center, automotive, healthcare, and industrial.'
    },
    {
      name: <>Hewlett Packard <em>Enterprise</em></>, tick: 'HPE', mc: 35.08, rev: 33.53,
      stats: [{l:'Rev YoY', v:'+14.47%', pos:true}, {l:'Vector', v:'Vertical integration'}],
      desc: 'Designs and sells its own servers, networking, and AI infrastructure — the same product categories Jabil manufactures for hyperscalers — creating direct displacement risk as HPE pulls more in-house.'
    },
    {
      name: <>Celestica <em>Inc</em></>, tick: 'CLS', mc: 60.32, rev: 12.39,
      stats: [{l:'P/E', v:'52.91'}, {l:'Rev YoY', v:'+28.46%', pos:true}],
      desc: 'The emerging EMS rival rapidly gaining share in AI data-center and hyperscaler programs — the same high-growth segment driving Jabil\'s Intelligent Infrastructure — and increasingly displacing Jabil on new awards.'
    },
  ];

  const maxMc = Math.max(jbl.mc, ...comps.map(c => c.mc));

  return (
    <section className="beat" ref={ref}>
      <div className="beat-head">
        <div className={`reveal ${seen ? 'in' : ''}`}>
          <div className="eyebrow"><span className="dot"></span><span>Beat 08 · Competition</span></div>
          <h2 style={{marginTop: 14}}>Three <em>shadows</em> on the floor.</h2>
          <p className="lede">A direct rival, a customer turning vertical, and a smaller upstart whose market valuation has lapped them all. Tap any name to expand.</p>
        </div>
      </div>
      <div className="comp">
        {/* JBL anchor row */}
        <div className="comp-card" style={{cursor:'default'}}>
          <div className="comp-head">
            <div className="comp-name"><em>Jabil</em> · this page</div>
            <div className="comp-tick">JBL</div>
          </div>
          <div className="comp-mc-row">
            <div className="comp-mc-bar">
              <div
                className="comp-mc-fill signal"
                style={{
                  '--w': `${(jbl.mc/maxMc)*100}%`,
                  width: seen ? `${(jbl.mc/maxMc)*100}%` : '0%',
                  transition: 'width 900ms var(--ease-out)',
                }}
              />
            </div>
            <div className="comp-mc-val">$33.94B</div>
          </div>
          <div className="comp-stats">
            <span className="comp-stat">REV $29.80B</span>
            <span className="comp-stat">FY25</span>
          </div>
        </div>
        {comps.map((c, i) => (
          <div
            key={c.tick}
            className={`comp-card ${open === i ? 'open' : ''}`}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="comp-head">
              <div className="comp-name">{c.name}</div>
              <div className="comp-tick">{c.tick}</div>
            </div>
            <div className="comp-mc-row">
              <div className="comp-mc-bar">
                <div
                  className={`comp-mc-fill ${i === 2 ? '' : (i === 1 ? 'blue' : 'gray')}`}
                  style={{
                    '--w': `${(c.mc/maxMc)*100}%`,
                    width: seen ? `${(c.mc/maxMc)*100}%` : '0%',
                    transition: `width 900ms var(--ease-out) ${i*120 + 200}ms`,
                  }}
                />
              </div>
              <div className="comp-mc-val">${c.mc.toFixed(2)}B</div>
            </div>
            <div className="comp-stats">
              <span className="comp-stat">REV ${c.rev.toFixed(2)}B</span>
              {c.stats.map(s => (
                <span className="comp-stat" key={s.l}>
                  {s.l} <span className={s.pos ? 'pos' : s.neg ? 'neg' : ''}>{s.v}</span>
                </span>
              ))}
            </div>
            <div className="comp-desc">
              <div className="comp-desc-inner">{c.desc}</div>
            </div>
            <div className="comp-toggle">{open === i ? '— Collapse' : '+ Tap to read'}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Closing ---------- */
function CloseBeat() {
  const [ref, seen] = useReveal();
  const back = useCountUp(1.0, seen, { duration: 1500, fmt: v => v.toFixed(2) });
  const inn = useCountUp(29.80, seen, { duration: 1700, fmt: v => v.toFixed(2) });
  return (
    <section className="close-beat" ref={ref}>
      <div className={`reveal ${seen ? 'in' : ''}`}>
        <div className="eyebrow"><span className="dot"></span><span>The takeaway</span></div>
        <h2>The hands keep <em>building.</em></h2>
        <p className="epilogue">
          The page opened on $29.80B coming <em>in</em>. It closes on what goes <em>back</em>: roughly a billion to shareholders, a sliver to dividends, the rest re-deployed onto the next AI server, the next insulin pump, the next inverter that ships under <em>someone else's logo.</em>
        </p>
        <div className="close-flow">
          <div className="row">
            <div className="lab">In</div>
            <div className="desc">FY25 revenue</div>
            <div className="v">${inn}B</div>
          </div>
          <div className="row">
            <div className="lab">Out</div>
            <div className="desc">Buybacks · ~80% of FCF</div>
            <div className="v signal">${back}B</div>
          </div>
          <div className="row">
            <div className="lab">Forward</div>
            <div className="desc">AI-related demand · FY25</div>
            <div className="v">$6.5B</div>
          </div>
        </div>
        <div className="close-coda">
          The hardware on your desk has <em className="signal">someone else's name</em> on it. The hands that built it clock in at <em>JBL</em>.
        </div>
        <div className="close-foot">
          <span>JBL · Recap FY '25</span>
          <span>End</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- App ---------- */
function App() {
  const progress = useScrollProgress();
  return (
    <>
      <Chrome progress={progress} />
      <Hero />
      <Reset attrib="— What it is">
        You've never bought a Jabil product. <em className="signal">You've bought hundreds.</em>
      </Reset>
      <BusinessBeat />
      <ScaleBeat />
      <Reset>
        At this scale, <em className="signal">every cent is a war.</em>
      </Reset>
      <PennyBeat />
      <SurgeBeat />
      <FootprintBeat />
      <Reset dark attrib="— Capital allocation">
        And the bet, in <em className="signal">plain numbers.</em>
      </Reset>
      <BetBeat />
      <CompBeat />
      <CloseBeat />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// Main GDDY recap composition

const { useEffect: _useEffect, useRef: _useRef2, useState: _useState } = React;

function Reveal({ children, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`fade-in ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

function Chrome() {
  const y = useScrollY();
  const h = useDocHeight();
  const pct = Math.max(0, Math.min(1, y / h));
  return (
    <div className="chrome">
      <div className="chrome-row">
        <span className="chrome-ticker">GDDY</span>
        <span className="chrome-name">GoDaddy<span className="dot"></span></span>
        <span className="chrome-label">RECAP · FY '25</span>
      </div>
      <div className="chrome-progress">
        <div className="chrome-progress-fill" style={{ right: `${(1 - pct) * 100}%` }} />
      </div>
    </div>
  );
}

// ---------- HERO ----------
function Hero() {
  const heroRef = _useRef2(null);
  const p = useElementProgress(heroRef, { start: 1.0, end: 0.0 });
  return (
    <section ref={heroRef} className="hero" data-screen-label="01 Hero">
      <HeroTypedBackdrop y={p} />
      <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          <span className="accent">●</span>&nbsp;&nbsp;OPENING<span className="dot">·</span>WHO THIS IS
        </div>
        <h1 className="hero-headline">
          <span className="num">81 million</span><br />
          addresses.<br />
          <span style={{ color: 'var(--ink-3)' }}>One </span>
          <span className="accent">front<br/>door</span>
          <span className="stop">.</span>
        </h1>
        <p className="hero-sub">
          GoDaddy is the registry for roughly <span className="it">a fifth of the internet</span> — domains, hosting, payments, the whole back office of small business.
        </p>
        <div className="hero-meta">
          <span><span className="v">21%</span> of all domains</span>
          <span><span className="v">20.4M</span> customers</span>
          <span><span className="v">$11.43B</span> mkt cap</span>
        </div>
      </div>
      <div className="hero-scroll-cue">
        <span>scroll</span>
        <span className="line"></span>
      </div>
    </section>
  );
}

// ---------- RESET BEATS ----------
function ResetBeat({ mark, children }) {
  return (
    <section className="reset">
      <div className="reset-mark">{mark}</div>
      <div className="reset-text">{children}</div>
    </section>
  );
}

// ---------- BUSINESS — PIPES ----------
function BeatBusiness() {
  const ref = _useRef2(null);
  const p = useElementProgress(ref, { start: 0.85, end: 0.25 });
  return (
    <section ref={ref} className="beat" data-screen-label="02 Business">
      <Reveal>
        <div className="eyebrow beat-eyebrow">
          THE BUSINESS<span className="dot">·</span>HOW IT EARNS
        </div>
        <h2 className="beat-headline">
          Two pipes feed <span className="signal">$4.95B</span>.
        </h2>
        <p className="beat-lede">
          The plumbing — domains, renewals, hosting, security — is the <em>old reliable</em>. The newer line — websites, email, payments — is where growth lives. Both run on subscriptions; both refill themselves every year.
        </p>
      </Reveal>
      <BusinessPipes progress={p} />
      <div className="pipes-caption">
        <div className="col">
          <div><span className="seg">CORE · $3.1B</span></div>
          <div>62% of revenue</div>
          <div className="grow">+5% YOY</div>
        </div>
        <div className="col">
          <div><span className="seg">A&amp;C · $1.9B</span></div>
          <div>38% of revenue</div>
          <div className="grow">+14% YOY</div>
        </div>
      </div>
    </section>
  );
}

// ---------- SCALE ----------
function ScaleRow({ label, sub, target, prefix = "", suffix = "", decimals = 0, italic = false }) {
  const [ref, visible] = useReveal();
  const v = useCountUp(target, visible, 1500);
  return (
    <div ref={ref} className="scale-row">
      <div className="scale-label">{label}<small>{sub}</small></div>
      <div className={`scale-num ${italic ? 'it' : ''}`}>
        {prefix}{fmtNum(v, { decimals })}<span className="unit">{suffix}</span>
      </div>
    </div>
  );
}

function BeatScale() {
  return (
    <section className="beat" data-screen-label="03 Scale">
      <Reveal>
        <div className="eyebrow beat-eyebrow">THE SCALE<span className="dot">·</span>BY THE NUMBERS</div>
        <h2 className="beat-headline">
          Big in <span className="signal">aggregate</span>,<br/>boring by design.
        </h2>
        <p className="beat-lede">
          Each transaction is small. <em>The aggregate is not.</em>
        </p>
      </Reveal>
      <div className="scale-grid">
        <ScaleRow label="DOMAINS UNDER MGMT" sub="as of dec 31, 2025" target={81} suffix="M" italic />
        <ScaleRow label="GLOBAL SHARE" sub="of all registered domains" target={21} suffix="%" />
        <ScaleRow label="CUSTOMERS" sub="worldwide" target={20.4} decimals={1} suffix="M" italic />
        <ScaleRow label="EMPLOYEES" sub="ye 2025" target={5845} />
        <ScaleRow label="MARKET CAP" sub="public valuation" prefix="$" target={11.43} decimals={2} suffix="B" italic />
        <ScaleRow label="OPERATING MARGIN" sub="fy 2025" target={22.8} decimals={1} suffix="%" />
      </div>
    </section>
  );
}

// ---------- COSTS — DOLLAR OF CENTS ----------
function BeatCosts() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className="beat" data-screen-label="04 Costs">
      <Reveal>
        <div className="eyebrow beat-eyebrow">A HUNDRED CENTS IN<span className="dot">·</span>WHAT THEY DO</div>
        <h2 className="beat-headline">
          One dollar in.<br/><span className="it signal">A few survive.</span>
        </h2>
        <p className="beat-lede">
          For every dollar GoDaddy collects, this is where it goes. The colored cents are the costs the company reports; the open cells are <em>what's left</em> for everything else — interest, taxes, the bottom line.
        </p>
      </Reveal>
      <DollarOfCents visible={visible} />
      <div className="cents-legend">
        <div className="cents-legend-row">
          <div className="cents-legend-sw" style={{ background: 'var(--cost-1)' }} />
          <div className="cents-legend-label">Cost of revenue</div>
          <div className="cents-legend-pct">36¢</div>
        </div>
        <div className="cents-legend-row">
          <div className="cents-legend-sw" style={{ background: 'var(--cost-2)' }} />
          <div className="cents-legend-label">Tech &amp; development</div>
          <div className="cents-legend-pct">17¢</div>
        </div>
        <div className="cents-legend-row">
          <div className="cents-legend-sw" style={{ background: 'var(--cost-3)' }} />
          <div className="cents-legend-label">SG&amp;A</div>
          <div className="cents-legend-pct">15¢</div>
        </div>
        <div className="cents-legend-row">
          <div className="cents-legend-sw" style={{ background: 'var(--cost-4)' }} />
          <div className="cents-legend-label">Depreciation &amp; amortization</div>
          <div className="cents-legend-pct">5¢</div>
        </div>
      </div>
      <div className="cents-survives">
        <div className="cents-survives-num">23¢</div>
        <div className="cents-survives-text">
          operating margin —<br/>
          <span className="it">$1.13B</span> of every $4.95B<br/>
          makes it past the line.
        </div>
      </div>
    </section>
  );
}

// ---------- FOOTPRINT ----------
function BeatFootprint() {
  const ref = _useRef2(null);
  const p = useElementProgress(ref, { start: 0.85, end: 0.3 });
  return (
    <section ref={ref} className="beat" data-screen-label="05 Footprint">
      <Reveal>
        <div className="eyebrow beat-eyebrow">FOOTPRINT<span className="dot">·</span>WHERE THE MONEY LIVES</div>
        <h2 className="beat-headline">
          A US business<br/>with a <span className="signal">passport</span>.
        </h2>
        <p className="beat-lede">
          The bulk of the revenue is domestic — but a third of it lives outside the country, riding the same domains-and-hosting rails into <em>every economy</em> with a small business and a search bar.
        </p>
      </Reveal>
      <div className="geo-stage">
        <FootprintScene progress={p} />
      </div>
      <div className="geo-stats">
        <div className="geo-stat">
          <div className="geo-stat-pct">68<span style={{fontSize:'24px'}}>%</span></div>
          <div className="geo-stat-label">United States</div>
        </div>
        <div className="geo-stat">
          <div className="geo-stat-pct it">32<span style={{fontSize:'24px'}}>%</span></div>
          <div className="geo-stat-label">International</div>
        </div>
      </div>
    </section>
  );
}

// ---------- DEBT INTERLUDE (DARK) ----------
function BeatDebt() {
  const ref = _useRef2(null);
  const p = useElementProgress(ref, { start: 0.85, end: 0.3 });
  return (
    <section ref={ref} className="dark" data-screen-label="06 Debt">
      <div className="eyebrow beat-eyebrow"><span className="accent">●</span>&nbsp;&nbsp;THE BILL<span className="dot">·</span>$3.77B</div>
      <h2 className="beat-headline" style={{ color: '#F4F2ED' }}>
        Leverage,<br/><span className="it" style={{ color: 'var(--coral-300)' }}>by inheritance.</span>
      </h2>
      <p className="body" style={{ marginTop: 18 }}>
        GoDaddy carries the capital structure of an <em>old leveraged buyout</em> — debt stacked seventeen times equity. <span className="signal">$3.77B against $215M.</span> The cash flow is the only reason the math works.
      </p>
      <DebtBalance progress={p} />
      <div className="balance-legend">
        <div>
          <div className="l-label">Operating cash flow</div>
          <span className="l-val">$1.60B</span>
        </div>
        <div>
          <div className="l-label">Free cash flow</div>
          <span className="l-val alert">$1.58B</span>
        </div>
      </div>
      <div className="dark-aside">
        Capex is <span className="v">$23.9M</span>. The business <em style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', color: '#F4F2ED' }}>doesn't need much</em>, so almost all of that cash is free — and almost none of it stays as cash.
      </div>
    </section>
  );
}

// ---------- BUYBACK BEAT ----------
function BeatBuyback() {
  const ref = _useRef2(null);
  const p = useElementProgress(ref, { start: 0.85, end: 0.3 });
  return (
    <section ref={ref} className="beat" data-screen-label="07 Buyback">
      <Reveal>
        <div className="eyebrow beat-eyebrow">THE BET<span className="dot">·</span>BUY BACK THE COMPANY</div>
        <h2 className="beat-headline">
          No dividend.<br/>One <span className="signal">obsession</span>.
        </h2>
        <p className="beat-lede">
          Every dollar of free cash flow points at the same target: <em>the share count itself.</em> GoDaddy buys its own equity, retires it, and does it again.
        </p>
      </Reveal>
      <div className="buyback-stage">
        <ShrinkingShares progress={p} />
      </div>
      <div className="buyback-callout">
        <div className="buyback-num">−<span className="pct">33%</span></div>
        <div className="buyback-text">
          shares outstanding,<br/>
          <span className="it">2021 → 2025</span>.<br/>
          $1.6B retired in 2025 alone — 10.2M shares.
        </div>
      </div>
    </section>
  );
}

// ---------- COMPETITORS ----------
function CompRow({ ticker, name, valueBn, label, color = "ink", widthPct, aside }) {
  const [ref, visible] = useReveal();
  const w = visible ? widthPct : 0;
  return (
    <div ref={ref} className={`comp-row ${color === 'coral' ? 'self' : ''}`}>
      <div className="comp-meta">
        <span className="ticker">{ticker}</span>
        <span className="name">{name}</span>
      </div>
      <div>
        <div className="comp-bar-wrap">
          <div className={`comp-bar ${color}`} style={{ width: `${w}%`, transition: 'width 1100ms cubic-bezier(0.22,1,0.36,1)' }}>
            <span className="comp-bar-num">{label}</span>
          </div>
        </div>
        {aside && <div className="comp-aside">{aside}</div>}
      </div>
    </div>
  );
}

function BeatCompetitors() {
  // Market caps (per JSON):
  // GDDY $11.43B, HUBS $11.73B, IT (Gartner) $10.89B, SQSP unknown
  // Scale bars to widest = HUBS = 11.73 → 100%
  const max = 11.73;
  return (
    <section className="beat" data-screen-label="08 Competitors">
      <Reveal>
        <div className="eyebrow beat-eyebrow">THE NEIGHBORHOOD<span className="dot">·</span>WHO ELSE LIVES HERE</div>
        <h2 className="beat-headline">
          Everyone wants to be <span className="signal">the small-business OS</span>.
        </h2>
        <p className="beat-lede">
          GoDaddy doesn't fight a single rival. It's flanked by a marketing platform, an advisory shop, and a designer-darling site builder — each <em>circling the same customer</em>, the small business that needs one tool that does it all.
        </p>
      </Reveal>
      <div className="comp-stage">
        <CompRow
          ticker="GDDY"
          name="GoDaddy"
          color="coral"
          widthPct={(11.43 / max) * 100}
          label="$11.43B · +growing buyback"
          aside={<>The incumbent registrar. <span className="it">+5% Core, +14% A&amp;C</span>; 22.8% operating margin.</>}
        />
        <CompRow
          ticker="HUBS"
          name="HubSpot"
          color="iris"
          widthPct={(11.73 / max) * 100}
          label="$11.73B · +19.2% YOY"
          aside={<>Marketing, CRM, websites in one. Overlaps the <span className="it">A&amp;C segment</span> directly. P/E 255.6x.</>}
        />
        <CompRow
          ticker="IT"
          name="Gartner"
          color="ink"
          widthPct={(10.89 / max) * 100}
          label="$10.89B · +3.7% YOY"
          aside={<>Advisory at scale. <span className="it">$6.5B revenue</span>. Different shape, same buyer.</>}
        />
        <CompRow
          ticker="SQSP"
          name="Squarespace"
          color="gray"
          widthPct={42}
          label="private · designer-led"
          aside={<>The aesthetic alternative. Smaller, focused on the <span className="it">website itself</span>, not the back office.</>}
        />
      </div>
    </section>
  );
}

// ---------- CLOSE ----------
function BeatClose() {
  return (
    <section className="close" data-screen-label="09 Close">
      <Reveal>
        <div className="eyebrow beat-eyebrow"><span className="accent">●</span>&nbsp;&nbsp;THE TAKEAWAY<span className="dot">·</span>WHAT REMAINS</div>
      </Reveal>
      <div className="close-frame">
        <Reveal>
          <div className="close-headline">
            81 million addresses in.<br/>
            <span className="it">Fewer shares</span> out.
          </div>
        </Reveal>
        <Reveal>
          <div className="close-tail">
            That's the whole machine. The domains keep renewing. The cash keeps coming. The bill from the buyout still sits there — but the share count keeps falling, <span className="it">and what remains is worth more.</span>
          </div>
        </Reveal>
      </div>
      <div className="colophon">
        <span>GDDY · NASDAQ</span>
        <span>RECAP · FY '25</span>
      </div>
    </section>
  );
}

// ---------- APP ----------
function App() {
  return (
    <div className="page">
      <Chrome />
      <Hero />
      <BeatBusiness />

      <ResetBeat mark="INTERLUDE · SCALE">
        Each domain costs what a coffee costs. <span className="signal">Eighty‑one million coffees</span>, every year — and each one renews on its own.
      </ResetBeat>

      <BeatScale />
      <BeatCosts />

      <ResetBeat mark="INTERLUDE · GEOGRAPHY">
        The internet is global. <span className="signal">The cash register</span> is mostly American.
      </ResetBeat>

      <BeatFootprint />
      <BeatDebt />

      <ResetBeat mark="INTERLUDE · CAPITAL">
        You don't pay a dividend when you can <span className="signal">buy the company back</span> from itself.
      </ResetBeat>

      <BeatBuyback />
      <BeatCompetitors />
      <BeatClose />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// CLX Recap — section components
const { useRef, useEffect, useState } = React;

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, seen] = useReveal();
  return (
    <div ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`}
         style={{ transitionDelay: seen ? `${delay}ms` : '0ms' }}>
      {children}
    </div>
  );
}

/* ----------------------------------------------------- HERO */
function Hero() {
  const ref = useRef(null);
  const t = useScrollPosition(ref);
  return (
    <section className="hero beat--first" ref={ref}>
      <div className="eyebrow">
        CLX <span className="dot">·</span> The Clorox Co. <span className="dot">·</span>
        <span className="alt">FY '25 Recap</span>
      </div>

      <h1 className="hero__thesis">
        Open the cabinet<br/>
        under any<br/>
        <span className="accent">American sink.</span>
      </h1>

      <p className="hero__sub">
        Bleach. Trash bags. Ranch dressing. Charcoal. Lip balm.
        Nine household names, <span className="em">one company</span> —
        sold in more than 100 countries, made in Oakland since 1913.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
        <HeroBottle progress={t} />
      </div>

      <div className="hero__metafooter">
        <div>
          Mkt Cap
          <strong>$12.64B</strong>
        </div>
        <div style={{ textAlign: 'center' }}>
          Revenue · FY25
          <strong>$7.10B</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          Net Income
          <strong>$810M</strong>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- THE BUSINESS — brand shelf */
function Business() {
  const brands = [
    { name: 'Clorox',    cat: 'BLEACH',     cls: 'brand--clorox',  ital: true },
    { name: 'Pine-Sol',  cat: 'CLEANER',    cls: 'brand--pine' },
    { name: 'Glad',      cat: 'BAGS',       cls: 'brand--glad' },
    { name: 'Hidden\u00A0Valley', cat: 'DRESSING', cls: 'brand--hidden', ital: true },
    { name: 'Kingsford', cat: 'CHARCOAL',   cls: 'brand--king' },
    { name: 'Brita',     cat: 'WATER',      cls: 'brand--brita' },
    { name: "Burt's Bees", cat: 'PERSONAL', cls: 'brand--burts' },
    { name: 'Fresh\u00A0Step', cat: 'CAT LITTER', cls: 'brand--fresh' },
    { name: 'Liquid-Plumr', cat: 'DRAINS', cls: 'brand--lp' },
  ];
  return (
    <section className="beat">
      <div className="eyebrow beat__eyebrow">
        02 <span className="dot">·</span> The portfolio
      </div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 44, lineHeight: 1.0 }}>
          Nine names<br/>that share <span className="serif-italic" style={{ color: 'var(--clx-blue)' }}>a shelf.</span>
        </h2>
        <p style={{ marginTop: 16 }}>
          Four segments — Health & Wellness, Household, Lifestyle,
          International — but the story is simpler than that.
          Over <span className="em">eighty percent</span> of sales come from
          brands ranked No. 1 or No. 2 in their category.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="shelf">
          <div className="shelf__row">
            {brands.slice(0,3).map((b, i) => (
              <div className={`brand ${b.cls}`} key={i}>
                <div className={`brand__name ${b.ital ? 'ital' : ''}`}>{b.name}</div>
                <div className="brand__cat">{b.cat}</div>
              </div>
            ))}
          </div>
          <div className="shelf__line"></div>
          <div className="shelf__row">
            {brands.slice(3,6).map((b, i) => (
              <div className={`brand ${b.cls}`} key={i}>
                <div className={`brand__name ${b.ital ? 'ital' : ''}`}>{b.name}</div>
                <div className="brand__cat">{b.cat}</div>
              </div>
            ))}
          </div>
          <div className="shelf__line"></div>
          <div className="shelf__row">
            {brands.slice(6,9).map((b, i) => (
              <div className={`brand ${b.cls}`} key={i}>
                <div className={`brand__name ${b.ital ? 'ital' : ''}`}>{b.name}</div>
                <div className="brand__cat">{b.cat}</div>
              </div>
            ))}
          </div>
          <div className="shelf__line"></div>
        </div>
      </Reveal>
    </section>
  );
}

/* ----------------------------------------------------- THE SCALE */
function Scale() {
  const [ref, seen] = useReveal();
  const rev   = useCountUp(7.10, seen, { decimals: 2, prefix: '$', suffix: 'B' });
  const eps   = useCountUp(1.39, seen, { decimals: 2, prefix: '$' });
  const gm    = useCountUp(45.2, seen, { decimals: 1, suffix: '%' });
  const emp   = useCountUp(7600, seen);
  const ctr   = useCountUp(100,  seen);

  return (
    <section className="beat" ref={ref}>
      <div className="eyebrow beat__eyebrow">
        03 <span className="dot">·</span> The scale
      </div>
      <h2 className="bigfig">
        <span className="ital">$7.10</span><span style={{ fontSize: '0.55em' }}>B</span>
      </h2>
      <div className="unit">FY 2025 net sales · 45.2% gross margin</div>

      <p style={{ marginTop: 24 }}>
        Most recent quarter: <span className="em">$1.67B</span> in revenue,
        EPS of $1.39. Operating cash of $981M. Free cash flow of $761M.
        Steady, mature, <span className="em">slow-growing</span> — the staples profile.
      </p>

      <div className="statgrid">
        <div className="statgrid__cell">
          <div className="num">{seen ? rev : '$0.00B'}</div>
          <div className="lbl">Revenue · FY25</div>
        </div>
        <div className="statgrid__cell">
          <div className="num ital">{seen ? gm : '0.0%'}</div>
          <div className="lbl">Gross margin</div>
        </div>
        <div className="statgrid__cell">
          <div className="num">{seen ? eps : '$0.00'}</div>
          <div className="lbl">EPS · Q2 FY26</div>
        </div>
        <div className="statgrid__cell">
          <div className="num ital">{seen ? emp : '0'}</div>
          <div className="lbl">Employees</div>
        </div>
      </div>

      {/* Walmart concentration */}
      <div className="walmart">
        <div className="walmart__head">
          <span>Customer concentration</span>
          <span>FY25</span>
        </div>
        <div className="walmart__bar">
          <div className="wm" style={{ width: seen ? '27%' : '0%' }}></div>
          <div className="other"></div>
        </div>
        <div className="walmart__legend">
          <span style={{ color: 'var(--clx-blue)', fontWeight: 500 }}>Walmart · 27%</span>
          <span>Everyone else · 73%</span>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- WHERE THE MONEY GOES */
function Costs({ data }) {
  const [ref, seen] = useReveal();
  return (
    <section className="beat" ref={ref}>
      <div className="eyebrow beat__eyebrow">
        04 <span className="dot">·</span> Where the dollar goes
      </div>
      <h2 className="display" style={{ fontSize: 44 }}>
        A hundred cents<br/>walk in the door.
      </h2>
      <p style={{ marginTop: 16 }}>
        Most of them never leave. The cost of goods sold takes the
        <span className="em">biggest pull</span> — raw resin, fragrance, fill,
        labor. Then SG&A. Then advertising — because a brand untended
        is a brand forgotten.
      </p>

      <CostDroplets data={data} fire={seen} />

      <div style={{ marginTop: 6 }}>
        {data.map((d, i) => (
          <div className="cost-row" key={i}>
            <span className="cost-row__sw" style={{ background: d.color }}></span>
            <span className="cost-row__pct">{d.pct}%</span>
            <span className="cost-row__lbl">{d.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------- FOOTPRINT */
function Footprint({ regions }) {
  const [ref, seen] = useReveal();
  return (
    <section className="beat" ref={ref}>
      <div className="eyebrow beat__eyebrow">
        05 <span className="dot">·</span> Footprint
      </div>
      <h2 className="display" style={{ fontSize: 44 }}>
        America, mostly.<br/>
        <span className="serif-italic" style={{ color: 'var(--clx-blue)' }}>Then a thin perimeter.</span>
      </h2>
      <p style={{ marginTop: 16 }}>
        Eighty-six cents of every revenue dollar comes from the U.S.
        The International segment exists, ships into more than a hundred
        countries — but it is a <span className="em">perimeter,</span> not a base.
      </p>

      <div className="map-wrap">
        <USMap fire={seen} />
        <div style={{ marginTop: 12 }}>
          {regions.map((r, i) => (
            <div className="region-row" key={i}>
              <span className="region-row__lbl">{r.region}</span>
              <span className="region-row__bar">
                <span style={{ width: seen ? `${r.pct}%` : '0%', transitionDelay: `${i*150}ms` }}></span>
              </span>
              <span className="region-row__pct">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- THE BET */
function Bet() {
  const items = [
    {
      date: 'APR 26',
      title: 'Acquired GOJO Industries',
      desc: 'Brought Purell — the most-recognized hand-sanitizer brand in America — under the Health & Wellness umbrella. Bolt-on, not transformational.',
      amt: 'Closed Apr 2026'
    },
    {
      date: 'FY25',
      title: 'ERP & digital transformation',
      desc: 'A multi-year overhaul of the operational backbone. The bet that the next decade of margin comes from systems, not slogans.',
      amt: '$570 – $580M total spend'
    },
    {
      date: 'SEP 24',
      title: 'Divested Better Health VMS',
      desc: 'Vitamins, minerals, supplements — out. The portfolio narrows toward what Clorox already wins.',
      amt: 'Portfolio simplification'
    },
    {
      date: 'FY25',
      title: 'Returned $934M to holders',
      desc: 'Dividends of $602M and roughly $332M in share buybacks — income-first, even with the balance sheet thin.',
      amt: '$602M dividends · $332M buyback'
    },
  ];
  return (
    <section className="beat">
      <div className="eyebrow beat__eyebrow">
        06 <span className="dot">·</span> The bet
      </div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 44 }}>
          Buy the next category.<br/>
          <span className="serif-italic" style={{ color: 'var(--clx-blue)' }}>Rebuild the spine.</span>
        </h2>
        <p style={{ marginTop: 16 }}>
          Capex of $220M in FY25 — modest. The real money is going
          into the digital backbone, while M&A trims and tucks the portfolio.
        </p>
      </Reveal>

      {items.map((it, i) => (
        <Reveal key={i} delay={i * 80}>
          <div className="bet-card">
            <div className="bet-card__date">{it.date}</div>
            <div>
              <div className="bet-card__title">{it.title}</div>
              <div className="bet-card__desc">{it.desc}</div>
              <div className="bet-card__amt">{it.amt}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

/* ----------------------------------------------------- THE WEIGHT (dark) */
function Weight() {
  const [ref, seen] = useReveal();
  return (
    <section className="weight" ref={ref}>
      <div className="eyebrow">
        07 <span className="dot" style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
        <span style={{ color: '#8C95A4' }}>The weight</span>
      </div>
      <h2 className="display" style={{ fontSize: 48, marginTop: 16 }}>
        <span className="serif-italic" style={{ color: 'var(--clx-cyan)' }}>Seven dollars</span> of debt<br/>
        for every dollar of equity.
      </h2>
      <p style={{ marginTop: 18 }}>
        The capital structure is not pretty.
        <span className="em"> $2.48B </span> of debt sits against
        <span className="em"> $321M </span> of equity and $167M of cash.
        Investment-grade ratings hold the line; $981M of operating
        cash keeps the lights on.
      </p>

      <div className="scale-frame">
        <ScaleBalance fire={seen} />
      </div>

      <div className="legend">
        <div>
          DEBT
          <strong className="num">$2.48B</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          EQUITY
          <strong className="num">$321M</strong>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- COMPETITION */
function Competition({ comps }) {
  // Clorox: market cap 12.64B, revenue 7.10B
  const us = { name: 'Clorox', ticker: 'CLX', cap: 12.64, rev: 7.10, growth: null };
  const enriched = comps.map(c => {
    // parse cap/rev/growth from description
    const cap = parseFloat((c.description.match(/market cap of \$([\d.]+)B/) || [])[1] || 0);
    const rev = parseFloat((c.description.match(/revenue of \$([\d.]+)B/) || [])[1] || 0);
    const growth = parseFloat((c.description.match(/growth(?: YoY)? of (-?[\d.]+)%/i) || [])[1] || 0);
    const pe = parseFloat((c.description.match(/P\/E TTM of ([\d.]+)/) || [])[1] || 0);
    return { ...c, cap, rev, growth, pe };
  });
  // bubble scaling — area proportional, so r = sqrt(cap)
  const allCaps = [us.cap, ...enriched.map(c => c.cap)];
  const maxCap = Math.max(...allCaps);
  const scaleR = (c) => Math.max(14, Math.sqrt(c / maxCap) * 50);

  return (
    <section className="beat" style={{ background: 'var(--clx-paper-2)' }}>
      <div className="eyebrow beat__eyebrow">
        08 <span className="dot">·</span> The shelf-mates
      </div>
      <Reveal>
        <h2 className="display" style={{ fontSize: 44 }}>
          Three rivals.<br/>
          <span className="serif-italic" style={{ color: 'var(--clx-blue)' }}>Different corners.</span>
        </h2>
        <p style={{ marginTop: 16 }}>
          Clorox does not have one obvious enemy. It has a small
          set of larger neighbors fighting for the
          <span className="em"> same shelf</span> at the same Walmart.
        </p>
      </Reveal>

      {enriched.map((c, i) => {
        const usR = scaleR(us.cap), themR = scaleR(c.cap);
        return (
          <Reveal key={i} delay={i * 80}>
            <div className="comp-card">
              <div className="comp-head">
                <span className="comp-name">{c.name}</span>
                <span className="comp-tick">{c.ticker}</span>
              </div>

              <div className="comp-bubbles">
                <div className="comp-bubbles__col">
                  <div className="comp-bubble comp-bubble--us"
                       style={{ width: `${usR*2}px`, height: `${usR*2}px` }}/>
                  <div className="comp-bubbles__lbl">CLX
                    <strong>${us.cap}B</strong>
                  </div>
                </div>
                <div className="comp-bubbles__col">
                  <div className="comp-bubble comp-bubble--them"
                       style={{ width: `${themR*2}px`, height: `${themR*2}px` }}/>
                  <div className="comp-bubbles__lbl">{c.ticker}
                    <strong>${c.cap}B</strong>
                  </div>
                </div>
              </div>

              <div className="comp-meta">
                <span>Rev <strong>${c.rev}B</strong></span>
                {c.pe ? <span>P/E <strong>{c.pe}</strong></span> : null}
                <span>YoY <strong className={c.growth >= 0 ? 'pos' : 'neg'}>
                  {c.growth >= 0 ? '+' : ''}{c.growth}%</strong></span>
              </div>

              <p className="comp-desc">{shortDesc(c)}</p>
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}

function shortDesc(c) {
  // Pull the punchy first clause from each competitor description.
  const map = {
    CHD: 'OxiClean, Arm & Hammer, Kaboom — head-to-head in cleaning, laundry, personal care across mass and grocery.',
    MKC: 'Branded condiments and seasonings — pressing on Hidden Valley\u2019s shelf in dressings, dips, and flavor.',
    TAP: 'A brewer, technically. But the same finite shelf and the same Walmart promotional budget — and an aggressive push into adjacent flavored beverages.',
  };
  return map[c.ticker] || c.description;
}

/* ----------------------------------------------------- CLOSING */
function Closing() {
  const [ref, seen] = useReveal();
  const cents = useCountUp(11, seen);
  return (
    <section className="closing" ref={ref}>
      <div className="eyebrow beat__eyebrow">
        09 <span className="dot">·</span> The takeaway
      </div>
      <h2 className="closing__display">
        A hundred cents in.<br/>
        <span className="accent">{seen ? cents : '0'}¢</span> make it<br/>
        out.
      </h2>
      <p className="closing__line">
        $810M in net income on $7.10B of sales. The cabinet
        under every American sink stays full —
        <span className="em"> the survival rate per dollar</span> is what
        keeps the dividend coming.
      </p>

      <div style={{ marginTop: 32 }}>
        <DollarHundredCents fire={seen} />
      </div>

      <div className="colophon">
        <div className="row"><span>Ticker</span><span>NYSE: CLX</span></div>
        <div className="row"><span>HQ</span><span>Oakland, CA</span></div>
        <div className="row"><span>Founded</span><span>May 3, 1913</span></div>
        <div className="row"><span>Segments</span><span>4</span></div>
        <div className="row"><span>Countries served</span><span>100+</span></div>
        <div className="row"><span>Recap built</span><span>Apr 2026</span></div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Business, Scale, Costs, Footprint, Bet, Weight, Competition, Closing, Reveal });

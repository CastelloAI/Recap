// VRTS scenes — bespoke SVG metaphor work, scroll-driven

const { useRef: sUseRef, useMemo, useEffect: sUseEffect, useState: sUseState } = React;

/* =========================================================
   HERO — $175B / 400 hands
   A field of 400 small marks; the "weight" of capital they
   carry materializes above as a rising plinth of $175B.
========================================================= */
function Hero() {
  const ref = sUseRef(null);
  const p = useScrollProgress(ref, { startOffset: 60 });
  const seen = useInView(ref, 0.05);

  // count up $175B
  const aum = (175 * ease.outCubic(clamp(p * 1.6))).toFixed(0);

  // 400 dots: 20 cols x 20 rows
  const cols = 20, rows = 20;
  const cell = 14, pad = 6;
  const w = cols * cell + pad * 2;
  const h = rows * cell + pad * 2;

  // dot opacity sweep — top→bottom illumination scrubbed by p
  const sweep = ease.outCubic(clamp(p * 1.4));

  return (
    <section className="hero" ref={ref}>
      <div className="grain" />
      <div className="meta">
        <span>NYSE · VRTS</span>
        <span>·</span>
        <span className="city">Hartford, CT</span>
      </div>

      <h1>
        <span className="i">$175 billion,</span><br />
        managed by<br />
        four hundred hands.
      </h1>

      <p className="deck">
        A multi-boutique asset manager — a partnership of <em>autonomous</em> investment houses
        under one Hartford roof. Tiny crew. Vast capital.
      </p>

      <div className="hands-wrap">
        <div className="hands-cap">
          <span>400 employees</span>
          <span className="right">≈ $438M each</span>
        </div>

        <svg className="dots-svg" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
          {/* dots, illuminated row by row as you scroll */}
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const i = r * cols + c;
              const rowP = r / (rows - 1);
              // dot lights as sweep crosses its row
              const local = clamp((sweep - rowP * 0.7) * 3);
              const opacity = 0.16 + local * 0.84;
              const fill = local > 0.6 ? "#7A1F2B" : "#15181C";
              return (
                <circle
                  key={i}
                  cx={pad + c * cell + cell / 2}
                  cy={pad + r * cell + cell / 2}
                  r={2.4}
                  fill={fill}
                  opacity={seen ? opacity : 0.16}
                />
              );
            })
          )}
        </svg>

        <div className="hands-foot">
          One employee for every <span className="num">{ '$438'.padStart(0) }M</span> under management —
          a leverage ratio almost no firm in finance can match.
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   VESSELS — boutiques as labeled urns under one roof
========================================================= */
function Vessels() {
  const ref = sUseRef(null);
  const p = useScrollProgress(ref);
  const seen = useInView(ref, 0.1);

  // 7 vessels of varying heights, each with a different hatch
  const W = 420, H = 360;
  const baseY = 280;
  const vessels = [
    { x: 30,  w: 36, h: 110, label: "Equity" },
    { x: 78,  w: 44, h: 150, label: "Fixed Income" },
    { x: 134, w: 38, h: 92,  label: "Multi-Asset" },
    { x: 184, w: 48, h: 170, label: "Alternatives" },
    { x: 244, w: 40, h: 124, label: "ETF" },
    { x: 296, w: 36, h: 100, label: "Closed-End" },
    { x: 344, w: 42, h: 138, label: "Institutional" },
  ];

  // vessels rise + fill as scroll passes
  return (
    <section className="vessels" ref={ref}>
      <div style={{ padding: "0 22px" }}>
        <Eyebrow num="01">The business</Eyebrow>
      </div>

      <h2>A house of <span className="i">distinct hands.</span></h2>
      <p className="lead">
        Virtus does not manage money itself. It runs a partnership of affiliated boutiques —
        each with its own style, its own process — and provides the <em>distribution and rails</em> beneath them.
        Fees on the assets flow up; autonomy flows down.
      </p>

      <svg className="vessels-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#7A1F2B" strokeWidth="1" />
          </pattern>
          <pattern id="hatch2" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#15181C" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* the roof — one thin line spanning all vessels */}
        <line x1="20" y1="34" x2={W - 20} y2="34" stroke="#15181C" strokeWidth="1" />
        <text x={W/2} y="22" textAnchor="middle" fontSize="9" letterSpacing="2.4" fill="#6E6A60">
          ONE ROOF
        </text>

        {/* the floor */}
        <line x1="20" y1={baseY + 4} x2={W - 20} y2={baseY + 4} stroke="#15181C" strokeWidth="1" />

        {vessels.map((v, i) => {
          const localStart = i / vessels.length * 0.5;
          const localEnd   = localStart + 0.55;
          const t = ease.outCubic(remap(p, localStart, localEnd, 0, 1));
          const fillH = v.h * t;
          // line dropping from roof to vessel top
          const topY = baseY - v.h;
          return (
            <g key={i} opacity={seen ? 1 : 0.0} style={{ transition: "opacity 0.6s ease" }}>
              {/* drop line from roof to vessel mouth */}
              <line x1={v.x + v.w/2} y1="34" x2={v.x + v.w/2} y2={topY} stroke="#15181C" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.5" />

              {/* vessel outline (urn-ish: rectangle with slight pinched top) */}
              <path
                d={`M ${v.x} ${topY + 6}
                    Q ${v.x} ${topY} ${v.x + 6} ${topY}
                    L ${v.x + v.w - 6} ${topY}
                    Q ${v.x + v.w} ${topY} ${v.x + v.w} ${topY + 6}
                    L ${v.x + v.w} ${baseY}
                    L ${v.x} ${baseY} Z`}
                fill="#F1ECE2"
                stroke="#15181C"
                strokeWidth="1"
              />

              {/* fluid level inside */}
              <rect
                x={v.x + 1}
                y={baseY - fillH}
                width={v.w - 2}
                height={fillH}
                fill="url(#hatch)"
                opacity="0.75"
              />
              <line
                x1={v.x + 1}
                y1={baseY - fillH}
                x2={v.x + v.w - 1}
                y2={baseY - fillH}
                stroke="#7A1F2B"
                strokeWidth="1.2"
              />

              {/* label */}
              <text
                x={v.x + v.w / 2}
                y={baseY + 18}
                textAnchor="middle"
                fontSize="7.5"
                letterSpacing="1.2"
                fill="#3A3F46"
                style={{ textTransform: "uppercase" }}
              >
                {v.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* small caption: the rails */}
        <text x={W/2} y={baseY + 38} textAnchor="middle" fontSize="8" letterSpacing="1.6" fill="#6E6A60">
          DISTRIBUTION · OPERATIONS · BUSINESS SUPPORT
        </text>
      </svg>

      <div className="vessels-cap">
        <span>Strategies across asset classes</span>
        <span className="right">Fees flow up · autonomy flows down</span>
      </div>
    </section>
  );
}

/* =========================================================
   SCALE — AUM, revenue, growth
========================================================= */
function Scale() {
  const ref = sUseRef(null);
  const p = useScrollProgress(ref);
  const seen = useInView(ref);

  const t = ease.outCubic(clamp(p * 1.4));
  const aum = (175 * t).toFixed(0);
  const rev = (906.9 * t).toFixed(1);
  const growth = (7 * t).toFixed(1);
  const mcap = (1.2 * t).toFixed(2);
  const employees = Math.round(400 * t);

  return (
    <section className="scale" ref={ref} style={{ padding: "60px 22px 64px" }}>
      <Eyebrow num="02">The scale</Eyebrow>

      <div style={{
        marginTop: 18,
        fontFamily: "'Instrument Serif', serif",
        fontSize: 36, lineHeight: 1.05,
        textWrap: "balance",
      }}>
        Small firm,<br />
        <span style={{ fontStyle: "italic", color: "#7A1F2B" }}>enormous capital.</span>
      </div>

      <p style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.55, color: "#3A3F46" }}>
        The numbers don't sit in proportion. Four hundred employees steward a balance
        normally found inside firms ten or twenty times their size.
      </p>

      <div className="stack">
        <div className="scale-row">
          <div className="label">AUM</div>
          <div>
            <div className="figure signal">${aum}<span className="unit">B</span></div>
            <div className="sub">Assets under management, year-end 2024.</div>
          </div>
        </div>

        <div className="scale-row">
          <div className="label">Revenue</div>
          <div>
            <div className="figure">${rev}<span className="unit">M</span></div>
            <div className="sub"><em>Up ~7% YoY.</em> Investment-management fees are the engine.</div>
          </div>
        </div>

        <div className="scale-row">
          <div className="label">Mkt Cap</div>
          <div>
            <div className="figure">${mcap}<span className="unit">B</span></div>
            <div className="sub">A market value roughly <em>1/146th</em> of the assets it stewards.</div>
          </div>
        </div>

        <div className="scale-row">
          <div className="label">Employees</div>
          <div>
            <div className="figure">{employees}</div>
            <div className="sub">One head for every ~$438M under management.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CENTS — Where the money goes (cost breakdown)
   100-cell grid; cells light by category
========================================================= */
function Cents() {
  const ref = sUseRef(null);
  const p = useScrollProgress(ref);
  const seen = useInView(ref);

  const costs = [
    { pct: 47, color: "#4F86C6", label: "Employment" },
    { pct: 18, color: "#F4A261", label: "Distribution & Admin" },
    { pct: 10, color: "#2A9D8F", label: "Other Operating" },
    { pct: 4,  color: "#E76F51", label: "Amort. & Depreciation" },
    { pct: 2,  color: "#9B5DE5", label: "Acquisition & Integration" },
  ];
  // rest = 19 → "what survives" (margin), in oxblood
  const survives = 100 - costs.reduce((s, c) => s + c.pct, 0);

  // build flat array of 100 colors
  const cells = useMemo(() => {
    const arr = [];
    costs.forEach(c => { for (let i = 0; i < c.pct; i++) arr.push({ color: c.color, kind: "cost" }); });
    for (let i = 0; i < survives; i++) arr.push({ color: "#7A1F2B", kind: "survive" });
    return arr;
  }, []);

  // reveal progress
  const reveal = ease.outQuart(clamp(p * 1.4));

  // 10x10 grid
  const cols = 10, rows = 10;
  const W = 380;
  const cell = (W - 18) / cols;
  const H = rows * cell + 16;

  return (
    <section className="cents raised" ref={ref}>
      <Eyebrow num="03">A hundred cents</Eyebrow>
      <h2>Where every <span className="i">dollar</span> goes.</h2>
      <p className="lead">
        Of every dollar Virtus collects, nearly half pays <em>the people</em> who manage and sell its strategies.
        Distribution and admin take another fifth. What's left of the dollar bears the firm's profit.
      </p>

      <svg className="cents-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {cells.map((c, i) => {
          const r = Math.floor(i / cols);
          const col = i % cols;
          const x = 9 + col * cell;
          const y = 8 + r * cell;
          // cells appear in scan order
          const localT = clamp((reveal - i / cells.length) * 8);
          const opacity = 0.05 + localT * 0.95;
          return (
            <rect
              key={i}
              x={x + 1.2}
              y={y + 1.2}
              width={cell - 2.4}
              height={cell - 2.4}
              fill={c.color}
              opacity={seen ? opacity : 0.05}
              rx="1.2"
            />
          );
        })}
      </svg>

      <div className="cents-legend">
        {costs.map(c => (
          <div className="row" key={c.label}>
            <div className="swatch" style={{ background: c.color }} />
            <div className="lbl">{c.label}</div>
            <div className="pct">{c.pct}<span style={{ fontSize: 13, color: "#6E6A60" }}>¢</span></div>
            <div className="doll">{c.pct}%</div>
          </div>
        ))}
        <div className="row">
          <div className="swatch" style={{ background: "#7A1F2B" }} />
          <div className="lbl serif-i" style={{ fontStyle: "italic", color: "#7A1F2B" }}>What survives</div>
          <div className="pct" style={{ color: "#7A1F2B", fontStyle: "italic" }}>{survives}<span style={{ fontSize: 13, color: "#7A1F2B" }}>¢</span></div>
          <div className="doll" style={{ color: "#7A1F2B" }}>~margin</div>
        </div>
      </div>

      <div className="cents-foot">
        Nineteen cents of every dollar make it past <span className="em">the payroll and the salesforce.</span>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTPRINT — geographic
========================================================= */
function Footprint() {
  const ref = sUseRef(null);
  const p = useScrollProgress(ref);
  const seen = useInView(ref);
  const t = ease.outCubic(clamp(p * 1.6));

  const regions = [
    { pct: 88, label: "United States",          color: "#7A1F2B", us: true },
    { pct: 8,  label: "Europe & Global Funds",  color: "#3A3F46" },
    { pct: 4,  label: "Asia-Pacific & Other",   color: "#A88A4B" },
  ];

  return (
    <section className="foot" ref={ref}>
      <Eyebrow num="04">The footprint</Eyebrow>
      <h2>An <span className="i">American</span> firm.</h2>
      <p className="lead">
        Virtus is overwhelmingly domestic — a Hartford institution with a domestic distribution network,
        a domestic shareholder base, and only a sliver of capital sourced abroad.
      </p>

      <div className="foot-bar" aria-hidden="true">
        {regions.map((r, i) => (
          <div
            key={i}
            className="seg"
            style={{
              width: (r.pct * t).toFixed(2) + '%',
              background: r.color,
              transition: 'width 0.5s ease',
            }}
          />
        ))}
      </div>

      <div className="foot-rows">
        {regions.map((r, i) => (
          <div key={i} className={"foot-row" + (r.us ? " us" : "")}>
            <div className="swatch" style={{ background: r.color }} />
            <div className="region">{r.label}</div>
            <div className="pct">{r.pct}%</div>
          </div>
        ))}
      </div>

      <div className="foot-note">
        <span className="em">Eighty-eight cents of every fee</span> are raised on American soil.
      </div>
    </section>
  );
}

/* =========================================================
   BALANCE — the one tonal departure (night)
   Capital allocation: net cash, debt down, dividend up, buybacks
========================================================= */
function Balance({ chromeRef }) {
  const ref = sUseRef(null);
  const p = useScrollProgress(ref);
  const seen = useInView(ref);
  const t = ease.outCubic(clamp(p * 1.4));

  // expose ref upward so chrome can flip dark
  useEffect(() => { if (chromeRef) chromeRef.current = ref.current; }, [chromeRef]);

  const cash = (29.8 * t).toFixed(1);
  const debt = (236.1 * t).toFixed(1);
  const eq   = (1.0 * t).toFixed(2);
  const div  = (2.25 * t).toFixed(2);

  // disposition svg: a triangle showing capital allocation policy
  const W = 380, H = 260;

  return (
    <section className="bal" ref={ref}>
      <div className="grain" style={{ opacity: 0.04, mixBlendMode: "screen" }} />
      <Eyebrow num="05">The bet · restraint</Eyebrow>
      <h2>Pay the debt. <span className="i">Buy back the stock.</span><br/>Raise the dividend.</h2>
      <p className="lead">
        There is no acquisition spree, no balance-sheet adventure. The 2024 disposition reads
        like a <em>conservative annuity:</em> shrink the debt, return cash, lift the payout.
      </p>

      {/* the disposition triangle */}
      <svg className="disposition-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="gradD" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D27A7A" stopOpacity="0.85" />
            <stop offset="1" stopColor="#7A1F2B" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* three poles labelled */}
        {[
          { x: 60,      y: 200, label: "DEBT REPAY",  fig: "$5.7M",   sub: "Q4 alone" },
          { x: W/2,     y: 60,  label: "DIVIDEND",    fig: "+18%",    sub: "to $2.25 / sh" },
          { x: W - 60,  y: 200, label: "BUYBACKS",    fig: "$12.5M",  sub: "52,176 shares" },
        ].map((n, i) => {
          const r = 38;
          const localT = clamp((t - i * 0.2) * 2);
          return (
            <g key={i} opacity={seen ? 1 : 0}>
              <circle cx={n.x} cy={n.y} r={r * (0.6 + 0.4 * localT)} fill="url(#gradD)" opacity={0.18 + 0.6 * localT} />
              <circle cx={n.x} cy={n.y} r={r * (0.6 + 0.4 * localT)} fill="none" stroke="#D27A7A" strokeWidth="0.6" opacity={0.5} />
              <text x={n.x} y={n.y - 4} textAnchor="middle" className="serif" fontSize="20" fill="#E5E0D2" fontStyle="italic">
                {n.fig}
              </text>
              <text x={n.x} y={n.y + 12} textAnchor="middle" fontSize="7" letterSpacing="1.4" fill="#8A93A3">
                {n.label}
              </text>
              <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize="8" fill="#8A93A3" fontFamily="'Instrument Serif', serif" fontStyle="italic">
                {n.sub}
              </text>
            </g>
          );
        })}

        {/* connecting lines forming the triangle */}
        <g stroke="#2A3548" strokeWidth="0.7" fill="none" opacity={0.6 * t}>
          <line x1="98"  y1="200" x2={W/2 - 30} y2="76" />
          <line x1={W/2 + 30} y1="76" x2={W - 98} y2="200" />
          <line x1="98" y1="200" x2={W - 98} y2="200" />
        </g>
      </svg>

      <div className="bal-rows">
        <div className="bal-row signal">
          <div className="lbl">Net Cash</div>
          <div className="figure">+${cash}M</div>
          <div className="sub"><em>A surplus,</em> not a deficit. Gross debt of $236.1M is fully covered by cash on hand.</div>
        </div>
        <div className="bal-row">
          <div className="lbl">Gross Debt</div>
          <div className="figure">${debt}M</div>
          <div className="sub">Down 2% sequentially. Quietly amortizing.</div>
        </div>
        <div className="bal-row">
          <div className="lbl">Equity</div>
          <div className="figure">${eq}B</div>
          <div className="sub">On total assets of ~$4.3B, liabilities of ~$3.3B.</div>
        </div>
        <div className="bal-row">
          <div className="lbl">Dividend / sh</div>
          <div className="figure">${div}</div>
          <div className="sub">Quarterly, raised <em>+18%</em> in 2024. Working capital up to $134.5M.</div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   COMPETITORS — scaled comparison
========================================================= */
function Competitors() {
  const ref = sUseRef(null);
  const p = useScrollProgress(ref);
  const seen = useInView(ref);
  const t = ease.outCubic(clamp(p * 1.5));
  const [open, setOpen] = sUseState(null);

  // approximate AUM scale (industry knowledge; only used as a visual size cue)
  // VRTS ~ $175B; APAM ~ $160B; CNS ~ $80B; TROW ~ $1500B
  const peers = [
    { name: "Virtus", ticker: "VRTS",   aum: 175,  us: true,
      desc: "The subject. A Hartford multi-boutique with ~$175B in AUM." },
    { name: "Artisan Partners", ticker: "APAM", aum: 160,
      desc: "A similarly sized multi-boutique active asset manager — competing with Virtus for institutional and retail AUM across equity and fixed income." },
    { name: "Cohen & Steers",   ticker: "CNS",  aum: 80,
      desc: "Competes in active management, particularly in real estate securities, infrastructure, and alternative income strategies sold to retail and institutional clients." },
    { name: "T. Rowe Price",    ticker: "TROW", aum: 1500,
      desc: "A much larger active investment manager — competing across equity, fixed income, and multi-asset for retail mutual fund and institutional mandates." },
  ];
  const maxAUM = 1500;

  // a logarithmic scale would obscure the dominance of TROW; use sqrt so VRTS/APAM/CNS still read
  const scale = a => Math.pow(a / maxAUM, 0.55);

  const W = 380, H = 220;

  return (
    <section className="comp" ref={ref}>
      <Eyebrow num="06">The room</Eyebrow>
      <h2>Peers, and one <span className="i">giant.</span></h2>
      <p className="lead">
        Two of the room are roughly Virtus's size; one — <em>T. Rowe Price</em> — towers
        over the table. The chart sizes each circle by AUM under sqrt scaling so the small
        firms remain legible.
      </p>

      <svg className="comp-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {/* ground line */}
        <line x1="20" y1={H - 30} x2={W - 20} y2={H - 30} stroke="#15181C" strokeWidth="0.5" />

        {peers.map((peer, i) => {
          const r = scale(peer.aum) * 78;
          const cx = 50 + i * 92;
          const cy = H - 30 - r;
          const localT = clamp((t - i * 0.12) * 1.6);
          return (
            <g key={i} opacity={seen ? 1 : 0}>
              <circle
                cx={cx} cy={cy} r={r * localT}
                fill={peer.us ? "#7A1F2B" : "#15181C"}
                opacity={peer.us ? 0.95 : 0.16}
              />
              <circle
                cx={cx} cy={cy} r={r * localT}
                fill="none"
                stroke={peer.us ? "#7A1F2B" : "#15181C"}
                strokeWidth="0.6"
                opacity={0.7}
              />
              <text x={cx} y={H - 16} textAnchor="middle" fontSize="8" letterSpacing="1.2" fill={peer.us ? "#7A1F2B" : "#3A3F46"}>
                {peer.ticker}
              </text>
              <text x={cx} y={H - 6} textAnchor="middle" fontSize="7" fill="#6E6A60" fontFamily="'Instrument Serif', serif" fontStyle="italic">
                ${peer.aum >= 1000 ? (peer.aum/1000).toFixed(1) + 'T' : peer.aum + 'B'}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="comp-tap-hint" style={{ marginTop: 14 }}>Tap a peer to expand</div>

      <div className="comp-list">
        {peers.slice(1).map((peer, i) => {
          const isOpen = open === i;
          return (
            <div
              className={"comp-row" + (isOpen ? " open" : "")}
              key={peer.ticker}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <div className="comp-head">
                <div className="name">{peer.name}</div>
                <div className="ticker">{peer.ticker}</div>
                <svg className="chev" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="comp-meta">
                AUM ≈ <span className="signal">${peer.aum >= 1000 ? (peer.aum/1000).toFixed(1) + 'T' : peer.aum + 'B'}</span>
                &nbsp;·&nbsp; { peer.aum > 200 ? 'larger' : peer.aum < 100 ? 'smaller' : 'peer-sized' }
              </div>
              <div className="comp-body">
                <div>
                  <p>{peer.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   CLOSE — invert the open
   Opened on $175B in. Closes on what reaches the shareholder.
========================================================= */
function Close() {
  const ref = sUseRef(null);
  const p = useScrollProgress(ref);
  const seen = useInView(ref);
  const t = ease.outCubic(clamp(p * 1.6));

  const div = (2.25 * t).toFixed(2);
  const cents = Math.round(19 * t);

  return (
    <section className="close" ref={ref}>
      <div className="grain" />
      <Eyebrow num="07">The takeaway</Eyebrow>

      <h2>
        $175 billion in.<br />
        <span className="i">Nineteen cents</span> on the dollar out.
      </h2>

      <p style={{ fontSize: 15, lineHeight: 1.55, color: "#3A3F46", marginTop: 18, textWrap: "pretty" }}>
        Virtus is a leverage machine wearing a banker's suit. Vast capital under
        autonomous boutiques; a thin headcount; a payroll-heavy cost base; and a
        disciplined return policy that prefers <span className="serif-i" style={{ color: "#7A1F2B", fontStyle: "italic" }}>shrinking debt and lifting the payout</span> to
        any kind of grand expansion.
      </p>

      <div className="stat">
        <div className="lbl">Quarterly dividend, year-end ’24</div>
        <div className="figure">$<span className="i">{div}</span><span className="unit">/ sh</span></div>
        <div className="sub">Raised 18% during the year. Funded out of the {cents}¢ that survived the dollar.</div>
      </div>

      <div className="colophon">
        <span>VRTS · NYSE</span>
        <span>RECAP · END</span>
      </div>
    </section>
  );
}

Object.assign(window, {
  Hero, Vessels, Scale, Cents, Footprint, Balance, Competitors, Close,
});

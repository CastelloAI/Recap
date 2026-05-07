// About + Revenue + Costs + Geo sections
function AboutSection() {
  return (
    <section className="are-section reveal" id="about">
      <div className="section-head">
        <div>
          <div className="section-tag"><span className="num">01</span> · About</div>
          <h2>Models with <span className="italic">manners</span>.</h2>
        </div>
        <p className="lede">A 31-year-old REIT that invented a category — and still owns it. The thesis hasn't changed: real estate is where biology gets done.</p>
      </div>
      <div className="are-editorial-grid">
        <div className="are-editorial-side">
          <blockquote className="are-pull">"{ARE_DATA.about.pull}"</blockquote>
          <div className="are-kv-list">
            <div className="are-kv-row"><span className="are-kv-k">HQ</span><span className="are-kv-v">{ARE_DATA.hq}</span></div>
            <div className="are-kv-row"><span className="are-kv-k">Founded</span><span className="are-kv-v">{ARE_DATA.founded}</span></div>
            <div className="are-kv-row"><span className="are-kv-k">Employees</span><span className="are-kv-v">~{ARE_DATA.employees}</span></div>
            <div className="are-kv-row"><span className="are-kv-k">Properties</span><span className="are-kv-v">340 <span className="sub">· operating</span></span></div>
            <div className="are-kv-row"><span className="are-kv-k">Operating RSF</span><span className="are-kv-v">35.9M <span className="sub">+3.5M U/C</span></span></div>
            <div className="are-kv-row"><span className="are-kv-k">Index</span><span className="are-kv-v">S&P 500</span></div>
          </div>
        </div>
        <div className="are-editorial-copy">
          <p>{ARE_DATA.about.p1}</p>
          <p>{ARE_DATA.about.p2}</p>
          <p>{ARE_DATA.about.p3}</p>
        </div>
      </div>
    </section>
  );
}

function RevenueSection() {
  return (
    <section className="are-section sunken" id="revenue">
      <div className="are-section-inner">
        <div className="reveal">
          <div className="section-head">
            <div>
              <div className="section-tag"><span className="num">02</span> · How it makes money</div>
              <h2>Long leases, <span className="italic">picky</span> tenants.</h2>
            </div>
            <p className="lede">Triple-net and modified gross leases to investment-grade pharma and biotech — plus a venture arm that quietly compounds on the side.</p>
          </div>
          <div className="are-editorial-grid">
            <div className="are-editorial-copy">
              <p>{ARE_DATA.revenue.p1}</p>
              <p>{ARE_DATA.revenue.p2}</p>
              <p>{ARE_DATA.revenue.p3}</p>
            </div>
            <div className="are-editorial-side">
              <RevenueMix />
              <p style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.55, margin: 0 }}>
                <strong style={{ color: "var(--fg)" }}>Note —</strong> {ARE_DATA.revenue.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RevenueMix() {
  // a stacked horizontal bar showing rent mix
  const segments = [
    { pct: 75, label: "Megacampus", color: "var(--accent)" },
    { pct: 25, label: "Other", color: "var(--bg-sunken)" },
  ];
  const credit = [
    { pct: 53, label: "IG / large-cap", color: "var(--accent)" },
    { pct: 47, label: "Other", color: "var(--bg-sunken)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <MixBar title="Megacampus rent share" segments={segments} highlight="75%" />
      <MixBar title="Investment-grade tenant rent" segments={credit} highlight="53%" />
    </div>
  );
}
function MixBar({ title, segments, highlight }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span className="are-kv-k">{title}</span>
        <span className="are-kv-v" style={{ color: "var(--accent)" }}>{highlight}</span>
      </div>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", border: "1px solid var(--border)" }}>
        {segments.map((s, i) => (
          <div key={i} style={{ width: s.pct + "%", background: s.color, transition: "width 800ms var(--ease-spring)" }} />
        ))}
      </div>
    </div>
  );
}

function CostsSection() {
  const [active, setActive] = useState(null);
  const total = ARE_DATA.costs.reduce((a, c) => a + c.pct, 0);
  // SVG donut
  const R = 110, IR = 78, CX = 130, CY = 130;
  const SVG = 260;
  let acc = 0;
  const arcs = ARE_DATA.costs.map((c, i) => {
    const start = acc, end = acc + c.pct;
    acc = end;
    const a0 = (start / 100) * Math.PI * 2 - Math.PI / 2;
    const a1 = (end / 100) * Math.PI * 2 - Math.PI / 2;
    const large = (c.pct / 100) > 0.5 ? 1 : 0;
    const x0 = CX + R * Math.cos(a0), y0 = CY + R * Math.sin(a0);
    const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
    const xi0 = CX + IR * Math.cos(a0), yi0 = CY + IR * Math.sin(a0);
    const xi1 = CX + IR * Math.cos(a1), yi1 = CY + IR * Math.sin(a1);
    const d = `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${IR} ${IR} 0 ${large} 0 ${xi0} ${yi0} Z`;
    return { d, color: c.color, label: c.label, pct: c.pct, idx: i };
  });
  return (
    <section className="are-section reveal" id="costs">
      <div className="section-head">
        <div>
          <div className="section-tag"><span className="num">03</span> · Cost structure</div>
          <h2>Where the <span className="italic">capital</span> goes.</h2>
        </div>
        <p className="lede">Capital-intensive by nature — depreciation, operations, and interest dominate. Q4'25 absorbed a $1.45B impairment charge.</p>
      </div>
      <div className="are-costs-grid">
        <div className="are-donut-wrap" style={{ maxWidth: 380 }}>
          <svg viewBox={`0 0 ${SVG} ${SVG}`} style={{ width: "100%", height: "auto" }}>
            {arcs.map((a) => (
              <path
                key={a.idx}
                d={a.d}
                fill={a.color}
                stroke="var(--bg)"
                strokeWidth="2"
                style={{
                  opacity: active === null || active === a.idx ? 1 : 0.25,
                  transform: active === a.idx ? "scale(1.03)" : "scale(1)",
                  transformOrigin: `${CX}px ${CY}px`,
                  transition: "all 220ms var(--ease-out)",
                  cursor: "pointer"
                }}
                onMouseEnter={() => setActive(a.idx)}
                onMouseLeave={() => setActive(null)}
              />
            ))}
          </svg>
          <div className="are-donut-center">
            {active !== null ? (
              <>
                <div className="num" style={{ color: ARE_DATA.costs[active].color }}>{ARE_DATA.costs[active].pct}<span style={{ fontSize: 24, fontFamily: "var(--font-mono)", color: "var(--fg-subtle)", marginLeft: 2 }}>%</span></div>
                <div className="lbl">{ARE_DATA.costs[active].label}</div>
              </>
            ) : (
              <>
                <div className="num">{total}<span style={{ fontSize: 24, fontFamily: "var(--font-mono)", color: "var(--fg-subtle)", marginLeft: 2 }}>%</span></div>
                <div className="lbl">of operating costs allocated</div>
              </>
            )}
          </div>
        </div>
        <div className="are-cost-legend">
          {ARE_DATA.costs.map((c, i) => (
            <div
              key={i}
              className={"are-cost-row " + (active === i ? "active" : (active !== null && active !== i ? "dim" : ""))}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="are-cost-swatch" style={{ background: c.color }} />
              <span className="are-cost-label">{c.label}</span>
              <span className="are-cost-pct">{c.pct}<span className="sym">%</span></span>
              <span className="are-cost-bar"><span style={{ width: (c.pct / 30 * 100) + "%", background: c.color }} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GeoSection() {
  const [active, setActive] = useState(null);
  return (
    <section className="are-section sunken" id="footprint">
      <div className="are-section-inner reveal">
        <div className="section-head">
          <div>
            <div className="section-tag"><span className="num">04</span> · Footprint</div>
            <h2>Seven <span className="italic">innovation</span> clusters.</h2>
          </div>
          <p className="lede">Concentration is the strategy — be where biology happens. Greater Boston anchors the portfolio at 32%.</p>
        </div>
        <div className="are-geo-grid">
          <div className="are-geo-bars">
            {ARE_DATA.geo.map((g, i) => (
              <div
                key={i}
                className="are-geo-row"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{ opacity: active === null || active === i ? 1 : 0.5, transition: "opacity 140ms" }}
              >
                <span className="are-geo-region">{g.region}</span>
                <span className="are-geo-bar"><span style={{ width: (g.pct / 32 * 100) + "%" }} /></span>
                <span className="are-geo-pct">{g.pct}%</span>
              </div>
            ))}
          </div>
          <div className="are-map">
            <div className="are-map-title">
              <span>North America · % of base rent</span>
              <span>340 properties</span>
            </div>
            <USOutline />
            {ARE_DATA.pins.map((p, i) => {
              const size = ARE_DATA.geo[i].pct;
              return (
                <div
                  key={i}
                  className={"are-map-pin " + (active === i ? "active" : (size < 12 ? "sm" : ""))}
                  style={{
                    left: `calc(28px + ${p.x}% * (100% - 56px) / 100)`,
                    top: `calc(40px + ${p.y}% * (100% - 80px) / 100)`,
                    width: 8 + size * 0.5,
                    height: 8 + size * 0.5,
                  }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                />
              );
            })}
            {active !== null && (
              <div
                className="are-map-tip shown"
                style={{
                  left: `calc(28px + ${ARE_DATA.pins[active].x}% * (100% - 56px) / 100)`,
                  top: `calc(40px + ${ARE_DATA.pins[active].y}% * (100% - 80px) / 100)`,
                }}
              >
                {ARE_DATA.pins[active].region} · {ARE_DATA.geo[active].pct}%
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function USOutline() {
  // simplified abstract outline of contiguous US for the dot-grid map
  return (
    <svg className="are-map-svg" viewBox="0 0 500 320" preserveAspectRatio="none" style={{ pointerEvents: "none" }}>
      <path
        d="M 30 110 Q 50 60 110 50 L 230 38 Q 280 32 340 44 L 430 60 Q 470 70 478 110 L 480 170 Q 470 210 440 230 L 380 250 Q 340 268 300 270 L 240 280 Q 180 286 140 268 L 90 250 Q 50 230 36 200 L 28 160 Z"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1.2"
        strokeDasharray="3 4"
        opacity="0.6"
      />
    </svg>
  );
}

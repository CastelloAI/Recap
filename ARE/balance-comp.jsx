// Balance + Competitors + Footer
function BalanceSection() {
  const b = ARE_DATA.balance;
  return (
    <section className="are-section reveal" id="balance">
      <div className="section-head">
        <div>
          <div className="section-tag"><span className="num">05</span> · Balance sheet</div>
          <h2>Long debt, <span className="italic">fixed</span> rates.</h2>
        </div>
        <p className="lede">97.2% fixed-rate debt at a 12.1-year weighted-average term — the longest among S&P 500 REITs. Liquidity built for the 2026 plan.</p>
      </div>
      <div className="are-bs-grid">
        <BalanceCard data={b.debt} dial={97.2} dialLabel="% fixed-rate" />
        <BalanceCard data={b.equity} />
        <BalanceCard data={b.cashflow} />
        <BalanceCard data={b.leverage} />
      </div>
    </section>
  );
}

function BalanceCard({ data, dial, dialLabel }) {
  return (
    <div className="are-bs-card">
      <div className="are-bs-head">
        <span className="are-bs-name">{data.label}</span>
        <span className="are-bs-tag">{data.tag}</span>
      </div>
      <div className="are-bs-num">{data.num}<span className="sub">{data.unit}</span></div>
      <div className="are-bs-note">{data.note}</div>
      {dial !== undefined && <Dial value={dial} label={dialLabel} />}
    </div>
  );
}

function Dial({ value, label }) {
  const C = 36, R = 28, SW = 5;
  const circ = 2 * Math.PI * R;
  const filled = (value / 100) * circ;
  return (
    <div className="are-dial">
      <svg className="are-dial-svg" width="72" height="72" viewBox="0 0 72 72">
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--border)" strokeWidth={SW} />
        <circle
          cx={C} cy={C} r={R} fill="none"
          stroke="var(--accent)" strokeWidth={SW} strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          transform={`rotate(-90 ${C} ${C})`}
          style={{ transition: "stroke-dasharray 800ms var(--ease-spring)" }}
        />
        <text x={C} y={C+1} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-mono)" fontSize="13" fill="var(--fg)" fontWeight="500">{value}%</text>
      </svg>
      <div className="are-dial-text">
        <div className="are-dial-num">{value}<span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg-subtle)" }}>%</span></div>
        <div className="are-dial-lbl">{label}</div>
      </div>
    </div>
  );
}

function CompetitorsSection() {
  const [tab, setTab] = useState("cards");
  return (
    <section className="are-section sunken" id="peers">
      <div className="are-section-inner reveal">
        <div className="section-head">
          <div>
            <div className="section-tag"><span className="num">06</span> · Peer set</div>
            <h2>The <span className="italic">competitive</span> field.</h2>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <p className="lede" style={{ margin: 0 }}>One direct life-science peer (DOC), one urban-office crossover (BXP), one institutional REIT alternative (STAG).</p>
            <div className="are-comp-tabs">
              <button className={tab === "cards" ? "active" : ""} onClick={() => setTab("cards")}>Profile</button>
              <button className={tab === "compare" ? "active" : ""} onClick={() => setTab("compare")}>Compare</button>
            </div>
          </div>
        </div>

        {tab === "cards" ? <CompCards /> : <CompBars />}
      </div>
    </section>
  );
}

function CompCards() {
  return (
    <div className="are-comp-grid">
      <div className="are-comp-card self">
        <div className="are-comp-head">
          <span className="are-comp-ticker">NYSE · ARE</span>
          <span className="are-comp-self-tag">Subject</span>
        </div>
        <h3 className="are-comp-name">Alexandria<span style={{ color: "var(--accent)" }}>.</span></h3>
        <p className="are-comp-desc">The pure-play life science REIT — 35.9M RSF concentrated in seven AAA innovation clusters.</p>
        <div className="are-comp-metrics">
          <div className="are-comp-metric"><span className="are-comp-metric-num">$8.30B</span><span className="are-comp-metric-lbl">Market cap</span></div>
          <div className="are-comp-metric"><span className="are-comp-metric-num">$3.03B</span><span className="are-comp-metric-lbl">Revenue (TTM)</span></div>
          <div className="are-comp-metric"><span className="are-comp-metric-num" style={{ color: "var(--danger)" }}>−2.5%</span><span className="are-comp-metric-lbl">YoY growth</span></div>
          <div className="are-comp-metric"><span className="are-comp-metric-num">5.7×</span><span className="are-comp-metric-lbl">Net leverage</span></div>
        </div>
      </div>

      {ARE_DATA.competitors.map((c, i) => (
        <div className="are-comp-card" key={i}>
          <div className="are-comp-head">
            <span className="are-comp-ticker">NYSE · {c.ticker}</span>
            <span className="pill" style={{ padding: "3px 8px", fontSize: 9 }}>Peer</span>
          </div>
          <h3 className="are-comp-name">{c.name}</h3>
          <p className="are-comp-desc">{c.desc}</p>
          <div className="are-comp-metrics">
            <div className="are-comp-metric"><span className="are-comp-metric-num">{c.marketCap}</span><span className="are-comp-metric-lbl">Market cap</span></div>
            <div className="are-comp-metric"><span className="are-comp-metric-num">{c.revenue}</span><span className="are-comp-metric-lbl">Revenue</span></div>
            <div className="are-comp-metric"><span className="are-comp-metric-num" style={{ color: c.growth.startsWith("+") ? "var(--success)" : "var(--danger)" }}>{c.growth}</span><span className="are-comp-metric-lbl">YoY growth</span></div>
            <div className="are-comp-metric"><span className="are-comp-metric-num">{c.pe}</span><span className="are-comp-metric-lbl">P/E TTM</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompBars() {
  const rows = [
    { label: "Market cap ($B)", key: "marketCap", max: 13, fmt: (v) => `$${v.toFixed(2)}B` },
    { label: "Revenue ($B)", key: "revenue", max: 4, fmt: (v) => `$${v.toFixed(2)}B` },
    { label: "YoY growth (%)", key: "growth", max: 12, min: -4, fmt: (v) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%` },
  ];
  return (
    <div className="are-compare-bars">
      {rows.map((row, ri) => (
        <div key={ri} className="are-compare-row">
          <span className="are-compare-label">{row.label}</span>
          <div className="are-compare-bars-inner">
            {COMP_NUMERIC.map((c, i) => {
              const v = c[row.key];
              const min = row.min ?? 0;
              const span = row.max - min;
              const pct = Math.max(2, ((v - min) / span) * 100);
              const isNeg = v < 0;
              return (
                <div key={i} className="are-compare-row-inner">
                  <span className={"are-compare-tick" + (c.self ? " self" : "")}>{c.ticker}</span>
                  <div className="are-compare-track">
                    <div
                      className="are-compare-fill"
                      style={{
                        width: pct + "%",
                        background: c.self ? "var(--accent)" : (isNeg ? "var(--danger)" : "var(--ink-3)"),
                        opacity: c.self ? 1 : 0.55,
                      }}
                    />
                  </div>
                  <span className={"are-compare-val" + (c.self ? " self" : "")}>{row.fmt(v)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="are-footer">
      <div className="are-footer-inner">
        <div className="are-footer-top">
          <div>
            <div className="are-brand-name">Alexandria<span className="dot">.</span></div>
            <p className="are-footer-blurb">Equity research dashboard · prototype. Data reflects the company's Q4 2025 reporting and is presented for illustrative analysis only.</p>
          </div>
          <div className="are-footer-col">
            <h4>Sections</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#revenue">Business model</a></li>
              <li><a href="#costs">Cost structure</a></li>
              <li><a href="#footprint">Footprint</a></li>
            </ul>
          </div>
          <div className="are-footer-col">
            <h4>Filings</h4>
            <ul>
              <li><a>10-K · FY2025 ↗</a></li>
              <li><a>10-Q · Q4 2025 ↗</a></li>
              <li><a>Investor deck ↗</a></li>
              <li><a>Earnings call ↗</a></li>
            </ul>
          </div>
          <div className="are-footer-col">
            <h4>Disclosures</h4>
            <ul>
              <li><a>Methodology</a></li>
              <li><a>Sources</a></li>
              <li><a>Not investment advice</a></li>
            </ul>
          </div>
        </div>
        <div className="are-footer-bottom">
          <span>© 2026 · Equity Research Prototype</span>
          <span>Built on the Zair Naqvi design system · v1.0</span>
        </div>
      </div>
    </footer>
  );
}

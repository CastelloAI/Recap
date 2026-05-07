// Nav + Hero + StatStrip
function Nav({ scrolled }) {
  const links = [
    { href: "#overview", label: "Overview" },
    { href: "#revenue", label: "Business" },
    { href: "#costs", label: "Costs" },
    { href: "#footprint", label: "Footprint" },
    { href: "#balance", label: "Balance sheet" },
    { href: "#peers", label: "Peers" },
  ];
  return (
    <header className={"are-nav" + (scrolled ? " scrolled" : "")}>
      <div className="are-nav-inner">
        <div className="are-brand">
          <div className="are-mark">A<span className="dot">.</span></div>
          <div>
            <div className="are-brand-name">Alexandria<span className="dot">.</span></div>
            <div className="are-brand-sub">Equity Research · NYSE: ARE</div>
          </div>
        </div>
        <nav className="are-nav-links">
          {links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <div className="are-nav-actions">
          <span className="pill live">Live · Q4 '25</span>
          <button className="btn primary">Watchlist <span className="arrow">→</span></button>
        </div>
      </div>
    </header>
  );
}

// ---------- Synthetic price line ----------
function generatePriceSeries(range) {
  // returns array of {t, v}
  const lengths = { "1W": 30, "1M": 30, "3M": 60, "1Y": 80, "5Y": 120, "MAX": 160 };
  const n = lengths[range] || 80;
  // ARE-ish path: start higher, drift down through 2022-2025 (rate hikes), recent volatility
  const seed = { "1W": 49.18, "1M": 50.42, "3M": 53.10, "1Y": 88.4, "5Y": 198.0, "MAX": 67.2 };
  const end = 47.82;
  const start = seed[range] ?? 88;
  const arr = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    // base linear drift to end
    const drift = start + (end - start) * t;
    // noise
    const noise = (Math.sin(i * 0.7 + range.length) + Math.cos(i * 1.3)) * (start * 0.012);
    const macro = Math.sin(i / n * Math.PI * 2.4) * (start * 0.04) * (1 - t * 0.5);
    v = drift + noise + macro;
    arr.push({ t, v });
  }
  // pin last value
  arr[arr.length - 1].v = end;
  return arr;
}

function Hero() {
  const [range, setRange] = useState("1Y");
  const series = useMemo(() => generatePriceSeries(range), [range]);
  const ranges = ["1W", "1M", "3M", "1Y", "5Y", "MAX"];

  return (
    <section className="are-hero" id="overview">
      <div className="are-hero-meta">
        <span className="pill"><span style={{ color: "var(--fg-subtle)" }}>NYSE</span> · ARE</span>
        <span className="pill" style={{ color: "var(--fg-subtle)" }}>Pasadena, CA</span>
        <span className="pill" style={{ color: "var(--fg-subtle)" }}>Founded 1994</span>
        <span className="pill" style={{ color: "var(--fg-subtle)" }}>S&P 500 · Life Science REIT</span>
      </div>

      <div className="are-hero-grid">
        <div>
          <div className="eyebrow">Equity research · {ARE_DATA.ticker}</div>
          <h1 className="are-hero-title">
            The pure-play <span className="italic">life science</span> REIT<span className="dot">.</span>
          </h1>
          <p className="are-hero-sub">
            Alexandria Real Estate Equities owns and operates 35.9M square feet of Class A/A+ laboratory and office space across seven North American innovation clusters — leased to investment-grade pharmaceutical, biotech, and life science tenants on long-term, structured leases.
          </p>
          <div className="are-ticker-row">
            <button className="btn primary">Add to portfolio <span className="arrow">→</span></button>
            <button className="btn ghost">Download deck <span className="arrow">↗</span></button>
            <span className="are-ticker">Last update · 27 Apr 2026 · 09:31 ET</span>
          </div>
        </div>

        <PriceCard range={range} setRange={setRange} ranges={ranges} series={series} />
      </div>
    </section>
  );
}

function PriceCard({ range, setRange, ranges, series }) {
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null); // { x, y, value }
  // path generation
  const W = 480, H = 160, P = 6;
  const min = Math.min(...series.map(d => d.v));
  const max = Math.max(...series.map(d => d.v));
  const span = max - min || 1;
  const points = series.map((d, i) => {
    const x = P + (i / (series.length - 1)) * (W - P * 2);
    const y = H - P - ((d.v - min) / span) * (H - P * 2);
    return [x, y];
  });
  const linePath = points.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const areaPath = linePath + ` L ${points[points.length-1][0].toFixed(1)} ${H} L ${points[0][0].toFixed(1)} ${H} Z`;

  const change = series[series.length - 1].v - series[0].v;
  const changePct = (change / series[0].v) * 100;
  const isDown = change < 0;

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let bestI = 0, bestD = Infinity;
    points.forEach(([x], i) => { const d = Math.abs(x - px); if (d < bestD) { bestD = d; bestI = i; } });
    const [x, y] = points[bestI];
    setHover({ x: (x / W) * 100, y: (y / H) * 100, value: series[bestI].v });
  };
  const onLeave = () => setHover(null);

  return (
    <div className="are-price-card">
      <div className="are-price-head">
        <div>
          <div className="eyebrow" style={{ color: "var(--fg-subtle)" }}>Price · {range}</div>
          <div className="are-price-now">
            <div className="are-price-num"><span className="are-price-currency">USD</span>{ARE_DATA.priceNow.toFixed(2)}</div>
            <div className={"are-price-change " + (isDown ? "down" : "up")}>
              {isDown ? "▾" : "▴"} {Math.abs(change).toFixed(2)} · {changePct.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="are-range">
          {ranges.map(r => (
            <button key={r} className={range === r ? "active" : ""} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>
      </div>

      <div className="are-chart-wrap" ref={wrapRef}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseMove={onMove} onMouseLeave={onLeave}>
          <defs>
            <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          {hover && (
            <>
              <line x1={(hover.x / 100) * W} x2={(hover.x / 100) * W} y1={4} y2={H - 4} stroke="var(--border-strong)" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx={(hover.x / 100) * W} cy={(hover.y / 100) * H} r="4" fill="var(--accent)" stroke="var(--bg-raised)" strokeWidth="2" />
            </>
          )}
        </svg>
        {hover && (
          <div className="are-chart-tooltip shown" style={{ left: hover.x + "%", top: hover.y + "%" }}>
            ${hover.value.toFixed(2)}
          </div>
        )}
      </div>

      <div className="are-kv-list" style={{ marginTop: 4 }}>
        <div className="are-kv-row">
          <span className="are-kv-k">Market cap</span>
          <span className="are-kv-v">{ARE_DATA.marketCap}</span>
        </div>
        <div className="are-kv-row">
          <span className="are-kv-k">52-wk range</span>
          <span className="are-kv-v">$45.92 — $128.04</span>
        </div>
        <div className="are-kv-row">
          <span className="are-kv-k">Dividend yield</span>
          <span className="are-kv-v">5.18% <span className="sub">· reduced FY26</span></span>
        </div>
      </div>
    </div>
  );
}

function StatStrip() {
  return (
    <div className="are-container">
      <div className="are-stat-strip reveal">
        {ARE_DATA.stats.map((s, i) => (
          <div className="are-stat" key={i}>
            <div className="are-stat-num">{s.num}<span className="unit">{s.unit}</span></div>
            <div className="are-stat-label">{s.label}</div>
            <div className={"are-stat-delta " + (s.deltaClass || "")}>{s.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

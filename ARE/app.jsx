// ARE Investor Research Dashboard — data + main app
const { useState, useEffect, useRef, useMemo } = React;

// ---------- Data ----------
const ARE_DATA = {
  ticker: "NYSE: ARE",
  name: "Alexandria Real Estate Equities",
  shortName: "Alexandria",
  sector: "Life Science REIT · S&P 500",
  hq: "Pasadena, California",
  founded: 1994,
  employees: 514,
  marketCap: "$8.30B",
  // synthetic but believable price line over the chosen range; we'll generate at runtime per range
  priceNow: 47.82,
  priceChange: -1.36,
  priceChangePct: -2.77,
  // stat strip
  stats: [
    { num: "$3.03", unit: "B", label: "FY2025 Revenue", delta: "Q4 728.87M" },
    { num: "5.7", unit: "x", label: "Net debt / EBITDA", delta: "Q4 '25 annualized" },
    { num: "35.9", unit: "M", label: "Operating RSF", delta: "+3.5M under construction" },
    { num: "53", unit: "%", label: "IG / large-cap rent", delta: "investment-grade tenants", deltaClass: "pos" },
    { num: "12.1", unit: "yr", label: "Weighted debt term", delta: "longest in S&P REITs", deltaClass: "pos" },
  ],
  about: {
    p1: "Alexandria Real Estate Equities (NYSE: ARE) is the preeminent pure-play life science REIT in the United States — a Pasadena, California-headquartered S&P 500 company that pioneered the laboratory and life science real estate niche when it was founded in 1994.",
    p2: "The company owns, operates, and develops Class A/A+ collaborative Megacampus ecosystems in premier innovation cluster locations: Greater Boston, the San Francisco Bay Area, San Diego, Seattle, Maryland, Research Triangle, and New York City.",
    p3: "As of December 31, 2025, ARE's North American asset base spans 35.9 million rentable square feet of operating properties and 3.5 million RSF under construction, across 340 properties — with a market cap of $8.30B and approximately 514 employees.",
    pull: "The pure-play life science REIT — built around 340 properties in seven innovation clusters."
  },
  revenue: {
    p1: "Alexandria generates revenue primarily through long-term leases of Class A/A+ laboratory and office space to pharmaceutical, biotechnology, and life science tenants — with approximately 75% of annual rental revenue derived from its Megacampus properties.",
    p2: "Investment-grade or publicly traded large-cap tenants represent 53% of annual rental revenue, providing durable cash flow visibility through triple-net and modified gross lease structures.",
    p3: "The company also operates a venture capital platform that provides strategic capital to life science companies, generating realized gains on non-real estate investments as a supplemental income stream.",
    note: "FY2025 revenue was $3.03B with Q4 2025 revenue of $728.87M. Q4 EPS came in at -$6.35, with the net loss driven primarily by $1.45B in real estate impairment charges recognized in Q4."
  },
  costs: [
    { pct: 28, color: "#4F86C6", label: "Depreciation & Amortization" },
    { pct: 22, color: "#E07B54", label: "Real Estate Operating Expenses" },
    { pct: 18, color: "#6DBF8A", label: "Interest Expense" },
    { pct: 14, color: "#B57BCC", label: "Impairment & Investment Losses" },
    { pct: 4,  color: "#F5C842", label: "General & Administrative" },
  ],
  geo: [
    { region: "Greater Boston", pct: 32 },
    { region: "San Francisco Bay Area", pct: 22 },
    { region: "San Diego", pct: 16 },
    { region: "Maryland / Research Triangle", pct: 12 },
    { region: "Seattle / New York City", pct: 10 },
    { region: "Other US Markets", pct: 8 },
  ],
  // approximate map pin coords as % of map viewport
  pins: [
    { region: "Greater Boston", x: 84, y: 28 },
    { region: "San Francisco Bay Area", x: 8, y: 44 },
    { region: "San Diego", x: 14, y: 76 },
    { region: "Maryland / Research Triangle", x: 76, y: 50 },
    { region: "Seattle / New York City", x: 18, y: 18 },
    { region: "Other US Markets", x: 50, y: 64 },
  ],
  balance: {
    debt: { num: "$12.75", unit: "B", label: "Total debt", note: "97.2% at fixed rates · weighted-average remaining term of 12.1 years — the longest among S&P 500 REITs.", tag: "Fixed" },
    equity: { num: "$15.47", unit: "B", label: "Total equity", note: "Backed by $549.06M cash and $5.3B total liquidity — 3.7× coverage of debt maturities through 2028.", tag: "Stable" },
    cashflow: { num: "$1.41", unit: "B", label: "Operating cash flow", note: "$911.45M dividends paid. Capital allocation centered on self-funding development through asset recycling.", tag: "TTM" },
    leverage: { num: "5.7", unit: "×", label: "Net debt + pref. / EBITDA", note: "Q4 2025 annualized. Buybacks paused; dividend reduced to preserve ~$410M of annual liquidity for the 2026 capital plan.", tag: "Q4'25" }
  },
  competitors: [
    { ticker: "BXP", name: "BXP Inc", marketCap: "$8.91B", revenue: "$3.48B", pe: "32.19", growth: "+2.19%", desc: "Direct competitor in premier urban office and lab markets — Greater Boston, San Francisco, New York — targeting the same high-credit life science and technology tenants." },
    { ticker: "DOC", name: "Healthpeak Properties", marketCap: "$12.24B", revenue: "$603.99M", pe: "171.51", growth: "+4.52%", desc: "Most direct product-market competitor — a large-scale life science REIT in the same AAA cluster markets, competing head-on for pharma and biotech tenants." },
    { ticker: "STAG", name: "STAG Industrial", marketCap: "$7.42B", revenue: "$845.18M", pe: "27.13", growth: "+10.14%", desc: "Competes for institutional REIT capital with a single-tenant net-lease income profile — geographically diversified industrial alternative to ARE's concentrated life science focus." },
  ]
};

// numeric versions for compare bars (in $B)
const COMP_NUMERIC = [
  { ticker: "ARE", marketCap: 8.30, revenue: 3.03, growth: -2.5, self: true },
  { ticker: "BXP", marketCap: 8.91, revenue: 3.48, growth: 2.19 },
  { ticker: "DOC", marketCap: 12.24, revenue: 0.604, growth: 4.52 },
  { ticker: "STAG", marketCap: 7.42, revenue: 0.845, growth: 10.14 },
];

// ---------- App ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "coral",
  "density": "cozy",
  "theme": "light",
  "hero": "split"
}/*EDITMODE-END*/;

function App() {
  const { tweaks, setTweak } = useTweaks(TWEAK_DEFAULTS);

  // apply tweaks to <html>
  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-theme", tweaks.theme);
    r.setAttribute("data-accent", tweaks.accent);
    r.setAttribute("data-density", tweaks.density);
    r.setAttribute("data-hero", tweaks.hero);
  }, [tweaks]);

  // sticky nav scroll state
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // reveal-on-scroll
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Nav scrolled={scrolled} />
      <Hero />
      <StatStrip />
      <AboutSection />
      <RevenueSection />
      <CostsSection />
      <GeoSection />
      <BalanceSection />
      <CompetitorsSection />
      <Footer />
      <TweaksPanel title="Tweaks">
        <TweakSection title="Accent">
          <TweakRadio
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={[{ value: "coral", label: "Coral" }, { value: "iris", label: "Iris" }, { value: "mint", label: "Mint" }]}
          />
        </TweakSection>
        <TweakSection title="Theme">
          <TweakRadio
            value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          />
        </TweakSection>
        <TweakSection title="Density">
          <TweakRadio
            value={tweaks.density}
            onChange={(v) => setTweak("density", v)}
            options={[{ value: "cozy", label: "Cozy" }, { value: "compact", label: "Compact" }]}
          />
        </TweakSection>
        <TweakSection title="Hero variant">
          <TweakRadio
            value={tweaks.hero}
            onChange={(v) => setTweak("hero", v)}
            options={[{ value: "split", label: "Split + price card" }, { value: "editorial", label: "Editorial full-width" }]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

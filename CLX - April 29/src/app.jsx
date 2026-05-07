// CLX Recap — root app
const { useState, useEffect, useRef } = React;

const DATA = {
  costs: [
    { pct: 55, color: '#E05C5C', label: 'Cost of Revenue' },
    { pct: 20, color: '#5B8FD4', label: 'Selling, General & Administrative' },
    { pct: 8,  color: '#F5A623', label: 'Advertising & Sales Promotion' },
    { pct: 2,  color: '#7DC67E', label: 'Research & Development' },
    { pct: 2,  color: '#A78BD4', label: 'Depreciation & Amortization' },
  ],
  geo: [
    { pct: 86, region: 'United States' },
    { pct: 8,  region: 'Latin America' },
    { pct: 6,  region: 'Rest of World' },
  ],
  comps: [
    { name: 'Church & Dwight', ticker: 'CHD',
      description: 'Church and Dwight competes directly with Clorox across household cleaning, laundry, and personal care categories — its OxiClean, Arm and Hammer, and Kaboom brands vie for the same shelf space and consumer dollars as Clorox\'s cleaning and laundry portfolio in mass retail and grocery channels (market cap of $22.95B, revenue of $6.20B (annual), P/E TTM of 31.15, revenue growth of 1.57% YoY).' },
    { name: 'McCormick & Co.', ticker: 'MKC',
      description: 'McCormick competes with Clorox\'s Lifestyle segment — particularly Hidden Valley Ranch dressings, dips, and seasonings — in the branded condiments and flavor categories at mass and grocery retail; McCormick carries a market cap of $14.60B, annual revenue of $6.84B, a P/E TTM of 8.89, and revenue growth YoY of 5.68%.' },
    { name: 'Molson Coors', ticker: 'TAP',
      description: 'While primarily a brewer, Molson Coors represents a non-obvious competitive threat as both companies compete for the same finite consumer staples shelf and promotional budget at Walmart and club retailers, and Molson Coors\' aggressive push into adjacent non-alcohol and flavored beverage categories increasingly overlaps with Clorox\'s Lifestyle segment consumer base; Molson Coors carries a market cap of $8.85B, annual revenue of $13.04B, and revenue growth YoY of -4.18%.' },
  ],
};

function Chrome({ progress }) {
  return (
    <div className="chrome" data-screen-label="Chrome">
      <div className="chrome__row">
        <div className="chrome__id">
          <span className="chrome__ticker">CLX</span>
          <span className="chrome__name">The Clorox Co.</span>
        </div>
        <span className="chrome__label">Recap · FY '25</span>
      </div>
      <div className="chrome__progress" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, window.scrollY / Math.max(1, total))));
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return (
    <div className="page" data-screen-label="CLX Recap">
      <Chrome progress={progress} />

      <Hero />

      <div className="reset reset--paper-2">
        <em>Nothing here is exotic.</em> <span className="signal">That is the point.</span>
      </div>

      <Business />

      <div className="reset reset--tinted">
        Built one bottle, one ranch dressing, one charcoal briquette
        at a time — and held, <span className="signal">decade after decade,</span> by the
        rule that you do not lose the shelf you already own.
      </div>

      <Scale />

      <div className="ripple-band"></div>

      <Costs data={DATA.costs} />

      <div className="reset reset--paper-2">
        After the bill is paid — the resin, the fragrance, the fill,
        the trucks, the shelf-talker — <span className="signal">fifteen cents per dollar</span> survive
        as gross margin. The rest of the page is what happens to those.
      </div>

      <Footprint regions={DATA.geo} />

      <Bet />

      <Weight />

      <Competition comps={DATA.comps} />

      <div className="reset reset--tinted">
        The thesis was the cabinet under every American sink.
        <span className="signal"> The math is what survives</span> after Clorox fills it.
      </div>

      <Closing />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

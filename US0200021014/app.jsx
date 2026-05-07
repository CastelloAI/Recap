const { useState, useEffect, useRef } = React;

function Chrome() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="chrome">
      <div className="chrome-inner">
        <div className="chrome-left">
          <span className="chrome-dot"></span>
          <span className="chrome-ticker">$ALL</span>
          <span className="chrome-name">Allstate</span>
        </div>
        <div className="chrome-label">Recap · FY '25</div>
      </div>
      <div className="progress-rail">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }}></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="page">
      <Chrome />

      <HeroScene />

      <ResetBeat warm marker="·  ·  ·">
        <em>Insurance is</em> a promise. <span className="accent">The price of the promise</span> <em>is what's left at year-end.</em>
      </ResetBeat>

      <BusinessScene />

      <ScaleScene />

      <ResetBeat marker="THE BILL">
        <em>You don't insure sixteen million households without a bill that arrives</em> <span className="accent">every single morning</span>.
      </ResetBeat>

      <CostScene />

      <FootprintScene />

      <ResetBeat warm marker="THE BET">
        <em>Sell the sidecars.</em> Concentrate the core. <span className="accent">Hand the rest to the holders</span>.
      </ResetBeat>

      <BetScene />

      <CompetitionScene />

      <CloseScene />

      <div className="end-mark">
        <div className="seal">A.</div>
        <div>End of recap · $ALL · FY '25</div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-3)', textTransform: 'none', letterSpacing: 0 }}>You're in good hands.</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

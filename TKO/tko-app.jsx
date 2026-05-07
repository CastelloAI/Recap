/* global React, ReactDOM */
const { useEffect } = React;
const {
  Hero, ResetBeat, ThreeRings, Scale, Costs, Geo, Bet, Fightcard, Acquisition, Close, Footer
} = window;

function App() {
  // Scroll progress + chrome darkness
  useEffect(() => {
    const progress = document.getElementById('progress');
    const chrome = document.getElementById('chrome');
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? (window.scrollY / max) * 100 : 0;
        if (progress) progress.style.width = `${p}%`;
        // Determine chrome bg by sampling the section under it
        const y = 1; // sample 1px below top
        const x = window.innerWidth / 2;
        const chromeRect = chrome.getBoundingClientRect();
        const sampleY = chromeRect.bottom + 8;
        const target = document.elementFromPoint(x, sampleY);
        let dark = false;
        let n = target;
        while (n && n !== document.body) {
          const bg = n.dataset && n.dataset.bg;
          if (bg) { dark = bg === 'dark'; break; }
          n = n.parentElement;
        }
        chrome.classList.toggle('on-dark', dark);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <Hero />
      <ResetBeat tone="dark">
        You don’t fold <span className="blood">two billion-dollar</span> fanbases
        under one ticker by accident. You buy them — and the camera turns on.
      </ResetBeat>
      <ThreeRings />
      <Scale />
      <ResetBeat tone="bone">
        A live show is a beautiful, expensive thing.<br/>
        <span className="blood">Every dollar that walks in</span> has somewhere to go.
      </ResetBeat>
      <Costs />
      <Geo />
      <ResetBeat tone="dark">
        The bill comes due. <span className="gold">And then it goes back —</span>
        in buybacks, in dividends, in another billion queued for March.
      </ResetBeat>
      <Bet />
      <Acquisition />
      <Fightcard />
      <Close />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// VRTS Recap — app composition

const { useRef: aUseRef } = React;

function App() {
  const balRef = aUseRef(null);
  const dark = useDarkChrome(balRef);

  return (
    <>
      <Chrome dark={dark} />

      <Hero />

      <Reset>
        <span className="serif-i">A multi-boutique</span> is not one fund.
        It is a <span className="em">collection of hands</span> under one roof, each working to its own rhythm —
        and a corporate parent that takes a cut of every fee.
      </Reset>

      <Vessels />

      <Reset tone="deep">
        Scale, in this business, is not measured in employees.
        It is measured in <span className="em">the pile of capital</span> the employees are trusted with.
      </Reset>

      <Scale />

      <Cents />

      <Reset>
        Geography here is almost a <span className="em">non-story.</span>
        The fees are American; the clients are American; the firm is a Connecticut institution.
      </Reset>

      <Footprint />

      <Balance chromeRef={balRef} />

      <Reset>
        Every other firm in the room is doing some version of <span className="em">the same trick.</span>
        Virtus is doing it small.
      </Reset>

      <Competitors />

      <Close />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

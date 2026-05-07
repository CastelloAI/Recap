/* global React, ReactDOM, LHXModule1, LHXModule2, LHXModule3 */
const { useEffect } = React;
const { Chrome, Hero, ResetBeat, Segments, Scale } = window.LHXModule1;
const { Costs, Footprint } = window.LHXModule2;
const { Bet, Competition, Closer } = window.LHXModule3;

function App() {
  // Reveal-on-scroll
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lhx-page">
      <Chrome />
      <Hero />

      <ResetBeat mark="§ I">
        Built by merger in <span className="signal">2019.</span> Built by acquisition <span className="signal">ever since.</span>
      </ResetBeat>

      <Segments />
      <Scale />

      <ResetBeat mark="§ II">
        You don't write a $38B backlog by surprise. You write it by <span className="signal">being the supplier of last resort.</span>
      </ResetBeat>

      <Costs />
      <Footprint />

      <ResetBeat mark="§ III">
        Three quarters out the door. <span className="signal">Ten cents</span> survive to operating income. The rest is allocated.
      </ResetBeat>

      <Bet />
      <Competition />
      <Closer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// HERO — "America still walks in"
// A floor-plan view of a mall. Foot-traffic dots stream in from the page edges
// toward the central plaza as you scroll. The headline sits over the plan.
// Coral signal dot tags the "you are here" point — a small editorial wink.

const Hero = () => {
  const ref = React.useRef(null);
  const [t, setT] = React.useState(0); // 0..1 scroll progress through hero

  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top hits viewport top, 1 when section bottom leaves
      const total = r.height + vh;
      const seen = Math.min(Math.max(vh - r.top, 0), total);
      setT(seen / total);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Foot traffic — 28 dots streaming toward the plaza center (200, 240)
  const dots = React.useMemo(() => {
    const out = [];
    const N = 28;
    // entry points around the edges of the floorplan
    const entries = [
      [40,40],[140,30],[260,30],[360,40],
      [380,140],[380,260],[380,340],
      [40,140],[40,260],[40,340],
      [140,400],[260,400],[60,360],[340,360]
    ];
    for (let i=0;i<N;i++){
      const e = entries[i % entries.length];
      out.push({
        sx: e[0] + (Math.random()-0.5)*16,
        sy: e[1] + (Math.random()-0.5)*16,
        delay: (i/N),       // stagger 0..1
        speed: 0.55 + Math.random()*0.3,
        big: i%7===0
      });
    }
    return out;
  }, []);

  return (
    <section ref={ref} className="band-paper" style={{position:'relative', padding:'40px 0 56px', overflow:'hidden'}}>
      <div className="grain"></div>

      {/* Eyebrow */}
      <div style={{padding:'4px 24px 12px'}}>
        <div className="eyebrow"><span className="bar"></span><span>The opening · <span className="sig">FY '23</span></span></div>
      </div>

      {/* Headline */}
      <div style={{padding:'0 24px 24px'}}>
        <h1 className="display" style={{fontSize:'56px'}}>
          America still<br/>
          <em>walks in.</em>
        </h1>
        <p className="lede" style={{marginTop:18, maxWidth:'34ch'}}>
          One landlord owns the floor under most of it. <em className="signal">Simon</em> — sixty-five years of leases, three hundred properties, and the largest mall portfolio in the country.
        </p>
      </div>

      {/* Floorplan with foot-traffic */}
      <div style={{position:'relative', height:460}}>
        <Floorplan t={t} dots={dots} />
      </div>

      {/* Hero stat — display serif */}
      <div style={{padding:'18px 24px 0', display:'flex', alignItems:'baseline', gap:14}}>
        <div className="display tnum" style={{fontSize:'72px', lineHeight:0.9}}>
          $5.66<span style={{fontStyle:'italic', color:'var(--signal-deep)'}}>B</span>
        </div>
        <div className="mono" style={{fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-3)'}}>
          FY '23<br/>revenue
        </div>
      </div>
      <p className="lede" style={{padding:'12px 24px 0'}}>
        <em>Lease income, mostly.</em> The rest — tenant reimbursements, management fees, a stake or two in the brands on the shelf.
      </p>
    </section>
  );
};

const Floorplan = ({ t, dots }) => {
  // The plaza pulses gently with scroll
  const pulse = 0.8 + 0.2 * Math.sin(t * Math.PI * 2);
  return (
    <svg viewBox="0 0 414 460" width="100%" height="100%" style={{display:'block'}}>
      <defs>
        <radialGradient id="plaza" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFDFD3" stopOpacity={0.9*pulse}/>
          <stop offset="60%" stopColor="#FFDFD3" stopOpacity={0.15*pulse}/>
          <stop offset="100%" stopColor="#FFDFD3" stopOpacity="0"/>
        </radialGradient>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1B2433" strokeOpacity="0.08" strokeWidth="1.2"/>
        </pattern>
      </defs>

      {/* outer mall outline */}
      <g stroke="#1B2433" strokeWidth="1.1" fill="none" opacity="0.65">
        <rect x="30" y="30" width="354" height="390" />
        {/* anchor stores at the four corners (Simon's "anchors") */}
        <rect x="30" y="30" width="80" height="90" />
        <rect x="304" y="30" width="80" height="90" />
        <rect x="30" y="330" width="80" height="90" />
        <rect x="304" y="330" width="80" height="90" />
      </g>
      {/* hatched floor for anchor footprints */}
      <g fill="url(#hatch)" opacity="0.85">
        <rect x="30" y="30" width="80" height="90" />
        <rect x="304" y="30" width="80" height="90" />
        <rect x="30" y="330" width="80" height="90" />
        <rect x="304" y="330" width="80" height="90" />
      </g>

      {/* corridor walls — the central plaza spine */}
      <g stroke="#1B2433" strokeOpacity="0.35" strokeWidth="0.9" fill="none">
        <line x1="110" y1="120" x2="304" y2="120"/>
        <line x1="110" y1="330" x2="304" y2="330"/>
        <line x1="110" y1="30"  x2="110" y2="330"/>
        <line x1="304" y1="30"  x2="304" y2="330"/>

        {/* small storefronts along the corridors */}
        {[...Array(8)].map((_,i)=>(
          <line key={'top'+i} x1={120+i*22} y1="120" x2={120+i*22} y2="170"/>
        ))}
        {[...Array(8)].map((_,i)=>(
          <line key={'bot'+i} x1={120+i*22} y1="280" x2={120+i*22} y2="330"/>
        ))}
        <line x1="120" y1="170" x2="294" y2="170"/>
        <line x1="120" y1="280" x2="294" y2="280"/>
      </g>

      {/* central plaza glow */}
      <circle cx="207" cy="225" r="86" fill="url(#plaza)"/>

      {/* tiny store labels */}
      <g fontFamily="Geist Mono, monospace" fontSize="7" fill="#1B2433" fillOpacity="0.45" letterSpacing="0.5">
        <text x="42" y="76" >ANCHOR · A</text>
        <text x="316" y="76" >ANCHOR · B</text>
        <text x="42" y="376" >ANCHOR · C</text>
        <text x="316" y="376" >ANCHOR · D</text>
        <text x="172" y="226" textAnchor="start" fill="#1B2433" fillOpacity="0.7">PLAZA</text>
      </g>

      {/* You are here — coral signal */}
      <g>
        <circle cx="207" cy="225" r="4" fill="#F25A37"/>
        <circle cx="207" cy="225" r={6 + 6*pulse} fill="none" stroke="#F25A37" strokeOpacity={0.35*(2-pulse)}/>
      </g>

      {/* Foot traffic — dots animate from edge toward plaza */}
      <g>
        {dots.map((d, i) => {
          // each dot has its own progress 0..1, looping
          let p = ((t * d.speed) + d.delay) % 1;
          // ease toward center, slight curve
          const cx = d.sx + (207 - d.sx) * easeInOut(p);
          const cy = d.sy + (225 - d.sy) * easeInOut(p);
          // fade out near center
          const fade = p < 0.85 ? 1 : (1 - (p-0.85)/0.15);
          return (
            <circle
              key={i}
              cx={cx} cy={cy}
              r={d.big ? 2.2 : 1.4}
              fill={d.big ? '#F25A37' : '#1B2433'}
              opacity={(d.big ? 0.85 : 0.55) * fade}
            />
          );
        })}
      </g>

      {/* compass / scale */}
      <g fontFamily="Geist Mono, monospace" fontSize="8" fill="#1B2433" fillOpacity="0.5">
        <text x="30" y="448">PLAN VIEW · MALL TYPICAL</text>
        <text x="316" y="448" textAnchor="start">N ↑</text>
      </g>
    </svg>
  );
};

function easeInOut(x){ return x<0.5 ? 2*x*x : 1 - Math.pow(-2*x+2,2)/2; }

window.Hero = Hero;

// All metaphor scenes for the Allstate recap. Hand-built SVG, scroll-driven.

const { useState, useEffect, useRef, useMemo } = React;

// ---------- helpers ----------
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// scroll progress through an element: 0 when its top hits viewport bottom, 1 when its bottom hits viewport top
function useScrollProgress() {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = ref.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = r.height + vh;
        const passed = vh - r.top;
        setP(Math.max(0, Math.min(1, passed / total)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, p];
}

function CountUp({ to, dur = 1400, prefix = '', suffix = '', decimals = 0, trigger }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setV(eased * to);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, to, dur]);
  return <span>{prefix}{v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}</span>;
}

// ---------- Hero — the umbrella opens, premiums fall, households below ----------
function HeroScene() {
  const [ref, p] = useScrollProgress();
  const [inRef, inView] = useInView(0.3);

  // umbrella opens 0..0.5
  const open = Math.min(1, p / 0.5);

  return (
    <section ref={ref} className="pad" style={{ paddingTop: 32, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
      <div className="eyebrow"><span className="dot"></span><span>Recap · FY '25</span><span style={{ color: 'var(--ink-4)' }}>· $ALL</span></div>

      <div ref={inRef} style={{ marginTop: 28 }}>
        <h1 className="display" style={{ fontSize: 56, lineHeight: 0.96 }}>
          Sixteen<br />
          <span className="it" style={{ color: 'var(--claim)' }}>million</span><br />
          umbrellas.
        </h1>
        <p className="body-text" style={{ marginTop: 22, maxWidth: '90%' }}>
          Allstate sells one product, in many shapes: <em className="serif">a promise</em>. To sixteen million American and Canadian households. The bill comes due, sometimes.
        </p>
      </div>

      {/* the umbrella scene */}
      <div style={{ marginTop: 48, position: 'relative', height: 380 }}>
        <svg viewBox="0 0 360 380" width="100%" height="100%" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="umb-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D1B2E" />
              <stop offset="100%" stopColor="#1F3B5F" />
            </linearGradient>
            <linearGradient id="rain-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B0915A" stopOpacity="0" />
              <stop offset="100%" stopColor="#B0915A" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* falling premium drops — represented as $ */}
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 30 + (i * 23) % 320;
            const dur = 2.2 + (i % 5) * 0.4;
            const delay = (i * 0.18) % 2;
            return (
              <g key={i} style={{ opacity: 0.7 }}>
                <text x={x} y="0" fontFamily="Geist Mono" fontSize="10" fill="var(--ink-3)" textAnchor="middle">
                  $
                  <animate attributeName="y" from="-10" to="160" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.85;0.85;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                </text>
              </g>
            );
          })}

          {/* umbrella canopy — opens with scroll */}
          <g transform="translate(180, 180)">
            {/* canopy as 8 panels */}
            {Array.from({ length: 8 }).map((_, i) => {
              const t = i / 8;
              const a0 = -Math.PI + t * Math.PI;
              const a1 = -Math.PI + (t + 1/8) * Math.PI;
              const r = 110 * open;
              const x0 = Math.cos(a0) * r;
              const y0 = Math.sin(a0) * r * 0.55;
              const x1 = Math.cos(a1) * r;
              const y1 = Math.sin(a1) * r * 0.55;
              // arc up
              const cx = (x0 + x1) / 2;
              const cy = (y0 + y1) / 2 - 22 * open;
              const fill = i % 2 === 0 ? '#0D1B2E' : '#1F3B5F';
              return (
                <path
                  key={i}
                  d={`M 0 0 L ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1} Z`}
                  fill={fill}
                  stroke="#F2EDE0"
                  strokeWidth="0.5"
                  opacity={0.92}
                />
              );
            })}
            {/* tip */}
            <circle cx="0" cy={-22 * open} r={3 * open} fill="var(--gold)" />
            {/* shaft */}
            <line x1="0" y1="0" x2="0" y2={open > 0.4 ? 110 : 0} stroke="#0D1B2E" strokeWidth="2" />
            {/* handle */}
            {open > 0.6 && <path d={`M 0 110 Q 0 122 -10 122 Q -20 122 -20 112`} stroke="#0D1B2E" strokeWidth="2.5" fill="none" />}
          </g>

          {/* households below — small house silhouettes */}
          <g transform="translate(0, 320)" opacity={Math.min(1, p * 1.6)}>
            {Array.from({ length: 9 }).map((_, i) => {
              const x = 24 + i * 38;
              return (
                <g key={i} transform={`translate(${x}, 0)`}>
                  <path d="M 0 18 L 12 6 L 24 18 L 24 36 L 0 36 Z" fill="var(--ink-2)" opacity="0.55" />
                  <rect x="9" y="24" width="6" height="12" fill="var(--paper)" />
                </g>
              );
            })}
          </g>

          {/* ground */}
          <line x1="0" y1="358" x2="360" y2="358" stroke="var(--line-strong)" strokeWidth="1" />
        </svg>

        {/* hero figure overlay */}
        <div style={{ position: 'absolute', left: 24, bottom: 4, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          <div style={{ marginBottom: 6 }}>FY'25 revenue</div>
          <div className="display" style={{ fontSize: 34, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            $<CountUp to={67.69} decimals={2} trigger={inView} />B
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- The business — premiums in, claims out ----------
function BusinessScene() {
  const [ref, p] = useScrollProgress();
  const [inRef, inView] = useInView(0.2);
  return (
    <section ref={ref} className="pad" style={{ paddingTop: 64, paddingBottom: 72 }}>
      <div className="eyebrow" ref={inRef}><span className="dot"></span><span>The business</span><span style={{ color: 'var(--ink-4)' }}>· 92.4% premiums</span></div>
      <h2 className="display" style={{ fontSize: 38, marginTop: 18 }}>
        Money in.<br />
        <span className="it" style={{ color: 'var(--claim)' }}>Money out.</span>
      </h2>
      <p className="body-text" style={{ marginTop: 16 }}>
        <em className="serif">Allstate Protection</em> — auto and homeowners — drives 92.4% of premiums. Protection Services adds 4.7%. A <em className="serif">$72.6B portfolio</em> earns <em className="serif">$3.1B</em> on the float in between.
      </p>

      <div style={{ marginTop: 36 }}>
        <svg viewBox="0 0 340 280" width="100%" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="pin" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1F3B5F" />
              <stop offset="100%" stopColor="#4A7A5C" />
            </linearGradient>
            <linearGradient id="pout" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#B83A2A" />
              <stop offset="100%" stopColor="#8B2618" />
            </linearGradient>
          </defs>

          {/* labels */}
          <text x="20" y="20" fontFamily="Geist Mono" fontSize="9" letterSpacing="1" fill="var(--ink-3)">PREMIUMS IN</text>
          <text x="320" y="20" fontFamily="Geist Mono" fontSize="9" letterSpacing="1" fill="var(--ink-3)" textAnchor="end">CLAIMS OUT</text>

          {/* the vault / float in middle */}
          <g transform="translate(120, 90)">
            <rect x="0" y="0" width="100" height="100" rx="6" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
            <rect x="8" y="8" width="84" height="84" rx="3" fill="none" stroke="var(--line-strong)" strokeWidth="0.5" strokeDasharray="2 3" />
            <text x="50" y="48" fontFamily="Instrument Serif" fontSize="22" textAnchor="middle" fill="var(--ink)">$72.6B</text>
            <text x="50" y="64" fontFamily="Geist Mono" fontSize="8" letterSpacing="1.2" textAnchor="middle" fill="var(--ink-3)">FLOAT</text>
            <text x="50" y="78" fontFamily="Geist" fontStyle="italic" fontSize="10" textAnchor="middle" fill="var(--survive)">+$3.1B yield</text>
          </g>

          {/* premium streams in */}
          {Array.from({ length: 7 }).map((_, i) => {
            const y = 50 + i * 18;
            const offset = (p * 200 + i * 30) % 120;
            return (
              <g key={`in-${i}`}>
                <line x1="0" y1={y} x2="120" y2={y} stroke="var(--line-strong)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />
                <circle cx={offset} cy={y} r="2.5" fill="url(#pin)" opacity="0.85" />
              </g>
            );
          })}
          {/* claim streams out */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = 60 + i * 22;
            const offset = 220 + ((p * 240 + i * 40) % 120);
            return (
              <g key={`out-${i}`}>
                <line x1="220" y1={y} x2="340" y2={y} stroke="var(--claim-soft)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.6" />
                <circle cx={offset} cy={y} r="3" fill="url(#pout)" opacity="0.9" />
              </g>
            );
          })}

          {/* labels at bottom */}
          <text x="60" y="240" fontFamily="Instrument Serif" fontStyle="italic" fontSize="14" textAnchor="middle" fill="var(--ink)">premiums</text>
          <text x="60" y="256" fontFamily="Geist Mono" fontSize="9" letterSpacing="1" textAnchor="middle" fill="var(--ink-3)">$67.7B</text>

          <text x="280" y="240" fontFamily="Instrument Serif" fontStyle="italic" fontSize="14" textAnchor="middle" fill="var(--claim)">claims</text>
          <text x="280" y="256" fontFamily="Geist Mono" fontSize="9" letterSpacing="1" textAnchor="middle" fill="var(--ink-3)">~$37B</text>
        </svg>
      </div>

      <p className="body-text" style={{ marginTop: 28, fontSize: 13, color: 'var(--ink-3)' }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Q4'25 EPS</span> &nbsp;·&nbsp; <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>$14.31</span>
        &nbsp;&nbsp;<span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Q4 rev</span> &nbsp;·&nbsp; <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)' }}>$14.57B</span>
      </p>
    </section>
  );
}

// ---------- The scale ----------
function ScaleScene() {
  const [inRef, inView] = useInView(0.25);
  return (
    <section className="pad" ref={inRef} style={{ background: 'var(--paper-2)', paddingTop: 64, paddingBottom: 72 }}>
      <div className="eyebrow"><span className="dot"></span><span>The scale</span><span style={{ color: 'var(--ink-4)' }}>· FY'25</span></div>

      <h2 className="display" style={{ fontSize: 38, marginTop: 18 }}>
        Ninety-five<br />years of <span className="it" style={{ color: 'var(--claim)' }}>compounding</span><br />promises.
      </h2>

      <div style={{ marginTop: 40, display: 'grid', gap: 36 }}>
        {[
          { k: 'Households served', n: 16, suf: 'M', sub: 'across U.S. & Canada' },
          { k: 'Employees', n: 55, suf: 'K', sub: 'roughly' },
          { k: 'Total assets', n: 119.8, suf: 'B', pre: '$', dec: 1, sub: 'on the books' },
          { k: 'Investment portfolio', n: 72.6, suf: 'B', pre: '$', dec: 1, sub: 'earning the float' },
        ].map((s, i) => (
          <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line)', paddingTop: i === 0 ? 0 : 24 }}>
            <div className="bignum">
              {s.pre || ''}<CountUp to={s.n} decimals={s.dec || 0} trigger={inView} />
              <span className="unit">{s.suf}</span>
            </div>
            <div className="caption" style={{ marginTop: 10 }}>{s.k}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink-2)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* market cap as comparative bar */}
      <div style={{ marginTop: 56 }}>
        <div className="caption">Market cap</div>
        <div className="display" style={{ fontSize: 56, color: 'var(--ink)', marginTop: 4 }}>
          $<CountUp to={56.10} decimals={2} trigger={inView} />B
        </div>
      </div>
    </section>
  );
}

// ---------- The bill — 100 cents on a dollar ----------
function CostScene() {
  const [ref, p] = useScrollProgress();
  // 100 cents
  const costs = [
    { pct: 55, color: '#E05252', label: 'Claims & Losses' },
    { pct: 13, color: '#5B8FF9', label: 'Operating & Underwriting' },
    { pct: 8,  color: '#5AD8A6', label: 'Selling, G&A' },
    { pct: 4,  color: '#F6BD16', label: 'Advertising' },
    { pct: 3,  color: '#A371F7', label: 'Interest & Other' },
  ];
  const totalCost = costs.reduce((a, b) => a + b.pct, 0); // 83
  const survives = 100 - totalCost; // 17

  // reveal cents progressively
  const revealed = Math.floor(Math.min(100, p * 130));

  return (
    <section ref={ref} className="dark-band">
      <div className="eyebrow"><span className="dot" style={{ background: '#FF8B6A' }}></span><span>The bill</span><span style={{ color: 'rgba(242,237,224,0.4)' }}>· per dollar</span></div>

      <h2 className="display" style={{ fontSize: 40, marginTop: 18, color: 'var(--paper)' }}>
        A hundred cents in.<br />
        <span className="it" style={{ color: '#FF8B6A' }}>Seventeen survive.</span>
      </h2>

      <p className="body-text" style={{ marginTop: 18, color: 'rgba(242,237,224,0.78)' }}>
        Of every dollar of revenue, <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#FF8B6A' }}>fifty-five cents</span> leave as claims before lunch. The rest fights for what's left.
      </p>

      <div style={{ marginTop: 40, padding: '0 4px' }}>
        <div className="coin-grid" style={{ gridTemplateColumns: 'repeat(10, 1fr)', gap: 5 }}>
          {Array.from({ length: 100 }).map((_, i) => {
            // assign each cent a color based on cost order
            let acc = 0;
            let color = null;
            for (const c of costs) {
              if (i < acc + c.pct) { color = c.color; break; }
              acc += c.pct;
            }
            const isSurvives = !color;
            const isOn = i < revealed;
            return (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: isOn ? (isSurvives ? '#7BC79A' : color) : 'rgba(242,237,224,0.06)',
                  border: `1px solid ${isOn ? (isSurvives ? '#7BC79A' : color) : 'rgba(242,237,224,0.12)'}`,
                  transition: 'background 250ms ease-out, border-color 250ms ease-out, transform 350ms cubic-bezier(0.34,1.56,0.64,1)',
                  transform: isOn ? 'scale(1)' : 'scale(0.85)',
                  boxShadow: isOn && isSurvives ? '0 0 12px rgba(123,199,154,0.5)' : 'none',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* legend */}
      <div style={{ marginTop: 32, display: 'grid', gap: 10 }}>
        {costs.map((c) => (
          <div key={c.label} style={{ display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 12, alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(242,237,224,0.08)' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: c.color }}></div>
            <div style={{ fontSize: 13, color: 'rgba(242,237,224,0.88)' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: c.color, fontWeight: 500 }}>{c.pct}¢</div>
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 12, alignItems: 'center', paddingTop: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#7BC79A', boxShadow: '0 0 10px rgba(123,199,154,0.6)' }}></div>
          <div style={{ fontSize: 13, color: '#FF8B6A', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18 }}>what survives</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#7BC79A', fontWeight: 500 }}>17¢</div>
        </div>
      </div>

      <div style={{ marginTop: 36 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,237,224,0.5)' }}>FY'25 free cash flow</div>
        <div className="display" style={{ fontSize: 56, color: 'var(--paper)', marginTop: 6 }}>
          $9.88<span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'rgba(242,237,224,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginLeft: 6 }}>B</span>
        </div>
      </div>
    </section>
  );
}

// ---------- Footprint — North America ----------
function FootprintScene() {
  const [inRef, inView] = useInView(0.25);
  return (
    <section className="pad" ref={inRef} style={{ paddingTop: 64, paddingBottom: 72 }}>
      <div className="eyebrow"><span className="dot"></span><span>The footprint</span><span style={{ color: 'var(--ink-4)' }}>· North America</span></div>
      <h2 className="display" style={{ fontSize: 38, marginTop: 18 }}>
        One <span className="it" style={{ color: 'var(--claim)' }}>continent.</span><br />
        Mostly one country.
      </h2>

      <div style={{ marginTop: 36, position: 'relative' }}>
        <svg viewBox="0 0 360 240" width="100%" style={{ display: 'block' }}>
          <defs>
            <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.7" fill="var(--ink-3)" opacity="0.55" />
            </pattern>
            <pattern id="dots-faint" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="var(--ink-4)" opacity="0.35" />
            </pattern>
          </defs>

          {/* Canada (faint) */}
          <path d="M 30 30 L 320 30 L 330 90 L 280 95 L 200 80 L 130 85 L 60 80 L 30 90 Z"
                fill="url(#dots-faint)" stroke="var(--line-strong)" strokeWidth="0.5" />
          {/* USA (dense) */}
          <path d="M 30 90 L 60 80 L 130 85 L 200 80 L 280 95 L 320 100 L 330 130 L 320 170 L 280 200 L 240 210 L 170 215 L 110 210 L 70 195 L 40 170 L 30 130 Z"
                fill="url(#dots)" stroke="var(--ink)" strokeWidth="1" />

          {/* Allstate HQ — Northbrook, IL */}
          <g transform="translate(180, 130)">
            <circle r="22" fill="none" stroke="var(--claim)" strokeWidth="0.8" opacity="0.4">
              <animate attributeName="r" values="6;26;6" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle r="5" fill="var(--claim)" />
            <circle r="2" fill="var(--paper)" />
          </g>
          <text x="195" y="128" fontFamily="Geist Mono" fontSize="9" fill="var(--ink)" letterSpacing="1">NORTHBROOK, IL</text>
          <text x="195" y="140" fontFamily="Instrument Serif" fontStyle="italic" fontSize="11" fill="var(--ink-2)">HQ since 1931</text>

          {/* Canada label */}
          <text x="180" y="55" fontFamily="Geist Mono" fontSize="10" fill="var(--ink-3)" letterSpacing="1.5" textAnchor="middle">CANADA · 4%</text>
          {/* USA label */}
          <text x="100" y="155" fontFamily="Instrument Serif" fontSize="22" fill="var(--ink)" textAnchor="middle">United States</text>
          <text x="100" y="172" fontFamily="Geist Mono" fontSize="11" fill="var(--claim)" textAnchor="middle" letterSpacing="1.5">96%</text>
        </svg>
      </div>

      <p className="body-text" style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-3)' }}>
        Headquartered in Northbrook, Illinois. Founded inside Sears in <em className="serif">1931</em>; spun out in <em className="serif">1993</em>. American at the bone.
      </p>
    </section>
  );
}

// ---------- The bet — capital allocation balance scale ----------
function BetScene() {
  const [ref, p] = useScrollProgress();
  // tip the scale toward shareholder returns
  const tilt = Math.min(1, Math.max(0, (p - 0.2) * 1.5));
  const angle = -8 * tilt; // tilt toward right (shareholders)

  return (
    <section ref={ref} className="pad" style={{ background: 'var(--paper-warm)', paddingTop: 64, paddingBottom: 72, position: 'relative', overflow: 'hidden' }}>
      <div className="eyebrow"><span className="dot"></span><span>The bet</span><span style={{ color: 'var(--ink-4)' }}>· $2.24B returned</span></div>
      <h2 className="display" style={{ fontSize: 38, marginTop: 18 }}>
        Concentrate.<br />
        <span className="it" style={{ color: 'var(--claim)' }}>Return.</span> Repeat.
      </h2>
      <p className="body-text" style={{ marginTop: 16 }}>
        Allstate is selling the side businesses — <em className="serif">$3.25B</em> from Voluntary Benefits and Group Health — and routing the proceeds back to the core, and back to shareholders.
      </p>

      {/* balance scale */}
      <div style={{ marginTop: 40, position: 'relative', height: 280 }}>
        <svg viewBox="0 0 360 280" width="100%" style={{ display: 'block' }}>
          {/* base */}
          <line x1="180" y1="220" x2="180" y2="80" stroke="var(--ink)" strokeWidth="2" />
          <path d="M 150 240 L 210 240 L 200 220 L 160 220 Z" fill="var(--ink)" />
          <circle cx="180" cy="80" r="5" fill="var(--ink)" />

          {/* beam — pivots */}
          <g transform={`rotate(${angle} 180 80)`}>
            <line x1="50" y1="80" x2="310" y2="80" stroke="var(--ink)" strokeWidth="2" />

            {/* left pan: divestiture / capex */}
            <line x1="80" y1="80" x2="80" y2="120" stroke="var(--ink)" strokeWidth="0.8" />
            <ellipse cx="80" cy="125" rx="50" ry="8" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <path d="M 30 125 Q 80 165 130 125" fill="var(--paper-2)" stroke="var(--ink)" strokeWidth="1.5" />
            {/* coins on left */}
            <circle cx="65" cy="138" r="9" fill="var(--gold-soft)" stroke="var(--gold)" strokeWidth="1" />
            <circle cx="85" cy="142" r="9" fill="var(--gold-soft)" stroke="var(--gold)" strokeWidth="1" />
            <circle cx="100" cy="138" r="9" fill="var(--gold-soft)" stroke="var(--gold)" strokeWidth="1" />
            <text x="80" y="170" fontFamily="Geist Mono" fontSize="9" fill="var(--ink-2)" textAnchor="middle" letterSpacing="1">CAPEX · $228M</text>

            {/* right pan: shareholder returns — heavier */}
            <line x1="280" y1="80" x2="280" y2="140" stroke="var(--ink)" strokeWidth="0.8" />
            <ellipse cx="280" cy="145" rx="60" ry="9" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
            <path d="M 220 145 Q 280 195 340 145" fill="var(--claim)" opacity="0.92" stroke="var(--claim-deep)" strokeWidth="1.5" />
            {/* coins stacked tall on right */}
            {[
              { x: 250, y: 158 }, { x: 270, y: 162 }, { x: 290, y: 158 }, { x: 310, y: 162 },
              { x: 260, y: 145 }, { x: 280, y: 148 }, { x: 300, y: 145 },
              { x: 270, y: 132 }, { x: 290, y: 134 },
              { x: 280, y: 120 },
            ].map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r="9" fill="var(--gold-soft)" stroke="var(--gold)" strokeWidth="1" />
            ))}
            <text x="280" y="200" fontFamily="Geist Mono" fontSize="9" fill="var(--paper)" textAnchor="middle" letterSpacing="1">RETURNS · $2.24B</text>
          </g>
        </svg>
      </div>

      {/* breakdown */}
      <div style={{ marginTop: 32, display: 'grid', gap: 14 }}>
        {[
          { k: 'Share buybacks', v: '$1.20B', s: '$1.5B authorized' },
          { k: 'Dividends paid', v: '$1.04B', s: 'raised to $1.00/qtr' },
          { k: 'Operating cash', v: '$10.11B', s: 'FY 2025' },
          { k: 'Total debt', v: '$7.49B', s: 'vs $30.61B equity' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'baseline', borderBottom: '1px solid var(--line)', paddingBottom: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{r.k}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-2)', marginTop: 2 }}>{r.s}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{r.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- The competition — sized circles, expandable rows ----------
function CompetitionScene() {
  const [open, setOpen] = useState(null);
  const [inRef, inView] = useInView(0.2);

  const comps = [
    { ticker: 'PGR', name: 'Progressive', cap: 118.50, rev: 87.67, growth: 13.89, pe: 10.25, note: 'Most direct rival. Eating share in auto via telematics pricing and lower expense ratios.' },
    { ticker: 'ALL', name: 'Allstate', cap: 56.10, rev: 67.69, growth: null, pe: null, note: 'You are here.', self: true },
    { ticker: 'AFL', name: 'Aflac', cap: 59.00, rev: 17.16, growth: -9.31, pe: 16.18, note: 'Supplemental health, accident, life — sold via employers.' },
    { ticker: 'MET', name: 'MetLife', cap: 50.91, rev: 77.08, growth: 8.30, pe: 15.07, note: 'Personal lines, group benefits, protection products at scale.' },
  ];
  const maxCap = Math.max(...comps.map(c => c.cap));

  return (
    <section className="pad" ref={inRef} style={{ paddingTop: 64, paddingBottom: 72 }}>
      <div className="eyebrow"><span className="dot"></span><span>The neighbors</span><span style={{ color: 'var(--ink-4)' }}>· tap to open</span></div>
      <h2 className="display" style={{ fontSize: 38, marginTop: 18 }}>
        And one <span className="it" style={{ color: 'var(--claim)' }}>rival</span><br />
        who is winning.
      </h2>
      <p className="body-text" style={{ marginTop: 16 }}>
        <em className="serif">Progressive</em> is the closest competitor by product — and the one quietly outgrowing Allstate. The others compete in adjacent rooms.
      </p>

      {/* sized bubble row */}
      <div style={{ marginTop: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 180, gap: 6, padding: '0 4px' }}>
        {comps.map((c) => {
          const size = 30 + (c.cap / maxCap) * 110;
          const isSelf = c.self;
          return (
            <div key={c.ticker} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(12px)', transition: 'all 600ms cubic-bezier(0.22,1,0.36,1)', transitionDelay: `${comps.indexOf(c) * 80}ms` }}>
              <div style={{
                width: size, height: size, borderRadius: '50%',
                background: isSelf ? 'var(--claim)' : 'var(--ink)',
                border: isSelf ? '2px solid var(--claim-deep)' : 'none',
                display: 'grid', placeItems: 'center',
                color: 'var(--paper)',
                fontFamily: 'var(--font-mono)', fontSize: size > 80 ? 13 : 11,
                letterSpacing: '0.04em',
                boxShadow: isSelf ? '0 0 0 6px rgba(184,58,42,0.12)' : 'none',
              }}>
                {c.ticker}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: '0.06em' }}>${c.cap}B</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)', textAlign: 'center', marginTop: 4 }}>
        ↑ market cap
      </div>

      {/* expandable rows */}
      <div style={{ marginTop: 36 }}>
        {comps.filter(c => !c.self).map((c) => (
          <div key={c.ticker} className={`comp-row ${open === c.ticker ? 'open' : ''}`} onClick={() => setOpen(open === c.ticker ? null : c.ticker)}>
            <div className="ticker">{c.ticker}</div>
            <div>
              <div className="name">{c.name}</div>
              <div className="meta">${c.cap}B cap · {c.growth >= 0 ? '+' : ''}{c.growth}% YoY</div>
            </div>
            <div className="arrow">›</div>
            <div className="comp-detail">
              <div className="comp-detail-inner">
                <div className="comp-stat">
                  <div className="k">Revenue</div>
                  <div className="v">${c.rev}B</div>
                </div>
                <div className="comp-stat">
                  <div className="k">P/E TTM</div>
                  <div className="v">{c.pe}</div>
                </div>
                <div className="comp-stat">
                  <div className="k">Growth YoY</div>
                  <div className={`v ${c.growth >= 0 ? 'pos' : 'neg'}`}>{c.growth >= 0 ? '+' : ''}{c.growth}%</div>
                </div>
                <div className="comp-stat">
                  <div className="k">Mkt cap</div>
                  <div className="v">${c.cap}B</div>
                </div>
                <div className="comp-stat full">
                  <div className="k">The take</div>
                  <div className="v">{c.note}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Closing thesis ----------
function CloseScene() {
  const [inRef, inView] = useInView(0.3);
  return (
    <section ref={inRef} className="pad" style={{ paddingTop: 80, paddingBottom: 64 }}>
      <div className="eyebrow"><span className="dot"></span><span>The takeaway</span></div>

      <h2 className="display" style={{ fontSize: 52, marginTop: 24, lineHeight: 0.96 }}>
        Sixteen million<br />
        <span className="it" style={{ color: 'var(--claim)' }}>promises.</span>
      </h2>
      <h2 className="display" style={{ fontSize: 52, marginTop: 12, lineHeight: 0.96 }}>
        $9.88B that<br />
        <span className="it">survives.</span>
      </h2>

      <p className="body-text" style={{ marginTop: 28, fontSize: 16 }}>
        The umbrella opens. The premiums fall. <em className="serif">Fifty-five cents</em> leave as claims, <em className="serif">seventeen</em> stay. And ninety-five years in, the <em className="serif">promise still pays the bill</em>.
      </p>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ padding: '20px 16px 20px 0', borderRight: '1px solid var(--line)' }}>
          <div className="caption">Free cash flow</div>
          <div className="display" style={{ fontSize: 30, marginTop: 4 }}>$9.88B</div>
        </div>
        <div style={{ padding: '20px 0 20px 16px' }}>
          <div className="caption">Returned to holders</div>
          <div className="display" style={{ fontSize: 30, marginTop: 4, color: 'var(--claim)' }}>$2.24B</div>
        </div>
      </div>
    </section>
  );
}

// ---------- Reset beats ----------
function ResetBeat({ marker, children, warm }) {
  return (
    <div className={`reset-beat ${warm ? 'warm' : ''}`}>
      <div className="marker">{marker}</div>
      <div className="quote">{children}</div>
    </div>
  );
}

// expose
Object.assign(window, {
  HeroScene, BusinessScene, ScaleScene, CostScene, FootprintScene, BetScene, CompetitionScene, CloseScene, ResetBeat,
});

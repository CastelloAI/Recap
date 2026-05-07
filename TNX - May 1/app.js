/* ============================================================
   TXN recap — page composer
   ============================================================ */
(function(){
  const data = JSON.parse(document.getElementById('company-data').textContent);
  const S = window.SCENES;

  const costs = [
    {pct: 43, color: '#E05C5C', label: 'Cost of Revenue'},
    {pct: 12, color: '#5B8FF9', label: 'Research & Development'},
    {pct: 8,  color: '#5AD8A6', label: 'SG&A'},
    {pct: 26, color: '#F6BD16', label: 'Capital Expenditures (CapEx)'}
  ];
  const regions = [
    {pct: 38, region: 'United States'},
    {pct: 23, region: 'Europe, ME & Africa'},
    {pct: 19, region: 'China'},
    {pct: 11, region: 'Rest of Asia'},
    {pct: 8,  region: 'Japan'},
    {pct: 1,  region: 'Rest of World'}
  ];
  const competitors = [
    {
      name: 'Analog Devices', ticker: 'ADI',
      cap: 181.34, rev: 11.02, pe: 66.99, growth: 25.91,
      desc: "TXN's most direct product-market rival, head-to-head in high-performance analog signal chain and power management for industrial and automotive customers."
    },
    {
      name: 'KLA Corp', ticker: 'KLAC',
      cap: 234.82, rev: 12.16, pe: 51.52, growth: 17.49,
      desc: "Primarily semiconductor equipment, but its growing presence in process control for advanced analog fabs creates pressure on TXN's manufacturing cost advantage."
    },
    {
      name: 'NXP Semiconductors', ticker: 'NXPI',
      cap: 54.59, rev: 12.27, pe: 27.01, growth: -2.74,
      desc: "Direct competitor in automotive and industrial microcontrollers and analog mixed-signal — actively displacing TI in vehicle electrification and ADAS design wins across Tier 1 suppliers."
    }
  ];

  const html = `
    <!-- ============== STICKY CHROME ============== -->
    <div class="chrome">
      <div class="chrome-row">
        <div class="chrome-left">
          <span class="chrome-ticker"><span class="dot"></span>TXN</span>
          <span class="chrome-name">Texas Instruments</span>
        </div>
        <div class="chrome-right">Recap · FY '25</div>
      </div>
      <div class="scroll-rail"><div class="fill" id="scroll-fill"></div></div>
    </div>

    <!-- ============== 1. HERO ============== -->
    <section class="hero">
      <div class="eyebrow hero-eyebrow reveal in">
        <span class="num">01</span><span class="bar"></span><span>The thesis</span>
      </div>
      <h1 class="reveal in">
        Eighty thousand<br/>
        <span class="em italic">quiet chips</span>,<br/>
        one wafer apiece.
      </h1>
      <p class="lede reveal in" data-delay="2">
        Texas Instruments doesn't make the chips you've heard of. It makes the <em class="italic" style="color:var(--coral-500)">other</em> ones — the analog signal chain and embedded processors humming inside cars, factories, and the things that just turn on when you flip a switch.
      </p>

      <div class="wafer-stage reveal" data-delay="3" id="wafer-stage">
        ${S.sceneWafer({ id:'wafer-hero' })}
      </div>

      <div class="hero-meta reveal" data-delay="4">
        <div><span class="k">Market cap</span><span class="v">$213.74<small>B</small></span></div>
        <div><span class="k">FY '25 revenue</span><span class="v">$17.68<small>B</small></span></div>
        <div><span class="k">Founded</span><span class="v">1930</span></div>
        <div><span class="k">HQ</span><span class="v" style="font-size:22px">Dallas, TX</span></div>
      </div>
    </section>

    <!-- ============== RESET BEAT 1 ============== -->
    <div class="reset reveal">
      <p>The world makes noise. <span class="hit italic">Analog chips translate.</span> Then embedded chips decide what to do about it.</p>
    </div>

    <!-- ============== 2. HOW IT MAKES MONEY ============== -->
    <section class="howmoney">
      <div class="eyebrow reveal"><span class="num">02</span><span class="bar"></span><span>The business</span></div>
      <h2 class="reveal" data-delay="1">
        Two segments.<br/>
        <em>One does the heavy lifting.</em>
      </h2>
      <p class="lede reveal" data-delay="2" style="margin-top:20px">
        Analog converts heat, pressure, motion, voltage — the messy real world — into clean digital signal. Embedded processors take it from there. <em class="italic" style="color:var(--coral-500)">Behind every device, a counterweight</em>.
      </p>

      <div class="signal-stage reveal" data-delay="3">${S.sceneSignalChain()}</div>

      <div class="segments reveal" data-delay="2">
        <div class="seg-row">
          <div class="pct">79<sup>%</sup></div>
          <div class="label"><strong>Analog</strong>Signal chain · power management · the vertically-integrated cash cow.</div>
          <div class="rev">$14.01B</div>
        </div>
        <div class="seg-row">
          <div class="pct">~17<sup>%</sup></div>
          <div class="label"><strong>Embedded Processing</strong>Microcontrollers · processors · wireless · radar.</div>
          <div class="rev">~$3.0B</div>
        </div>
        <div class="seg-row">
          <div class="pct">~4<sup>%</sup></div>
          <div class="label"><strong>Other</strong>DLP optics · calculators · custom ASICs.</div>
          <div class="rev">~$0.7B</div>
        </div>
      </div>

      <div class="margins reveal" data-delay="2">
        <div>
          <div class="k">Gross margin</div>
          <div class="v">57.0<small>%</small></div>
        </div>
        <div>
          <div class="k">Operating margin</div>
          <div class="v">34.1<small>%</small></div>
        </div>
      </div>
    </section>

    <!-- ============== 3. SCALE ============== -->
    <section class="scale">
      <div class="eyebrow reveal"><span class="num">03</span><span class="bar"></span><span>The scale</span></div>
      <h2 class="reveal" data-delay="1">
        Eighty thousand<br/>
        SKUs, <em>shipped to every continent</em>.
      </h2>
      <p class="lede scale-lede reveal" data-delay="2">
        Sold direct, by TI's own sales force and by ti.com, into <em class="italic" style="color:var(--coral-500)">a hundred thousand customers</em> across more than thirty countries.
      </p>

      <div class="bignums reveal" data-delay="2">
        <div>
          <span class="k">Products</span>
          <div class="v" data-counter="80000" data-suffix="+">0</div>
        </div>
        <div>
          <span class="k">Customers</span>
          <div class="v" data-counter="100000" data-suffix="+">0</div>
        </div>
        <div>
          <span class="k">Employees</span>
          <div class="v" data-counter="33000">0</div>
        </div>
        <div>
          <span class="k">Countries</span>
          <div class="v" data-counter="30" data-suffix="+">0</div>
        </div>
      </div>

      <div class="product-grid reveal" data-delay="2">
        ${S.sceneProductGrid()}
        <p class="caption">Each dot is a TI part on a shelf somewhere. <span class="hit italic">Coral is analog</span> — the seventy-nine percent.</p>
      </div>
    </section>

    <!-- ============== RESET BEAT 2 ============== -->
    <div class="reset reveal">
      <p>So a hundred dollars walks in the door. <span class="hit italic">Where does it go.</span></p>
    </div>

    <!-- ============== 4. WHERE THE MONEY GOES ============== -->
    <section class="costs">
      <div class="eyebrow reveal"><span class="num">04</span><span class="bar"></span><span>The dollar</span></div>
      <h2 class="reveal" data-delay="1">
        Of every dollar<br/>
        in, <em>eleven cents stay</em>.
      </h2>

      <div class="dollar-stage reveal" data-delay="2">
        ${S.sceneDollar(costs)}
      </div>

      <div class="cost-list reveal" data-delay="2">
        ${costs.map(c => `
          <div class="cost-row">
            <span class="swatch" style="background:${c.color}"></span>
            <span class="label">${c.label}</span>
            <span class="pct">${c.pct}<span class="c">¢</span></span>
          </div>
        `).join('')}
        <div class="cost-row">
          <span class="swatch" style="background:transparent;border:1.5px dashed var(--ink);box-sizing:border-box"></span>
          <span class="label">Operating profit · what survives</span>
          <span class="pct">11<span class="c">¢</span></span>
        </div>
      </div>

      <p class="cost-footer reveal" data-delay="2">
        Twenty-six cents go straight back into the fab. <span class="hit">That's the bet.</span>
      </p>
    </section>

    <!-- ============== 5. GEOGRAPHY ============== -->
    <section class="geo">
      <div class="eyebrow reveal"><span class="num">05</span><span class="bar"></span><span>The footprint</span></div>
      <h2 class="reveal" data-delay="1">
        American HQ.<br/>
        <em>Demand is everywhere else.</em>
      </h2>
      <p class="lede reveal" data-delay="2" style="margin-top:20px;max-width:38ch">
        Thirty-eight percent of shipments stay home. The other <em class="italic" style="color:var(--coral-500)">sixty-two percent</em> cross an ocean.
      </p>

      <div class="geo-stage reveal" data-delay="2">
        ${S.sceneGeo(regions)}
      </div>

      <div class="geo-list reveal" data-delay="2">
        ${regions.map((r, i) => `
          <div class="geo-row">
            <span class="ord">${String(i+1).padStart(2,'0')}</span>
            <span class="name">${r.region}</span>
            <span class="pct">${r.pct}%</span>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ============== RESET BEAT 3 ============== -->
    <div class="reset reveal">
      <p>You don't compete on cost in semis without <span class="hit italic">your own fabs</span>. So TI built more.</p>
    </div>

    <!-- ============== 6. THE BET — DARK ============== -->
    <section class="bet">
      <div class="eyebrow reveal"><span class="num">06</span><span class="bar"></span><span>The bet · 300mm</span></div>
      <h2 class="reveal" data-delay="1">
        $4.55B<br/>
        <em>poured into the floor.</em>
      </h2>
      <p class="body reveal" data-delay="2" style="margin-top:18px">
        TI's edge is <em class="italic" style="color:var(--coral-300)">cheaper silicon per chip</em> — the kind that comes from owning the building, the equipment, and the 300mm wafer fab inside it. Free cash flow took the hit so capacity could keep growing.
      </p>

      <div class="fab-stage reveal" data-delay="2">
        ${S.sceneFab()}
      </div>

      <div class="bet-stats reveal" data-delay="2">
        <div>
          <span class="k">Operating cash flow</span>
          <div class="v">$7.15<small>B</small></div>
        </div>
        <div>
          <span class="k">CapEx</span>
          <div class="v">$4.55<small>B</small></div>
        </div>
        <div>
          <span class="k">Free cash flow</span>
          <div class="v">$2.60<small>B</small></div>
        </div>
        <div>
          <span class="k">Total debt</span>
          <div class="v">$13.55<small>B</small></div>
        </div>
      </div>

      <p class="footer-line reveal" data-delay="2">
        Sixty-four cents of every operating dollar got <span class="hit">re-poured into the floor</span>.
      </p>
    </section>

    <!-- ============== 7. COMPETITION ============== -->
    <section class="compete">
      <div class="eyebrow reveal"><span class="num">07</span><span class="bar"></span><span>The rivals</span></div>
      <h2 class="reveal" data-delay="1">
        Three companies<br/>
        keep TI <em>honest</em>.
      </h2>
      <p class="lede reveal" data-delay="2" style="margin-top:18px;max-width:36ch">
        Bigger, smaller, sideways. Sized below by market cap.
      </p>

      <div class="compete-stage reveal" data-delay="2">${S.sceneCompete()}</div>

      <div class="rivals reveal" data-delay="2">
        ${competitors.map((c, i) => `
          <div class="rival" data-i="${i}" aria-expanded="false">
            <div class="rival-head">
              <span class="rival-name">${c.name}</span>
              <span class="rival-ticker">${c.ticker}</span>
            </div>
            <div class="rival-stats">
              <div>
                <span class="k">Market cap</span>
                <div class="v">$${c.cap.toFixed(0)}<small>B</small></div>
              </div>
              <div>
                <span class="k">Revenue</span>
                <div class="v">$${c.rev.toFixed(1)}<small>B</small></div>
              </div>
              <div>
                <span class="k">YoY growth</span>
                <div class="v ${c.growth >= 0 ? 'delta-up' : 'delta-down'}">${c.growth > 0 ? '+' : ''}${c.growth.toFixed(1)}<small>%</small></div>
              </div>
            </div>
            <div class="rival-toggle">
              <span class="show">Tap to read</span>
              <span class="chev"></span>
            </div>
            <div class="rival-desc">
              <p>${c.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- ============== 8. CAPITAL RETURN ============== -->
    <section class="capret">
      <div class="eyebrow reveal"><span class="num">08</span><span class="bar"></span><span>The return</span></div>
      <h2 class="reveal" data-delay="1">
        Twenty-two<br/>
        <em>uninterrupted raises</em>.
      </h2>
      <p class="lede reveal" data-delay="2" style="margin-top:18px;max-width:38ch">
        TI's policy: every dollar of free cash flow goes back to shareholders, eventually. <em class="italic" style="color:var(--coral-500)">Forty-seven percent</em> of the share count, gone since 2004.
      </p>

      <div class="capret-stage reveal" data-delay="2">${S.sceneDivRings()}</div>

      <div class="capret-stats reveal" data-delay="2">
        <div>
          <span class="k">Dividends paid</span>
          <div class="v">$5.00<small>B</small></div>
        </div>
        <div>
          <span class="k">Years of hikes</span>
          <div class="v">22</div>
        </div>
        <div>
          <span class="k">Shares retired</span>
          <div class="v">−47<small>%</small></div>
        </div>
        <div>
          <span class="k">Cash on hand</span>
          <div class="v">$3.23<small>B</small></div>
        </div>
      </div>
    </section>

    <!-- ============== 9. TAKEAWAY ============== -->
    <section class="takeaway">
      <div class="eyebrow reveal"><span class="num">09</span><span class="bar"></span><span>The takeaway</span></div>
      <h2 class="reveal" data-delay="1">
        Eighty thousand<br/>
        <em>quiet chips</em>.<br/>
        Eleven cents each.
      </h2>
      <p class="lede reveal" data-delay="2">
        The thesis closes where it began: a wafer, etched into parts, sold to anyone who needs the world to talk to a computer. The margin is patient. The dividend is older than most of its rivals. And the fab keeps running.
      </p>

      <div class="takeaway-wafer reveal" data-delay="3">${S.sceneClosingMark()}</div>

      <div class="colophon">
        <span>TXN · NASDAQ</span>
        <span>FY '25 · Recap</span>
      </div>
    </section>
  `;

  document.getElementById('app').innerHTML = html;

  /* ---------- Scroll progress ---------- */
  const fill = document.getElementById('scroll-fill');
  function updateProgress(){
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0;
    fill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));

  /* ---------- Counter count-ups ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const counterIO = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      counterIO.unobserve(el);
      const target = parseInt(el.dataset.counter, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function fmt(n){
        if (target >= 1000) return n.toLocaleString();
        return String(n);
      }
      function tick(now){
        const t = Math.min(1, (now - start) / dur);
        // ease out
        const eased = 1 - Math.pow(1 - t, 3);
        const v = Math.round(target * eased);
        el.textContent = fmt(v) + (t === 1 ? suffix : '');
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target) + suffix;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Hero wafer scroll-driven rotation + die light-up ---------- */
  const wafer = document.querySelector('#wafer-hero');
  if (wafer){
    const dieEls = wafer.querySelectorAll('.die');
    // Pre-pick a coral subset (~14% of dies) for progressive light-up
    const coralOrder = [];
    dieEls.forEach((el, i) => coralOrder.push(i));
    // shuffle (deterministic) for organic spread
    for (let i = coralOrder.length - 1; i > 0; i--){
      const j = Math.floor(((i*73 + 17) % (i+1)));
      [coralOrder[i], coralOrder[j]] = [coralOrder[j], coralOrder[i]];
    }
    const litCount = Math.round(dieEls.length * 0.16);
    const litSet = new Set(coralOrder.slice(0, litCount));

    function onScrollWafer(){
      const stage = document.getElementById('wafer-stage');
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when off below, 1 when fully scrolled past
      const t = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const angle = t * 14 - 7; // -7 → +7 deg
      wafer.style.transform = `rotate(${angle}deg)`;
      wafer.style.transition = 'transform 80ms linear';
      // light up coral dies progressively
      const litN = Math.round(litCount * t);
      let count = 0;
      coralOrder.forEach((idx) => {
        const el = dieEls[idx];
        if (!el) return;
        if (count < litN) {
          el.setAttribute('fill', '#F25A37');
          el.setAttribute('fill-opacity', '0.85');
        } else {
          el.setAttribute('fill', '#1F1B14');
          el.setAttribute('fill-opacity', '0');
        }
        count++;
      });
    }
    window.addEventListener('scroll', onScrollWafer, {passive:true});
    onScrollWafer();
  }

  /* ---------- Rivals tap-to-expand ---------- */
  document.querySelectorAll('.rival').forEach(r => {
    r.addEventListener('click', () => {
      const open = r.getAttribute('aria-expanded') === 'true';
      r.setAttribute('aria-expanded', open ? 'false' : 'true');
      const showSpan = r.querySelector('.rival-toggle .show');
      if (showSpan) showSpan.textContent = open ? 'Tap to read' : 'Tap to close';
    });
  });

})();

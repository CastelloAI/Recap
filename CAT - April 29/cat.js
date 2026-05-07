/* ============================================================
   CAT · Recap — bespoke SVG scenes + scroll choreography
   ============================================================ */
(() => {
  const data = JSON.parse(document.getElementById('cat-data').textContent);
  const page = document.getElementById('page');

  /* ---------- helpers ---------- */
  const el = (tag, attrs = {}, kids = []) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    (Array.isArray(kids) ? kids : [kids]).forEach(c => {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  };
  const html = s => { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; };

  /* ============================================================
     BEAT 1 — HERO  "100 years moving the earth."
     Scene: a track-tread laying itself out, terrain underneath
     ============================================================ */
  const hero = html(`
    <section class="beat hero">
      <p class="eyebrow"><span class="dot"></span><span>Chapter 01</span><span class="num">· The thesis</span></p>

      <div class="heroSvg">
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="#F1ECDF"/>
              <stop offset="1" stop-color="#E2D6B5"/>
            </linearGradient>
            <linearGradient id="dirt" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="#8C7A55"/>
              <stop offset="1" stop-color="#5A4D33"/>
            </linearGradient>
            <pattern id="grain" width="3" height="3" patternUnits="userSpaceOnUse">
              <rect width="3" height="3" fill="transparent"/>
              <circle cx="1" cy="1" r="0.4" fill="#14110D" opacity="0.05"/>
            </pattern>
          </defs>
          <!-- sky / haze -->
          <rect width="400" height="140" fill="url(#sky)"/>
          <rect width="400" height="140" fill="url(#grain)"/>
          <!-- distant ridge -->
          <path d="M0 120 Q60 96 130 110 T260 100 T400 112 V140 H0 Z" fill="#C9BEA3" opacity="0.7"/>
          <!-- foreground earth (dirt) -->
          <path d="M0 145 Q40 132 110 138 Q190 144 260 132 Q330 122 400 138 V220 H0 Z" fill="url(#dirt)"/>
          <rect x="0" y="145" width="400" height="75" fill="url(#grain)"/>
          <!-- treads laid like punctuation -->
          <g id="treads" transform="translate(20, 168)">
            <!-- 24 cleats -->
          </g>
          <!-- sun disc -->
          <circle cx="320" cy="48" r="22" fill="#FFCD11" opacity="0.9"/>
          <circle cx="320" cy="48" r="34" fill="#FFCD11" opacity="0.18"/>
        </svg>
      </div>

      <h1 class="display">
        100 years<br/>
        moving<br/>
        <em class="cat-mark">the earth.</em>
      </h1>

      <div style="margin-top:22px;">
        <p class="body">
          A century ago, two tractor companies merged in California. Today, <em>Caterpillar</em> sells <span class="hi">$67.59B</span> of yellow iron, turbines, and torque a year — and is worth <span class="hi">$369.74B</span> doing it.
        </p>
      </div>

      <div class="meta-row">
        <div class="item">
          <div class="v"><em style="font-style:italic">1925</em></div>
          <div class="l">Founded</div>
        </div>
        <div class="item">
          <div class="v">109k</div>
          <div class="l">Employees</div>
        </div>
        <div class="item">
          <div class="v">7</div>
          <div class="l">Continents</div>
        </div>
      </div>
    </section>
  `);
  // build the tread cleats
  const treads = hero.querySelector('#treads');
  for (let i = 0; i < 24; i++) {
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r.setAttribute('x', i * 15);
    r.setAttribute('y', 0);
    r.setAttribute('width', 11);
    r.setAttribute('height', 12);
    r.setAttribute('rx', 2);
    r.setAttribute('fill', '#14110D');
    r.setAttribute('class', 'tread-cleat');
    r.style.transform = 'translateY(20px)';
    r.style.opacity = '0';
    r.style.transition = `opacity 500ms ease, transform 500ms cubic-bezier(0.22,1,0.36,1) ${i * 30}ms`;
    treads.appendChild(r);
  }
  page.appendChild(hero);

  /* ============================================================
     RESET BEAT — bridging into the business
     ============================================================ */
  page.appendChild(html(`
    <div class="reset">
      <div class="marker">Interlude · I</div>
      <p class="interlude">
        The work isn't selling tractors. The work is <span class="accent">selling motion</span> — the kind that breaks ground, lifts ore, and keeps the lights on when the grid can't.
      </p>
    </div>
  `));

  /* ============================================================
     BEAT 2 — THE BUSINESS
     Three machines, sized by revenue: Power & Energy (turbine),
     Construction (excavator), Resource (mining truck), Financial (gear)
     ============================================================ */
  const segs = data.segments;
  const segMax = Math.max(...segs.map(s => s.rev));
  const business = html(`
    <section class="beat business">
      <p class="eyebrow"><span class="dot"></span><span>Chapter 02</span><span class="num">· How it makes money</span></p>
      <h2 class="display">Four engines.<br/><em class="italic">One company.</em></h2>
      <p class="body" style="margin-top: 14px;">
        Revenue runs through four channels. The biggest no longer wears yellow paint — it wears <em>turbines</em>. Power & Energy now outsizes Construction by <span class="hi">$11B</span>.
      </p>
      <div class="machines"></div>
    </section>
  `);
  const machinesEl = business.querySelector('.machines');

  function turbineSVG(scale) {
    return `
      <svg class="machineSvg" viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- ground line -->
        <line x1="0" y1="118" x2="400" y2="118" stroke="#14110D" stroke-width="1" opacity="0.3"/>
        <g transform="translate(${50}, 0) scale(${scale})">
          <!-- turbine housing -->
          <rect x="100" y="58" width="170" height="54" rx="6" fill="#FFCD11"/>
          <rect x="100" y="58" width="170" height="6" fill="#14110D"/>
          <rect x="100" y="106" width="170" height="6" fill="#14110D"/>
          <!-- intake -->
          <circle cx="98" cy="85" r="26" fill="#14110D"/>
          <g transform="translate(98 85)">
            <g class="rotor">
              ${Array.from({length: 8}).map((_,i) => `<rect x="-2" y="-22" width="4" height="22" rx="1" fill="#E5B500" transform="rotate(${i*45})"/>`).join('')}
              <circle r="6" fill="#FFCD11"/>
              <circle r="2" fill="#14110D"/>
            </g>
          </g>
          <!-- exhaust stack -->
          <rect x="262" y="40" width="14" height="40" fill="#3F3A30"/>
          <rect x="258" y="34" width="22" height="8" fill="#3F3A30"/>
          <!-- panel lines -->
          <line x1="160" y1="58" x2="160" y2="112" stroke="#14110D" stroke-width="1" opacity="0.6"/>
          <line x1="210" y1="58" x2="210" y2="112" stroke="#14110D" stroke-width="1" opacity="0.6"/>
          <!-- legs -->
          <rect x="120" y="112" width="6" height="10" fill="#14110D"/>
          <rect x="244" y="112" width="6" height="10" fill="#14110D"/>
        </g>
      </svg>
    `;
  }
  function excavatorSVG(scale) {
    return `
      <svg class="machineSvg" viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="0" y1="118" x2="400" y2="118" stroke="#14110D" stroke-width="1" opacity="0.3"/>
        <g transform="translate(${50}, 0) scale(${scale})">
          <!-- track -->
          <rect x="80" y="100" width="180" height="14" rx="7" fill="#14110D"/>
          <g fill="#3F3A30">
            ${Array.from({length: 14}).map((_,i) => `<rect x="${88+i*12}" y="103" width="3" height="8"/>`).join('')}
          </g>
          <!-- cab -->
          <rect x="160" y="60" width="60" height="42" rx="3" fill="#FFCD11"/>
          <rect x="166" y="66" width="22" height="20" rx="1" fill="#1f2429" opacity="0.85"/>
          <rect x="160" y="60" width="60" height="4" fill="#14110D"/>
          <!-- counterweight -->
          <rect x="220" y="68" width="16" height="34" rx="2" fill="#14110D"/>
          <!-- boom -->
          <path d="M165 84 L120 50 L108 56 L155 92 Z" fill="#FFCD11" stroke="#14110D" stroke-width="1.5"/>
          <!-- stick + bucket -->
          <path d="M120 50 L80 70 L72 64 L116 42 Z" fill="#FFCD11" stroke="#14110D" stroke-width="1.5"/>
          <path d="M76 66 L62 78 L62 88 L78 84 Z" fill="#14110D"/>
          <line x1="62" y1="88" x2="78" y2="86" stroke="#FFCD11" stroke-width="1"/>
          <!-- pin -->
          <circle cx="165" cy="84" r="3" fill="#14110D"/>
          <circle cx="120" cy="50" r="3" fill="#14110D"/>
        </g>
      </svg>
    `;
  }
  function dumptruckSVG(scale) {
    return `
      <svg class="machineSvg" viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="0" y1="118" x2="400" y2="118" stroke="#14110D" stroke-width="1" opacity="0.3"/>
        <g transform="translate(${50}, 0) scale(${scale})">
          <!-- bed -->
          <path d="M70 50 L240 50 L260 90 L60 90 Z" fill="#FFCD11" stroke="#14110D" stroke-width="1.5"/>
          <path d="M70 50 L240 50 L240 60 L70 60 Z" fill="#E5B500"/>
          <!-- cab -->
          <rect x="245" y="68" width="32" height="26" rx="2" fill="#FFCD11" stroke="#14110D" stroke-width="1.5"/>
          <rect x="252" y="72" width="18" height="14" rx="1" fill="#1f2429" opacity="0.85"/>
          <!-- chassis -->
          <rect x="60" y="90" width="220" height="10" fill="#14110D"/>
          <!-- wheels -->
          <circle cx="100" cy="106" r="14" fill="#14110D"/>
          <circle cx="100" cy="106" r="6" fill="#3F3A30"/>
          <circle cx="180" cy="106" r="14" fill="#14110D"/>
          <circle cx="180" cy="106" r="6" fill="#3F3A30"/>
          <circle cx="258" cy="106" r="11" fill="#14110D"/>
          <circle cx="258" cy="106" r="5" fill="#3F3A30"/>
          <!-- ore -->
          <path d="M82 50 Q120 38 160 44 Q200 36 232 50 Z" fill="#5A4D33"/>
          <circle cx="110" cy="42" r="3" fill="#3F3A30"/>
          <circle cx="150" cy="40" r="2.5" fill="#3F3A30"/>
          <circle cx="190" cy="42" r="3" fill="#3F3A30"/>
        </g>
      </svg>
    `;
  }
  function ledgerSVG(scale) {
    return `
      <svg class="machineSvg" viewBox="0 0 400 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="0" y1="100" x2="400" y2="100" stroke="#14110D" stroke-width="1" opacity="0.3"/>
        <g transform="translate(${110}, 0) scale(${scale})">
          <!-- briefcase / ledger -->
          <rect x="80" y="40" width="160" height="60" rx="4" fill="#3F3A30"/>
          <rect x="80" y="40" width="160" height="8" fill="#14110D"/>
          <!-- handle -->
          <path d="M140 40 L140 28 Q140 22 146 22 L174 22 Q180 22 180 28 L180 40" fill="none" stroke="#14110D" stroke-width="3"/>
          <!-- yellow stripe (CAT signal) -->
          <rect x="80" y="62" width="160" height="6" fill="#FFCD11"/>
          <!-- locks -->
          <rect x="100" y="74" width="14" height="10" rx="1" fill="#FFCD11"/>
          <rect x="206" y="74" width="14" height="10" rx="1" fill="#FFCD11"/>
        </g>
      </svg>
    `;
  }
  const renderers = { 'Power & Energy': turbineSVG, 'Construction': excavatorSVG, 'Resource Industries': dumptruckSVG, 'Financial Products': ledgerSVG };
  segs.forEach(s => {
    const sc = 0.55 + 0.55 * (s.rev / segMax);
    const node = html(`
      <div class="machine reveal">
        ${renderers[s.name](sc)}
        <div class="row">
          <span class="nm">${s.name}</span>
          <span class="rv">$${s.rev.toFixed(1)}<span class="u">B</span></span>
        </div>
        <div class="nt">${s.note}</div>
      </div>
    `);
    machinesEl.appendChild(node);
  });
  page.appendChild(business);

  /* ============================================================
     BEAT 3 — THE SCALE
     Big-number stack + a small "century" timeline
     ============================================================ */
  const scale = html(`
    <section class="beat">
      <p class="eyebrow"><span class="dot"></span><span>Chapter 03</span><span class="num">· The scale</span></p>
      <h2 class="display"><em>Big</em> in the<br/>way iron is big.</h2>
      <p class="body" style="margin-top: 14px;">
        A market cap larger than the GDP of most countries. A dealer network on every continent. Margins that hold across cycles — <em>33.8%</em> gross, <em>16.5%</em> operating.
      </p>

      <div class="scale-stack">
        <div class="row reveal">
          <span class="v italic count" data-target="369.74" data-decimals="2">$0<span class="u">B</span></span>
          <span class="l">Market cap. Among the largest <em>industrials</em> in America.</span>
        </div>
        <div class="row reveal">
          <span class="v count" data-target="67.59" data-decimals="2">$0<span class="u">B</span></span>
          <span class="l">FY '25 revenue. <em>All-time</em> Q4 record at $19.13B.</span>
        </div>
        <div class="row reveal">
          <span class="v count" data-target="109" data-suffix="k">0<span class="u">people</span></span>
          <span class="l">On every continent. One of the largest independent dealer networks in the world.</span>
        </div>
        <div class="row reveal">
          <span class="v italic">100<span class="u">years</span></span>
          <span class="l">Founded <em>1925</em>. Centennial in 2025. Still here.</span>
        </div>
      </div>

      <div class="century">
        <svg viewBox="0 0 400 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="20" y1="60" x2="380" y2="60" stroke="#14110D" stroke-width="1.5"/>
          <!-- decade ticks -->
          ${Array.from({length: 11}).map((_, i) => {
            const x = 20 + i * 36;
            const major = i % 5 === 0;
            return `<line x1="${x}" y1="${major ? 50 : 54}" x2="${x}" y2="${major ? 70 : 66}" stroke="#14110D" stroke-width="${major ? 1.5 : 1}"/>`;
          }).join('')}
          <!-- 1925 marker -->
          <text x="20" y="42" font-family="Geist Mono" font-size="9" fill="#14110D" text-anchor="middle">1925</text>
          <!-- 2025 marker (centennial) -->
          <text x="380" y="42" font-family="Geist Mono" font-size="9" fill="#14110D" text-anchor="middle">2025</text>
          <!-- centennial flag -->
          <circle cx="380" cy="60" r="6" fill="#FFCD11" stroke="#14110D" stroke-width="1.5"/>
          <text x="380" y="92" font-family="Instrument Serif" font-style="italic" font-size="13" fill="#14110D" text-anchor="middle">centennial</text>
        </svg>
      </div>
    </section>
  `);
  page.appendChild(scale);

  /* ============================================================
     RESET BEAT — into the costs
     ============================================================ */
  page.appendChild(html(`
    <div class="reset">
      <div class="marker">Interlude · II</div>
      <p class="interlude">
        Every dollar that arrives has to <span class="accent">get through the dirt</span> first. Steel, labor, freight, the cost of building things heavy enough to break other things.
      </p>
    </div>
  `));

  /* ============================================================
     BEAT 4 — STRATA (cost breakdown)
     A cross-section of earth: COGS is the deepest, thickest layer.
     Honors the supplied hex colors.
     ============================================================ */
  const costs = data.costs;
  // we lay them as horizontal strata, top = paper margin, bottom = bedrock
  const strataHeight = 320;
  const totalPct = 100;
  // build strata bands proportional to pct, with the rest (100-sum) as "what survives"
  const sumCost = costs.reduce((a,b) => a + b.pct, 0);
  const survives = 100 - sumCost; // 23 — net + tax
  // we'll show: thin paper strip (revenue), then strata from each cost, then bedrock = survives
  const strataBeat = html(`
    <section class="beat">
      <p class="eyebrow"><span class="dot"></span><span>Chapter 04</span><span class="num">· Where the money goes</span></p>
      <h2 class="display">A dollar in.<br/><em>Strata</em> below.</h2>
      <p class="body" style="margin-top: 14px;">
        Cost of revenue is the bedrock — <em>$0.66</em> of every dollar. Above it, the thinner crusts of operating overhead. Below: <em>what survives</em>.
      </p>

      <div class="strata-wrap">
        <svg class="strata-svg" viewBox="0 0 400 ${strataHeight + 60}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="g2" width="3" height="3" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.4" fill="#14110D" opacity="0.06"/>
            </pattern>
          </defs>

          <!-- "$1" label up top -->
          <text x="20" y="22" font-family="Instrument Serif" font-style="italic" font-size="20" fill="#14110D">A dollar arrives.</text>
          <line x1="20" y1="32" x2="380" y2="32" stroke="#14110D" stroke-width="1"/>

          <g id="strata" transform="translate(0, 36)">
            <!-- bands generated below -->
          </g>

          <!-- ground arrow -->
          <line x1="22" y1="36" x2="22" y2="${36 + strataHeight}" stroke="#14110D" stroke-width="1"/>
          <polygon points="22,${36 + strataHeight + 6} 18,${36 + strataHeight - 1} 26,${36 + strataHeight - 1}" fill="#14110D"/>
          <text x="32" y="${36 + strataHeight + 4}" font-family="Geist Mono" font-size="9" letter-spacing="2" fill="#14110D">DEEPER</text>
        </svg>
      </div>

      <div class="strata-legend"></div>

      <div class="survives reveal">
        <div class="l">What survives — the bedrock</div>
        <div class="v"><em>${survives}</em><span class="u">¢</span></div>
        <div class="c">per dollar of revenue, before tax.</div>
      </div>
    </section>
  `);
  page.appendChild(strataBeat);

  // build strata bands
  const stratagrp = strataBeat.querySelector('#strata');
  let yc = 0;
  const allBands = [...costs, { pct: survives, color: '#14110D', label: 'What survives', _final: true }];
  allBands.forEach((b, i) => {
    const h = (b.pct / totalPct) * strataHeight;
    const grp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // band rect
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', 60); rect.setAttribute('y', yc);
    rect.setAttribute('width', 320); rect.setAttribute('height', h);
    rect.setAttribute('fill', b.color);
    if (b._final) rect.setAttribute('fill', '#14110D');
    grp.appendChild(rect);
    // grain overlay
    const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    overlay.setAttribute('x', 60); overlay.setAttribute('y', yc);
    overlay.setAttribute('width', 320); overlay.setAttribute('height', h);
    overlay.setAttribute('fill', 'url(#g2)');
    grp.appendChild(overlay);
    // top hairline
    const top = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    top.setAttribute('x1', 60); top.setAttribute('x2', 380);
    top.setAttribute('y1', yc); top.setAttribute('y2', yc);
    top.setAttribute('stroke', '#14110D'); top.setAttribute('stroke-width', 0.6); top.setAttribute('opacity', 0.25);
    grp.appendChild(top);
    // pct label inside band (right side)
    if (h >= 16) {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', 372); t.setAttribute('y', yc + h/2 + 4);
      t.setAttribute('text-anchor', 'end');
      t.setAttribute('font-family', 'Instrument Serif');
      t.setAttribute('font-size', Math.min(28, Math.max(13, h * 0.55)));
      t.setAttribute('font-style', 'italic');
      t.setAttribute('fill', b._final ? '#FFCD11' : '#14110D');
      t.textContent = `${b.pct}¢`;
      grp.appendChild(t);
    }
    // label outside on the left
    const lab = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lab.setAttribute('x', 52); lab.setAttribute('y', yc + Math.min(h / 2 + 4, 14));
    lab.setAttribute('text-anchor', 'end');
    lab.setAttribute('font-family', 'Geist Mono');
    lab.setAttribute('font-size', 9);
    lab.setAttribute('letter-spacing', 1.2);
    lab.setAttribute('fill', '#14110D');
    lab.textContent = b.label.toUpperCase();
    grp.appendChild(lab);

    // little tick from label to band
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    tick.setAttribute('x1', 54); tick.setAttribute('x2', 60);
    tick.setAttribute('y1', yc + Math.min(h/2, 10)); tick.setAttribute('y2', yc + Math.min(h/2, 10));
    tick.setAttribute('stroke', '#14110D');
    tick.setAttribute('stroke-width', 0.8);
    grp.appendChild(tick);

    stratagrp.appendChild(grp);
    yc += h;
  });

  // legend
  const legend = strataBeat.querySelector('.strata-legend');
  costs.forEach(c => {
    legend.appendChild(html(`
      <div class="item">
        <span class="sw" style="background:${c.color}"></span>
        <span class="lb">${c.label}</span>
        <span class="pc">${c.pct}%</span>
      </div>
    `));
  });
  legend.appendChild(html(`
    <div class="item">
      <span class="sw" style="background:#14110D"></span>
      <span class="lb"><em style="font-family:'Instrument Serif';font-style:italic">What survives</em></span>
      <span class="pc">${survives}%</span>
    </div>
  `));

  /* ============================================================
     BEAT 5 — FOOTPRINT
     A "world rolled flat" — the four regions sized as poured concrete blocks
     ============================================================ */
  const geo = data.geo;
  const geoBeat = html(`
    <section class="beat">
      <p class="eyebrow"><span class="dot"></span><span>Chapter 05</span><span class="num">· The footprint</span></p>
      <h2 class="display">North America<br/>does <em>more than half</em>.</h2>
      <p class="body" style="margin-top: 14px;">
        Headquartered in Irving. Sold everywhere. Yellow iron arrives where there's earth to move — and most of that, still, is here.
      </p>

      <div class="geo-wrap">
        <svg class="geo-svg" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#14110D" stroke-width="0.4" opacity="0.15"/>
            </pattern>
          </defs>
          <!-- 4 stacked horizontal blocks, widths proportional to pct -->
          <g id="geoblocks"></g>
        </svg>
      </div>

      <div class="geo-legend"></div>
    </section>
  `);
  page.appendChild(geoBeat);

  // build geo blocks: each is a rectangle of width = pct * 3.5, with regional silhouettes hinted
  const blocksGrp = geoBeat.querySelector('#geoblocks');
  const blockH = 42;
  const gap = 10;
  const xOrigin = 20;
  const maxW = 360;
  const colors = ['#14110D', '#3F3A30', '#6B6357', '#A4998A'];
  geo.forEach((g, i) => {
    const w = (g.pct / 100) * maxW;
    const y = i * (blockH + gap);
    const grp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // shadow
    const sh = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    sh.setAttribute('x', xOrigin + 2); sh.setAttribute('y', y + 4);
    sh.setAttribute('width', w); sh.setAttribute('height', blockH);
    sh.setAttribute('fill', '#14110D'); sh.setAttribute('opacity', 0.12);
    grp.appendChild(sh);
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r.setAttribute('x', xOrigin); r.setAttribute('y', y);
    r.setAttribute('width', w); r.setAttribute('height', blockH);
    r.setAttribute('fill', colors[i]);
    grp.appendChild(r);
    const hatch = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hatch.setAttribute('x', xOrigin); hatch.setAttribute('y', y);
    hatch.setAttribute('width', w); hatch.setAttribute('height', blockH);
    hatch.setAttribute('fill', 'url(#hatch)');
    grp.appendChild(hatch);
    // hi-vis stripe at top — CAT signal
    if (i === 0) {
      const stripe = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      stripe.setAttribute('x', xOrigin); stripe.setAttribute('y', y);
      stripe.setAttribute('width', w); stripe.setAttribute('height', 4);
      stripe.setAttribute('fill', '#FFCD11');
      grp.appendChild(stripe);
    }
    // pct label inside if room
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', xOrigin + 12); t.setAttribute('y', y + blockH / 2 + 8);
    t.setAttribute('font-family', 'Instrument Serif');
    t.setAttribute('font-style', 'italic');
    t.setAttribute('font-size', 24);
    t.setAttribute('fill', i === 0 ? '#FFCD11' : '#F1ECDF');
    t.textContent = `${g.pct}%`;
    grp.appendChild(t);
    // region label outside if too narrow, inside otherwise
    if (w > 160) {
      const lab = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lab.setAttribute('x', xOrigin + w - 12); lab.setAttribute('y', y + blockH / 2 + 5);
      lab.setAttribute('text-anchor', 'end');
      lab.setAttribute('font-family', 'Geist Mono');
      lab.setAttribute('font-size', 10);
      lab.setAttribute('letter-spacing', 1.4);
      lab.setAttribute('fill', i === 0 ? '#F1ECDF' : '#F1ECDF');
      lab.setAttribute('opacity', 0.85);
      lab.textContent = g.region.toUpperCase();
      grp.appendChild(lab);
    } else {
      const lab = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lab.setAttribute('x', xOrigin + w + 8); lab.setAttribute('y', y + blockH / 2 + 5);
      lab.setAttribute('font-family', 'Geist Mono');
      lab.setAttribute('font-size', 10);
      lab.setAttribute('letter-spacing', 1.4);
      lab.setAttribute('fill', '#14110D');
      lab.textContent = g.region.toUpperCase();
      grp.appendChild(lab);
    }
    blocksGrp.appendChild(grp);
  });
  // adjust svg height
  const totalH = geo.length * (blockH + gap);
  geoBeat.querySelector('.geo-svg').setAttribute('viewBox', `0 0 400 ${totalH + 6}`);

  // legend rows
  const geoLeg = geoBeat.querySelector('.geo-legend');
  geo.forEach(g => {
    geoLeg.appendChild(html(`
      <div class="row reveal">
        <span class="pc"><em style="font-style:italic">${g.pct}</em><span class="u">%</span></span>
        <span class="nm">${g.region}</span>
        <span class="bar"><i style="width:${g.pct}%"></i></span>
      </div>
    `));
  });

  /* ============================================================
     RESET BEAT — into the bet (DARK)
     ============================================================ */
  page.appendChild(html(`
    <div class="reset dark">
      <div class="marker">Interlude · III</div>
      <p class="interlude">
        Iron earns. <span class="accent">Iron pays.</span> Thirty straight years of dividend hikes — through booms, slumps, and a pandemic that shut the world's worksites.
      </p>
    </div>
  `));

  /* ============================================================
     BEAT 6 — THE BET (DARK)
     Capital allocation — gear ratchet metaphor, dividend rungs
     ============================================================ */
  const bet = html(`
    <section class="bet">
      <p class="eyebrow"><span class="dot"></span><span>Chapter 06</span><span class="num">· The bet</span></p>

      <h2 class="display">$<em>7.9B</em><br/>back to owners.</h2>
      <p class="body" style="margin-top: 14px;">
        $5.15B in buybacks, $2.75B in dividends. A <em>$20B+ open-ended</em> repurchase authorization sits behind the next turn of the gear. The <em>30-year</em> dividend streak holds.
      </p>

      <div class="gear-wrap">
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- big gear -->
          <g transform="translate(140 110)" class="gear-big">
            <g>
              ${(() => {
                const teeth = 16, R = 88, r = 72;
                let path = '';
                for (let i = 0; i < teeth; i++) {
                  const a = (i / teeth) * Math.PI * 2;
                  const a1 = a + Math.PI / teeth;
                  path += `${i === 0 ? 'M' : 'L'}${(R*Math.cos(a)).toFixed(2)} ${(R*Math.sin(a)).toFixed(2)} L${(R*Math.cos(a1)).toFixed(2)} ${(R*Math.sin(a1)).toFixed(2)} L${(r*Math.cos(a1+0.05)).toFixed(2)} ${(r*Math.sin(a1+0.05)).toFixed(2)} L${(r*Math.cos(a+Math.PI/teeth*2-0.05)).toFixed(2)} ${(r*Math.sin(a+Math.PI/teeth*2-0.05)).toFixed(2)}`;
                }
                return `<path d="${path}Z" fill="#FFCD11" stroke="#14110D" stroke-width="2"/>`;
              })()}
              <circle r="42" fill="#14110D"/>
              <circle r="42" fill="none" stroke="#FFCD11" stroke-width="1" opacity="0.4"/>
              <circle r="8" fill="#FFCD11"/>
              <text y="6" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="22" fill="#FFCD11">$7.9B</text>
              <text y="22" text-anchor="middle" font-family="Geist Mono" font-size="7" letter-spacing="2" fill="#FFCD11" opacity="0.7">RETURNED</text>
            </g>
          </g>
          <!-- small gear: $20B authorization -->
          <g transform="translate(310 80)" class="gear-small">
            <g>
              ${(() => {
                const teeth = 10, R = 38, r = 28;
                let path = '';
                for (let i = 0; i < teeth; i++) {
                  const a = (i / teeth) * Math.PI * 2;
                  const a1 = a + Math.PI / teeth;
                  path += `${i === 0 ? 'M' : 'L'}${(R*Math.cos(a)).toFixed(2)} ${(R*Math.sin(a)).toFixed(2)} L${(R*Math.cos(a1)).toFixed(2)} ${(R*Math.sin(a1)).toFixed(2)} L${(r*Math.cos(a1+0.08)).toFixed(2)} ${(r*Math.sin(a1+0.08)).toFixed(2)} L${(r*Math.cos(a+Math.PI/teeth*2-0.08)).toFixed(2)} ${(r*Math.sin(a+Math.PI/teeth*2-0.08)).toFixed(2)}`;
                }
                return `<path d="${path}Z" fill="none" stroke="#FFCD11" stroke-width="2"/>`;
              })()}
              <circle r="14" fill="none" stroke="#FFCD11" stroke-width="1.5"/>
              <text y="4" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="13" fill="#FFCD11">$20B+</text>
            </g>
          </g>
          <!-- belt connection -->
          <line x1="220" y1="78" x2="278" y2="64" stroke="#FFCD11" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
          <line x1="220" y1="138" x2="280" y2="100" stroke="#FFCD11" stroke-width="1" stroke-dasharray="3 3" opacity="0.5"/>
          <text x="306" y="120" text-anchor="middle" font-family="Geist Mono" font-size="8" letter-spacing="2" fill="#FFCD11" opacity="0.7">AUTH.</text>
        </svg>
      </div>

      <div class="stat-grid">
        <div class="cell">
          <div class="v">$5.15<span class="u">B</span></div>
          <div class="l">Buybacks</div>
        </div>
        <div class="cell">
          <div class="v">$2.75<span class="u">B</span></div>
          <div class="l">Dividends</div>
        </div>
        <div class="cell">
          <div class="v">$8.92<span class="u">B</span></div>
          <div class="l">Free cash flow</div>
        </div>
        <div class="cell">
          <div class="v">$2.82<span class="u">B</span></div>
          <div class="l">Capex</div>
        </div>
      </div>

      <p class="body" style="margin-top: 28px;">
        <em>Thirty consecutive years</em> of dividend increases. An <em>S&P 500 Dividend Aristocrat</em>. The ladder has only ever climbed.
      </p>

      <div class="dividend-rungs">
        <svg viewBox="0 0 400 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <!-- 30 rungs ascending -->
          <g id="rungs"></g>
          <text x="20" y="100" font-family="Geist Mono" font-size="9" fill="#F4F2ED" opacity="0.6" letter-spacing="2">'95</text>
          <text x="380" y="20" font-family="Geist Mono" font-size="9" fill="#FFCD11" letter-spacing="2" text-anchor="end">'25</text>
        </svg>
      </div>
    </section>
  `);
  // build dividend rungs
  const rungs = bet.querySelector('#rungs');
  const N = 30;
  for (let i = 0; i < N; i++) {
    const x = 22 + (i / (N-1)) * 356;
    const y = 90 - (i / (N-1)) * 70;
    const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y);
    r.setAttribute('width', 8); r.setAttribute('height', 6);
    r.setAttribute('rx', 1);
    r.setAttribute('fill', i === N-1 ? '#FFCD11' : '#F4F2ED');
    r.setAttribute('opacity', 0.3 + 0.7 * (i / (N-1)));
    rungs.appendChild(r);
  }
  page.appendChild(bet);

  /* ============================================================
     BEAT 7 — RIVALS
     ============================================================ */
  const rivBeat = html(`
    <section class="beat">
      <p class="eyebrow"><span class="dot"></span><span>Chapter 07</span><span class="num">· The competition</span></p>
      <h2 class="display">Three<br/><em>on the lot.</em></h2>
      <p class="body" style="margin-top: 14px;">
        Deere builds the green ones. Honeywell creeps in from the turbine side. Komatsu is the global counterweight, half a world away. CAT outsizes them all on market cap.
      </p>
      <div class="rivals"></div>
    </section>
  `);
  const rivWrap = rivBeat.querySelector('.rivals');

  function deereSVG() {
    return `
      <svg class="rivalSvg" viewBox="0 0 400 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="0" y1="80" x2="400" y2="80" stroke="#14110D" stroke-width="1" opacity="0.3"/>
        <g transform="translate(120, 0)">
          <!-- green tractor -->
          <rect x="40" y="40" width="80" height="32" rx="3" fill="#2C6B3A"/>
          <rect x="40" y="40" width="80" height="6" fill="#FFD700"/>
          <rect x="60" y="20" width="36" height="22" rx="2" fill="#2C6B3A"/>
          <rect x="64" y="24" width="28" height="14" rx="1" fill="#1f2429" opacity="0.7"/>
          <circle cx="56" cy="76" r="11" fill="#14110D"/>
          <circle cx="56" cy="76" r="5" fill="#3F3A30"/>
          <circle cx="108" cy="76" r="14" fill="#14110D"/>
          <circle cx="108" cy="76" r="6" fill="#3F3A30"/>
          <!-- exhaust -->
          <rect x="44" y="22" width="6" height="20" fill="#14110D"/>
        </g>
      </svg>
    `;
  }
  function honSVG() {
    return `
      <svg class="rivalSvg" viewBox="0 0 400 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="0" y1="80" x2="400" y2="80" stroke="#14110D" stroke-width="1" opacity="0.3"/>
        <g transform="translate(130, 0)">
          <!-- power station / generator stack -->
          <rect x="20" y="30" width="100" height="50" fill="#C9BEA3"/>
          <rect x="20" y="30" width="100" height="6" fill="#14110D"/>
          <rect x="36" y="14" width="14" height="20" fill="#3F3A30"/>
          <rect x="60" y="6" width="14" height="28" fill="#3F3A30"/>
          <rect x="84" y="14" width="14" height="20" fill="#3F3A30"/>
          <!-- red logo dot -->
          <circle cx="105" cy="56" r="5" fill="#D9362C"/>
          <text x="68" y="62" font-family="Geist Mono" font-size="9" fill="#14110D" text-anchor="middle" letter-spacing="2">POWER</text>
        </g>
      </svg>
    `;
  }
  function komSVG() {
    return `
      <svg class="rivalSvg" viewBox="0 0 400 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="0" y1="80" x2="400" y2="80" stroke="#14110D" stroke-width="1" opacity="0.3"/>
        <g transform="translate(140, 0)">
          <!-- blue komatsu loader -->
          <rect x="40" y="44" width="70" height="28" rx="3" fill="#1A5BBF"/>
          <rect x="60" y="28" width="28" height="18" rx="2" fill="#1A5BBF"/>
          <rect x="62" y="30" width="22" height="13" fill="#1f2429" opacity="0.7"/>
          <path d="M40 56 L20 60 L18 70 L40 70 Z" fill="#1A5BBF" stroke="#14110D" stroke-width="1"/>
          <circle cx="56" cy="76" r="10" fill="#14110D"/>
          <circle cx="100" cy="76" r="10" fill="#14110D"/>
        </g>
      </svg>
    `;
  }
  const rivRender = { 'Deere & Co': deereSVG, 'Honeywell': honSVG, 'Komatsu': komSVG };
  const catCap = data.marketCap;
  data.competitors.forEach(c => {
    const hasStats = c.cap != null;
    const ratio = hasStats ? Math.round((c.cap / catCap) * 100) : null;
    const node = html(`
      <div class="rival reveal">
        ${rivRender[c.name]()}
        <div class="head">
          <span class="nm">${c.name}</span>
          <span class="tk">${c.ticker}</span>
        </div>
        ${hasStats ? `
        <div class="stats">
          <div class="c"><div class="v">$${c.cap.toFixed(0)}<span style="font-size:11px;color:#5A5447;font-style:italic"> B</span></div><div class="l">Mkt cap</div></div>
          <div class="c"><div class="v">$${c.rev.toFixed(0)}<span style="font-size:11px;color:#5A5447;font-style:italic"> B</span></div><div class="l">Revenue</div></div>
          <div class="c"><div class="v ${c.yoy < 0 ? 'neg' : 'pos'}">${c.yoy > 0 ? '+' : ''}${c.yoy.toFixed(1)}<span style="font-size:11px;color:#5A5447;font-style:italic">%</span></div><div class="l">YoY</div></div>
        </div>
        <div class="vs-bar">
          <div class="label"><span>CAT $${catCap.toFixed(0)}B</span><span>${c.ticker} $${c.cap.toFixed(0)}B</span></div>
          <div class="track">
            <span class="cat-side" style="width:${(catCap / (catCap + c.cap)) * 100}%"></span>
            <span class="rv-side" style="width:${(c.cap / (catCap + c.cap)) * 100}%"></span>
          </div>
        </div>
        ` : `
        <div class="stats">
          <div class="c" style="grid-column: span 3"><div class="v" style="font-style:italic">Industrials sector.</div><div class="l">Global heavy equipment</div></div>
        </div>
        `}
        <p class="nt">${c.note}</p>
      </div>
    `);
    rivWrap.appendChild(node);
  });
  page.appendChild(rivBeat);

  /* ============================================================
     BEAT 8 — CLOSE
     Inverts the open: started at 100 years; closes at the bedrock survives
     ============================================================ */
  const close = html(`
    <section class="beat close">
      <p class="eyebrow"><span class="dot"></span><span>Chapter 08</span><span class="num">· The takeaway</span></p>

      <h2 class="display">
        100 years in.<br/>
        <em>The bill</em><br/>
        comes due in <span class="y">torque.</span>
      </h2>

      <p class="body" style="margin-top: 28px;">
        $67.59B in revenue arrives at the top. <em>Sixty-six cents</em> of every dollar gets spent on the iron and the labor and the freight. Eleven more on overhead. <em>Twenty-three cents</em> survive — and that's what funds the gear that pays the dividend that ratchets the streak.
      </p>

      <p class="body" style="margin-top: 18px;">
        A century ago: two tractor companies. Today: <em>$369.74B</em> of capitalized motion, <em>30 years</em> of rising payouts, and one <em>open-ended</em> $20B authorization waiting on the next turn.
      </p>

      <div class="signoff">
        <span class="l">END · CAT FY '25</span>
        <span class="ticker">CAT · NYSE</span>
      </div>

      <div class="tread-foot">
        <svg viewBox="0 0 400 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g fill="#14110D">
            ${Array.from({length: 28}).map((_,i) => `<rect x="${i*15}" y="14" width="11" height="14" rx="2"/>`).join('')}
          </g>
        </svg>
      </div>
    </section>
  `);
  page.appendChild(close);

  /* ============================================================
     SCROLL behavior
     ============================================================ */
  const progressEl = document.getElementById('progress');
  const onScroll = () => {
    const sc = window.scrollY;
    const max = (document.documentElement.scrollHeight - window.innerHeight);
    const p = max > 0 ? Math.min(100, (sc / max) * 100) : 0;
    progressEl.style.width = p + '%';

    // trigger tread laydown after scroll past hero start
    if (sc > 30 && !heroDone) {
      heroDone = true;
      hero.querySelectorAll('.tread-cleat').forEach(c => {
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      });
    }
  };
  let heroDone = false;
  window.addEventListener('scroll', onScroll, { passive: true });
  // kick on load
  setTimeout(() => {
    hero.querySelectorAll('.tread-cleat').forEach(c => {
      c.style.opacity = '1';
      c.style.transform = 'translateY(0)';
    });
  }, 200);

  // reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
        // count-up
        if (e.target.classList.contains('count') || e.target.querySelector?.('.count')) {
          const counters = e.target.classList.contains('count') ? [e.target] : e.target.querySelectorAll('.count');
          counters.forEach(animateCount);
        }
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach(n => io.observe(n));
  // also observe any .count on its own
  document.querySelectorAll('.count').forEach(n => io.observe(n));

  function animateCount(el) {
    if (el._counted) return;
    el._counted = true;
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0');
    const suffix = el.dataset.suffix || '';
    const prefix = el.textContent.startsWith('$') ? '$' : '';
    const unitMatch = el.querySelector('.u');
    const unitHTML = unitMatch ? unitMatch.outerHTML : '';
    const dur = 1200;
    const start = performance.now();
    function frame(t) {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = target * eased;
      el.firstChild && (el.firstChild.nodeType === 3) && el.removeChild(el.firstChild);
      el.innerHTML = prefix + v.toFixed(decimals) + suffix + unitHTML;
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  onScroll();
})();

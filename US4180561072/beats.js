// All beat content + SVG metaphor scenes assembled into the page.
(function() {
  const beats = document.getElementById('beats');

  // ---------- helpers ----------
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function add(node) {
    beats.appendChild(node);
    // register fade-on-view for beat & inner reveal targets
    node.classList.add('fade');
    window.__recap.register(node);
  }

  // ============================================================
  // 1. HERO  — Thesis
  // ============================================================
  const hero = el(`
    <section class="beat hero" data-beat="hero">
      <div>
        <div class="hero-meta">
          <span>NASDAQ · HAS</span>
          <span class="delta">FY ’25 · $4.70B revenue</span>
        </div>
        <h1 class="display">
          <span class="row1">Play,</span>
          <span class="row2">traded</span>
          <span class="row3">publicly.</span>
        </h1>
        <p class="hero-subline">
          Founded 1923 in Providence. One billion fans a year. A toy company
          that became <em class="italic" style="font-family:var(--font-display); color:var(--coral-500);">a games company</em> in plain sight.
        </p>
      </div>

      <div>
        <div class="hero-stat-strip">
          <div class="hero-stat">
            <div class="num"><span data-count="13.67" data-decimals="2" data-prefix="$" data-suffix="B">$0.00B</span></div>
            <span class="lab">Market cap</span>
          </div>
          <div class="hero-stat">
            <div class="num"><span data-count="4.70" data-decimals="2" data-prefix="$" data-suffix="B">$0.00B</span></div>
            <span class="lab">Revenue ’25</span>
          </div>
          <div class="hero-stat">
            <div class="num"><span data-count="103" data-decimals="0" data-suffix=" yrs">0 yrs</span></div>
            <span class="lab">Since 1923</span>
          </div>
        </div>
      </div>

      <div class="hero-die-wrap" aria-hidden="true">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dieGrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stop-color="#FFFCF5"/>
              <stop offset="1" stop-color="#EBE5D2"/>
            </linearGradient>
            <linearGradient id="dieFace" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stop-color="#E63946"/>
              <stop offset="1" stop-color="#B81E2C"/>
            </linearGradient>
          </defs>
          <g id="hero-die" transform="rotate(0 100 100)">
            <!-- tilted cube -->
            <g transform="translate(100 100)">
              <!-- top -->
              <polygon points="-50,-30 0,-58 50,-30 0,-2" fill="url(#dieGrad)" stroke="#1a1a1a" stroke-width="1.5"/>
              <!-- left -->
              <polygon points="-50,-30 -50,30 0,58 0,-2" fill="#D9D2BC" stroke="#1a1a1a" stroke-width="1.5"/>
              <!-- right (the red face — MTG/Transformers signal) -->
              <polygon points="50,-30 50,30 0,58 0,-2" fill="url(#dieFace)" stroke="#1a1a1a" stroke-width="1.5"/>
              <!-- pips on top: 5 -->
              <g fill="#1a1a1a">
                <circle cx="-26" cy="-30" r="3"/>
                <circle cx="26" cy="-30" r="3"/>
                <circle cx="0" cy="-44" r="3"/>
                <circle cx="-22" cy="-14" r="3"/>
                <circle cx="22" cy="-14" r="3"/>
              </g>
              <!-- pips on left (3) -->
              <g fill="#1a1a1a">
                <circle cx="-38" cy="-12" r="3"/>
                <circle cx="-25" cy="14" r="3"/>
                <circle cx="-12" cy="40" r="3"/>
              </g>
              <!-- pips on right (1, big white) -->
              <circle cx="25" cy="14" r="6" fill="#FFF8E8"/>
            </g>
          </g>
        </svg>
      </div>
    </section>
  `);
  add(hero);

  // ---------- reset 1 ----------
  add(el(`
    <section class="reset reset--cream">
      <em>One <span class="signal">company</span> sits behind Monopoly, Magic, Nerf, Transformers, Play-Doh, and Peppa Pig.</em>
    </section>
  `));

  // ============================================================
  // 2. THE BUSINESS — three segments
  // ============================================================
  const business = el(`
    <section class="beat beat--paper">
      <div class="eyebrow">Ch. 01 · Three tables, one shop</div>
      <h2 class="display" style="font-size:42px;">
        Hasbro plays <em class="signal">three games</em> for a living.
      </h2>
      <p class="lede mt-3">
        FY 2025 revenue split across <em>Wizards &amp; Digital</em>, <em>Consumer Products</em>,
        and <em>Entertainment</em>. One of them carried the year.
      </p>

      <div class="segments">
        <!-- Wizards -->
        <div class="segment">
          <div>
            <div class="seg-eyebrow">Segment · Wizards &amp; digital</div>
            <div class="seg-title">The card table.<br/><em style="font-style:italic; color:var(--coral-500);">Magic, D&amp;D, Monopoly Go!</em></div>
            <div class="seg-detail">
              Tabletop &amp; licensed digital. Magic: The Gathering and Dungeons &amp; Dragons own the segment;
              <em style="font-family:var(--font-display); font-style:italic; color:var(--coral-500);">Monopoly Go!</em> threw in $168M.
            </div>
            <div class="seg-bar-row">
              <span>YoY</span>
              <div class="seg-bar"><span data-fill="100%"></span></div>
              <span style="color:var(--has-green);">+45%</span>
            </div>
          </div>
          <div class="seg-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <!-- fanned cards -->
              <g transform="translate(50 56)">
                <g transform="rotate(-18) translate(-22 -30)">
                  <rect width="44" height="62" rx="4" fill="#1F2D5C" stroke="#0A0A0A" stroke-width="1.2"/>
                  <rect x="3" y="3" width="38" height="56" rx="2" fill="#E8B73B" opacity="0.18"/>
                  <circle cx="22" cy="31" r="9" fill="#E63946"/>
                </g>
                <g transform="rotate(0) translate(-22 -34)">
                  <rect width="44" height="62" rx="4" fill="#3B0A0A" stroke="#0A0A0A" stroke-width="1.2"/>
                  <path d="M22 12 L34 50 L10 50 Z" fill="#E63946"/>
                </g>
                <g transform="rotate(18) translate(-22 -30)">
                  <rect width="44" height="62" rx="4" fill="#143A28" stroke="#0A0A0A" stroke-width="1.2"/>
                  <circle cx="22" cy="31" r="11" fill="none" stroke="#E8B73B" stroke-width="2"/>
                  <circle cx="22" cy="31" r="5" fill="#E8B73B"/>
                </g>
              </g>
            </svg>
          </div>
        </div>

        <!-- Consumer Products -->
        <div class="segment">
          <div>
            <div class="seg-eyebrow">Segment · Consumer products</div>
            <div class="seg-title">The toy aisle.<br/><em style="font-style:italic; color:var(--ink-3);">Nerf, Transformers, Play-Doh</em></div>
            <div class="seg-detail">
              Physical toys &amp; games via mass retail. Slipped 4% — and absorbed a
              <em style="font-family:var(--font-display); font-style:italic; color:var(--coral-500);">$1.02B goodwill writedown</em> in Q2.
            </div>
            <div class="seg-bar-row">
              <span>YoY</span>
              <div class="seg-bar down"><span data-fill="14%"></span></div>
              <span style="color:var(--coral-600);">−4%</span>
            </div>
          </div>
          <div class="seg-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <!-- nerf-ish dart -->
              <g transform="translate(10 26) rotate(-12)">
                <rect x="0" y="14" width="62" height="14" rx="7" fill="#E8B73B"/>
                <circle cx="62" cy="21" r="9" fill="#E63946"/>
                <circle cx="62" cy="21" r="3" fill="#FFF8E8"/>
              </g>
              <!-- play-doh tub silhouette -->
              <g transform="translate(48 56)">
                <ellipse cx="20" cy="32" rx="22" ry="6" fill="#1F8A4C"/>
                <rect x="-2" y="8" width="44" height="26" rx="3" fill="#E63946"/>
                <ellipse cx="20" cy="8" rx="22" ry="6" fill="#F5C542"/>
              </g>
            </svg>
          </div>
        </div>

        <!-- Entertainment -->
        <div class="segment">
          <div>
            <div class="seg-eyebrow">Segment · Entertainment</div>
            <div class="seg-title">The licensing rights.<br/><em style="font-style:italic; color:var(--ink-3);">Film, TV, Peppa Pig</em></div>
            <div class="seg-detail">
              Family brands across film, TV, and licensing. Down 4% as Hasbro narrowed its in-house production footprint.
            </div>
            <div class="seg-bar-row">
              <span>YoY</span>
              <div class="seg-bar down"><span data-fill="14%"></span></div>
              <span style="color:var(--coral-600);">−4%</span>
            </div>
          </div>
          <div class="seg-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <!-- film reel -->
              <g transform="translate(50 50)">
                <circle r="28" fill="#1A1A1A"/>
                <circle r="6" fill="#FBFAF7"/>
                <g fill="#FBFAF7">
                  <circle cx="0" cy="-18" r="4"/>
                  <circle cx="0" cy="18" r="4"/>
                  <circle cx="-18" cy="0" r="4"/>
                  <circle cx="18" cy="0" r="4"/>
                  <circle cx="-13" cy="-13" r="3"/>
                  <circle cx="13" cy="13" r="3"/>
                  <circle cx="-13" cy="13" r="3"/>
                  <circle cx="13" cy="-13" r="3"/>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `);
  add(business);

  // reset 2
  add(el(`
    <section class="reset reset--cream">
      <em>One table grew <span class="signal">forty-five percent</span>.<br/>The other two went the other way.</em>
    </section>
  `));

  // ============================================================
  // 3. SCALE — count-ups + employees + footprint cloud
  // ============================================================
  const scale = el(`
    <section class="beat beat--paper2">
      <div class="eyebrow">Ch. 02 · The reach</div>
      <h2 class="display" style="font-size:42px;">
        <em class="signal">One billion</em> people<br/>touch this catalog<br/>each year.
      </h2>
      <p class="lede mt-3">
        Six continents. <em>8,100 employees.</em> A roster of brands that survived
        the 20th century, the mall, the recession, and the smartphone.
      </p>

      <div class="scale-grid">
        <div class="scale-cell">
          <div class="big"><span data-count="1" data-decimals="0">0</span><span class="unit">B+</span></div>
          <div class="lab">Fans reached annually</div>
          <div class="sub">Across physical, digital, film, TV, and licensed product.</div>
        </div>
        <div class="scale-cell">
          <div class="big"><span data-count="8.1" data-decimals="1">0.0</span><span class="unit">k</span></div>
          <div class="lab">Employees</div>
          <div class="sub">Across six continents; HQ moves Pawtucket → Boston by end of 2026.</div>
        </div>
        <div class="scale-cell">
          <div class="big"><span data-count="1.45" data-decimals="2" data-prefix="$" data-suffix="B">$0.00B</span></div>
          <div class="lab">Q4 ’25 revenue</div>
          <div class="sub">EPS of $1.51 in the quarter.</div>
        </div>
        <div class="scale-cell">
          <div class="big"><span data-count="103" data-decimals="0">0</span><span class="unit">yrs</span></div>
          <div class="lab">In business</div>
          <div class="sub">Founded by the Hassenfelds in Providence, 1923.</div>
        </div>
      </div>

      <div class="fan-cloud" aria-hidden="true">
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g id="fan-drift">
            ${Array.from({length: 80}, (_, i) => {
              const x = (i * 53) % 460 - 30;
              const y = ((i * 31) % 200);
              const r = 1 + (i % 3) * 0.7;
              const o = 0.18 + ((i * 11) % 70) / 200;
              const c = ['#E63946', '#1F8A4C', '#E8B73B', '#1F2D5C', '#FF7A57'][i % 5];
              return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o.toFixed(2)}"/>`;
            }).join('')}
          </g>
          <text x="20" y="180" font-family="Geist Mono, monospace" font-size="10" fill="#6B6A65" letter-spacing="2">
            EACH DOT · 12.5 MILLION FANS
          </text>
        </svg>
      </div>
    </section>
  `);
  add(scale);

  // ============================================================
  // 4. WHERE THE MONEY GOES — bills
  // ============================================================
  // Costs in supplied order (with their hex)
  const costs = [
    { pct: 28, color: "#4E79A7", label: "Cost of revenue", denom: "COR" },
    { pct: 26, color: "#F28E2B", label: "SG&A",            denom: "SGA" },
    { pct: 9,  color: "#59A14F", label: "Product dev (R&D)", denom: "RND" },
    { pct: 7,  color: "#E15759", label: "Royalties",       denom: "ROY" },
    { pct: 5,  color: "#B07AA1", label: "Amortization",    denom: "AMT" },
  ];
  const total = 28 + 26 + 9 + 7 + 5; // 75
  const billsHTML = costs.map((c, i) => {
    const stagger = i * 56;        // each bill 56px lower than the last
    const tilt = (i % 2 === 0 ? -2 : 2) + (i * 0.6);
    return `
      <div class="bill" style="
        background:${c.color};
        top:${stagger}px;
        transform: translate(-50%, 0) rotate(${tilt}deg);
        z-index:${10 - i};
      ">
        <span class="denom">$ HAS · ${c.denom}</span>
        <span class="pct">${c.pct}<span style="font-size:18px;vertical-align:super;">%</span></span>
        <span class="lab">${c.label}</span>
      </div>
    `;
  }).join('');

  const money = el(`
    <section class="beat beat--cream">
      <div class="eyebrow">Ch. 03 · A hundred cents in</div>
      <h2 class="display" style="font-size:42px;">
        Where every<br/>dollar lands<br/>on the way <em class="signal">out.</em>
      </h2>
      <p class="lede mt-3">
        Cost of revenue runs ~<em>27.6%</em>; the rest is the cost of being a brand —
        marketing the shelf, paying the IP holder, amortizing the deals already done.
      </p>

      <div class="bills-stack">
        ${billsHTML}
      </div>
      <div class="cost-foot">75¢ accounted · 25¢ to operating, interest, tax</div>
    </section>
  `);
  add(money);

  // ---------- reset 3 (transition into the dark beat) ----------
  add(el(`
    <section class="reset reset--cream">
      <em>Then the auditors found a billion dollars<br/><span class="signal">that wasn’t there.</span></em>
    </section>
  `));

  // ============================================================
  // 5. THE WEIGHT — dark beat: impairment + leverage
  // ============================================================
  const weight = el(`
    <section class="beat beat--ink beat-roomy">
      <div class="eyebrow">Ch. 04 · The bill</div>
      <h2 class="display" style="font-size:46px; color:var(--paper);">
        Q2 ’25:<br/>a non-cash<br/><em class="signal">writedown.</em>
      </h2>
      <p class="lede mt-3">
        A $1.02B goodwill impairment hit the Consumer Products segment —
        the difference between what Hasbro paid for past acquisitions and what the market
        now thinks they’re worth. <em style="font-family:var(--font-display); font-style:italic; color:var(--coral-300);">GAAP operating margin: 0.2%.</em>
      </p>

      <div class="weight-impair">
        <div class="num"><span class="minus">−</span><span data-count="1.02" data-decimals="2" data-prefix="$" data-suffix="B">$0.00B</span></div>
        <div class="lab">Goodwill impaired · Consumer Products</div>
      </div>

      <div style="margin-top:48px;">
        <div class="eyebrow" style="color: var(--coral-300);">And the balance sheet</div>
        <h3 class="display" style="font-size:32px; color:var(--paper);">
          Debt <em class="signal">outweighs</em> equity<br/>nearly five to one.
        </h3>
      </div>

      <div class="scale-svg-wrap" aria-hidden="true">
        <svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg">
          <!-- post -->
          <line x1="160" y1="40" x2="160" y2="200" stroke="#F4EFD8" stroke-width="2"/>
          <circle cx="160" cy="36" r="4" fill="#F4EFD8"/>
          <!-- beam tilted toward debt (left) -->
          <g transform="rotate(14 160 50)">
            <line x1="40" y1="50" x2="280" y2="50" stroke="#F4EFD8" stroke-width="2.5"/>
            <line x1="60" y1="50" x2="60" y2="100" stroke="#F4EFD8" stroke-width="1"/>
            <line x1="260" y1="50" x2="260" y2="100" stroke="#F4EFD8" stroke-width="1"/>
            <!-- debt pan (heavy) -->
            <g transform="translate(60 100)">
              <ellipse cx="0" cy="0" rx="44" ry="8" fill="#FF7A57"/>
              <rect x="-44" y="0" width="88" height="36" fill="#FF7A57"/>
              <ellipse cx="0" cy="36" rx="44" ry="8" fill="#D6411F"/>
              <text x="0" y="22" text-anchor="middle" font-family="Instrument Serif" font-style="italic" fill="#1A1A1A" font-size="20">$2.77B</text>
            </g>
            <!-- equity pan (light) -->
            <g transform="translate(260 100)">
              <ellipse cx="0" cy="0" rx="28" ry="5" fill="#F4EFD8"/>
              <rect x="-28" y="0" width="56" height="20" fill="#F4EFD8"/>
              <ellipse cx="0" cy="20" rx="28" ry="5" fill="#C9C6BF"/>
              <text x="0" y="14" text-anchor="middle" font-family="Instrument Serif" font-style="italic" fill="#1A1A1A" font-size="13">$565M</text>
            </g>
          </g>
          <!-- base -->
          <rect x="120" y="200" width="80" height="6" rx="2" fill="#F4EFD8"/>
        </svg>
      </div>
      <div class="scale-legend">
        <div>Debt<span class="v heavy">$2.77B</span></div>
        <div style="text-align:right;">Equity<span class="v">$565M</span></div>
      </div>

      <p class="lede" style="margin-top:36px; color:rgba(244,242,237,0.7);">
        Cash &amp; equivalents <em style="color:var(--coral-300); font-family: var(--font-display);">$776.6M.</em>
        Goodwill &amp; intangibles dropped to $1.73B from $2.80B a year prior — most of the gap is the writedown.
      </p>
    </section>
  `);
  add(weight);

  // reset 4
  add(el(`
    <section class="reset reset--ink">
      <em>And yet — <span class="signal">cash kept coming.</span></em>
    </section>
  `));

  // ============================================================
  // 6. THE FOOTPRINT
  // ============================================================
  const geo = [
    { pct: 55, region: "North America",  color: "#E63946" },
    { pct: 25, region: "Europe",         color: "#1F8A4C" },
    { pct: 12, region: "Asia Pacific",   color: "#E8B73B" },
    { pct: 8,  region: "Latin America",  color: "#7B71F5" },
  ];

  const footprint = el(`
    <section class="beat beat--paper">
      <div class="eyebrow">Ch. 05 · The shelf, mapped</div>
      <h2 class="display" style="font-size:42px;">
        Mostly <em class="signal">domestic.</em><br/>The world buys<br/>the rest.
      </h2>
      <p class="lede mt-3">
        North America still takes the lion’s share of revenue;
        Europe is steady; Asia-Pac and Latin America are the runways.
      </p>

      <div class="footprint-globe">
        <svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
          <!-- vertical stacked bars as flags hung from a clothesline -->
          <line x1="20" y1="40" x2="340" y2="40" stroke="#CFCBC0" stroke-width="1" stroke-dasharray="2 4"/>
          ${geo.map((g, i) => {
            const x = 40 + i * 80;
            const h = g.pct * 4;
            return `
              <g transform="translate(${x} 40)">
                <line x1="0" y1="0" x2="0" y2="20" stroke="#CFCBC0" stroke-width="1"/>
                <rect x="-22" y="20" width="44" height="${h}" fill="${g.color}" rx="2"/>
                <text x="0" y="${20 + h + 18}" font-family="Geist Mono" font-size="9" letter-spacing="1.4" fill="#3B3A37" text-anchor="middle">${g.region.split(' ').join(' ').toUpperCase()}</text>
                <text x="0" y="${20 + h - 8}" font-family="Instrument Serif" font-style="italic" font-size="22" fill="#FFFFFF" text-anchor="middle">${g.pct}%</text>
              </g>
            `;
          }).join('')}
          <text x="180" y="270" text-anchor="middle" font-family="Geist Mono" font-size="9" letter-spacing="1.6" fill="#A4A29C">REVENUE BY REGION · FY 2025</text>
        </svg>
      </div>

      <div class="footprint-list">
        ${geo.map(g => `
          <div class="fp-row">
            <div class="swatch" style="background:${g.color}"></div>
            <div class="name">${g.region}</div>
            <div class="pct">${g.pct}<span style="font-size:14px; opacity:0.6;">%</span></div>
          </div>
        `).join('')}
      </div>
    </section>
  `);
  add(footprint);

  // ============================================================
  // 7. THE BET — capital allocation
  // ============================================================
  const cap = el(`
    <section class="beat beat--paper2">
      <div class="eyebrow">Ch. 06 · The bet</div>
      <h2 class="display" style="font-size:42px;">
        $829.9M of free<br/>cash flow.<br/><em class="signal">Three pockets.</em>
      </h2>
      <p class="lede mt-3">
        Operating cash flow ran $893.2M; capex took $63.3M.
        What was left, management split between shareholders and the balance sheet.
      </p>

      <div class="cap-board">
        <div class="cap-row">
          <div class="cap-num">$<span data-count="392.5" data-decimals="1">0</span><span class="cents">M</span></div>
          <div>
            <span class="cap-tag">Pocket 1 · Dividends</span>
            <div class="cap-title">Cash returned to shareholders.</div>
            <div class="cap-detail">FY ’25 dividends paid out — Hasbro continues to call dividends a priority alongside deleveraging.</div>
          </div>
        </div>
        <div class="cap-row">
          <div class="cap-num">$<span data-count="225" data-decimals="0">0</span><span class="cents">M</span></div>
          <div>
            <span class="cap-tag">Pocket 2 · Deleveraging</span>
            <div class="cap-title">Debt repurchased ahead of schedule.</div>
            <div class="cap-detail">Bringing the 4.9× debt-to-equity ratio back toward the company’s long-term leverage target.</div>
          </div>
        </div>
        <div class="cap-row">
          <div class="cap-num">$<span data-count="1.0" data-decimals="1">0</span><span class="cents">B</span></div>
          <div>
            <span class="cap-tag">Pocket 3 · Buyback (newly authorized)</span>
            <div class="cap-title">A fresh $1.0B share repurchase program.</div>
            <div class="cap-detail">Capacity to retire shares opportunistically as the impairment dust settles.</div>
          </div>
        </div>
      </div>
    </section>
  `);
  add(cap);

  // reset 5
  add(el(`
    <section class="reset reset--cream">
      <em>The shelf has neighbors.<br/><span class="signal">Some of them want the same kid.</span></em>
    </section>
  `));

  // ============================================================
  // 8. COMPETITION
  // ============================================================
  const compete = el(`
    <section class="beat beat--paper">
      <div class="eyebrow">Ch. 07 · The other side of the aisle</div>
      <h2 class="display" style="font-size:42px;">
        One <em class="signal">rival.</em><br/>One <em class="signal">discounter.</em><br/>One <em class="signal">ghost.</em>
      </h2>

      <!-- Mattel: head-to-head versus -->
      <div class="versus-stage">
        <div class="versus-row">
          <div class="versus-side has">
            <div class="tk">HAS</div>
            <div class="nm">Hasbro</div>
            <div class="cap">$13.67B</div>
          </div>
          <div class="versus-vs">vs</div>
          <div class="versus-side">
            <div class="tk">MAT</div>
            <div class="nm">Mattel</div>
            <div class="cap">$4.59B</div>
          </div>
        </div>

        <div class="shelf">
          <svg viewBox="0 0 360 180" xmlns="http://www.w3.org/2000/svg">
            <!-- shelf -->
            <rect x="10" y="140" width="340" height="6" fill="#3B3A37"/>
            <rect x="10" y="146" width="340" height="3" fill="#1A1A1A"/>
            <!-- Hasbro side: Nerf dart + Transformers head silhouette -->
            <g transform="translate(50 60)">
              <rect x="0" y="50" width="80" height="20" rx="10" fill="#E8B73B"/>
              <circle cx="80" cy="60" r="14" fill="#E63946"/>
              <text x="40" y="92" font-family="Geist Mono" font-size="9" letter-spacing="1.4" fill="#3B3A37" text-anchor="middle">NERF</text>
            </g>
            <g transform="translate(160 50)">
              <!-- monopoly hat icon -->
              <path d="M0 60 L48 60 L40 30 L8 30 Z" fill="#1A1A1A"/>
              <rect x="-6" y="60" width="60" height="6" fill="#1A1A1A"/>
              <text x="24" y="90" font-family="Geist Mono" font-size="9" letter-spacing="1.4" fill="#3B3A37" text-anchor="middle">MONOPOLY</text>
            </g>
            <!-- Mattel side: barbie silhouette + hot wheels -->
            <g transform="translate(250 50)">
              <rect x="6" y="40" width="20" height="50" rx="2" fill="#FF6FA7"/>
              <circle cx="16" cy="32" r="10" fill="#FFD9C4"/>
              <text x="16" y="100" font-family="Geist Mono" font-size="9" letter-spacing="1.4" fill="#6B6A65" text-anchor="middle">BARBIE</text>
            </g>
            <g transform="translate(290 90)">
              <!-- car -->
              <path d="M0 24 L8 12 L30 12 L40 24 L40 38 L0 38 Z" fill="#E63946"/>
              <circle cx="10" cy="40" r="6" fill="#1A1A1A"/>
              <circle cx="32" cy="40" r="6" fill="#1A1A1A"/>
              <text x="20" y="62" font-family="Geist Mono" font-size="9" letter-spacing="1.4" fill="#6B6A65" text-anchor="middle">HOT WHEELS</text>
            </g>
          </svg>
        </div>

        <p class="lede" style="margin-top:14px;">
          Hasbro is roughly <em style="font-family:var(--font-display); font-style:italic; color:var(--coral-500);">3× Mattel’s market cap</em>,
          on smaller revenue ($4.70B vs $5.35B). Mattel’s revenue is shrinking too — −0.59% YoY.
        </p>
      </div>

      <!-- Five Below -->
      <div class="comp-card">
        <div class="head">
          <div class="name">Five Below <span class="it" style="color:var(--ink-3);">· the discounter</span></div>
          <div class="tk">FIVE</div>
        </div>
        <div class="comp-stats">
          <div class="comp-stat">
            <div class="v">$13.05B</div>
            <div class="l">Market cap</div>
          </div>
          <div class="comp-stat">
            <div class="v">$4.76B</div>
            <div class="l">Revenue</div>
          </div>
          <div class="comp-stat">
            <div class="v up">+22.9%</div>
            <div class="l">YoY growth</div>
          </div>
        </div>
        <p class="desc">
          Doesn’t make toys. <em>Sells the shelf next door.</em>
          Captures discretionary kid-and-teen spend with private-label and third-party alternatives —
          right where a Hasbro box would sit.
        </p>
      </div>

      <!-- Phantom: Monopoly Go! / Scopely -->
      <div class="phantom">
        <div class="tag">The non-obvious threat · Mobile gaming</div>
        <div class="head">Monopoly Go!<br/><span style="color:rgba(244,239,216,0.7); font-size:14px; font-style:normal; font-family:var(--font-mono); letter-spacing:0.1em;">SCOPELY · LICENSED</span></div>
        <div class="num">$<span data-count="168" data-decimals="0">0</span>M</div>
        <div class="lab">Licensing revenue to HAS · FY ’25</div>
        <p class="desc">
          A licensee shipped Hasbro’s most lucrative new product of the year —
          <em>and its biggest long-term question.</em>
          Mobile gaming is capturing the entertainment hours that used to flow to a board on the carpet.
        </p>
      </div>
    </section>
  `);
  add(compete);

  // reset 6
  add(el(`
    <section class="reset reset--cream">
      <em>So the question lands<br/>where it always lands —<br/><span class="signal">what survives a hundred years.</span></em>
    </section>
  `));

  // ============================================================
  // 9. THE TAKEAWAY — invert the open
  // ============================================================
  const close = el(`
    <section class="beat close">
      <div class="eyebrow">Coda</div>
      <h2 class="display">
        <span>One billion fans.</span>
        <span style="display:block;">Six continents.</span>
        <span class="row3">A catalog<br/>that won’t go away.</span>
      </h2>
      <p class="lede">
        Opened on play. Closes on <em>endurance</em>.
        Hasbro began the year with a billion-dollar writedown and ended it
        with $830M of free cash flow, a 45%-growth segment, and a fresh $1B
        authorization to buy itself back.
      </p>

      <div class="close-tickerbig">HAS<span style="color:var(--ink); font-style:normal;">.</span></div>

      <div class="close-coda">
        <span>Recap · FY ’25</span>
        <span>NASDAQ · HAS</span>
      </div>
    </section>
  `);
  add(close);

  add(el(`
    <footer class="footer-mini">
      Sourced from Hasbro FY ’25 disclosures · Recap is editorial, not investment advice
    </footer>
  `));

})();

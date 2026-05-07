// REG · FY '25 Recap — narrative renderer
// All data is paraphrased from the supplied JSON. No invented figures.

const DATA = {
  ticker: "REG",
  name: "Regency Centers",
  about: {
    properties: 481,
    sqft_m: 58, // million sq ft GLA
    employees: 900,
    market_cap_b: 14.58,
    grocery_anchor_pct: 80,
    occupancy_pct: 96,
    founded: 1963,
    hq: "Jacksonville, FL",
  },
  income: {
    rev_q4_m: 404.19,
    eps_q4: 0.68,
    rev_ttm_b: 1.55,
    rev_yoy_pct: 6.85,
  },
  balance: {
    equity_b: 6.9,
    debt_b: 4.4,
    debt_to_equity_pct: 64,
    leverage_x: 5.2,
    leverage_low: 5.0,
    leverage_high: 5.5,
    revolver_capacity_b: 1.4,
    revolver_total_b: 1.5,
    unencumbered_pct: 88.6,
    capex_next_12m_m: 544.9,
    dividend_q: 0.705,
  },
  costs: [
    { pct: 28, color: "#4A90D9", label: "Depreciation & Amortization" },
    { pct: 18, color: "#E67E22", label: "Property Operating Expenses" },
    { pct: 12, color: "#2ECC71", label: "Real Estate Taxes" },
    { pct: 12, color: "#9B59B6", label: "Interest Expense" },
    { pct: 5,  color: "#E74C3C", label: "General & Administrative" },
  ],
  geo: [
    { pct: 30, region: "Southeast" },
    { pct: 22, region: "Northeast & Mid-Atlantic" },
    { pct: 20, region: "West Coast" },
    { pct: 14, region: "Midwest" },
    { pct: 14, region: "Southwest & Mountain" },
  ],
  competitors: [
    { name: "Kimco Realty",  ticker: "KIM",  cap_b: 16.01, rev_b: 1.36, pe: 27.38, growth: 5.06,
      note: "Most direct rival — same anchors, same suburbs, same institutional capital." },
    { name: "Brixmor Property", ticker: "BRX", cap_b:  9.29, rev_b: 1.37, pe: 24.06, growth: 6.73,
      note: "Head-to-head in neighborhood retail — heavy on grocery-anchored centers." },
    { name: "Invitation Homes", ticker: "INVH", cap_b: 15.75, rev_b: 2.73, pe: 26.78, growth: 4.21,
      note: "Not a landlord rival — a wallet rival. Competes for the same suburban household." },
  ],
};

// REG itself, sized to fit the competitor stack
const SELF = { name: "Regency Centers", ticker: "REG", cap_b: 14.58, rev_b: 1.55, pe: null, growth: 6.85 };

const story = document.getElementById('story');

// ───────────────────────────────────────────────────────────────────────────
// Helpers

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}

function eyebrow(num, text) {
  return `<div class="eyebrow"><span class="eyebrow-num">${num}</span><span class="eyebrow-rule"></span><span>${text}</span></div>`;
}

function reset(text, variant = "paper2") {
  const cls = variant === "ink" ? "reset reset--ink" : variant === "paper3" ? "reset reset--paper3" : "reset reset--paper2";
  return `<section class="${cls}">${text}</section>`;
}

// ───────────────────────────────────────────────────────────────────────────
// 1. HERO — plan-view parking lot

function heroSVG() {
  // Plan-view of a grocery-anchored center: anchor box at top, inline shops along the side,
  // a parking lot of stripes, a few cars dotted around. Cars drift on scroll.
  const W = 372, H = 390;
  return `
  <svg class="hero-lot" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <!-- asphalt -->
    <rect x="0" y="0" width="${W}" height="${H}" fill="#ECEAE3"/>
    <!-- lot fill -->
    <rect x="14" y="118" width="${W-28}" height="${H-118-14}" fill="#E4E1D9"/>

    <!-- anchor building (back of lot) -->
    <g id="anchor-building">
      <rect x="14" y="14" width="${W-28}" height="86" fill="#FBFAF7" stroke="#CFCBC0" stroke-width="1"/>
      <rect x="14" y="14" width="${W-28}" height="14" fill="#2E7D54"/>
      <text x="186" y="24" font-family="Geist Mono, monospace" font-size="8" letter-spacing="2" fill="#FBFAF7" text-anchor="middle">GROCERY · ANCHOR</text>
      <!-- inline shops below sign band -->
      <line x1="14" y1="58" x2="${W-14}" y2="58" stroke="#E4E1D9" stroke-width="1"/>
      <g font-family="Geist Mono, monospace" font-size="7" letter-spacing="1.5" fill="#A4A29C" text-anchor="middle">
        <text x="60" y="78">PHARMACY</text>
        <text x="130" y="78">CAFÉ</text>
        <text x="200" y="78">SALON</text>
        <text x="270" y="78">CLEANERS</text>
        <text x="338" y="78">BANK</text>
      </g>
      <!-- doors -->
      <g fill="#A4A29C">
        <rect x="56" y="92" width="8" height="8"/>
        <rect x="126" y="92" width="8" height="8"/>
        <rect x="196" y="92" width="8" height="8"/>
        <rect x="266" y="92" width="8" height="8"/>
        <rect x="334" y="92" width="8" height="8"/>
      </g>
    </g>

    <!-- access drive between building and lot -->
    <rect x="14" y="100" width="${W-28}" height="18" fill="#D8D5CC"/>

    <!-- parking stripes: 4 rows of stalls -->
    <g stroke="#FBFAF7" stroke-width="1.2">
      ${stalls(14, 130, W-28, 36, 14)}
      ${stalls(14, 178, W-28, 36, 14)}
      ${stalls(14, 226, W-28, 36, 14)}
      ${stalls(14, 274, W-28, 36, 14)}
      ${stalls(14, 322, W-28, 36, 14)}
    </g>

    <!-- median lines between rows -->
    <g stroke="#CFCBC0" stroke-dasharray="3 4" stroke-width="0.8">
      <line x1="14" y1="170" x2="${W-14}" y2="170"/>
      <line x1="14" y1="218" x2="${W-14}" y2="218"/>
      <line x1="14" y1="266" x2="${W-14}" y2="266"/>
      <line x1="14" y1="314" x2="${W-14}" y2="314"/>
    </g>

    <!-- cars (parallax targets) -->
    <g id="cars" font-family="Geist Mono, monospace">
      ${car(36, 138, "#2E7D54", 0)}
      ${car(78, 138, "#3B3A37", 1)}
      ${car(160, 138, "#4A90D9", 2)}
      ${car(240, 138, "#3B3A37", 3)}
      ${car(304, 138, "#E67E22", 4)}

      ${car(20, 186, "#3B3A37", 5)}
      ${car(120, 186, "#3B3A37", 6)}
      ${car(200, 186, "#9B59B6", 7)}
      ${car(280, 186, "#3B3A37", 8)}

      ${car(50, 234, "#2E7D54", 9)}
      ${car(140, 234, "#3B3A37", 10)}
      ${car(220, 234, "#E74C3C", 11)}
      ${car(320, 234, "#3B3A37", 12)}

      ${car(72, 282, "#3B3A37", 13)}
      ${car(180, 282, "#3B3A37", 14)}
      ${car(260, 282, "#2E7D54", 15)}

      ${car(38, 330, "#3B3A37", 16)}
      ${car(180, 330, "#3B3A37", 17)}
      ${car(296, 330, "#3B3A37", 18)}
    </g>

    <!-- cart corral -->
    <g transform="translate(348,158)" stroke="#A4A29C" stroke-width="0.8" fill="none">
      <rect x="0" y="0" width="10" height="20"/>
      <line x1="0" y1="6" x2="10" y2="6"/>
      <line x1="0" y1="12" x2="10" y2="12"/>
    </g>

    <!-- compass + scale tag -->
    <g class="scene-tag">
      <text x="20" y="${H-4}">PLAN · 1 SHOPPING CENTER OF 481</text>
    </g>
  </svg>`;
}

function stalls(x, y, w, h, count) {
  const stallW = w / count;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none"/>`;
  for (let i = 1; i < count; i++) {
    const cx = x + i * stallW;
    s += `<line x1="${cx}" y1="${y}" x2="${cx}" y2="${y + h - 8}"/>`;
  }
  return s;
}

function car(x, y, fill, idx) {
  // tiny plan-view car: rounded rect with a windshield line. data-idx for parallax
  return `<g class="car" data-idx="${idx}" transform="translate(${x},${y})">
    <rect x="0" y="0" width="14" height="22" rx="2.5" fill="${fill}" opacity="0.92"/>
    <line x1="2" y1="8" x2="12" y2="8" stroke="#FBFAF7" stroke-width="0.6" opacity="0.85"/>
    <line x1="2" y1="14" x2="12" y2="14" stroke="#FBFAF7" stroke-width="0.6" opacity="0.5"/>
  </g>`;
}

function buildHero() {
  const s = el('section', 'hero');
  s.innerHTML = `
    <div>
      <div class="hero-eyebrow"><span class="hero-eyebrow-dot"></span>Recap · Fiscal 2025 · NASDAQ: REG</div>
      <h1 class="hero-title">Where<br>America<br>buys <span class="italic signal">milk.</span></h1>
      <p class="hero-sub">Regency Centers owns the parking lot at the end of the cul-de-sac — and 480 more like it. Grocery-anchored, suburban, and almost always full.</p>
    </div>

    ${heroSVG()}

    <div class="hero-foot">
      <div>
        <div style="color:var(--ink);font-family:var(--font-display);font-size:30px;line-height:1;letter-spacing:-0.02em;">$14.58<span style="font-style:italic;color:var(--signal);font-size:18px;">B</span></div>
        <div style="margin-top:6px;">Market cap · FY '25</div>
      </div>
      <div class="hero-foot-r">
        <div class="scroll-hint"><span>Scroll</span><span class="scroll-hint-line"></span></div>
        <div style="margin-top:6px;">A long story</div>
      </div>
    </div>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// 2. ANCHOR MODEL — storefront elevation

function storefrontsSVG() {
  // Elevation view: a wide grocery anchor on the left, four inline shops to the right
  // Rent flows up as little upward-arrow ticks above each store.
  const W = 372, H = 230;
  return `
  <svg class="storefronts" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <!-- sky -->
    <rect x="0" y="0" width="${W}" height="${H-30}" fill="#FBFAF7"/>
    <!-- sidewalk -->
    <rect x="0" y="${H-30}" width="${W}" height="30" fill="#ECEAE3"/>
    <line x1="0" y1="${H-30}" x2="${W}" y2="${H-30}" stroke="#CFCBC0" stroke-width="1"/>

    <!-- ANCHOR (grocery, ~55% width) -->
    <g id="anchor-elev">
      <rect x="14" y="48" width="186" height="${H-30-48}" fill="#FBFAF7" stroke="#CFCBC0"/>
      <!-- sign band -->
      <rect x="14" y="48" width="186" height="22" fill="#2E7D54"/>
      <text x="107" y="63" font-family="Instrument Serif" font-style="italic" font-size="15" fill="#FBFAF7" text-anchor="middle">Grocery</text>
      <!-- big windows -->
      <rect x="22" y="80" width="80" height="60" fill="#DCEBE0" stroke="#CFCBC0" stroke-width="0.6"/>
      <rect x="112" y="80" width="80" height="60" fill="#DCEBE0" stroke="#CFCBC0" stroke-width="0.6"/>
      <!-- automatic doors -->
      <rect x="80" y="148" width="54" height="${H-30-148}" fill="#3B3A37"/>
      <line x1="107" y1="148" x2="107" y2="${H-30}" stroke="#FBFAF7" stroke-width="0.8"/>
      <!-- people-shadow inside -->
      <g fill="#3B3A37" opacity="0.35">
        <circle cx="40" cy="118" r="3"/><circle cx="58" cy="122" r="3"/>
        <circle cx="130" cy="120" r="3"/><circle cx="156" cy="116" r="3"/>
      </g>
    </g>

    <!-- INLINE SHOPS (4) -->
    ${inlineShop(208, 78, "Pharm.", "#E67E22")}
    ${inlineShop(248, 78, "Café", "#9B59B6")}
    ${inlineShop(288, 78, "Salon", "#E74C3C")}
    ${inlineShop(328, 78, "Bank",  "#4A90D9")}

    <!-- rent ticks: small upward arrows above each store, sized by approximate weight -->
    <g stroke="#2E7D54" stroke-width="1.4" fill="none" stroke-linecap="round">
      ${rentArrow(107, 44, 24)}  <!-- anchor: tallest -->
      ${rentArrow(220, 76, 12)}
      ${rentArrow(260, 76, 12)}
      ${rentArrow(300, 76, 12)}
      ${rentArrow(340, 76, 12)}
    </g>

    <!-- callouts -->
    <g class="scene-tag">
      <text x="14" y="20">~80% OF CENTERS · GROCERY-ANCHORED</text>
    </g>
    <g font-family="Geist Mono, monospace" font-size="8" letter-spacing="1.4" fill="#2E7D54">
      <text x="107" y="38" text-anchor="middle">RENT ↑</text>
    </g>
  </svg>`;
}

function inlineShop(x, y, label, accent) {
  const w = 36, h = 230 - 30 - y;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FBFAF7" stroke="#CFCBC0"/>
    <rect x="${x}" y="${y}" width="${w}" height="6" fill="${accent}"/>
    <rect x="${x+5}" y="${y+14}" width="${w-10}" height="${h-30}" fill="#F4F2ED" stroke="#E4E1D9" stroke-width="0.6"/>
    <rect x="${x + w/2 - 3}" y="${y + h - 16}" width="6" height="16" fill="#3B3A37"/>
    <text x="${x + w/2}" y="${y + 11}" font-family="Geist Mono, monospace" font-size="6" letter-spacing="1" fill="#FBFAF7" text-anchor="middle">${label.toUpperCase()}</text>
  </g>`;
}

function rentArrow(cx, baseY, len) {
  const top = baseY - len;
  return `<g><line x1="${cx}" y1="${baseY}" x2="${cx}" y2="${top}"/><line x1="${cx-3}" y1="${top+4}" x2="${cx}" y2="${top}"/><line x1="${cx+3}" y1="${top+4}" x2="${cx}" y2="${top}"/></g>`;
}

function buildAnchorModel() {
  const s = el('section', 'beat');
  s.innerHTML = `
    ${eyebrow('01', 'The anchor')}
    <h2 class="section-title reveal">The store sells the milk.<br><span class="italic">Regency sells the lease.</span></h2>
    ${storefrontsSVG()}
    <p class="shop-caption reveal">An <span class="label-anchor">anchor grocer</span> draws traffic to the corner. Behind the anchor, the rent stack: <span class="label-inline">inline shops</span> — pharmacies, cafés, salons, banks — pay for the foot traffic the anchor delivers. Roughly 80% of Regency's 481 centers run on this geometry. Occupancy holds near 96%.</p>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// 3. SCALE — count-up stack

function buildScale() {
  const s = el('section', 'beat');
  s.innerHTML = `
    ${eyebrow('02', 'The scale')}
    <h2 class="section-title reveal">A continent<br>of <span class="italic">corners.</span></h2>
    <div class="scale-stack">
      <div class="scale-row reveal">
        <div class="scale-num"><span data-countup="481" data-suffix="">0</span></div>
        <div class="scale-label">Properties owned or co-owned</div>
        <div class="scale-note">Open-air, suburban, and overwhelmingly anchored by a grocer.</div>
      </div>
      <div class="scale-row reveal">
        <div class="scale-num"><span data-countup="58" data-decimals="0">0</span><span class="unit">M sq ft</span></div>
        <div class="scale-label">Gross leasable area</div>
        <div class="scale-note">Roughly the floor plate of <span class="em">two thousand Manhattan blocks,</span> distributed across suburbs.</div>
      </div>
      <div class="scale-row reveal">
        <div class="scale-num"><span data-countup="96">0</span><span class="unit">%</span></div>
        <div class="scale-label">Portfolio occupancy</div>
        <div class="scale-note">The space rarely sits empty. Necessity tenants don't churn the way fashion does.</div>
      </div>
      <div class="scale-row reveal">
        <div class="scale-num">$<span data-countup="1.55" data-decimals="2">0</span><span class="unit">B</span></div>
        <div class="scale-label">Trailing-twelve-month revenue · <span style="color:var(--signal)">+6.85% YoY</span></div>
        <div class="scale-note">Q4 alone delivered <span class="em">$404 million</span> at $0.68 EPS.</div>
      </div>
      <div class="scale-row reveal">
        <div class="scale-num"><span data-countup="900">0</span></div>
        <div class="scale-label">Employees · 1 HQ in Jacksonville · founded 1963</div>
        <div class="scale-note">A small staff for a national landlord. The work is done by leases.</div>
      </div>
    </div>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// 4. THE DOLLAR BILL — cost breakdown

function buildBill() {
  const s = el('section', 'beat');
  // 100-cent grid, 10×10. Fill cells in cost order; remaining cells = residual margin.
  const cols = 10, rows = 10;
  const cellW = 32, cellH = 18, gapX = 2, gapY = 2;
  const W = cols * cellW + (cols - 1) * gapX;
  const H = rows * cellH + (rows - 1) * gapY;

  const cells = [];
  let i = 0;
  DATA.costs.forEach((c, ci) => {
    for (let k = 0; k < c.pct; k++) {
      const r = Math.floor(i / cols), col = i % cols;
      const x = col * (cellW + gapX);
      const y = r * (cellH + gapY);
      cells.push(`<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="1" fill="${c.color}" data-cost="${ci}" data-cell="${i}" opacity="0.92"/>`);
      i++;
    }
  });
  // Residual cells (margin)
  const usedTotal = DATA.costs.reduce((a, c) => a + c.pct, 0);
  const residual = 100 - usedTotal;
  for (let k = 0; k < residual; k++) {
    const r = Math.floor(i / cols), col = i % cols;
    const x = col * (cellW + gapX);
    const y = r * (cellH + gapY);
    cells.push(`<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="1" fill="#2E7D54" data-cell="${i}" data-residual="1"/>`);
    i++;
  }

  const billW = W + 24, billH = H + 60;
  s.innerHTML = `
    ${eyebrow('03', 'A hundred cents in')}
    <h2 class="section-title reveal">Where the<br>dollar <span class="italic">goes.</span></h2>

    <div class="bill-wrap">
      <svg class="bill-svg" viewBox="0 0 ${billW} ${billH}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <!-- bill paper -->
        <rect x="0" y="0" width="${billW}" height="${billH}" rx="4" fill="#FBFAF7" stroke="#CFCBC0"/>
        <text x="12" y="18" font-family="Geist Mono, monospace" font-size="9" letter-spacing="2" fill="#6B6A65">$1.00 · OPERATING</text>
        <text x="${billW-12}" y="18" font-family="Geist Mono, monospace" font-size="9" letter-spacing="2" fill="#6B6A65" text-anchor="end">FY '25</text>
        <g transform="translate(12, 30)" id="bill-grid">
          ${cells.join('')}
        </g>
      </svg>

      <div class="bill-legend">
        ${DATA.costs.map(c => `
          <div class="bill-row reveal">
            <span class="bill-swatch" style="background:${c.color}"></span>
            <span class="bill-label">${c.label}</span>
            <span class="bill-pct">${c.pct}¢</span>
          </div>
        `).join('')}
        <div class="bill-row reveal" style="border-bottom:none;">
          <span class="bill-swatch" style="background:var(--signal)"></span>
          <span class="bill-label" style="color:var(--signal-2);font-weight:500;">What survives — operating residual</span>
          <span class="bill-pct" style="color:var(--signal-2);">${residual}¢</span>
        </div>
      </div>

      <div class="bill-residual reveal">
        Of every operating dollar, roughly <span class="pct">${residual}¢</span> survive the building, the depreciation, the taxes, and the interest before anything else is decided.
      </div>
    </div>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// 5. FOOTPRINT — stylized US map

function mapSVG() {
  // Stylized regions of the US drawn as soft shapes. Filled to their share.
  // Not a literal cartographic map — a metaphor map.
  const W = 372, H = 240;
  // We'll draw five rounded blob regions arranged roughly geographically:
  // West Coast (left), Mountain/SW (lower-left-mid), Midwest (center), Northeast (top-right), Southeast (lower-right).
  const regions = [
    { id: 'sw', name: 'Southwest & Mountain', pct: 14, d: "M40,118 C40,98 70,90 102,96 C130,102 140,130 130,156 C118,184 80,182 60,170 C42,158 40,138 40,118 Z" },
    { id: 'wc', name: 'West Coast',            pct: 20, d: "M22,40 C36,28 64,30 70,52 C76,72 64,96 56,116 C46,138 30,134 22,120 C14,104 14,72 22,40 Z" },
    { id: 'mw', name: 'Midwest',               pct: 14, d: "M138,72 C156,62 196,64 208,86 C218,108 200,138 174,140 C148,142 130,122 130,102 C130,90 130,82 138,72 Z" },
    { id: 'ne', name: 'Northeast & Mid-Atl.',  pct: 22, d: "M232,42 C254,30 296,38 314,58 C330,78 322,108 296,114 C270,120 240,108 230,86 C222,68 222,52 232,42 Z" },
    { id: 'se', name: 'Southeast',             pct: 30, d: "M180,140 C214,128 270,134 298,156 C326,180 314,212 274,216 C232,220 188,210 168,188 C152,170 152,150 180,140 Z" },
  ];

  // Fill opacity scales with pct (cap at ~0.95)
  const maxPct = Math.max(...regions.map(r => r.pct));
  const paths = regions.map(r => {
    const opacity = 0.20 + (r.pct / maxPct) * 0.75;
    return `<path d="${r.d}" fill="#2E7D54" fill-opacity="${opacity.toFixed(2)}" stroke="#1F5E3D" stroke-width="0.8" stroke-opacity="0.5" data-region="${r.id}"/>`;
  }).join('');

  // Region labels
  const labels = [
    { x: 56,  y: 80,  t: 'WC' , pct: 20 },
    { x: 86,  y: 138, t: 'SW',  pct: 14 },
    { x: 170, y: 104, t: 'MW',  pct: 14 },
    { x: 274, y: 80,  t: 'NE',  pct: 22 },
    { x: 230, y: 178, t: 'SE',  pct: 30 },
  ].map(l => `
    <g>
      <text x="${l.x}" y="${l.y - 2}" font-family="Geist Mono, monospace" font-size="9" letter-spacing="1.4" fill="#FBFAF7" text-anchor="middle" font-weight="600">${l.t}</text>
      <text x="${l.x}" y="${l.y + 12}" font-family="Instrument Serif" font-style="italic" font-size="14" fill="#FBFAF7" text-anchor="middle">${l.pct}%</text>
    </g>
  `).join('');

  // Compass + frame
  return `
  <svg class="map-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x="0" y="0" width="${W}" height="${H}" fill="#F4F2ED"/>
    <!-- subtle longitude lines -->
    <g stroke="#E4E1D9" stroke-width="0.6">
      <line x1="86"  y1="0" x2="86"  y2="${H}"/>
      <line x1="172" y1="0" x2="172" y2="${H}"/>
      <line x1="258" y1="0" x2="258" y2="${H}"/>
    </g>
    ${paths}
    ${labels}
    <g class="scene-tag">
      <text x="14" y="${H-10}">DISTRIBUTION OF 481 PROPERTIES · BY GLA</text>
      <text x="${W-14}" y="${H-10}" text-anchor="end">N ↑</text>
    </g>
  </svg>`;
}

function buildFootprint() {
  const s = el('section', 'beat');
  const ranked = [...DATA.geo].sort((a,b) => b.pct - a.pct);
  s.innerHTML = `
    ${eyebrow('04', 'The footprint')}
    <h2 class="section-title reveal">Five regions.<br>One <span class="italic">suburb.</span></h2>
    <div class="map-wrap">
      ${mapSVG()}
      <div class="map-legend">
        ${ranked.map((r, i) => `
          <div class="map-row reveal">
            <span class="map-rank">${String(i+1).padStart(2,'0')}</span>
            <span class="map-region">${r.region} US</span>
            <span class="map-pct"><span data-countup="${r.pct}">0</span><span class="sym">%</span></span>
          </div>
        `).join('')}
      </div>
    </div>
    <p class="shop-caption reveal" style="margin-top:24px;">The portfolio leans south. <span style="font-family:var(--font-display);font-style:italic;color:var(--signal);">Sun belt, school district, second car.</span> The rest of the country fills in.</p>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// 6. THE WEIGHT — debt interlude (dark)

function buildDebt() {
  const s = el('section', 'dark-beat');
  // leverage meter: 0 to 7x scale, target band 5.0–5.5x, marker at 5.2x
  const minX = 0, maxX = 7;
  const fillPct = (DATA.balance.leverage_x / maxX) * 100;
  const bandLow = (DATA.balance.leverage_low / maxX) * 100;
  const bandHigh = (DATA.balance.leverage_high / maxX) * 100;

  s.innerHTML = `
    ${eyebrow('05', 'The weight')}
    <h2 class="section-title reveal">Built on debt,<br>kept on a <span class="italic">leash.</span></h2>

    <div class="scale-stack" style="margin-top:8px;">
      <div class="scale-row reveal" style="border-top:none;padding-top:0;">
        <div class="scale-num">$<span data-countup="4.4" data-decimals="1">0</span><span class="unit">B</span></div>
        <div class="scale-label">Total debt · against $6.9B equity</div>
        <div class="scale-note">A debt-to-equity ratio of <span class="em">~64%</span> — the working capital structure of a national landlord.</div>
      </div>

      <div class="scale-row reveal">
        <div class="scale-num"><span data-countup="5.2" data-decimals="1">0</span><span class="unit">×</span></div>
        <div class="scale-label">Net debt + preferred to operating EBITDAre</div>

        <div style="position:relative;margin-top:18px;">
          <div class="scale-meter" style="position:relative;">
            <!-- target band overlay -->
            <div style="position:absolute;left:${bandLow}%;width:${bandHigh-bandLow}%;top:0;bottom:0;background:rgba(111,191,143,0.18);border-left:1px dashed #6FBF8F;border-right:1px dashed #6FBF8F;"></div>
            <div class="scale-meter-fill" data-fill="${fillPct}" style="width:0%"></div>
            <!-- marker dot -->
            <div style="position:absolute;left:${fillPct}%;top:-4px;bottom:-4px;width:2px;background:#F4D266;transform:translateX(-1px);"></div>
          </div>
          <div class="scale-meter-labels">
            <span>0×</span>
            <span style="color:#6FBF8F">target 5.0–5.5×</span>
            <span class="now">5.2× now</span>
            <span>7×</span>
          </div>
        </div>
      </div>
    </div>

    <div class="ledger reveal">
      <div class="ledger-row">
        <div class="ledger-label">Revolver capacity available</div>
        <div class="ledger-val"><span class="em">$1.4B</span> of $1.5B</div>
      </div>
      <div class="ledger-row">
        <div class="ledger-label">Real estate unencumbered</div>
        <div class="ledger-val"><span class="em">88.6%</span></div>
      </div>
      <div class="ledger-row">
        <div class="ledger-label">Year-end balance</div>
        <div class="ledger-val">Dec 31, 2024</div>
      </div>
    </div>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// 7. THE BET — capex + dividend

function buildBet() {
  const s = el('section', 'beat');
  s.innerHTML = `
    ${eyebrow('06', 'The bet · build it')}
    <h2 class="section-title reveal">Pour the<br><span class="italic">concrete.</span></h2>

    <div class="bet-grid">
      <div class="bet-tile reveal">
        <div class="bet-tile-num">$<span data-countup="544.9" data-decimals="1">0</span><span class="unit">M</span></div>
        <div class="bet-tile-label">Development & redevelopment · next 12 months</div>
        <div class="bet-tile-note">The estimated bill for the next round of construction. Half a billion in <span class="em">cement and tenant improvements,</span> deployed across the existing 481.</div>
      </div>

      <div class="bet-tile reveal">
        <div class="bet-tile-num">$<span data-countup="0.705" data-decimals="3">0</span></div>
        <div class="bet-tile-label">Quarterly common dividend · per share</div>
        <div class="div-chevrons" aria-hidden="true">
          <span class="div-bar"></span>
          <span class="div-bar"></span>
          <span class="div-bar"></span>
          <span class="div-bar"></span>
          <span class="div-bar"></span>
        </div>
        <div class="div-foot"><span>Earlier</span><span>Most recent</span></div>
        <div class="bet-tile-note">REITs pay shareholders by statute. The check goes out every quarter — funded out of what survives the operating dollar.</div>
      </div>

      <div class="bet-tile reveal">
        <div class="bet-tile-num">ATM</div>
        <div class="bet-tile-label">At-the-market equity · acquisition fuel</div>
        <div class="bet-tile-note">When the market wants more Regency, the company sells more Regency — and uses the proceeds to <span class="em">buy more centers.</span></div>
      </div>
    </div>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// 8. COMPETITORS — three rivals + REG

function buildCompetitors() {
  const s = el('section', 'beat');

  // For relative bar widths, scale to the max market cap among the four
  const all = [SELF, ...DATA.competitors];
  const maxCap = Math.max(...all.map(c => c.cap_b));

  const row = (c, isSelf=false) => {
    const wPct = (c.cap_b / maxCap) * 100;
    const peStr = c.pe == null ? '—' : c.pe.toFixed(1);
    const note = isSelf
      ? "Grocery-anchored, suburban, and the only one with the parking lot above."
      : c.note;
    return `
    <div class="compete-row ${isSelf ? 'is-self' : ''} reveal">
      <div class="compete-head">
        <div>
          <div class="compete-tk">${c.ticker}${isSelf ? ' · this company' : ''}</div>
          <div class="compete-name">${c.name}</div>
        </div>
        <div class="compete-tk" style="text-align:right;">Mkt cap</div>
      </div>
      <div class="compete-stats">
        <div>
          <div class="compete-stat-num">$${c.cap_b.toFixed(2)}<span style="font-style:italic;color:${isSelf?'var(--signal)':'var(--ink-3)'};font-size:14px;">B</span></div>
          <div class="compete-stat-lbl">Market cap</div>
        </div>
        <div>
          <div class="compete-stat-num">$${c.rev_b.toFixed(2)}<span style="font-style:italic;color:${isSelf?'var(--signal)':'var(--ink-3)'};font-size:14px;">B</span></div>
          <div class="compete-stat-lbl">Revenue</div>
        </div>
        <div>
          <div class="compete-stat-num">+${c.growth.toFixed(2)}<span style="font-style:italic;color:${isSelf?'var(--signal)':'var(--ink-3)'};font-size:14px;">%</span></div>
          <div class="compete-stat-lbl">YoY growth</div>
        </div>
      </div>
      <div class="compete-bar-wrap">
        <div class="compete-bar-track">
          <div class="compete-bar-fill" data-bar="${wPct.toFixed(1)}"></div>
        </div>
      </div>
      <div class="compete-note">${note}</div>
    </div>`;
  };

  s.innerHTML = `
    ${eyebrow('07', 'The block')}
    <h2 class="section-title reveal">Four landlords<br>on the same <span class="italic">corner.</span></h2>
    <div class="compete-stack">
      ${row(SELF, true)}
      ${DATA.competitors.map(c => row(c, false)).join('')}
    </div>
    <p class="shop-caption reveal" style="margin-top:22px;">
      Two of these compete for the same anchor leases. The third — <span class="label-anchor">Invitation Homes</span> — competes for the same suburb's wallet, from the house instead of the strip.
    </p>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// 9. CLOSE — restate

function buildClose() {
  const s = el('section', 'close');
  s.innerHTML = `
    ${eyebrow('08', 'The takeaway')}
    <h1 class="close-title reveal">$14.58<span class="italic">B</span><br>built one<br>parking lot at a <span class="italic">time.</span></h1>
    <p class="close-sub reveal">
      Regency Centers is what happens when you compound 481 corner stores across sixty years. The grocer draws the traffic. The inline shops pay the rent. The dollar comes in; depreciation, opex, taxes, and interest take theirs; <span style="font-family:var(--font-display);font-style:italic;color:var(--signal);">a quiet residual</span> survives — enough to fund the next half-billion of concrete and the next dividend.
    </p>

    <!-- echo of the opening lot, smaller -->
    <svg viewBox="0 0 372 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;margin-top:48px;display:block;" aria-hidden="true">
      <rect x="0" y="0" width="372" height="100" fill="transparent"/>
      <rect x="14" y="14" width="344" height="20" fill="#FBFAF7" stroke="#CFCBC0"/>
      <rect x="14" y="14" width="344" height="6" fill="#2E7D54"/>
      <text x="186" y="19" font-family="Geist Mono, monospace" font-size="6" letter-spacing="2" fill="#FBFAF7" text-anchor="middle">GROCERY</text>
      <g stroke="#CFCBC0" stroke-width="0.8">
        ${[40,80,120,160,200,240,280,320].map(x => `<line x1="${x}" y1="44" x2="${x}" y2="78"/>`).join('')}
      </g>
      <line x1="14" y1="44" x2="358" y2="44" stroke="#D8D5CC"/>
      <line x1="14" y1="78" x2="358" y2="78" stroke="#D8D5CC"/>
      <text x="14" y="96" font-family="Geist Mono, monospace" font-size="8" letter-spacing="2" fill="#A4A29C">× 481</text>
    </svg>

    <div class="close-foot">
      <span>End · Recap FY '25</span>
      <span>NASDAQ · REG</span>
    </div>
  `;
  return s;
}

// ───────────────────────────────────────────────────────────────────────────
// Assemble the story

function assemble() {
  story.appendChild(buildHero());

  const r1 = el('div'); r1.innerHTML = reset(`Eighty cents of every door <span class="signal">opens onto a grocery aisle.</span>`, 'paper2');
  story.appendChild(r1);

  story.appendChild(buildAnchorModel());

  const r2 = el('div'); r2.innerHTML = reset(`Four hundred and eighty-one centers. <span class="signal">One playbook,</span> repeated.`, 'paper3');
  story.appendChild(r2);

  story.appendChild(buildScale());

  const r3 = el('div'); r3.innerHTML = reset(`A hundred cents come in. <span class="signal">Where do they go?</span>`, 'paper2');
  story.appendChild(r3);

  story.appendChild(buildBill());

  const r4 = el('div'); r4.innerHTML = reset(`A national portfolio with a <span class="signal">southern accent.</span>`, 'paper3');
  story.appendChild(r4);

  story.appendChild(buildFootprint());

  const r5 = el('div'); r5.innerHTML = reset(`And then there is <span class="signal">what you owe.</span>`, 'ink');
  story.appendChild(r5);

  story.appendChild(buildDebt());

  const r6 = el('div'); r6.innerHTML = reset(`Build it. Pay it. <span class="signal">Repeat.</span>`, 'paper2');
  story.appendChild(r6);

  story.appendChild(buildBet());

  const r7 = el('div'); r7.innerHTML = reset(`On the same block, <span class="signal">three other landlords</span> are doing the math.`, 'paper3');
  story.appendChild(r7);

  story.appendChild(buildCompetitors());

  story.appendChild(buildClose());
}

assemble();

// ───────────────────────────────────────────────────────────────────────────
// Behaviors

// Scroll progress hairline
const progressFill = document.getElementById('progressFill');
function onScroll() {
  const h = document.documentElement;
  const top = h.scrollTop || document.body.scrollTop;
  const max = (h.scrollHeight - h.clientHeight) || 1;
  const pct = Math.max(0, Math.min(1, top / max));
  progressFill.style.width = (pct * 100).toFixed(2) + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// IntersectionObserver: reveal-on-scroll + count-ups + bar fills
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    // Count-ups inside this element
    e.target.querySelectorAll('[data-countup]').forEach(runCountUp);
    // Compete bars
    e.target.querySelectorAll('.compete-bar-fill').forEach(b => {
      const w = b.dataset.bar;
      requestAnimationFrame(() => b.style.width = w + '%');
    });
    // Leverage meter fill
    e.target.querySelectorAll('.scale-meter-fill').forEach(b => {
      const w = b.dataset.fill;
      if (w) requestAnimationFrame(() => b.style.width = w + '%');
    });
    io.unobserve(e.target);
  });
}, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(n => io.observe(n));
// Also observe meter rows / bar rows that might not have .reveal
document.querySelectorAll('.scale-meter-fill, .compete-bar-fill').forEach(n => {
  // attach to nearest .reveal ancestor; if none, observe the node's parent .scale-row or .compete-row
  const host = n.closest('.reveal, .scale-row, .compete-row');
  if (host && !host.classList.contains('is-in')) io.observe(host);
});

// Count-up animation
function runCountUp(node) {
  if (node.dataset.done === '1') return;
  node.dataset.done = '1';
  const target = parseFloat(node.dataset.countup);
  const decimals = parseInt(node.dataset.decimals || '0', 10);
  const dur = 1200;
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    const v = target * eased;
    node.textContent = formatNum(v, decimals, target);
    if (t < 1) requestAnimationFrame(frame);
    else node.textContent = formatNum(target, decimals, target);
  }
  requestAnimationFrame(frame);
}

function formatNum(v, decimals, target) {
  if (decimals > 0) return v.toFixed(decimals);
  // integer with thousands separators if >= 1000
  const n = Math.round(v);
  return target >= 1000 ? n.toLocaleString('en-US') : String(n);
}

// Hero parking-lot car parallax — clean implementation using CSS custom prop
// (replace the earlier transform-mutating code; we'll let CSS handle it)
(function setupCarParallax() {
  const cars = document.querySelectorAll('.car');
  // store base positions
  cars.forEach(c => {
    const m = c.getAttribute('transform').match(/translate\(([-\d.]+),([-\d.]+)\)/);
    if (m) { c.dataset.bx = m[1]; c.dataset.by = m[2]; }
  });
  function update() {
    const top = window.scrollY;
    const maxDrift = 280;
    const tt = Math.min(top, maxDrift);
    cars.forEach(c => {
      const idx = +c.dataset.idx;
      const drift = tt * (0.05 + (idx % 5) * 0.018);
      const wob = Math.sin((top + idx * 30) / 80) * 1.2;
      const bx = parseFloat(c.dataset.bx);
      const by = parseFloat(c.dataset.by);
      c.setAttribute('transform', `translate(${bx + wob},${by + drift})`);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

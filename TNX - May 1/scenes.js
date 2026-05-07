/* ============================================================
   TXN recap — bespoke SVG scene builders
   Each function returns an SVG string for a metaphor scene.
   ============================================================ */

/* -------- Hero wafer (300mm) ---------------------------------
   A circular silicon wafer with a flat edge, etched into a
   regular grid of dies. Subtle radial sheen. Coral signal mark
   at center. Scrolling rotates it slightly + dies light up. */
function sceneWafer({ id = 'wafer-hero', dieGrid = 14 } = {}) {
  const W = 360, H = 360;
  const cx = W/2, cy = H/2;
  const R = 158;             // wafer radius
  const flat = 28;           // flat-edge inset
  const dieStep = (R*2 - 30) / dieGrid;
  const startX = cx - (dieGrid * dieStep)/2;
  const startY = cy - (dieGrid * dieStep)/2;

  // build die rectangles, only those whose center is inside the wafer
  let dies = '';
  let idx = 0;
  for (let r=0; r<dieGrid; r++){
    for (let c=0; c<dieGrid; c++){
      const x = startX + c*dieStep + 1;
      const y = startY + r*dieStep + 1;
      const cx2 = x + dieStep/2;
      const cy2 = y + dieStep/2;
      const dx = cx2 - cx, dy = cy2 - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      // simulate flat edge at bottom
      const inFlat = (cy2 > cy + R - flat);
      if (dist < R - 3 && !inFlat) {
        dies += `<rect data-i="${idx}" class="die" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(dieStep-2).toFixed(1)}" height="${(dieStep-2).toFixed(1)}" rx="0.5"/>`;
        idx++;
      }
    }
  }

  return `
<svg id="${id}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${id}-sheen" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#F2EAD6" stop-opacity="0.85"/>
      <stop offset="40%" stop-color="#C9C0AB" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#7A7263" stop-opacity="0.55"/>
    </radialGradient>
    <radialGradient id="${id}-rim" cx="50%" cy="50%" r="50%">
      <stop offset="92%" stop-color="transparent"/>
      <stop offset="98%" stop-color="#0F0E0B" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0F0E0B" stop-opacity="0.55"/>
    </radialGradient>
    <clipPath id="${id}-clip">
      <path d="
        M ${cx} ${cy - R}
        A ${R} ${R} 0 1 1 ${cx - R*Math.sin(0.34)} ${cy + R*Math.cos(0.34)}
        L ${cx + R*Math.sin(0.34)} ${cy + R*Math.cos(0.34)}
        A ${R} ${R} 0 0 1 ${cx} ${cy - R}
        Z" />
    </clipPath>
  </defs>

  <!-- backing shadow -->
  <ellipse cx="${cx}" cy="${cy + R - 6}" rx="${R*0.85}" ry="10" fill="#000" opacity="0.10"/>

  <g clip-path="url(#${id}-clip)">
    <!-- silicon body -->
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#${id}-sheen)"/>

    <!-- subtle radial scratches -->
    <g opacity="0.18" fill="none" stroke="#3D3A33" stroke-width="0.4">
      ${[20, 38, 58, 80, 104, 130, 156].map(rr =>
        `<circle cx="${cx}" cy="${cy}" r="${rr}"/>`
      ).join('')}
    </g>

    <!-- die grid: thin coral grid lines + filled dies -->
    <g class="dies" fill="#1F1B14" fill-opacity="0.0" stroke="#1F1B14" stroke-opacity="0.18" stroke-width="0.5">
      ${dies}
    </g>

    <!-- center mark: coral cross + ring (the bet/etch) -->
    <g transform="translate(${cx} ${cy})">
      <circle r="22" fill="none" stroke="#F25A37" stroke-width="0.8" opacity="0.9"/>
      <circle r="3" fill="#F25A37"/>
      <line x1="-12" y1="0" x2="-5" y2="0" stroke="#F25A37" stroke-width="0.8"/>
      <line x1="5" y1="0" x2="12" y2="0" stroke="#F25A37" stroke-width="0.8"/>
      <line x1="0" y1="-12" x2="0" y2="-5" stroke="#F25A37" stroke-width="0.8"/>
      <line x1="0" y1="5" x2="0" y2="12" stroke="#F25A37" stroke-width="0.8"/>
    </g>

    <!-- rim shadow -->
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#${id}-rim)"/>
  </g>

  <!-- wafer outline -->
  <path d="
    M ${cx} ${cy - R}
    A ${R} ${R} 0 1 1 ${cx - R*Math.sin(0.34)} ${cy + R*Math.cos(0.34)}
    L ${cx + R*Math.sin(0.34)} ${cy + R*Math.cos(0.34)}
    A ${R} ${R} 0 0 1 ${cx} ${cy - R} Z"
    fill="none" stroke="#1F1B14" stroke-opacity="0.55" stroke-width="0.8"/>

  <!-- spec callouts -->
  <g font-family="'Geist Mono', monospace" font-size="9" fill="#3A3733" letter-spacing="1">
    <line x1="${cx - R - 6}" y1="${cy}" x2="${cx + R + 6}" y2="${cy}" stroke="#3A3733" stroke-width="0.4" stroke-dasharray="2 2" opacity="0.5"/>
    <text x="${cx + R + 10}" y="${cy + 3}" fill="#6E6A62">300mm</text>
    <text x="${cx - R - 10}" y="${cy - R + 4}" text-anchor="end" fill="#6E6A62">SI · TX</text>
    <text x="${cx + R + 10}" y="${cy + R - 8}" fill="#6E6A62">FY '25</text>
  </g>
</svg>`;
}

/* -------- Signal chain ----------------------------------------
   A horizontal trace: sensor → analog → embedded → out, with
   coral animated pulse. Mobile: flows top-down. */
function sceneSignalChain() {
  return `
<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="sigtrace" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F25A37" stop-opacity="0"/>
      <stop offset="40%" stop-color="#F25A37" stop-opacity="1"/>
      <stop offset="60%" stop-color="#F25A37" stop-opacity="1"/>
      <stop offset="100%" stop-color="#F25A37" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- background board -->
  <rect x="0" y="48" width="360" height="124" fill="#ECE8DF" stroke="#DCD7CB"/>

  <!-- pads top: real-world signals (sensor / motor / sound) -->
  <g font-family="'Geist Mono', monospace" font-size="9" fill="#6E6A62" letter-spacing="1">
    <text x="40" y="20" text-anchor="middle">SENSOR</text>
    <text x="180" y="20" text-anchor="middle">POWER</text>
    <text x="320" y="20" text-anchor="middle">SIGNAL</text>
  </g>
  <g fill="none" stroke="#6E6A62" stroke-width="1">
    <path d="M30 28 q10 -8 20 0"/>
    <path d="M170 28 l5 -6 5 6 5 -6 5 6"/>
    <path d="M310 28 q5 -10 10 0 t10 0"/>
  </g>

  <!-- traces from inputs into chips -->
  <g stroke="#948D7E" stroke-width="1" fill="none">
    <path d="M40 30 L40 60 L92 60"/>
    <path d="M180 30 L180 60 L156 60"/>
    <path d="M180 30 L180 60 L210 60"/>
    <path d="M320 30 L320 60 L268 60"/>
  </g>

  <!-- TWO CHIPS: analog (left, larger) + embedded (right) -->
  <!-- chip 1: analog -->
  <g>
    <rect x="48" y="70" width="120" height="84" fill="#15130F" rx="4"/>
    <rect x="52" y="74" width="112" height="76" fill="none" stroke="#3A3733" rx="3"/>
    <text x="108" y="116" text-anchor="middle" font-family="'Geist Mono', monospace" font-size="11" fill="#F4EFE5" letter-spacing="2">ANALOG</text>
    <text x="108" y="132" text-anchor="middle" font-family="'Geist Mono', monospace" font-size="8" fill="#8A867C" letter-spacing="1.5">79% · $14.01B</text>
    <!-- pins -->
    ${[0,1,2,3,4,5].map(i => `<rect x="${52 + i*20}" y="68" width="10" height="2" fill="#948D7E"/><rect x="${52 + i*20}" y="154" width="10" height="2" fill="#948D7E"/>`).join('')}
    ${[0,1,2,3].map(i => `<rect x="44" y="${78 + i*20}" width="6" height="2" fill="#948D7E"/><rect x="166" y="${78 + i*20}" width="6" height="2" fill="#948D7E"/>`).join('')}
  </g>

  <!-- chip 2: embedded -->
  <g>
    <rect x="200" y="80" width="100" height="64" fill="#15130F" rx="4"/>
    <rect x="204" y="84" width="92" height="56" fill="none" stroke="#3A3733" rx="3"/>
    <text x="250" y="115" text-anchor="middle" font-family="'Geist Mono', monospace" font-size="10" fill="#F4EFE5" letter-spacing="1.5">EMBEDDED</text>
    <text x="250" y="128" text-anchor="middle" font-family="'Geist Mono', monospace" font-size="8" fill="#8A867C" letter-spacing="1.5">MCU · WIRELESS</text>
    ${[0,1,2,3,4].map(i => `<rect x="${204 + i*20}" y="78" width="10" height="2" fill="#948D7E"/><rect x="${204 + i*20}" y="144" width="10" height="2" fill="#948D7E"/>`).join('')}
  </g>

  <!-- connector trace between chips -->
  <path d="M168 112 L200 112" stroke="#948D7E" stroke-width="1.2" fill="none"/>

  <!-- output trace bottom -->
  <g stroke="#948D7E" stroke-width="1" fill="none">
    <path d="M108 154 L108 188"/>
    <path d="M250 144 L250 188"/>
  </g>

  <!-- output labels -->
  <g font-family="'Geist Mono', monospace" font-size="9" fill="#6E6A62" letter-spacing="1">
    <text x="108" y="206" text-anchor="middle">CONVERT</text>
    <text x="250" y="206" text-anchor="middle">DECIDE</text>
  </g>

  <!-- coral pulse following the trace -->
  <circle r="3" fill="#F25A37">
    <animateMotion dur="3.4s" repeatCount="indefinite"
      path="M40 30 L40 60 L92 60 L168 112 L200 112 L250 144 L250 188"/>
  </circle>
</svg>`;
}

/* -------- 80,000 products grid (dot field) -------------------
   80 rows × 100 = 8000 dots, label says one dot = 10 products.
   Coral subset = analog (79%). */
function sceneProductGrid() {
  const cols = 60;
  const rows = 50;          // 60*50 = 3000 dots; each = ~27 products
  const total = cols * rows;
  const analogShare = 0.79;
  const analogCount = Math.round(total * analogShare);

  let dots = '';
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      const i = r*cols + c;
      const isAnalog = i < analogCount;
      const x = c * 5.5 + 4;
      const y = r * 5.0 + 4;
      const fill = isAnalog ? '#F25A37' : '#3A3733';
      const op = isAnalog ? 0.9 : 0.55;
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.1" fill="${fill}" fill-opacity="${op}"/>`;
    }
  }
  return `
<svg viewBox="0 0 340 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${dots}
  <g font-family="'Geist Mono', monospace" font-size="9" letter-spacing="1.5" fill="#6E6A62">
    <text x="0" y="278">1 DOT ≈ 27 PRODUCTS · CORAL = ANALOG</text>
  </g>
</svg>`;
}

/* -------- The dollar (cost breakdown) -------------------------
   100 cells = $1.00, lit by hex from JSON in supplied colors.
   Remaining cells = "what survives" — left ink-toned. */
function sceneDollar(costs) {
  // costs: array of {pct, color, label}
  const cells = 100;
  const cols = 10, rows = 10;
  const total = costs.reduce((s,c)=> s+c.pct, 0); // 89
  // remaining = 11 -> "operating profit / what's left"
  const lit = [];
  costs.forEach(c => {
    for (let i=0;i<c.pct;i++) lit.push(c.color);
  });
  while (lit.length < cells) lit.push(null);

  let cells_svg = '';
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      const idx = r*cols + c;
      const fill = lit[idx];
      const x = c * 28 + 4;
      const y = r * 28 + 4;
      if (fill) {
        cells_svg += `<rect x="${x}" y="${y}" width="24" height="24" fill="${fill}" fill-opacity="0.92"/>`;
      } else {
        cells_svg += `<rect x="${x}" y="${y}" width="24" height="24" fill="none" stroke="#15130F" stroke-opacity="0.55" stroke-width="0.8" stroke-dasharray="2 2"/>`;
      }
    }
  }

  return `
<svg viewBox="0 0 296 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- top label -->
  <g font-family="'Geist Mono', monospace" font-size="10" letter-spacing="1.5" fill="#6E6A62">
    <text x="4" y="14">$1.00 OF REVENUE</text>
    <text x="292" y="14" text-anchor="end">FY '25</text>
  </g>
  <!-- 100 cells = $1.00 -->
  <g transform="translate(0 22)">${cells_svg}</g>
  <!-- bottom label -->
  <g font-family="'Geist Mono', monospace" font-size="10" letter-spacing="1.5" fill="#6E6A62">
    <text x="4" y="318">11¢ OPERATING PROFIT</text>
    <text x="292" y="318" text-anchor="end">SURVIVES</text>
  </g>
</svg>`;
}

/* -------- Geography stage -----------------------------------
   Stylized world strip (rectangles per region) + horizontal
   bar where region widths are proportional. Sized to mobile. */
function sceneGeo(regions) {
  const W = 340, H = 130;
  // build proportional bar
  let x = 0;
  const colors = ['#F25A37', '#3A3733', '#7B71F5', '#948D7E', '#C9C3B7', '#DCD7CB'];
  let segs = '';
  regions.forEach((r, i) => {
    const w = (r.pct / 100) * W;
    segs += `<rect x="${x.toFixed(1)}" y="40" width="${w.toFixed(1)}" height="40" fill="${colors[i] || '#DCD7CB'}"/>`;
    if (r.pct >= 8) {
      segs += `<text x="${(x + w/2).toFixed(1)}" y="64" text-anchor="middle" font-family="'Geist Mono', monospace" font-size="11" letter-spacing="1" fill="${i < 2 ? '#F4EFE5' : '#15130F'}" fill-opacity="0.95">${r.pct}%</text>`;
    }
    x += w;
  });

  return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g font-family="'Geist Mono', monospace" font-size="9" letter-spacing="1.5" fill="#6E6A62">
    <text x="0" y="14">SHIPMENTS BY GEOGRAPHY</text>
    <text x="${W}" y="14" text-anchor="end">FY '25</text>
  </g>
  <line x1="0" y1="22" x2="${W}" y2="22" stroke="#C9C3B4" stroke-width="0.6"/>
  <line x1="0" y1="32" x2="${W}" y2="32" stroke="#C9C3B4" stroke-width="0.6" stroke-dasharray="2 3"/>
  ${segs}
  <line x1="0" y1="86" x2="${W}" y2="86" stroke="#C9C3B4" stroke-width="0.6" stroke-dasharray="2 3"/>

  <!-- tickmarks -->
  <g font-family="'Geist Mono', monospace" font-size="8" fill="#A4A096" letter-spacing="1">
    <text x="0" y="100">0%</text>
    <text x="${W*0.25}" y="100" text-anchor="middle">25</text>
    <text x="${W*0.5}" y="100" text-anchor="middle">50</text>
    <text x="${W*0.75}" y="100" text-anchor="middle">75</text>
    <text x="${W}" y="100" text-anchor="end">100</text>
  </g>
</svg>`;
}

/* -------- The bet — fab cross-section + capex over years -----
   A stylized 300mm fab silhouette: cleanroom layers + dollar
   pumps. */
function sceneFab() {
  return `
<svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="fab-floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1A1813"/>
      <stop offset="100%" stop-color="#0C0A07"/>
    </linearGradient>
    <linearGradient id="fab-glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FF7A57" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#FF7A57" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- background grid -->
  <g stroke="#221E18" stroke-width="0.5">
    ${Array.from({length:14}, (_,i) => `<line x1="0" x2="360" y1="${i*20}" y2="${i*20}"/>`).join('')}
    ${Array.from({length:18}, (_,i) => `<line y1="0" y2="280" x1="${i*20}" x2="${i*20}"/>`).join('')}
  </g>

  <!-- ground -->
  <rect x="0" y="220" width="360" height="60" fill="url(#fab-floor)"/>

  <!-- fab building silhouette: 3 stacked cleanrooms -->
  <g>
    <!-- footprint -->
    <rect x="20" y="180" width="320" height="40" fill="#161310" stroke="#3D372E"/>
    <!-- mid floor (cleanroom) -->
    <rect x="36" y="140" width="288" height="40" fill="#1A1813" stroke="#3D372E"/>
    <!-- top floor -->
    <rect x="56" y="100" width="248" height="40" fill="#221E18" stroke="#3D372E"/>
    <!-- roof / chimney -->
    <rect x="170" y="60" width="20" height="40" fill="#221E18" stroke="#3D372E"/>
    <rect x="166" y="56" width="28" height="6" fill="#3D372E"/>
  </g>

  <!-- coral process glow leaking from cleanroom windows -->
  <g>
    ${[60, 100, 140, 180, 220, 260].map(x =>
      `<rect x="${x}" y="148" width="14" height="22" fill="url(#fab-glow)"/>`
    ).join('')}
    ${[80, 120, 160, 200, 240, 280].map(x =>
      `<rect x="${x}" y="108" width="12" height="20" fill="url(#fab-glow)"/>`
    ).join('')}
  </g>

  <!-- 300MM wafer line label -->
  <g font-family="'Geist Mono', monospace" font-size="9" letter-spacing="1.5" fill="#8A867C">
    <text x="20" y="22">FAB · 300MM CAPACITY</text>
    <text x="340" y="22" text-anchor="end">DALLAS · TX</text>
  </g>

  <!-- $4.55B capex flowing IN as arrows -->
  <g stroke="#FF7A57" stroke-width="1.4" fill="none" opacity="0.85">
    <path d="M40 50 L40 92" stroke-dasharray="3 3"/>
    <path d="M40 92 L48 86 M40 92 L32 86"/>
    <path d="M180 40 L180 56" stroke-dasharray="3 3"/>
    <path d="M180 56 L188 50 M180 56 L172 50"/>
    <path d="M320 50 L320 92" stroke-dasharray="3 3"/>
    <path d="M320 92 L328 86 M320 92 L312 86"/>
  </g>

  <!-- caption: $4.55B label -->
  <g font-family="'Geist Mono', monospace" font-size="10" letter-spacing="1" fill="#FF9E82">
    <text x="40" y="44" text-anchor="middle">$1.5B</text>
    <text x="180" y="32" text-anchor="middle">$1.5B</text>
    <text x="320" y="44" text-anchor="middle">$1.5B</text>
  </g>

  <!-- ground horizon line -->
  <line x1="0" y1="220" x2="360" y2="220" stroke="#3D372E" stroke-width="0.8"/>

  <!-- ticker at bottom -->
  <g font-family="'Geist Mono', monospace" font-size="9" letter-spacing="1.5" fill="#8A867C">
    <text x="20" y="246">CAPEX FY '25</text>
    <text x="340" y="246" text-anchor="end">$4.55B INVESTED</text>
    <text x="20" y="262">OCF</text>
    <text x="340" y="262" text-anchor="end">$7.15B GENERATED</text>
  </g>
</svg>`;
}

/* -------- Competition: market cap bubble row ------------------
   TXN center; rivals sized as squares relative to market cap. */
function sceneCompete() {
  // sizes: scale by sqrt(marketCap)
  const items = [
    { label:'TXN',  cap:213.74, color:'#F25A37', isUs:true },
    { label:'KLAC', cap:234.82, color:'#15130F' },
    { label:'ADI',  cap:181.34, color:'#15130F' },
    { label:'NXPI', cap: 54.59, color:'#15130F' },
  ];
  const max = 235;
  // arrange as a row, sized by sqrt
  const W = 340;
  const cy = 110;
  let x = 0;
  let blocks = '';
  const totalSize = items.reduce((s,i)=> s + Math.sqrt(i.cap)*10, 0);
  const gap = (W - totalSize) / (items.length + 1);
  let cx = gap;
  items.forEach((it, i) => {
    const size = Math.sqrt(it.cap) * 10;
    const y = cy - size/2;
    const txt = it.isUs ? '#F4EFE5' : '#F4EFE5';
    blocks += `
      <g>
        <rect x="${cx.toFixed(1)}" y="${y.toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" fill="${it.color}" ${it.isUs ? '' : 'fill-opacity="0.85"'}/>
        <text x="${(cx + size/2).toFixed(1)}" y="${(y + size/2 + 3).toFixed(1)}" text-anchor="middle" font-family="'Geist Mono', monospace" font-size="${size > 70 ? 12 : 10}" fill="${txt}" letter-spacing="1.5">${it.label}</text>
        <text x="${(cx + size/2).toFixed(1)}" y="${(y + size + 16).toFixed(1)}" text-anchor="middle" font-family="'Geist Mono', monospace" font-size="9" fill="#6E6A62" letter-spacing="1">$${it.cap.toFixed(0)}B</text>
      </g>`;
    cx += size + gap;
  });

  return `
<svg viewBox="0 0 ${W} 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g font-family="'Geist Mono', monospace" font-size="9" letter-spacing="1.5" fill="#6E6A62">
    <text x="0" y="14">MARKET CAP · BLOCKS TO SCALE</text>
    <text x="${W}" y="14" text-anchor="end">$B</text>
  </g>
  <line x1="0" y1="22" x2="${W}" y2="22" stroke="#DCD7CB" stroke-width="0.6"/>
  ${blocks}
  <line x1="0" y1="186" x2="${W}" y2="186" stroke="#DCD7CB" stroke-width="0.6"/>
</svg>`;
}

/* -------- Capital return: 22 years of dividend rings ---------
   Concentric rings; outermost = year 1 (smallest), innermost
   = year 22 (largest by then). Coral signal at center: "$5.00B
   returned this year". */
function sceneDivRings() {
  const W = 340, H = 200;
  const cx = W/2, cy = H/2 + 4;
  const years = 22;
  let rings = '';
  for (let i=0;i<years;i++){
    const r = 8 + i * 4.0;
    const op = 0.18 + (i/years) * 0.55;
    rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#F25A37" stroke-opacity="${op.toFixed(2)}" stroke-width="${(0.6 + i*0.05).toFixed(2)}"/>`;
  }
  // Year labels
  let labels = '';
  [
    {y: '2003', a: -Math.PI*0.85, r: 96},
    {y: '2014', a: -Math.PI*0.45, r: 96},
    {y: 'NOW',  a:  Math.PI*0.15, r: 96},
  ].forEach(l => {
    const tx = cx + Math.cos(l.a)*l.r;
    const ty = cy + Math.sin(l.a)*l.r;
    labels += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-family="'Geist Mono', monospace" font-size="9" fill="#6E6A62" letter-spacing="1.5">${l.y}</text>`;
  });

  return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g font-family="'Geist Mono', monospace" font-size="9" letter-spacing="1.5" fill="#6E6A62">
    <text x="0" y="14">22 ANNUAL DIVIDEND HIKES · ONE RING EACH</text>
  </g>
  ${rings}
  <circle cx="${cx}" cy="${cy}" r="3" fill="#F25A37"/>
  ${labels}
</svg>`;
}

/* -------- Closing wafer (smaller, mostly outline) ------------ */
function sceneClosingMark() {
  return `
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="cmsheen" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#F25A37" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#F25A37" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="120" cy="120" r="100" fill="url(#cmsheen)"/>
  <circle cx="120" cy="120" r="100" fill="none" stroke="#15130F" stroke-opacity="0.65" stroke-width="0.8"/>
  <circle cx="120" cy="120" r="86" fill="none" stroke="#15130F" stroke-opacity="0.18" stroke-width="0.4"/>
  <circle cx="120" cy="120" r="68" fill="none" stroke="#15130F" stroke-opacity="0.18" stroke-width="0.4"/>
  <circle cx="120" cy="120" r="48" fill="none" stroke="#15130F" stroke-opacity="0.20" stroke-width="0.4"/>
  <circle cx="120" cy="120" r="28" fill="none" stroke="#F25A37" stroke-opacity="0.6" stroke-width="0.6"/>

  <!-- flat edge -->
  <line x1="80" y1="208" x2="160" y2="208" stroke="#15130F" stroke-opacity="0.65" stroke-width="0.8"/>

  <!-- center coral -->
  <circle cx="120" cy="120" r="4" fill="#F25A37"/>
  <line x1="100" y1="120" x2="110" y2="120" stroke="#F25A37" stroke-width="0.8"/>
  <line x1="130" y1="120" x2="140" y2="120" stroke="#F25A37" stroke-width="0.8"/>
  <line x1="120" y1="100" x2="120" y2="110" stroke="#F25A37" stroke-width="0.8"/>
  <line x1="120" y1="130" x2="120" y2="140" stroke="#F25A37" stroke-width="0.8"/>

  <g font-family="'Geist Mono', monospace" font-size="8" letter-spacing="1.5" fill="#6E6A62">
    <text x="120" y="232" text-anchor="middle">300MM · DIE-LEVEL · DALLAS, TX</text>
  </g>
</svg>`;
}

window.SCENES = {
  sceneWafer, sceneSignalChain, sceneProductGrid,
  sceneDollar, sceneGeo, sceneFab, sceneCompete,
  sceneDivRings, sceneClosingMark
};

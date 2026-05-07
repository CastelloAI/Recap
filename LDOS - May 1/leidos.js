// Leidos recap — scroll behavior, reveals, count-ups, segment + cents render

(function () {
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  // ---------- segments data ----------
  const segments = [
    { name: "National Security & Digital", rev: 7.61, tag: "Largest segment · IT mod, mission systems, cyber" },
    { name: "Health & Civil",              rev: 5.06, tag: "Managed health, civilian agency platforms"      },
    { name: "Commercial & International",  rev: 2.32, tag: "UK, AU, MENA · energy infra adjacency"          },
    { name: "Defense Systems",             rev: 2.18, tag: "Defense platforms, maritime, sensors"           },
  ];
  const total = segments.reduce((a,s) => a+s.rev, 0);
  const segHost = $("#segments");
  if (segHost) {
    segments.forEach((s, i) => {
      const w = (s.rev / segments[0].rev) * 100;
      const el = document.createElement("div");
      el.className = "seg reveal";
      el.style.setProperty("--w", w + "%");
      el.innerHTML = `
        <div class="seg-head">
          <span class="seg-name">${s.name}</span>
          <span class="seg-rev">$${s.rev.toFixed(2)}B</span>
        </div>
        <div class="seg-bar"><div class="seg-fill"></div></div>
        <div class="seg-tag">${s.tag}</div>
      `;
      segHost.appendChild(el);
    });
  }

  // ---------- 100-cent grid ----------
  // 82 blue (cor), 4 green (sga), 1 amber (rd), 1 purple (amo), 12 outline (op income → 100% account)
  const centsHost = $("#cents");
  if (centsHost) {
    const order = [
      ...Array(82).fill("cor"),
      ...Array(4).fill("sga"),
      ...Array(1).fill("rd"),
      ...Array(1).fill("amo"),
      ...Array(12).fill("op"),
    ];
    order.forEach((cat, i) => {
      const c = document.createElement("span");
      c.className = "c";
      c.dataset.cat = cat;
      c.style.transitionDelay = (i * 8) + "ms";
      centsHost.appendChild(c);
    });
  }

  // ---------- scroll progress ----------
  const progress = $("#progress");
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.max(0, Math.min(1, window.scrollY / Math.max(1, max)));
    if (progress) progress.style.width = (pct * 100) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- reveal-on-scroll ----------
  // Add reveal class to most narrative blocks
  const revealSelectors = [
    ".hero-eyebrow", ".hero-title", ".hero-lede", ".hero-meta",
    ".reset p",
    ".beat .eyebrow", ".beat .beat-h", ".beat .beat-lede",
    ".scale", ".scale-legend",
    ".big",
    ".cents-legend", ".money-foot",
    ".map", ".map-bars .mb-row",
    ".flow-source", ".flow-buckets .fb", ".bet-card", ".flow-svg",
    ".orbits-svg", ".comp-list li",
    ".close-h", ".close-lede", ".close-meta > div", ".signoff",
    ".beat-foot",
  ];
  revealSelectors.forEach(sel => $$(sel).forEach(el => el.classList.add("reveal")));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        // segment-specific
        if (e.target.classList.contains("seg")) e.target.classList.add("is-in");
        if (e.target.id === "cents") e.target.classList.add("in");
        // count-up trigger
        if (e.target.matches(".big")) {
          const num = $(".ct", e.target);
          if (num && !num.dataset.done) {
            num.dataset.done = "1";
            countUp(num);
          }
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  $$(".reveal, .seg, #cents, #segments .seg, .mb-row, .big").forEach(el => io.observe(el));

  // map
  const mapEl = $(".map");
  if (mapEl) {
    const mio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); mio.unobserve(e.target); } });
    }, { threshold: 0.3 });
    mio.observe(mapEl);
  }

  // cents grid: trigger on scroll into view
  const centsEl = $("#cents");
  if (centsEl) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); cio.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    cio.observe(centsEl);
  }

  // mb-row width fill
  $$(".mb-row").forEach(row => {
    const mio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); mio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    mio.observe(row);
  });

  // ---------- count up ----------
  function countUp(el) {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const fmt = el.dataset.format || "";
    const dur = 1500;
    const start = performance.now();
    function tick(t) {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = to * eased;
      let txt;
      if (fmt === "comma") txt = Math.round(v).toLocaleString();
      else txt = v.toFixed(dec);
      el.textContent = txt;
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();

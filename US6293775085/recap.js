/* NRG Recap — scroll behavior, reveals, count-ups, and dollar grid */

(function () {
  'use strict';

  // ---------- Persistent chrome: progress + dark mode swap when over dark beats ----------
  var progressBar = document.getElementById('progressBar');
  var chrome = document.getElementById('chrome');
  var darkBeat = document.querySelector('.beat-debt');

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var pct = Math.max(0, Math.min(1, window.scrollY / Math.max(1, max)));
    progressBar.style.width = (pct * 100) + '%';

    // dark chrome when dark beat overlaps top
    if (darkBeat) {
      var r = darkBeat.getBoundingClientRect();
      var topThreshold = 60; // chrome height-ish
      if (r.top < topThreshold && r.bottom > topThreshold) {
        chrome.classList.add('dark');
      } else {
        chrome.classList.remove('dark');
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Reveal observer ----------
  var revealEls = document.querySelectorAll('.rv');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // Trigger any data-driven animations within the element
        runAnimations(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(function (el) { io.observe(el); });

  function runAnimations(root) {
    // Bar fills with data-w (percent)
    root.querySelectorAll('[data-w]').forEach(function (el) {
      var w = parseFloat(el.getAttribute('data-w')) || 0;
      requestAnimationFrame(function () { el.style.width = w + '%'; });
    });
    // Count-ups inside this element
    root.querySelectorAll('.countup').forEach(function (el) { startCountUp(el); });
  }

  // ---------- Count-up animations ----------
  function startCountUp(el) {
    if (el.__counted) return;
    el.__counted = true;
    var from = parseFloat(el.getAttribute('data-from')) || 0;
    var to = parseFloat(el.getAttribute('data-to')) || 0;
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var dur = 1200;
    var start = performance.now();
    function tick(now) {
      var t = Math.min(1, (now - start) / dur);
      // ease-out cubic
      var e = 1 - Math.pow(1 - t, 3);
      var v = from + (to - from) * e;
      el.textContent = v.toFixed(dec);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---------- Voltage line draw-on (hero) ----------
  var voltage = document.getElementById('voltagePath');
  if (voltage) {
    try {
      var len = voltage.getTotalLength();
      voltage.style.strokeDasharray = len;
      voltage.style.strokeDashoffset = len;
      voltage.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(0.22, 1, 0.36, 1)';
      requestAnimationFrame(function () {
        voltage.style.strokeDashoffset = '0';
      });
    } catch (e) {}
  }

  // ---------- Map regions reveal ----------
  var mapWrap = document.querySelector('.map-wrap');
  if (mapWrap) {
    var mapIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var paths = ['#west', '#east', '#texas'];
          paths.forEach(function (sel, i) {
            var el = document.querySelector(sel);
            if (!el) return;
            setTimeout(function () {
              el.style.transition = 'opacity 700ms cubic-bezier(0.22,1,0.36,1)';
              el.style.opacity = '1';
            }, 200 + i * 220);
          });
          mapIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    mapIO.observe(mapWrap);
  }

  // ---------- Returns pie arc draw ----------
  var arc = document.getElementById('returnsArc');
  if (arc) {
    var pieIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var C = 2 * Math.PI * 42; // ~263.9
          var pct = 0.80;
          arc.style.transition = 'stroke-dasharray 1.6s cubic-bezier(0.22,1,0.36,1)';
          arc.setAttribute('stroke-dasharray', (C * pct) + ' ' + C);
          pieIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    pieIO.observe(arc);
  }

  // ---------- Dollar grid (100 cents) ----------
  var grid = document.getElementById('dollarGrid');
  if (grid) {
    var spec = [
      { n: 81, c: '#E05C5C' },
      { n: 5,  c: '#5B8FD4' },
      { n: 3,  c: '#F5A623' },
      { n: 2,  c: '#7ED6A8' },
      { n: 2,  c: '#B57BDB' },
      // remaining 7 unfilled — what's left
    ];
    var total = 100;
    var cells = [];
    var idx = 0;
    spec.forEach(function (s) {
      for (var i = 0; i < s.n && idx < total; i++) {
        var d = document.createElement('div');
        d.className = 'cent lit';
        d.style.setProperty('--c', s.c);
        grid.appendChild(d);
        cells.push(d);
        idx++;
      }
    });
    while (idx < total) {
      var d2 = document.createElement('div');
      d2.className = 'cent';
      grid.appendChild(d2);
      cells.push(d2);
      idx++;
    }

    var dollarIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          cells.forEach(function (cell, i) {
            setTimeout(function () { cell.classList.add('shown'); }, 8 * i);
          });
          dollarIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    dollarIO.observe(grid);
  }

  // ---------- Scale-pan: animate the tilt deeper as user scrolls past ----------
  var bar = document.getElementById('bar');
  if (bar) {
    var beatDebt = document.querySelector('.beat-debt');
    function tickBar() {
      var r = beatDebt.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0..1 progress through the dark beat
      var p = (vh - r.top) / (vh + r.height);
      p = Math.max(0, Math.min(1, p));
      // tilt -2 → -14 deg
      var deg = -2 - p * 12;
      bar.setAttribute('transform', 'rotate(' + deg.toFixed(2) + ' 220 50)');
    }
    window.addEventListener('scroll', tickBar, { passive: true });
    tickBar();
  }
})();

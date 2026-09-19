/* KERNX 3D — Interaktionen */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Boot ---------- */
  var LOG = [
    '<b>init</b> kernx.3d ................ <i>ok</i>',
    '<b>load</b> produktsysteme ......... <i>3</i>',
    '<b>calib</b> achsen x/y/z .......... <i>ok</i>',
    '<b>bauraum</b> 256×256×256 mm ..... <i>ok</i>',
    '<b>tol</b> DIN EN ISO 2768-c ...... <i>ok</i>',
    '<b>werkstoffe</b> PLA PETG TPU .... <i>4</i>',
    '<b>render</b> pipeline ............ <i>ok</i>'
  ];
  var blog = $('#blog'), bfl = $('#bfl'), bpct = $('#bpct'), boot = $('#boot');
  var bi = 0, bp = 0, started = false;
  function go() { if (started) return; started = true; lattice(); }
  if (boot) {
    var t1 = setInterval(function () { if (bi < LOG.length && blog) blog.innerHTML += LOG[bi++] + '<br>'; }, 120);
    var t2 = setInterval(function () {
      bp = Math.min(100, bp + Math.random() * 11 + 4);
      if (bfl) bfl.style.width = bp + '%';
      if (bpct) bpct.textContent = ('0' + Math.floor(bp)).slice(-2) + '%';
      if (bp >= 100) {
        clearInterval(t1); clearInterval(t2);
        setTimeout(function () { boot.classList.add('off'); go(); }, 420);
      }
    }, 110);
    setTimeout(function () { if (!started) { boot.classList.add('off'); go(); } }, 5200);
  } else { go(); }

  /* ---------- Cursor ---------- */
  var cur = $('#cur'), curd = $('#curd');
  var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (curd) curd.style.transform = 'translate(' + (mx - 1.5) + 'px,' + (my - 1.5) + 'px)';
  });
  (function loop() {
    cx += (mx - cx) * .15; cy += (my - cy) * .15;
    if (cur) cur.style.transform = 'translate(' + (cx - 20) + 'px,' + (cy - 20) + 'px)';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', function (e) {
    if (!cur) return;
    var h = e.target.closest('a,button,.sysc,.mxc,.lzc,.gal button');
    cur.style.width = cur.style.height = h ? '64px' : '40px';
    cur.style.borderRadius = h ? '6px' : '50%';
  });

  /* ---------- Header + Progress ---------- */
  var hd = $('#hd'), prog = $('#prog');
  addEventListener('scroll', function () {
    if (hd) hd.classList.toggle('on', scrollY > 30);
    if (prog) {
      var h = document.body.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    }
  }, { passive: true });

  /* ---------- Mobile ---------- */
  var mob = $('#mob');
  $$('[data-mo]').forEach(function (b) { b.onclick = function () { mob.classList.add('open'); document.body.style.overflow = 'hidden'; }; });
  $$('[data-mc]').forEach(function (b) { b.onclick = function () { mob.classList.remove('open'); document.body.style.overflow = ''; }; });
  if (mob) $$('a', mob).forEach(function (a) { a.onclick = function () { mob.classList.remove('open'); document.body.style.overflow = ''; }; });

  /* ---------- Reveal ---------- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Counter ---------- */
  $$('[data-c]').forEach(function (el) {
    var tv = parseFloat(el.getAttribute('data-c'));
    if (!('IntersectionObserver' in window) || RM) { el.textContent = tv; return; }
    var o = new IntersectionObserver(function (es, ob) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; ob.disconnect();
        var t0 = null;
        (function a(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / 900);
          el.textContent = Math.round(tv * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(a);
        })(performance.now());
      });
    }, { threshold: .5 });
    o.observe(el);
  });

  /* ---------- HUD-Werte ---------- */
  var r1 = $('#r1'), r2 = $('#r2');
  if (r1 && r2 && !RM) setInterval(function () {
    r1.textContent = ('00' + (80 + Math.floor(Math.random() * 201))).slice(-3);
    r2.textContent = '±' + (0.08 + Math.random() * 0.04).toFixed(2);
  }, 260);

  /* ---------- Hero-Gitter (Canvas) ---------- */
  function lattice() {
    var c = $('#lattice'); if (!c || RM) return;
    var x = c.getContext('2d'), pts = [], W, H;
    function fit() {
      var d = Math.min(devicePixelRatio || 1, 2);
      W = c.clientWidth; H = c.clientHeight;
      c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
      var n = Math.min(90, Math.floor(W / 16));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .26, vy: (Math.random() - .5) * .26
      });
    }
    new ResizeObserver(fit).observe(c); fit();
    (function draw() {
      x.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (var a = 0; a < pts.length; a++) {
        for (var b = a + 1; b < pts.length; b++) {
          var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y, d = Math.hypot(dx, dy);
          if (d < 124) {
            x.strokeStyle = 'rgba(240,135,58,' + ((1 - d / 124) * .2).toFixed(3) + ')';
            x.lineWidth = .6; x.beginPath();
            x.moveTo(pts[a].x, pts[a].y); x.lineTo(pts[b].x, pts[b].y); x.stroke();
          }
        }
        var dm = Math.hypot(pts[a].x - mx, pts[a].y - my);
        x.fillStyle = dm < 150 ? 'rgba(255,176,113,.9)' : 'rgba(195,210,230,.34)';
        x.beginPath(); x.arc(pts[a].x, pts[a].y, dm < 150 ? 1.9 : 1.1, 0, 7); x.fill();
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- Galerie ---------- */
  var gal = $('#gal');
  if (gal && window.G3D) {
    var D = window.G3D, L = window.L3D || {}, f = 'all', shown = 12, list = [];
    function render() {
      list = D.filter(function (g) { return f === 'all' || g.c === f; });
      gal.innerHTML = list.slice(0, shown).map(function (g, i) {
        return '<button type="button" data-i="' + i + '" aria-label="' + g.t + ' vergrößern">' +
          '<img src="assets/img/' + g.f + '-800.jpg" alt="' + g.t + '" loading="lazy" decoding="async">' +
          '<span>' + (L[g.c] || g.c) + ' · Symbolbild</span></button>';
      }).join('');
      var m = $('#more'); if (m) m.hidden = shown >= list.length;
      var gc = $('#gc'); if (gc) gc.textContent = Math.min(shown, list.length) + ' / ' + list.length;
    }
    $$('.flt button').forEach(function (b) {
      b.onclick = function () {
        $$('.flt button').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        f = b.getAttribute('data-f'); shown = 12; render();
      };
    });
    var mo = $('#more'); if (mo) mo.onclick = function () { shown += 12; render(); };
    render();

    var lb = $('#lb'), lbi = $('#lbi'), lbc = $('#lbc'), cu = 0, last = null;
    function show(i) {
      if (!list.length) return;
      cu = (i + list.length) % list.length;
      var g = list[cu];
      lbi.src = 'assets/img/' + g.f + '-1280.webp'; lbi.alt = g.t;
      lbc.textContent = g.t + ' · ' + (L[g.c] || g.c) + ' · ' + (cu + 1) + '/' + list.length;
    }
    gal.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      last = b; show(+b.getAttribute('data-i'));
      lb.classList.add('open'); document.body.style.overflow = 'hidden';
      $('.x', lb).focus();
    });
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; if (last) last.focus(); }
    if (lb) {
      $('.x', lb).onclick = close;
      $('.pv', lb).onclick = function () { show(cu - 1); };
      $('.nx', lb).onclick = function () { show(cu + 1); };
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(cu - 1);
        if (e.key === 'ArrowRight') show(cu + 1);
      });
      var sx = 0;
      lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (e) {
        var d = e.changedTouches[0].clientX - sx;
        if (Math.abs(d) > 55) show(cu + (d < 0 ? 1 : -1));
      });
    }
  }

  $$('[data-y]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

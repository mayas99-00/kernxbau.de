/* KERNX BAU — Interaktionen 2026 */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Header + Scroll-Progress ---------- */
  var hd = $('#hd'), prog = $('#prog');
  function onScroll() {
    if (hd) hd.classList.toggle('on', scrollY > 30);
    if (prog) {
      var h = document.body.scrollHeight - innerHeight;
      prog.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobiles Menü ---------- */
  var mob = $('#mob');
  $$('[data-menu-open]').forEach(function (b) {
    b.onclick = function () { if (mob) { mob.classList.add('open'); document.body.style.overflow = 'hidden'; } };
  });
  $$('[data-menu-close]').forEach(function (b) {
    b.onclick = function () { if (mob) { mob.classList.remove('open'); document.body.style.overflow = ''; } };
  });
  if (mob) $$('a', mob).forEach(function (a) {
    a.onclick = function () { mob.classList.remove('open'); document.body.style.overflow = ''; };
  });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mob && mob.classList.contains('open')) {
      mob.classList.remove('open'); document.body.style.overflow = '';
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var rv = $$('.rv');
  if (rv.length) {
    if ('IntersectionObserver' in window && !RM) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      rv.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
        io.observe(el);
      });
    } else {
      rv.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- Sticky Ablauf-Story ---------- */
  var steps = $$('.step'), vis = $$('.story__vis img'),
      snum = $('#storyNum'), sbar = $('#storyBar');
  if (steps.length && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = +e.target.getAttribute('data-i');
        steps.forEach(function (s) { s.classList.toggle('on', s === e.target); });
        vis.forEach(function (v, k) { v.classList.toggle('on', k === i); });
        if (snum) snum.textContent = ('0' + (i + 1)).slice(-2);
        if (sbar) sbar.style.width = ((i + 1) / steps.length) * 100 + '%';
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- Horizontaler Foto-Streifen (scrollgesteuert) ---------- */
  var strip = $('#strip');
  if (strip) {
    if (RM) { strip.parentElement.style.overflowX = 'auto'; }
    else {
      var tick = false;
      addEventListener('scroll', function () {
        if (tick) return; tick = true;
        requestAnimationFrame(function () {
          tick = false;
          var r = strip.getBoundingClientRect();
          var p = (innerHeight - r.top) / (innerHeight + r.height);
          p = Math.max(0, Math.min(1, p));
          var max = strip.scrollWidth - innerWidth + innerWidth * 0.08;
          if (max > 0) strip.style.transform = 'translateX(' + (-p * max) + 'px)';
        });
      }, { passive: true });
    }
  }

  /* ---------- Zähler ---------- */
  $$('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dec = (el.getAttribute('data-dec') | 0);
    if (!('IntersectionObserver' in window) || RM) { el.textContent = target.toFixed(dec) + suffix; return; }
    var cio = new IntersectionObserver(function (es, ob) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        ob.disconnect();
        var v = 0, t0 = null;
        (function anim(t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / 1100);
          v = target * (1 - Math.pow(1 - k, 3));
          el.textContent = v.toFixed(dec) + suffix;
          if (k < 1) requestAnimationFrame(anim);
        })(performance.now());
      });
    }, { threshold: 0.5 });
    cio.observe(el);
  });

  /* ---------- Galerie: Filter + Lightbox ---------- */
  var gal = $('#gal');
  if (gal && window.KERNX_GALLERY) {
    var DATA = window.KERNX_GALLERY;
    var LABEL = window.KERNX_GALLERY_LABELS || {};
    var filter = 'all', shown = 15, list = [];

    function render() {
      list = DATA.filter(function (g) { return filter === 'all' || g.c === filter; });
      gal.innerHTML = list.slice(0, shown).map(function (g, i) {
        return '<button type="button" data-i="' + i + '" aria-label="' + g.t + ' vergrößern">' +
          '<img src="assets/img/' + g.f + '-800.jpg" alt="' + g.t + '" loading="lazy" decoding="async">' +
          '<span>' + (LABEL[g.c] || g.c) + ' · Symbolbild</span></button>';
      }).join('');
      var more = $('#galMore');
      if (more) more.hidden = shown >= list.length;
      var cnt = $('#galCount');
      if (cnt) cnt.textContent = Math.min(shown, list.length) + ' / ' + list.length;
    }
    $$('.filt button').forEach(function (b) {
      b.onclick = function () {
        $$('.filt button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        filter = b.getAttribute('data-f'); shown = 15; render();
      };
    });
    var moreBtn = $('#galMore');
    if (moreBtn) moreBtn.onclick = function () { shown += 15; render(); };
    render();

    var lb = $('#lb'), lbi = $('#lbImg'), lbc = $('#lbCap'), cur = 0, lastBtn = null;
    function show(i) {
      if (!list.length) return;
      cur = (i + list.length) % list.length;
      var g = list[cur];
      lbi.src = 'assets/img/' + g.f + '-1600.webp';
      lbi.alt = g.t;
      lbc.textContent = g.t + ' · ' + (LABEL[g.c] || g.c) + ' · ' + (cur + 1) + '/' + list.length;
    }
    gal.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      lastBtn = b; show(+b.getAttribute('data-i'));
      lb.classList.add('open'); document.body.style.overflow = 'hidden';
      $('.x', lb).focus();
    });
    function close() {
      lb.classList.remove('open'); document.body.style.overflow = '';
      if (lastBtn) lastBtn.focus();
    }
    if (lb) {
      $('.x', lb).onclick = close;
      $('.pv', lb).onclick = function () { show(cur - 1); };
      $('.nx', lb).onclick = function () { show(cur + 1); };
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(cur - 1);
        if (e.key === 'ArrowRight') show(cur + 1);
      });
      var sx = 0;
      lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (e) {
        var d = e.changedTouches[0].clientX - sx;
        if (Math.abs(d) > 55) show(cur + (d < 0 ? 1 : -1));
      });
    }
  }

  /* ---------- Kontaktformular: mailto-Zusammenbau ---------- */
  var form = $('#anfrageForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var svc = fd.getAll('leistung');
      var lines = [
        'Name: ' + (fd.get('name') || ''),
        'Firma: ' + (fd.get('firma') || ''),
        'E-Mail: ' + (fd.get('email') || ''),
        'Telefon: ' + (fd.get('telefon') || ''),
        'Ort / PLZ: ' + (fd.get('ort') || ''),
        'Zeitraum: ' + (fd.get('zeitraum') || ''),
        '',
        'Gewünschte Leistungen:',
        svc.length ? svc.map(function (s) { return '- ' + s; }).join('\n') : '- keine Angabe',
        '',
        'Nachricht:',
        (fd.get('nachricht') || '')
      ];
      var mail = form.getAttribute('data-mail') || 'info@kernxbau.de';
      location.href = 'mailto:' + mail +
        '?subject=' + encodeURIComponent('Anfrage über kernxbau.de') +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var ok = $('#formHint');
      if (ok) ok.hidden = false;
    });
  }

  /* ---------- Jahr im Footer ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();


/* ── Kapitel automatisch vergeben, wo sie nicht im Markup stehen ── */
(function(){
  if (document.querySelector('section[data-ch]')) return;          // Startseite: manuell gesetzt
  var secs = [].slice.call(document.querySelectorAll('main > section'))
    .filter(function(s){ return s.querySelector('.sec-head') && !s.classList.contains('phero'); });
  if (secs.length < 3) return;
  secs.forEach(function(s,i){
    var n = ('0' + (i % 6 + 1)).slice(-2);
    s.setAttribute('data-ch', n);
    var k = s.querySelector('.kicker'), h = s.querySelector('h2');
    var t = (k && k.textContent || '').replace(/^\s*\d+\s*[—–-]\s*/,'').trim();
    if (!t || t.length > 26) t = (h && h.textContent || 'Abschnitt').replace(/[.:].*$/,'').trim();
    if (t.length > 26) t = t.slice(0,24) + '…';
    s.setAttribute('data-ch-t', t);
    if (!s.id) s.id = 'kapitel-' + n;
    if (!s.querySelector('.chno')){
      var b = document.createElement('span');
      b.className = 'chno'; b.setAttribute('aria-hidden','true'); b.textContent = n;
      s.insertBefore(b, s.firstChild);
    }
  });
})();

/* ── Kapitel-Rail: zeigt, wo man auf der Seite steht ───────── */
(function(){
  var secs = [].slice.call(document.querySelectorAll('section[data-ch]'));
  if (secs.length < 3) return;
  var rail = document.createElement('nav');
  rail.className = 'rail'; rail.setAttribute('aria-label','Kapitel dieser Seite');
  rail.innerHTML = secs.map(function(s){
    return '<a href="#'+s.id+'" data-r="'+s.id+'"><i></i><span>'+
           s.getAttribute('data-ch')+' · '+s.getAttribute('data-ch-t')+'</span></a>';
  }).join('');
  document.body.appendChild(rail);
  var links = [].slice.call(rail.querySelectorAll('a'));
  function mark(id){
    links.forEach(function(a){
      if (a.getAttribute('data-r') === id) a.setAttribute('aria-current','true');
      else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) mark(e.target.id); });
    }, {rootMargin:'-45% 0px -45% 0px'});
    secs.forEach(function(s){ io.observe(s); });
  }
  addEventListener('scroll', function(){
    rail.classList.toggle('on', scrollY > innerHeight * .7);
  }, {passive:true});
})();

/* ── Einstiegs-Sequenz (KERNX APP / KERNX LIVE) ───────────── */
(function(){
  var el = document.getElementById('kboot');
  if (!el) return;
  document.body.appendChild(el);          // aus dem Stapelkontext von <main> lösen
  if (matchMedia('(prefers-reduced-motion: reduce)').matches){ el.remove(); return; }
  var log = el.querySelector('.kboot__log'),
      fl  = el.querySelector('.kboot__fl'),
      pct = el.querySelector('[data-pct]'),
      LINES = JSON.parse(el.getAttribute('data-lines') || '[]');
  document.body.style.overflow = 'hidden';
  var i = 0, p = 0, done = false;
  function finish(){
    if (done) return; done = true;
    el.classList.add('off');
    document.body.style.overflow = '';
    setTimeout(function(){ el.remove(); }, 800);
  }
  var t1 = setInterval(function(){
    if (i >= LINES.length){ clearInterval(t1); return; }
    var L = LINES[i++], row = document.createElement('div');
    row.innerHTML = '<b>' + L[0] + '</b> ' + L[1] +
      ' <i data-v="' + L[2] + '">' + (/^\d+$/.test(L[2]) ? '0' : '…') + '</i>';
    log.appendChild(row);
    var v = row.querySelector('i'), target = L[2];
    if (/^\d+$/.test(target) && +target <= 99){      // nur kleine Zahlen zählen hoch
      var n = 0, step = Math.max(1, Math.ceil(+target / 14));
      var c = setInterval(function(){
        n = Math.min(+target, n + step); v.textContent = n;
        if (n >= +target) clearInterval(c);
      }, 40);
    } else {
      setTimeout(function(){ v.textContent = target; }, 260);
    }
  }, 190);
  var t2 = setInterval(function(){
    p = Math.min(100, p + Math.random() * 13 + 5);
    if (fl) fl.style.width = p + '%';
    if (pct) pct.textContent = ('0' + Math.floor(p)).slice(-2) + '%';
    if (p >= 100){ clearInterval(t1); clearInterval(t2); setTimeout(finish, 460); }
  }, 170);
  setTimeout(finish, 5200);                           // harte Notbremse
})();

/* ── Vorhang beim ersten Laden ────────────────────────────── */
(function(){
  var c = document.getElementById('curtain');
  if (!c) return;
  document.body.appendChild(c);           // aus dem Stapelkontext von <main> lösen
  if (matchMedia('(prefers-reduced-motion: reduce)').matches){ c.remove(); return; }
  var fl = c.querySelector('.curtain__fill'), n = c.querySelector('.curtain__n'), p = 0, done = false;
  document.body.style.overflow = 'hidden';
  function go(){
    if (done) return; done = true;
    c.classList.add('off'); document.body.style.overflow = '';
    setTimeout(function(){ c.remove(); }, 1100);
  }
  var t = setInterval(function(){
    p = Math.min(100, p + Math.random() * 16 + 6);
    fl.style.width = p + '%';
    n.textContent = ('0' + Math.floor(p)).slice(-2);
    if (p >= 100){ clearInterval(t); setTimeout(go, 380); }
  }, 130);
  setTimeout(go, 4200);
})();

/* ── Bewegung, die man merkt ───────────────────────────────── */
(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) return;
  var $$ = function(s){ return [].slice.call(document.querySelectorAll(s)); };

  /* 1) Überschriften wortweise aufziehen */
  $$('.sec-head h2, .phero h1, .hero h1, .feat__p h3').forEach(function(h){
    if (h.querySelector('.wsplit') || h.children.length > 2) return;
    var parts = [];
    [].slice.call(h.childNodes).forEach(function(nd){
      if (nd.nodeType === 3){
        nd.textContent.split(/(\s+)/).forEach(function(w){
          parts.push(/^\s+$/.test(w) ? ' ' :
            '<span class="wsplit"><span>' + w + '</span></span>');
        });
      } else parts.push(nd.outerHTML || '');
    });
    h.innerHTML = parts.join('');
    var sp = h.querySelectorAll('.wsplit>span');
    [].forEach.call(sp, function(el,i){ el.style.transitionDelay = (i * 42) + 'ms'; });
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(es){
        es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
      }, {threshold:.25});
      [].forEach.call(h.querySelectorAll('.wsplit'), function(w){ io.observe(w); });
    } else h.classList.add('in');
  });

  /* 2) Lichtkegel folgt dem Zeiger */
  var sel = '.mod,.fact,.markcard,.reel__c,.scope>div,.prin__g>div,.app-mod';
  document.addEventListener('mousemove', function(e){
    var card = e.target.closest && e.target.closest(sel);
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  }, {passive:true});

  /* 3) Magnetische Buttons */
  $$('.btn').forEach(function(b){
    b.addEventListener('mousemove', function(e){
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width/2) * .16) + 'px,' +
                          ((e.clientY - r.top - r.height/2) * .22) + 'px)';
    });
    b.addEventListener('mouseleave', function(){ b.style.transform = ''; });
  });

  /* 4) Bilder atmen beim Scrollen */
  var par = $$('.split__v img, .feat__v img');
  if (par.length){
    var tick = false;
    addEventListener('scroll', function(){
      if (tick) return; tick = true;
      requestAnimationFrame(function(){
        par.forEach(function(img){
          var r = img.getBoundingClientRect();
          if (r.bottom < -100 || r.top > innerHeight + 100) return;
          var k = (r.top + r.height/2 - innerHeight/2) / innerHeight;
          img.style.transform = 'scale(1.09) translateY(' + (k * -22).toFixed(1) + 'px)';
        });
        tick = false;
      });
    }, {passive:true});
  }
})();

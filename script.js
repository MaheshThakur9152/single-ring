(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const rad = (deg) => (deg * Math.PI) / 180;
  const f = (n) => n.toFixed(1);

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const line = (p, x1, y1, x2, y2, extra = {}) => el('line', { x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), pathLength: 1, ...extra }, p);
  const path = (p, d, extra = {}) => el('path', { d, pathLength: 1, ...extra }, p);

  /* ---------- hero: rays, spears, dial, beads, fan ---------- */
  const rays = document.querySelector('.rays');
  for (let i = 0; i < 72; i++) {
    const a = rad(i * 5), r = i % 2 ? 640 : 1000;
    line(rays, 0, 0, Math.cos(a) * r, Math.sin(a) * r, { style: `--d:${(i % 12) * 0.03}s;--t:1.2s` });
  }

  const cx = 300, cy = 330;
  const spears = document.querySelector('.arch .spears');
  for (let i = 0; i < 9; i++) {
    const a = rad(-90 + (i - 4) * 14), c = Math.cos(a), s = Math.sin(a);
    const d = `--d:${0.5 + Math.abs(i - 4) * 0.06}s;--t:.6s`;
    line(spears, cx + c * 142, cy + s * 142, cx + c * 166, cy + s * 166, { style: d });
    // lozenge tip
    const tx = cx + c * 174, ty = cy + s * 174, px = -s, py = c;
    path(spears, `M${f(cx + c * 166)} ${f(cy + s * 166)}L${f(tx + px * 4)} ${f(ty + py * 4)}L${f(cx + c * 182)} ${f(cy + s * 182)}L${f(tx - px * 4)} ${f(ty - py * 4)}Z`, { style: d });
  }

  const dial = document.querySelector('.arch .dial');
  for (let i = 0; i < 60; i++) {
    const a = rad(i * 6 - 90), r2 = i % 5 ? 122 : 128;
    line(dial, cx + Math.cos(a) * 117, cy + Math.sin(a) * 117, cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, { style: `--d:${0.6 + i * 0.012}s;--t:.25s` });
  }
  const arch = document.querySelector('.arch');
  for (let i = 0; i < 40; i++) {
    const a = rad(i * 9 - 90);
    el('circle', { class: 'bead', cx: f(cx + Math.cos(a) * 134), cy: f(cy + Math.sin(a) * 134), r: 1.8, style: `--d:${1 + i * 0.012}s` }, dial);
  }

  const fan = document.querySelector('.arch .fan');
  const fx = 300, fy = 860, fr = 56;
  const fd = (k) => `--d:${1.1 + k * 0.04}s;--t:.6s`;
  path(fan, `M${fx - fr} ${fy}A${fr} ${fr} 0 0 1 ${fx + fr} ${fy}`, { style: fd(0) });
  path(fan, `M${fx - 22} ${fy}A22 22 0 0 1 ${fx + 22} ${fy}`, { style: fd(1) });
  for (let i = 1; i < 12; i++) {
    const a = rad(180 + i * 15);
    line(fan, fx + Math.cos(a) * 22, fy + Math.sin(a) * 22, fx + Math.cos(a) * fr, fy + Math.sin(a) * fr, { style: fd(i % 6) });
  }

  // name letters rise one by one
  const word = document.querySelector('.name .word');
  word.innerHTML = [...word.textContent].map((c, i) => `<span class="ch" aria-hidden="true" style="--d:${0.7 + i * 0.08}s">${c}</span>`).join('');

  /* ---------- crests: draw when the section arrives ---------- */
  let crest = 'M8 50H38M82 50H112M38 50A22 22 0 0 1 82 50M49 50A11 11 0 0 1 71 50M60 2l4 6-4 6-4-6Z M2 50l4-3 4 3-4 3Z M110 50l4-3 4 3-4 3Z';
  for (let i = 0; i <= 12; i++) {
    const a = rad(180 + i * 15), r2 = i % 2 ? 40 : 46;
    crest += `M${f(60 + Math.cos(a) * 26)} ${f(50 + Math.sin(a) * 26)}L${f(60 + Math.cos(a) * r2)} ${f(50 + Math.sin(a) * r2)}`;
  }
  const crestParts = crest.split(/(?=M)/);
  document.querySelectorAll('.crest').forEach((c) => {
    c.innerHTML = `<svg viewBox="0 0 120 60">${crestParts.map((d, i) => `<path pathLength="1" d="${d}" style="--d:${(i * 0.05).toFixed(2)}s"/>`).join('')}</svg>`;
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.crest, .map').forEach((c) => io.observe(c));

  /* ---------- engraving of the ring ---------- */
  const eng = document.querySelector('.engraving');
  const parts = []; // [element, start, end] of scroll progress
  const add = (e, s, t) => { parts.push([e, s, t]); return e; };
  const sx = 300, sy = 215;
  for (let a = 196; a <= 344; a += 8) {
    add(line(eng, sx + Math.cos(rad(a)) * 232, sy + Math.sin(rad(a)) * 232, sx + Math.cos(rad(a)) * (a % 16 ? 262 : 292), sy + Math.sin(rad(a)) * (a % 16 ? 262 : 292), { class: 'faint' }), 0.72, 0.95);
  }
  // stepped stage
  add(path(eng, 'M150 572H450M130 590V572H470V590M110 608V590H490V608M90 608H510'), 0, 0.18);
  for (let x = 150; x <= 450; x += 30) add(line(eng, x, 592, x, 606, { class: 'faint' }), 0.1, 0.22);
  // band, hidden behind the crown at the top
  add(path(eng, 'M204 295A150 150 0 1 0 396 295'), 0.12, 0.38);
  add(path(eng, 'M244 295A128 128 0 1 0 356 295'), 0.18, 0.42);
  add(path(eng, 'M212 316C236 300 262 296 300 296C338 296 364 300 388 316', { class: 'faint' }), 0.3, 0.45);
  // the spiral crown, flattened into perspective
  const spiral = (r0, r1, sy2) => {
    let d = '';
    for (let i = 0; i <= 220; i++) {
      const t = i / 220, th = t * 4 * Math.PI + Math.PI * 0.5, r = r0 + (r1 - r0) * t;
      d += `${i ? 'L' : 'M'}${f(sx + r * Math.cos(th))} ${f(sy + r * Math.sin(th) * sy2)}`;
    }
    return d;
  };
  add(path(eng, spiral(8, 206, 0.42)), 0.36, 0.7);
  add(path(eng, spiral(0, 176, 0.42)), 0.42, 0.74);
  add(path(eng, spiral(8, 206, 0.42), { transform: 'translate(0 10)', class: 'faint' }), 0.5, 0.78);
  // pavé stones along the spiral
  const stones = el('g', {}, eng);
  for (let i = 8; i <= 120; i++) {
    const t = i / 120, th = t * 4 * Math.PI + Math.PI * 0.5, r = 4 + 187 * t;
    const c = el('circle', { class: 'stone', cx: f(sx + r * Math.cos(th)), cy: f(sy + r * Math.sin(th) * 0.42), r: f(2.2 + t * 2.6), pathLength: 1 }, stones);
    add(c, 0.58 + t * 0.3, 0.62 + t * 0.3);
  }
  // labels
  const label = (x, y, lx, ly, txt) => {
    add(line(eng, lx, ly, x, y + (y < ly ? 6 : -16), { class: 'faint' }), 0.88, 0.96);
    const t = el('text', { x, y, 'text-anchor': 'middle' }, eng); t.textContent = txt;
    parts.push([t, 0.92, 1, 'fade']);
  };
  label(520, 92, 470, 190, 'Crown');
  label(72, 372, 120, 240, 'Stones');
  label(530, 520, 452, 452, 'Band');

  /* ---------- illustrated map ---------- */
  const map = document.querySelector('.map svg');
  const mp = (d, w = 1.2, extra = {}) => path(map, d, { 'stroke-width': w, ...extra });
  mp('M0 300C120 280 180 360 300 340S480 260 600 290', 1, { opacity: .5 });
  mp('M0 308C120 288 180 368 300 348S480 268 600 298', 1, { opacity: .5 });
  ['M0 96H600', 'M0 104H600', 'M0 206H600', 'M0 214H600', 'M116 0V420', 'M124 0V420', 'M300 0V300', 'M308 0V300', 'M476 0V420', 'M484 0V420', 'M0 40L250 210', 'M300 360V420']
    .forEach((d, i) => mp(d, 1.2, { style: `--d:${i * 0.06}s` }));
  mp('M150 130H270V180H150Z', .8, { opacity: .6 });
  for (let x = 165; x < 270; x += 18) el('circle', { cx: x, cy: 155, r: 5, 'stroke-width': .8, opacity: .6 }, map);
  // marker: a small sunburst at the corner
  const mx = 390, my = 160;
  mp(`M${mx} ${my - 18}l9 18-9 18-9-18Z`, 1.4);
  for (let i = 0; i < 16; i++) {
    const a = rad(i * 22.5), r2 = i % 2 ? 26 : 34;
    line(map, mx + Math.cos(a) * 21, my + Math.sin(a) * 21, mx + Math.cos(a) * r2, my + Math.sin(a) * r2, { 'stroke-width': 1 });
  }
  el('circle', { cx: mx, cy: my, r: 3, fill: 'var(--gold)', stroke: 'none' }, map);
  const mt = (x, y, txt, rot) => { const t = el('text', { x, y, 'text-anchor': 'middle', transform: rot ? `rotate(-90 ${x} ${y})` : '' }, map); t.textContent = txt; };
  mt(390, 240, '[Your street]');
  mt(200, 90, '[Cross street]');
  mt(100, 300, '[Avenue]', true);
  mt(390, 120, '[We are here]');
  map.querySelectorAll('[pathLength]').forEach((p) => p.classList.add('mp'));

  /* ---------- pinned scroll sections ---------- */
  const details = document.querySelector('.details');
  const items = [...details.querySelectorAll('.dt-item')];
  const now = details.querySelector('.dt-now');
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const drawing = document.querySelector('.drawing');

  if (!calm) {
    details.classList.add('pin');
    drawing.classList.add('pin');
  } else {
    parts.forEach(([e]) => e.style.opacity = 1);
  }

  const progress = (sec) => {
    const r = sec.getBoundingClientRect();
    const span = sec.offsetHeight - innerHeight;
    return span > 0 ? clamp(-r.top / span) : 1;
  };

  function frame() {
    ticking = false;
    if (calm) return;

    // details: one at a time, fan sweeps open, icon draws stroke by stroke
    const p = progress(details) * items.length;
    const active = Math.min(items.length - 1, Math.floor(p));
    const local = clamp(p - active);
    items.forEach((it, k) => {
      const on = k === active;
      it.classList.toggle('on', on);
      const lp = k < active ? 1 : on ? local : 0;
      const sweep = clamp(lp / 0.5) * 180;
      it.style.setProperty('--sweep', sweep.toFixed(1));
      it.style.setProperty('--rib', sweep > 0 && sweep < 180 ? 1 : 0);
      it.style.setProperty('--txt', clamp((lp - 0.2) / 0.3).toFixed(3));
      const strokes = it.querySelectorAll('.dt-icon [pathLength]');
      strokes.forEach((s, j) => {
        const st = 0.05 + (j / strokes.length) * 0.35;
        s.style.setProperty('--draw', (1 - clamp((lp - st) / 0.25)).toFixed(3));
      });
    });
    now.textContent = roman[active];

    // engraving traces itself
    const q = progress(drawing) * 1.08;
    parts.forEach(([e, s, t, mode]) => {
      const k = clamp((q - s) / (t - s));
      if (mode === 'fade') e.style.opacity = k;
      else e.style.strokeDashoffset = 1 - k;
    });
  }
  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  /* ---------- nav background after the hero ---------- */
  const nav = document.querySelector('.nav');
  const navCheck = () => nav.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', navCheck, { passive: true });
  navCheck();

  /* ---------- RSVP: opens the visitor's email app ---------- */
  const EMAIL = 'you@example.com'; // PLACEHOLDER: replace with your real email address
  const form = document.querySelector('.rsvp-form');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((i) => {
      const bad = !i.value.trim() || (i.type === 'email' && !i.checkValidity());
      i.setAttribute('aria-invalid', bad);
      if (bad && ok) { i.focus(); ok = false; }
    });
    const note = form.querySelector('.form-note');
    if (!ok) { note.textContent = 'Please add your name and a valid email.'; return; }
    const v = Object.fromEntries(new FormData(form));
    const body = `Name: ${v.name}\nEmail: ${v.email}\nPhone: ${v.phone || '-'}\nPreferred date: ${v.date || '-'}\n\n${v.msg || ''}`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Viewing request: The Spiral')}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Your email app should open now. Press send there to finish.';
  });
})();

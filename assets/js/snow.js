(() => {
  const c = document.getElementById('snow');
  if (!c) return;

  const ctx = c.getContext('2d', {alpha: true});
  if (!ctx) return;

  let w = 0, h = 0, dpr = 1;
  const flakes = [];
  let rafId = 0;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function computeFlakeCount(width, height) {
    const baseArea = 1440 * 900;
    const area = width * height;
    const n = Math.round(160 * (area / baseArea));
    return clamp(n, 90, 260);
  }

  function resize() {
    dpr = clamp(window.devicePixelRatio || 1, 1, 2.5);
    w = window.innerWidth;
    h = window.innerHeight;

    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const N = computeFlakeCount(w, h);

    flakes.length = 0;
    for (let i = 0; i < N; i++) {
      const s = rand(0.15, 0.7) * (Math.random() < 0.5 ? -1 : 1);
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(0.8, 2.2),
        v: rand(0.35, 1.3),
        s,
        a: rand(0.25, 0.65),
        p: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const f of flakes) {
      f.y += f.v;
      f.p += 0.004;
      f.x += f.s + Math.sin(f.p) * 0.35;

      if (f.y > h + 10) {
        f.y = -10;
        f.x = Math.random() * w;
      }
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${f.a})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  window.addEventListener('resize', () => {
    resize();
    draw();
  }, {passive: true});

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  resize();
  draw();
  start();
})();

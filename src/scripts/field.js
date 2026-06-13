/* The Field (7.3): hand-rolled canvas particle field behind the home hero.
   120 to 180 dim points drifting slowly, hairline connections by proximity.
   Scroll reduces noise and drifts points toward alignment; the field fades
   out entirely by 80 percent of the first viewport.

   Guardrails: rAF capped at 60fps, paused when the tab is hidden or the
   hero leaves the viewport, point count halved below 768px, automatic
   point reduction if frame time exceeds 8ms, disabled under
   prefers-reduced-motion (a static CSS texture shows instead). */

export function initField(canvas, hero) {
  if (!canvas || !hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0;
  let H = 0;
  let points = [];
  let running = false;
  let rafId = 0;
  let lastFrame = 0;
  let visible = true;
  let tabVisible = !document.hidden;

  // Frame-time guard
  let slowFrames = 0;

  const LANE = 88; // alignment lattice rows
  const PROX = 92; // connection distance
  const FRAME_MIN = 1000 / 61; // 60fps cap

  function targetCount() {
    const base = window.innerWidth < 768 ? 70 : 150;
    return base;
  }

  function makePoint() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      amp: 6 + Math.random() * 14,
      signal: Math.random() < 0.06,
    };
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = targetCount();
    while (points.length < n) points.push(makePoint());
    if (points.length > n) points.length = n;
  }

  function frame(now) {
    rafId = 0;
    if (!running) return;

    const elapsed = now - lastFrame;
    if (elapsed < FRAME_MIN) {
      rafId = requestAnimationFrame(frame);
      return;
    }
    lastFrame = now;
    const t0 = performance.now();

    const vh = window.innerHeight;
    const sc = window.scrollY;
    // Field alpha: gone by 80 percent of the first viewport
    const alpha = Math.max(0, 1 - sc / (vh * 0.8));
    // Organization: noise reduces, points drift toward lane alignment
    const organize = Math.min(1, sc / (vh * 0.55));

    ctx.clearRect(0, 0, W, H);
    if (alpha <= 0) {
      schedule();
      return;
    }
    ctx.globalAlpha = alpha;

    const time = now * 0.00035;
    const noiseScale = 1 - organize * 0.85;

    for (const p of points) {
      p.x += p.vx * noiseScale;
      p.y += p.vy * noiseScale;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      const wob = Math.sin(time + p.phase) * p.amp * noiseScale;
      const laneY = Math.round(p.y / LANE) * LANE;
      p.dx = p.x;
      p.dy = (p.y + wob) * (1 - organize) + (laneY + wob * 0.2) * organize;
    }

    // Hairline connections
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const dx = a.dx - b.dx;
        const dy = a.dy - b.dy;
        const d2 = dx * dx + dy * dy;
        if (d2 < PROX * PROX) {
          const f = 1 - Math.sqrt(d2) / PROX;
          ctx.strokeStyle = `rgba(17, 21, 28, ${0.055 * f})`;
          ctx.beginPath();
          ctx.moveTo(a.dx, a.dy);
          ctx.lineTo(b.dx, b.dy);
          ctx.stroke();
        }
      }
    }

    for (const p of points) {
      ctx.fillStyle = p.signal
        ? 'rgba(46, 69, 230, 0.4)'
        : 'rgba(17, 21, 28, 0.12)';
      ctx.beginPath();
      ctx.arc(p.dx, p.dy, p.signal ? 2.2 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Auto-reduce when frames run hot (8ms budget)
    if (performance.now() - t0 > 8) {
      slowFrames++;
      if (slowFrames >= 10 && points.length > 40) {
        points.length = Math.floor(points.length * 0.8);
        slowFrames = 0;
      }
    } else if (slowFrames > 0) {
      slowFrames--;
    }

    schedule();
  }

  function schedule() {
    if (running && !rafId) rafId = requestAnimationFrame(frame);
  }

  function setRunning() {
    const should = visible && tabVisible;
    if (should && !running) {
      running = true;
      lastFrame = performance.now() - FRAME_MIN;
      schedule();
    } else if (!should && running) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    setRunning();
  });
  io.observe(hero);

  document.addEventListener('visibilitychange', () => {
    tabVisible = !document.hidden;
    setRunning();
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  setRunning();
}

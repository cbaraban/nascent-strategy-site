/* Home page motion: the Resolve (7.2), the Field (7.3),
   and the Resolve Chart (7.5). All lazy, never blocking first paint. */

import { gsap } from 'gsap';
import { runResolve } from './resolve.js';
import { initField } from './field.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- The Resolve ----------
   The H1 is the hero's single motion moment (7.2). Support copy paints
   immediately so it never blocks LCP, in keeping with the FRD's restraint. */
runResolve(document.getElementById('resolve-h1'));

/* ---------- The Field: lazy-init after first paint ---------- */
requestAnimationFrame(() => {
  initField(document.getElementById('hero-field'), document.getElementById('hero'));
});

/* ---------- The Resolve Chart (7.5) ---------- */

function formatDollars(v) {
  return '$' + Math.round(v).toLocaleString('en-US');
}

function initResolveChart() {
  const svg = document.getElementById('resolve-chart');
  if (!svg || reduced) return; // reduced motion: server-rendered final state stands

  const line = svg.querySelector('#trend-line');
  const pts = Array.from(svg.querySelectorAll('#chart-points circle'));
  const figure = svg.querySelector('#chart-figure');
  const caption = document.getElementById('chart-caption');
  const target = 412000; // [PLACEHOLDER metric] keep in sync with markup

  // De-resolve to the scattered rest state
  const len = line.getTotalLength();
  line.style.strokeDasharray = String(len);
  line.style.strokeDashoffset = String(len);
  for (const c of pts) {
    c.dataset.fx = c.getAttribute('cx');
    c.dataset.fy = c.getAttribute('cy');
    c.setAttribute('cx', c.dataset.sx);
    c.setAttribute('cy', c.dataset.sy);
  }
  gsap.set(figure, { opacity: 0 });
  gsap.set(caption, { opacity: 0 });

  let played = false;
  const io = new IntersectionObserver(
    (entries) => {
      if (played || !entries[0].isIntersecting) return;
      played = true;
      io.disconnect();
      play();
    },
    { threshold: 0.4 }
  );
  io.observe(svg);

  function play() {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    // Points converge onto the trend over 1.4s
    tl.to(pts, {
      duration: 1.4,
      attr: (i) => ({ cx: pts[i].dataset.fx, cy: pts[i].dataset.fy }),
      stagger: { each: 0.006, from: 'random' },
    }, 0);

    // Line draws to completion as the points land
    tl.to(line, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: 'power2.out',
    }, 0.55);

    // Dollar figure counts up at the terminus, mono type
    const counter = { v: 0 };
    tl.to(counter, {
      v: target,
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => { figure.textContent = formatDollars(counter.v); },
      onComplete: () => { figure.textContent = formatDollars(target); },
    }, 1.05);
    tl.to(figure, { opacity: 1, duration: 0.35, ease: 'none' }, 1.05);

    // Caption fades in last
    tl.to(caption, { opacity: 1, duration: 0.5, ease: 'none' }, 1.7);
  }
}

initResolveChart();

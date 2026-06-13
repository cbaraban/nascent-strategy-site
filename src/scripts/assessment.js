/* Assessment page: the Resolve on the H1 (7.2), the timeline draw (7.8),
   and FAQ accordion height animation. Count-ups are handled globally. */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { runResolve } from './resolve.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- The Resolve ----------
   H1 only; support copy paints immediately so it never blocks LCP. */
runResolve(document.getElementById('resolve-h1'));

/* ---------- Timeline draw (7.8) ---------- */

function initTimeline() {
  const timeline = document.getElementById('timeline');
  const fill = document.getElementById('timeline-fill');
  if (!timeline || !fill) return;
  const steps = Array.from(timeline.querySelectorAll('.timeline-step'));

  if (reduced) {
    fill.style.setProperty('--draw', '1');
    fill.style.transform = 'scaleY(1)';
    steps.forEach((s) => s.classList.add('is-reached'));
    return;
  }

  ScrollTrigger.create({
    trigger: timeline,
    start: 'top 70%',
    end: 'bottom 55%',
    scrub: 0.5,
    onUpdate(self) {
      fill.style.transform = `scaleY(${self.progress})`;
      // Markers fill in Signal as the line reaches them
      const railTop = timeline.getBoundingClientRect().top;
      const railHeight = timeline.offsetHeight - 12;
      const drawnTo = railTop + 6 + railHeight * self.progress;
      for (const step of steps) {
        const markerY = step.getBoundingClientRect().top + 8;
        step.classList.toggle('is-reached', markerY <= drawnTo);
      }
    },
  });
}
initTimeline();

/* ---------- FAQ smooth height animation ---------- */

function initFaq() {
  const items = document.querySelectorAll('details.faq');
  for (const d of items) {
    const summary = d.querySelector('summary');
    const wrap = d.querySelector('.faq-a-wrap');
    if (!summary || !wrap || reduced) continue;

    summary.addEventListener('click', (e) => {
      if (d.open) {
        // Animate close, then remove [open]
        e.preventDefault();
        const h = wrap.offsetHeight;
        wrap.style.height = h + 'px';
        requestAnimationFrame(() => {
          wrap.style.transition = 'height 240ms cubic-bezier(0.22, 1, 0.36, 1)';
          wrap.style.height = '0px';
          d.classList.add('closing');
          setTimeout(() => {
            d.open = false;
            d.classList.remove('closing');
            wrap.style.cssText = '';
          }, 250);
        });
      } else {
        // Let it open, then animate from 0 to natural height
        requestAnimationFrame(() => {
          const h = wrap.offsetHeight;
          wrap.style.height = '0px';
          wrap.style.transition = 'height 240ms cubic-bezier(0.22, 1, 0.36, 1)';
          requestAnimationFrame(() => {
            wrap.style.height = h + 'px';
            setTimeout(() => { wrap.style.cssText = ''; }, 250);
          });
        });
      }
    });
  }
}
initFaq();

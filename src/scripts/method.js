/* Method page: pinned phase sequence (7.7), desktop only.
   Below 1024px and under reduced motion, the static stacked layout stands. */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = window.matchMedia('(min-width: 1024px)');

let trigger = null;

function setupPin() {
  if (trigger || reduced || !desktop.matches) return;

  const section = document.getElementById('phases');
  const track = document.getElementById('phases-track');
  const panels = gsap.utils.toArray('.phase-panel');
  const fill = document.getElementById('phase-fill');
  const tick = document.getElementById('phase-tick');
  if (!section || panels.length !== 3) return;

  section.classList.add('is-pinned');
  panels[0].classList.add('is-active');

  // Panels cross-resolve: outgoing blurs out 6px and fades, incoming resolves in
  gsap.set(panels[0], { opacity: 1, filter: 'blur(0px)' });
  gsap.set([panels[1], panels[2]], { opacity: 0, filter: 'blur(6px)' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: track,
      pin: true,
      scrub: 0.4,
      start: 'top top',
      end: '+=250%', // 2.5 viewport heights of scroll distance
      onUpdate(self) {
        const idx = Math.min(2, Math.floor(self.progress * 2.999));
        const label = ['01', '02', '03'][idx];
        if (tick.textContent !== label) tick.textContent = label;
        panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
      },
    },
  });

  // Progress rail fills across the whole sequence
  tl.fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: 3, ease: 'none' }, 0);

  // Find -> Mine
  tl.to(panels[0], { opacity: 0, filter: 'blur(6px)', duration: 0.45, ease: 'power2.in' }, 0.78);
  tl.fromTo(
    panels[1],
    { opacity: 0, filter: 'blur(6px)', y: 10 },
    { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, ease: 'power2.out' },
    1.15
  );

  // Mine -> Embed
  tl.to(panels[1], { opacity: 0, filter: 'blur(6px)', duration: 0.45, ease: 'power2.in' }, 1.88);
  tl.fromTo(
    panels[2],
    { opacity: 0, filter: 'blur(6px)', y: 10 },
    { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, ease: 'power2.out' },
    2.25
  );

  // Hold Embed readable through the end of the pin
  tl.to({}, { duration: 0.3 });

  trigger = tl.scrollTrigger;

  // GA4 hook (9.1): founder wires this event name in GTM
  let completed = false;
  tl.eventCallback('onComplete', () => {
    if (completed) return;
    completed = true;
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({ event: 'method_pin_sequence_completed' });
    }
  });
}

function teardownPin() {
  if (!trigger) return;
  const section = document.getElementById('phases');
  trigger.kill(true);
  if (trigger.animation) trigger.animation.kill();
  trigger = null;
  section.classList.remove('is-pinned');
  document.querySelectorAll('.phase-panel').forEach((p) => {
    p.classList.remove('is-active');
    gsap.set(p, { clearProps: 'all' });
  });
}

setupPin();
desktop.addEventListener('change', () => {
  if (desktop.matches) setupPin();
  else teardownPin();
});

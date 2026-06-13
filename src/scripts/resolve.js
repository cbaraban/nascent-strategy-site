/* The Resolve (7.2): hero H1 words emerge from blur to sharp.
   Shared by Home and Assessment. Words are split client-side so the
   server-rendered headline stays a single accessible text node for
   SEO, no-JS, and reduced-motion users. */

import { gsap } from 'gsap';

export function runResolve(h1) {
  if (!h1) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.documentElement.classList.remove('resolve-pending');
    return;
  }

  const text = h1.textContent.trim();
  h1.setAttribute('aria-label', text);
  h1.textContent = '';
  const words = text.split(/\s+/).map((w) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = w;
    h1.appendChild(span);
    h1.appendChild(document.createTextNode(' '));
    return span;
  });

  /* Wide-tracking start is emulated with scaleX so only opacity,
     transform, and filter ever animate (7.1). */
  gsap.set(words, {
    opacity: 0,
    y: 14,
    scaleX: 1.05,
    transformOrigin: '0% 100%',
    filter: 'blur(14px)',
  });

  document.documentElement.classList.remove('resolve-pending');

  gsap.to(words, {
    opacity: 1,
    y: 0,
    scaleX: 1,
    filter: 'blur(0px)',
    duration: 0.62,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 0.1,
    clearProps: 'all',
  });
}

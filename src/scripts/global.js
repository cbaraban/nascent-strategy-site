/* Global behavior: header state, mobile menu, reveal observer,
   count-ups (7.9), page transition fade (7.10). No dependencies. */

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Sticky header: translucent blur once scrolled ---------- */

const header = document.getElementById('site-header');
let scrolled = false;
function onScroll() {
  const now = window.scrollY > 8;
  if (now !== scrolled) {
    scrolled = now;
    header.classList.toggle('is-scrolled', now);
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu (7.6) ---------- */

const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-menu');

function openMenu() {
  menu.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
  toggle.setAttribute('aria-expanded', 'true');
}

function closeMenu(instant = false) {
  menu.classList.add('is-closing');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
  toggle.setAttribute('aria-expanded', 'false');
  const finish = () => {
    menu.hidden = true;
    menu.classList.remove('is-closing');
  };
  if (instant || reducedMotion.matches) finish();
  else setTimeout(finish, 160);
}

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    if (menu.hidden) openMenu();
    else closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) closeMenu();
  });
}

/* ---------- Reveal observer (7.1): once, on first viewport entry ---------- */

const revealables = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('is-in'));
}

/* ---------- Count-ups (7.9): 900ms ease-out, exact landing, run once ---------- */

function formatNumber(value, decimals) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function runCountUp(el) {
  const target = parseFloat(el.dataset.countup);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const setFinal = () => { el.textContent = prefix + formatNumber(target, decimals) + suffix; };

  if (reducedMotion.matches) { setFinal(); return; }

  const dur = 900;
  const start = performance.now();
  let cancelled = false;

  // Never leave a number mid-animation if it scrolls away
  const exitWatch = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) {
      cancelled = true;
      setFinal();
      exitWatch.disconnect();
    }
  });
  exitWatch.observe(el);

  function frame(now) {
    if (cancelled) return;
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = prefix + formatNumber(target * eased, decimals) + suffix;
    if (t < 1) requestAnimationFrame(frame);
    else exitWatch.disconnect();
  }
  requestAnimationFrame(frame);
}

const countups = document.querySelectorAll('[data-countup]');
if (countups.length && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          cio.unobserve(entry.target);
          runCountUp(entry.target);
        }
      }
    },
    { threshold: 0.6 }
  );
  countups.forEach((el) => cio.observe(el));
}

/* ---------- Page transition (7.10): 150ms fade out, instant route ---------- */

function isInternalNav(a, e) {
  if (e.defaultPrevented || e.button !== 0) return false;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download')) return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false;
  if (url.pathname === location.pathname && url.hash) return false;
  return true;
}

if (!reducedMotion.matches) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || !isInternalNav(a, e)) return;
    e.preventDefault();
    const href = a.href;
    document.body.classList.add('page-exit');
    setTimeout(() => { location.href = href; }, 150);
  });
  // Restore state when returning via back/forward cache
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) document.body.classList.remove('page-exit');
  });
}

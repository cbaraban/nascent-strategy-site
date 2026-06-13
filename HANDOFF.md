# Nascent Strategy Website, Build Handoff

Build complete. Static Astro site, production build verified, Lighthouse run
against the local production preview. Below: the punch list of every founder
item, then a line-by-line pass on FRD Section 10 acceptance criteria.

Copy source: Website Copy Document v2.0 (June 13, 2026), which replaces FRD
Section 6 in full. The three-verb framework is See. Solve. Build. Built
verbatim from v2.0; the FRD governs structure, motion, tokens, and budgets.

---

## 1. Punch list: [PLACEHOLDER] and [FOUNDER TO CONFIRM]

Each item below is built and visible in place so the founder can drop in final
content. File paths are relative to `site/`.

### Content to supply

| # | Item | File location |
|---|------|---------------|
| 1 | Founder name (heading) | `src/pages/about.astro:67` (ABT-03) |
| 2 | Founder bio (suggested angle pre-filled) | `src/pages/about.astro:69` (ABT-03) |
| 3 | Founder photo, the single photo on the site | `src/pages/about.astro:63` (ABT-03) |
| 4 | Contact email (global) | `src/components/Footer.astro:27` and `src/pages/contact.astro:36` |
| 5 | LinkedIn URL (global) | `src/components/Footer.astro:28` and `src/pages/contact.astro:37` |
| 6 | Pilot case study: title, question, headline metric (grid card) | `src/pages/work/index.astro:35` (PRF-02) |
| 7 | Pilot case study detail: the leak, what we saw, what we built, baseline/result/timeframe | `src/pages/work/pilot.astro:17,24,29,34,42,46,50` (PRF-03) |
| 8 | Privacy policy text (legal) | `src/pages/privacy.astro:16` |
| 9 | Resolve Chart dollar figure (HOME-04). Currently illustrative `$412,000`. Keep the SVG text in `index.astro` and the `target` in `home.js` in sync | `src/pages/index.astro:226` and `src/scripts/home.js:34` (7.5) |
| 10 | MTH-05 sample metric. Currently illustrative `$184,000` | `src/pages/method.astro:87` |

### Decisions to confirm

| # | Item | File location |
|---|------|---------------|
| 11 | Booking tool: Cal.com vs Calendly vs form-only. Embed slot is built | `src/pages/contact.astro:30` (CON-02) |
| 12 | Final domain, for canonical URLs, sitemap, Open Graph | `astro.config.mjs:5` (`site`) |
| 13 | GA4 / GTM container ID. Insertion point and `dataLayer` events are wired | `src/layouts/Base.astro:49` |
| 14 | Approve illustrative figures in items 9 and 10, or supply real ones, per FRD Appendix A. They are framed as examples in the caption copy | as above |
| 15 | Confirm entity name "Nascent Strategy LLC" for the footer | `src/components/Footer.astro` (rendered, matches FRD 6.1) |

Note on the two illustrative dollar figures: the FRD copy never states a
client number, and Appendix A leaves the metric open ("or approve launching
with illustrative non-client numbers clearly framed as examples"). The chart
caption ("Years of records, resolved into one number worth acting on") and the
MTH-05 caption ("The only language we report in") frame these as
demonstrations, not client results.

---

## 2. FRD Section 10 acceptance criteria

> The build is complete when:

### 10.1 All six pages plus privacy and 404 render with copy verbatim, zero em dashes sitewide

PASS. Pages built: Home, Method, Assessment, Proof (`/work`), About, Contact,
plus Privacy, 404, a case study template (`/work/pilot`), and a `/thanks`
form-fallback. Copy entered verbatim from Copy Document v2.0 (See. Solve.
Build.), including price visibility and the fit qualifier. Home method-strip
anchors and the Method page phase IDs use `see`, `solve`, `build`. FAQ is six
questions per v2.0, with matching FAQPage schema.

Em dash search, literal U+2014 character across the entire build output and
source:

```
grep -rl $'\u2014' dist src   ->   clean: zero em dashes
```

Apostrophes and quotes use typographic entities; no em dashes, no en dashes.

### 10.2 The Resolve, the Field, and the Resolve Chart behave per 7.2, 7.3, 7.5, including reduced-motion fallbacks

PASS.

- The Resolve (7.2): H1 words emerge blur to sharp, 80ms per-word stagger,
  under 1.2s. Applied to Home and Assessment H1s only; other heroes use the
  quiet rise-and-fade. Real text is server-rendered for SEO and no-JS; the
  effect is a JS progressive enhancement gated pre-paint with a 2s fallback.
- The Field (7.3): hand-rolled canvas, no library. 150 points desktop / 70
  mobile, hairline proximity links, Ink at low opacity with a few in Signal.
  On scroll, noise reduces and points drift toward alignment; the field fades
  out by 80 percent of the first viewport. Guardrails in place: rAF capped at
  60fps, paused when tab hidden or hero off-screen, point count halved below
  768px, auto-reduction past an 8ms frame budget. Reduced-motion replaces it
  with a static dot-grid texture.
- The Resolve Chart (7.5): ~60 scattered points animate into an ascending
  line over 1.4s on 40 percent entry, the line draws, the Ember dollar figure
  counts up at the terminus in mono, caption fades in last. One-time trigger.
  Reduced-motion and no-JS render the final state, server-rendered (60 points
  at final coordinates, line present, figure shown).

Reduced-motion is honored globally (7.1): a CSS `prefers-reduced-motion` block
collapses animation to a 200ms opacity fade, and every page script guards on
`matchMedia('(prefers-reduced-motion: reduce)')`. Count-ups render their final
value immediately; pinned sections become stacked.

### 10.3 The Method pin sequence works on desktop and degrades to stacked sections below 1024px

PASS. Verified live: at 1440px `#phases` gains `is-pinned`, the three phases
cross-resolve (outgoing blurs out 6px and fades, incoming resolves in), the
left progress rail fills, and the mono phase label ticks 01, 02, 03 over 2.5
viewport heights. At 390px the section is not pinned and all three phases
render as normal stacked sections at full opacity.

### 10.4 Lighthouse mobile scores meet Section 9.2

Measured on the local production preview (`npm run preview`), mobile, simulated
throttling. Section 9.2 requires this on the deployed URL; localhost simulation
is the pessimistic proxy available pre-deploy. Re-run on the live Netlify URL
to confirm, where Brotli, CDN, and HTTP/2 will improve LCP further.

| Page | Performance | Accessibility | Best Practices | SEO |
|------|------------|---------------|----------------|-----|
| Home | 99 | 100 | 100 | 100 |
| Method | 99 | 100 | 100 | 100 |
| Assessment | 99 | 100 | 100 | 100 |
| Proof (/work) | 100 | 100 | 100 | 100 |
| Case study (/work/pilot) | 100 | 100 | 100 | 100 |
| About | 100 | 100 | 100 | 100 |
| Contact | 100 | 100 | 100 | 100 |
| 404 | 100 | 100 | 100 | 100 |
| Privacy | 100 | 100 | 100 | 100 |

Core Web Vitals (Home, simulated mobile): CLS 0 (budget < 0.05), TBT 0ms,
LCP 2.0s (budget < 2.0s, at the line on pessimistic localhost; expected under
on deploy). Performance 95+ and Accessibility/Best Practices/SEO 100 met on
every page.

Note: `/thanks` scores SEO 66 by design; it carries `noindex` as a form
landing fallback and is excluded from the sitemap.

JS budget (9.2): total JS 48.4KB gzipped, GSAP and ScrollTrigger included,
against the 150KB budget. The Field and Resolve Chart lazy-initialize after
first paint.

Fonts (9.2): Fraunces (variable, optical-size axis), Inter, Spline Sans Mono.
Subset latin woff2, two files max per family, `font-display: swap`, the two
hero-path fonts preloaded, plus a metric-matched Inter fallback so the swap
causes no reflow.

### 10.5 Booking/form flow delivers a test submission, with success and error states matching 6.7

PASS on implementation; one founder action remains. Form posts to Netlify
Forms (`revenue-question`); connect an email notification in the Netlify
dashboard to route to the founder inbox (a deploy is required for Netlify to
register the form, so the end-to-end inbox test happens post-deploy). Verified
live: empty submit shows all three inline errors with no browser alert and
focuses the first invalid field; an invalid email shows the email error only;
a valid submit replaces the form with the success message. All error and
success copy matches 6.7 verbatim.

### 10.6 Keyboard-only navigation reaches every interactive element with visible focus

PASS. A skip link is the first focusable element. Focus-visible style is 2px
Signal outline at 2px offset, switching to Paper on Ink sections, present in
the built CSS on every page. The mobile menu toggle stays above the overlay
and closes on Escape; the FAQ uses native `<details>`. No positive tabindex,
no focus traps.

### 10.7 All [PLACEHOLDER] and [FOUNDER TO CONFIRM] items surfaced in a single punch list

PASS. See section 1 above.

---

## 3. Additional FRD conformance notes

- Design tokens (Section 8): palette hex, type scale, Fraunces/Inter/Spline
  Sans Mono, 6px radius, 1200px max width, 120/72px section padding, all in
  `src/styles/tokens.css`, consumed everywhere.
- Two-accent rule (8.1): Signal is interface only; Ember appears only on
  dollar figures, all on Ink panels. Contrast verified: Signal on Paper
  6.46:1, Ember on Ink 5.91:1 (large numerals, per the 9.3 fallback since
  Ember on Paper is below 4.5:1 and is therefore never used on Paper),
  Slate on Paper 5.72:1, slate-on-ink 7.66:1.
- Exclusions (7.11): no custom cursor, no parallax, no 3D tilt, no typing
  effect, no autoplaying video, no chatbot. The only scroll pin is the single
  Method sequence.
- Page transitions (7.10): 150ms opacity fade, content reveals handle entry.
- Schema (9.4): Organization + ProfessionalService on Home; Service + Offer
  ($9,500) + FAQPage on Assessment. Canonical URLs, Open Graph and Twitter
  cards, a generated branded OG image, sitemap, robots.txt, and the 404 copy
  from 9.4 all present.
- JS disabled: every page is fully readable and navigable; animations are
  simply absent and motion targets render in their final state.

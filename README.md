# Nascent Strategy Marketing Website

A static marketing site built with Astro, vanilla CSS design tokens, GSAP +
ScrollTrigger for the signature motion, and a hand-rolled canvas particle
field. Built to the Nascent Strategy FRD v1.0. Static output, deployable to
Netlify.

Brand promise: simple but extremely advanced. The motion grammar is a single
idea, Emergence (blur to sharp, scatter to structure), applied with restraint.

## Local development

```bash
cd site
npm install
npm run dev      # http://localhost:4321
```

## Production build

```bash
npm run build    # outputs to ./dist
npm run preview  # serves the production build locally for a final look
```

## Regenerate the Open Graph image

The branded OG card (Ink background, Fraunces headline, Signal rule) is
generated from the project fonts. Re-run after any branding change:

```bash
node scripts/generate-og.mjs   # writes public/og.png
```

## Deploy to Netlify

The repo includes `netlify.toml` (build command `npm run build`, publish
`dist`, immutable caching for fonts and hashed assets).

Option A, Git-connected (recommended):

1. Push this repo to GitHub or GitLab.
2. In Netlify, "Add new site" then "Import an existing project" and pick the
   repo. Netlify reads `netlify.toml`, so build settings are automatic.
3. Set the build base directory to `site` if the repo root is one level up
   from this folder.
4. Deploy.

Option B, Netlify CLI:

```bash
npm i -g netlify-cli
cd site
netlify deploy --build           # draft URL
netlify deploy --build --prod    # production
```

After the first deploy, set the custom domain in Netlify and update
`site` in `astro.config.mjs` to the final domain so canonical URLs, the
sitemap, and Open Graph tags point at production. [FOUNDER TO CONFIRM domain.]

## Forms

The contact form posts to Netlify Forms (form name `revenue-question`).
Netlify auto-detects the form at deploy from the static HTML. To receive
submissions in the founder inbox: Netlify dashboard then Forms then
Notifications then add an email notification. Spam protection is a honeypot
field plus a time check, no CAPTCHA. The JS submits via fetch and shows the
inline success state; with JS disabled the form posts to `/thanks`.

## Booking widget

The Contact page has a slot for a Cal.com or Calendly embed.
[FOUNDER TO CONFIRM the tool.] Mount the embed inside `.widget-slot` in
`src/pages/contact.astro` and wire the GA4 events listed below.

## Analytics

GA4 via Google Tag Manager. Add the GTM container snippet in
`src/layouts/Base.astro` (marked with a comment). The code already pushes
these `dataLayer` events for the founder to pick up in GTM:

- `method_pin_sequence_completed`
- `form_submitted`

Still to wire when the booking embed lands: booking widget opened, booking
completed, and assessment page CTA clicks.

## Project structure

```
site/
  public/fonts/        subset woff2, two files max per family
  public/og.png        generated branded social card
  public/robots.txt
  src/styles/
    tokens.css         design tokens, FRD Section 8, defined once
    global.css         reset, primitives, reveal system, font-face
  src/layouts/Base.astro    head, metadata, schema, page-fade shell
  src/components/      Header, Footer, CtaSection
  src/scripts/         global, resolve, field, home, method, assessment, contact
  src/pages/           index, method, assessment, work/, about, contact,
                       thanks, 404, privacy
scripts/generate-og.mjs
netlify.toml
```

## Adding a case study

`src/pages/work/pilot.astro` is the repeatable detail template (Question,
What the data showed, What we built, The number). Copy it to a new file
under `src/pages/work/`, fill in the four sections, and add a card to the
grid in `src/pages/work/index.astro`. Remove the "early days" launch-state
copy once real studies exist.

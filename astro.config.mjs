// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// [FOUNDER TO CONFIRM] Final domain. Placeholder used for canonical URLs,
// sitemap, and Open Graph until the domain is confirmed.
export default defineConfig({
  site: 'https://nascentstrategy.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/privacy') && !page.includes('/thanks'),
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },
});

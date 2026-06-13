/* Generates the branded OG image template (9.4): Ink background,
   Fraunces headline, Signal rule. Run: node scripts/generate-og.mjs */

import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const fontPath = resolve(root, '../public/fonts/fraunces-var.woff2');
const monoPath = resolve(root, '../public/fonts/spline-mono-400.woff2');
const fraunces = readFileSync(fontPath).toString('base64');
const mono = readFileSync(monoPath).toString('base64');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Fraunces';
        src: url(data:font/woff2;base64,${fraunces}) format('woff2-variations');
        font-weight: 100 900;
      }
      @font-face {
        font-family: 'Spline Sans Mono';
        src: url(data:font/woff2;base64,${mono}) format('woff2');
      }
    </style>
  </defs>
  <rect width="1200" height="630" fill="#11151C"/>
  <circle cx="950" cy="430" r="4" fill="#2E45E6" opacity="0.45"/>
  <circle cx="1010" cy="390" r="4" fill="#2E45E6" opacity="0.6"/>
  <circle cx="1070" cy="345" r="4" fill="#2E45E6" opacity="0.8"/>
  <circle cx="1130" cy="295" r="5.5" fill="#D97A32"/>
  <text x="96" y="130" font-family="'Spline Sans Mono'" font-size="22" letter-spacing="4" fill="#FAFAF7" opacity="0.7">NASCENT STRATEGY</text>
  <rect x="96" y="170" width="72" height="3" fill="#2E45E6"/>
  <text x="96" y="300" font-family="Fraunces" font-weight="600" font-size="64" fill="#FAFAF7">The answer is already</text>
  <text x="96" y="380" font-family="Fraunces" font-weight="600" font-size="64" fill="#FAFAF7">in your business.</text>
  <text x="96" y="540" font-family="'Spline Sans Mono'" font-size="20" letter-spacing="1" fill="#FAFAF7" opacity="0.55">AI strategy and implementation for operators</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(resolve(root, '../public/og.png'));
console.log('og.png written');

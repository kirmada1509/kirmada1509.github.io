import { readFileSync } from 'node:fs';

// The signature and surprise share the existing feather artwork, without its tile.
const feather = readFileSync('dist/assets/favicon.svg', 'utf8').trim()
  .replace(/\s*<rect width="64" height="64"[^>]*\/>/, '')
  .replace(' transform="rotate(24 32 30)"', '')
  .replace('<svg ', '<svg class="signature-feather" aria-hidden="true" focusable="false" ');

const fanFeather = feather.replace('<svg ', '<svg preserveAspectRatio="none" ');

export const featherButton = `<button class="feather-trigger" type="button" data-feather-trigger aria-label="Reveal peacock easter egg" aria-pressed="false" title="A little surprise" disabled>
  <span class="peacock-signature" aria-hidden="true">
    ${[-60, -40, -20, 0, 20, 40, 60].map(angle => `<span class="signature-plume${angle === 0 ? ' signature-center' : ''}" style="--fan-angle:${angle}deg;--fan-delay:${Math.abs(angle) * .7}ms">${fanFeather}</span>`).join('')}
    <svg class="signature-bird" viewBox="0 0 100 100"><path d="M28 90c3-20 15-25 22-34 4-6 4-14 1-22-4-9 0-18 9-18 7 0 11 5 10 10 0 4-3 7-7 8-2 8 0 13 5 20 9 15 13 26 7 36Z" fill="#238f9b" stroke="#6cc9b7"/><path d="M29 89c0-21 12-27 23-22 13 6 10 19 4 23" fill="#193c6c" stroke="#8aaecf"/><path d="m60 17-8-10m9 9 1-12m1 13 7-9M42 91l-3 7m21-7 4 7" stroke="#d5ad62" stroke-width="2"/><circle cx="52" cy="7" r="2" fill="#d5ad62"/><circle cx="62" cy="4" r="2" fill="#d5ad62"/><circle cx="70" cy="8" r="2" fill="#d5ad62"/><circle cx="63" cy="24" r="2" fill="#101113"/><path d="m69 26 8 3-9 2" fill="#d5ad62" stroke="none"/></svg>
  </span>
</button>`;

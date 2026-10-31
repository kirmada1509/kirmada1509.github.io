import { readFileSync } from 'node:fs';

// The signature and surprise share the existing feather artwork, without its tile.
const feather = readFileSync('dist/assets/favicon.svg', 'utf8').trim()
  .replace(/\s*<rect width="64" height="64"[^>]*\/>/, '')
  .replace(' transform="rotate(24 32 30)"', '')
  .replace('<svg ', '<svg class="signature-feather" aria-hidden="true" focusable="false" ');

const fanFeather = feather.replace('<svg ', '<svg preserveAspectRatio="none" ');

export const featherButton = `<button class="feather-trigger" type="button" data-feather-trigger aria-label="Reveal peacock easter egg" aria-haspopup="dialog" aria-expanded="false" aria-controls="feather-surprise" title="A little surprise" disabled>${feather}</button>`;

export const featherSurprise = `<section class="feather-surprise" id="feather-surprise" role="dialog" aria-modal="false" aria-labelledby="feather-surprise-title" hidden>
  <div class="feather-surprise-top"><span>SECRET / 001</span><button type="button" class="feather-close" data-feather-close aria-label="Close peacock easter egg">×</button></div>
  <div class="feather-fan" aria-hidden="true">
    ${[-60, -40, -20, 0, 20, 40, 60].map(angle => `<span class="fan-feather" data-fan-feather style="--fan-angle:${angle}deg">${fanFeather}</span>`).join('')}
    <svg class="peacock-body" viewBox="0 0 100 100"><path d="M28 90c3-20 15-25 22-34 4-6 4-14 1-22-4-9 0-18 9-18 7 0 11 5 10 10 0 4-3 7-7 8-2 8 0 13 5 20 9 15 13 26 7 36Z" fill="#238f9b" stroke="#6cc9b7"/><path d="M29 89c0-21 12-27 23-22 13 6 10 19 4 23" fill="#193c6c" stroke="#8aaecf"/><path d="m60 17-8-10m9 9 1-12m1 13 7-9M42 91l-3 7m21-7 4 7" stroke="#d5ad62" stroke-width="2"/><circle cx="52" cy="7" r="2" fill="#d5ad62"/><circle cx="62" cy="4" r="2" fill="#d5ad62"/><circle cx="70" cy="8" r="2" fill="#d5ad62"/><circle cx="63" cy="24" r="2" fill="#101113"/><path d="m69 26 8 3-9 2" fill="#d5ad62" stroke="none"/></svg>
  </div>
  <h2 id="feather-surprise-title">Peacock mode unlocked.</h2>
  <p class="feather-secret"><code>krishna.signature = "🦚";</code></p>
  <div class="feather-surprise-footer"><button type="button" class="feather-replay" data-feather-replay>↻ Replay</button><span><kbd>Esc</kbd> to close</span></div>
</section>`;

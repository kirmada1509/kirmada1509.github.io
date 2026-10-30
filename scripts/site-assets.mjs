import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

// One vector source is shared by the favicon and the inline header symbol.
export const brandMarkup = readFileSync('dist/assets/favicon.svg', 'utf8')
  .trim()
  .replace('<svg ', '<svg class="brand-mark" aria-hidden="true" focusable="false" ');

export const motionControl = `<button class="motion-toggle" type="button" data-motion-toggle aria-pressed="false" aria-label="Decorative animations" hidden><svg viewBox="0 0 20 20" aria-hidden="true"><path class="motion-pause" d="M7 5v10M13 5v10"/><path class="motion-play" d="m7 4 8 6-8 6Z"/></svg><span data-motion-label>Motion off</span></button>`;

export function stampAssets() {
  const files = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
  const versions = new Map(['styles.css', 'app.js', 'assets/favicon.svg'].map(file => [
    '/' + file, createHash('sha256').update(readFileSync(join('dist', file))).digest('hex').slice(0, 12)
  ]));
  for (const file of files('dist').filter(file => file.endsWith('.html'))) {
    let html = readFileSync(file, 'utf8');
    if (file === join('dist', 'index.html')) {
      html = html.replace(/<!--brand:start-->[\s\S]*?<!--brand:end-->/, `<!--brand:start-->${brandMarkup}<!--brand:end-->`);
    }
    html = html.replace(/((?:href|src)=")([^"?]+)(?:\?v=[a-f\d]+)?(")/g, (match, prefix, url, suffix) =>
      versions.has(url) ? `${prefix}${url}?v=${versions.get(url)}${suffix}` : match);
    writeFileSync(file, html);
  }
}

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { decorateButtons, decorateDiagrams, pipelineDemo, locationPanel } from './site-components.mjs';
import { dotBackdrop } from './dot-backdrop.mjs';
import { featherButton } from './feather-easter-egg.mjs';

// One vector source is shared by the favicon and the inline header symbol.
export const brandMarkup = readFileSync('dist/assets/favicon.svg', 'utf8')
  .trim()
  .replace('<svg ', '<svg class="brand-mark" aria-hidden="true" focusable="false" ');

export const motionControl = `<button class="motion-toggle" type="button" data-motion-toggle aria-pressed="false" aria-label="Decorative animations" hidden><svg viewBox="0 0 20 20" aria-hidden="true"><path class="motion-pause" d="M7 5v10M13 5v10"/><path class="motion-play" d="m7 4 8 6-8 6Z"/></svg><span data-motion-label>Motion off</span></button>`;
export const resumeLink = `<a class="header-resume" href="/resume.html" aria-label="Resume">Resume <span aria-hidden="true">↗</span></a>`;

export function stampAssets() {
  const files = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
  const versions = new Map(['styles.css', 'app.js', 'resume.css', 'resume.js', 'assets/favicon.svg', 'assets/peacock-feather.png', 'assets/mohan-krishna-resume.pdf'].map(file => [
    '/' + file, createHash('sha256').update(readFileSync(join('dist', file))).digest('hex').slice(0, 12)
  ]));
  for (const file of files('dist').filter(file => file.endsWith('.html'))) {
    let html = readFileSync(file, 'utf8');
    if (file === join('dist', 'index.html')) {
      html = html.replace(/<!--feather:button:start-->[\s\S]*?<!--feather:button:end-->/, `<!--feather:button:start-->${featherButton}<!--feather:button:end-->`);
      if (!html.includes('<!--dots:start-->')) html = html.replace('<body>', '<body data-dot-background>\n<!--dots:start--><!--dots:end-->');
      html = html.replace(/<!--dots:start-->[\s\S]*?<!--dots:end-->/, `<!--dots:start-->${dotBackdrop}<!--dots:end-->`);
      html = html.replace(/<a class="header-resume"[^>]*>[\s\S]*?<\/a>/, resumeLink);
      html = html.replace(/<!--brand:start-->[\s\S]*?<!--brand:end-->/, `<!--brand:start-->${brandMarkup}<!--brand:end-->`);
      html = html.replace(/<!--pipeline:start-->[\s\S]*?<!--pipeline:end-->/, `<!--pipeline:start-->${pipelineDemo}<!--pipeline:end-->`);
      html = html.replace(/<!--location:sidebar:start-->[\s\S]*?<!--location:sidebar:end-->/, `<!--location:sidebar:start-->${locationPanel()}<!--location:sidebar:end-->`);
      html = html.replace(/<!--location:mobile:start-->[\s\S]*?<!--location:mobile:end-->/, `<!--location:mobile:start-->${locationPanel(true)}<!--location:mobile:end-->`);
    }
    html = html.replace(/href="\/assets\/mohan-krishna-simple-resume\.pdf(?:\?v=[a-f\d]+)?"/g, 'href="/assets/mohan-krishna-resume.pdf"');
    html = html.replaceAll('Résumé', 'Resume').replaceAll('résumé', 'resume');
    if (file !== join('dist', 'resume.html')) html = decorateButtons(decorateDiagrams(html));
    if (!html.includes('rel="apple-touch-icon"')) html = html.replace(/(<link rel="icon"[^>]+>)/, '$1<link rel="apple-touch-icon" href="/assets/peacock-feather.png">');
    html = html.replace(/((?:href|src)=")([^"?]+)(?:\?v=[a-f\d]+)?(")/g, (match, prefix, url, suffix) =>
      versions.has(url) ? `${prefix}${url}?v=${versions.get(url)}${suffix}` : match);
    writeFileSync(file, html);
  }
}

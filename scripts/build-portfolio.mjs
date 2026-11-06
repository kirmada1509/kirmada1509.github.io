import { build } from 'esbuild';
import { mkdir,writeFile,readFile,readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { themeHead } from '../src/lib/theme.mjs';
await mkdir('.openai/local',{recursive:true});
await build({entryPoints:['src/client.jsx'],bundle:true,minify:true,format:'esm',outfile:'dist/natively.js',target:'es2020',jsx:'automatic',external:['/assets/*'],legalComments:'linked'});
execFileSync(process.execPath,['node_modules/@tailwindcss/cli/dist/index.mjs','-i','src/tailwind.css','-o','dist/natively.utilities.css','--minify'],{stdio:'inherit'});
await build({entryPoints:['src/render.jsx'],bundle:true,platform:'node',packages:'external',format:'esm',outfile:'.openai/local/render.mjs',jsx:'automatic'});
const {render,renderCase}=await import(pathToFileURL(resolve('.openai/local/render.mjs')).href+'?v='+Date.now());
const version=async file=>createHash('sha256').update(await readFile('dist/'+file)).digest('hex').slice(0,12);
const html=`<!doctype html><html lang="en" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${themeHead}<link rel="stylesheet" href="/theme-palette.css?v=${await version('theme-palette.css')}"><title>Mohan Krishna — Software &amp; AI Engineer</title><meta name="description" content="Software and AI engineer at BITS Pilani. Explore real-time voice systems, browser agents, and production software by Mohan Krishna."><link rel="canonical" href="https://kirmada1509.github.io/"><meta property="og:type" content="website"><meta property="og:title" content="Mohan Krishna — Software &amp; AI Engineer"><meta property="og:description" content="Intelligent systems and thoughtful software. Selected engineering work, experience, and a little about Mohan."><meta property="og:url" content="https://kirmada1509.github.io/"><meta property="og:image" content="https://kirmada1509.github.io/assets/social-card.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/favicon.svg?v=${await version('assets/favicon.svg')}" type="image/svg+xml"><link rel="icon" href="/assets/favicon.png?v=${await version('assets/favicon.png')}" sizes="32x32" type="image/png"><link rel="shortcut icon" href="/favicon.ico?v=${await version('favicon.ico')}"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png?v=${await version('assets/apple-touch-icon.png')}"><link rel="preload" href="/assets/natively/geist.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/natively/instrument-italic.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/natively.utilities.css?v=${await version('natively.utilities.css')}"><link rel="stylesheet" href="/natively.css?v=${await version('natively.css')}"><noscript><style>.reveal,.hero-copy>div,.hero-demo,.demo-response *{opacity:1!important;filter:none!important;transform:none!important}.project-rail{position:static}.demo-tabs,.toolkit-tabs>.rt-TabsList,.motion-control,.mobile-menu,.theme-toggle,.copy-email{display:none!important}.toolkit-tabs .rt-TabsContent{display:block!important;margin-bottom:20px}.faq-list [role=region]{display:block!important;height:auto!important;visibility:visible!important}.globe-wrap{display:none}</style></noscript></head><body><div id="portfolio">${render()}</div><script type="module" src="/natively.js?v=${await version('natively.js')}"></script></body></html>`;
await writeFile('dist/index.html',html);
console.log('Built library-based portfolio: static HTML + hydrated Radix, Magic UI, and Motion.');

for (const name of await readdir('dist/work')) {
 if(!name.endsWith('.html'))continue;
 const old=await readFile('dist/work/'+name,'utf8');
 const embedded=old.match(/<script type="application\/json" id="case-data">([\s\S]*?)<\/script>/)?.[1];
 let content=old.match(/<main class="journal" id="main">([\s\S]*?)<\/main>/)?.[1] || (embedded ? JSON.parse(embedded) : undefined);
 if(!content)throw new Error('Missing case content: '+name);
 if(name==='bosm.html' && !content.includes('case-actual-apps')) {
  const groups=[['BOSM ’25',['bosm-home','bosm-matches','bosm-events']],['BPL',['bpl-home','bpl-food','bpl-matches','bpl-events']]];
  const gallery=groups.map(([label,files])=>'<section class="case-actual-apps"><h2>'+label+' · App screens</h2><div class="case-actual-grid case-panorama">'+files.map(file=>'<a href="/assets/campus-apps/'+file+'.jpeg"><img src="/assets/campus-apps/'+file+'.jpeg" alt="'+label+' actual app screenshot: '+file.replaceAll('-',' ')+'" loading="lazy"></a>').join('')+'</div><p class="case-image-note">Original app showcase panels joined in sequence. Swipe horizontally on smaller screens.</p></section>').join('');
  content=content.replace('<h2>Implementation</h2>',gallery+'<h2>Implementation</h2>');
 }
 const conceptId=name.replace('.html','');
 if(['interviehire','reentry','precedent'].includes(conceptId) && !content.includes('case-generated-concept'))content=content.replace('<div class="journal-content">','<div class="journal-content"><figure class="case-generated-concept"><a href="/assets/project-concepts/'+conceptId+'.png"><img src="/assets/project-concepts/'+conceptId+'.png" alt="Generated interface concept illustrating '+conceptId+'" loading="lazy"></a><figcaption>Generated interface concept · A visual interpretation of the documented project</figcaption></figure>');

 const title=old.match(/<title>(.*?)<\/title>/)[1];
 const description=old.match(/<meta name="description" content="([^"]*)"/)[1];
 const canonical='https://kirmada1509.github.io/work/'+name;
 let page=html.replace(/<title>.*?<\/title>/,'<title>'+title+'</title>').replace(/(<meta name="description" content=")[^"]*/, '$1'+description).replace(/(<link rel="canonical" href=")[^"]*/, '$1'+canonical).replace(/(<meta property="og:url" content=")[^"]*/, '$1'+canonical).replace(/(<meta property="og:title" content=")[^"]*/, '$1'+title).replace(/(<meta property="og:description" content=")[^"]*/, '$1'+description);
 const start=page.indexOf('<div id="portfolio">');
 page=page.slice(0,start)+'<div id="portfolio">'+renderCase(content)+'</div><script type="application/json" id="case-data">'+JSON.stringify(content).replaceAll('<','\\u003c')+'</script><script type="module" src="/natively.js?v='+await version('natively.js')+'"></script></body></html>';
 await writeFile('dist/work/'+name,page);
}

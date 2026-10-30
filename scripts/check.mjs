import {readdirSync,readFileSync,existsSync,statSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve('dist');
const collect=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?collect(join(dir,e.name)):[join(dir,e.name)]);
const files=collect(root),pages=files.filter(p=>p.endsWith('.html'));
const errors=[];
for(const page of pages){
 const html=readFileSync(page,'utf8');
 if((html.match(/<h1\b/g)||[]).length!==1)errors.push(`${page}: expected exactly one h1`);
 if(!/<html lang="en"/.test(html))errors.push(`${page}: missing document language`);
 if(!/<meta name="description" content="[^"]+"/.test(html))errors.push(`${page}: missing description`);
 if(!/<main\b/.test(html))errors.push(`${page}: missing main landmark`);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
  const url=match[1];
  if(!url.startsWith('/')||url.startsWith('//'))continue;
  const pathname=url.split('?')[0];
  const path=join(root,pathname==='/'?'index.html':pathname);
  if(!existsSync(path)||!statSync(path).isFile())errors.push(`${page}: missing ${url}`);
 }
 for(const match of html.matchAll(/href="#([^"]+)"/g))if(!html.includes(`id="${match[1]}"`))errors.push(`${page}: missing fragment ${match[1]}`);
 for(const img of html.matchAll(/<img\b[^>]*>/g))if(!/\balt="/.test(img[0]))errors.push(`${page}: image without alt text`);
 if(/href="#"|javascript:|TODO|PLACEHOLDER/.test(html))errors.push(`${page}: unfinished content`);
}
for(const match of readFileSync(join(root,'styles.css'),'utf8').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))if(match[1].startsWith('/')&&!existsSync(join(root,match[1])))errors.push(`Missing CSS asset: ${match[1]}`);
const pdf=readFileSync(join(root,'assets/mohan-krishna-resume.pdf'));if(pdf.subarray(0,5).toString()!=='%PDF-')errors.push('Resume is not a valid PDF file');
const simple=readFileSync(join(root,'resume.html'),'utf8');
if (/src="\/app\.js|reading-progress|data-motion-toggle|data-weather|data-pipeline/.test(simple))errors.push('Simple resume must be independent of portfolio effects and scripts');
if (!simple.includes('href="/resume.css') || !simple.includes('data-resume-print'))errors.push('Simple resume is missing its stylesheet or print control');
if (!readFileSync(join(root,'index.html'),'utf8').includes('Switch to simple résumé mode'))errors.push('Portfolio is missing the simple mode switch');
const simplePdf=readFileSync(join(root,'assets/mohan-krishna-simple-resume.pdf'));
if(simplePdf.subarray(0,5).toString()!=='%PDF-')errors.push('Simple resume PDF is invalid');
const resumeHash=createHash('sha256').update(readFileSync('scripts/resume-data.json')).digest('hex');
if(!simplePdf.includes(Buffer.from(resumeHash)))errors.push('Simple resume PDF is out of date; run scripts/generate-resume-pdf.py after editing resume-data.json');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log(`PASS: ${pages.length} semantic HTML pages; local links, fragments, images, font assets, metadata, and PDF download verified. ${files.length} deployed files.`);

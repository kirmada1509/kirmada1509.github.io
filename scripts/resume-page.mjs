import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('scripts/resume-data.json', 'utf8'));
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const bullets = values => `<ul>${values.map(value => `<li>${esc(value)}</li>`).join('')}</ul>`;

export function resumePage() {
  const description = 'Mohan Krishna: BITS Pilani Mathematics & Computing student, software and AI engineering experience, projects, skills, and contact details. Open to roles and internships.';
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: data.name,
    jobTitle: data.role, url: data.portfolio, email: `mailto:${data.email}`, telephone: '+916302539619',
    sameAs: [data.github, data.linkedin], affiliation: { '@type': 'CollegeOrUniversity', name: data.education.university } };
  return `<!doctype html>
<html lang="en" data-motion="off"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="color-scheme" content="light">
<title>Mohan Krishna - Resume</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${data.portfolio}resume.html">
<meta property="og:type" content="profile"><meta property="og:title" content="Mohan Krishna - Resume"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${data.portfolio}resume.html"><meta property="og:image" content="${data.portfolio}assets/social-card.png"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/resume.css"><script src="/resume.js" defer></script>
<script type="application/ld+json">${JSON.stringify(person)}</script>
</head><body class="resume-view">
<a class="skip-link" href="#main">Skip to resume</a>
<header class="resume-toolbar"><nav aria-label="Page navigation"><a href="/">Portfolio</a><a href="/resume.html" aria-current="page">Resume</a></nav><div class="resume-tools"><a href="/assets/mohan-krishna-resume.pdf" download="Mohan-Krishna-Resume.pdf" data-resume-download>Save resume</a></div></header>
<main id="main" class="resume-document">
<header class="resume-identity"><h1>${esc(data.name)}</h1><p class="resume-role">${esc(data.role)}</p><p class="resume-degree"><strong>BITS Pilani</strong> · ${esc(data.education.course)} · ${esc(data.education.date)}</p><p class="resume-availability">${esc(data.availability)}</p>
<address class="resume-contacts"><a href="mailto:${data.email}">${data.email}</a><a href="${data.phoneUrl}">${data.phone}</a><a href="${data.github}">github.com/kirmada1509</a><a href="${data.linkedin}">linkedin.com/in/mohan-krishna-karthik</a><a href="${data.portfolio}">kirmada1509.github.io</a></address></header>
<section aria-labelledby="education-title"><h2 id="education-title">Education</h2><div class="resume-item"><div class="resume-item-heading"><h3>${esc(data.education.university)}</h3><p>${esc(data.education.date)}</p></div><p>${esc(data.education.course)}</p><p class="resume-coursework">Relevant coursework: ${esc(data.education.coursework)}</p></div></section>
<section aria-labelledby="experience-title"><h2 id="experience-title">Experience</h2>${data.experience.map(job => `<article class="resume-item"><div class="resume-item-heading"><h3>${esc(job.title)}</h3><p>${esc(job.date)}</p></div><p class="resume-organization">${esc(job.organization)}</p>${bullets(job.bullets)}</article>`).join('')}</section>
<section aria-labelledby="projects-title"><h2 id="projects-title">Selected projects</h2>${data.projects.map(project => `<article class="resume-item"><div class="resume-item-heading"><h3><a href="${project.path}">${esc(project.name)}</a></h3><p>${esc(project.date)}</p></div><p class="resume-stack">${esc(project.stack)}</p>${bullets(project.bullets)}</article>`).join('')}</section>
<section aria-labelledby="skills-title"><h2 id="skills-title">Technical skills</h2><dl class="resume-skill-list">${data.skills.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section>
<section aria-labelledby="achievements-title"><h2 id="achievements-title">Achievements</h2>${bullets(data.achievements)}</section>
</main><footer class="resume-footer"><a href="/">View full portfolio</a><a href="/resume.html">kirmada1509.github.io/resume.html</a></footer>
</body></html>`;
}

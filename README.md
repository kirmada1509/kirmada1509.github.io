# Mohan Krishna — Software & AI Engineering Portfolio

A technical portfolio for software and AI engineering roles, with voice infrastructure, browser agents, retrieval-based action checks, production applications, and a printable text résumé. Static HTML, CSS, and minimal JavaScript. No framework or dependencies.

## Local development

```sh
npm run dev
```

Open the printed local URL. Use `PORT=4189 npm run dev` to choose another port.

## Content and design

- `dist/index.html`: the main portfolio, project diagrams, and navigation.
- `dist/styles.css`: charcoal interface, system typography, responsive layouts, and print styles.
- `dist/app.js`: current-section indicator, copy email, local time, and printing.
- `scripts/generate-pages.mjs`: project case studies and text résumé. Run `npm run generate` after editing.
- `dist/assets/`: profile photo, original resume PDF, favicon, and social preview image.

`npm run check` checks local links, headings, landmarks, metadata, image alternatives, and required assets.

## Design research

The redesign follows direct introductions and project-focused content seen in [Emil Kowalski’s portfolio](https://emilkowal.ski/) and [Paco Coursey’s portfolio](https://paco.me/). Alignment, neutral surfaces, and clear hierarchy reference [Linear’s UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui). Body text and interface metadata have separate roles, as described by [Vercel’s typography system](https://vercel.com/geist/typography). The implementation uses native system sans and monospace fonts.

The project diagrams summarize documented architecture; they are not screenshots, live status monitors, or benchmark output. There are no simulated metrics or fake activity logs.

## Content provenance

Experience and impact metrics come from the supplied `resume_sde_sep.pdf`. ReEntry and Precedent details are based on their public GitHub documentation, reviewed on 30 October 2026. The AI positioning describes application engineering, orchestration, retrieval, and evaluation work; it does not claim model training experience. Private repository content is not shipped.

The downloadable PDF is the supplied original. The text résumé uses semantic HTML and print styles for readable and extractable content. ATS support varies by application system.

## GitHub Pages

Live site: [kirmada1509.github.io](https://kirmada1509.github.io/).

The `pages.yml` workflow automatically deploys pushes to `main`. It generates the case studies and text résumé, runs the site checks, uploads `dist/`, and publishes through GitHub Pages. A deployment can also be started from the Actions tab with **Run workflow**.

The repository is named `kirmada1509.github.io`, so absolute asset paths work at the site root. Canonical links, social metadata, the sitemap, and robots.txt use that primary domain.

The existing Sites publication is retained as a second deployment of the same static source, with its identity in `.openai/hosting.json`. No analytics, external font requests, or server-side services are required.


## Interaction and readability

The favicon and inline header share one custom SVG junction symbol. `scripts/site-assets.mjs` stamps versioned CSS, JavaScript, and favicon URLs after generation so existing visitors receive updated assets.

All profile text, education, availability, project descriptions, case studies, and resume content are in the HTML. No content is hidden for scroll reveals or created by animation. With JavaScript blocked, the site remains fully readable and navigable; only enhancement controls are hidden.

Motion is limited to decorative diagram outlines, logo traces, link arrows, and a reading-progress indicator. Diagram sequences play once on entry and can be replayed with **Trace flow** or hover/focus. There are no looping background animations. The **Motion** toggle stores a local preference, cancels active animations when off, and respects the operating system’s reduced-motion preference. Text positions, opacity, and layout remain unchanged.

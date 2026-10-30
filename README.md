# Mohan Krishna — Software & AI Engineering Portfolio

A technical portfolio for software and AI engineering roles, with voice infrastructure, browser agents, retrieval-based action checks, production applications, and a simple résumé mode. Static HTML, CSS, and minimal JavaScript, with no framework or runtime dependencies.

## Local development

```sh
npm run dev
```

Open the printed local URL. Use `PORT=4189 npm run dev` to choose another port.

## Content and design

- `dist/index.html`: the main portfolio, project diagrams, and navigation.
- `dist/styles.css`: charcoal interface, system typography, responsive layouts, and print styles.
- `dist/app.js`: current-section indicator, copy email, local time, and printing.
- `scripts/generate-pages.mjs`: project case studies and simple résumé. Run `npm run generate` after editing.
- `scripts/resume-data.json`: shared content for the simple HTML résumé and downloadable PDF.
- `scripts/simple-resume.mjs`: semantic, single-column résumé page at `/resume.html`.
- `dist/resume.css` and `dist/resume.js`: independent light styling and an optional print control; no portfolio effects or external requests.
- `dist/assets/`: profile photo, original and generated résumé PDFs, favicon, and social preview image.

`npm run check` checks local links, headings, landmarks, metadata, image alternatives, and required assets.

## Design research

The redesign follows direct introductions and project-focused content seen in [Emil Kowalski’s portfolio](https://emilkowal.ski/) and [Paco Coursey’s portfolio](https://paco.me/). Alignment, neutral surfaces, and clear hierarchy reference [Linear’s UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui). Body text and interface metadata have separate roles, as described by [Vercel’s typography system](https://vercel.com/geist/typography). The implementation uses native system sans and monospace fonts.

The project diagrams summarize documented architecture. The IntervieHire walkthrough uses a clearly labelled illustrative latency budget, not production telemetry or benchmark output.

## Content provenance

Experience and impact metrics come from the supplied `resume_sde_sep.pdf`. ReEntry and Precedent details are based on their public GitHub documentation, reviewed on 30 October 2026. The AI positioning describes application engineering, orchestration, retrieval, and evaluation work; it does not claim model training experience. Private repository content is not shipped.

The simple résumé and its downloadable one-page PDF use the same content source. The PDF embeds its fonts and contains selectable text and clickable links. The supplied original is retained at `dist/assets/mohan-krishna-resume.pdf`. ATS support varies by application system.

## Simple résumé mode

Use **Simple mode** in the portfolio header, or share [kirmada1509.github.io/resume.html](https://kirmada1509.github.io/resume.html) directly. The page has a white background, plain text, education, experience, projects, skills, and contact links. It has no animations, diagrams, weather, timers, or dependency on the portfolio script. All content and the PDF download work without JavaScript. **Portfolio** returns to the full site.

The optional **Print / save PDF** control invokes browser printing. **Download PDF** provides the generated résumé directly. After editing `scripts/resume-data.json`, regenerate both outputs:

```sh
python3 scripts/generate-resume-pdf.py
npm run generate
npm run check
```

PDF generation requires Python with `reportlab`; it is not needed to serve or deploy the site. The generated PDF is committed. Site checks verify its source hash so a content change cannot deploy with an outdated PDF.

## GitHub Pages

Live site: [kirmada1509.github.io](https://kirmada1509.github.io/).

The `pages.yml` workflow automatically deploys pushes to `main`. It generates the case studies and text résumé, runs the site checks, uploads `dist/`, and publishes through GitHub Pages. A deployment can also be started from the Actions tab with **Run workflow**.

The repository is named `kirmada1509.github.io`, so absolute asset paths work at the site root. Canonical links, social metadata, the sitemap, and robots.txt use that primary domain.

The existing Sites publication is retained as a second deployment of the same static source, with its identity in `.openai/hosting.json`. No analytics, external font requests, or server-side services are required.


## Interaction and readability

The favicon and inline portfolio header share one custom peacock feather SVG. `scripts/site-assets.mjs` stamps versioned CSS, JavaScript, icon, and generated PDF URLs after generation so existing visitors receive updated assets.

All profile text, education, availability, project descriptions, case studies, and resume content are in the HTML. No content is hidden for scroll reveals or created by animation. With JavaScript blocked, the site remains fully readable and navigable; only enhancement controls are hidden.

In the full portfolio, motion is limited to decorative diagram outlines, the feather, link arrows, and a reading-progress indicator. Diagram sequences can be replayed; the voice walkthrough includes pause/resume, stepping, reset, and speed controls. Its example numbers are explicitly illustrative. There are no looping background animations. The **Motion** toggle stores a local preference, cancels active animations when off, and respects the operating system’s reduced-motion preference. Manual stepping remains available without motion. The simple résumé has no motion controls because it does not animate.

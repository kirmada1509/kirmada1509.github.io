# Mohan Krishna — Software Engineering Portfolio

A technical portfolio with a project index, architecture diagrams, engineering case studies, experience, and a printable text résumé. Static HTML, CSS, and minimal JavaScript. No framework or dependencies.

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

Experience and impact metrics come from the supplied `resume_sde_sep.pdf`. ReEntry and Precedent details are based on their public GitHub documentation, reviewed on 30 October 2026. Private repository content is not shipped.

The downloadable PDF is the supplied original. The text résumé uses semantic HTML and print styles for readable and extractable content. ATS support varies by application system.

## Hosting

`dist/` works on any static web host. The existing Sites identity is preserved in `.openai/hosting.json`. No analytics, external font requests, or server-side services are required.

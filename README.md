# Mohan Krishna — Portfolio

A spring-inspired, responsive portfolio with a static HTML home page, four project journals, and a printable text résumé. Built with semantic HTML, CSS, and a little JavaScript. No dependencies or framework runtime.

## Run locally

```sh
npm run dev
```

Open the printed local URL. Set `PORT=4189 npm run dev` if the default port is occupied.

## Edit

- `dist/index.html`: main portfolio content and custom project illustrations.
- `dist/styles.css`: design, breakpoints, reduced motion, and print styles.
- `dist/app.js`: mobile menu, copy email, local time, and print action.
- `scripts/generate-pages.mjs`: content and templates for the project journals and text résumé. Run `npm run generate` after editing.
- `dist/assets/`: optimized photo, original resume PDF, original landscape and flower SVGs, self-hosted fonts, and social preview image.

Run `npm run check` to check local links, page landmarks, metadata, image alternatives, and required assets.

## Content provenance

Experience and impact metrics are drawn from the supplied `resume_sde_sep.pdf`. ReEntry and Precedent details are based on their public GitHub READMEs, reviewed on 30 October 2026. Project interface illustrations are original schematic views rather than screenshots; they are labelled accordingly. Private repositories and internal documents are not shipped.

The downloadable PDF is the supplied original. The text résumé is a semantic HTML version, with dedicated print styles, for readable and extractable content; ATS compatibility varies by application system.

## Hosting

`dist/` can be hosted by any static web host. Sites identity and the static directory are declared in `.openai/hosting.json`. The site uses no trackers, external font requests, or server-side services.

Fonts: DM Sans and DM Serif Display, distributed under the SIL Open Font License. See `dist/assets/OFL-DM-Sans.txt` and `dist/assets/OFL-DM-Serif-Display.txt`.

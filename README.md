# Alpine Hour — Mohan Krishna’s Portfolio

Alpine Hour pairs a moonlit indigo default with a lavender daylight option. The portfolio uses original landscape artwork, glass surfaces, and floating navigation inspired by [Natively](https://heynatively.com/).

## Local development

```sh
npm ci
npm run build
npm run dev
```

Open the printed URL. Use `PORT=4190 npm run dev` to choose another port. `npm run check` verifies all generated pages, local links, images, metadata, and the resume PDF.

## Source and components

- `src/portfolio.jsx`: portfolio content and compositions using Radix Themes and Primitives.
- `src/styles.css`: portfolio layout, typography, responsive rules, and case study styles.
- `dist/theme-palette.css`: shared semantic color roles and theme artwork. `src/lib/theme.mjs` applies and remembers the theme.
- `src/components/magicui/`: official registry components for marquee, text animation, blur fade, animated numbers, and globe. Small adaptations preserve static metric content and handle globe lifecycle/motion preference.
- `src/client.jsx` and `src/render.jsx`: browser hydration and static HTML rendering.
- `scripts/build-portfolio.mjs`: bundles the UI, compiles Tailwind utilities, and renders the homepage and project pages.
- `scripts/generate-pages.mjs`: documented project content and independent resume generation, followed by portfolio rendering through `npm run generate`.
- `scripts/resume-data.json`: shared factual resume content.
- `dist/`: complete generated website; deploy as static files.
- `design/natively/research.md`: research, library comparisons, and reference observations.
- `design/natively/assets.md`: source asset provenance.
- `design/natively/landscape-artwork.md`: mountain artwork and generation prompts.

Standard interactive controls come from Radix: buttons, tabs, menus, accordion, avatar, tooltip, and layout components. Motion drives parallax, scroll state, and transitions; Magic UI supplies the reusable effects. Custom code supplies the page composition, reference styling, and labelled project illustrations.

The homepage and case studies ship readable static HTML before hydration. Reduced motion and a persisted pause preference are supported. The independent resume remains a simple, printable page with a direct PDF download. Existing GitHub Pages CI installs locked dependencies, builds, and validates the static output.

## Content provenance

Experience and impact metrics come from the supplied `resume_sde_sep.pdf`. ReEntry and Precedent details are based on their public GitHub documentation, reviewed on 30 October 2026. The AI positioning describes application engineering, orchestration, retrieval, and evaluation work; it does not claim model training experience. Private repository content is not shipped.

The resume and its downloadable one-page PDF use the same content source. The PDF embeds its fonts and contains selectable text and clickable links. The supplied original is retained at `dist/assets/mohan-krishna-original-resume.pdf`. ATS support varies by application system.

## Resume

Use **Resume** in the portfolio header, or share [kirmada1509.github.io/resume.html](https://kirmada1509.github.io/resume.html) directly. The text resume shares the site’s dark default and remembers a visitor’s choice of light mode. Its content and PDF download work without JavaScript. **Portfolio** returns to the full site.

**Save resume** downloads the one-page PDF as `Mohan-Krishna-Resume.pdf`. Ctrl+S / Cmd+S use the same PDF download while this page is open. The save link works without JavaScript. After editing `scripts/resume-data.json`, regenerate both outputs:

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

The existing Sites publication is retained as a second deployment of the same static source, with its identity in `.openai/hosting.json`. The generated website serves its fonts and visual assets locally and requires no server-side services.



## Project imagery

BOSM and BPL use actual app screenshots supplied by Mohan in `bosm & bpl apps.zip`. The screenshot files are preserved unchanged; lavender frames, Radix tabs, and accessible enlarged views integrate their original colors with the portfolio. The shared BOSM case study includes both app galleries.

IntervieHire, ReEntry, and Precedent show explicitly labelled AI-generated interface concepts rather than purported product captures. Original generated files and prompts are recorded in `design/natively/project-image-generation.json`. Earlier generated BOSM concepts were replaced and removed from the published assets.

The footer links to https://heynatively.com/ with the credit “Visual design inspired by Natively.”

## Resume v2 and latest refinements

`/resume-v2.html` is the updated simple resume; `/resume.html` remains a compatible entry point to the same corrected content. The current, legacy-simple, and versioned PDF URLs contain the same one-page Resume v2. Content corrections supplied directly by Mohan clarify that the Students' Union Technical Team comprises student engineers and that OneTap is a credit system built from scratch: SU app QR scanning, student mess accounts, and semester-end billing. The supplied original resume PDF is retained as an original source document.

The about section shows a compact Pilani location card with a live Asia/Kolkata clock and current temperature and conditions from Open-Meteo. Weather refreshes every 15 minutes, with a recent session cache and an unavailable state when the feed fails. The globe is no longer rendered. Standalone project metric fragments have been replaced by descriptive outcome cards. BOSM and BPL use Embla to present the original app panels as continuous panoramas. Simple Icons supplies local technology logos, with generic library icons for capabilities without a brand logo. Toolkit category backgrounds cover each entire tab row. The FAQ uses Radix Accordion and provides direct contact actions for email, phone, WhatsApp, and LinkedIn.

Updated generated project concepts use smaller UI typography, waveforms, task maps, checkpoint timelines, provenance graphs, and decision tables. Their input/output paths and edit prompts are recorded in `design/natively/project-image-generation-v2.json`.

The OneTap homepage highlight now leads with **US$1.2M+ in annual campus purchase volume**, alongside the SU app's role in everyday BITS Pilani life. This describes campus purchases supported by the credit system; charges still connect to student mess accounts for semester-end billing. The hero leads with Mohan Krishna across two large lines, with one-shot Magic UI typewriter effects on section headings. Motion can be paused from the navigation. The favicon is a lavender MK monogram, with SVG, PNG, ICO, and Apple touch variants; versioned URLs refresh the browser icons after publication.

The about portrait is a purple halftone interpretation of the supplied photograph. The BOSM gallery opens on its showcase artwork, with the original panels available under App screenshots. BPL displays its supplied panoramic artwork.

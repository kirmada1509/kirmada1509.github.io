// SVG grid and pointer-mask adaptation of Magic UI's DotPattern / MagicCard.
// MIT licence is distributed at /assets/magic-ui-LICENSE.txt.
const grid = (id, radius) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" aria-hidden="true" focusable="false"><defs><pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="${radius}" fill="currentColor" stroke="none"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})" stroke="none"/></svg>`;

export const dotBackdrop = `<div class="dot-backdrop dot-backdrop-base" aria-hidden="true">${grid('ambient-dots-base', 1)}</div><div class="dot-backdrop dot-backdrop-reveal" data-dot-reveal data-active="false" aria-hidden="true">${grid('ambient-dots-reveal', 1.5)}</div>`;

# Natively reference and component research

Reviewed 5 November 2026, before implementation.

## Reference

https://heynatively.com/ — browser inspection of hero, scroll transition, floating navigation, statistics, feature rail, and lower-page content. Source CSS was inspected to identify typography and assets.

- Background: pale lavender, approximately #f7f5ff; primary text #2e2a38; lavender accent approximately #8b63dd.
- Headings: PP Neue Montreal, medium, tight tracking (-0.04em), near-unit line height.
- Accent: Instrument Serif italic; navigation: Geist.
- Hero: two-column typography and translucent interface over layered lavender mountains; separate image velocities on scroll; bottom fades into page background.
- Navigation: wide initial layout becomes centered frosted pill after scrolling.
- Body: centered introductory statement, continuous marquee, staggered statistics, globe, numbered sticky feature navigation, translucent specimens, tabs, FAQ, and large landscape footer.

## Libraries evaluated

| Library | Official documentation | Decision |
|---|---|---|
| Radix Themes | https://www.radix-ui.com/themes/docs/overview/getting-started | Selected for actual Button, IconButton, Card, Badge, Avatar, Tabs, Tooltip, DropdownMenu, Flex, Grid, Box, Heading, Text, Separator, and Theme components. |
| Radix Primitives | https://www.radix-ui.com/primitives/docs/components/accordion | Selected for keyboard navigation and state management in Navigation Menu and Accordion. |
| shadcn/ui | https://ui.shadcn.com/docs/components | Evaluated; Radix Themes supplies more of the pre-styled layout and component layer directly, avoiding locally authored copies of common controls. |
| Magic UI | https://magicui.design/docs/components/marquee | Selected official registry components: Marquee, Blur Fade, Number Ticker, Text Animate, Globe. Registry responses are retained alongside this document. |
| Motion | https://motion.dev/docs/react-use-scroll | Selected for parallax, scroll state, transitions, and shared-layout project indicator. Also powers the Magic UI components. |
| React Bits | https://reactbits.dev/text-animations/scroll-reveal | Evaluated; existing Magic UI text and reveal components cover the needed effects without a second animation component collection. |
| Lucide + Radix Icons | https://lucide.dev/guide/packages/lucide-react and https://www.radix-ui.com/icons | Selected for interface and GitHub icons. |

## Implementation boundaries

Custom code composes library components, supplies portfolio content and project interface illustrations, and styles the specific reference layout. Standard interactive controls use the libraries above. No bespoke accordion, tab, dropdown, tooltip, button, avatar, or navigation interaction engine is implemented.

Reference imagery and matching font files are stored under dist/assets/natively. This implementation uses the reference's visual assets and typography; no Natively branding, claims, customer logos, testimonials, or application copy is presented as Mohan's work. Original asset provenance is retained in assets.md. Project interface illustrations are explicitly labelled.

The homepage is rendered to static HTML before hydration. Existing project journals and the independent resume and PDF remain available. Motion preference is stored locally; operating-system reduced motion is respected. The globe is initialized only near the viewport, cleaned up when offscreen, and does not rotate when paused or when the document is hidden.

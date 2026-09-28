# solc.dev

Personal site of David Šolc — Next.js 16 (App Router, static) + React 19, styled with
plain, **untranspiled** modern CSS. Browserslist targets evergreen browsers only, so
nothing gets downleveled.

## CSS highlights

All styles live in [`src/app/globals.css`](src/app/globals.css).

| Feature                                   | Where                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Cascade layers (`@layer`)                 | Whole stylesheet: `reset → tokens → base → layout → components → motion → utilities`                  |
| `@scope … to (…)`                         | Dock component (donut scope stops at the SVG icons)                                                   |
| `light-dark()` + `color-scheme`           | All color tokens; theme = `data-theme` attribute _or_ the radio group via `:has()` (works without JS) |
| `oklch()`, relative colors, `color-mix()` | Palette derived from one brand color; extra chroma on `color-gamut: p3`                               |
| `@property`                               | Animated `--hue` for the gradient `.dev` (`linear-gradient(in oklch longer hue …)`)                   |
| Container queries + `cqi` units           | Fluid wordmark and dock sizing                                                                        |
| `:has()`                                  | Theme without JS, dock neighbour magnification, glyph "dock" in the wordmark                          |
| Anchor positioning                        | Sliding thumb in the theme switch tethers to the checked option                                       |
| View Transitions API                      | Circular reveal on theme change, `@view-transition` for future pages                                  |
| `@starting-style` + `sibling-index()`     | Staggered entrance with zero JS (`:nth-child` fallback)                                               |
| `linear()` easing                         | Spring motion on tiles and the theme thumb                                                            |
| `text-box: trim-both cap alphabetic`      | Optically tight wordmark                                                                              |
| `interpolate-size` + `::details-content`  | Colophon `<details>` animates to `height: auto`                                                       |
| `corner-shape: squircle`                  | Dock tiles, progressive enhancement                                                                   |
| Variable font axes                        | `font-weight` / `font-stretch` morph on hover (Bricolage Grotesque)                                   |

The colophon at the bottom of the page lists these features and lights each one up **using
the feature itself** (a rule inside `@layer`, `@scope`, `@container`) or an `@supports`
query, so it's a live report card for the visitor's browser.

## Development

```sh
yarn install
yarn dev          # http://localhost:3000
yarn build
yarn prettier && yarn stylelint && yarn eslint && yarn typecheck
```

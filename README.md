# solc.dev

Personal site of David Šolc: Next.js 16 (App Router, fully static) + React 19, styled with
plain, **untranspiled** modern CSS, plus a sprinkle of JavaScript special effects.

## Stack

| Concern         | Tool                                                                                    |
| --------------- | --------------------------------------------------------------------------------------- |
| Runtime         | Node 24 LTS (`.node-version`)                                                           |
| Package manager | [Bun](https://bun.sh) (`packageManager` in `package.json`, `bun.lock`)                  |
| Lint            | [oxlint](https://oxc.rs/docs/guide/usage/linter) + Stylelint for CSS                    |
| Format          | [oxfmt](https://oxc.rs/docs/guide/usage/formatter)                                      |
| Types           | TypeScript 7 (native `tsc`)                                                             |
| Tests           | [Vitest](https://vitest.dev): `unit` project (Node) + `browser` project (real Chromium) |
| E2E             | [Playwright](https://playwright.dev) against the production build                       |
| Dev env         | [devenv.sh](https://devenv.sh) (Nix) + direnv                                           |
| CI/CD           | GitHub Actions → Vercel (`fra1`)                                                        |

## Getting started

With devenv (recommended: pins Node, Bun and a working Chromium, installs git hooks):

```sh
direnv allow        # or: devenv shell
dev                 # next dev on http://localhost:3000
check               # format · lint · typecheck · vitest
e2e                 # build + Playwright
devenv test         # what CI runs
```

Without devenv: install Node 24 and Bun, then

```sh
bun install
bunx playwright install chromium
bun run dev
bun run check
bun run build && bun run test:e2e
```

## Email protection

The contact address never appears in the HTML, the JS bundle or this repository in plain text.
It's stored XOR-ed + base64url (`src/lib/email.ts`) and decoded only on real interaction
(hover, focus, touch, click) by `<ProtectedEmailLink>`. E2E tests assert the served HTML
contains no email address. To change it:

```sh
bun -e "import { encodeEmail } from './src/lib/email.ts'; console.log(encodeEmail('you@example.com'))"
```

> `public/.well-known/security.txt` intentionally still lists the address: RFC 9116
> requires a contact there for security researchers.

## Special effects

| Effect           | How                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Cursor spotlight | JS feeds `--mx/--my`; CSS lights up grid lines through a radial `mask-image` + glow      |
| 3D wordmark      | Pointer-driven `rotateX/Y` (lerped in rAF), glyphs at `translateZ(sibling-index)` depths |
| Magnetic dock    | Tiles lean towards the cursor via `transform`, independent of `scale`/`translate`        |
| Border beam      | Registered `@property --angle` spins a conic gradient masked to a ring                   |
| Text decode      | Byline scrambles from random glyphs on load and hover                                    |
| Click burst      | Web Animations API particles + shockwave ring on the wordmark                            |
| Party mode       | ↑↑↓↓←→←→BA animates the registered `--brand-h`, re-hueing the whole palette              |
| Theme reveal     | View Transitions circular clip-path from the clicked control                             |

Everything is progressive: without JS the page is complete, and motion bows out for
`prefers-reduced-motion` and coarse pointers. Effect logic lives in pure, unit-tested
functions (`src/effects/math.ts`), and DOM wiring in `src/effects/dom.ts` is browser-tested.

## Modern CSS

All styles live in [`src/app/globals.css`](src/app/globals.css): cascade layers, `@scope`,
`@property`, `light-dark()`, `oklch()` + relative colors, container queries, `:has()`,
anchor positioning, view transitions, `@starting-style`, `sibling-index()`, `linear()`
easing, `text-box`, `interpolate-size`, `corner-shape`. The colophon on the page lights up
each feature **using the feature itself** or `@supports`, so it's a live report card for the
visitor's browser.

## CI/CD

- **CI** (`.github/workflows/ci.yml`), on PRs and `master`: format, lint and types; Vitest
  (unit + browser); Playwright e2e on Chromium, Firefox, WebKit and mobile, with the HTML
  report uploaded.
- **Deploy** (`.github/workflows/deploy.yml`) runs after a green CI: previews for branches,
  production for `master`. It's opt-in. Set the variables `VERCEL_ORG_ID` and
  `VERCEL_PROJECT_ID` and the secret `VERCEL_TOKEN`, then disable Vercel's Git auto-deploy.
- **Dependabot** keeps Bun deps and Actions current (grouped, weekly).

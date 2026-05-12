# AGENTS.md

## Project Overview

Personal website built with Astro 5 (SSR), Svelte 5, Tailwind CSS 4, and DaisyUI 5.
Deployed to Cloudflare Workers. Package manager: pnpm.

## Commands

| Command          | Description                                        |
| ---------------- | -------------------------------------------------- |
| `pnpm dev`       | Start dev server                                   |
| `pnpm build`     | Production build                                   |
| `pnpm check`     | TypeScript/astro type checking (run after changes) |
| `pnpm cfPreview` | Build + Cloudflare local preview on port 9001      |
| `pnpm cfDeploy`  | Build + deploy to Cloudflare                       |

### Linting & Formatting

- **Formatter**: Prettier with `prettier-plugin-astro`
- **Config**: 2-space indent, spaces (no tabs), printWidth 230
- Run: `pnpm exec prettier --check .` (check) or `pnpm exec prettier --write .` (fix)
- Always run `pnpm check` and `pnpm exec prettier --check .` after making changes

### Testing

No test framework is configured. There are no tests in this project.

## Architecture

- `src/pages/` — File-based routing (Astro pages and API routes)
- `src/layouts/` — Page layout wrappers (Default.astro, Projects.astro)
- `src/components/` — Reusable Astro and Svelte components
- `src/i18n/` — Translations (ui.ts) and helper functions (utils.ts)
- `src/locales/` — JSON translation files (en, it)
- `src/projects/` — Markdown content files for projects collection
- `src/loaders/` — Custom Astro live content loaders (e.g., Spotify)
- `src/lib/` — Shared utility functions
- `src/styles/` — Global CSS (Tailwind + DaisyUI imports and theme config)
- `src/images/` — Static image assets

## Path Aliases

Configured in `tsconfig.json` with `@*` → `./src/*`:

| Alias             | Path                   |
| ----------------- | ---------------------- |
| `@components/...` | `./src/components/...` |
| `@layouts/...`    | `./src/layouts/...`    |
| `@i18n/...`       | `./src/i18n/...`       |
| `@images/...`     | `./src/images/...`     |
| `@lib/...`        | `./src/lib/...`        |
| `@styles/...`     | `./src/styles/...`     |

**Always use alias imports over relative paths.** Exception: internal module imports (e.g., within `i18n/` folder).

## Code Style

### Imports

Order (top to bottom):

1. Astro framework imports (`astro:content`, `astro:assets`, `astro:i18n`, `astro-iconset/components`)
2. Layouts (`@layouts/...`)
3. Components (`@components/...`)
4. Images (`@images/...`)
5. Utilities/i18n (`@i18n/...`, `@lib/...`)
6. Third-party imports

Use `import type` for type-only imports. Inline `type` keyword for mixed imports:

```typescript
import { useTranslations, type UiLang } from "@i18n/utils";
```

### Naming Conventions

| Category                    | Convention                | Example                           |
| --------------------------- | ------------------------- | --------------------------------- |
| Components (Astro & Svelte) | PascalCase                | `Card.astro`, `NowPlaying.svelte` |
| Layouts                     | PascalCase                | `Default.astro`                   |
| Pages/routes                | kebab-case or `[dynamic]` | `index.astro`, `[locale]/`        |
| Utility files               | kebab-case                | `cdn-utils.ts`                    |
| Directories                 | kebab-case                | `navbar/`, `loaders/`             |
| Content files               | `YYYYMMDD-Title.md`       | `20250426-Loop events.md`         |
| Locale dirs                 | ISO 639-1                 | `en/`, `it/`                      |
| Variables/functions         | camelCase                 | `nowPlaying`, `getCdnUrl`         |
| Types/interfaces            | PascalCase                | `NowPlayingData`, `UiLang`        |

### TypeScript

- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Prefer `interface` for object shapes; use `type` for unions and utility types
- Props: destructure from `Astro.props` in Astro; use `$props<T>()` in Svelte 5
- Zod schemas for content collection validation in `content.config.ts`

### Astro Components

- Props destructured immediately: `const { title, desc } = Astro.props;`
- Use `interface Props` only when typing is complex
- Named slots: `<slot name="desc" />`
- No `<style>` blocks — style with Tailwind/DaisyUI utility classes only

### Svelte Components

- Use Svelte 5 runes: `$state`, `$derived`, `$props`, `$effect`
- `<script lang="ts">` always
- Scoped `<style>` only for CSS keyframe animations that can't be done with utilities
- Use `@iconify/svelte` for icons inside Svelte (not `astro-iconset`)
- Hydrate from Astro with `client:load` (immediate) or `client:idle` (deferred)

### Styling

- Tailwind CSS 4 + DaisyUI 5 utility classes exclusively
- No CSS modules, no scoped Astro styles
- DaisyUI themes: "light" and "dark" (defined in `src/styles/styles.css`)
- Theme switching via `theme-change` package

### Error Handling

- API routes: return `new Response(JSON.stringify({ error, ... }), { status, headers })`
- Form submissions: redirect with query params (`?status=success` / `?status=error`)
- Loaders: return `{ error: new CustomError(...) }` objects
- Custom error classes extending `Error` with `cause` property
- Client-side: toast/notification patterns with timeout

### Pages & Routing

- `src/pages/[locale]/` for i18n pages (locales: en, it)
- Root `index.astro` redirects to `/en/`
- `getStaticPaths()` for prerendered pages with `export const prerender = true`
- Server-rendered pages (`prerender = false`) for form handling and API routes
- `astro-seo` for Open Graph meta tags

### Content Collections

- Standard: `src/content.config.ts` with glob loader for `projects` collection
- Live: `src/live.config.ts` for real-time data (Spotify)
- Project markdown files have frontmatter only (no body), with Zod-validated schema

### Environment Variables

All server-side, secret, optional. Defined in `astro.config.mjs` via `envField`:

- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`

Access via `import { env } from "astro:env/server"`.

## Key Dependencies

- `astro` 5.x — Framework (SSR output)
- `svelte` 5.x — UI components (runes syntax)
- `tailwindcss` 4.x + `daisyui` 5.x — Styling
- `@astrojs/cloudflare` — Cloudflare Workers adapter
- `astro-iconset` + `@iconify/svelte` — Icon management
- `photoswipe` — Image lightbox
- `sharp` — Image processing
- `theme-change` — DaisyUI theme toggle

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static website for Palladium, a Proof of Work cryptocurrency. Vanilla HTML/CSS/JS — no framework, no bundler, no tests. `public/` is the site root, served as-is.

## Commands

```bash
npm run dev                  # Full dev environment: config gen + optional pool sync + live-server on http://localhost:3000
npm run generate-config      # Regenerate public/js/config.js from .env
npm run sync-pool-data       # Sync ckpool logs into public/pool-data/ once (needs POOL_LOG_DIR in .env)
docker-compose up -d --build # Production: Caddy container on ports 80/443
```

Dev requires a `.env` (copy from `.env.example`). `API_KEY` must match the palladium-stack backend's key. Prod additionally requires `CADDY_HOST` and `POOL_LOG_DIR` in `.env`.

## Architecture

The site depends on **palladium-stack**, a separate Flask backend on port 8080, for live blockchain data (block height, hashrate, peers, pool stats).

- **Dev**: the browser calls the API directly at `API_BASE_URL` with an `X-API-Key` header, both baked into the generated `public/js/config.js` ([scripts/generate-config.js](scripts/generate-config.js)).
- **Prod**: Caddy serves `public/` and proxies `/api/*` to the `palladium-dashboard:8080` container (shared `palladium` Docker network), injecting the API key server-side. `API_BASE_URL` is empty; `config.js` is generated with `--prod` at Docker build time.

All page JS builds requests with `apiUrl(CONFIG.ENDPOINTS.X)` and `apiHeaders()` from config.js.

**Pool data** (`public/pool-data/`) is raw ckpool log output fetched directly by [pool.js](public/js/pool.js) / [pool-user.js](public/js/pool-user.js): synced by script every 30s in dev, mounted read-only from the host in prod. Both `config.js` and `pool-data/` are gitignored/generated — never edit by hand.

## Design & UI conventions

For any visual work (new pages, sections, redesigns, layout fixes), invoke the `ui-ux-pro-max` skill (from the ui-ux-pro-max plugin) first — it defines the quality bar for aesthetics and UX. Useful query context for this site: dark crypto/fintech landing, glassmorphism, cyan brand.

The site has a dark, premium look: near-black blue background, cyan brand accent, Syne for display headings and Poppins for body. All of this is tokenised in [public/css/design-system.css](public/css/design-system.css) — **always use the tokens** (`--bg`, `--surface-1..3`, `--brand`, `--text-1..3`, `--sp-*`, `--radius-*`, `--text-*` fluid type scale, `--spring-*`/`--ease-out-expo` easings) instead of hard-coding colors, sizes, or fonts. Colors are in `oklch()`; derive variants with `color-mix()` like the existing code does.

Reusable building blocks already in the design system — reach for these before writing new CSS:

- `.glass-1` / `.glass-2` — glassmorphism cards
- `.aurora-hero` + `.grain` — animated hero background with grain overlay
- `.gradient-text`, `.section-title` — headings
- `.is-skeleton` — loading placeholders for live API stats
- `data-animate` (scroll-reveal, auto-staggered per sibling group) and `data-count="N"` (animated counters) — powered by common.js, just add the attribute

Layout uses Bulma (compiled into the 13k-line `css/mystyles.css` — treat it as a vendored artifact, don't edit it; override in design-system.css or the page CSS instead). Each page keeps its specific styles in its own `css/<page>.css`.

Quality expectations for any UI change: fully responsive (fluid type scale and 8pt spacing grid are already set up), respects `prefers-reduced-motion` (the design system handles it globally — don't add unconditioned animations outside it), and visually consistent with the existing pages. After changes, verify in the browser via `npm run dev` (http://localhost:3000) — live-server auto-reloads.

## Page structure

Every page is a standalone HTML file in `public/` with a matching `css/<page>.css` and `js/<page>.js` (exception: `pool-user.html` reuses `pool.css`). Shared chrome is injected at runtime by [public/js/common.js](public/js/common.js), which every page must include: it injects `design-system.css` as the first stylesheet, fetches and injects `partials/navbar.html` and `partials/footer.html` (with cache-busting), shows/hides the page loader, and initialises scroll-reveal (`[data-animate]`) and counter (`[data-count]`) animations. So navbar/footer changes go in `public/partials/`, and design tokens live in `public/css/design-system.css`.

Caddy sets `Cache-Control: no-store` on partials, CSS, and pool-data — headers are configured in [Caddyfile](Caddyfile).

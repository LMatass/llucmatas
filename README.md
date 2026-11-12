# Lluc Matas — personal portfolio

A static Astro portfolio based on the approved K composition: personal introduction, horizontally browsable projects, and a compact public-code section. Self-hosted Manrope, plain CSS and a small TypeScript enhancement; content and navigation work without JavaScript.

## Local development

Node 22.12+ is required.

```sh
npm ci
npm run dev
```

Open http://localhost:4321.

```sh
npm run build
npm run preview
```

Production output is in `dist/`. The contribution graph fetches GitHub data at build time using Railway's `GITHUB_TOKEN` variable.

## Daily contribution sync

`.github/workflows/refresh.yml` rebuilds and deploys to Railway every day at 04:00 UTC (GitHub may delay scheduled runs), and can also be run manually from Actions. It then checks that the live graph includes today's date; a missing or stale graph fails the job.

The repository's Actions secret `RAILWAY_TOKEN` must contain a Railway project token scoped to this project's production environment. If Actions reports `Invalid RAILWAY_TOKEN`, create a replacement in Railway → Project Settings → Tokens, update the Actions secret, and run **Refresh deploy** manually. Keep this separate from the `GITHUB_TOKEN` configured in Railway, which reads the contribution calendar.

## Content

Edit `src/data/portfolio.ts` for profile links and project text. Provenance and researched copy live in `PORTFOLIO-CONTENT.md`. Personal projects link to their live sites; public repositories remain separate. The avatar deliberately uses LM initials.

Website previews in `public/images/` are actual captures of the linked projects. Run `node scripts/capture-projects.mjs` to refresh them after installing Chromium with `npx playwright install chromium`.

## Verification

With the local server running, `npm test` checks desktop/mobile overflow, image loading, navigation, project browsing, public-code disclosure, accessibility, reduced motion, and the no-JavaScript fallback. Set `BASE_URL` to test another local preview.

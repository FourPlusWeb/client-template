# CLAUDE.md — Client Template

Generic Next.js 16 starter за корпоративни сайтове. Клиентско репо се създава чрез `@fourplusweb/create-site` CLI (preferred) или GitHub "Use this template" fallback.

**Human developers: start with [README.md](README.md).** This file is AI-oriented guidance.

## Creating a new client site

Use the scaffolder instead of manually forking this template:

```sh
npx @fourplusweb/create-site my-client
```

Prompts for brand values, archetype (A1–A6), variation (P1–P6), and optionally
auto-creates a GitHub repo under `FourPlusWeb/<slug>` plus a linked Netlify
site with `NODE_AUTH_TOKEN` pre-set. Env-var fallback (`GITHUB_TOKEN`,
`NETLIFY_TOKEN`, `NODE_AUTH_TOKEN`) enables non-interactive CI use. See
`@fourplusweb/create-site/README.md` for details.

**Manual fallback:** if the CLI is unavailable, use the GitHub "Use this
template" button at the top of the client-template repo and hand-edit
`site.config.ts` + `BRIEF.md`. Expect ~30–60 min vs. ~5 min with the CLI.

## Къде е какво

- **Брандинг, навигация, контакти** — `site.config.ts`
- **Tailwind тема и токени** — `@fourplusweb/config` (node_modules); override-ват се per-client чрез `site.config.ts` → `themeToCSS()` → `layout.tsx`
- **UI библиотека** — `@fourplusweb/ui` (Button, Card, Hero, Header, Footer, FluidSection, ResponsiveImage, ContactForm…)
- **Страници** — `src/app/`
- **Проектно-специфични компоненти** — `src/components/`
- **Проектно-специфични хелпъри** — `src/lib/`
- **Статични файлове (лого, изображения)** — `public/`
- **Клиентски brief** — `BRIEF.md`

## Правило за цветове и шрифтове

Винаги през токени, никога hardcoded.

- Цветове: `text-primary`, `bg-surface`, `border-border` — стойностите идват от `site.config.ts`.
- Шрифтове: `font-sans`, `font-display` — същото.
- Размери: `text-xs`…`text-display` (fluid clamp-based), `FluidSection` за vertical padding.

Никога `#1E40AF`, `"Inter"`, `text-sm md:text-base lg:text-lg` в компоненти.

## Команди

- `pnpm dev` — локален сървър на :3000
- `pnpm build` — production build
- `pnpm lint` / `pnpm typecheck` / `pnpm test:visual`
- `pnpm verify:auth` — GitHub Packages auth preflight (401 при install → пусни това)
- `pnpm playbook:sync` — refresh `docs/playbook/` snapshots from sibling studio-factory

## Analytics & Legal

Template ships with opt-in analytics + cookie consent baseline. To enable:

1. Set `siteConfig.analytics.<provider>` in `site.config.ts` (Plausible / GA4 / Fathom).
2. Set `siteConfig.monitoring.sentry.dsn` if using Sentry — also install `@sentry/nextjs` as a direct dep.
3. Review + adapt `src/app/privacy-policy/page.mdx` and `src/app/terms/page.mdx` for the client's jurisdiction and activities. Replace `{{TODO}}` placeholders.

**⚠️ Legal disclaimer:** The privacy-policy and terms MDX files are
**structural placeholders**, NOT legal advice. The client must get legal
sign-off before publishing. Studio is not liable for inadequate adaptation.

**Consent flow:** analytics scripts load only after the user clicks "Приемам"
in `<CookieBanner />`. Sentry loads unconditionally (treated as essential
service telemetry per privacy policy §3). Users can reopen the banner by
clearing the `cookie-consent` cookie (no UI for this yet; add if needed).

## Playbook справки

Archetypes, variations, brief, copy/SEO, assets са snapshot-нати в
[`docs/playbook/`](docs/playbook/) (read-only, refresh с `pnpm playbook:sync`).
Canonical source: `studio-factory/playbook/` (не се изисква в клиентските fork-ове).

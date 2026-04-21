# CLAUDE.md — Client Template

Generic Next.js 16 starter за корпоративни сайтове. Fresh client forks започват
с GitHub "Use this template" — това е default пътят за new clients. Studio
staff със съществуващ `@fourplusweb/*` auth могат опционално да ползват
`@fourplusweb/create-site` CLI за по-бърз scaffold.

**Human developers: start with [README.md](README.md).** This file is AI-oriented guidance.

## Creating a new client site

**Default path (fresh contributor, no existing auth):** GitHub "Use this
template" button on the `client-template` repo → clone locally → follow
`README.md` "First 5 minutes" (PAT + `NODE_AUTH_TOKEN` export) → hand-edit
`site.config.ts` + `BRIEF.md`. Expect ~30–60 min.

**Studio-internal path (existing `@fourplusweb/*` auth):**

```sh
npx @fourplusweb/create-site my-client
```

The CLI is a productivity tool for studio staff / authorized contributors
who already have `.npmrc` + `NODE_AUTH_TOKEN` wired up — the same auth
needed to resolve `@fourplusweb/create-site` itself from the private
registry. It's NOT the first-line onboarding entry for fresh client devs.

Prompts for brand values, archetype (A1–A6), variation (P1–P6), and optionally
auto-creates a GitHub repo under `FourPlusWeb/<slug>` plus a linked Netlify
site with `NODE_AUTH_TOKEN` pre-set. Env-var fallback (`GITHUB_TOKEN`,
`NETLIFY_TOKEN`, `NODE_AUTH_TOKEN`) enables non-interactive CI use. See
`@fourplusweb/create-site/README.md` for details.

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
- `pnpm lint` / `pnpm typecheck`
- `pnpm verify:auth` — GitHub Packages auth preflight (401 при install → пусни това)
- `pnpm playbook:sync` — refresh `docs/playbook/` snapshots from sibling studio-factory

## Contact form

Ships with Resend като default email backend за `/contact` form
notifications (MVP, W6.1 — full Phase 10 scope deferred).

**Required env var:** `RESEND_API_KEY`. In local dev, submissions log to
the console without sending if the key is missing (safe smoke-testing).
In production (`NODE_ENV=production`) без key → submit returns a user-
visible error pointing to `siteConfig.contact.email`.

**Per-client config (optional env vars):**

- `RESEND_NOTIFY_EMAIL` — recipient override. Defaults to
  `siteConfig.contact.email`.
- `RESEND_FROM` — sender address. Defaults to `noreply@<site-domain>`.
  Domain must be verified in Resend dashboard (SPF + DKIM at client's
  DNS provider) for deliverability.

**Security layers (defense in depth):**

1. Client-side Zod validation via `@fourplusweb/ui` ContactForm
   (length caps: name 200, email 254, phone 30, message 5000).
2. Server-side Zod re-validation in
   [`src/app/contact/actions.ts`](src/app/contact/actions.ts) — direct
   POSTs bypass the client-side layer, so never trust it alone.
3. Honeypot: hidden `website` field in the ui package auto-rejects bot
   submissions (silent success returned so the trap stays hidden).
4. In-memory rate limit: 3 submissions per IP per 5-minute window.
   Resets on cold start; acceptable for SMB volume. Upgrade to a shared
   store (Upstash/Redis) if scaling beyond one function instance.

**Logging:** metadata only (masked email, truncated IP, message char
count). Never log the message body — GDPR minimization.

**DNS setup per client:** SPF + DKIM records from Resend dashboard.
Document in handoff checklist. See `playbook/delivery.md`.

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

## Image pipeline

Client-provided images (phones, cameras) usually arrive като 3–5 MB JPEGs
без responsive variants. Local pipeline ги преработва преди commit:

1. Сложи originals в `raw-assets/` (gitignored — НЕ commit-вай raw images).
2. Run `pnpm images:prep`.
3. Output: `public/images/<base>-<width>.{webp,jpg,avif}` за widths 400 / 800 / 1600.
   AVIF се генерира само на 1600 (diminishing returns под това).
4. Commit `public/images/*` (runtime artifacts).
5. Consume в компоненти:

   ```tsx
   <ResponsiveImage src="/images/hero-1600.webp" alt="…" aspectRatio="16/9" />
   ```

   `ResponsiveImage` използва `next/image` с `fill` + един `src` —
   Next.js сам прави runtime srcset от source-а. Pre-generated 400 / 800
   variants служат за non-Next consumers (raw `<img>` в MDX, OG, email).

Quality settings: WebP 82, JPEG 85 (mozjpeg), AVIF 70.

**HEIC caveat:** `sharp` често е build-нат без libheif. При HEIC error
скриптът прескача файла и казва да го конвертираш към JPG/PNG първо.

## Playbook справки

Archetypes, variations, brief, copy/SEO, assets са snapshot-нати в
[`docs/playbook/`](docs/playbook/) (read-only, refresh с `pnpm playbook:sync`).
Canonical source: `studio-factory/playbook/` (не се изисква в клиентските fork-ове).

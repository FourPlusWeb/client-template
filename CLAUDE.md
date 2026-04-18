# CLAUDE.md — Client Template

Generic Next.js 15 starter за корпоративни сайтове. Клиентско репо се създава чрез GitHub "Use this template".

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

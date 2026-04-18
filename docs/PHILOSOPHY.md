# Философия и стандарти на template-а

Това е контекст за хора, не за Claude Code. CLAUDE.md е минимален по дизайн; детайлите живеят тук.

## Template usage — стъпки за нов клиентски проект

1. Запълни `site.config.ts` с реални брандинг стойности (име, цветове, контакти, навигация).
2. Замени логото и favicon в `public/`.
3. Обнови заглавието и описанието в `CLAUDE.md` и в `BRIEF.md`.
4. Попълни `BRIEF.md` с клиента на kickoff call (30–45 мин).
5. Изтрий или замени placeholder блог постовете в `content/blog/*.mdx` и SVG placeholder-ите в `public/blog/`.

## Production playbook

Живее в `../studio-factory/playbook/`:

- `archetypes.md` — 6 page shapes + section orders + required inputs
- `variations.md` — 6 visual personality presets (token overrides)
- `copy-seo.md` — hero/benefit/CTA patterns + meta tags + local SEO
- `assets.md` — logo/images/favicon/OG pipeline
- `delivery.md` — pre-launch checklist + post-launch loop
- `brief.md` — BRIEF.md template дефиниция

Playbook-ът е advisory за production решения. Ако конфликт — `studio-factory/archive/PLAN-v1.md` побеждава за stack и компонентен API.

## Brief gate

ПРЕДИ да пишеш page код:

1. Прочети `BRIEF.md`.
2. Ако съдържа `TODO:` маркери — спри. Питай brief owner-а.
3. Ако Archetype или Variation не са попълнени — спри. Питай.
4. Ако Main CTA няма destination — спри. Питай.
5. Не изнасяй assumption-и за offer, audience или tone. Питай.

Никога не попълвай `BRIEF.md` сам. Това е клиентски input, не generated content.

Изключение: в самия `client-template` `BRIEF.md` е intentionally празен. Brief gate блокира page работа, не scaffolding/infra.

## Responsive стратегия (три нива)

1. **Fluid скали** — за typography и vertical spacing на секции. Винаги `text-xs` до `text-display` (clamp-based), винаги `FluidSection` или `py-[var(--spacing-fluid-md)]`. Никога `text-sm md:text-base lg:text-lg`.
2. **Container queries** — за компоненти от `@fourplusweb/ui` или `src/components/`, които могат да се появят в различни контексти. `className="@container"` обвивка + `@md:`/`@lg:`/`@xl:` за вътрешен layout.
3. **Viewport breakpoints** — само за page-level layout. `md:`/`lg:`/`xl:` за брой колони в grid, sidebar видимост, hamburger меню. Никога за вътрешност на reusable компонент.

Subgrid: при редица карти с променлива дължина използвай `grid-rows-subgrid` за align на вътрешните елементи.

## Mobile UX минимуми (< 768px)

- Touch targets: 44×44px (iOS HIG) / 48×48px (Material)
- Tap spacing: 8px между кликаеми елементи
- Input font-size: 16px+ (под това iOS Safari zoom-ва)
- Sticky header: ≤ 64px височина
- Modal/drawer: `dvh`, не `vh`
- Horizontal scroll: никъде освен explicit carousels
- Форми: label-и над input-а на mobile

## Изображения

`ResponsiveImage` от `@fourplusweb/ui` с правилен `sizes` hint:

- `full` → `100vw` (hero)
- `half` → половин ширина на desktop
- `third` → трета от ширината (3-колонен grid)
- `card` → фиксиран максимум (~400px)

Винаги `aspectRatio` за предотвратяване на layout shift.

## SEO и достъпност

- `export const metadata` в `page.tsx`/`layout.tsx` (title, description, openGraph)
- Семантичен HTML (`main`, `section`, `article`, `nav`, `header`, `footer`)
- Alt текст на всички изображения
- Цветови контраст ≥ 4.5:1
- Фокусно управление (tab навигация)
- ARIA атрибути при нужда

## CI

При всеки push GitHub Actions проверява `pnpm lint`, `pnpm typecheck`, `pnpm test:visual` (Playwright snapshots на 375/768/1024/1440/1920px).

## Troubleshooting: @fourplusweb/* auth

Пакетите са в private GitHub Packages registry. `pnpm install` → 401? Първа стъпка винаги: `pnpm verify:auth`.

| verify-auth казва                  | Fix                                                 |
| ---------------------------------- | --------------------------------------------------- |
| ".npmrc липсва"                    | `cp .npmrc.example .npmrc`                          |
| "NODE_AUTH_TOKEN не е set"         | Export token в shell-а или Vercel env vars          |
| "Token expired"                    | Нов PAT, update env var                             |
| "липсва read:packages scope"       | Нов PAT с `read:packages` scope                     |
| "Registry 401" (валиден token)     | SSO authorize PAT за FourPlusWeb org                |
| "Package не е намерен"             | Провери https://github.com/orgs/FourPlusWeb/packages |

Vercel: `NODE_AUTH_TOKEN` трябва да е set за Production, Preview и Development. CI: GitHub Actions `secrets.GITHUB_TOKEN` работи само в org-а който owns packages — иначе отделен `NPM_READ_TOKEN` secret с SSO достъп.

## Конвенции

- TypeScript strict. Никога `any`.
- RSC по подразбиране. `"use client"` само при useState/useEffect/event handlers.
- Само Tailwind utility класове. Без inline styles, без CSS модули.
- PascalCase за компоненти, camelCase за функции/променливи.
- Conventional Commits на английски (`feat:`, `fix:`, `chore:`).

## Не прави

- Не добавяй нови npm зависимости без да обясниш защо.
- Не използвай Redux, Zustand или друг state manager.
- Не пиши CSS файлове — само Tailwind.
- Не слагай бизнес логика в компоненти — извади в `src/lib/`.
- Не комитвай `.env` файлове.
- Не смесвай container queries и viewport breakpoints в един компонент.

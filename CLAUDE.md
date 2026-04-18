# CLAUDE.md — Проект: Client Template (generic starter)

## Template usage

Това е template репо. При `Use this template` се създава ново клиентско репо. Първите стъпки за нов проект:

1. Запълни `site.config.ts` с реални брандинг стойности (име, цветове, контакти, навигация).
2. Замени логото и favicon в `public/`.
3. Обнови заглавието и описанието в този файл (`CLAUDE.md`) и в `BRIEF.md`.
4. Попълни `BRIEF.md` с клиента на kickoff call (30–45 мин). Без попълнен brief Claude Code не започва page работа — виж "Brief gate" по-долу.
5. Изтрий или замени placeholder блог постовете в `content/blog/*.mdx` и SVG placeholder-ите в `public/blog/` — това е seed съдържание, не клиентско.

## Контекст

Корпоративен сайт за {описание на клиента}. Next.js 15 App Router, TypeScript strict, Tailwind v4.
Споделени компоненти от @fourplusweb/ui, @fourplusweb/config.

## Задължително четене (преди page работа)

Този проект произвежда страница за реален клиент. Работим от studio-factory playbook:

- `BRIEF.md` (в корена) — клиентски kickoff intake. Gate за page работа (виж "Brief gate" по-долу).
- `../studio-factory/playbook/README.md` — production flow overview.
- `../studio-factory/playbook/archetypes.md` — 6 page shapes + section orders + required inputs.
- `../studio-factory/playbook/variations.md` — 6 visual personality presets (token overrides).
- `../studio-factory/playbook/copy-seo.md` — hero/benefit/CTA patterns + meta tags + local SEO.
- `../studio-factory/playbook/assets.md` — logo/images/favicon/OG pipeline.
- `../studio-factory/playbook/delivery.md` — pre-launch checklist + post-launch loop.

Playbook-ът е **advisory** за production решения. `PLAN.md` остава authoritative за stack,
tokens и component API — при конфликт, PLAN побеждава.

## Команди
- pnpm dev        — локален сървър на :3000
- pnpm build      — production build
- pnpm lint       — ESLint проверка
- pnpm typecheck  — TypeScript проверка
- pnpm test:visual — Playwright visual snapshots
- pnpm verify:auth — GitHub Packages auth preflight (виж Troubleshooting)

## Структура
- src/app/         — App Router страници. Всяка папка = URL path.
- src/components/  — компоненти специфични за този проект.
- src/lib/         — хелпъри специфични за този проект.
- site.config.ts   — брандинг, навигация, контакти.
- public/          — статични файлове (лого, изображения).

## Правила за код
- TypeScript strict. Никога any.
- React Server Components по подразбиране. "use client" само при useState/
  useEffect/event handlers.
- Стилове: само Tailwind utility класове. Без inline styles, без CSS модули.
- Именуване: PascalCase за компоненти, camelCase за функции и променливи.
- Компоненти от @fourplusweb/ui: import { Button, Card, ... } from "@fourplusweb/ui"
- Икони: import { Icon } from "lucide-react"
- Анимации: import { motion } from "framer-motion"

## Responsive правила (КРИТИЧНИ)

### Три нива, всяко със своя роля:

1. Fluid скали — за typography и vertical spacing на секции.
   - Винаги: text-xs до text-display класове (те вече са clamp-based)
   - Винаги: FluidSection компонента или py-[var(--spacing-fluid-md)]
   - НИКОГА: text-sm md:text-base lg:text-lg (остарял подход)

2. Container queries — за компоненти в @fourplusweb/ui или src/components/,
   които могат да се появят в различни контексти.
   - Обвий компонента с className="@container"
   - Използвай @md: / @lg: / @xl: за вътрешен layout
   - Пример: <div className="@container"><div className="p-4 @md:p-6 @lg:p-8">

3. Viewport breakpoints — само за page-level layout.
   - md: / lg: / xl: за броя колони в grid, sidebar видимост, hamburger меню
   - НИКОГА за вътрешност на reusable компонент

### Subgrid за aligned editorial layouts
Когато имаш редица от карти с променлива дължина на съдържанието —
използвай grid-rows-subgrid, за да align-неш вътрешните елементи
(заглавие/описание/CTA) през цялата редица.

## Mobile UX минимуми (< 768px)

- Touch targets: минимум 44×44px (iOS HIG) / 48×48px (Material)
- Tap spacing: минимум 8px между кликаеми елементи
- Input font-size: минимум 16px (под това iOS Safari zoom-ва при focus)
- Sticky header: максимум 64px височина (иначе яде viewport)
- Modal/drawer: използвай dvh (dynamic viewport height), не vh — иначе
  мобилният address bar чупи layout-а
- Horizontal scroll: НИКЪДЕ освен в explicit carousel компоненти
- Форми: label-и ВИНАГИ над input-а на mobile, не отстрани

## Изображения (ЗАДЪЛЖИТЕЛНО)
Всяко изображение използва ResponsiveImage от @fourplusweb/ui с правилен sizes hint:
- sizes="full"   — пълна ширина (hero)
- sizes="half"   — половин ширина на desktop
- sizes="third"  — трета от ширината (3-колонен grid)
- sizes="card"   — фиксиран максимум (~400px)
Винаги задавай aspectRatio за предотвратяване на layout shift.

## Brief gate

ПРЕДИ да пишеш page код:
1. Прочети BRIEF.md.
2. Ако BRIEF.md съдържа "TODO:" маркери — спри. Попитай brief owner-а.
3. Ако Archetype или Variation не са попълнени — спри. Питай.
4. Ако Main CTA няма destination — спри. Питай.
5. Не изнасяй assumption-и за offer, audience или tone. Питай.

Никога не попълвай BRIEF.md сам. Това е клиентски input, не generated content.

**Изключение за template репото:** В самия `client-template` (този репо) BRIEF.md е intentionally празен — той е template за клиентски репа. Brief gate блокира **page работа**, не scaffolding/infra. Phase 07 и infra поддръжка на template-а са OK без попълнен brief.

## Workflow: преди да пишеш код
1. Прочети site.config.ts за контекст на клиента.
2. Провери дали @fourplusweb/ui има готов компонент: packages/ui/src/components/.
3. Ако няма — създай компонент в src/components/ на проекта.
4. Компонентът използва ли container queries? Ако може да се появи на
   повече от едно място — ДА.
5. Комити: Conventional Commits на английски (feat:, fix:, chore:).

## SEO
- export const metadata в page.tsx или layout.tsx (title, description, openGraph)
- Семантичен HTML (main, section, article, nav, header, footer)
- Alt текст на всички изображения

## Достъпност
- Цветови контраст ≥ 4.5:1
- Фокусно управление (tab навигация)
- ARIA атрибути при нужда
- Семантични HTML елементи вместо div за всичко

## CI
При всеки push GitHub Actions проверява:
- pnpm lint
- pnpm typecheck
- pnpm test:visual (Playwright snapshots на 375/768/1024/1440/1920px)

## Troubleshooting: @fourplusweb/* auth

Пакетите са в private GitHub Packages registry. Най-честите failures:

**Симптом:** `pnpm install` → 401 Unauthorized
**Първа стъпка винаги:** `pnpm verify:auth`

Verify-ът дава exact reason. Таблица за fix:

| verify-auth казва                  | Какво да направиш                                  |
| ---------------------------------- | -------------------------------------------------- |
| ".npmrc липсва"                    | `cp .npmrc.example .npmrc`                         |
| "NODE_AUTH_TOKEN не е set"         | Export token в shell-а или Vercel env vars         |
| "Token expired"                    | Генерирай нов PAT, update-ни env var-а             |
| "липсва read:packages scope"       | Нов PAT с `read:packages` scope                    |
| "Registry 401" (token валиден но)  | SSO authorize: github.com → Settings → Developer settings → PAT → "Configure SSO" за FourPlusWeb org |
| "Package не е намерен"             | Провери https://github.com/orgs/FourPlusWeb/packages — публикуван ли е? |

**Vercel-specific:** env var `NODE_AUTH_TOKEN` трябва да е set за
Production, Preview, И Development environments. Липсва ли го за
Preview → PR deploy-ите fail-ват мълчаливо на install step.

**CI-specific:** GitHub Actions `secrets.GITHUB_TOKEN` работи САМО
ако pipeline-ът тича в org-а който owns packages. Ако template
repo е в различен org/personal account → създай separate secret
`NPM_READ_TOKEN` с PAT който има SSO достъп до FourPlusWeb.

## Не прави
- Не добавяй нови npm зависимости без да обясниш защо.
- Не използвай Redux, Zustand или друг state manager.
- Не пиши CSS файлове — само Tailwind.
- Не слагай бизнес логика в компоненти — извади в src/lib/.
- Не комитвай .env файлове.
- Не смесвай @container queries и viewport breakpoints в един компонент.

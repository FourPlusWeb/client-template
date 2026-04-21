> **Read-only snapshot** of `studio-factory/playbook/variations.md` (authoritative source). Snapshot taken: 2026-04-21.

# Visual Personality Presets

> Variation = token override, не component fork. Core design system остава непокътнат. Всеки preset е concrete set of values, не prose. Избери **един** preset per проект.

Variation override-ва само:
- token стойности (radius, shadow, density, motion, type pairing, color saturation)
- composition rhythm (section gap scale, density)
- CTA strategy (solid/outline/ghost default)

Variation **не** override-ва:
- component API (props, children structure)
- responsive strategy (fluid scale, container queries, breakpoints)
- mobile UX минимуми (touch targets, dvh, 16px inputs)
- accessibility изисквания

---

## Как се прилага

1. Избери preset table по-долу.
2. Копирай overrides-ите в `site.config.ts` → `variation: "..."` + token overrides.
3. В `layout.tsx` themeToCSS() инжектира всички overrides като CSS custom properties.
4. Ако preset не покрива конкретна стойност — използва се default от PLAN#design-tokens.

```ts
// site.config.ts
export const siteConfig: SiteConfig = {
  // ...
  variation: "editorial",         // един от 6-те по-долу
  style: {
    radius: "sm",                  // override от variation table
    shadow: "none",
    buttonStyle: "outline",
    density: "spacious",
    motion: "subtle",
    typePairing: "serif-display",
  },
};
```

Това изисква `SiteConfig` типът да бъде extended с `variation`, `density`, `motion`, `typePairing`. Добавя се в `@fourplusweb/config` като **minor release** преди първи client с variation system. Правилата за extension (всички нови полета optional, default поведение в consumer layer, никакви renames без major) са canonical в PLAN#14 → "SiteConfig extension rules". Не дублирай правилата тук.

### Concrete token mappings (consumer layer в `themeToCSS()`)

От `@fourplusweb/config@0.2.0` насам `themeToCSS()` прилага variation overrides като CSS custom properties върху `<body>`. Конкретните мапинги:

- **`variation`** — bundle of defaults; използва се като "meta-preset". Очаква се consumer-ът да подаде съответните `style`/`density`/`motion`/`typePairing` стойности заедно с него. Самата `variation` стойност се записва в `data-variation` атрибут за conditional CSS (напр. `@media (...) body[data-variation="editorial"] { ... }`).
- **`density`** → `--pad-hero`, `--pad-pillar`, `--pad-detail`, `--pad-cta` overrides. `compact` свива до `--pad-fluid-lg|md|sm`; `spacious` разтяга до `--pad-fluid-2xl|xl|lg|xl`. `medium` = defaults.
- **`motion`** → `--duration-fast`, `--duration-medium`, `--duration-slow` overrides. `none` = всички 0ms (и `prefers-reduced-motion` продължава да работи независимо); `subtle` = 120/280/400ms; `gentle` = 180/360/520ms; `strong` = 200/440/680ms; `functional` = 120/200/280ms (бърз за UI state transitions).
- **`typePairing`** → `--font-sans` + `--font-display` overrides. `sans-neutral` = Inter everywhere; `serif-display` = Inter body + Fraunces display; `serif-headline` = Inter body + Newsreader display; `humanist` = Nunito everywhere; `sans-geometric` = Inter body + Geist display; `display-heavy` = Inter body + Plus Jakarta Sans display.

### Пример — P2 Editorial preset

```ts
// site.config.ts
import type { SiteConfig } from "@fourplusweb/config";

export const siteConfig: SiteConfig = {
  // ... standard fields
  variation: "editorial",
  density: "spacious",
  motion: "subtle",
  typePairing: "serif-headline",
  style: {
    radius: "sm",
    shadow: "none",
    buttonStyle: "outline",
  },
  negativeDescriptors: [
    "not a marketing funnel",
    "not templated",
    "not image-heavy",
  ],
};
```

Резултатът: `--pad-hero` скача на `--pad-fluid-2xl` (8rem → 232px), `--duration-medium` = 280ms (confident, not flashy), `--font-display` = Newsreader (editorial сериф), buttons без shadow, radius 6px. `negativeDescriptors` се консумират в brief-а (§7a), не в UI.

---

## P1 — Premium

**Когато:** luxury, high-ticket B2B, legal, finance, architecture.

**Archetypes:** A2, A3, A4, A6.

| Dimension       | Value                                   |
| --------------- | --------------------------------------- |
| radius          | `sm` (6px)                              |
| shadow          | `none` или `sm`                         |
| buttonStyle     | `outline` (primary), `ghost` (secondary)|
| density         | `spacious` (section gaps × 1.25)        |
| motion          | `subtle` (fade+rise, 300–400ms)         |
| typePairing     | `serif-display` (напр. Fraunces + Inter)|
| colorSaturation | low (desaturated primary)               |
| imageTreatment  | `grade-warm` или `bw`                   |
| sectionRhythm   | large fluid-xl padding                  |

**Copy tone:** confident, understated, no exclamation marks.

---

## P2 — Editorial

**Когато:** case studies, portfolio, thought-leadership, agency work.

**Archetypes:** A4, A3 (с adaptations).

| Dimension       | Value                                    |
| --------------- | ---------------------------------------- |
| radius          | `none` или `sm`                          |
| shadow          | `none`                                   |
| buttonStyle     | `outline`                                |
| density         | `spacious` + asymmetric grid             |
| motion          | `subtle` (scroll-linked, not flashy)     |
| typePairing     | `serif-headline` (Fraunces/Newsreader)   |
| colorSaturation | medium, accent used sparingly            |
| imageTreatment  | `full-bleed`, large figures              |
| sectionRhythm   | variable — hero huge, body standard      |
| layoutQuirks    | subgrid-heavy, pull quotes, drop caps    |

**Copy tone:** narrative, first-person OK, long sentences allowed.

---

## P3 — Minimal

**Когато:** calm content-light sites, professional services, content-first reading.

**Archetypes:** A6, A3.

| Dimension       | Value                                   |
| --------------- | --------------------------------------- |
| radius          | `none`                                  |
| shadow          | `none`                                  |
| buttonStyle     | `ghost` (primary), text links otherwise |
| density         | `spacious` (max whitespace)             |
| motion          | `none` или fade-in-only                 |
| typePairing     | `sans-neutral` (Inter alone)            |
| colorSaturation | monochrome + single accent              |
| imageTreatment  | `minimal` (no grading, modest sizes)    |
| sectionRhythm   | uniform fluid-lg                        |

**Copy tone:** short, plain, zero marketing speak.

---

## P4 — Bold / High-energy

**Когато:** events, launches, campaigns, consumer brands, young audience.

**Archetypes:** A5, A1.

| Dimension       | Value                                     |
| --------------- | ----------------------------------------- |
| radius          | `lg` или `full`                           |
| shadow          | `lg`                                      |
| buttonStyle     | `solid` (chunky, big)                     |
| density         | `compact` (tight packing)                 |
| motion          | `strong` (parallax, reveal, hover lifts)  |
| typePairing     | `display-heavy` (Plus Jakarta Sans bold)  |
| colorSaturation | high (bright primary + contrasting accent)|
| imageTreatment  | `vibrant`, `duotone`, или animated        |
| sectionRhythm   | tight, high-contrast background flips     |

**Copy tone:** urgent, imperative verbs, exclamation marks OK.

---

## P5 — Tech / Clean

**Когато:** SaaS, developer tools, B2B tech, dashboards, API products.

**Archetypes:** A1, A2, A4.

| Dimension       | Value                                        |
| --------------- | -------------------------------------------- |
| radius          | `md` (10px)                                  |
| shadow          | `sm` (crisp, not blurry)                     |
| buttonStyle     | `solid` (primary), `outline` (secondary)     |
| density         | `medium`                                     |
| motion          | `functional` (tooltips, state transitions)   |
| typePairing     | `sans-geometric` (Inter + Geist Mono accents)|
| colorSaturation | medium, brand color + neutral gray scale     |
| imageTreatment  | `product-screenshot` heavy, charts OK        |
| sectionRhythm   | structured grid, modular                     |

**Copy tone:** precise, specification-style, numbers welcome.

---

## P6 — Warm / Friendly

**Когато:** healthcare, education, family services, local business, non-profit.

**Archetypes:** A2, A3, A6.

| Dimension       | Value                                         |
| --------------- | --------------------------------------------- |
| radius          | `lg` (16px — soft corners)                    |
| shadow          | `md` (soft)                                   |
| buttonStyle     | `soft` (tinted) или `solid`                   |
| density         | `medium`                                      |
| motion          | `gentle` (ease-out, 400–500ms)                |
| typePairing     | `humanist` (Nunito, Lato, Source Sans)        |
| colorSaturation | medium-high warm palette (terracotta, amber)  |
| imageTreatment  | `people-first`, candid, warm grading          |
| sectionRhythm   | uniform, comforting                           |

**Copy tone:** conversational, "you" и "we", no jargon.

---

## Compatibility matrix

| Archetype | P1 Premium | P2 Editorial | P3 Minimal | P4 Bold | P5 Tech | P6 Warm |
| --------- | ---------- | ------------ | ---------- | ------- | ------- | ------- |
| A1        | OK         | —            | —          | GOOD    | GOOD    | OK      |
| A2        | GOOD       | OK           | OK         | —       | GOOD    | GOOD    |
| A3        | GOOD       | OK           | GOOD       | —       | OK      | GOOD    |
| A4        | GOOD       | GOOD         | OK         | —       | GOOD    | —       |
| A5        | —          | —            | —          | GOOD    | OK      | —       |
| A6        | GOOD       | —            | GOOD       | —       | —       | GOOD    |

"GOOD" = препоръчителна комбинация. "OK" = работи. "—" = не съчетавай (mismatch в tone/intent).

---

## Enforcement

- Variation избран в `site.config.ts` → Claude Code чете и прилага **само** token overrides.
- Claude Code **не** добавя нови components заради variation. Ако preset иска feature, което core UI не поддържа (напр. parallax), това е release в `@fourplusweb/ui`, не ad-hoc.
- Ако брандинг иска нещо извън presets (напр. rotating gradients) — не push-вай в variation layer. Това е one-off custom work за проекта.

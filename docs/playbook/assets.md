> **Read-only snapshot** of `studio-factory/playbook/assets.md` (authoritative source). Snapshot taken: 2026-04-21.

# Asset Pipeline

> Как logo, изображения, OG графики и икони се обработват преди и по време на проекта. Целта: никога да не хардкодваме пътища, никога да не load-ваме unoptimized assets, и да имаме ясна ownership на всеки файл.

---

## 1. Logo variants

Всеки клиентски проект има **поне 4 logo варианта** в `public/brand/`:

```
public/brand/
├── logo.svg              ← primary, color, horizontal (header)
├── logo-mark.svg         ← само иконата/монограмата, квадратна
├── logo-dark.svg         ← на тъмен фон (за hero overlays, dark footer)
├── logo-mono.svg         ← монохромен (за print / email signatures)
└── favicon/              ← виж т.2
```

**Правила:**
- SVG винаги, ако клиентът има vector source. PNG fallback само ако receiving raster-only asset от клиента.
- SVG-тата се оптимизират с SVGO преди commit (свалени editor metadata, numerical precision 3).
- Dimensions в `viewBox`, не в `width`/`height` атрибути — позволява resize без CSS gotchas.
- `aria-label` на logo в Header компонента ("{Client name} logo").

**Когато клиентът няма logo:**
- НЕ генерираме logo в Claude Code. Това е design work, не page work.
- Placeholder: text-based wordmark в `Header` (name in display font), докато реален logo пристигне. Флагва се в BRIEF → assets status.

---

## 2. Favicon pipeline

`public/brand/favicon/` съдържа пълен set генериран от `logo-mark.svg`:

```
favicon/
├── favicon.ico           ← 16+32+48 multi-res
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png  ← 180×180
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── site.webmanifest
```

**Generation:**
- Еднократно през `realfavicongenerator.net` или CLI (e.g., `pwa-asset-generator`).
- Commit целият set. НЕ генерирай on-build.

`layout.tsx` ги експортва чрез Next.js metadata API:
```ts
export const metadata = {
  icons: { icon: "/brand/favicon/favicon.ico", apple: "/brand/favicon/apple-touch-icon.png" },
  manifest: "/brand/favicon/site.webmanifest",
};
```

---

## 3. Image sourcing

**Hierarchy на източници:**

1. **Client-provided** (preferred) — реални photos на client, екип, продукт, locations. Винаги request на kickoff (виж brief.md → Assets status).
2. **Commissioned** — ако бюджетът позволява photography session.
3. **Stock (paid)** — Unsplash+ / Shutterstock / Getty. License се записва в `public/ASSET-LICENSES.md` (виж т.8).
4. **Stock (free)** — Unsplash / Pexels. Attribution записва в ASSET-LICENSES.md.
5. **AI-generated** — **само** за illustrations/abstract, **никога** за "fake team members" или "fake client faces". Ethical hard line.

**Никога:**
- Google Images search + download.
- Скрийншоти от conкурентни сайтове.
- "Found it online" without source trail.

---

## 4. Image compression & format

**Pipeline преди commit в `public/`:**

`client-template` ships `pnpm images:prep` (виж `scripts/prep-images.mjs`)
— стандартният процес. Не оптимизирай ръчно през online tools, ако
сценариите по-долу го покриват.

1. **Raw file** (от client или stock) в `raw-assets/` (gitignored — НЕ commit-вай originals).
2. **Run `pnpm images:prep`.** Скриптът използва `sharp` за:
   - Auto-rotate по EXIF (телефонни снимки идват често с rotation метаданни).
   - Resize до 3 widths: 400 / 800 / 1600px (`withoutEnlargement` — никога upscale).
   - Encode WebP @ q82 + JPEG @ q85 (mozjpeg) за всеки width.
   - AVIF @ q70 само на 1600 (diminishing returns под това; AVIF encoding е 5–10× по-бавен).
3. **Output**: `public/images/<base>-<width>.{webp,jpg,avif}` — commit-ват се (runtime artifacts).
4. **Quality settings** в скрипта са tuned за photos. За product screenshots с дребен text:
   - Или ръчно `sharp` с по-високо quality (90+),
   - Или ръчно през Squoosh / ImageOptim.
5. **HEIC limitation:** `sharp` често е build-нат без libheif. Ако скриптът фейл-не на `.heic` файл — convert към JPG/PNG първо (Preview / `magick convert`).

**Naming convention:**
```
public/images/
├── hero/
│   ├── home-hero.webp       ← page-specific, descriptive
│   └── home-hero.jpg
├── team/
│   ├── team-ivan-petrov.webp
│   └── team-maria-ivanova.webp
├── cases/
│   └── case-clientname-cover.webp
└── products/
    └── product-sku-001.webp
```

**Правила:**
- kebab-case.
- Include content hint (hero, team, case, product).
- НИКОГА `image1.jpg`, `IMG_4521.webp`, `untitled.webp`.

**Lazy-loading:** `next/image` default (освен hero с `priority`). Никога `<img>` директно освен в RSS/email templates.

---

## 5. ResponsiveImage wrapper

Всяко изображение в компоненти използва `<ResponsiveImage>` от `@fourplusweb/ui` (виж PLAN#component-library → ResponsiveImage API).

**Задължителни props:**
- `src` — абсолютен път от `public/` (напр. `/images/home-hero-1600.webp`).
  При `pnpm images:prep` output-а sочи към най-голямата variant (`-1600.webp`)
  — `next/image` (зад `<ResponsiveImage fill>`) сам прави runtime srcset
  от source-а. По-малките 400/800 variants служат за non-Next consumers
  (raw `<img>` в MDX, OG, email).
- `alt` — descriptive, не filename. За decorative images: `alt=""` + `aria-hidden`.
- `aspectRatio` — винаги. Предотвратява CLS.
- `sizes` — hint според context (`full`/`half`/`third`/`card`).
- `priority` — само за above-the-fold hero image. Максимум 1 priority image на page.

---

## 6. OG image generation

Всяка page има **своя OG image** (не generic site logo).

**Два подхода:**

### 6a — Static OG images (simple)

`public/og/` съдържа pre-generated PNG-та:
```
public/og/
├── home.png         ← 1200×630
├── about.png
├── services.png
├── contact.png
└── default.png      ← fallback
```

Process: Design-time — генерираме в Figma от template, export 1200×630 PNG.

**Правила:**
- Typography >= 48px минимум (читаемо в preview).
- Logo в угол, не централно (запазваме place за title).
- Background = brand color или темна photo с 50% overlay.

### 6b — Dynamic OG images (за blog / many pages)

Next.js Route Handler `/app/og/route.tsx` с `next/og` `ImageResponse`:

```tsx
// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "FourPlus.bg";
  return new ImageResponse(
    <div style={{ /* layout */ }}>
      <h1 style={{ fontSize: 72 }}>{title}</h1>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

`layout.tsx` metadata:
```ts
openGraph: { images: [`/og?title=${encodeURIComponent(title)}`] }
```

Използвай 6b за блог и за archetypes A4 (case studies) — повече pages, всяка с уникално заглавие.

---

## 7. Icon usage

**Library:** Lucide React (единствената иконна library в stack-а — виж PLAN#tech-stack).

**Правила:**
- Import per-icon: `import { ArrowRight } from "lucide-react"`. Никога barrel import.
- Default size 20px за inline text, 24px за buttons, 32px+ за feature bullets.
- `aria-hidden="true"` на decorative икони. `aria-label` на icon-only buttons.
- Никога не mix-вай Lucide с Feather / Heroicons / Phosphor в един проект — visual inconsistency.

**Кога ползвай custom SVG:**
- Brand-специфични symbols (logo mark, custom product glyphs).
- Поставят се в `public/icons/` или като inline React компонент в `src/components/icons/`.

---

## 8. Media ownership and versioning

`public/ASSET-LICENSES.md` в всеки клиентски проект. Track-ва source + license + expiration.

Template:
```markdown
# Asset Licenses

Last updated: YYYY-MM-DD

## Images

| File                              | Source      | License              | Rights expire | Attribution required |
| --------------------------------- | ----------- | -------------------- | ------------- | -------------------- |
| /images/hero/home-hero.webp       | Client      | Owned by client      | N/A           | No                   |
| /images/team/team-ivan-petrov.webp| Client      | Owned by client      | N/A           | No                   |
| /images/cases/case-acme-cover.webp| Unsplash    | Unsplash License     | N/A           | No (courtesy: @user) |
| /images/stock/office-1.webp       | Shutterstock| Standard ID: 123456  | 2031-04-18    | No                   |

## Fonts

| Font             | Source         | License      | Usage scope |
| ---------------- | -------------- | ------------ | ----------- |
| Inter Variable   | Google Fonts   | OFL          | Web         |
| Plus Jakarta Sans| Google Fonts   | OFL          | Web         |

## Logo and brand

Provided by client on YYYY-MM-DD. Copyright: {Client name}. Used under master service agreement dated YYYY-MM-DD.
```

**Правила:**
- Обновява се при всяко ново asset добавяне.
- При offboarding на клиент → export на ASSET-LICENSES.md + всички owned assets в separate handoff archive.

---

## 9. Handoff архив (при project end)

Когато проектът се предава на client-а (или се архивира), създай `handoff/` директория (в `.gitignore` на repo, но се дава на клиента като ZIP):

```
handoff/
├── source-images-raw/       ← оригиналните raw файлове от client
├── brand-kit/               ← final logo.svg + dark + mark + mono
├── og-images-source/        ← Figma export source (editable)
├── ASSET-LICENSES.md        ← копие
└── README.md                ← какво има в архива + retention note
```

Claude Code **не** генерира този архив автоматично. Това е project lead task.

> **Read-only snapshot** of `studio-factory/playbook/copy-seo.md` (authoritative source). Snapshot taken: 2026-04-19.

# Copy and SEO Playbook

> Practical templates за hero, benefits, objections, CTAs, meta tags. Целта: Claude Code да има concrete patterns, не общи съвети.

Copy tone идва от `BRIEF.md` → "Tone and voice" и от избрания variation preset (виж variations.md).

---

## 1. Hero headline

**Структура (една от трите):**

### Pattern H1 — Outcome + timeframe
`{Resulting outcome} {in specific timeframe}`

Примери:
- "Ship your landing page in under 7 days."
- "Удвоете leads от сайта си до 90 дни."

### Pattern H2 — For {audience}, we {do what}
`{Offer} for {specific audience} who {pain}`

Примери:
- "Bookkeeping for EOOD owners who hate spreadsheets."
- "Counsel for founders raising their first round."

### Pattern H3 — Contrarian / category rejection
`{Rejected common approach}. {Our actual approach}.`

Примери:
- "Not another dashboard. A daily plan you'll actually follow."
- "Без boilerplate. Без шаблонни фрази. Истински дизайн за бизнеса ви."

**Правила:**
- Max 10 думи на английски, max 8 на български.
- Нито една празна дума (`solutions`, `services`, `excellence`, `quality`).
- Включва noun-verb action или concrete outcome.

---

## 2. Subheadline

**Структура:**
`{What it is} + {for whom} + {why it's different or proof signal}`

Max 25 думи. Един ред на desktop, max 2 на mobile.

Примери:
- "We ship high-quality landing pages in under a week using a systematic factory approach. 30+ clients served."
- "Дигитален счетоводител за собственици на ЕООД, които искат ясни отчети вместо Excel таблици."

**Правила:**
- Прекарай subheadline-а през "So what?" тест. Ако отговорът е слаб — пренапиши.
- Избягвай "We are a team of..." — това е about us, не promise.

---

## 3. Benefit bullets (Features секция)

**Структура на бenefit (не feature):**
`{Specific user outcome} {because of concrete mechanism}`

НЕ: "Cloud-based platform"
ДА: "Достъп от всяко устройство — никога не губите данни, защото са в cloud-а."

**Правила:**
- 3–5 items. Повече = загуба на focus.
- Паралелна структура — всички започват с глагол или всички с noun phrase, не смесено.
- Max 2 изречения на item.
- Всеки item има concrete noun (не "easier", а "from 3 hours to 15 minutes").

**Template:**
```
### {Outcome headline — 4–6 думи}
{One sentence showing the mechanism. Optional second sentence with proof.}
```

---

## 4. Objection handling (FAQ)

**Правила:**
- Поне 5 въпроса. Покрий топ objections от BRIEF → audience pain points.
- Формулирай въпроса **с думите на клиента**, не с marketing думи.
- Отговорът е ≤3 изречения. Ако трябва повече — създай отделна страница и link-ни.

**Задължителни FAQ категории:**
1. **Цена:** "Колко струва?" / "Is there a free tier?"
2. **Time-to-value:** "Колко време отнема?" / "When will I see results?"
3. **Fit:** "Подходящо ли е за моята индустрия / размер?"
4. **Switching cost:** "А ако вече ползвам X?"
5. **Escape:** "Мога ли да спра?" / "What if it doesn't work?"

---

## 5. CTA copy variants

**Главна препоръка:** Първо-лице глагол + specific action. Избягвай "Learn more", "Submit", "Click here".

| Архетип | Primary CTA                  | Secondary CTA              |
| ------- | ---------------------------- | -------------------------- |
| A1 lead-gen | "Book a 20-min call"     | "See how it works"         |
| A2 service  | "Request a quote"        | "Talk to a specialist"     |
| A3 brochure | "Contact us"             | "See our work"             |
| A4 case     | "Get similar results"    | "Read the full case study" |
| A5 event    | "Reserve your seat"      | "Add to calendar"          |
| A6 company  | "Call {phone}" / "Visit"  | —                          |

**На български:**
- "Резервирай среща" (не "Научи повече")
- "Изпрати запитване" (не "Изпрати")
- "Говори със специалист" (не "Контакт")
- "Запазете място" (не "Регистрирай")

**Правила:**
- CTA copy е **идентичен** навсякъде (hero, mid-page, footer). Повторението е усилване.
- Max 3 думи на български, max 4 на английски.

---

## 6. Meta tags — title + description

### Title pattern

`{Primary keyword / offer} | {Brand}`

- Max 60 символа.
- Brand винаги накрая (освен home page, където може да е първо).
- Нито една от думите `Welcome to`, `Home`, `Начало`.

Пример:
- "Bookkeeping for Bulgarian EOODs | Счетовод.бг"
- "Ski trip planning in 5 minutes | Planit"

### Description pattern

`{What it is}. {For whom}. {CTA или trust signal}.`

- 140–160 символа.
- Включва primary keyword веднъж.
- Завършва с CTA или concrete signal ("30+ clients", "Free 7-day trial").

Пример:
- "Systematic landing page production for B2B startups. From brief to live URL in under 7 days. 30+ clients served. Book a consultation."

### Per-page title/description

Всяка page има свой title+description в `export const metadata` в `page.tsx`:

```ts
export const metadata = {
  title: "Services — {Brand}",
  description: "...",
  openGraph: { title: "...", description: "...", images: ["/og/services.png"] },
};
```

Виж PLAN#claude-md-template за SEO правилата.

---

## 7. Local SEO (за small business / local services)

**Задължителни елементи:**

1. **LocalBusiness JSON-LD** в `layout.tsx`:
```ts
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "...",
  "address": {"@type": "PostalAddress", "streetAddress": "...", "addressLocality": "София", "addressCountry": "BG"},
  "telephone": "+359...",
  "openingHoursSpecification": [...],
  "geo": {"@type": "GeoCoordinates", "latitude": "...", "longitude": "..."}
}
```

2. **NAP consistency** — Name, Address, Phone **идентични** на:
   - сайта (footer + /contact)
   - Google Business Profile
   - Facebook Page
   - Apple Business Connect

3. **/contact page** винаги включва:
   - Embedded map (Google Maps iframe или Mapbox)
   - Full address
   - Clickable tel: link
   - Opening hours (структуриран markup)

4. **City/region keywords** — включи в title/h1 на home + /contact:
   - "Счетоводни услуги в София" (не само "Счетоводни услуги")

5. **Google Business Profile** setup е **owner task**, не part от template-а. Документирай в post-launch handoff (виж delivery.md).

---

## 8. Writing anti-patterns (забранени)

- **Празни думи:** `solutions`, `services`, `leverage`, `cutting-edge`, `excellence`, `quality`, `решения`, `иновативни`.
- **"We are" hero:** hero-ът не е за нас, за клиента е. "We are a team of..." → delete.
- **Feature lists вместо benefits:** "100GB storage" → "Keep 10 years of work without worrying about space."
- **Вътрешен jargon:** ако BRIEF audience не използва думата, не я използвай и ти.
- **"Contact us today":** дай concrete CTA destination.
- **Всичко е ИЗКЛЮЧИТЕЛНО!!!**: exclamation marks само в P4 Bold variation, и то умерено.

---

## Claude Code workflow

Когато Claude пише copy за секция:

1. Прочети BRIEF.md — audience, offer, tone.
2. Прочети variation preset — tone descriptor.
3. Избери pattern от този документ (H1/H2/H3 за hero, etc.).
4. Напиши 2–3 варианта на секция.
5. Подай за review на brief owner-а. Не commit-вай copy без approval.

Copy review = задължителна стъпка преди merge в `main`.

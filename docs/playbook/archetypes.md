> **Read-only snapshot** of `studio-factory/playbook/archetypes.md` (authoritative source). Snapshot taken: 2026-04-21.

# Page Archetypes

> 6 page shapes. Всеки проект започва с избор на **един** archetype. Archetype-ът определя section order, required inputs и conversion goal. Не смесвай archetypes в една страница.

Всички секции се реализират с компоненти от `@fourplusweb/ui`. Ако archetype иска секция, която липсва — създава се в `studio-packages` като patch/minor release, не в клиентското репо.

---

## A1 — Lead-gen landing page

**Кога:** един-единствен offer, една conversion цел (form submit / book demo / download).

**Conversion goal:** form submission или CTA click.

**Required inputs (BRIEF.md):** offer, main CTA, trust proof (≥3), audience, objections (≥3).

**Section order:**
1. `Hero` — headline + subheadline + primary CTA above the fold
2. `Features` (3–4 benefits, subgrid за aligned) — "why this offer"
3. `Testimonials` или `LogoCloud` — trust proof
4. `FAQ` — objection handling
5. `CTA` — second CTA block (repeat the ask)
6. `ContactForm` или `BookingEmbed` — conversion endpoint
7. `Footer` (minimal — no nav распределение)

**Конвенции:**
- Без Navigation (или само logo + phone). Минимум външни изходи.
- Максимум 7 секции. Повече = загуба на focus.
- Single CTA — един и същ action copy навсякъде.

---

## A2 — Service landing page

**Кога:** една услуга от по-голямо портфолио (напр. "Счетоводно обслужване за ЕООД").

**Conversion goal:** contact form + phone call.

**Required inputs:** service description, process steps, pricing signal (от/до), team proof, FAQ.

**Section order:**
1. `Hero` — specific service headline + CTA
2. `Features` — какво включва услугата (3–6 items)
3. `ProcessSteps` — how it works (3–5 стъпки)
4. `Pricing` или `PricingSignal` (starting from / от...)
5. `Team` (subgrid) — кой я изпълнява
6. `Testimonials` — proof specific to this service
7. `FAQ`
8. `CTA` + `ContactForm`
9. Standard `Header`/`Footer` (има nav към други услуги)

**Конвенции:**
- Има full nav — service page е част от по-голям сайт.
- Pricing секцията не е задължително с реални цени; "starting from" или "custom quote" е валидно.

---

## A3 — Small brochure site

**Кога:** company с 4–7 страници, без блог, без e-commerce.

**Conversion goal:** awareness + contact. Soft CTA (email/phone).

**Required inputs:** company story, 2–6 услуги/продукта, team, contact.

**Pages и section order:**
- **/** (home): `Hero` → `ValueProps` (3) → `ServicesGrid` → `Testimonials` → `CTA` → `Footer`
- **/about**: `Hero` (text-only) → `Story` → `Team` (subgrid) → `Values` → `CTA`
- **/services**: `Hero` → `ServicesGrid` (linking към /services/[slug] ако има детайли)
- **/contact**: `Hero` (short) → `ContactForm` + `Map` + contact details

**Конвенции:**
- Max 7 pages. Повече = brochure site-ът се превръща в content site — различен archetype.
- Без блог в template-а. Ако клиентът иска новини — MDX (виж PLAN#cms-strategy).

---

## A4 — Case study / proof-driven page

**Кога:** conversion чрез **dep**th of proof, не чрез hype. B2B, enterprise, high-ticket services.

**Conversion goal:** qualified inbound (form submit от warm lead).

**Required inputs:** client name, problem statement, approach, measurable outcome (числа, преди/след), quotes, team.

**Section order:**
1. `Hero` — client name + one-line outcome ("Increased X by Y% for Z")
2. `ContextBlock` — who is the client, industry
3. `ProblemStatement` — какво не работеше
4. `ApproachBlock` — какво направихме (2–4 phases)
5. `ResultsBlock` — числа, графики, metric cards
6. `PullQuote` — client testimonial, large typography
7. `ArtifactsGallery` — screenshots, deliverables (optional)
8. `RelatedCases` — 2–3 други case studies
9. `CTA` — "Want this for your company?"

**Конвенции:**
- Числата са задължителни в results. Без числа — не е case study, а article.
- Editorial variation (виж variations.md) е default за този archetype.

---

## A5 — Event / campaign page

**Кога:** limited-time event (конференция, launch, early-access).

**Conversion goal:** registration / signup. Time-bound.

**Required inputs:** event date+time, venue/URL, speakers или featured items, registration endpoint, countdown target.

**Section order:**
1. `Hero` — event name + date + primary CTA
2. `CountdownBlock` — time-to-event
3. `Agenda` или `Schedule`
4. `Speakers` или `Lineup` (subgrid)
5. `VenueBlock` (map + details) или `DigitalAccessBlock`
6. `Sponsors` или `PartnersStrip` (optional)
7. `FAQ`
8. `CTA` + registration form

**Конвенции:**
- High-energy variation (виж variations.md) е default.
- След event датата — страницата се switch-ва в "recap mode" (video, photos, thank-you). Това трябва да е предвидено от ден 1 в copy.

---

## A6 — Content-light company site

**Кога:** established business със стабилен reputation, минимална нужда от selling, фокус върху clarity и professionalism.

**Conversion goal:** lookup-style visits (contact info, hours, what do they do).

**Required inputs:** company name, 1–3 value props, contact, hours, location.

**Pages и section order:**
- **/** (home): `Hero` (calm) → `WhatWeDo` (1-sentence each, 3 max) → `CTA` → `ContactStrip`
- **/contact**: `ContactBlock` full — phone, email, address, hours, map

**Конвенции:**
- Minimal variation (виж variations.md) е default.
- Без testimonials, без pricing. Сайтът е digital storefront, не sales funnel.
- Max 3 pages.

---

## Избор на archetype — cheat sheet

| Сценарий                                          | Archetype |
| ------------------------------------------------- | --------- |
| "Want 50 leads/month for our SaaS demo"           | A1        |
| "Dedicated page за една услуга в по-голямо меню"  | A2        |
| "Company сайт с 5 страници, без blog"             | A3        |
| "B2B enterprise portfolio, искаме proof-first"    | A4        |
| "Conference на 2026-06-12, трябва registration"   | A5        |
| "Law firm, искаме просто да изглеждаме reputable" | A6        |

Ако не можеш да избереш един — стопирай и попитай brief owner-а. Не смесвай.

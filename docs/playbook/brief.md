> **Read-only snapshot** of `studio-factory/playbook/brief.md` (authoritative source). Snapshot taken: 2026-04-19.

# Client Brief Workflow

> `BRIEF.md` е mandatory input за всеки клиентски проект. Без попълнен brief, Claude Code **не започва** page работа. Целта: Claude работи от ясен контекст, не гадае.

---

## Workflow

1. В `client-template` има `BRIEF.md` в корена — празен template с TODO маркери.
2. Pavel или project lead попълва BRIEF.md с клиента на kickoff call (30–45 мин).
3. Попълненият BRIEF.md се committa в клиентското репо **преди** първи page commit.
4. `CLAUDE.md` в client-template изрично reference-ва BRIEF.md като required reading.
5. Ако Claude Code види непопълнен BRIEF.md (TODO маркери) → спира и пита.

---

## BRIEF.md template

Тази секция копирай в `client-template/BRIEF.md` като starting state. Попълни всички полета преди да започнеш page работа.

```markdown
# BRIEF — {Client name}

**Дата на kickoff:** YYYY-MM-DD
**Project lead:** {име}
**Archetype:** A1 / A2 / A3 / A4 / A5 / A6   (виж playbook/archetypes.md)
**Variation:** P1 / P2 / P3 / P4 / P5 / P6   (виж playbook/variations.md)

---

## 1. Objective

_Една изречена цел. Какво измерим след 90 дни като success._

TODO: ...

## 2. Audience

_Кой е target user? Role, industry, ниво на decision authority, pain points._

- Primary: TODO
- Secondary: TODO

## 3. Offer

_Какво предлагаме? Product/service, pricing signal (ако е публичен), unique value._

TODO: ...

## 4. Main CTA

_Един-единствен action. Exact copy + destination._

- CTA copy: "TODO"
- CTA destination: URL или форма или телефон
- Secondary CTA (ако има): "TODO"

## 5. Trust proof

_Минимум 3 елемента. Логика: защо някой ще ни повярва._

- [ ] Testimonial (≥3 quotes, с име, роля, компания)
- [ ] Case studies / метрики
- [ ] Client logos (≥5 ако е достъпно)
- [ ] Certifications / awards
- [ ] Team credentials

## 6. Competitors

_Топ 3. URL + една изречена positioning difference._

1. URL — differentiator: TODO
2. URL — differentiator: TODO
3. URL — differentiator: TODO

## 7. Tone and voice

_Избери от variations.md tone descriptor или custom._

- Tone: _(confident / conversational / urgent / etc.)_
- Person: _(we / they / I / brand-name)_
- Language level: _(plain / professional / technical / playful)_
- Bulgarian или English: _(primary locale)_

### 7a. Negative style descriptors

_Три думи които **НЕ** описват желания look. Claude Code третира ги като hard forbidden при copy и visual decisions._

- NOT: TODO, TODO, TODO

_Пример: "corporate, cold, boring" — значи че Claude избягва stock corporate imagery, stiff jargon, symmetric dull layouts._

## 8. Must-have sections

_Секции, които клиентът изрично иска. Check срещу archetype — ако не съвпадат, сигнализирай._

- [ ] TODO
- [ ] TODO

## 9. Forbidden claims or wording

_Legal/compliance constraints, думи които НЕ трябва да използваме._

- TODO: ...

## 10. Assets status

_Какво имаме на ръка, какво трябва да създадем._

- Logo: available / missing / needs redesign
- Brand colors: defined / needs extraction
- Photography: real / stock / mixed / missing
- Copy: provided / to be written / partially provided
- Videos: TODO

## 11. Launch target

_Soft launch date + hard launch date + any dependencies._

- Soft launch: YYYY-MM-DD
- Hard launch: YYYY-MM-DD
- Blockers: TODO

## 12. Post-launch ownership

_Кой поддържа сайта след launch? Какъв support plan?_

- Content updates: client / us / shared
- Monitoring: TODO
- Retainer: yes / no / TBD

## 13. Approvers

_Кой има final sign-off authority. Claude Code не merge-ва работа докато relevant approver не одобри._

- Copy approver: TODO (име + имейл)
- Design approver: TODO (име + имейл)
- Technical approver (ако различен): TODO
- Business approver (budget/scope): TODO

_Единствен approver е валиден, ако той покрива всички роли._
```

---

## Validation rules

Преди BRIEF.md да се счита за "complete":

- **Objective:** една изречена, measurable цел (съдържа число или binary outcome).
- **Main CTA:** exact copy + destination. Без destination brief не е complete.
- **Trust proof:** минимум 3 реални елемента. "TBD" не е proof.
- **Archetype + Variation:** избрани и записани. Ако brief owner не знае кой — консултирай се с playbook/archetypes.md и playbook/variations.md.
- **Forbidden claims:** празно е валидно, но секцията трябва да съществува (експлицитно "няма forbidden claims" > имплицитно).
- **Negative style descriptors:** три думи или explicit "none — any visual direction OK".
- **Approvers:** минимум copy + design approvers с имейл. Празно = blocker (Claude Code няма кой да валидира работа).

---

## Claude Code enforcement

В `client-template/CLAUDE.md` добавя се секция:

```markdown
## Brief gate

ПРЕДИ да пишеш page код:
1. Прочети BRIEF.md.
2. Ако BRIEF.md съдържа "TODO:" маркери — спри. Попитай brief owner-а.
3. Ако Archetype или Variation не са попълнени — спри. Питай.
4. Ако Main CTA няма destination — спри. Питай.
5. Ако Approvers §13 не са попълнени — спри. Питай.
6. Negative style descriptors (§7a) се третират като **hard forbidden** — никаква copy или visual promise не трябва да съдържа или да evocates тези descriptor-и.
7. Не изнасяй assumption-и за offer, audience или tone. Питай.

Никога не попълвай BRIEF.md сам. Това е клиентски input, не generated content.
```

---

## Kickoff call агенда (reference)

30–45 мин разговор с клиента, покриващ BRIEF-а secция по секция:

1. **(5 мин)** Objective — какво measure-вате. Откажете разтеглени "искаме да изглеждаме добре" — press-вайте за число.
2. **(10 мин)** Audience + Offer — кой и какво. Това определя archetype.
3. **(5 мин)** CTA — какво искате да направи посетителят. Един action.
4. **(10 мин)** Trust proof — какво имате на ръка, какво ще съберем.
5. **(5 мин)** Competitors — топ 3.
6. **(5 мин)** Tone + Forbidden — какво да не кажем.
7. **(5 мин)** Assets + Launch target — logistics.

След call-а: project lead допълва BRIEF.md, споделя с клиента за потвърждение, commit-ва.

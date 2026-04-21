# Playbook snapshots

This directory contains **5 of 11** playbook files from
`studio-factory/playbook/`, snapshotted for client forks that don't have
sibling access to the studio-factory repo.

## Included (client-facing)

- [`archetypes.md`](archetypes.md) — 6 page shapes (A1–A6); pick one per project
- [`variations.md`](variations.md) — 6 visual presets (P1–P6); token-only overrides
- [`brief.md`](brief.md) — `BRIEF.md` format, intake template
- [`copy-seo.md`](copy-seo.md) — copy patterns + SEO hygiene
- [`assets.md`](assets.md) — logo / image / favicon pipeline

## Not included (studio-internal)

The following live in `studio-factory/playbook/` of the main workspace
only; they don't ship to client forks:

- `delivery.md` — pre-launch checklist, post-launch loop
- `ecommerce-roadmap.md` — roadmap (not yet production-ready)
- `client-questionnaire.bg.md` / `.en.md` — intake forms
- `brief-intake-mapping.md` — intake → BRIEF translation rules
- `README.md` (factory-level) — orientation for studio staff

Studio staff have access to all 11 in `studio-factory/playbook/` of the
main workspace; this 5-file subset is what client-template forks carry.

## Sync

Snapshots can be refreshed from a sibling `studio-factory/` checkout:

```sh
pnpm playbook:sync
```

See root `scripts/sync-playbook.sh` (or repo-specific equivalent) for
details. The canonical source is always `studio-factory/playbook/` — never
edit files in this directory by hand; changes made here will be overwritten
on next sync.

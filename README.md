# Client Template

FourPlus WebStudio Next.js 16 starter. Fork this via GitHub
"Use this template" to kickstart a new client site.

## First 5 minutes

1. **Get package access.** Your studio manager adds you to the
   `FourPlusWeb` GitHub org with access to `@fourplusweb/*` private
   packages. If you're not a member, ask before continuing — steps 2-4
   will fail with 401. (Full access provisioning process: see
   `ACCESS.md` in the workspace repo; studio staff have a copy.)

2. **Generate a GitHub PAT** (classic, scope `read:packages`, no expiry
   recommended):
   https://github.com/settings/tokens → "Generate new token (classic)".

3. **Export the token locally:**
   ```bash
   export NODE_AUTH_TOKEN=ghp_your_token_here
   ```
   (Add to your shell rc or `.envrc` so it persists.)

4. **Install and run:**
   ```bash
   pnpm install
   pnpm verify:auth   # optional preflight — validates token + registry access
   pnpm dev           # http://localhost:3000
   ```

If `pnpm install` hits 401, run `pnpm verify:auth` — it isolates whether
the problem is the token, the scope, or org membership.

## Fork workflow for client sites

To create a new client site from this template:

1. On GitHub, navigate to this repository
2. Click **"Use this template"** → **"Create a new repository"**
3. Owner: select `FourPlusWeb` organization
4. Repository name: `client-{client-name}` (e.g., `client-acme-plumbing`)
5. **Check "Copy the `main` branch only"** (default) — do NOT include
   all branches
6. Create the repository
7. In the new repo settings, enable **"Template repository"** checkbox
   (so future forks can reuse the same setup)
8. Clone locally and proceed with customization per the Customization
   section above

The `/studio/brand` route works out of the box when forked — Next.js
statically defines all routes at build time.

## Customization

- **Brand, navigation, contacts** — [`site.config.ts`](site.config.ts)
- **Client brief (intake)** — [`BRIEF.md`](BRIEF.md) — fill this in
  before starting page work (see [`docs/playbook/brief.md`](docs/playbook/brief.md))
- **Replace placeholder blog posts** in [`content/blog/`](content/blog/)
  and their SVG placeholders in [`public/blog/`](public/blog/).
- **Tailwind theme** flows from `@fourplusweb/config` (node_modules);
  per-client overrides via `site.config.ts` → `themeToCSS()` in
  [`src/app/layout.tsx`](src/app/layout.tsx).

## Scripts

| Command              | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| `pnpm dev`           | Local server on :3000 (Turbopack, ~650ms ready) |
| `pnpm build`         | Production build                                |
| `pnpm typecheck`     | TypeScript strict check                         |
| `pnpm lint`          | ESLint (ignores `.next/`, `.claude/`, generated) |
| `pnpm verify:auth`   | GitHub Packages auth preflight — run on 401    |
| `pnpm playbook:sync` | Refresh `docs/playbook/` snapshots from studio-factory sibling |

Use `pnpm dev` directly; Claude Code `preview_start` requires a local
`.claude/launch.json` (not committed — bring your own).

## Deployment

**Committed default: Netlify** (`netlify.toml` in root).
Connect the repo at https://app.netlify.com/start and set
`NODE_AUTH_TOKEN` in Site Settings → Environment variables.

**Alternatives** (opt-in recipes) — Vercel, Cloudflare Workers,
self-host Docker — see [`DEPLOY.md`](DEPLOY.md).

### CI

`.github/workflows/ci.yml` runs typecheck + lint + build on every PR and
push to `main`. Requires a `PACKAGES_READ_TOKEN` repository secret
(classic PAT, `read:packages`):

1. Generate token: https://github.com/settings/tokens → "Generate new
   token (classic)" → check only `read:packages`.
2. Repository → Settings → Secrets and variables → Actions → New
   repository secret → name `PACKAGES_READ_TOKEN`, paste token.

The built-in `GITHUB_TOKEN` cannot read packages from a different repo's
registry, which is why an explicit PAT is required.

## Further reading

- [`CLAUDE.md`](CLAUDE.md) — guidance for AI coding agents (Claude Code,
  etc.) working in this repo
- [`DEPLOY.md`](DEPLOY.md) — deploy recipes and troubleshooting
- [`BRIEF.md`](BRIEF.md) — client brief template
- [`docs/playbook/`](docs/playbook/) — read-only snapshots of the studio
  playbook: archetypes, variations, brief, copy/SEO, assets. Refresh with
  `pnpm playbook:sync` when studio-factory is a sibling checkout.
- Access provisioning / token lifecycle / offboarding → `ACCESS.md` in
  the studio workspace repo.

## Stack

Next.js 16 (Turbopack) · React 19 · Tailwind v4 (CSS-first `@theme`) ·
TypeScript strict · MDX blog · `@fourplusweb/ui` design system.

Node 22+, pnpm 10+.

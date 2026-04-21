# Deployment

Шаблонът е **vanilla Next.js 16** — deploy-ва се на всеки host, който поддържа
Next.js, без промяна на source code. По-долу са 4 тествани варианта, подредени
по сложност (най-лесен → най-контролиращ).

## Предпоставки (общи за всички hosts)

1. Клиентският repo е форк на `FourPlusWeb/client-template`.
2. **GitHub Personal Access Token (classic)** със scope `read:packages` — нужен
   за install-ване на `@fourplusweb/*` private пакетите от GitHub Packages.
   Генерирай на https://github.com/settings/tokens.
3. Env var `NODE_AUTH_TOKEN` = token-ът, зададен на host-а (виж всеки раздел).

---

## 1) Netlify (committed default — recommended)

**`netlify.toml` is committed at the repo root.** Netlify auto-detects it
on first deploy; build command, publish directory, and plugin are already
configured. You only need to connect the repo and set `NODE_AUTH_TOKEN`.

**Защо:** Zero config. Официален Next.js runtime plugin — auto-detected. Free
tier: 100 GB bandwidth/месец, unlimited builds, custom domain + SSL. Работи с
org repos (private или public) без ограничения.

**Steps:**

1. https://app.netlify.com/start → Import from GitHub → избери repo-то.
2. Build settings се четат от `netlify.toml` (не пипай override-ите).
3. **Environment variables:** `NODE_AUTH_TOKEN` = classic PAT (Site Settings
   → Environment variables → Deploy contexts: All).
4. Deploy → получаваш `*.netlify.app` URL след 2-4 минути.

**Custom domain:** Settings → Domain management → Add domain → следваш
DNS инструкциите.

---

> **Opt-in recipes below.** The committed `netlify.toml` covers the default
> case. The following are reference recipes — not kept sync'd to the template
> baseline. Expect to adapt.

## 2) Vercel (native home на Next.js)

**Защо:** Vercel са създали Next.js, zero config, най-бърз preview cycle.
Hobby tier безплатен за public repos.

**Steps:**

1. https://vercel.com/new → Import → избери repo-то.
2. Framework: **Next.js** (auto-detected).
3. **Environment variables:** `NODE_AUTH_TOKEN` = classic PAT.
4. Deploy → получаваш `*.vercel.app` URL.

**Забележка:** Vercel Hobby не поддържа колаборация за **private org repos**.
За private org repo → или upgrade Pro, или ползвай Netlify.

---

## 3) Cloudflare Pages / Workers (за cost-sensitive клиенти)

**Защо:** Много евтино на scale (unlimited requests on Pages), CDN на 300+ PoPs,
бърз TTFB глобално.

**Сложност:** Cloudflare Pages изисква адаптер за Next.js (тъй като не е Node
runtime). Клиентът инсталира `@opennextjs/cloudflare` — официалният OpenNext
адаптер, поддържан от Vercel инженери.

**Steps:**

1. В client repo-то:
   ```bash
   pnpm add -D @opennextjs/cloudflare wrangler
   ```

2. Създай `wrangler.jsonc` в корена:
   ```jsonc
   {
     "name": "client-template",
     "main": ".open-next/worker.js",
     "compatibility_date": "2024-09-23",
     "compatibility_flags": ["nodejs_compat"],
     "assets": {
       "binding": "ASSETS",
       "directory": ".open-next/assets"
     }
   }
   ```

3. Добави скриптове в `package.json`:
   ```json
   "scripts": {
     "build:cf": "opennextjs-cloudflare build",
     "deploy:cf": "opennextjs-cloudflare deploy"
   }
   ```

4. Cloudflare dashboard → Workers & Pages → Create → Connect to Git.
5. Build command: `pnpm build:cf`
6. Build output: `.open-next`
7. **Environment variables:** `NODE_AUTH_TOKEN` + `NODE_VERSION=22`.

Детайли: https://opennext.js.org/cloudflare

---

## 4) Self-host (VPS / Docker)

**Защо:** Пълен контрол, no vendor lock-in, подходящо за клиенти с existing
инфраструктура. **Committed fallback path** — `Dockerfile` + `.dockerignore`
се версионират в template-а и CI ги verify-ва при всеки push.

**`output: "standalone"` е вече enabled** в `next.config.ts`. `Dockerfile`
е committed в корена. Директно:

```bash
# NODE_AUTH_TOKEN already exported в shell-а per README "First 5 minutes"
docker build --secret id=node_auth_token,env=NODE_AUTH_TOKEN -t client-site .
docker run -p 3000:3000 client-site
```

За production обикновено слагаш reverse proxy (Caddy/Nginx/Traefik) отпред
за SSL termination.

**Security note:** `Dockerfile` ползва **BuildKit secret mount**, не
`--build-arg`. PAT-ът се expose-ва като env var само за времето на
`pnpm install` и никога не влиза в image layer / history / cache
metadata. Изисква Docker 25+ (BuildKit default) или `docker buildx`.
Ако build-неш с `DOCKER_BUILDKIT=0` — fail-ва умишлено; legacy builder
няма secret mount support.

**CI coverage:** `.github/workflows/ci.yml` → `docker-smoke` job builds
the image на всеки push + PR (not pushed to a registry — this is a
tested-fallback guard). Ако Dockerfile-а се чупи някога, CI ще блокне
merge. Това е разликата между "документирана fallback" (prose) и
"tested fallback" (artifact + CI guard).

---

## Troubleshooting

### 401 при install на `@fourplusweb/*`

Single source of truth: [`ACCESS.md`](../ACCESS.md) в workspace root (или
studio's canonical access doc). DEPLOY.md не дублира detailed troubleshooting
— auth драйф между docs причини миналия одит (GITHUB_TOKEN vs PACKAGES_READ_TOKEN
vs NODE_AUTH_TOKEN). Един източник, едно име.

Short version: нужен е **classic** GitHub PAT (започва с `ghp_`, не fine-grained)
със scope `read:packages`, exposed на build environment-а като:

- **Host build env (Netlify/Vercel/Cloudflare/self-host):** `NODE_AUTH_TOKEN`
- **GitHub Actions на client repo-то:** repository secret `PACKAGES_READ_TOKEN`
  (името е каквото `ci.yml` референцира — built-in `GITHUB_TOKEN` не може
  да чете packages от друг repo-registry, виж `ACCESS.md` за пълното
  обяснение).

Първа диагностична стъпка при 401 — `pnpm verify:auth` локално. Той
разграничава token / scope / org-membership проблеми.

### Build fail с "Cannot find module"

- Провери че `pnpm.overrides` в `package.json` е **празен или липсва** (това
  ще сочи към local paths, които не съществуват на build host-а)

### 404 на production URL

- Хост не поддържа Next.js runtime по default (напр. Cloudflare Pages без
  адаптер). Прегледай съответния раздел по-горе.

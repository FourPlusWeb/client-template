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

## 1) Netlify (препоръчано за повечето клиенти)

**Защо:** Zero config. Официален Next.js runtime plugin — auto-detected. Free
tier: 100 GB bandwidth/месец, unlimited builds, custom domain + SSL. Работи с
org repos (private или public) без ограничения.

**Steps:**

1. https://app.netlify.com/start → Import from GitHub → избери repo-то.
2. Build settings (обикновено auto-detected):
   - Build command: `pnpm build`
   - Publish directory: `.next`
3. **Environment variables:** `NODE_AUTH_TOKEN` = classic PAT.
4. Deploy → получаваш `*.netlify.app` URL след 2-4 минути.

**Custom domain:** Settings → Domain management → Add domain → следваш
DNS инструкциите.

---

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
инфраструктура.

**Steps:**

1. Добави `output: "standalone"` в `next.config.ts`:
   ```ts
   const config: NextConfig = {
     // … existing config …
     output: "standalone",
   };
   ```

2. Добави `Dockerfile`:
   ```dockerfile
   FROM node:22-alpine AS base
   WORKDIR /app
   COPY package.json pnpm-lock.yaml .npmrc ./
   RUN corepack enable && pnpm install --frozen-lockfile
   COPY . .
   ARG NODE_AUTH_TOKEN
   ENV NODE_AUTH_TOKEN=$NODE_AUTH_TOKEN
   RUN pnpm build

   FROM node:22-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=base /app/.next/standalone ./
   COPY --from=base /app/.next/static ./.next/static
   COPY --from=base /app/public ./public
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

3. Build: `docker build --build-arg NODE_AUTH_TOKEN=ghp_xxx -t client-site .`
4. Run: `docker run -p 3000:3000 client-site`

За production обикновено слагаш reverse proxy (Caddy/Nginx/Traefik) отпред за
SSL termination.

---

## Troubleshooting

### 401 при install на `@fourplusweb/*`

- Потвърди че `NODE_AUTH_TOKEN` е set-нат на host-а
- Потвърди че token-ът е **classic PAT** (започва с `ghp_`), НЕ fine-grained
- Потвърди scope `read:packages`
- Потвърди че GitHub акаунтът, генерирал token-а, е **member на `FourPlusWeb` org**

### Build fail с "Cannot find module"

- Провери че `pnpm.overrides` в `package.json` е **празен или липсва** (това
  ще сочи към local paths, които не съществуват на build host-а)

### 404 на production URL

- Хост не поддържа Next.js runtime по default (напр. Cloudflare Pages без
  адаптер). Прегледай съответния раздел по-горе.

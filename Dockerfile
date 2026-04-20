# Committed as the tested fallback deploy path. Default is Netlify
# (netlify.toml committed at root). Use this Dockerfile when self-hosting,
# when a build host needs proof that the template builds in an isolated
# environment, or when testing CI artifacts.
#
# Build: docker build --build-arg NODE_AUTH_TOKEN=ghp_xxx -t client-site .
# Run:   docker run -p 3000:3000 client-site

# ---------- Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack — matches packageManager field in package.json.
RUN corepack enable

# Copy manifests first for layer-cache friendliness.
COPY package.json pnpm-lock.yaml .npmrc ./

# Auth for @fourplusweb/* GitHub Packages registry. Build arg because
# runtime containers should never hold a read-only PAT.
ARG NODE_AUTH_TOKEN
ENV NODE_AUTH_TOKEN=${NODE_AUTH_TOKEN}

RUN pnpm install --frozen-lockfile

# Now copy source and build. Next 16 with output:"standalone" produces
# a self-contained .next/standalone/ tree.
COPY . .
RUN pnpm build

# ---------- Runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Standalone output includes a minimal server.js and all required
# node_modules. No pnpm or build tooling in the runtime image.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# standalone emits server.js; node runs it directly.
CMD ["node", "server.js"]

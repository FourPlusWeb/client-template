# syntax=docker/dockerfile:1.7

# Committed as the tested fallback deploy path. Default is Netlify
# (netlify.toml committed at root). Use this Dockerfile when self-hosting,
# when a build host needs proof that the template builds in an isolated
# environment, or when testing CI artifacts.
#
# Local build (assumes NODE_AUTH_TOKEN is already exported per README):
#   docker build --secret id=node_auth_token,env=NODE_AUTH_TOKEN -t client-site .
# Run:
#   docker run -p 3000:3000 client-site
#
# Security note: uses BuildKit's --mount=type=secret so the PAT is only
# present for the duration of `pnpm install`. Never becomes an ARG, ENV,
# or image layer; not cached in GHA / buildx cache metadata. The `syntax`
# directive above enables the secret mount on any BuildKit-compatible
# Docker (25+; GitHub Actions runners; docker/setup-buildx-action@v3).

# ---------- Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack — matches packageManager field in package.json.
RUN corepack enable

# Copy manifests first for layer-cache friendliness.
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies with the PAT mounted as a BuildKit secret. The
# secret content is exposed as env NODE_AUTH_TOKEN for this RUN only;
# pnpm reads it via ${NODE_AUTH_TOKEN} in .npmrc and never persists it.
RUN --mount=type=secret,id=node_auth_token,env=NODE_AUTH_TOKEN \
    pnpm install --frozen-lockfile

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

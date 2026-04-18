#!/usr/bin/env bash
set -eu
SCOPE="@fourplusweb"
REGISTRY="https://npm.pkg.github.com"
TEST_PKG="${SCOPE}/config"

fail() { echo "✗ $1" >&2; exit 1; }
ok()   { echo "✓ $1"; }

# 1. .npmrc present
[ -f .npmrc ] || fail ".npmrc липсва. Copy: cp .npmrc.example .npmrc"
ok ".npmrc присъства"

# 2. NODE_AUTH_TOKEN is set and not empty
if [ -z "${NODE_AUTH_TOKEN:-}" ]; then
  fail "NODE_AUTH_TOKEN не е set. Export token и опитай пак."
fi
TOKEN_LEN=${#NODE_AUTH_TOKEN}
[ "$TOKEN_LEN" -ge 20 ] || fail "NODE_AUTH_TOKEN изглежда невалиден (${TOKEN_LEN} chars)"
ok "NODE_AUTH_TOKEN set (${TOKEN_LEN} chars)"

# 3. Token valid for GitHub API
GH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${NODE_AUTH_TOKEN}" \
  https://api.github.com/user)
[ "$GH_STATUS" = "200" ] || fail "GitHub API auth fail (HTTP ${GH_STATUS}). Token expired или невалиден."
ok "Token валиден за GitHub API"

# 4. Token has read:packages scope (non-fatal — fine-grained PATs do not emit x-oauth-scopes)
SCOPES=$(curl -sI -H "Authorization: Bearer ${NODE_AUTH_TOKEN}" \
  https://api.github.com/user | grep -i "^x-oauth-scopes:" || true)
if [ -z "${SCOPES}" ]; then
  echo "⚠ scope header missing (fine-grained PAT compat) — relying on step 5 for authoritative check"
elif echo "${SCOPES}" | grep -qi "read:packages\|packages"; then
  ok "Token има packages scope"
else
  echo "⚠ x-oauth-scopes present but без read:packages (${SCOPES}) — relying on step 5 for authoritative check"
fi

# 5. Package actually resolvable
PKG_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${NODE_AUTH_TOKEN}" \
  "${REGISTRY}/${TEST_PKG}")
case "$PKG_STATUS" in
  200) ok "Package ${TEST_PKG} resolvable от registry";;
  401) fail "Registry 401. Token няма достъп до FourPlusWeb org packages. (SSO authorize?)";;
  404) fail "Package ${TEST_PKG} не е намерен. Публикуван ли е в Phase 06?";;
  *)   fail "Registry върна неочакван HTTP ${PKG_STATUS}";;
esac

echo ""
echo "Auth preflight passed. Safe to run: pnpm install"

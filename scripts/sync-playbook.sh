#!/usr/bin/env bash
# Re-sync playbook snapshots from the factory repo.
# Usage: assume studio-factory/ is a sibling of client-template/.
# Run from client-template root: bash scripts/sync-playbook.sh  (or pnpm playbook:sync)
set -euo pipefail

FACTORY_PLAYBOOK="../studio-factory/playbook"
DEST="docs/playbook"

if [[ ! -d "$FACTORY_PLAYBOOK" ]]; then
  echo "Factory playbook not found at $FACTORY_PLAYBOOK"
  echo "Run from client-template root with studio-factory as sibling."
  exit 1
fi

mkdir -p "$DEST"

DATE=$(date +%Y-%m-%d)

for f in archetypes variations brief copy-seo assets; do
  SRC="$FACTORY_PLAYBOOK/$f.md"
  OUT="$DEST/$f.md"

  if [[ ! -f "$SRC" ]]; then
    echo "WARN: missing source $SRC — skipping"
    continue
  fi

  {
    printf '> **Read-only snapshot** of `studio-factory/playbook/%s.md` (authoritative source). Snapshot taken: %s.\n\n' "$f" "$DATE"
    cat "$SRC"
  } > "$OUT"

  echo "synced $f.md"
done

echo "Synced playbook files to $DEST/"

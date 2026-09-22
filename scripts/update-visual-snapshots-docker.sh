#!/usr/bin/env bash
# Generate Playwright visual baselines on Linux (matches GitHub Actions).
# Usage: from repo root: ./scripts/update-visual-snapshots-docker.sh
#
# The image tag must track @playwright/test in package.json, and the Ubuntu
# release must track `runs-on: ubuntu-latest` in update-snapshots.yml, which is
# Noble. A mismatch on either produces baselines that differ from CI's by a few
# antialiased pixels, which is exactly the failure this script exists to avoid.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="mcr.microsoft.com/playwright:v1.63.0-noble"
PNPM_VERSION="$(node -p "require('$ROOT/package.json').packageManager.split('@')[1]")"
SNAPSHOT_DIR="e2e/visual/visual-regression.spec.ts-snapshots"

# The repo is mounted read-only at /src and copied to /work, rather than being
# worked in directly. Three reasons, each of which broke a previous run:
#   - scripts/qa-preflight.mjs refuses to start when a .env file is present, and
#     the alternative (PLAYWRIGHT_LOAD_ENV=1) would hand real service keys to a
#     browser test.
#   - a Linux `pnpm install` over the mounted node_modules leaves native modules
#     built for the wrong platform, breaking the next local `pnpm test`.
#   - .next likewise comes back as a Linux build.
# Only the regenerated PNGs are copied back.
# Chromium crashes the tab ("Navigation failed because page crashed") on
# Docker's default 64MB /dev/shm. Playwright documents this as a required flag.
docker run --rm \
  --shm-size=1g \
  -v "$ROOT:/src:ro" \
  -v "$ROOT/$SNAPSHOT_DIR:/out" \
  -e CI=true \
  -e PLAYWRIGHT_PORT=3100 \
  "$IMAGE" \
  bash -lc "
    set -euo pipefail
    mkdir -p /work
    tar -C /src -cf - \
      --exclude=./node_modules --exclude=./.next \
      --exclude='./.env' --exclude='./.env.*' \
      . | tar -C /work -xf -
    cd /work
    corepack enable
    corepack prepare pnpm@${PNPM_VERSION} --activate
    pnpm install --frozen-lockfile
    pnpm build
    # No BASE_URL: playwright.config.ts only starts its own \`next start\` when
    # BASE_URL is unset. Setting it left nothing serving port 3100.
    pnpm exec playwright test --project=visual --update-snapshots
    cp -f /work/$SNAPSHOT_DIR/*-linux.png /out/
  "
echo
echo 'Linux baselines refreshed. Review with: git status --short '"$SNAPSHOT_DIR"

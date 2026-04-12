#!/usr/bin/env bash
# Generate Playwright visual baselines on Linux (matches GitHub Actions).
# Usage: from repo root: ./scripts/update-visual-snapshots-docker.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="mcr.microsoft.com/playwright:v1.58.2-jammy"
docker run --rm \
  -v "$ROOT:/work" \
  -w /work \
  "$IMAGE" \
  bash -lc '
    set -euo pipefail
    export CI=true
    corepack enable
    corepack prepare pnpm@10.26.2 --activate
    pnpm install --frozen-lockfile
    pnpm build
    export CI=true PLAYWRIGHT_PORT=3100 BASE_URL=http://127.0.0.1:3100
    pnpm exec playwright test --project=visual --update-snapshots
  '

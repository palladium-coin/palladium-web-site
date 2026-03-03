#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

node scripts/generate-config.js
bash scripts/sync-pool-data.sh --once

bash scripts/sync-pool-data.sh --watch --interval 30 &
SYNC_PID=$!

cleanup() {
  if kill -0 "$SYNC_PID" >/dev/null 2>&1; then
    kill "$SYNC_PID" >/dev/null 2>&1 || true
    wait "$SYNC_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

live-server public --port=3000 --ignore=pool-data,pool-data/**

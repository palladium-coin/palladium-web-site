#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

node scripts/generate-config.js

# Read POOL_LOG_DIR from .env to decide whether to enable pool log sync
POOL_LOG_DIR_VAL="$(awk -F'=' '/^POOL_LOG_DIR=/{print substr($0,index($0,"=")+1)}' .env | tail -1)"
POOL_LOG_DIR_VAL="${POOL_LOG_DIR_VAL%$'\r'}"

if [[ -n "$POOL_LOG_DIR_VAL" ]]; then
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
else
  echo "[dev] POOL_LOG_DIR not set — pool sync disabled"
fi

live-server public --port=3000 --ignore=pool-data,pool-data/**

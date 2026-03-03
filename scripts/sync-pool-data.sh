#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
DEST_DIR="$ROOT_DIR/public/pool-data"

MODE="once"
INTERVAL="30"

usage() {
  cat <<'USAGE'
Usage:
  scripts/sync-pool-data.sh --once
  scripts/sync-pool-data.sh --watch [--interval <seconds>]

Description:
  Copies ckpool logs from POOL_LOG_DIR (.env) into public/pool-data.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --once)
      MODE="once"
      shift
      ;;
    --watch)
      MODE="watch"
      shift
      ;;
    --interval)
      INTERVAL="${2:-}"
      if [[ -z "$INTERVAL" ]]; then
        echo "[sync-pool-data] missing value for --interval" >&2
        exit 1
      fi
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[sync-pool-data] unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ! "$INTERVAL" =~ ^[0-9]+$ ]] || [[ "$INTERVAL" -lt 1 ]]; then
  echo "[sync-pool-data] --interval must be a positive integer" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[sync-pool-data] .env not found at $ENV_FILE" >&2
  exit 1
fi

POOL_LOG_DIR="$(awk -F '=' '/^POOL_LOG_DIR=/{print substr($0, index($0, "=") + 1)}' "$ENV_FILE" | tail -n 1 || true)"
POOL_LOG_DIR="${POOL_LOG_DIR%$'\r'}"
POOL_LOG_DIR="${POOL_LOG_DIR%\"}"
POOL_LOG_DIR="${POOL_LOG_DIR#\"}"
POOL_LOG_DIR="${POOL_LOG_DIR%\'}"
POOL_LOG_DIR="${POOL_LOG_DIR#\'}"

if [[ -z "$POOL_LOG_DIR" ]]; then
  echo "[sync-pool-data] POOL_LOG_DIR is empty in $ENV_FILE" >&2
  exit 1
fi

if [[ ! -d "$POOL_LOG_DIR" ]]; then
  echo "[sync-pool-data] POOL_LOG_DIR does not exist: $POOL_LOG_DIR" >&2
  exit 1
fi

sync_once() {
  mkdir -p "$DEST_DIR"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete "$POOL_LOG_DIR/" "$DEST_DIR/"
  else
    rm -rf "$DEST_DIR"
    mkdir -p "$DEST_DIR"
    cp -a "$POOL_LOG_DIR"/. "$DEST_DIR"/
  fi
  date_iso="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "[sync-pool-data] synced at $date_iso into $DEST_DIR"
}

if [[ "$MODE" == "once" ]]; then
  sync_once
  exit 0
fi

while true; do
  sync_once
  sleep "$INTERVAL"
done

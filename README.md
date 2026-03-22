# Palladium Website

Static website for Palladium, a decentralized Proof of Work cryptocurrency.
Built with vanilla HTML, CSS, and JavaScript.

## Architecture

```
Browser
  │
  ├─ static files ──► Caddy (prod) / live-server (dev)
  │                        serving public/
  │
  └─ /api/* ──────────────► palladium-stack (Flask on port 8080)
                             API key injected by Caddy server-side
```

In **development**, `public/js/config.js` is generated from `.env` so the browser knows where to reach the API.
In **production**, Caddy serves the site and proxies `/api/*` — `API_BASE_URL` is not needed.

Pool data (`public/pool-data/`) is:
- **Dev**: synced from `POOL_LOG_DIR` every 30 seconds by a background script (optional)
- **Prod**: mounted read-only from `POOL_LOG_DIR` directly into the container

---

## Prerequisites

| | Dev | Prod |
|---|---|---|
| Node.js + npm | required | not needed |
| Docker + Docker Compose | not needed | required |
| palladium-stack running | for API calls | must be on `palladium-net` network |

---

## Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Value |
|---|---|
| `API_BASE_URL` | `http://localhost:8080` (palladium-stack running locally) |
| `API_KEY` | must match `API_KEY` in palladium-stack's `.env` |
| `POOL_LOG_DIR` | path to ckpool logs — leave **empty** to disable pool data |

### 3. Start the dev server

```bash
npm run dev
```

This will:
1. Generate `public/js/config.js` from `.env`
2. If `POOL_LOG_DIR` is set: sync pool logs to `public/pool-data/` once, then every 30s
3. Start [live-server](https://github.com/tapio/live-server) on **http://localhost:3000** with auto-reload

### 4. Pool data (optional)

To test pool dashboard pages with real data, point `POOL_LOG_DIR` to the ckpool log directory:

```bash
# in .env
POOL_LOG_DIR=/home/user/palladium-stack/logs
```

If `public/pool-data/` is corrupted or contains recursive junk, clean it first:

```bash
rm -rf public/pool-data
```

### 5. Project structure

```
palladium-web-site/
├── public/                  # Static site root (served as-is)
│   ├── css/                 # Stylesheets
│   ├── js/
│   │   ├── config.js        # Generated at runtime — do not edit manually
│   │   └── ...
│   ├── pool-data/           # Pool log data (synced in dev, mounted in prod)
│   ├── index.html
│   └── ...
├── scripts/
│   ├── dev.sh               # Dev server orchestration
│   ├── sync-pool-data.sh    # Pool log sync (dev only)
│   └── generate-config.js   # Generates public/js/config.js from .env
├── .env                     # Local config — not in git
├── .env.example             # Template
├── Caddyfile                # Production web server config
├── docker-compose.yml       # Production container orchestration
└── package.json
```

### Available npm scripts

| Script | Description |
|---|---|
| `npm run dev` | Start full dev environment (config gen + pool sync + live-server) |
| `npm run generate-config` | Regenerate `public/js/config.js` from `.env` |
| `npm run sync-pool-data` | Sync pool logs once |
| `npm run sync-pool-data:watch` | Sync pool logs every 30s (foreground) |

---

## Production Deployment

### Prerequisites

- Docker and Docker Compose installed on the server
- Ports **80** and **443** open and reachable from the internet
- A domain pointing to the server
- **palladium-stack** already running on the same host, connected to the `palladium-net` Docker network

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Value |
|---|---|
| `CADDY_HOST` | your domain, e.g. `palladiumblockchain.net` |
| `API_KEY` | must match `API_KEY` in palladium-stack's `.env` |
| `POOL_LOG_DIR` | **required** — absolute path to ckpool logs on the host |

`API_BASE_URL` is not needed in production (leave empty).

### 2. Create the shared Docker network

Only needed once. This network is shared between this container and palladium-stack:

```bash
docker network create palladium-net
```

### 3. Start the container

```bash
docker-compose up -d --build
```

Caddy will automatically obtain and renew HTTPS certificates via Let's Encrypt.

### 4. What Caddy handles in production

| Feature | Details |
|---|---|
| HTTPS | Auto via Let's Encrypt |
| `www` redirect | `www.CADDY_HOST` → `CADDY_HOST` |
| API proxy | `/api/*` → `palladium-dashboard:8080`, injects `X-API-Key` header |
| Static files | Served from `public/` |
| Pool data | `POOL_LOG_DIR` mounted read-only at `/srv/pool-data` — no sync script |
| Security headers | HSTS, X-Frame-Options, X-Content-Type-Options, etc. |
| Compression | gzip + zstd |

### 5. Useful commands

```bash
# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Check container status
docker-compose ps
```

---

## Dev vs Prod: key differences

| | Dev | Prod |
|---|---|---|
| Server | live-server (Node.js) | Caddy (Docker) |
| Port | 3000 | 80 / 443 |
| HTTPS | No | Yes (auto Let's Encrypt) |
| Live reload | Yes | No |
| `API_BASE_URL` | `http://localhost:8080` | empty (Caddy proxies) |
| `POOL_LOG_DIR` | optional | required |
| Pool data source | synced by script every 30s | volume mount (read-only) |
| `public/js/config.js` | generated by `dev.sh` | generated by Dockerfile at build time |

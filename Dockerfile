# Stage 1: generate prod config.js (empty API_BASE_URL — Caddy handles same-origin proxy)
FROM node:20-alpine AS config-builder
WORKDIR /build
COPY scripts/ scripts/
RUN mkdir -p public/js public/pool-data
RUN node scripts/generate-config.js --prod

# Stage 2: serve with Caddy
FROM caddy:2.7-alpine
COPY public/ /srv
COPY --from=config-builder /build/public/js/config.js /srv/js/config.js
COPY Caddyfile /etc/caddy/Caddyfile

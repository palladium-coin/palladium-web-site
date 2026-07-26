#!/bin/sh
# Rewrites the baked-in default domain (palladiumchain.net) in SEO/social meta
# files to the real CADDY_HOST for this deployment, then hands off to Caddy.
# Runs on every container start (not just build), so a domain change in .env
# takes effect on the next `docker-compose up -d` without rebuilding the image.
set -e

if [ -n "${CADDY_HOST:-}" ] && [ "$CADDY_HOST" != "palladiumchain.net" ]; then
    find /srv -maxdepth 1 -type f \( -name '*.html' -o -name '*.xml' -o -name 'robots.txt' \) \
        -exec sed -i "s#https://palladiumchain\.net#https://${CADDY_HOST}#g" {} +
fi

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile

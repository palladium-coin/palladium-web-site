# Simple Caddy-based image to serve the static site
FROM caddy:2.7-alpine

# Copy site contents into the container
COPY . /srv

# Provide Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Caddy exposes 80 and 443 by default
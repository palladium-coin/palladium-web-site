# Dockerfile per ambiente di sviluppo/test
FROM nginx:alpine

# Installa curl per health checks
RUN apk add --no-cache curl

# Copia la configurazione nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copia tutti i file del sito web
COPY . /usr/share/nginx/html

# Rimuovi file non necessari per il web server
RUN rm -rf /usr/share/nginx/html/nginx \
    /usr/share/nginx/html/Dockerfile* \
    /usr/share/nginx/html/docker-compose* \
    /usr/share/nginx/html/.git* \
    /usr/share/nginx/html/endpoint \
    /usr/share/nginx/html/README.md \
    /usr/share/nginx/html/LICENSE

# Esponi la porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Avvia nginx
CMD ["nginx", "-g", "daemon off;"]
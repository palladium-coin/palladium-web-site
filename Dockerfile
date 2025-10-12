# Dockerfile semplice per sviluppo
FROM nginx:alpine

# Copia tutti i file del sito web nella directory di nginx
COPY . /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Espone la porta 80
EXPOSE 80

# Avvia nginx
CMD ["nginx", "-g", "daemon off;"]
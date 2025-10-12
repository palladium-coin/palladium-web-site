# 🐳 Docker Setup per Palladium Website

Questa guida spiega come utilizzare Docker per hostare il sito web Palladium sia in ambiente di sviluppo che in produzione.

## 📋 Prerequisiti

- Docker (versione 20.10 o superiore)
- Docker Compose (versione 1.29 o superiore)
- Git (per clonare il repository)

### Installazione Docker su Windows

1. Scarica Docker Desktop da [docker.com](https://www.docker.com/products/docker-desktop)
2. Installa e riavvia il sistema
3. Verifica l'installazione: `docker --version` e `docker-compose --version`

## 🏗️ Struttura dei File Docker

```
├── Dockerfile              # Container per sviluppo/test
├── Dockerfile.prod         # Container ottimizzato per produzione
├── docker-compose.yml      # Orchestrazione per sviluppo
├── docker-compose.prod.yml # Orchestrazione per produzione
├── nginx/
│   └── default.conf        # Configurazione nginx
├── .dockerignore          # File da escludere dal build
├── .env.example           # Template variabili d'ambiente
└── deploy.sh              # Script di deployment automatico
```

## 🚀 Quick Start

### Ambiente di Sviluppo

```bash
# 1. Clona il repository
git clone <repository-url>
cd new-palladium-website

# 2. Avvia l'ambiente di sviluppo
docker-compose up --build -d

# 3. Accedi al sito
# http://localhost:8080
```

### Ambiente di Produzione

```bash
# 1. Configura le variabili d'ambiente
cp .env.example .env
# Modifica .env con i tuoi valori

# 2. Avvia l'ambiente di produzione
docker-compose -f docker-compose.prod.yml up --build -d

# 3. Accedi al sito
# http://localhost (porta 80)
```

## 🛠️ Comandi Utili

### Gestione Container

```bash
# Visualizza container attivi
docker-compose ps

# Visualizza logs in tempo reale
docker-compose logs -f

# Ferma tutti i servizi
docker-compose down

# Ricostruisci e riavvia
docker-compose up --build -d

# Rimuovi tutto (container, volumi, reti)
docker-compose down -v --remove-orphans
```

### Script di Deployment Automatico

Il file `deploy.sh` fornisce comandi semplificati:

```bash
# Rendi eseguibile lo script (Linux/Mac)
chmod +x deploy.sh

# Deployment di sviluppo
./deploy.sh deploy development

# Deployment di produzione
./deploy.sh deploy production

# Visualizza logs
./deploy.sh logs production

# Stato dei servizi
./deploy.sh status

# Pulizia sistema
./deploy.sh cleanup

# Help
./deploy.sh help
```

## ⚙️ Configurazione

### Variabili d'Ambiente

Copia `.env.example` in `.env` e modifica i seguenti valori:

```env
# Dominio principale
DOMAIN_NAME=tuodominio.com

# Email per SSL
SSL_EMAIL=tua-email@example.com

# Ambiente
ENVIRONMENT=production
DEBUG=false

# Porte
WEB_PORT=80
API_PORT=8000
```

### Configurazione Nginx

Il file `nginx/default.conf` include:

- ✅ Compressione gzip
- ✅ Cache ottimizzata per file statici
- ✅ Headers di sicurezza
- ✅ Proxy per API
- ✅ Configurazione SSL-ready

## 🔧 Personalizzazione

### Modifica Configurazione Nginx

Edita `nginx/default.conf` per:
- Cambiare regole di cache
- Aggiungere nuovi headers di sicurezza
- Configurare proxy per servizi esterni
- Impostare redirect personalizzati

### Ottimizzazioni Produzione

Il `Dockerfile.prod` include:
- ✅ Multi-stage build
- ✅ Utente non-root per sicurezza
- ✅ Copia selettiva dei file
- ✅ Ottimizzazioni nginx
- ✅ Health checks robusti

## 🔍 Monitoraggio e Debug

### Health Checks

I container includono health checks automatici:

```bash
# Verifica stato health check
docker inspect <container-name> | grep -A 10 Health
```

### Logs

```bash
# Logs di tutti i servizi
docker-compose logs

# Logs di un servizio specifico
docker-compose logs web

# Logs in tempo reale
docker-compose logs -f --tail=100
```

### Debug Container

```bash
# Accedi al container
docker exec -it palladium-website-prod sh

# Verifica configurazione nginx
docker exec -it palladium-website-prod nginx -t

# Ricarica configurazione nginx
docker exec -it palladium-website-prod nginx -s reload
```

## 🚀 Deployment in Produzione

### 1. Preparazione Server

```bash
# Installa Docker e Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clona repository
git clone <repository-url>
cd new-palladium-website
```

### 2. Configurazione SSL (Opzionale)

```bash
# Abilita profilo SSL
docker-compose -f docker-compose.prod.yml --profile ssl up -d

# Verifica certificati
docker-compose -f docker-compose.prod.yml logs certbot
```

### 3. Monitoraggio (Opzionale)

```bash
# Abilita Watchtower per aggiornamenti automatici
docker-compose -f docker-compose.prod.yml --profile monitoring up -d
```

## 🔒 Sicurezza

### Best Practices Implementate

- ✅ Container eseguiti con utente non-root
- ✅ Read-only filesystem dove possibile
- ✅ Security headers configurati
- ✅ Secrets non hardcoded
- ✅ Network isolation
- ✅ Resource limits

### Configurazione Firewall

```bash
# Apri solo porte necessarie
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## 🆘 Troubleshooting

### Problemi Comuni

**Container non si avvia:**
```bash
# Verifica logs
docker-compose logs

# Verifica configurazione
docker-compose config
```

**Sito non raggiungibile:**
```bash
# Verifica porte
docker-compose ps
netstat -tlnp | grep :80

# Verifica nginx
docker exec -it <container> nginx -t
```

**Problemi di permessi:**
```bash
# Ricostruisci con --no-cache
docker-compose build --no-cache
```

### Reset Completo

```bash
# Ferma tutto
docker-compose down -v

# Rimuovi immagini
docker rmi $(docker images -q)

# Pulisci sistema
docker system prune -a

# Ricostruisci
docker-compose up --build -d
```

## 📞 Supporto

Per problemi o domande:
1. Controlla i logs: `docker-compose logs`
2. Verifica la configurazione: `docker-compose config`
3. Consulta la documentazione Docker ufficiale
4. Apri un issue nel repository

## 📝 Note Aggiuntive

- I volumi persistenti mantengono i dati tra riavvii
- Le configurazioni sono hot-reloadable in sviluppo
- Il monitoring è opzionale ma raccomandato per produzione
- Backup regolari sono consigliati per ambienti critici
#!/bin/bash

# Script di deployment per il sito Palladium
# Uso: ./deploy.sh [development|production]

set -e  # Esci se qualsiasi comando fallisce

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzioni di utilità
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verifica prerequisiti
check_prerequisites() {
    log_info "Verifico i prerequisiti..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker non è installato!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose non è installato!"
        exit 1
    fi
    
    log_success "Prerequisiti verificati"
}

# Funzione per deployment di sviluppo
deploy_development() {
    log_info "Avvio deployment di sviluppo..."
    
    # Ferma i container esistenti
    log_info "Fermo i container esistenti..."
    docker-compose down --remove-orphans || true
    
    # Costruisci e avvia i container
    log_info "Costruisco e avvio i container..."
    docker-compose up --build -d
    
    # Verifica che i servizi siano attivi
    log_info "Verifico lo stato dei servizi..."
    sleep 10
    
    if docker-compose ps | grep -q "Up"; then
        log_success "Deployment di sviluppo completato!"
        log_info "Il sito è disponibile su: http://localhost:8080"
        
        # Mostra i logs
        log_info "Ultimi logs:"
        docker-compose logs --tail=20
    else
        log_error "Errore durante il deployment!"
        docker-compose logs
        exit 1
    fi
}

# Funzione per deployment di produzione
deploy_production() {
    log_info "Avvio deployment di produzione..."
    
    # Verifica che esista il file .env
    if [ ! -f ".env" ]; then
        log_warning "File .env non trovato. Copio .env.example..."
        cp .env.example .env
        log_warning "IMPORTANTE: Modifica il file .env con i tuoi valori di produzione!"
        read -p "Premi ENTER per continuare dopo aver modificato .env..."
    fi
    
    # Ferma i container esistenti
    log_info "Fermo i container esistenti..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans || true
    
    # Rimuovi immagini vecchie per forzare rebuild
    log_info "Rimuovo immagini vecchie..."
    docker image prune -f || true
    
    # Costruisci e avvia i container di produzione
    log_info "Costruisco e avvio i container di produzione..."
    docker-compose -f docker-compose.prod.yml up --build -d
    
    # Verifica che i servizi siano attivi
    log_info "Verifico lo stato dei servizi..."
    sleep 15
    
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        log_success "Deployment di produzione completato!"
        log_info "Il sito è disponibile su: http://localhost"
        
        # Mostra informazioni sui container
        log_info "Container attivi:"
        docker-compose -f docker-compose.prod.yml ps
        
        # Mostra gli ultimi logs
        log_info "Ultimi logs:"
        docker-compose -f docker-compose.prod.yml logs --tail=20
    else
        log_error "Errore durante il deployment di produzione!"
        docker-compose -f docker-compose.prod.yml logs
        exit 1
    fi
}

# Funzione per cleanup
cleanup() {
    log_info "Pulizia del sistema..."
    
    # Ferma tutti i container
    docker-compose down --remove-orphans || true
    docker-compose -f docker-compose.prod.yml down --remove-orphans || true
    
    # Rimuovi immagini non utilizzate
    docker image prune -f
    
    # Rimuovi volumi non utilizzati
    docker volume prune -f
    
    log_success "Pulizia completata"
}

# Funzione per mostrare i logs
show_logs() {
    local env=${1:-development}
    
    if [ "$env" = "production" ]; then
        docker-compose -f docker-compose.prod.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Funzione per mostrare lo stato
show_status() {
    local env=${1:-development}
    
    log_info "Stato dei servizi ($env):"
    
    if [ "$env" = "production" ]; then
        docker-compose -f docker-compose.prod.yml ps
    else
        docker-compose ps
    fi
}

# Funzione di help
show_help() {
    echo "Uso: $0 [COMANDO] [AMBIENTE]"
    echo ""
    echo "COMANDI:"
    echo "  deploy [development|production]  - Esegui deployment"
    echo "  logs [development|production]    - Mostra logs in tempo reale"
    echo "  status [development|production]  - Mostra stato dei servizi"
    echo "  cleanup                          - Pulisci sistema Docker"
    echo "  help                             - Mostra questo help"
    echo ""
    echo "AMBIENTI:"
    echo "  development  - Ambiente di sviluppo (default)"
    echo "  production   - Ambiente di produzione"
    echo ""
    echo "Esempi:"
    echo "  $0 deploy development"
    echo "  $0 deploy production"
    echo "  $0 logs production"
    echo "  $0 cleanup"
}

# Main script
main() {
    local command=${1:-deploy}
    local environment=${2:-development}
    
    case $command in
        "deploy")
            check_prerequisites
            if [ "$environment" = "production" ]; then
                deploy_production
            else
                deploy_development
            fi
            ;;
        "logs")
            show_logs "$environment"
            ;;
        "status")
            show_status "$environment"
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Comando non riconosciuto: $command"
            show_help
            exit 1
            ;;
    esac
}

# Esegui lo script
main "$@"
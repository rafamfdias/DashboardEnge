#!/bin/bash

# Script auxiliar para gerenciar o Dashboard com Docker
# Uso: ./docker-manage.sh [comando]

set -e

CONTAINER_NAME="dashboard-banco-horas"
IMAGE_NAME="dashboard-banco-horas"

case "$1" in
    start)
        echo "🚀 Iniciando Dashboard..."
        docker-compose up -d
        echo "✅ Dashboard iniciado!"
        echo "📍 Acesse: http://localhost:3000"
        ;;
    
    stop)
        echo "🛑 Parando Dashboard..."
        docker-compose down
        echo "✅ Dashboard parado!"
        ;;
    
    restart)
        echo "🔄 Reiniciando Dashboard..."
        docker-compose restart
        echo "✅ Dashboard reiniciado!"
        ;;
    
    logs)
        echo "📋 Logs do Dashboard (Ctrl+C para sair)..."
        docker-compose logs -f
        ;;
    
    status)
        echo "📊 Status do Dashboard:"
        docker-compose ps
        echo ""
        docker stats $CONTAINER_NAME --no-stream
        ;;
    
    build)
        echo "🔨 Construindo imagem..."
        docker-compose build --no-cache
        echo "✅ Imagem construída!"
        ;;
    
    rebuild)
        echo "🔨 Reconstruindo e reiniciando..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        echo "✅ Dashboard reconstruído e iniciado!"
        ;;
    
    backup)
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).db"
        echo "💾 Fazendo backup..."
        docker cp $CONTAINER_NAME:/app/data/database.db ./$BACKUP_FILE
        echo "✅ Backup salvo: $BACKUP_FILE"
        ;;
    
    restore)
        if [ -z "$2" ]; then
            echo "❌ Erro: Especifique o arquivo de backup"
            echo "Uso: ./docker-manage.sh restore backup_20231127.db"
            exit 1
        fi
        echo "📥 Restaurando backup: $2"
        docker-compose down
        docker cp $2 $CONTAINER_NAME:/app/data/database.db
        docker-compose up -d
        echo "✅ Backup restaurado!"
        ;;
    
    clean)
        echo "🗑️  Removendo tudo (incluindo dados)..."
        read -p "Tem certeza? Todos os dados serão perdidos! (s/N): " confirm
        if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
            docker-compose down -v
            docker rmi $IMAGE_NAME 2>/dev/null || true
            echo "✅ Tudo removido!"
        else
            echo "❌ Operação cancelada"
        fi
        ;;
    
    update)
        echo "🔄 Atualizando Dashboard..."
        docker-compose down
        echo "💾 Fazendo backup antes de atualizar..."
        docker cp $CONTAINER_NAME:/app/data/database.db ./backup_pre_update.db 2>/dev/null || true
        docker-compose pull
        docker-compose build --no-cache
        docker-compose up -d
        echo "✅ Dashboard atualizado!"
        ;;
    
    shell)
        echo "🔧 Abrindo shell no container..."
        docker exec -it $CONTAINER_NAME sh
        ;;
    
    inspect)
        echo "🔍 Inspecionando container..."
        docker inspect $CONTAINER_NAME | less
        ;;
    
    *)
        echo "Dashboard de Banco de Horas - Gerenciamento Docker"
        echo ""
        echo "Uso: ./docker-manage.sh [comando]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  start      - Iniciar dashboard"
        echo "  stop       - Parar dashboard"
        echo "  restart    - Reiniciar dashboard"
        echo "  logs       - Ver logs em tempo real"
        echo "  status     - Ver status e recursos"
        echo "  build      - Construir imagem"
        echo "  rebuild    - Reconstruir e reiniciar"
        echo "  backup     - Fazer backup do banco de dados"
        echo "  restore    - Restaurar backup"
        echo "  clean      - Remover tudo (incluindo dados)"
        echo "  update     - Atualizar para nova versão"
        echo "  shell      - Abrir shell no container"
        echo "  inspect    - Inspecionar container"
        echo ""
        echo "Exemplos:"
        echo "  ./docker-manage.sh start"
        echo "  ./docker-manage.sh logs"
        echo "  ./docker-manage.sh backup"
        echo "  ./docker-manage.sh restore backup_20231127.db"
        echo ""
        ;;
esac

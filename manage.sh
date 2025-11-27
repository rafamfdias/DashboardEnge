#!/bin/bash

# Script de gerenciamento do Dashboard de Banco de Horas

case "$1" in
  start)
    echo "🚀 Iniciando servidor..."
    npm start
    ;;
  dev)
    echo "🔧 Iniciando servidor em modo desenvolvimento..."
    npm run dev
    ;;
  stop)
    echo "🛑 Parando servidor..."
    pkill -f "node server/server.js"
    echo "✅ Servidor parado"
    ;;
  restart)
    echo "🔄 Reiniciando servidor..."
    pkill -f "node server/server.js"
    sleep 1
    npm start
    ;;
  status)
    if pgrep -f "node server/server.js" > /dev/null; then
      echo "✅ Servidor está rodando"
      echo "📍 http://localhost:3000"
    else
      echo "❌ Servidor não está rodando"
    fi
    ;;
  clean)
    echo "🗑️  Limpando banco de dados..."
    rm -f database.db
    echo "✅ Banco de dados limpo"
    ;;
  install)
    echo "📦 Instalando dependências..."
    npm install
    echo "✅ Instalação completa"
    ;;
  *)
    echo "Dashboard de Banco de Horas - Gerenciamento"
    echo ""
    echo "Uso: ./manage.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  start     - Iniciar servidor"
    echo "  dev       - Iniciar em modo desenvolvimento"
    echo "  stop      - Parar servidor"
    echo "  restart   - Reiniciar servidor"
    echo "  status    - Verificar se está rodando"
    echo "  clean     - Limpar banco de dados"
    echo "  install   - Instalar dependências"
    echo ""
    ;;
esac

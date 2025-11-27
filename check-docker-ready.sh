#!/bin/bash

# Script para verificar se o ambiente está pronto para Docker
# Uso: ./check-docker-ready.sh

echo "🔍 Verificando ambiente para Docker..."
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
CHECKS_OK=0
CHECKS_FAIL=0
CHECKS_WARN=0

# Função para verificar comando
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $2 instalado${NC}"
        echo "   Versão: $($1 --version | head -n1)"
        ((CHECKS_OK++))
        return 0
    else
        echo -e "${RED}❌ $2 NÃO instalado${NC}"
        echo "   Instale: $3"
        ((CHECKS_FAIL++))
        return 1
    fi
}

# Função para verificar porta
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t &> /dev/null; then
        echo -e "${YELLOW}⚠️  Porta $1 está EM USO${NC}"
        echo "   Processo: $(lsof -Pi :$1 -sTCP:LISTEN | grep LISTEN | awk '{print $1}')"
        ((CHECKS_WARN++))
        return 1
    else
        echo -e "${GREEN}✅ Porta $1 disponível${NC}"
        ((CHECKS_OK++))
        return 0
    fi
}

echo "📦 Verificando requisitos..."
echo ""

# Verificar Docker
check_command "docker" "Docker" "https://docs.docker.com/get-docker/"
DOCKER_OK=$?

# Verificar Docker Compose
check_command "docker-compose" "Docker Compose" "https://docs.docker.com/compose/install/"
COMPOSE_OK=$?

echo ""
echo "🌐 Verificando portas..."
echo ""

# Verificar porta 3000
check_port 3000

echo ""
echo "💾 Verificando espaço em disco..."
echo ""

# Verificar espaço disponível
DISK_SPACE=$(df -h . | awk 'NR==2 {print $4}')
echo -e "${GREEN}✅ Espaço disponível: $DISK_SPACE${NC}"
((CHECKS_OK++))

echo ""
echo "🔒 Verificando permissões..."
echo ""

# Verificar se pode executar Docker
if [ $DOCKER_OK -eq 0 ]; then
    if docker ps &> /dev/null; then
        echo -e "${GREEN}✅ Permissões Docker OK${NC}"
        ((CHECKS_OK++))
    else
        echo -e "${YELLOW}⚠️  Sem permissão para executar Docker${NC}"
        echo "   Execute: sudo usermod -aG docker $USER"
        echo "   Depois faça logout/login"
        ((CHECKS_WARN++))
    fi
fi

echo ""
echo "📁 Verificando arquivos do projeto..."
echo ""

# Verificar arquivos essenciais
FILES=("docker-compose.yml" "Dockerfile" "package.json" "server/server.js")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file encontrado${NC}"
        ((CHECKS_OK++))
    else
        echo -e "${RED}❌ $file NÃO encontrado${NC}"
        ((CHECKS_FAIL++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Resultado final
echo "📊 Resultado da Verificação:"
echo ""
echo -e "${GREEN}✅ Verificações OK: $CHECKS_OK${NC}"
echo -e "${YELLOW}⚠️  Avisos: $CHECKS_WARN${NC}"
echo -e "${RED}❌ Problemas: $CHECKS_FAIL${NC}"
echo ""

# Conclusão
if [ $CHECKS_FAIL -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ AMBIENTE PRONTO PARA DOCKER!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🚀 Próximos passos:"
    echo ""
    echo "1. Construir e iniciar:"
    echo "   docker-compose up -d"
    echo ""
    echo "2. Ver logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "3. Acessar:"
    echo "   http://localhost:3000"
    echo ""
    
    if [ $CHECKS_WARN -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Há alguns avisos, mas você pode prosseguir.${NC}"
        echo ""
    fi
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ AMBIENTE NÃO ESTÁ PRONTO${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🔧 Corrija os problemas acima antes de continuar."
    echo ""
    echo "📖 Documentação:"
    echo "   - DOCKER-QUICKSTART.md"
    echo "   - DEPLOY-DOCKER.md"
    echo ""
    exit 1
fi

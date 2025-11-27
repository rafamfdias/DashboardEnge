# 🐳 Deploy com Docker - Dashboard de Banco de Horas

## 🚀 Início Rápido

### Opção 1: Docker Compose (Recomendado)

```bash
# Construir e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Opção 2: Docker Direto

```bash
# Construir imagem
docker build -t dashboard-banco-horas .

# Executar container
docker run -d \
  -p 3000:3000 \
  -v dashboard-data:/app/data \
  --name dashboard \
  --restart unless-stopped \
  dashboard-banco-horas

# Ver logs
docker logs -f dashboard
```

---

## 📋 Pré-requisitos

- Docker instalado (versão 20.10+)
- Docker Compose instalado (versão 2.0+)
- Porta 3000 disponível

### Instalar Docker

**Windows Server:**
```powershell
# Baixar Docker Desktop
# https://docs.docker.com/desktop/install/windows-install/
```

**Linux (Ubuntu/Debian):**
```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt-get install docker-compose-plugin
```

**Linux (CentOS/RHEL):**
```bash
sudo yum install -y docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

---

## 🛠️ Comandos Úteis

### Gerenciamento Básico

```bash
# Iniciar container
docker-compose up -d

# Parar container
docker-compose down

# Reiniciar
docker-compose restart

# Ver status
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de hoje
docker-compose logs --since 24h
```

### Scripts NPM (Atalhos)

```bash
# Construir imagem
npm run docker:build

# Iniciar com compose
npm run docker:compose

# Parar com compose
npm run docker:compose:down

# Ver logs
npm run docker:compose:logs
```

---

## 💾 Persistência de Dados

O banco de dados SQLite é armazenado em um **Docker Volume** chamado `dashboard-data`.

### Localização dos dados

```bash
# Ver volumes
docker volume ls

# Inspecionar volume
docker volume inspect dashboard-data

# Localização (Linux)
/var/lib/docker/volumes/dashboard-data/_data/database.db
```

### Backup do banco de dados

```bash
# Backup manual
docker cp dashboard:/app/data/database.db ./backup_$(date +%Y%m%d).db

# Ou com volume direto
docker run --rm -v dashboard-data:/data -v $(pwd):/backup \
  alpine cp /data/database.db /backup/database_backup.db
```

### Restaurar backup

```bash
# Parar container
docker-compose down

# Copiar backup para volume
docker run --rm -v dashboard-data:/data -v $(pwd):/backup \
  alpine cp /backup/database_backup.db /data/database.db

# Reiniciar
docker-compose up -d
```

---

## 🌐 Configuração de Rede

### Acessar de outros computadores

O container já está configurado para aceitar conexões externas na porta 3000.

**Usuários acessam via:**
```
http://IP_DO_SERVIDOR:3000
```

### Mudar a porta

Edite `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Porta externa:interna
```

---

## 🔧 Variáveis de Ambiente

Você pode configurar via `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - TZ=America/Sao_Paulo  # Timezone
```

Ou criar arquivo `.env`:

```bash
NODE_ENV=production
PORT=3000
TZ=America/Sao_Paulo
```

---

## 🔄 Atualização

### Atualizar o sistema

```bash
# 1. Baixar nova versão (git pull ou copiar arquivos)

# 2. Parar container atual
docker-compose down

# 3. Reconstruir imagem
docker-compose build

# 4. Iniciar nova versão
docker-compose up -d

# 5. Verificar logs
docker-compose logs -f
```

### Sem downtime (com múltiplas instâncias)

```bash
# Criar nova versão
docker-compose up -d --scale dashboard=2 --no-recreate

# Remover versão antiga
docker-compose up -d --scale dashboard=1
```

---

## 📊 Monitoramento

### Ver uso de recursos

```bash
# CPU, Memória, Rede
docker stats dashboard
```

### Health check

O container tem health check automático. Verificar:

```bash
# Status
docker inspect dashboard | grep -A 5 Health

# Logs do health check
docker inspect dashboard | jq '.[0].State.Health'
```

---

## 🔒 Segurança

### Executar como usuário não-root (Recomendado)

Adicione no `Dockerfile` antes do CMD:

```dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs
```

### Limitar recursos

Em `docker-compose.yml`:

```yaml
services:
  dashboard:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          memory: 256M
```

### Scan de vulnerabilidades

```bash
# Escanear imagem
docker scan dashboard-banco-horas

# Ou usar Trivy
trivy image dashboard-banco-horas
```

---

## 🌐 Nginx Reverse Proxy (Opcional)

Para usar com domínio próprio:

### docker-compose.yml completo

```yaml
version: '3.8'

services:
  dashboard:
    build: .
    container_name: dashboard-banco-horas
    restart: unless-stopped
    volumes:
      - dashboard-data:/app/data
    environment:
      - NODE_ENV=production
    networks:
      - dashboard-network

  nginx:
    image: nginx:alpine
    container_name: dashboard-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - dashboard
    networks:
      - dashboard-network

volumes:
  dashboard-data:

networks:
  dashboard-network:
    driver: bridge
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream dashboard {
        server dashboard:3000;
    }

    server {
        listen 80;
        server_name dashboard.empresa.local;

        location / {
            proxy_pass http://dashboard;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

---

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs dashboard

# Verificar configuração
docker-compose config

# Reconstruir do zero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Erro de permissão no volume

```bash
# Corrigir permissões
docker-compose down
docker volume rm dashboard-data
docker-compose up -d
```

### Container reiniciando constantemente

```bash
# Ver motivo
docker inspect dashboard | grep -A 10 State

# Ver logs de erro
docker logs dashboard --tail 100
```

### Porta já em uso

```bash
# Ver o que está usando a porta
netstat -tulpn | grep 3000

# Ou mudar a porta no docker-compose.yml
ports:
  - "3001:3000"
```

---

## 📈 Performance

### Otimização de build

```dockerfile
# Multi-stage build (adicionar no Dockerfile)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["node", "server/server.js"]
```

### Cache de layers

```bash
# Build com cache
docker-compose build

# Build sem cache (quando houver problemas)
docker-compose build --no-cache
```

---

## 🔄 Backup Automático

### Script de backup diário

Criar `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/dashboard"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker cp dashboard:/app/data/database.db \
  $BACKUP_DIR/database_$DATE.db

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "database_*.db" -mtime +30 -delete

echo "Backup concluído: database_$DATE.db"
```

### Agendar com cron

```bash
# Editar crontab
crontab -e

# Adicionar backup diário às 2h da manhã
0 2 * * * /caminho/backup.sh >> /var/log/dashboard-backup.log 2>&1
```

---

## 🚀 Deploy em Produção

### Checklist

- [ ] Docker e Docker Compose instalados
- [ ] Porta 3000 (ou escolhida) disponível
- [ ] Firewall configurado
- [ ] Volume de dados configurado
- [ ] Backup automático configurado
- [ ] Health check funcionando
- [ ] Logs sendo monitorados
- [ ] Restart policy configurado

### Iniciar em produção

```bash
# Clonar/copiar projeto
cd /srv/dashboard-banco-horas

# Construir e iniciar
docker-compose up -d

# Verificar status
docker-compose ps
docker-compose logs -f

# Testar acesso
curl http://localhost:3000/api/dashboard/latest
```

---

## 📞 Comandos de Diagnóstico

```bash
# Status geral
docker-compose ps
docker stats dashboard

# Logs
docker-compose logs --tail=100 -f

# Entrar no container
docker exec -it dashboard sh

# Verificar banco de dados
docker exec -it dashboard sqlite3 /app/data/database.db ".tables"

# Verificar conectividade
docker exec -it dashboard ping -c 3 google.com

# Reiniciar com logs
docker-compose restart && docker-compose logs -f
```

---

## ✅ Vantagens do Docker

- ✅ **Portabilidade**: Funciona em qualquer servidor com Docker
- ✅ **Isolamento**: Não interfere com outros sistemas
- ✅ **Facilidade**: Um comando para subir tudo
- ✅ **Consistência**: Mesmo ambiente em dev e produção
- ✅ **Backup**: Fácil copiar/restaurar volumes
- ✅ **Atualização**: Simples trocar versões
- ✅ **Monitoramento**: Health checks integrados
- ✅ **Escalabilidade**: Fácil criar múltiplas instâncias

---

## 🎯 Exemplos de Uso

### Desenvolvimento Local

```bash
docker-compose up
# Fazer alterações no código
docker-compose restart
```

### Produção

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Staging

```bash
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

---

## 📚 Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

✅ **Pronto!** Seu dashboard está rodando em Docker com persistência de dados e pronto para produção!

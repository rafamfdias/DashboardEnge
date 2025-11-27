# 🔧 Comandos Úteis - Referência Rápida

## 🐳 Comandos Docker

### Gerenciamento Básico
```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Reiniciar
docker-compose restart

# Status
docker-compose ps

# Logs
docker-compose logs -f
docker-compose logs --tail=100

# Reconstruir
docker-compose build --no-cache
docker-compose up -d --build
```

### Scripts NPM (Atalhos)
```bash
npm run docker:compose          # Iniciar
npm run docker:compose:down     # Parar
npm run docker:compose:logs     # Ver logs
npm run docker:build            # Construir imagem
```

### Script de Gerenciamento
```bash
./docker-manage.sh start        # Iniciar
./docker-manage.sh stop         # Parar
./docker-manage.sh logs         # Ver logs
./docker-manage.sh status       # Ver status
./docker-manage.sh backup       # Backup
./docker-manage.sh restart      # Reiniciar
```

### Backup e Restore
```bash
# Backup
docker cp dashboard:/app/data/database.db ./backup.db

# Restore
docker-compose down
docker cp ./backup.db dashboard:/app/data/database.db
docker-compose up -d
```

### Debug
```bash
# Entrar no container
docker exec -it dashboard sh

# Ver processos
docker top dashboard

# Ver recursos
docker stats dashboard

# Inspecionar
docker inspect dashboard

# Ver rede
docker network inspect dashboardenge_dashboard-network
```

---

## 📦 Comandos Tradicionais

### Gerenciamento Básico
```bash
# Iniciar
npm start

# Desenvolvimento (auto-reload)
npm run dev

# Com PM2
pm2 start server/server.js --name dashboard
pm2 stop dashboard
pm2 restart dashboard
pm2 logs dashboard
pm2 status
```

### Script de Gerenciamento
```bash
./manage.sh start               # Iniciar
./manage.sh stop                # Parar
./manage.sh status              # Status
./manage.sh restart             # Reiniciar
./manage.sh clean               # Limpar DB
```

### Backup e Restore
```bash
# Backup
cp database.db backup_$(date +%Y%m%d).db

# Restore
pm2 stop dashboard
cp backup_20231127.db database.db
pm2 start dashboard
```

---

## 🔍 Diagnóstico

### Verificar Instalação
```bash
# Node.js
node --version              # Deve ser 14+

# Docker
docker --version            # Deve ser 20.10+
docker-compose --version    # Deve ser 2.0+

# PM2
pm2 --version
```

### Testar API
```bash
# Teste simples
curl http://localhost:3000/api/dashboard/latest

# Com formatação
curl -s http://localhost:3000/api/dashboard/latest | jq

# Teste de health
curl -I http://localhost:3000
```

### Ver Logs
```bash
# Docker
docker-compose logs -f
docker-compose logs --since 30m

# PM2
pm2 logs dashboard
pm2 logs dashboard --lines 100

# Systemd (Linux)
journalctl -u dashboard -f
journalctl -u dashboard --since today
```

### Verificar Porta
```bash
# Linux/Mac
lsof -i :3000
netstat -tulpn | grep 3000

# Windows
netstat -ano | findstr :3000
```

### Verificar Processos
```bash
# Docker
docker ps | grep dashboard

# PM2
pm2 list

# Sistema
ps aux | grep node
```

---

## 🔧 Manutenção

### Limpar Docker
```bash
# Remover containers parados
docker container prune

# Remover imagens não usadas
docker image prune

# Remover tudo (cuidado!)
docker system prune -a

# Remover volumes não usados
docker volume prune
```

### Limpar Logs
```bash
# Docker
docker-compose logs --tail=0 -f > /dev/null

# PM2
pm2 flush

# Limpar logs antigos
find . -name "*.log" -mtime +30 -delete
```

### Atualizar Dependências
```bash
# Verificar atualizações
npm outdated

# Atualizar
npm update

# Atualizar major versions
npm install <package>@latest
```

---

## 🌐 Rede

### Descobrir IP do Servidor
```bash
# Linux/Mac
hostname -I | awk '{print $1}'
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr IPv4
```

### Testar Conectividade
```bash
# Ping
ping IP_DO_SERVIDOR

# Telnet
telnet IP_DO_SERVIDOR 3000

# Curl
curl http://IP_DO_SERVIDOR:3000
```

### Firewall
```bash
# Linux (UFW)
sudo ufw allow 3000/tcp
sudo ufw status

# Linux (firewalld)
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload

# Windows
New-NetFirewallRule -DisplayName "Dashboard" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

## 📊 Monitoramento

### Uso de Recursos
```bash
# Docker
docker stats dashboard

# Sistema
top
htop
free -h
df -h
```

### Saúde do Sistema
```bash
# Docker health check
docker inspect dashboard | grep -A 5 Health

# Testar endpoints
curl http://localhost:3000/api/dashboard/latest
curl http://localhost:3000/api/dashboard/history
```

---

## 🔄 CI/CD

### Build e Deploy
```bash
# Pull última versão
git pull origin main

# Docker
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Tradicional
pm2 stop dashboard
npm install
pm2 restart dashboard
```

### Rollback
```bash
# Docker
git checkout <commit-anterior>
docker-compose down
docker-compose build
docker-compose up -d

# Tradicional
git checkout <commit-anterior>
npm install
pm2 restart dashboard
```

---

## 🔒 Segurança

### Verificar Permissões
```bash
# Arquivos
ls -la

# Banco de dados
ls -la database.db
ls -la data/

# Corrigir
chmod 644 database.db
chmod 755 server/
```

### Scan de Vulnerabilidades
```bash
# NPM
npm audit
npm audit fix

# Docker
docker scan dashboard-banco-horas
```

---

## 💾 Backup Automático

### Linux (Cron)
```bash
# Editar crontab
crontab -e

# Adicionar (backup diário às 2h)
0 2 * * * /caminho/docker-manage.sh backup

# Verificar
crontab -l
```

### Windows (Task Scheduler)
```powershell
# Criar tarefa
$Action = New-ScheduledTaskAction -Execute "docker-manage.sh" -Argument "backup"
$Trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "Dashboard Backup" -Action $Action -Trigger $Trigger
```

---

## 📝 Variáveis de Ambiente

### Configurar
```bash
# Docker (.env)
NODE_ENV=production
PORT=3000

# Linux/Mac
export PORT=8080
npm start

# Windows
set PORT=8080
npm start
```

---

## 🆘 Troubleshooting

### Resetar Tudo (Docker)
```bash
docker-compose down -v
docker rmi dashboard-banco-horas
docker-compose build --no-cache
docker-compose up -d
```

### Resetar Tudo (Tradicional)
```bash
pm2 delete dashboard
rm -rf node_modules package-lock.json database.db
npm install
npm start
```

### Limpar Cache
```bash
# npm
npm cache clean --force

# Docker
docker builder prune
```

---

## 📚 Mais Comandos

### Git
```bash
git status
git log --oneline
git diff
git stash
git stash pop
```

### Sistema
```bash
# Espaço em disco
df -h
du -sh *

# Memória
free -h
vmstat

# Processos
ps aux | grep node
killall node
```

---

✅ **Dica:** Adicione esses comandos aos seus favoritos ou crie aliases para os mais usados!

```bash
# Adicionar ao .bashrc ou .zshrc
alias dash-start="docker-compose up -d"
alias dash-stop="docker-compose down"
alias dash-logs="docker-compose logs -f"
alias dash-status="docker-compose ps"
```

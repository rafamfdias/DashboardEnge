# 🚀 Guia Completo de Deploy - Todas as Opções

## Escolha seu método de deploy

### 🐳 Opção 1: Docker (RECOMENDADO) ⭐

**Melhor para:** Servidores modernos, deploy rápido, fácil manutenção

**Vantagens:**
- ✅ Instalação em 1 minuto
- ✅ Funciona em qualquer sistema operacional
- ✅ Dados persistem automaticamente
- ✅ Reinicia sozinho se cair
- ✅ Fácil atualizar e fazer backup
- ✅ Isolado do resto do sistema

**Início rápido:**
```bash
docker-compose up -d
```

📖 **Documentação:**
- [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) - Início rápido (2 minutos)
- [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md) - Guia completo

---

### 📦 Opção 2: Instalação Tradicional

**Melhor para:** Quem não pode usar Docker, servidor legado

**Vantagens:**
- ✅ Controle total do ambiente
- ✅ Funciona em qualquer servidor com Node.js
- ✅ Não precisa de Docker instalado

**Início rápido:**
```bash
npm install
npm start
```

📖 **Documentação:**
- [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Início rápido
- [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md) - Guia completo
- [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) - Passo a passo

---

## 📊 Comparação dos Métodos

| Característica | Docker | Tradicional |
|---------------|--------|-------------|
| **Instalação** | 1 minuto | 5-10 minutos |
| **Requisitos** | Docker | Node.js + npm |
| **Persistência** | Automática (volume) | SQLite local |
| **Backup** | 1 comando | Copiar arquivo |
| **Atualização** | Rebuild imagem | Git pull + restart |
| **Isolamento** | Completo | Compartilha sistema |
| **Portabilidade** | Alta | Média |
| **Recursos** | Limitáveis | Sistema todo |
| **Monitoramento** | Health check integrado | Manual/PM2 |

---

## 🏢 Cenários de Uso

### Servidor Windows moderno
```
✅ RECOMENDADO: Docker Desktop
📦 Alternativa: Node.js + PM2 (Windows Service)
```

### Servidor Linux (Ubuntu/Debian/CentOS)
```
✅ RECOMENDADO: Docker + docker-compose
📦 Alternativa: Node.js + systemd
```

### Servidor legado (sem Docker)
```
📦 USAR: Node.js + PM2 ou systemd
```

### Múltiplos ambientes (dev, staging, prod)
```
✅ RECOMENDADO: Docker (mesma imagem em todos)
```

### VM ou Container existente
```
✅ RECOMENDADO: Docker-in-Docker
📦 Alternativa: Node.js direto
```

---

## 🚀 Guia de Decisão Rápida

### Você tem Docker instalado?
- **SIM** → Use Docker! ([DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md))
- **NÃO** → Pode instalar Docker?
  - **SIM** → Instale e use Docker!
  - **NÃO** → Use método tradicional ([DEPLOY-INTRANET.md](DEPLOY-INTRANET.md))

### Seu servidor é:
- **Novo/Moderno** → Docker
- **Legado/Antigo** → Tradicional
- **Cloud (AWS/Azure/GCP)** → Docker
- **Servidor físico** → Qualquer um

---

## ⚡ Início Super Rápido

### Com Docker (30 segundos)
```bash
git clone <repo>
cd DashboardEnge
docker-compose up -d
# Acesse http://localhost:3000
```

### Sem Docker (2 minutos)
```bash
git clone <repo>
cd DashboardEnge
npm install
npm start
# Acesse http://localhost:3000
```

---

## 📋 Requisitos por Método

### Docker
- Docker Engine 20.10+
- Docker Compose 2.0+
- 512MB RAM disponível
- 1GB disco disponível
- Porta 3000 livre

### Tradicional
- Node.js 14+
- npm 6+
- 256MB RAM disponível
- 500MB disco disponível
- Porta 3000 livre

---

## 🔧 Após Deploy (Ambos)

### Verificar se está funcionando
```bash
# Testar API
curl http://localhost:3000/api/dashboard/latest

# Ver logs
# Docker: docker-compose logs -f
# Tradicional: pm2 logs dashboard
```

### Configurar acesso externo
1. Liberar porta 3000 no firewall
2. Anotar IP do servidor
3. Compartilhar com usuários: `http://IP:3000`

### Configurar backup automático
- **Docker:** [DEPLOY-DOCKER.md#backup](DEPLOY-DOCKER.md#-backup-automático)
- **Tradicional:** [DEPLOY-INTRANET.md#backup](DEPLOY-INTRANET.md#-configuração-de-backup-automático)

---

## 🔄 Migração entre Métodos

### De Tradicional para Docker
```bash
# 1. Fazer backup
cp database.db backup.db

# 2. Parar servidor tradicional
pm2 stop dashboard

# 3. Iniciar com Docker
docker-compose up -d

# 4. Restaurar dados
docker cp backup.db dashboard:/app/data/database.db
docker-compose restart
```

### De Docker para Tradicional
```bash
# 1. Fazer backup do Docker
docker cp dashboard:/app/data/database.db backup.db

# 2. Parar Docker
docker-compose down

# 3. Instalar tradicionalmente
npm install

# 4. Restaurar dados
cp backup.db database.db

# 5. Iniciar
npm start
```

---

## 📚 Documentação Completa

### Docker
- [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) - Início rápido
- [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md) - Guia completo
- `docker-manage.sh` - Script de gerenciamento

### Tradicional
- [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Início rápido
- [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md) - Guia completo
- [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) - Checklist
- `manage.sh` - Script de gerenciamento

### Geral
- [README.md](README.md) - Visão geral
- [FAQ-INTRANET.md](FAQ-INTRANET.md) - Perguntas frequentes

---

## 🆘 Precisa de Ajuda?

### Problemas Comuns

**Porta 3000 em uso:**
```bash
# Docker: mude em docker-compose.yml
# Tradicional: mude PORT em server/server.js
```

**Permissão negada:**
```bash
# Docker: chmod 777 data/
# Tradicional: chown -R $USER:$USER .
```

**Não consegue acessar de outros PCs:**
```bash
# Verifique firewall
# Verifique se está na mesma rede
# Use IP correto (não localhost)
```

---

## ✅ Recomendação Final

**Para 90% dos casos:**
```
🐳 Use Docker com docker-compose
É mais fácil, mais rápido e menos problemas!
```

**Só use método tradicional se:**
- Não pode instalar Docker
- Servidor muito antigo
- Políticas da empresa impedem Docker

---

## 🎯 TL;DR

```bash
# TEM DOCKER? Faça isso:
docker-compose up -d

# NÃO TEM DOCKER? Faça isso:
npm install && npm start

# Acesse: http://IP_DO_SERVIDOR:3000
```

**Pronto! 🎉**

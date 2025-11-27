# 🔄 Guia de Atualização - Container Existente

## 📋 Situação Atual

Você tem:
- **Container:** awesome_hermann
- **Porta:** 8080
- **Imagem antiga:** Nginx (só frontend estático)

Precisa atualizar para:
- **Nova versão:** Node.js + SQLite + Backend + Frontend
- **Mesma porta:** 8080
- **Persistência:** Banco de dados

---

## 🚀 Passo a Passo para Atualizar

### 1️⃣ Fazer Backup dos Dados (se houver)

```bash
# Se você tinha dados no container antigo
docker cp awesome_hermann:/usr/share/nginx/html/database.db ./backup_old.db 2>/dev/null || echo "Sem dados antigos"
```

### 2️⃣ Parar e Remover o Container Antigo

```bash
# Parar container
docker stop awesome_hermann

# Remover container
docker rm awesome_hermann

# (Opcional) Remover imagem antiga
docker rmi 3f8c5a14ebf4
```

### 3️⃣ Construir Nova Imagem

```bash
# Na pasta do projeto
cd /Users/rafaeldias/Documents/DashboardEnge

# Construir nova imagem
docker build -t dashboard-banco-horas:latest .
```

### 4️⃣ Criar Volume para Dados

```bash
# Criar volume para o banco de dados
docker volume create dashboard-data
```

### 5️⃣ Iniciar Novo Container

```bash
# Iniciar na porta 8080 (mesma que você usava)
docker run -d \
  --name awesome_hermann \
  -p 8080:3000 \
  -v dashboard-data:/app/data \
  --restart unless-stopped \
  dashboard-banco-horas:latest

# OU usar docker-compose (recomendado)
# Mas precisa ajustar a porta no docker-compose.yml primeiro
```

### 6️⃣ Verificar se Funcionou

```bash
# Ver logs
docker logs -f awesome_hermann

# Testar acesso
curl http://localhost:8080/api/dashboard/latest

# Ver status
docker ps | grep awesome_hermann
```

---

## ⚙️ Opção com docker-compose (Recomendado)

### 1️⃣ Ajustar docker-compose.yml para usar porta 8080

Edite o arquivo `docker-compose.yml` e mude:
```yaml
ports:
  - "8080:3000"  # Era "3000:3000"
```

### 2️⃣ Parar container antigo

```bash
docker stop awesome_hermann
docker rm awesome_hermann
```

### 3️⃣ Iniciar com compose

```bash
docker-compose up -d
```

Mas o compose criará um container com nome diferente: `dashboard-banco-horas`

### 4️⃣ (Opcional) Renomear container para manter o nome

```bash
# Depois de iniciar com compose
docker rename dashboard-banco-horas awesome_hermann
```

---

## 🎯 Comandos Rápidos (Copiar e Colar)

### Atualização Rápida (mantendo mesmo nome e porta)

```bash
# 1. Backup (se necessário)
docker cp awesome_hermann:/usr/share/nginx/html/database.db ./backup.db 2>/dev/null || true

# 2. Parar e remover antigo
docker stop awesome_hermann && docker rm awesome_hermann

# 3. Construir nova imagem
docker build -t dashboard-banco-horas:latest .

# 4. Criar volume
docker volume create dashboard-data

# 5. Iniciar novo container (PORTA 8080)
docker run -d \
  --name awesome_hermann \
  -p 8080:3000 \
  -v dashboard-data:/app/data \
  --restart unless-stopped \
  dashboard-banco-horas:latest

# 6. Ver logs
docker logs -f awesome_hermann
```

---

## ✅ Checklist de Atualização

- [ ] Backup de dados antigos (se houver)
- [ ] Container antigo parado: `docker stop awesome_hermann`
- [ ] Container antigo removido: `docker rm awesome_hermann`
- [ ] Nova imagem construída: `docker build -t dashboard-banco-horas .`
- [ ] Volume criado: `docker volume create dashboard-data`
- [ ] Novo container iniciado na porta 8080
- [ ] Logs verificados: `docker logs awesome_hermann`
- [ ] Acesso testado: `http://localhost:8080`
- [ ] API funcionando: `curl http://localhost:8080/api/dashboard/latest`

---

## 🔍 Verificar se Está Tudo OK

```bash
# Ver container rodando
docker ps

# Ver logs em tempo real
docker logs -f awesome_hermann

# Testar API
curl http://localhost:8080/api/dashboard/latest

# Ver uso de recursos
docker stats awesome_hermann

# Entrar no container (se precisar)
docker exec -it awesome_hermann sh
```

---

## ⚠️ Diferenças da Versão Nova

### Antes (Nginx)
- ❌ Apenas frontend estático
- ❌ Sem backend
- ❌ Sem banco de dados
- ❌ Precisava fazer upload sempre

### Agora (Node.js + SQLite)
- ✅ Frontend + Backend completo
- ✅ Banco de dados persistente
- ✅ API REST
- ✅ Dados salvos automaticamente
- ✅ Todos veem os mesmos dados
- ✅ Health check automático

---

## 🌐 Acessar o Sistema

Depois de atualizar:
- **Local:** http://localhost:8080
- **Intranet:** http://IP_DO_SERVIDOR:8080

O sistema mostrará o IP automaticamente nos logs!

---

## 💾 Restaurar Dados Antigos (se tiver)

Se você tinha dados no container antigo:

```bash
# Depois de iniciar o novo container
docker cp ./backup.db awesome_hermann:/app/data/database.db

# Reiniciar para garantir
docker restart awesome_hermann
```

---

## 🔄 Atualizar Novamente no Futuro

Quando tiver uma nova versão:

```bash
# 1. Fazer backup
docker cp awesome_hermann:/app/data/database.db ./backup.db

# 2. Parar e remover
docker stop awesome_hermann && docker rm awesome_hermann

# 3. Reconstruir
docker build -t dashboard-banco-horas:latest . --no-cache

# 4. Iniciar
docker run -d \
  --name awesome_hermann \
  -p 8080:3000 \
  -v dashboard-data:/app/data \
  --restart unless-stopped \
  dashboard-banco-horas:latest

# Pronto!
```

---

## 🆘 Problemas?

### Porta já em uso
```bash
# Ver o que está usando a porta 8080
lsof -i :8080

# Ou mudar para outra porta
docker run -d --name awesome_hermann -p 8081:3000 ...
```

### Build falhou
```bash
# Limpar cache e tentar novamente
docker builder prune
docker build -t dashboard-banco-horas:latest . --no-cache
```

### Container não inicia
```bash
# Ver logs detalhados
docker logs awesome_hermann

# Ver inspeção completa
docker inspect awesome_hermann
```

---

## ✅ Pronto!

Depois de seguir esses passos, seu container estará atualizado com:
- ✅ Backend Node.js funcionando
- ✅ Banco de dados persistente
- ✅ API REST completa
- ✅ Mesma porta (8080)
- ✅ Mesmo nome (awesome_hermann)

**Acesse:** http://localhost:8080

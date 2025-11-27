# 🐳 Início Rápido - Docker

## ⚡ 3 Comandos para Subir

```bash
# 1. Construir e iniciar
docker-compose up -d

# 2. Ver logs
docker-compose logs -f

# 3. Acessar
# http://IP_DO_SERVIDOR:3000
```

---

## 📦 O que você precisa

- ✅ Docker instalado
- ✅ Docker Compose instalado
- ✅ Porta 3000 disponível

---

## 🚀 Comandos Principais

### Gerenciar o container

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Reiniciar
docker-compose restart

# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### Backup e Restauração

```bash
# Fazer backup
docker cp dashboard:/app/data/database.db ./backup.db

# Restaurar backup
docker-compose down
docker cp ./backup.db dashboard:/app/data/database.db
docker-compose up -d
```

---

## 🔧 Resolver Problemas Comuns

### Container não inicia

```bash
docker-compose logs dashboard
docker-compose down -v
docker-compose up -d
```

### Porta já em uso

Edite `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Mude 8080 para outra porta
```

### Reconstruir do zero

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Verificar se está funcionando

```bash
# Ver status do container
docker ps | grep dashboard

# Testar API
curl http://localhost:3000/api/dashboard/latest

# Ver uso de recursos
docker stats dashboard
```

---

## 🌐 Acessar de outros computadores

1. Descubra o IP do servidor:
```bash
# Linux/Mac
hostname -I | awk '{print $1}'

# Windows
ipconfig
```

2. Usuários acessam:
```
http://IP_DO_SERVIDOR:3000
```

---

## 📋 Checklist de Deploy

- [ ] Docker instalado: `docker --version`
- [ ] Docker Compose instalado: `docker-compose --version`
- [ ] Porta 3000 livre: `netstat -tulpn | grep 3000`
- [ ] Construir: `docker-compose build`
- [ ] Iniciar: `docker-compose up -d`
- [ ] Verificar: `docker-compose ps`
- [ ] Testar: Abrir `http://localhost:3000` no navegador
- [ ] Configurar firewall (se necessário)
- [ ] Compartilhar IP com usuários

---

## 🎯 Vantagens

- ✅ Fácil de instalar e gerenciar
- ✅ Dados persistem automaticamente
- ✅ Reinicia sozinho se cair
- ✅ Isolado do resto do sistema
- ✅ Mesma configuração em qualquer servidor

---

## 📞 Precisa de Mais Ajuda?

- Guia completo: [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md)
- Deploy tradicional: [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md)
- FAQ: [FAQ-INTRANET.md](FAQ-INTRANET.md)

---

✅ **Pronto!** Em menos de 1 minuto seu dashboard está no ar!

# 🌐 Guia de Deploy em Servidor de Intranet

## ✅ Requisitos do Servidor

- **Sistema Operacional**: Windows Server, Linux, ou macOS
- **Node.js**: Versão 14 ou superior
- **Porta**: 3000 disponível (ou configurar outra)
- **Rede**: Servidor deve estar na mesma rede dos usuários

---

## 🚀 Instalação no Servidor

### 1. Copiar os arquivos para o servidor

Copie toda a pasta `DashboardEnge` para o servidor, por exemplo:
- Windows: `C:\inetpub\DashboardEnge`
- Linux: `/var/www/DashboardEnge`

### 2. Instalar dependências

```bash
cd /caminho/para/DashboardEnge
npm install
```

### 3. Iniciar o servidor

```bash
npm start
```

O servidor mostrará o IP da intranet automaticamente:

```
╔═══════════════════════════════════════════════╗
║   🚀 Servidor rodando!                        ║
║                                               ║
║   📍 Local:    http://localhost:3000          ║
║   🌐 Intranet: http://192.168.1.100:3000      ║
║                                               ║
║   📊 Dashboard disponível na rede local       ║
║   🔌 API: /api/dashboard                      ║
╚═══════════════════════════════════════════════╝
```

---

## 🔧 Configuração para Iniciar Automaticamente

### No Windows Server

#### Opção 1: PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
cd C:\inetpub\DashboardEnge
pm2 start server/server.js --name dashboard

# Salvar configuração
pm2 save

# Configurar para iniciar com o Windows
pm2 startup
```

#### Opção 2: NSSM (Windows Service)

```bash
# Baixar NSSM de https://nssm.cc/download
# Instalar como serviço
nssm install Dashboard "C:\Program Files\nodejs\node.exe" "C:\inetpub\DashboardEnge\server\server.js"
nssm set Dashboard AppDirectory "C:\inetpub\DashboardEnge"
nssm start Dashboard
```

### No Linux Server

#### Usando systemd

Criar arquivo `/etc/systemd/system/dashboard.service`:

```ini
[Unit]
Description=Dashboard de Banco de Horas
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/DashboardEnge
ExecStart=/usr/bin/node server/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Depois:

```bash
sudo systemctl daemon-reload
sudo systemctl enable dashboard
sudo systemctl start dashboard
sudo systemctl status dashboard
```

---

## 🔒 Configuração de Firewall

### Windows Server

```powershell
# Abrir porta 3000 no firewall
New-NetFirewallRule -DisplayName "Dashboard Banco de Horas" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Linux

```bash
# UFW
sudo ufw allow 3000/tcp

# Firewalld
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## 🌐 Acesso pelos Usuários

Os usuários da rede podem acessar usando o IP do servidor:

```
http://IP_DO_SERVIDOR:3000
```

Exemplo:
```
http://192.168.1.100:3000
```

### Criar um atalho amigável (Opcional)

#### Configurar DNS interno
No seu servidor DNS da intranet, adicione:
```
dashboard.empresa.local  →  192.168.1.100
```

Usuários acessam: `http://dashboard.empresa.local:3000`

---

## ⚙️ Configurações Importantes

### Mudar a porta padrão (3000)

Edite `server/server.js`:
```javascript
const PORT = process.env.PORT || 8080;  // Altere para a porta desejada
```

Ou use variável de ambiente:
```bash
# Windows
set PORT=8080 && npm start

# Linux/Mac
PORT=8080 npm start
```

### Backup do banco de dados

O arquivo `database.db` contém todos os dados. Faça backup regularmente:

**Windows:**
```batch
copy C:\inetpub\DashboardEnge\database.db C:\Backups\dashboard_%date%.db
```

**Linux:**
```bash
cp /var/www/DashboardEnge/database.db /backups/dashboard_$(date +%Y%m%d).db
```

---

## 📊 Monitoramento

### Ver logs com PM2

```bash
pm2 logs dashboard
pm2 monit
```

### Ver status do serviço

**Windows:**
```bash
pm2 status
# ou
sc query Dashboard
```

**Linux:**
```bash
sudo systemctl status dashboard
journalctl -u dashboard -f
```

---

## 🔄 Atualização

1. Parar o servidor:
```bash
pm2 stop dashboard
# ou
sudo systemctl stop dashboard
```

2. Atualizar arquivos (copiar novos arquivos)

3. Instalar dependências (se houver):
```bash
npm install
```

4. Reiniciar:
```bash
pm2 restart dashboard
# ou
sudo systemctl start dashboard
```

---

## ⚠️ Troubleshooting

### Problema: Usuários não conseguem acessar

**Solução:**
1. Verificar se o servidor está rodando: `pm2 status` ou `netstat -an | grep 3000`
2. Verificar firewall do servidor
3. Testar do próprio servidor: `curl http://localhost:3000`
4. Verificar se está escutando em `0.0.0.0` (todas interfaces)

### Problema: Banco de dados corrompido

**Solução:**
```bash
# Restaurar backup
cp /backups/database_20251127.db database.db

# Ou limpar e recomeçar
rm database.db
npm start
```

### Problema: Erro de permissão (Linux)

**Solução:**
```bash
sudo chown -R www-data:www-data /var/www/DashboardEnge
sudo chmod -R 755 /var/www/DashboardEnge
```

---

## 📱 Acesso via dispositivos móveis

O dashboard é responsivo e funciona em tablets e smartphones. Usuários podem acessar:

```
http://IP_DO_SERVIDOR:3000
```

---

## 🔐 Segurança (Opcional)

### Adicionar autenticação básica

Instalar dependência:
```bash
npm install express-basic-auth
```

Editar `server/server.js`:
```javascript
const basicAuth = require('express-basic-auth');

app.use(basicAuth({
    users: { 'admin': 'senha123' },
    challenge: true
}));
```

### HTTPS (Recomendado para produção)

Se você tem certificado SSL:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(443);
```

---

## 📞 Suporte

### Verificar versão do Node.js
```bash
node --version
```

### Reinstalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Logs detalhados
```bash
NODE_ENV=development npm start
```

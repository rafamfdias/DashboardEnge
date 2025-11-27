# ✅ Checklist de Deploy - Servidor de Intranet

## 📋 Pré-Deploy (Preparação)

- [ ] Node.js instalado no servidor (v14+)
- [ ] Porta 3000 disponível (ou escolher outra)
- [ ] Acesso administrativo ao servidor
- [ ] Pasta de destino definida

---

## 🚀 Instalação no Servidor

### Passo 1: Copiar Arquivos
- [ ] Copiar toda a pasta `DashboardEnge` para o servidor
- [ ] Verificar que todos os arquivos foram copiados

### Passo 2: Instalar Dependências
```bash
cd /caminho/DashboardEnge
npm install
```
- [ ] Comando executado sem erros
- [ ] Pasta `node_modules` criada

### Passo 3: Testar Inicialização
```bash
npm start
```
- [ ] Servidor iniciou sem erros
- [ ] IP da intranet exibido no console
- [ ] Anotar o IP: `http://_______________:3000`

### Passo 4: Testar Acesso Local
- [ ] Abrir navegador no próprio servidor
- [ ] Acessar `http://localhost:3000`
- [ ] Dashboard carregou corretamente

---

## 🔒 Configuração de Firewall

### Windows Server
```powershell
New-NetFirewallRule -DisplayName "Dashboard" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```
- [ ] Regra de firewall criada

### Linux
```bash
sudo ufw allow 3000/tcp
```
- [ ] Firewall configurado

---

## 🌐 Teste de Acesso pela Rede

- [ ] Em outro computador da rede, acessar: `http://IP_SERVIDOR:3000`
- [ ] Dashboard carregou
- [ ] Fazer upload de planilha teste
- [ ] Dados foram salvos
- [ ] Atualizar página - dados persistiram
- [ ] Acessar de outro computador - mesmos dados aparecem

---

## ⚙️ Configurar Serviço (Iniciar Automaticamente)

### Opção 1: PM2 (Recomendado)
```bash
npm install -g pm2
cd /caminho/DashboardEnge
pm2 start server/server.js --name dashboard
pm2 save
pm2 startup
```
- [ ] PM2 instalado
- [ ] Serviço criado
- [ ] Configurado para iniciar com sistema
- [ ] Testar: `pm2 status`

### Opção 2: Windows Service (NSSM)
- [ ] NSSM baixado e instalado
- [ ] Serviço criado
- [ ] Serviço iniciado
- [ ] Testar: `sc query Dashboard`

### Opção 3: Linux Systemd
- [ ] Arquivo `.service` criado em `/etc/systemd/system/`
- [ ] Serviço habilitado: `sudo systemctl enable dashboard`
- [ ] Serviço iniciado: `sudo systemctl start dashboard`
- [ ] Verificar status: `sudo systemctl status dashboard`

---

## 📊 Configuração de Backup Automático

### Backup Diário do Banco de Dados

**Windows (Task Scheduler):**
- [ ] Criar tarefa agendada
- [ ] Script: `copy C:\caminho\database.db C:\Backups\dashboard_%date%.db`
- [ ] Testar execução manual

**Linux (Cron):**
- [ ] Adicionar cron: `0 2 * * * cp /caminho/database.db /backups/dashboard_$(date +\%Y\%m\%d).db`
- [ ] Testar: `sudo crontab -e`

---

## 👥 Comunicar aos Usuários

- [ ] Enviar email/comunicado com o link de acesso
- [ ] Criar atalho na área de trabalho (opcional)
- [ ] Adicionar aos favoritos/intranet da empresa

**Template de comunicado:**
```
📊 Novo Dashboard de Banco de Horas disponível!

🌐 Acesso: http://IP_SERVIDOR:3000

✅ Funcionalidades:
- Visualização de saldo de horas
- Gráficos interativos
- Busca por funcionário
- Dados sempre atualizados

📝 Não precisa fazer upload toda vez, os dados já estão salvos!
```

---

## 🔍 Verificação Final

- [ ] Servidor está rodando
- [ ] Acesso local funciona
- [ ] Acesso pela rede funciona
- [ ] Firewall configurado
- [ ] Serviço configurado para iniciar automaticamente
- [ ] Backup configurado
- [ ] Usuários comunicados

---

## 📞 Pós-Deploy

### Informações para documentar:

- **IP do Servidor:** `_______________________`
- **Porta:** `_______________________`
- **URL de Acesso:** `_______________________`
- **Localização dos arquivos:** `_______________________`
- **Localização do backup:** `_______________________`
- **Data de deploy:** `_______________________`

### Comandos úteis:

**Ver logs:**
```bash
pm2 logs dashboard          # Com PM2
journalctl -u dashboard -f  # Linux systemd
```

**Reiniciar:**
```bash
pm2 restart dashboard       # Com PM2
sudo systemctl restart dashboard  # Linux
```

**Parar:**
```bash
pm2 stop dashboard          # Com PM2
sudo systemctl stop dashboard    # Linux
```

---

## ✅ Deploy Concluído!

Se todos os itens foram marcados, o sistema está pronto para uso! 🎉

Para suporte adicional, consulte: [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md)

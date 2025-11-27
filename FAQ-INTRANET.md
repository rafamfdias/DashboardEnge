# ❓ FAQ - Perguntas Frequentes sobre Intranet

## 🌐 Funcionamento em Intranet

### P: O sistema funciona em servidor de intranet?
**R:** ✅ Sim! O sistema foi desenvolvido para funcionar perfeitamente em servidores de intranet. Não precisa de internet externa.

### P: Preciso configurar algo especial para funcionar na intranet?
**R:** ✅ Não! O sistema detecta automaticamente o IP do servidor. Basta instalar e iniciar.

### P: Todos os computadores da rede verão os mesmos dados?
**R:** ✅ Sim! Os dados ficam salvos no banco de dados do servidor. Qualquer pessoa que acessar verá as mesmas informações.

### P: Preciso fazer upload da planilha toda vez?
**R:** ❌ Não! Você faz o upload uma vez e os dados ficam permanentemente salvos. Todos que acessarem verão os dados sem precisar fazer upload.

---

## 🔧 Instalação e Configuração

### P: Quais são os requisitos do servidor?
**R:** 
- Node.js versão 14 ou superior
- Porta 3000 disponível (ou configurar outra)
- 100MB de espaço em disco
- Windows Server, Linux ou macOS

### P: Como instalo no servidor?
**R:**
```bash
1. Copiar pasta DashboardEnge para o servidor
2. npm install
3. npm start
```
Veja detalhes em: [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md)

### P: Como faço para o servidor iniciar automaticamente?
**R:** Use PM2:
```bash
npm install -g pm2
pm2 start server/server.js --name dashboard
pm2 save
pm2 startup
```

### P: Posso mudar a porta padrão (3000)?
**R:** ✅ Sim! Edite `server/server.js` e altere:
```javascript
const PORT = process.env.PORT || 8080;
```

---

## 👥 Acesso de Usuários

### P: Como os usuários acessam o sistema?
**R:** Através do navegador, usando o IP do servidor:
```
http://IP_DO_SERVIDOR:3000
```
O IP é mostrado quando você inicia o servidor.

### P: Preciso criar usuários e senhas?
**R:** ❌ Não por padrão. Todos da rede podem acessar livremente. Se quiser adicionar autenticação, veja [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md#-segurança-opcional)

### P: Funciona em celular/tablet?
**R:** ✅ Sim! O dashboard é responsivo e funciona em qualquer dispositivo conectado à rede.

### P: Quantas pessoas podem acessar ao mesmo tempo?
**R:** ✅ Não há limite prático. O sistema suporta múltiplos acessos simultâneos.

---

## 💾 Dados e Backup

### P: Onde os dados são armazenados?
**R:** Em um arquivo SQLite chamado `database.db` na pasta do projeto.

### P: Como faço backup dos dados?
**R:** Copie o arquivo `database.db`:
```bash
# Windows
copy database.db C:\Backups\dashboard_backup.db

# Linux/Mac
cp database.db /backups/dashboard_backup.db
```

### P: Os dados ficam salvos mesmo se desligar o servidor?
**R:** ✅ Sim! Os dados estão no banco de dados e persistem mesmo após reiniciar o servidor.

### P: Como restauro um backup?
**R:** 
```bash
# Parar o servidor
pm2 stop dashboard

# Substituir o arquivo
copy backup.db database.db

# Reiniciar
pm2 start dashboard
```

### P: Posso ver histórico de planilhas antigas?
**R:** ✅ Sim! O sistema mantém histórico. Use a API:
```bash
curl http://localhost:3000/api/dashboard/history
```

---

## 🔒 Segurança e Firewall

### P: Preciso liberar algo no firewall?
**R:** ✅ Sim, libere a porta 3000 (ou a que você configurou):

**Windows:**
```powershell
New-NetFirewallRule -DisplayName "Dashboard" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

**Linux:**
```bash
sudo ufw allow 3000/tcp
```

### P: Como adiciono senha de acesso?
**R:** Instale `express-basic-auth` e configure no `server.js`. Detalhes em [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md#-segurança-opcional)

### P: Os dados estão seguros?
**R:** ✅ Os dados ficam apenas no servidor da intranet, não saem para internet. Para mais segurança:
- Configure HTTPS
- Adicione autenticação
- Restrinja acesso por IP
- Faça backups regulares

---

## 🔄 Atualização e Manutenção

### P: Como atualizo o sistema?
**R:**
```bash
# Parar servidor
pm2 stop dashboard

# Copiar novos arquivos
# (substituir arquivos antigos)

# Reinstalar dependências se necessário
npm install

# Reiniciar
pm2 restart dashboard
```

### P: Como vejo os logs?
**R:**
```bash
# Com PM2
pm2 logs dashboard

# Linux systemd
sudo journalctl -u dashboard -f

# Windows
# Ver logs no Event Viewer ou pasta do projeto
```

### P: O que fazer se o servidor parar de responder?
**R:**
```bash
# Verificar status
pm2 status

# Reiniciar
pm2 restart dashboard

# Ver logs de erro
pm2 logs dashboard --err
```

---

## 🐛 Problemas Comuns

### P: Erro "EADDRINUSE: address already in use"
**R:** A porta 3000 já está em uso. Mude a porta ou pare o processo:
```bash
# Ver o que está usando a porta
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Linux/Mac

# Matar processo
kill -9 PID
```

### P: Usuários não conseguem acessar
**R:** Verifique:
1. ✅ Servidor está rodando: `pm2 status`
2. ✅ Firewall liberou porta 3000
3. ✅ Servidor e computadores na mesma rede
4. ✅ Use o IP correto (mostrado ao iniciar)

### P: "Cannot find module 'express'"
**R:** Instale as dependências:
```bash
npm install
```

### P: Dados não estão sendo salvos
**R:** Verifique:
1. ✅ Permissões de escrita na pasta
2. ✅ Espaço em disco disponível
3. ✅ Ver logs: `pm2 logs dashboard`

### P: Upload de planilha falha
**R:** 
1. ✅ Verifique formato da planilha (cada aba = 1 funcionário)
2. ✅ Veja console do navegador (F12) para erros
3. ✅ Verifique logs do servidor

---

## 📊 Performance

### P: Quantos funcionários o sistema suporta?
**R:** ✅ Testado com milhares de funcionários sem problemas. SQLite suporta até centenas de milhares de registros.

### P: O sistema fica lento com muitos dados?
**R:** ❌ Não. O banco tem índices otimizados. Mesmo com muitos uploads históricos, mantém boa performance.

### P: Posso deletar uploads antigos?
**R:** ✅ Sim! Use a API:
```bash
# Listar uploads
curl http://localhost:3000/api/dashboard/history

# Deletar específico
curl -X DELETE http://localhost:3000/api/dashboard/ID
```

---

## 🌐 Rede e Conectividade

### P: Funciona em VPN?
**R:** ✅ Sim, desde que os computadores estejam na mesma rede/VPN.

### P: Posso acessar de casa via VPN da empresa?
**R:** ✅ Sim, se a VPN permitir acesso à rede interna e você usar o IP interno do servidor.

### P: Funciona em VLAN separada?
**R:** ✅ Sim, desde que as VLANs tenham rota entre elas ou firewall permita o tráfego.

### P: Preciso de domínio/DNS?
**R:** ❌ Não é necessário. Use o IP direto. Mas você pode configurar um DNS interno amigável se quiser.

---

## 🎯 Casos de Uso

### P: Posso ter múltiplos dashboards (um por departamento)?
**R:** ✅ Sim! Instale em pastas diferentes com portas diferentes:
- Dashboard RH: porta 3000
- Dashboard TI: porta 3001
- Dashboard Vendas: porta 3002

### P: Posso integrar com outros sistemas?
**R:** ✅ Sim! Use a API REST:
```
GET  /api/dashboard/latest    - Dados mais recentes
POST /api/dashboard/upload    - Enviar dados
GET  /api/dashboard/history   - Histórico
```

### P: Posso automatizar o upload de planilhas?
**R:** ✅ Sim! Use a API com scripts:
```bash
curl -X POST http://localhost:3000/api/dashboard/upload \
  -H "Content-Type: application/json" \
  -d @dados.json
```

---

## 📞 Suporte

### P: Onde encontro mais documentação?
**R:** 
- [README.md](README.md) - Visão geral
- [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md) - Deploy completo
- [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) - Passo a passo
- [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Início rápido

### P: Como reporto problemas?
**R:** 
1. Verifique os logs: `pm2 logs dashboard`
2. Teste no próprio servidor: `curl http://localhost:3000`
3. Verifique este FAQ
4. Documente o erro e contexto

---

✅ **Dica Final:** O sistema foi projetado para ser simples e robusto. Na maioria dos casos, basta copiar, instalar e rodar!

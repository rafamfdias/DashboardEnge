# 🚀 Início Rápido

## Primeira vez usando o projeto?

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o servidor
```bash
npm start
```

### 3. Acessar o dashboard
Abra o navegador em: http://localhost:3000

---

## 📝 Como usar

1. **Faça upload da planilha Excel** (arraste ou clique)
2. Os dados são salvos automaticamente no banco de dados
3. **Qualquer pessoa que acessar o site verá os mesmos dados**
4. Não é necessário fazer upload novamente a cada acesso

---

## 🛑 Parar o servidor
Pressione `Ctrl + C` no terminal

---

## 🔄 Modo Desenvolvimento (com auto-reload)
```bash
npm run dev
```

---

## 📂 Estrutura
```
DashboardEnge/
├── server/           # Backend (Node.js + Express)
├── database.db       # Banco de dados SQLite (criado automaticamente)
├── index.html        # Frontend
├── css/              # Estilos
└── js/               # Scripts
```

---

## ⚙️ Configuração

### Mudar a porta do servidor
Edite `server/server.js` e altere:
```javascript
const PORT = process.env.PORT || 3000;  // Mude 3000 para outra porta
```

### Limpar banco de dados
Simplesmente delete o arquivo `database.db` e reinicie o servidor

---

## 🌐 Acessar de outros computadores na rede

✅ **O sistema detecta automaticamente o IP da intranet!**

Quando você iniciar o servidor, ele mostrará:

```
╔═══════════════════════════════════════════════╗
║   🚀 Servidor rodando!                        ║
║                                               ║
║   📍 Local:    http://localhost:3000          ║
║   🌐 Intranet: http://192.168.1.100:3000      ║
║                                               ║
║   📊 Dashboard disponível na rede local       ║
╚═══════════════════════════════════════════════╝
```

**Outros computadores acessam usando o link "Intranet" mostrado acima.**

### 🏢 Deploy em Servidor de Intranet

Para colocar em servidor de produção da empresa, veja:
- 📖 [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md) - Guia completo
- ✅ [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) - Passo a passo

---

## 📊 Testando a API

### Buscar último upload
```bash
curl http://localhost:3000/api/dashboard/latest
```

### Ver histórico
```bash
curl http://localhost:3000/api/dashboard/history
```

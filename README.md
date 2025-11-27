# Dashboard de Banco de Horas

Ferramenta web para visualizar e analisar o banco de horas dos funcionários através de planilhas Excel, com banco de dados persistente.

## ✨ Funcionalidades

- 📊 Upload de planilhas Excel (.xlsx, .xls)
- 💾 **Armazenamento persistente em banco de dados SQLite**
- 📈 Cards com resumo de total de funcionários, saldo geral, horas positivas e negativas
- 📉 Gráficos de distribuição de horas por funcionário, evolução mensal, status e top 10 maiores saldos
- 🔍 Tabela com busca por nome e filtros por status
- 🔗 Compartilhamento de dados via link
- 🕒 Histórico de uploads anteriores

## 🚀 Como Instalar

### 🐳 Instalação com Docker (Recomendado)

**Modo mais rápido e fácil:**

```bash
# Construir e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

**Pronto!** Acesse `http://localhost:3000`

✅ Dados persistem automaticamente  
✅ Reinicia sozinho se cair  
✅ Funciona em qualquer servidor  

---

### 📦 Instalação Tradicional (sem Docker)

#### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

#### Passos

1. Clone ou baixe este repositório

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Abra o navegador e acesse:
```
http://localhost:3000
```

#### Modo de Desenvolvimento (com auto-reload)
```bash
npm run dev
```

## Como preparar a planilha

**Cada aba = 1 funcionário**

Use o primeiro nome do funcionário como nome da aba (ex: JOÃO, MARIA).

### Colunas obrigatórias

| Coluna | Conteúdo |
|--------|----------|
| MAT | Matrícula |
| NOME | Nome completo |
| CRÉDITO | Horas positivas (HH:MM:SS) |
| DÉBITO | Horas negativas (HH:MM:SS) |
| MÊS | Período (MÊS 05/2025) |

### Linhas de totalização

No final de cada aba, adicione:
- Linha POSITIVO: total de créditos
- Linha NEGATIVO: total de débitos
- Linha TOTAL: saldo final

### Abas ignoradas

O sistema ignora automaticamente: SINDICATO, RELATÓRIO, MODELO, TEMPLATE, CONFIG, DADOS

## 📂 Estrutura do Projeto

```
DashboardEnge/
├── index.html              # Interface principal
├── package.json            # Dependências do projeto
├── css/
│   └── styles.css         # Estilos
├── js/
│   └── script.js          # Lógica do frontend + integração com API
├── server/
│   ├── server.js          # Servidor Express + API REST
│   └── database.js        # Configuração do SQLite
├── database.db            # Banco de dados (criado automaticamente)
└── README.md
```

## 🗄️ API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/dashboard/latest` | Buscar último upload |
| `POST` | `/api/dashboard/upload` | Salvar novo upload |
| `GET` | `/api/dashboard/history` | Histórico de uploads |
| `GET` | `/api/dashboard/:id` | Buscar upload específico |
| `DELETE` | `/api/dashboard/:id` | Deletar upload |

## 💻 Como usar

1. Inicie o servidor com `npm start`
2. Acesse `http://localhost:3000` no navegador
3. Arraste a planilha ou clique para selecionar
4. Os dados são automaticamente salvos no banco de dados
5. **Todos que acessarem o site verão os dados mais recentes sem precisar fazer upload novamente**
6. Use busca e filtros para encontrar funcionários
7. Clique no botão de compartilhamento para gerar link com os dados

## 🔒 Banco de Dados

- **Tipo**: SQLite
- **Arquivo**: `database.db` (criado automaticamente)
- **Tabelas**:
  - `uploads`: Histórico de planilhas enviadas
  - `employees`: Dados detalhados de cada funcionário

## 🛠️ Tecnologias

### Frontend
- HTML5, CSS3, JavaScript
- Chart.js (gráficos)
- SheetJS (leitura de Excel)

### Backend
- Node.js + Express
- SQLite3
- CORS (para comunicação frontend/backend)

## 🌐 Deploy em Servidor de Intranet

✅ **O projeto está 100% pronto para funcionar em servidor de intranet!**

### 🐳 Deploy com Docker (Recomendado)

**Modo mais fácil e rápido:**

```bash
# Construir e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Acessar: http://IP_DO_SERVIDOR:3000
```

**Vantagens:**
- ✅ Instalação em 1 minuto
- ✅ Dados persistem automaticamente
- ✅ Reinicia sozinho se cair
- ✅ Funciona em qualquer servidor com Docker

**📖 Guias Docker:**
- [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) - Início rápido
- [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md) - Guia completo

### 📦 Deploy Tradicional (sem Docker)

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar
npm start
```

**📖 Guias tradicionais:**
- [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md) - Guia completo
- [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) - Passo a passo

### Principais características:

- ✅ Detecta automaticamente o IP do servidor
- ✅ Aceita conexões de todos os computadores da rede
- ✅ Funciona em Windows Server, Linux ou qualquer servidor
- ✅ Não precisa de configuração de internet externa

### Deploy em Produção

Para colocar em produção com PM2:

```bash
npm install -g pm2
pm2 start server/server.js --name dashboard
pm2 save
pm2 startup  # Iniciar automaticamente com o sistema
```

## 📝 Observações

- Os dados são persistidos no banco de dados SQLite
- Ao fazer upload de uma nova planilha, ela é salva como um novo registro
- O dashboard sempre mostra o upload mais recente
- É possível acessar uploads anteriores através da API

---

## 📚 Documentação Completa

### 🚀 Início Rápido
- [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) - Deploy com Docker em 2 minutos
- [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Deploy tradicional

### 🐳 Docker
- [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md) - Guia completo Docker
- `docker-manage.sh` - Script de gerenciamento Docker

### 📦 Deploy Tradicional
- [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md) - Guia completo para servidor
- [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) - Checklist passo a passo
- `manage.sh` - Script de gerenciamento

### 🌐 Geral
- [GUIA-DEPLOY.md](GUIA-DEPLOY.md) - Comparação de métodos de deploy
- [FAQ-INTRANET.md](FAQ-INTRANET.md) - Perguntas frequentes
- [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md) - Referência de comandos
- [INDICE-DOCUMENTACAO.md](INDICE-DOCUMENTACAO.md) - Índice completo

---

## 🎯 Links Rápidos

**Primeira vez?** → [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md)  
**Dúvidas?** → [FAQ-INTRANET.md](FAQ-INTRANET.md)  
**Qual método usar?** → [GUIA-DEPLOY.md](GUIA-DEPLOY.md)  
**Referência de comandos** → [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md)

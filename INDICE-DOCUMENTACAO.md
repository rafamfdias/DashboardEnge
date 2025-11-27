# 📚 Índice da Documentação

Guia completo de toda a documentação disponível do Dashboard de Banco de Horas.

---

## 🎯 Por onde começar?

### Você quer:
- **Instalar rapidamente?** → [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md)
- **Entender o projeto?** → [README.md](README.md)
- **Decidir qual método usar?** → [GUIA-DEPLOY.md](GUIA-DEPLOY.md)

---

## 📖 Documentação por Categoria

### 🚀 Início Rápido
| Documento | Descrição | Tempo |
|-----------|-----------|-------|
| [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) | Início rápido com Docker | 2 min |
| [INICIO-RAPIDO.md](INICIO-RAPIDO.md) | Início rápido tradicional | 5 min |
| [README.md](README.md) | Visão geral do projeto | 3 min |

### 🐳 Deploy com Docker
| Documento | Descrição | Nível |
|-----------|-----------|-------|
| [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) | Comandos essenciais Docker | Básico |
| [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md) | Guia completo Docker | Avançado |
| `docker-compose.yml` | Configuração do compose | Config |
| `docker-compose.prod.yml` | Configuração produção | Config |
| `Dockerfile` | Build da imagem | Config |
| `.dockerignore` | Arquivos ignorados no build | Config |
| `docker-manage.sh` | Script de gerenciamento | Tool |

### 📦 Deploy Tradicional
| Documento | Descrição | Nível |
|-----------|-----------|-------|
| [INICIO-RAPIDO.md](INICIO-RAPIDO.md) | Comandos básicos | Básico |
| [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md) | Guia completo intranet | Avançado |
| [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) | Checklist passo a passo | Prático |
| `manage.sh` | Script de gerenciamento | Tool |

### 🌐 Geral
| Documento | Descrição | Tipo |
|-----------|-----------|------|
| [GUIA-DEPLOY.md](GUIA-DEPLOY.md) | Comparação de métodos | Decisão |
| [FAQ-INTRANET.md](FAQ-INTRANET.md) | Perguntas frequentes | Suporte |
| [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md) | Referência de comandos | Referência |

---

## 🎓 Roteiros de Leitura

### Para Iniciantes
1. [README.md](README.md) - Entenda o que é o projeto
2. [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) - Instale em 2 minutos
3. [FAQ-INTRANET.md](FAQ-INTRANET.md) - Tire dúvidas comuns

### Para Administradores
1. [GUIA-DEPLOY.md](GUIA-DEPLOY.md) - Escolha o melhor método
2. [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md) ou [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md)
3. [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) - Execute o deploy
4. [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md) - Mantenha o sistema

### Para DevOps
1. [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md) - Deploy com Docker
2. `docker-compose.yml` e `Dockerfile` - Configurações
3. [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md) - Automação
4. `docker-manage.sh` - Scripts

---

## 📋 Documentos por Tarefa

### Instalação
- Docker: [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md)
- Tradicional: [INICIO-RAPIDO.md](INICIO-RAPIDO.md)
- Decisão: [GUIA-DEPLOY.md](GUIA-DEPLOY.md)

### Configuração
- Servidor: [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md)
- Docker: [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md)
- Rede: [FAQ-INTRANET.md](FAQ-INTRANET.md#-rede-e-conectividade)

### Operação
- Comandos: [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md)
- Scripts: `docker-manage.sh` ou `manage.sh`
- Monitoramento: [DEPLOY-DOCKER.md#monitoramento](DEPLOY-DOCKER.md#-monitoramento)

### Manutenção
- Backup: [DEPLOY-DOCKER.md#backup](DEPLOY-DOCKER.md#-persistência-de-dados)
- Atualização: [DEPLOY-DOCKER.md#atualização](DEPLOY-DOCKER.md#-atualização)
- Troubleshooting: [FAQ-INTRANET.md](FAQ-INTRANET.md#-problemas-comuns)

### Resolução de Problemas
- FAQ: [FAQ-INTRANET.md](FAQ-INTRANET.md)
- Troubleshooting Docker: [DEPLOY-DOCKER.md#troubleshooting](DEPLOY-DOCKER.md#-troubleshooting)
- Comandos diagnóstico: [COMANDOS-UTEIS.md#-diagnóstico](COMANDOS-UTEIS.md#-diagnóstico)

---

## 🔍 Busca Rápida

### Como fazer...

**...deploy?**
- Com Docker: [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md)
- Sem Docker: [INICIO-RAPIDO.md](INICIO-RAPIDO.md)
- Comparação: [GUIA-DEPLOY.md](GUIA-DEPLOY.md)

**...backup?**
- Docker: [DEPLOY-DOCKER.md#backup](DEPLOY-DOCKER.md#-persistência-de-dados)
- Tradicional: [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md#-configuração-de-backup-automático)
- Comandos: [COMANDOS-UTEIS.md#backup-e-restore](COMANDOS-UTEIS.md#backup-e-restore)

**...atualizar?**
- Docker: [DEPLOY-DOCKER.md#atualização](DEPLOY-DOCKER.md#-atualização)
- Tradicional: [DEPLOY-INTRANET.md#atualização](DEPLOY-INTRANET.md#-atualização)

**...monitorar?**
- Docker: [DEPLOY-DOCKER.md#monitoramento](DEPLOY-DOCKER.md#-monitoramento)
- Comandos: [COMANDOS-UTEIS.md#monitoramento](COMANDOS-UTEIS.md#-monitoramento)

**...resolver problemas?**
- FAQ: [FAQ-INTRANET.md](FAQ-INTRANET.md)
- Troubleshooting: [DEPLOY-DOCKER.md#troubleshooting](DEPLOY-DOCKER.md#-troubleshooting)
- Comandos: [COMANDOS-UTEIS.md#troubleshooting](COMANDOS-UTEIS.md#-troubleshooting)

---

## 📊 Matriz de Documentação

| Tarefa | Docker | Tradicional | Geral |
|--------|--------|-------------|-------|
| **Início Rápido** | [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) | [INICIO-RAPIDO.md](INICIO-RAPIDO.md) | [README.md](README.md) |
| **Deploy Completo** | [DEPLOY-DOCKER.md](DEPLOY-DOCKER.md) | [DEPLOY-INTRANET.md](DEPLOY-INTRANET.md) | [GUIA-DEPLOY.md](GUIA-DEPLOY.md) |
| **Checklist** | - | [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md) | - |
| **Scripts** | `docker-manage.sh` | `manage.sh` | - |
| **FAQ** | - | - | [FAQ-INTRANET.md](FAQ-INTRANET.md) |
| **Comandos** | [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md) | [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md) | [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md) |

---

## 📁 Estrutura de Arquivos

```
DashboardEnge/
├── 📖 Documentação Geral
│   ├── README.md                    # Visão geral
│   ├── INDICE-DOCUMENTACAO.md      # Este arquivo
│   ├── GUIA-DEPLOY.md              # Guia de decisão
│   ├── FAQ-INTRANET.md             # Perguntas frequentes
│   └── COMANDOS-UTEIS.md           # Referência de comandos
│
├── 🐳 Documentação Docker
│   ├── DOCKER-QUICKSTART.md        # Início rápido
│   ├── DEPLOY-DOCKER.md            # Guia completo
│   ├── docker-compose.yml          # Configuração base
│   ├── docker-compose.prod.yml     # Configuração produção
│   ├── Dockerfile                  # Build da imagem
│   ├── .dockerignore               # Arquivos ignorados
│   └── docker-manage.sh            # Script de gerenciamento
│
├── 📦 Documentação Tradicional
│   ├── INICIO-RAPIDO.md            # Início rápido
│   ├── DEPLOY-INTRANET.md          # Guia completo
│   ├── CHECKLIST-DEPLOY.md         # Checklist passo a passo
│   └── manage.sh                   # Script de gerenciamento
│
├── 🔧 Código Fonte
│   ├── server/                     # Backend
│   │   ├── server.js              # Servidor Express
│   │   └── database.js            # SQLite
│   ├── js/                        # Frontend
│   │   └── script.js              # Lógica principal
│   ├── css/                       # Estilos
│   │   └── styles.css
│   └── index.html                 # Interface
│
└── 📦 Configuração
    ├── package.json               # Dependências
    ├── .gitignore                 # Git ignore
    └── .dockerignore              # Docker ignore
```

---

## 🎯 Fluxograma de Decisão

```
Preciso instalar o Dashboard
         │
         ↓
    Tenho Docker?
    ╱           ╲
  SIM           NÃO
   │             │
   │             ↓
   │        Posso instalar?
   │        ╱           ╲
   │      SIM           NÃO
   │       │             │
   ↓       ↓             ↓
Docker   Instalar    Tradicional
   │      Docker         │
   │       │             │
   ↓       ↓             ↓
DOCKER-  DEPLOY-    DEPLOY-
QUICK    DOCKER     INTRANET
START                    
```

---

## 💡 Dicas de Navegação

### Atalhos de Teclado (GitHub)
- `t` - Buscar arquivo
- `/` - Buscar no repositório
- `b` - Ver blame
- `l` - Ir para linha

### Busca no Repositório
Use a busca do GitHub com termos como:
- `backup` - Encontrar informações sobre backup
- `docker` - Tudo sobre Docker
- `error` - Solução de erros
- `port` - Configuração de portas

---

## 🆕 Novidades

### Última Atualização: 27/11/2025

**Adicionado:**
- ✅ Suporte completo a Docker
- ✅ Scripts de gerenciamento
- ✅ Documentação Docker completa
- ✅ Guia de decisão de deploy

---

## 📞 Suporte

### Precisa de Ajuda?

1. **Leia primeiro:** [FAQ-INTRANET.md](FAQ-INTRANET.md)
2. **Problema específico:** Use busca no repositório
3. **Comandos:** [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md)

---

## ✅ Checklist de Documentação

Para garantir que você leu o necessário:

### Antes de Instalar
- [ ] Li o [README.md](README.md)
- [ ] Escolhi o método no [GUIA-DEPLOY.md](GUIA-DEPLOY.md)
- [ ] Li o guia de início rápido correspondente

### Durante Instalação
- [ ] Segui o guia passo a passo
- [ ] Executei os comandos corretamente
- [ ] Verifiquei que está funcionando

### Após Instalação
- [ ] Configurei backup
- [ ] Configurei acesso externo
- [ ] Li o [FAQ-INTRANET.md](FAQ-INTRANET.md)
- [ ] Salvei [COMANDOS-UTEIS.md](COMANDOS-UTEIS.md)

---

**📚 Mantenha esta documentação como referência!**

# Dockerfile otimizado para Dashboard de Banco de Horas
# Suporta Node.js + SQLite + persistência de dados

FROM node:18-alpine

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    python3 \
    make \
    g++

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar diretório para banco de dados com permissões corretas
RUN mkdir -p /app/data && \
    chmod 777 /app/data

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/dashboard/latest', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
CMD ["node", "server/server.js"]

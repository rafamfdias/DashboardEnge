# Dashboard de Banco de Horas

Ferramenta web para visualizar e analisar o banco de horas dos funcionários através de planilhas Excel.

## O que faz

- Upload de planilhas Excel (.xlsx, .xls)
- Cards com resumo de total de funcionários, saldo geral, horas positivas e negativas
- Gráficos de distribuição de horas por funcionário, evolução mensal, status e top 10 maiores saldos
- Tabela com busca por nome e filtros por status
- Compartilhamento de dados via link

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

## Como usar

1. Abra `index.html` no navegador
2. Arraste a planilha ou clique para selecionar
3. Pronto - o dashboard carrega automaticamente
4. Use busca e filtros para encontrar funcionários
5. Clique no botão de compartilhamento para gerar link com os dados

## Tecnologias

- HTML5, CSS3, JavaScript
- Chart.js (gráficos)
- SheetJS (leitura de Excel)

## Estrutura

```
DashboardEnge/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── README.md
```

## Privacidade

Todo processamento é feito localmente no navegador. Nenhum dado é enviado para fora.

# Roadmap — FinTrack

## Etapa 1 — Setup

- Criar projeto Next.js.
- Configurar Tailwind.
- Configurar Prisma.
- Configurar PostgreSQL.
- Configurar Vitest.
- Criar layout base.
- Criar documentação inicial.

## Etapa 2 — Banco

- Criar schema Prisma.
- Criar enums.
- Criar seed com usuário e dados de exemplo.
- Criar migration inicial.

## Etapa 3 — Autenticação

- Implementar login. ✅
- Implementar logout. ✅
- Proteger rotas internas. ✅
- Criar função para obter usuário atual. ✅

Observação: nesta etapa existe apenas acesso pelo usuário demo da seed. Cadastro
público fica fora do escopo por enquanto.

## Etapa 4 — Categorias

- Criar categorias. ✅
- Listar categorias. ✅
- Editar categorias. ✅
- Inativar categorias. ✅

Observação: categorias inativas continuam aparecendo na gestão de categorias,
mas não entram na lista padrão de opções para novas transações.

## Etapa 5 — Transações

- Criar receita. ✅
- Criar despesa. ✅
- Listar transações. ✅
- Filtrar por mês, ano, tipo e categoria. ✅
- Editar transação. ✅
- Excluir transação. ✅

Observação: valores são informados em reais na interface e persistidos como
centavos no banco.

## Etapa 6 — Dashboard

- Card de saldo. ✅
- Card de receitas. ✅
- Card de despesas. ✅
- Gráfico por categoria. ✅
- Gráfico receitas vs despesas. ✅
- Últimas transações. ✅
- Alerta de orçamento ultrapassado. ✅

Observação: o dashboard respeita mês/ano selecionados e filtra dados pelo
usuário autenticado.

## Etapa 7 — Orçamentos

- Criar orçamento mensal por categoria. ✅
- Mostrar gasto atual. ✅
- Mostrar progresso. ✅
- Alertar orçamento ultrapassado. ✅

## Etapa 8 — Metas

- Criar meta.
- Atualizar progresso.
- Exibir percentual.

## Etapa 9 — Polimento

- Responsividade.
- Estados vazios.
- Loading.
- Erros amigáveis.
- README completo.
- Deploy.

# Arquitetura inicial — FinTrack

## Organização

- `src/app`: rotas, páginas e layouts do App Router.
- `src/components`: componentes visuais reutilizáveis.
- `src/features`: módulos organizados pelos domínios do produto.
- `src/lib`: utilitários compartilhados e integrações de infraestrutura.
- `src/server`: autenticação, autorização, serviços e queries.
- `prisma`: schema, migrations e seed do banco PostgreSQL.
- `docs`: decisões e documentação técnica.

## Rotas planejadas

- `/`: apresentação inicial do projeto.
- `/login`: autenticação.
- `/dashboard`: visão financeira mensal.
- `/transactions`: gestão de receitas e despesas.
- `/categories`: gestão de categorias.
- `/budgets`: orçamentos mensais.
- `/goals`: metas financeiras.

As rotas `/login`, `/dashboard` e `/categories` já existem. O dashboard ainda é
uma tela protegida de placeholder; os cards e gráficos serão implementados nas
próximas etapas do MVP.

Rotas internas devem ficar dentro do grupo protegido do App Router e validar a
sessão no servidor antes de renderizar a página.

## Separação de responsabilidades

Componentes visuais não acessam o banco diretamente. Regras de negócio e
consultas ficam no servidor, enquanto schemas Zod validam entradas nas
fronteiras da aplicação.

Toda consulta futura a dados financeiros deverá usar o identificador obtido da
sessão no servidor e filtrar por `userId`.

## Autenticação

A autenticação atual usa o usuário demo criado pela seed:

- e-mail: `demo@fintrack.com`;
- senha: `demo123`.

O login valida entrada com Zod, compara a senha com `passwordHash` usando
`bcryptjs` e cria um cookie HTTP-only assinado por `AUTH_SECRET`. A função
server-side `getCurrentUser` retorna apenas `id`, `name` e `email`, sem expor
`passwordHash` ao frontend.

## Categorias

A feature de categorias fica dividida entre:

- `src/server/categories`: queries e actions server-side;
- `src/features/categories`: schemas Zod e componentes de formulário/listagem;
- `src/app/(protected)/categories`: rota protegida.

Todas as queries e mutations usam o usuário da sessão no servidor e filtram por
`userId`. Categorias podem ser criadas, listadas, editadas e inativadas. A
query `listActiveCategoriesForTransactionForm` retorna apenas categorias
`ACTIVE`, para que categorias inativas não apareçam como opção padrão ao criar
transações futuras.

## Valores monetários

Valores são persistidos como inteiros em centavos. A conversão para reais é
feita apenas para entrada e exibição na interface.

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

Somente a rota `/` faz parte da base inicial. As demais serão implementadas nas
próximas etapas do MVP.

## Separação de responsabilidades

Componentes visuais não acessam o banco diretamente. Regras de negócio e
consultas ficam no servidor, enquanto schemas Zod validam entradas nas
fronteiras da aplicação.

Toda consulta futura a dados financeiros deverá usar o identificador obtido da
sessão no servidor e filtrar por `userId`.

## Valores monetários

Valores são persistidos como inteiros em centavos. A conversão para reais é
feita apenas para entrada e exibição na interface.

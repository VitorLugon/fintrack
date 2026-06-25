# Modelo de Dados — FinTrack

O schema inicial está em `prisma/schema.prisma` e a carga demonstrativa em
`prisma/seed.ts`. A primeira migration deve ser criada após configurar uma
instância PostgreSQL.

## User

Representa o usuário do sistema.

Campos:

- `id`
- `name`
- `email`
- `passwordHash`
- `createdAt`
- `updatedAt`

Restrições:

- `email` é único;
- `passwordHash` armazena somente o hash da senha;
- a exclusão do usuário remove seus dados financeiros relacionados.

## Category

Representa uma categoria de receita ou despesa.

Campos:

- `id`
- `userId`
- `name`
- `type`
- `status`
- `color`
- `icon`
- `createdAt`
- `updatedAt`

Tipos: `INCOME` e `EXPENSE`.

Status: `ACTIVE` e `INACTIVE`.

Restrições:

- nome e tipo não podem se repetir para o mesmo usuário;
- consultas frequentes são indexadas por `userId`, `type` e `status`;
- categorias vinculadas a transações podem ser inativadas em vez de excluídas.

## Transaction

Representa uma movimentação financeira.

Campos:

- `id`
- `userId`
- `categoryId`
- `title`
- `description`
- `amountCents`
- `type`
- `date`
- `createdAt`
- `updatedAt`

Tipos: `INCOME` e `EXPENSE`.

Restrições:

- `amountCents` é `Int` e deve ser positivo por validação da aplicação;
- a categoria é opcional, deve pertencer ao mesmo usuário e ter tipo
  compatível;
- existem índices para `userId`, `date`, `type` e `categoryId`, além de índices
  compostos para os filtros financeiros mais frequentes.

## Budget

Representa um orçamento mensal por categoria.

Campos:

- `id`
- `userId`
- `categoryId`
- `month`
- `year`
- `limitCents`
- `createdAt`
- `updatedAt`

Restrições:

- `limitCents` é `Int` e deve ser positivo;
- a restrição `@@unique([userId, categoryId, month, year])` impede orçamentos
  duplicados para a mesma categoria e competência;
- a categoria deve ser do tipo `EXPENSE` e pertencer ao usuário.

## Goal

Representa uma meta financeira.

Campos:

- `id`
- `userId`
- `name`
- `targetAmountCents`
- `currentAmountCents`
- `status`
- `deadline`
- `createdAt`
- `updatedAt`

Status: `IN_PROGRESS`, `COMPLETED` e `CANCELLED`.

Restrições:

- os valores monetários são `Int`;
- `targetAmountCents` deve ser maior que zero;
- `currentAmountCents` começa em zero.

## Seed de desenvolvimento

A seed cria dados para exercitar o MVP:

- usuário `demo@fintrack.com`;
- senha de desenvolvimento `demo123`, persistida somente como hash;
- categorias de receita: Salário e Freelance;
- categorias de despesa: Moradia, Alimentação, Transporte e Lazer;
- receitas e despesas no mês corrente;
- orçamentos do mês corrente;
- metas de reserva de emergência e compra de notebook.

A execução é idempotente para o usuário demo: usuário e categorias são
atualizados, enquanto transações, orçamentos e metas demonstrativos são
recriados.

Para executar:

```bash
npx prisma db seed
```

# Modelo de Dados — FinTrack

O schema inicial está em `prisma/schema.prisma`. A migration e o seed serão
criados na etapa de banco, após a configuração de uma instância PostgreSQL.

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
- `passwordHash` armazenará apenas senhas com hash quando a autenticação for
  implementada.

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
- consultas frequentes são indexadas por usuário, tipo e status.

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
- consultas são indexadas por usuário, data, tipo e categoria.

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
- só pode existir um orçamento por usuário, categoria, mês e ano;
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

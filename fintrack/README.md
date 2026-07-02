# FinTrack

Sistema fullstack de controle financeiro pessoal desenvolvido como projeto de
portfólio. O MVP permitirá gerenciar receitas, despesas, categorias,
orçamentos e metas, além de acompanhar um dashboard mensal.

## Stack

- Next.js com App Router
- React e TypeScript
- Tailwind CSS
- Prisma e PostgreSQL
- Zod e React Hook Form
- Recharts
- Vitest e Testing Library

## Estado atual

O projeto contém a fundação técnica e a autenticação inicial:

- estrutura inicial de pastas;
- schema Prisma com as entidades principais;
- seed com usuário demo;
- login e logout;
- proteção server-side de rotas internas;
- criação, listagem, edição e inativação de categorias;
- criação, listagem, edição, exclusão e filtros de transações;
- configuração do Vitest;
- layout e página inicial;
- documentação técnica inicial.

Orçamentos, metas e dashboard real ainda não foram implementados.

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e configure `DATABASE_URL` e
   `AUTH_SECRET`.

3. Gere o Prisma Client:

   ```bash
   npx prisma generate
   ```

4. Rode as migrations e a seed para criar o usuário demo:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Inicie o projeto:

   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

Login demo:

- e-mail: `demo@fintrack.com`
- senha: `demo123`

## Validações

```bash
npm run lint
npm run test
npm run build
```

## Documentação

- [Briefing](docs/PROJECT_BRIEF.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Modelo de dados](docs/DATABASE_MODEL.md)
- [Regras financeiras](docs/FINANCIAL_RULES.md)
- [Roadmap](docs/ROADMAP.md)

## Regra monetária

Valores financeiros são armazenados em centavos usando inteiros. Por exemplo,
`R$ 10,50` é persistido como `1050`. O projeto não usa `Float` para dinheiro.

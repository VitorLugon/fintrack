# FinTrack

Sistema fullstack de controle financeiro pessoal desenvolvido como projeto de
portfólio júnior.

O FinTrack permite registrar receitas, despesas, categorias, orçamentos e metas
financeiras, além de acompanhar a evolução mensal por meio de cards, filtros e
gráficos.

## Deploy

- Aplicação: em breve
- Repositório: este projeto

> Quando publicar, substitua `em breve` pelo link do deploy, por exemplo:
> `https://fintrack.vercel.app`.

## Prints

Adicione aqui os prints principais do projeto após o deploy ou gravação local:

```md
![Dashboard do FinTrack](docs/assets/dashboard.png)
![Tela de transações](docs/assets/transactions.png)
![Tela de orçamentos](docs/assets/budgets.png)
```

Sugestão de prints:

- página inicial;
- login;
- dashboard mensal;
- listagem de transações;
- categorias;
- orçamentos;
- metas financeiras.

## Problema resolvido

Muitas pessoas ainda controlam finanças pessoais com anotações soltas,
planilhas difíceis de manter ou aplicativos complexos demais.

Isso torna difícil responder perguntas simples, como:

- quanto entrou no mês;
- quanto saiu;
- qual categoria mais consumiu dinheiro;
- se algum orçamento foi ultrapassado;
- qual o progresso de uma meta financeira.

O FinTrack resolve esse problema centralizando o controle financeiro em uma
interface simples, organizada e pensada para decisões mensais.

## Funcionalidades

### Autenticação

- Login com e-mail e senha.
- Logout.
- Rotas internas protegidas.
- Sessão server-side com cookie HTTP-only assinado.
- Usuário demo criado pela seed.

### Categorias

- Criação de categorias.
- Listagem de categorias.
- Edição de categorias.
- Desativação de categorias.
- Separação entre categorias de receita e despesa.
- Categorias desativadas não aparecem como opção padrão para novas transações.

### Transações

- Criação de receitas.
- Criação de despesas.
- Listagem de transações.
- Filtro por mês e ano.
- Filtro por tipo.
- Filtro por categoria.
- Edição de transações.
- Exclusão de transações.
- Validação de compatibilidade entre tipo da transação e tipo da categoria.

### Dashboard

- Card de saldo mensal.
- Card de receitas do mês.
- Card de despesas do mês.
- Gráfico de despesas por categoria.
- Gráfico de receitas vs despesas.
- Lista das últimas transações.
- Alerta de orçamento ultrapassado.

### Orçamentos

- Criação de orçamento mensal por categoria de despesa.
- Listagem de orçamentos do mês.
- Exibição de limite, valor gasto e percentual usado.
- Destaque visual para orçamento ultrapassado.
- Regra de apenas um orçamento por categoria, mês e ano.

### Metas financeiras

- Criação de metas.
- Listagem de metas.
- Atualização do valor atual.
- Marcação de meta como concluída.
- Cancelamento de meta.
- Cálculo de progresso percentual.

## Tecnologias

- Next.js com App Router
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod
- React Hook Form
- Recharts
- Vitest
- Testing Library
- bcryptjs

## Arquitetura

O projeto está organizado por responsabilidade:

```txt
src/
  app/           rotas, páginas e layouts do App Router
  components/    componentes reutilizáveis
  features/      módulos de interface, schemas e regras por domínio
  server/        autenticação, queries e server actions
  lib/           utilitários compartilhados
prisma/          schema, migrations e seed
docs/            documentação técnica do projeto
```

Componentes visuais não acessam o banco diretamente. As consultas e mutações
ficam no servidor, sempre usando o usuário autenticado para filtrar dados
financeiros por `userId`.

## Modelo de dados resumido

Principais entidades:

- `User`: usuário do sistema.
- `Category`: categoria de receita ou despesa.
- `Transaction`: receita ou despesa registrada pelo usuário.
- `Budget`: orçamento mensal por categoria de despesa.
- `Goal`: meta financeira.

Enums principais:

- `TransactionType`: `INCOME` e `EXPENSE`.
- `CategoryType`: `INCOME` e `EXPENSE`.
- `CategoryStatus`: `ACTIVE` e `INACTIVE`.
- `GoalStatus`: `IN_PROGRESS`, `COMPLETED` e `CANCELLED`.

## Regra sobre dinheiro em centavos

O FinTrack não usa `Float` para valores monetários.

Todos os valores financeiros são armazenados como inteiros em centavos:

- R$ 10,50 vira `1050`;
- R$ 100,00 vira `10000`;
- R$ 1.250,75 vira `125075`.

Essa decisão evita problemas de arredondamento com números decimais e deixa os
cálculos financeiros mais previsíveis.

Na interface, o usuário informa e visualiza valores em reais. Antes de salvar, o
servidor converte para centavos.

## Variáveis de ambiente

Crie um arquivo `.env` a partir do `.env.example`:

```bash
cp .env.example .env
```

Variáveis necessárias:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fintrack?schema=public"
AUTH_SECRET="troque-este-segredo-local"
```

Em produção, `AUTH_SECRET` deve ser um valor longo, aleatório e secreto.

## Como rodar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure o `.env`:

   ```bash
   cp .env.example .env
   ```

3. Gere o Prisma Client:

   ```bash
   npx prisma generate
   ```

4. Rode as migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Rode a seed:

   ```bash
   npx prisma db seed
   ```

6. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

A aplicação ficará disponível em:

```txt
http://localhost:3000
```

## Login de demonstração

A seed cria um usuário demo:

```txt
E-mail: demo@fintrack.com
Senha: demo123
```

A senha é usada apenas para desenvolvimento e é persistida no banco como hash,
nunca em texto puro.

## Scripts disponíveis

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera o Prisma Client e cria a build de produção.

```bash
npm run start
```

Inicia a aplicação em modo produção após o build.

```bash
npm run lint
```

Executa o lint do projeto.

```bash
npm run test
```

Executa os testes com Vitest.

```bash
npm run test:watch
```

Executa os testes em modo observação.

## Testes

O projeto possui testes para regras importantes, como:

- cálculo de receitas;
- cálculo de despesas;
- saldo mensal;
- mês sem transações;
- agrupamento de despesas por categoria;
- progresso de orçamento;
- progresso de metas;
- validações de categorias;
- validações de metas;
- autorização em server actions críticas.

## Aprendizados técnicos

Durante o desenvolvimento deste projeto, foram praticados pontos importantes de
um sistema fullstack real:

- modelagem relacional com Prisma e PostgreSQL;
- uso de centavos para cálculos monetários seguros;
- criação de autenticação simples com cookie HTTP-only;
- proteção de rotas internas no servidor;
- isolamento de dados por usuário autenticado;
- validação de entradas com Zod;
- formulários com React Hook Form;
- server actions para mutações;
- separação entre regra de negócio e interface;
- gráficos com Recharts;
- testes de regras financeiras com Vitest;
- tratamento de estados vazios, loading e erro;
- organização por features para facilitar manutenção.

## Melhorias futuras

- Cadastro público de usuários.
- Recuperação de senha.
- Importação de transações por CSV.
- Transações recorrentes.
- Controle de cartão de crédito.
- Relatórios exportáveis.
- Notificações de orçamento ultrapassado.
- Mais testes de integração.
- Deploy com banco PostgreSQL em produção.
- Melhorias de acessibilidade.

## Documentação complementar

- [Briefing](docs/PROJECT_BRIEF.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Modelo de dados](docs/DATABASE_MODEL.md)
- [Regras financeiras](docs/FINANCIAL_RULES.md)
- [Roadmap](docs/ROADMAP.md)

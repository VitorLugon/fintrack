# Regras Financeiras — FinTrack

## Valores monetários

Todos os valores monetários devem ser armazenados em centavos usando inteiro.
No schema Prisma, os campos monetários usam `Int`. Não deve ser usado `Float`
para dinheiro.

Exemplo:

- R$ 10,00 = 1000
- R$ 99,90 = 9990
- R$ 1.250,75 = 125075

## Saldo

Saldo mensal = total de receitas do mês - total de despesas do mês.

## Receitas

Receitas aumentam o saldo.

## Despesas

Despesas reduzem o saldo.

## Filtros

Cálculos do dashboard devem considerar:

- usuário autenticado;
- mês selecionado;
- ano selecionado.

Queries financeiras devem sempre filtrar por `userId`. Datas, tipos e
categorias possuem índices para apoiar os filtros mais frequentes.

## Transações

- `amountCents` deve ser maior que zero.
- O formulário pode exibir reais, mas deve converter para centavos antes de
  salvar.
- Receitas usam o tipo `INCOME`.
- Despesas usam o tipo `EXPENSE`.
- Receitas aumentam o saldo.
- Despesas reduzem o saldo.
- Quando houver categoria, o tipo dela deve ser compatível com a transação.
- A categoria e a transação devem pertencer ao mesmo usuário.
- Novas transações só devem oferecer categorias ativas como opção padrão.
- Transações antigas podem preservar categoria inativa, desde que ela pertença
  ao usuário e continue compatível com o tipo.
- Filtros por mês, ano, tipo e categoria devem manter o isolamento por
  `userId`.

## Categorias

- Categorias pertencem a um único usuário.
- Categorias podem ser `INCOME` ou `EXPENSE`.
- Categorias inativas não devem aparecer como opção padrão ao criar novas
  transações.
- O tipo de uma categoria já usada em transações ou orçamentos não deve ser
  alterado, para evitar inconsistência nos cálculos financeiros.

## Orçamento

O gasto de um orçamento é calculado pela soma das despesas da categoria no mês e ano do orçamento.

Progresso do orçamento = gasto / limite.

- `limitCents` deve ser maior que zero.
- O mês deve estar entre 1 e 12.
- O orçamento deve usar uma categoria `EXPENSE` do mesmo usuário.
- Só pode existir um orçamento por usuário, categoria, mês e ano.
- Se o limite for zero ou inválido, o progresso não deve ser calculado por
  divisão direta.

## Meta

Progresso da meta = valor atual / valor alvo.

O valor alvo deve ser maior que zero.

- `targetAmountCents` e `currentAmountCents` usam inteiros em centavos.
- `currentAmountCents` não deve ser negativo.
- O progresso exibido pode ser limitado a 100%, mesmo que o valor atual
  ultrapasse o alvo.
- Se o alvo for zero ou inválido, o progresso deve retornar um valor seguro.

## Casos que exigem testes

- soma de receitas e despesas em centavos;
- conversão de reais para centavos sem usar valor decimal persistido;
- saldo mensal;
- isolamento dos cálculos por usuário;
- filtros por mês, ano, tipo e categoria;
- compatibilidade entre categoria e transação;
- validação de categorias por nome, tipo e cor;
- bloqueio de alteração de tipo em categoria já usada;
- orçamento dentro, no limite e acima do limite;
- prevenção de orçamento duplicado na mesma competência;
- progresso de meta com alvo válido, zero e valor atual acima do alvo.

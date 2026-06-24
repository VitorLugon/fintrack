# Regras Financeiras — FinTrack

## Valores monetários

Todos os valores monetários devem ser armazenados em centavos usando inteiro.

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

## Orçamento

O gasto de um orçamento é calculado pela soma das despesas da categoria no mês e ano do orçamento.

Progresso do orçamento = gasto / limite.

## Meta

Progresso da meta = valor atual / valor alvo.

O valor alvo deve ser maior que zero.
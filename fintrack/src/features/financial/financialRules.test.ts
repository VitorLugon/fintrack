import { describe, expect, it } from "vitest";
import {
  calculateBudgetProgress,
  calculateGoalProgress,
  calculateMonthlyBalanceCents,
  calculateTotalExpenseCents,
  calculateTotalIncomeCents,
  groupExpensesByCategory,
  type FinancialTransaction,
} from "@/features/financial/financialRules";

const mixedTransactions: FinancialTransaction[] = [
  {
    amountCents: 500000,
    type: "INCOME",
    categoryId: "salary",
    categoryName: "Salário",
  },
  {
    amountCents: 150000,
    type: "INCOME",
    categoryId: "freelance",
    categoryName: "Freelance",
  },
  {
    amountCents: 120000,
    type: "EXPENSE",
    categoryId: "housing",
    categoryName: "Moradia",
  },
  {
    amountCents: 80000,
    type: "EXPENSE",
    categoryId: "food",
    categoryName: "Alimentação",
  },
  {
    amountCents: 35000,
    type: "EXPENSE",
    categoryId: "food",
    categoryName: "Alimentação",
  },
  {
    amountCents: 15000,
    type: "EXPENSE",
    categoryId: null,
    categoryName: null,
  },
];

describe("regras financeiras de transações", () => {
  it("retorna zero para mês sem transações", () => {
    expect(calculateTotalIncomeCents([])).toBe(0);
    expect(calculateTotalExpenseCents([])).toBe(0);
    expect(calculateMonthlyBalanceCents([])).toBe(0);
    expect(groupExpensesByCategory([])).toEqual([]);
  });

  it("calcula total de receitas e saldo quando há apenas receitas", () => {
    const transactions: FinancialTransaction[] = [
      { amountCents: 300000, type: "INCOME" },
      { amountCents: 125000, type: "INCOME" },
    ];

    expect(calculateTotalIncomeCents(transactions)).toBe(425000);
    expect(calculateTotalExpenseCents(transactions)).toBe(0);
    expect(calculateMonthlyBalanceCents(transactions)).toBe(425000);
  });

  it("calcula total de despesas e saldo negativo quando há apenas despesas", () => {
    const transactions: FinancialTransaction[] = [
      { amountCents: 90000, type: "EXPENSE" },
      { amountCents: 45000, type: "EXPENSE" },
    ];

    expect(calculateTotalIncomeCents(transactions)).toBe(0);
    expect(calculateTotalExpenseCents(transactions)).toBe(135000);
    expect(calculateMonthlyBalanceCents(transactions)).toBe(-135000);
  });

  it("calcula receitas, despesas e saldo em centavos", () => {
    expect(calculateTotalIncomeCents(mixedTransactions)).toBe(650000);
    expect(calculateTotalExpenseCents(mixedTransactions)).toBe(250000);
    expect(calculateMonthlyBalanceCents(mixedTransactions)).toBe(400000);
  });

  it("ignora valores inválidos menores ou iguais a zero", () => {
    const transactions: FinancialTransaction[] = [
      { amountCents: 100000, type: "INCOME" },
      { amountCents: 0, type: "INCOME" },
      { amountCents: -50000, type: "EXPENSE" },
      { amountCents: 30000, type: "EXPENSE" },
    ];

    expect(calculateTotalIncomeCents(transactions)).toBe(100000);
    expect(calculateTotalExpenseCents(transactions)).toBe(30000);
    expect(calculateMonthlyBalanceCents(transactions)).toBe(70000);
  });

  it("agrupa apenas despesas por categoria", () => {
    expect(groupExpensesByCategory(mixedTransactions)).toEqual([
      {
        categoryId: "housing",
        categoryName: "Moradia",
        amountCents: 120000,
      },
      {
        categoryId: "food",
        categoryName: "Alimentação",
        amountCents: 115000,
      },
      {
        categoryId: null,
        categoryName: "Sem categoria",
        amountCents: 15000,
      },
    ]);
  });
});

describe("regras financeiras de orçamento", () => {
  it("calcula progresso abaixo do limite", () => {
    expect(
      calculateBudgetProgress({ spentCents: 45000, limitCents: 90000 }),
    ).toEqual({
      currentCents: 45000,
      targetCents: 90000,
      percentage: 50,
      cappedPercentage: 50,
      isCompleted: false,
      isExceeded: false,
    });
  });

  it("identifica orçamento ultrapassado mantendo o percentual real", () => {
    expect(
      calculateBudgetProgress({ spentCents: 120000, limitCents: 90000 }),
    ).toEqual({
      currentCents: 120000,
      targetCents: 90000,
      percentage: 133,
      cappedPercentage: 100,
      isCompleted: true,
      isExceeded: true,
    });
  });
});

describe("regras financeiras de metas", () => {
  it("calcula meta com valor atual zero", () => {
    expect(
      calculateGoalProgress({
        currentAmountCents: 0,
        targetAmountCents: 500000,
      }),
    ).toEqual({
      currentCents: 0,
      targetCents: 500000,
      percentage: 0,
      cappedPercentage: 0,
      isCompleted: false,
      isExceeded: false,
    });
  });

  it("identifica meta concluída", () => {
    expect(
      calculateGoalProgress({
        currentAmountCents: 500000,
        targetAmountCents: 500000,
      }),
    ).toEqual({
      currentCents: 500000,
      targetCents: 500000,
      percentage: 100,
      cappedPercentage: 100,
      isCompleted: true,
      isExceeded: false,
    });
  });

  it("retorna progresso seguro quando o alvo é inválido", () => {
    expect(
      calculateGoalProgress({
        currentAmountCents: 100000,
        targetAmountCents: 0,
      }),
    ).toEqual({
      currentCents: 100000,
      targetCents: 0,
      percentage: 0,
      cappedPercentage: 0,
      isCompleted: false,
      isExceeded: false,
    });
  });
});

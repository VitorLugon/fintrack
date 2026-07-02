import { TransactionType } from "@/generated/prisma/client";
import { dashboardFiltersSchema } from "@/features/dashboard/dashboardSchemas";
import {
  calculateBudgetProgress,
  calculateMonthlyBalanceCents,
  calculateTotalExpenseCents,
  calculateTotalIncomeCents,
  groupExpensesByCategory,
} from "@/features/financial/financialRules";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

const fallbackChartColors = [
  "#047857",
  "#dc2626",
  "#2563eb",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
];

export async function getDashboardData(
  rawFilters: Record<string, string | string[] | undefined>,
) {
  const user = await requireCurrentUser();
  const filters = dashboardFiltersSchema.parse(rawFilters);
  const startDate = new Date(Date.UTC(filters.year, filters.month - 1, 1, 0));
  const endDate = new Date(Date.UTC(filters.year, filters.month, 1, 0));

  const [transactions, latestTransactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        id: true,
        amountCents: true,
        type: true,
        categoryId: true,
        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        amountCents: true,
        type: true,
        date: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.budget.findMany({
      where: {
        userId: user.id,
        month: filters.month,
        year: filters.year,
      },
      select: {
        id: true,
        categoryId: true,
        limitCents: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const financialTransactions = transactions.map((transaction) => ({
    amountCents: transaction.amountCents,
    type: transaction.type,
    categoryId: transaction.categoryId,
    categoryName: transaction.category?.name,
  }));

  const totalIncomeCents = calculateTotalIncomeCents(financialTransactions);
  const totalExpenseCents = calculateTotalExpenseCents(financialTransactions);
  const balanceCents = calculateMonthlyBalanceCents(financialTransactions);
  const expensesByCategory = groupExpensesByCategory(financialTransactions).map(
    (expense, index) => {
      const transaction = transactions.find(
        (item) => (item.categoryId ?? null) === expense.categoryId,
      );

      return {
        ...expense,
        color:
          transaction?.category?.color ??
          fallbackChartColors[index % fallbackChartColors.length],
      };
    },
  );

  const expenseTotalsByCategory = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== TransactionType.EXPENSE || !transaction.categoryId) {
      continue;
    }

    expenseTotalsByCategory.set(
      transaction.categoryId,
      (expenseTotalsByCategory.get(transaction.categoryId) ?? 0) +
        transaction.amountCents,
    );
  }

  const budgetAlerts = budgets
    .map((budget) => {
      const spentCents = expenseTotalsByCategory.get(budget.categoryId) ?? 0;
      const progress = calculateBudgetProgress({
        spentCents,
        limitCents: budget.limitCents,
      });

      return {
        budgetId: budget.id,
        categoryName: budget.category.name,
        spentCents,
        limitCents: budget.limitCents,
        percentage: progress.percentage,
        isExceeded: progress.isExceeded,
      };
    })
    .filter((budget) => budget.isExceeded);

  return {
    filters,
    summary: {
      balanceCents,
      incomeCents: totalIncomeCents,
      expenseCents: totalExpenseCents,
    },
    expensesByCategory,
    incomeVsExpense: [
      { name: "Receitas", amountCents: totalIncomeCents },
      { name: "Despesas", amountCents: totalExpenseCents },
    ],
    latestTransactions: latestTransactions.map((transaction) => ({
      id: transaction.id,
      title: transaction.title,
      amountCents: transaction.amountCents,
      type: transaction.type,
      date: transaction.date,
      categoryName: transaction.category?.name ?? null,
    })),
    budgetAlerts,
    isEmpty: transactions.length === 0,
  };
}

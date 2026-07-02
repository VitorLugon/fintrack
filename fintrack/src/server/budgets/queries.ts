import {
  CategoryStatus,
  CategoryType,
  TransactionType,
} from "@/generated/prisma/client";
import { budgetFiltersSchema } from "@/features/budgets/budgetSchemas";
import { calculateBudgetProgress } from "@/features/financial/financialRules";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

export async function listExpenseCategoriesForBudgetForm() {
  const user = await requireCurrentUser();

  return prisma.category.findMany({
    where: {
      userId: user.id,
      type: CategoryType.EXPENSE,
      status: CategoryStatus.ACTIVE,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });
}

export async function listBudgetsForCurrentUser(
  rawFilters: Record<string, string | string[] | undefined>,
) {
  const user = await requireCurrentUser();
  const filters = budgetFiltersSchema.parse(rawFilters);
  const startDate = new Date(Date.UTC(filters.year, filters.month - 1, 1, 0));
  const endDate = new Date(Date.UTC(filters.year, filters.month, 1, 0));

  const budgets = await prisma.budget.findMany({
    where: {
      userId: user.id,
      month: filters.month,
      year: filters.year,
    },
    orderBy: {
      category: {
        name: "asc",
      },
    },
    select: {
      id: true,
      categoryId: true,
      limitCents: true,
      category: {
        select: {
          name: true,
          color: true,
        },
      },
    },
  });

  const expenseTransactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      type: TransactionType.EXPENSE,
      date: {
        gte: startDate,
        lt: endDate,
      },
      categoryId: {
        in: budgets.map((budget) => budget.categoryId),
      },
    },
    select: {
      categoryId: true,
      amountCents: true,
    },
  });

  const spentByCategory = new Map<string, number>();

  for (const transaction of expenseTransactions) {
    if (!transaction.categoryId) {
      continue;
    }

    spentByCategory.set(
      transaction.categoryId,
      (spentByCategory.get(transaction.categoryId) ?? 0) +
        transaction.amountCents,
    );
  }

  return {
    filters,
    budgets: budgets.map((budget) => {
      const spentCents = spentByCategory.get(budget.categoryId) ?? 0;
      const progress = calculateBudgetProgress({
        spentCents,
        limitCents: budget.limitCents,
      });

      return {
        id: budget.id,
        categoryId: budget.categoryId,
        categoryName: budget.category.name,
        categoryColor: budget.category.color,
        limitCents: budget.limitCents,
        spentCents,
        percentage: progress.percentage,
        isExceeded: progress.isExceeded,
      };
    }),
  };
}

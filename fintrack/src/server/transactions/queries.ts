import { CategoryStatus, TransactionType } from "@/generated/prisma/client";
import { transactionFiltersSchema } from "@/features/transactions/transactionSchemas";
import { calculateTransactionSummary } from "@/features/transactions/transactionRules";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

export async function listTransactionsForCurrentUser(
  rawFilters: Record<string, string | string[] | undefined>,
) {
  const user = await requireCurrentUser();
  const filters = transactionFiltersSchema.parse(rawFilters);
  const startDate = new Date(Date.UTC(filters.year, filters.month - 1, 1, 0));
  const endDate = new Date(Date.UTC(filters.year, filters.month, 1, 0));
  const type = filters.type === "ALL" ? undefined : filters.type;

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
      type,
      categoryId: filters.categoryId || undefined,
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      amountCents: true,
      type: true,
      date: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          color: true,
        },
      },
    },
  });

  return {
    filters,
    transactions,
    summary: calculateTransactionSummary(transactions),
  };
}

export async function listActiveTransactionCategories() {
  const user = await requireCurrentUser();

  return prisma.category.findMany({
    where: {
      userId: user.id,
      status: CategoryStatus.ACTIVE,
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
    },
  });
}

export async function listTransactionFilterCategories() {
  const user = await requireCurrentUser();

  return prisma.category.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
    },
  });
}

export function getTransactionTypeLabel(type: TransactionType) {
  return type === TransactionType.INCOME ? "Receita" : "Despesa";
}

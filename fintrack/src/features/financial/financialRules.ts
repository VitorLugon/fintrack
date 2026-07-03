export type FinancialTransactionType = "INCOME" | "EXPENSE";

export type FinancialTransaction = {
  amountCents: number;
  type: FinancialTransactionType;
  categoryId?: string | null;
  categoryName?: string | null;
};

export type ExpenseByCategory = {
  categoryId: string | null;
  categoryName: string;
  amountCents: number;
};

export type ProgressResult = {
  currentCents: number;
  targetCents: number;
  percentage: number;
  cappedPercentage: number;
  isCompleted: boolean;
  isExceeded: boolean;
};

function sumByType(
  transactions: FinancialTransaction[],
  type: FinancialTransactionType,
) {
  return transactions.reduce((total, transaction) => {
    if (transaction.type !== type || transaction.amountCents <= 0) {
      return total;
    }

    return total + transaction.amountCents;
  }, 0);
}

export function calculateTotalIncomeCents(
  transactions: FinancialTransaction[],
) {
  return sumByType(transactions, "INCOME");
}

export function calculateTotalExpenseCents(
  transactions: FinancialTransaction[],
) {
  return sumByType(transactions, "EXPENSE");
}

export function calculateMonthlyBalanceCents(
  transactions: FinancialTransaction[],
) {
  return (
    calculateTotalIncomeCents(transactions) -
    calculateTotalExpenseCents(transactions)
  );
}

export function groupExpensesByCategory(
  transactions: FinancialTransaction[],
): ExpenseByCategory[] {
  const groupedExpenses = new Map<string, ExpenseByCategory>();

  for (const transaction of transactions) {
    if (transaction.type !== "EXPENSE" || transaction.amountCents <= 0) {
      continue;
    }

    const categoryId = transaction.categoryId ?? null;
    const categoryName = transaction.categoryName ?? "Sem categoria";
    const groupingKey = categoryId ?? "uncategorized";
    const currentGroup = groupedExpenses.get(groupingKey);

    if (currentGroup) {
      currentGroup.amountCents += transaction.amountCents;
      continue;
    }

    groupedExpenses.set(groupingKey, {
      categoryId,
      categoryName,
      amountCents: transaction.amountCents,
    });
  }

  return Array.from(groupedExpenses.values()).sort(
    (left, right) => right.amountCents - left.amountCents,
  );
}

function calculateProgress(currentCents: number, targetCents: number) {
  if (targetCents <= 0) {
    return {
      currentCents,
      targetCents,
      percentage: 0,
      cappedPercentage: 0,
      isCompleted: false,
      isExceeded: false,
    };
  }

  const percentage = Math.floor((currentCents * 100) / targetCents);
  const cappedPercentage = Math.min(100, percentage);

  return {
    currentCents,
    targetCents,
    percentage,
    cappedPercentage,
    isCompleted: currentCents >= targetCents,
    isExceeded: currentCents > targetCents,
  };
}

export function calculateBudgetProgress({
  spentCents,
  limitCents,
}: {
  spentCents: number;
  limitCents: number;
}): ProgressResult {
  return calculateProgress(spentCents, limitCents);
}

export function calculateGoalProgress({
  currentAmountCents,
  targetAmountCents,
}: {
  currentAmountCents: number;
  targetAmountCents: number;
}): ProgressResult {
  return calculateProgress(currentAmountCents, targetAmountCents);
}

"use server";

import { revalidatePath } from "next/cache";
import {
  CategoryStatus,
  CategoryType,
  Prisma,
} from "@/generated/prisma/client";
import { budgetFormSchema } from "@/features/budgets/budgetSchemas";
import { parseMoneyToCents } from "@/features/transactions/transactionRules";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

export type BudgetActionResult = {
  success: boolean;
  message: string;
};

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createBudgetAction(
  values: unknown,
): Promise<BudgetActionResult> {
  const user = await requireCurrentUser();
  const parsed = budgetFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const limitCents = parseMoneyToCents(parsed.data.limitReais);

  if (limitCents === null) {
    return {
      success: false,
      message: "Informe um limite em reais maior que zero.",
    };
  }

  const category = await prisma.category.findFirst({
    where: {
      id: parsed.data.categoryId,
      userId: user.id,
      type: CategoryType.EXPENSE,
      status: CategoryStatus.ACTIVE,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Selecione uma categoria de despesa ativa.",
    };
  }

  const existingBudget = await prisma.budget.findUnique({
    where: {
      userId_categoryId_month_year: {
        userId: user.id,
        categoryId: category.id,
        month: parsed.data.month,
        year: parsed.data.year,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingBudget) {
    return {
      success: false,
      message: "Já existe um orçamento para essa categoria neste mês.",
    };
  }

  try {
    await prisma.budget.create({
      data: {
        userId: user.id,
        categoryId: category.id,
        month: parsed.data.month,
        year: parsed.data.year,
        limitCents,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "Já existe um orçamento para essa categoria neste mês.",
      };
    }

    throw error;
  }

  revalidatePath("/budgets");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Orçamento criado com sucesso.",
  };
}

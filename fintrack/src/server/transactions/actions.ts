"use server";

import { revalidatePath } from "next/cache";
import { CategoryStatus } from "@/generated/prisma/client";
import {
  transactionFormSchema,
  transactionIdSchema,
  transactionUpdateSchema,
} from "@/features/transactions/transactionSchemas";
import { parseMoneyToCents } from "@/features/transactions/transactionRules";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

export type TransactionActionResult = {
  success: boolean;
  message: string;
};

function normalizeOptionalText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function parseTransactionDate(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

function revalidateTransactionDependencies() {
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
}

async function validateCategoryForTransaction({
  userId,
  categoryId,
  type,
  requireActive,
}: {
  userId: string;
  categoryId: string;
  type: "INCOME" | "EXPENSE";
  requireActive: boolean;
}) {
  if (!categoryId) {
    return { success: true as const, categoryId: null };
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
      status: requireActive ? CategoryStatus.ACTIVE : undefined,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!category) {
    return {
      success: false as const,
      message: requireActive
        ? "Categoria ativa não encontrada para este usuário."
        : "Categoria não encontrada para este usuário.",
    };
  }

  if (category.type !== type) {
    return {
      success: false as const,
      message: "A categoria deve ser compatível com o tipo da transação.",
    };
  }

  return { success: true as const, categoryId: category.id };
}

export async function createTransactionAction(
  values: unknown,
): Promise<TransactionActionResult> {
  const user = await requireCurrentUser();
  const parsed = transactionFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const amountCents = parseMoneyToCents(parsed.data.amountReais);

  if (amountCents === null) {
    return {
      success: false,
      message: "Informe um valor em reais maior que zero.",
    };
  }

  const categoryResult = await validateCategoryForTransaction({
    userId: user.id,
    categoryId: parsed.data.categoryId,
    type: parsed.data.type,
    requireActive: true,
  });

  if (!categoryResult.success) {
    return {
      success: false,
      message: categoryResult.message,
    };
  }

  await prisma.transaction.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      description: normalizeOptionalText(parsed.data.description),
      amountCents,
      type: parsed.data.type,
      date: parseTransactionDate(parsed.data.date),
      categoryId: categoryResult.categoryId,
    },
  });

  revalidateTransactionDependencies();

  return {
    success: true,
    message: "Transação criada com sucesso.",
  };
}

export async function updateTransactionAction(
  values: unknown,
): Promise<TransactionActionResult> {
  const user = await requireCurrentUser();
  const parsed = transactionUpdateSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!transaction) {
    return {
      success: false,
      message: "Transação não encontrada.",
    };
  }

  const amountCents = parseMoneyToCents(parsed.data.amountReais);

  if (amountCents === null) {
    return {
      success: false,
      message: "Informe um valor em reais maior que zero.",
    };
  }

  const categoryResult = await validateCategoryForTransaction({
    userId: user.id,
    categoryId: parsed.data.categoryId,
    type: parsed.data.type,
    requireActive: false,
  });

  if (!categoryResult.success) {
    return {
      success: false,
      message: categoryResult.message,
    };
  }

  const result = await prisma.transaction.updateMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      title: parsed.data.title,
      description: normalizeOptionalText(parsed.data.description),
      amountCents,
      type: parsed.data.type,
      date: parseTransactionDate(parsed.data.date),
      categoryId: categoryResult.categoryId,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Transação não encontrada.",
    };
  }

  revalidateTransactionDependencies();

  return {
    success: true,
    message: "Transação atualizada com sucesso.",
  };
}

export async function deleteTransactionAction(
  values: unknown,
): Promise<TransactionActionResult> {
  const user = await requireCurrentUser();
  const parsed = transactionIdSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Transação inválida.",
    };
  }

  const result = await prisma.transaction.deleteMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Transação não encontrada.",
    };
  }

  revalidateTransactionDependencies();

  return {
    success: true,
    message: "Transação excluída com sucesso.",
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { CategoryStatus } from "@/generated/prisma/client";
import {
  categoryFormSchema,
  categoryIdSchema,
  categoryUpdateSchema,
} from "@/features/categories/categorySchemas";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

export type CategoryActionResult = {
  success: boolean;
  message: string;
};

function normalizeOptionalText(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function createCategoryAction(
  values: unknown,
): Promise<CategoryActionResult> {
  const user = await requireCurrentUser();
  const parsed = categoryFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: parsed.data.name,
      type: parsed.data.type,
    },
    select: {
      id: true,
    },
  });

  if (existingCategory) {
    return {
      success: false,
      message: "Você já tem uma categoria com esse nome e tipo.",
    };
  }

  await prisma.category.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      type: parsed.data.type,
      status: CategoryStatus.ACTIVE,
      color: normalizeOptionalText(parsed.data.color),
      icon: normalizeOptionalText(parsed.data.icon),
    },
  });

  revalidatePath("/categories");

  return {
    success: true,
    message: "Categoria criada com sucesso.",
  };
}

export async function updateCategoryAction(
  values: unknown,
): Promise<CategoryActionResult> {
  const user = await requireCurrentUser();
  const parsed = categoryUpdateSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const category = await prisma.category.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    select: {
      id: true,
      type: true,
      status: true,
      _count: {
        select: {
          transactions: true,
          budgets: true,
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Categoria não encontrada.",
    };
  }

  const hasFinancialLinks =
    category._count.transactions > 0 || category._count.budgets > 0;

  if (category.type !== parsed.data.type && hasFinancialLinks) {
    return {
      success: false,
      message:
        "Não é possível mudar o tipo de uma categoria já usada em transações ou orçamentos.",
    };
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: parsed.data.name,
      type: parsed.data.type,
      NOT: {
        id: parsed.data.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingCategory) {
    return {
      success: false,
      message: "Você já tem uma categoria com esse nome e tipo.",
    };
  }

  const result = await prisma.category.updateMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      color: normalizeOptionalText(parsed.data.color),
      icon: normalizeOptionalText(parsed.data.icon),
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Categoria não encontrada.",
    };
  }

  revalidatePath("/categories");

  return {
    success: true,
    message:
      category.status === CategoryStatus.INACTIVE
        ? "Categoria inativa atualizada."
        : "Categoria atualizada com sucesso.",
  };
}

export async function inactivateCategoryAction(
  values: unknown,
): Promise<CategoryActionResult> {
  const user = await requireCurrentUser();
  const parsed = categoryIdSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Categoria inválida.",
    };
  }

  const result = await prisma.category.updateMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      status: CategoryStatus.INACTIVE,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Categoria não encontrada.",
    };
  }

  revalidatePath("/categories");

  return {
    success: true,
    message: "Categoria inativada com sucesso.",
  };
}

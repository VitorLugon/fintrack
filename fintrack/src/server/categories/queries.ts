import { CategoryStatus, CategoryType } from "@/generated/prisma/client";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

export async function listCategoriesForCurrentUser() {
  const user = await requireCurrentUser();

  return prisma.category.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [{ status: "asc" }, { type: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      type: true,
      status: true,
      color: true,
      icon: true,
      _count: {
        select: {
          transactions: true,
          budgets: true,
        },
      },
    },
  });
}

export async function listActiveCategoriesForTransactionForm(type?: CategoryType) {
  const user = await requireCurrentUser();

  return prisma.category.findMany({
    where: {
      userId: user.id,
      status: CategoryStatus.ACTIVE,
      type,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
      icon: true,
    },
  });
}

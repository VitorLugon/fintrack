import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  requireCurrentUser: vi.fn(),
  prisma: {
    budget: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    category: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
    },
    goal: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
    },
    transaction: {
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("@/server/auth/session", () => ({
  requireCurrentUser: mocks.requireCurrentUser,
}));

vi.mock("@/server/db", () => ({
  prisma: mocks.prisma,
}));

describe("server actions authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireCurrentUser.mockResolvedValue({
      id: "user-1",
      name: "Usuário Demo",
      email: "demo@fintrack.com",
    });
  });

  it("exclui transação usando id e userId no filtro", async () => {
    const { deleteTransactionAction } = await import(
      "@/server/transactions/actions"
    );

    mocks.prisma.transaction.deleteMany.mockResolvedValue({ count: 1 });

    const result = await deleteTransactionAction({ id: "transaction-1" });

    expect(result.success).toBe(true);
    expect(mocks.prisma.transaction.deleteMany).toHaveBeenCalledWith({
      where: {
        id: "transaction-1",
        userId: "user-1",
      },
    });
  });

  it("cria orçamento somente após buscar categoria de despesa do usuário", async () => {
    const { createBudgetAction } = await import("@/server/budgets/actions");

    mocks.prisma.category.findFirst.mockResolvedValue({ id: "category-1" });
    mocks.prisma.budget.findUnique.mockResolvedValue(null);
    mocks.prisma.budget.create.mockResolvedValue({ id: "budget-1" });

    const result = await createBudgetAction({
      categoryId: "category-1",
      month: 7,
      year: 2026,
      limitReais: "900,00",
    });

    expect(result.success).toBe(true);
    expect(mocks.prisma.category.findFirst).toHaveBeenCalledWith({
      where: {
        id: "category-1",
        userId: "user-1",
        type: "EXPENSE",
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });
    expect(mocks.prisma.budget.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-1",
        categoryId: "category-1",
        limitCents: 90000,
      }),
    });
  });

  it("atualiza meta usando id e userId no filtro", async () => {
    const { updateGoalCurrentAmountAction } = await import(
      "@/server/goals/actions"
    );

    mocks.prisma.goal.findFirst.mockResolvedValue({
      targetAmountCents: 100000,
      status: "IN_PROGRESS",
    });
    mocks.prisma.goal.updateMany.mockResolvedValue({ count: 1 });

    const result = await updateGoalCurrentAmountAction({
      id: "goal-1",
      currentAmountReais: "250,00",
    });

    expect(result.success).toBe(true);
    expect(mocks.prisma.goal.findFirst).toHaveBeenCalledWith({
      where: {
        id: "goal-1",
        userId: "user-1",
      },
      select: {
        targetAmountCents: true,
        status: true,
      },
    });
    expect(mocks.prisma.goal.updateMany).toHaveBeenCalledWith({
      where: {
        id: "goal-1",
        userId: "user-1",
      },
      data: {
        currentAmountCents: 25000,
        status: "IN_PROGRESS",
      },
    });
  });

  it("desativa categoria usando id e userId no filtro", async () => {
    const { inactivateCategoryAction } = await import(
      "@/server/categories/actions"
    );

    mocks.prisma.category.updateMany.mockResolvedValue({ count: 1 });

    const result = await inactivateCategoryAction({ id: "category-1" });

    expect(result.success).toBe(true);
    expect(mocks.prisma.category.updateMany).toHaveBeenCalledWith({
      where: {
        id: "category-1",
        userId: "user-1",
      },
      data: {
        status: "INACTIVE",
      },
    });
  });
});

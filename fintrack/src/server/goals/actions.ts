"use server";

import { revalidatePath } from "next/cache";
import { GoalStatus } from "@/generated/prisma/client";
import {
  goalCurrentAmountSchema,
  goalFormSchema,
  goalIdSchema,
  parseNonNegativeMoneyToCents,
} from "@/features/goals/goalSchemas";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

export type GoalActionResult = {
  success: boolean;
  message: string;
};

function parseGoalDeadline(value: string) {
  return value ? new Date(`${value}T12:00:00.000Z`) : null;
}

export async function createGoalAction(
  values: unknown,
): Promise<GoalActionResult> {
  const user = await requireCurrentUser();
  const parsed = goalFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const targetAmountCents = parseNonNegativeMoneyToCents(
    parsed.data.targetAmountReais,
  );
  const currentAmountCents = parseNonNegativeMoneyToCents(
    parsed.data.currentAmountReais,
  );

  if (targetAmountCents === null || targetAmountCents <= 0) {
    return {
      success: false,
      message: "O valor alvo deve ser maior que zero.",
    };
  }

  if (currentAmountCents === null || currentAmountCents < 0) {
    return {
      success: false,
      message: "O valor atual não pode ser negativo.",
    };
  }

  await prisma.goal.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      targetAmountCents,
      currentAmountCents,
      status:
        currentAmountCents >= targetAmountCents
          ? GoalStatus.COMPLETED
          : GoalStatus.IN_PROGRESS,
      deadline: parseGoalDeadline(parsed.data.deadline),
    },
  });

  revalidatePath("/goals");

  return {
    success: true,
    message: "Meta criada com sucesso.",
  };
}

export async function updateGoalCurrentAmountAction(
  values: unknown,
): Promise<GoalActionResult> {
  const user = await requireCurrentUser();
  const parsed = goalCurrentAmountSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const currentAmountCents = parseNonNegativeMoneyToCents(
    parsed.data.currentAmountReais,
  );

  if (currentAmountCents === null || currentAmountCents < 0) {
    return {
      success: false,
      message: "O valor atual não pode ser negativo.",
    };
  }

  const goal = await prisma.goal.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    select: {
      targetAmountCents: true,
      status: true,
    },
  });

  if (!goal) {
    return {
      success: false,
      message: "Meta não encontrada.",
    };
  }

  const nextStatus =
    goal.status === GoalStatus.CANCELLED
      ? GoalStatus.CANCELLED
      : currentAmountCents >= goal.targetAmountCents
        ? GoalStatus.COMPLETED
        : GoalStatus.IN_PROGRESS;

  const result = await prisma.goal.updateMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      currentAmountCents,
      status: nextStatus,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Meta não encontrada.",
    };
  }

  revalidatePath("/goals");

  return {
    success: true,
    message: "Valor atual atualizado.",
  };
}

export async function completeGoalAction(
  values: unknown,
): Promise<GoalActionResult> {
  const user = await requireCurrentUser();
  const parsed = goalIdSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Meta inválida.",
    };
  }

  const goal = await prisma.goal.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    select: {
      targetAmountCents: true,
    },
  });

  if (!goal) {
    return {
      success: false,
      message: "Meta não encontrada.",
    };
  }

  await prisma.goal.updateMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      currentAmountCents: goal.targetAmountCents,
      status: GoalStatus.COMPLETED,
    },
  });

  revalidatePath("/goals");

  return {
    success: true,
    message: "Meta marcada como concluída.",
  };
}

export async function cancelGoalAction(
  values: unknown,
): Promise<GoalActionResult> {
  const user = await requireCurrentUser();
  const parsed = goalIdSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Meta inválida.",
    };
  }

  const result = await prisma.goal.updateMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
    data: {
      status: GoalStatus.CANCELLED,
    },
  });

  if (result.count === 0) {
    return {
      success: false,
      message: "Meta não encontrada.",
    };
  }

  revalidatePath("/goals");

  return {
    success: true,
    message: "Meta cancelada.",
  };
}

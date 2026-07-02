import { calculateGoalProgress } from "@/features/financial/financialRules";
import { requireCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db";

export async function listGoalsForCurrentUser() {
  const user = await requireCurrentUser();

  const goals = await prisma.goal.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      targetAmountCents: true,
      currentAmountCents: true,
      status: true,
      deadline: true,
    },
  });

  return goals.map((goal) => ({
    ...goal,
    progress: calculateGoalProgress({
      currentAmountCents: goal.currentAmountCents,
      targetAmountCents: goal.targetAmountCents,
    }),
  }));
}

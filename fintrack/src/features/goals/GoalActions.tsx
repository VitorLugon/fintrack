"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { GoalStatusValue } from "@/features/goals/goalTypes";
import {
  cancelGoalAction,
  completeGoalAction,
} from "@/server/goals/actions";

type GoalActionsProps = {
  goalId: string;
  status: GoalStatusValue;
};

export function GoalActions({ goalId, status }: GoalActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isCancelled = status === "CANCELLED";
  const isCompleted = status === "COMPLETED";

  function runAction(action: (values: unknown) => Promise<{ success: boolean }>) {
    startTransition(async () => {
      const result = await action({ id: goalId });

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {!isCompleted && !isCancelled ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => runAction(completeGoalAction)}
          className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-70"
        >
          Marcar como concluída
        </button>
      ) : null}

      {!isCancelled ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => runAction(cancelGoalAction)}
          className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-70"
        >
          Cancelar meta
        </button>
      ) : null}
    </div>
  );
}

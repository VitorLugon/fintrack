"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  goalCurrentAmountSchema,
  type GoalCurrentAmountValues,
} from "@/features/goals/goalSchemas";
import {
  formatCentsToBRL,
  formatCentsToInputValue,
} from "@/features/transactions/transactionRules";
import {
  cancelGoalAction,
  completeGoalAction,
  updateGoalCurrentAmountAction,
} from "@/server/goals/actions";

type GoalStatusValue = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

type GoalListProps = {
  goals: Array<{
    id: string;
    name: string;
    targetAmountCents: number;
    currentAmountCents: number;
    status: GoalStatusValue;
    deadline: Date | null;
    progress: {
      percentage: number;
      isCompleted: boolean;
      isExceeded: boolean;
    };
  }>;
};

function getStatusLabel(status: GoalStatusValue) {
  if (status === "COMPLETED") {
    return "Concluída";
  }

  if (status === "CANCELLED") {
    return "Cancelada";
  }

  return "Em andamento";
}

function GoalCurrentAmountForm({
  goalId,
  currentAmountCents,
  disabled,
}: {
  goalId: string;
  currentAmountCents: number;
  disabled: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalCurrentAmountValues>({
    resolver: zodResolver(goalCurrentAmountSchema),
    defaultValues: {
      id: goalId,
      currentAmountReais: formatCentsToInputValue(currentAmountCents),
    },
  });

  function onSubmit(values: GoalCurrentAmountValues) {
    setMessage(null);

    startTransition(async () => {
      const result = await updateGoalCurrentAmountAction(values);

      setIsSuccess(result.success);
      setMessage(result.message);

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-3">
      <input type="hidden" {...register("id")} />
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Atualizar valor atual
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            inputMode="decimal"
            disabled={disabled}
            {...register("currentAmountReais")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
          />
          <button
            type="submit"
            disabled={disabled || isPending}
            className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Salvando..." : "Atualizar"}
          </button>
        </div>
        {errors.currentAmountReais ? (
          <p className="text-sm text-red-700">
            {errors.currentAmountReais.message}
          </p>
        ) : null}
      </div>

      {message ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            isSuccess ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

export function GoalList({ goals }: GoalListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (goals.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        Nenhuma meta financeira cadastrada ainda.
      </div>
    );
  }

  function runAction(
    action: (values: unknown) => Promise<{ success: boolean }>,
    id: string,
  ) {
    startTransition(async () => {
      const result = await action({ id });

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="grid gap-4">
      {goals.map((goal) => {
        const isCancelled = goal.status === "CANCELLED";
        const isCompleted = goal.status === "COMPLETED";

        return (
          <article
            key={goal.id}
            className={`rounded-3xl border bg-white p-5 shadow-sm ${
              isCancelled ? "border-slate-200 opacity-75" : "border-slate-200"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-950">
                    {goal.name}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : isCancelled
                          ? "bg-slate-100 text-slate-600"
                          : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {getStatusLabel(goal.status)}
                  </span>
                </div>
                {goal.deadline ? (
                  <p className="mt-2 text-sm text-slate-500">
                    Prazo:{" "}
                    {new Intl.DateTimeFormat("pt-BR", {
                      timeZone: "UTC",
                    }).format(goal.deadline)}
                  </p>
                ) : null}
              </div>

              <p className="text-lg font-bold text-slate-950">
                {goal.progress.percentage}%
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Valor atual</p>
                <p className="font-bold text-slate-950">
                  {formatCentsToBRL(goal.currentAmountCents)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Valor alvo</p>
                <p className="font-bold text-slate-950">
                  {formatCentsToBRL(goal.targetAmountCents)}
                </p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  isCompleted ? "bg-emerald-600" : "bg-blue-600"
                }`}
                style={{ width: `${goal.progress.percentage}%` }}
              />
            </div>

            <GoalCurrentAmountForm
              goalId={goal.id}
              currentAmountCents={goal.currentAmountCents}
              disabled={isCancelled}
            />

            <div className="mt-4 flex flex-wrap gap-3">
              {!isCompleted && !isCancelled ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runAction(completeGoalAction, goal.id)}
                  className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-70"
                >
                  Marcar como concluída
                </button>
              ) : null}

              {!isCancelled ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runAction(cancelGoalAction, goal.id)}
                  className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-70"
                >
                  Cancelar meta
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}

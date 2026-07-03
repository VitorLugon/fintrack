"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  goalCurrentAmountSchema,
  type GoalCurrentAmountValues,
} from "@/features/goals/goalSchemas";
import { formatCentsToInputValue } from "@/features/transactions/transactionRules";
import { updateGoalCurrentAmountAction } from "@/server/goals/actions";

type GoalCurrentAmountFormProps = {
  goalId: string;
  currentAmountCents: number;
  disabled: boolean;
};

export function GoalCurrentAmountForm({
  goalId,
  currentAmountCents,
  disabled,
}: GoalCurrentAmountFormProps) {
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

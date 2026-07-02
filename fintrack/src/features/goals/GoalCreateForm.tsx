"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  goalFormSchema,
  type GoalFormValues,
} from "@/features/goals/goalSchemas";
import { createGoalAction } from "@/server/goals/actions";

const defaultValues: GoalFormValues = {
  name: "",
  targetAmountReais: "",
  currentAmountReais: "0,00",
  deadline: "",
};

export function GoalCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues,
  });

  function onSubmit(values: GoalFormValues) {
    setMessage(null);

    startTransition(async () => {
      const result = await createGoalAction(values);

      setIsSuccess(result.success);
      setMessage(result.message);

      if (result.success) {
        reset(defaultValues);
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-950">Nova meta</h2>
      <p className="mt-2 text-sm text-slate-600">
        Crie uma meta financeira e acompanhe o progresso em centavos.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="space-y-2">
          <label htmlFor="goal-name" className="text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            id="goal-name"
            {...register("name")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            placeholder="Ex.: Reserva de emergência"
          />
          {errors.name ? (
            <p className="text-sm text-red-700">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="goal-target"
              className="text-sm font-medium text-slate-700"
            >
              Valor alvo
            </label>
            <input
              id="goal-target"
              inputMode="decimal"
              {...register("targetAmountReais")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              placeholder="Ex.: 10000,00"
            />
            {errors.targetAmountReais ? (
              <p className="text-sm text-red-700">
                {errors.targetAmountReais.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="goal-current"
              className="text-sm font-medium text-slate-700"
            >
              Valor atual
            </label>
            <input
              id="goal-current"
              inputMode="decimal"
              {...register("currentAmountReais")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              placeholder="Ex.: 0,00"
            />
            {errors.currentAmountReais ? (
              <p className="text-sm text-red-700">
                {errors.currentAmountReais.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="goal-deadline"
            className="text-sm font-medium text-slate-700"
          >
            Prazo opcional
          </label>
          <input
            id="goal-deadline"
            type="date"
            {...register("deadline")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </div>

      {message ? (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            isSuccess ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Criando..." : "Criar meta"}
      </button>
    </form>
  );
}

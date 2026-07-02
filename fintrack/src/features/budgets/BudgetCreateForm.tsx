"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  budgetFormSchema,
  type BudgetFormValues,
  type BudgetFilters,
} from "@/features/budgets/budgetSchemas";
import { createBudgetAction } from "@/server/budgets/actions";

type BudgetCategoryOption = {
  id: string;
  name: string;
  color: string | null;
};

type BudgetCreateFormProps = {
  categories: BudgetCategoryOption[];
  filters: BudgetFilters;
};

export function BudgetCreateForm({
  categories,
  filters,
}: BudgetCreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: "",
      month: filters.month,
      year: filters.year,
      limitReais: "",
    },
  });

  function onSubmit(values: BudgetFormValues) {
    setMessage(null);

    startTransition(async () => {
      const result = await createBudgetAction(values);

      setIsSuccess(result.success);
      setMessage(result.message);

      if (result.success) {
        reset({
          categoryId: "",
          month: values.month,
          year: values.year,
          limitReais: "",
        });
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-950">Novo orçamento</h2>
      <p className="mt-2 text-sm text-slate-600">
        Defina um limite mensal para uma categoria de despesa.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="space-y-2">
          <label
            htmlFor="budget-category"
            className="text-sm font-medium text-slate-700"
          >
            Categoria de despesa
          </label>
          <select
            id="budget-category"
            {...register("categoryId")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="text-sm text-red-700">{errors.categoryId.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="budget-month"
              className="text-sm font-medium text-slate-700"
            >
              Mês
            </label>
            <input
              id="budget-month"
              type="number"
              min={1}
              max={12}
              {...register("month")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="budget-year"
              className="text-sm font-medium text-slate-700"
            >
              Ano
            </label>
            <input
              id="budget-year"
              type="number"
              {...register("year")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="budget-limit"
            className="text-sm font-medium text-slate-700"
          >
            Limite em reais
          </label>
          <input
            id="budget-limit"
            inputMode="decimal"
            {...register("limitReais")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            placeholder="Ex.: 900,00"
          />
          {errors.limitReais ? (
            <p className="text-sm text-red-700">{errors.limitReais.message}</p>
          ) : null}
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
        disabled={isPending || categories.length === 0}
        className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Criando..." : "Criar orçamento"}
      </button>
    </form>
  );
}

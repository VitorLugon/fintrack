"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  categoryFormSchema,
  type CategoryListItem,
  getCategoryTypeLabel,
  type CategoryFormValues,
} from "@/features/categories/categorySchemas";
import {
  inactivateCategoryAction,
  updateCategoryAction,
} from "@/server/categories/actions";

type CategoryEditFormProps = {
  category: CategoryListItem;
};

export function CategoryEditForm({ category }: CategoryEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      type: category.type,
      color: category.color ?? "#10b981",
      icon: category.icon ?? "",
    },
  });

  function handleResult(result: { success: boolean; message: string }) {
    setIsSuccess(result.success);
    setMessage(result.message);

    if (result.success) {
      router.refresh();
    }
  }

  function onSubmit(values: CategoryFormValues) {
    setMessage(null);

    startTransition(async () => {
      const result = await updateCategoryAction({
        id: category.id,
        ...values,
      });

      handleResult(result);
    });
  }

  function onInactivate() {
    setMessage(null);

    startTransition(async () => {
      const result = await inactivateCategoryAction({ id: category.id });

      handleResult(result);
    });
  }

  const isInactive = category.status === "INACTIVE";
  const hasFinancialLinks =
    category._count.transactions > 0 || category._count.budgets > 0;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-950">
              {category.name}
            </h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                category.type === "INCOME"
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-orange-50 text-orange-800"
              }`}
            >
              {getCategoryTypeLabel(category.type)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                isInactive
                  ? "bg-slate-100 text-slate-600"
                  : "bg-blue-50 text-blue-800"
              }`}
            >
              {isInactive ? "Inativa" : "Ativa"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {category._count.transactions} transações ·{" "}
            {category._count.budgets} orçamentos
          </p>
        </div>

        {category.color ? (
          <span
            aria-label={`Cor da categoria ${category.name}`}
            className="mt-1 size-6 rounded-full border border-slate-200"
            style={{ backgroundColor: category.color }}
          />
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4">
        <div className="grid gap-4 md:grid-cols-[1fr_160px]">
          <div className="space-y-2">
            <label
              htmlFor={`name-${category.id}`}
              className="text-sm font-medium text-slate-700"
            >
              Nome
            </label>
            <input
              id={`name-${category.id}`}
              {...register("name")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
            {errors.name ? (
              <p className="text-sm text-red-700">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`type-${category.id}`}
              className="text-sm font-medium text-slate-700"
            >
              Tipo
            </label>
            <select
              id={`type-${category.id}`}
              disabled={hasFinancialLinks}
              {...register("type")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
            {hasFinancialLinks ? (
              <p className="text-xs text-slate-500">
                O tipo fica travado porque a categoria já tem uso financeiro.
              </p>
            ) : null}
            {errors.type ? (
              <p className="text-sm text-red-700">{errors.type.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor={`color-${category.id}`}
              className="text-sm font-medium text-slate-700"
            >
              Cor
            </label>
            <input
              id={`color-${category.id}`}
              type="color"
              {...register("color")}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-2 py-1"
            />
            {errors.color ? (
              <p className="text-sm text-red-700">{errors.color.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`icon-${category.id}`}
              className="text-sm font-medium text-slate-700"
            >
              Ícone opcional
            </label>
            <input
              id={`icon-${category.id}`}
              {...register("icon")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              placeholder="Ex.: wallet"
            />
            {errors.icon ? (
              <p className="text-sm text-red-700">{errors.icon.message}</p>
            ) : null}
          </div>
        </div>

        {message ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm ${
              isSuccess
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Salvando..." : "Salvar alterações"}
          </button>

          {!isInactive ? (
            <button
              type="button"
              onClick={onInactivate}
              disabled={isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Inativar
            </button>
          ) : null}
        </div>
      </form>
    </article>
  );
}

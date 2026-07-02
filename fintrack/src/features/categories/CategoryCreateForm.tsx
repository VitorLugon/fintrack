"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/features/categories/categorySchemas";
import { createCategoryAction } from "@/server/categories/actions";

const defaultValues: CategoryFormValues = {
  name: "",
  type: "EXPENSE",
  color: "#10b981",
  icon: "",
};

export function CategoryCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  function onSubmit(values: CategoryFormValues) {
    setMessage(null);

    startTransition(async () => {
      const result = await createCategoryAction(values);

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
      <h2 className="text-xl font-bold text-slate-950">Nova categoria</h2>
      <p className="mt-2 text-sm text-slate-600">
        Crie categorias separadas para receitas e despesas.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            placeholder="Ex.: Mercado"
          />
          {errors.name ? (
            <p className="text-sm text-red-700">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="type"
            {...register("type")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
          {errors.type ? (
            <p className="text-sm text-red-700">{errors.type.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-2">
            <label
              htmlFor="color"
              className="text-sm font-medium text-slate-700"
            >
              Cor
            </label>
            <input
              id="color"
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
              htmlFor="icon"
              className="text-sm font-medium text-slate-700"
            >
              Ícone opcional
            </label>
            <input
              id="icon"
              {...register("icon")}
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              placeholder="Ex.: shopping-bag"
            />
            {errors.icon ? (
              <p className="text-sm text-red-700">{errors.icon.message}</p>
            ) : null}
          </div>
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
        {isPending ? "Criando..." : "Criar categoria"}
      </button>
    </form>
  );
}

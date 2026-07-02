"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/features/transactions/transactionSchemas";
import type { TransactionCategoryOption } from "@/features/transactions/transactionRules";
import { createTransactionAction } from "@/server/transactions/actions";

type TransactionFormProps = {
  categories: TransactionCategoryOption[];
};

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

const defaultValues: TransactionFormValues = {
  title: "",
  description: "",
  amountReais: "",
  type: "EXPENSE",
  date: getTodayInputValue(),
  categoryId: "",
};

export function TransactionForm({ categories }: TransactionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });

  const selectedType = useWatch({ control, name: "type" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const compatibleCategories = useMemo(
    () => categories.filter((category) => category.type === selectedType),
    [categories, selectedType],
  );

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.id === selectedCategoryId,
    );

    if (selectedCategory && selectedCategory.type !== selectedType) {
      setValue("categoryId", "");
    }
  }, [categories, selectedCategoryId, selectedType, setValue]);

  function onSubmit(values: TransactionFormValues) {
    setMessage(null);

    startTransition(async () => {
      const result = await createTransactionAction(values);

      setIsSuccess(result.success);
      setMessage(result.message);

      if (result.success) {
        reset({
          ...defaultValues,
          type: values.type,
          date: values.date,
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
      <h2 className="text-xl font-bold text-slate-950">Nova transação</h2>
      <p className="mt-2 text-sm text-slate-600">
        Informe o valor em reais. O servidor salvará em centavos.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="transaction-type"
              className="text-sm font-medium text-slate-700"
            >
              Tipo
            </label>
            <select
              id="transaction-type"
              {...register("type")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="transaction-date"
              className="text-sm font-medium text-slate-700"
            >
              Data
            </label>
            <input
              id="transaction-date"
              type="date"
              {...register("date")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            />
            {errors.date ? (
              <p className="text-sm text-red-700">{errors.date.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="transaction-title"
            className="text-sm font-medium text-slate-700"
          >
            Título
          </label>
          <input
            id="transaction-title"
            {...register("title")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            placeholder="Ex.: Compra no mercado"
          />
          {errors.title ? (
            <p className="text-sm text-red-700">{errors.title.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="transaction-amount"
              className="text-sm font-medium text-slate-700"
            >
              Valor em reais
            </label>
            <input
              id="transaction-amount"
              inputMode="decimal"
              {...register("amountReais")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
              placeholder="Ex.: 120,50"
            />
            {errors.amountReais ? (
              <p className="text-sm text-red-700">
                {errors.amountReais.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="transaction-category"
              className="text-sm font-medium text-slate-700"
            >
              Categoria
            </label>
            <select
              id="transaction-category"
              {...register("categoryId")}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">Sem categoria</option>
              {compatibleCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="transaction-description"
            className="text-sm font-medium text-slate-700"
          >
            Descrição opcional
          </label>
          <textarea
            id="transaction-description"
            {...register("description")}
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
            placeholder="Observação rápida sobre esta transação"
          />
          {errors.description ? (
            <p className="text-sm text-red-700">
              {errors.description.message}
            </p>
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
        disabled={isPending}
        className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Salvando..." : "Criar transação"}
      </button>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/features/transactions/transactionSchemas";
import {
  formatCentsToInputValue,
  type TransactionCategoryOption,
  type TransactionTypeValue,
} from "@/features/transactions/transactionRules";
import {
  deleteTransactionAction,
  updateTransactionAction,
} from "@/server/transactions/actions";

type TransactionEditFormProps = {
  transaction: {
    id: string;
    title: string;
    description: string | null;
    amountCents: number;
    type: TransactionTypeValue;
    date: Date;
    categoryId: string | null;
  };
  categories: TransactionCategoryOption[];
};

export function TransactionEditForm({
  transaction,
  categories,
}: TransactionEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      title: transaction.title,
      description: transaction.description ?? "",
      amountReais: formatCentsToInputValue(transaction.amountCents),
      type: transaction.type,
      date: transaction.date.toISOString().slice(0, 10),
      categoryId: transaction.categoryId ?? "",
    },
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

  function handleResult(result: { success: boolean; message: string }) {
    setIsSuccess(result.success);
    setMessage(result.message);

    if (result.success) {
      router.refresh();
    }
  }

  function onSubmit(values: TransactionFormValues) {
    setMessage(null);

    startTransition(async () => {
      const result = await updateTransactionAction({
        id: transaction.id,
        ...values,
      });

      handleResult(result);
    });
  }

  function onDelete() {
    setMessage(null);

    startTransition(async () => {
      const result = await deleteTransactionAction({ id: transaction.id });

      handleResult(result);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4">
      <div className="grid gap-4 md:grid-cols-[1fr_140px_minmax(11.5rem,170px)]">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Título</label>
          <input
            {...register("title")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
          {errors.title ? (
            <p className="text-sm text-red-700">{errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tipo</label>
          <select
            {...register("type")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Data</label>
          <input
            type="date"
            {...register("date")}
            className="w-full min-w-[11.5rem] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Valor</label>
          <input
            inputMode="decimal"
            {...register("amountReais")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
          {errors.amountReais ? (
            <p className="text-sm text-red-700">{errors.amountReais.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Categoria
          </label>
          <select
            {...register("categoryId")}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
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
        <label className="text-sm font-medium text-slate-700">
          Descrição opcional
        </label>
        <textarea
          {...register("description")}
          rows={2}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        />
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-70"
        >
          {isPending ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isPending}
          className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-70"
        >
          Excluir
        </button>
      </div>
    </form>
  );
}

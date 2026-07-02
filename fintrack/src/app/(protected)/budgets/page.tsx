import type { Metadata } from "next";
import { BudgetCreateForm } from "@/features/budgets/BudgetCreateForm";
import { BudgetList } from "@/features/budgets/BudgetList";
import { BudgetPeriodFilter } from "@/features/budgets/BudgetPeriodFilter";
import {
  listBudgetsForCurrentUser,
  listExpenseCategoriesForBudgetForm,
} from "@/server/budgets/queries";

export const metadata: Metadata = {
  title: "Orçamentos",
};

type BudgetsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const rawFilters = searchParams ? await searchParams : {};
  const [categories, result] = await Promise.all([
    listExpenseCategoriesForBudgetForm(),
    listBudgetsForCurrentUser(rawFilters),
  ]);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[360px_1fr]">
      <aside>
        <div className="sticky top-6 space-y-4">
          <BudgetCreateForm categories={categories} filters={result.filters} />

          {categories.length === 0 ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              Crie uma categoria de despesa ativa antes de cadastrar
              orçamentos.
            </div>
          ) : null}
        </div>
      </aside>

      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Planejamento mensal
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Orçamentos
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Defina limites por categoria de despesa e acompanhe quanto já foi
              usado no mês.
            </p>
          </div>

          <BudgetPeriodFilter filters={result.filters} />
        </div>

        <BudgetList budgets={result.budgets} />
      </div>
    </section>
  );
}

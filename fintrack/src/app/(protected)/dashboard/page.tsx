import type { Metadata } from "next";
import { BudgetAlerts } from "@/features/dashboard/BudgetAlerts";
import { DashboardCharts } from "@/features/dashboard/DashboardCharts";
import { DashboardPeriodFilter } from "@/features/dashboard/DashboardPeriodFilter";
import { DashboardSummaryCards } from "@/features/dashboard/DashboardSummaryCards";
import { LatestTransactions } from "@/features/dashboard/LatestTransactions";
import { getDashboardData } from "@/server/dashboard/queries";

export const metadata: Metadata = {
  title: "Dashboard",
};

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const rawFilters = searchParams ? await searchParams : {};
  const dashboard = await getDashboardData(rawFilters);

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Dashboard financeiro
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Visão mensal
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Acompanhe saldo, receitas, despesas, categorias e alertas de
            orçamento do período selecionado.
          </p>
        </div>

        <DashboardPeriodFilter filters={dashboard.filters} />
      </div>

      {dashboard.isEmpty ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          Nenhuma transação encontrada para este mês. Crie receitas ou despesas
          para preencher o dashboard.
        </div>
      ) : null}

      <DashboardSummaryCards
        balanceCents={dashboard.summary.balanceCents}
        incomeCents={dashboard.summary.incomeCents}
        expenseCents={dashboard.summary.expenseCents}
      />

      <BudgetAlerts alerts={dashboard.budgetAlerts} />

      <DashboardCharts
        expensesByCategory={dashboard.expensesByCategory}
        incomeVsExpense={dashboard.incomeVsExpense}
      />

      <LatestTransactions transactions={dashboard.latestTransactions} />
    </section>
  );
}

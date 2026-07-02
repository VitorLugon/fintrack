import type { Metadata } from "next";
import { TransactionFilters } from "@/features/transactions/TransactionFilters";
import { TransactionForm } from "@/features/transactions/TransactionForm";
import { TransactionList } from "@/features/transactions/TransactionList";
import { formatCentsToBRL } from "@/features/transactions/transactionRules";
import {
  listActiveTransactionCategories,
  listTransactionFilterCategories,
  listTransactionsForCurrentUser,
} from "@/server/transactions/queries";

export const metadata: Metadata = {
  title: "Transações",
};

type TransactionsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const rawFilters = searchParams ? await searchParams : {};
  const [activeCategories, filterCategories, result] = await Promise.all([
    listActiveTransactionCategories(),
    listTransactionFilterCategories(),
    listTransactionsForCurrentUser(rawFilters),
  ]);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[360px_1fr]">
      <aside>
        <div className="sticky top-6">
          <TransactionForm categories={activeCategories} />
        </div>
      </aside>

      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Área protegida
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Transações
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Registre receitas e despesas, filtre por período, tipo e categoria.
            Todas as consultas usam o usuário autenticado.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-950/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Receitas</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              {formatCentsToBRL(result.summary.incomeCents)}
            </p>
          </div>
          <div className="rounded-3xl border border-red-950/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Despesas</p>
            <p className="mt-2 text-2xl font-bold text-red-700">
              {formatCentsToBRL(result.summary.expenseCents)}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Saldo do filtro</p>
            <p
              className={`mt-2 text-2xl font-bold ${
                result.summary.balanceCents >= 0
                  ? "text-slate-950"
                  : "text-red-700"
              }`}
            >
              {formatCentsToBRL(result.summary.balanceCents)}
            </p>
          </div>
        </div>

        <TransactionFilters
          filters={result.filters}
          categories={filterCategories}
        />

        <TransactionList
          transactions={result.transactions}
          categories={filterCategories}
        />
      </div>
    </section>
  );
}

import { TransactionEditForm } from "@/features/transactions/TransactionEditForm";
import {
  formatCentsToBRL,
  type TransactionCategoryOption,
  type TransactionTypeValue,
} from "@/features/transactions/transactionRules";

type TransactionListProps = {
  transactions: Array<{
    id: string;
    title: string;
    description: string | null;
    amountCents: number;
    type: TransactionTypeValue;
    date: Date;
    categoryId: string | null;
    category: {
      id: string;
      name: string;
      type: TransactionTypeValue;
      status: "ACTIVE" | "INACTIVE";
      color: string | null;
    } | null;
  }>;
  categories: TransactionCategoryOption[];
};

export function TransactionList({
  transactions,
  categories,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        Nenhuma transação encontrada para os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === "INCOME";

        return (
          <article
            key={transaction.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-950">
                    {transaction.title}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-orange-50 text-orange-800"
                    }`}
                  >
                    {isIncome ? "Receita" : "Despesa"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {new Intl.DateTimeFormat("pt-BR", {
                    timeZone: "UTC",
                  }).format(transaction.date)}
                  {transaction.category ? ` · ${transaction.category.name}` : ""}
                </p>
              </div>

              <p
                className={`text-lg font-bold ${
                  isIncome ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatCentsToBRL(transaction.amountCents)}
              </p>
            </div>

            <TransactionEditForm
              transaction={transaction}
              categories={categories}
            />
          </article>
        );
      })}
    </div>
  );
}

import { formatCentsToBRL } from "@/features/transactions/transactionRules";

type LatestTransaction = {
  id: string;
  title: string;
  amountCents: number;
  type: "INCOME" | "EXPENSE";
  date: Date;
  categoryName: string | null;
};

type LatestTransactionsProps = {
  transactions: LatestTransaction[];
};

export function LatestTransactions({ transactions }: LatestTransactionsProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">Últimas transações</h2>
      {transactions.length > 0 ? (
        <div className="mt-4 divide-y divide-slate-100">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "INCOME";

            return (
              <article
                key={transaction.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-950">
                    {transaction.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Intl.DateTimeFormat("pt-BR", {
                      timeZone: "UTC",
                    }).format(transaction.date)}
                    {transaction.categoryName
                      ? ` · ${transaction.categoryName}`
                      : ""}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    isIncome ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCentsToBRL(transaction.amountCents)}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          Nenhuma transação encontrada neste período.
        </p>
      )}
    </section>
  );
}

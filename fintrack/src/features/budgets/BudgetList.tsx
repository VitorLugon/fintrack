import { formatCentsToBRL } from "@/features/transactions/transactionRules";

type BudgetListProps = {
  budgets: Array<{
    id: string;
    categoryName: string;
    categoryColor: string | null;
    limitCents: number;
    spentCents: number;
    percentage: number;
    cappedPercentage: number;
    isExceeded: boolean;
  }>;
};

export function BudgetList({ budgets }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        Nenhum orçamento encontrado para este período.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {budgets.map((budget) => (
        <article
          key={budget.id}
          className={`rounded-3xl border bg-white p-5 shadow-sm ${
            budget.isExceeded ? "border-red-200" : "border-slate-200"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor: budget.categoryColor ?? "#047857",
                  }}
                />
                <h2 className="text-lg font-bold text-slate-950">
                  {budget.categoryName}
                </h2>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Limite mensal: {formatCentsToBRL(budget.limitCents)}
              </p>
            </div>

            {budget.isExceeded ? (
              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                Ultrapassado
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                Dentro do limite
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Limite</p>
              <p className="font-bold text-slate-950">
                {formatCentsToBRL(budget.limitCents)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Gasto</p>
              <p
                className={`font-bold ${
                  budget.isExceeded ? "text-red-700" : "text-slate-950"
                }`}
              >
                {formatCentsToBRL(budget.spentCents)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Uso</p>
              <p
                className={`font-bold ${
                  budget.isExceeded ? "text-red-700" : "text-slate-950"
                }`}
              >
                {budget.percentage}%
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                budget.isExceeded ? "bg-red-600" : "bg-emerald-600"
              }`}
              style={{ width: `${budget.cappedPercentage}%` }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

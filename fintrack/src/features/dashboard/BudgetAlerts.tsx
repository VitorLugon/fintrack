import { formatCentsToBRL } from "@/features/transactions/transactionRules";

type BudgetAlert = {
  budgetId: string;
  categoryName: string;
  spentCents: number;
  limitCents: number;
  percentage: number;
};

type BudgetAlertsProps = {
  alerts: BudgetAlert[];
};

export function BudgetAlerts({ alerts }: BudgetAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-3xl border border-emerald-950/10 bg-emerald-50 p-5 text-sm text-emerald-900">
        Nenhum orçamento ultrapassado neste período.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-5">
      <h2 className="text-lg font-bold text-red-900">
        Alertas de orçamento
      </h2>
      <div className="mt-4 grid gap-3">
        {alerts.map((alert) => (
          <article
            key={alert.budgetId}
            className="rounded-2xl border border-red-200 bg-white p-4 text-sm"
          >
            <p className="font-semibold text-red-900">{alert.categoryName}</p>
            <p className="mt-1 text-red-700">
              Gasto de {formatCentsToBRL(alert.spentCents)} para limite de{" "}
              {formatCentsToBRL(alert.limitCents)} ({alert.percentage}%).
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

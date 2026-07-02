import { formatCentsToBRL } from "@/features/transactions/transactionRules";

type DashboardSummaryCardsProps = {
  balanceCents: number;
  incomeCents: number;
  expenseCents: number;
};

export function DashboardSummaryCards({
  balanceCents,
  incomeCents,
  expenseCents,
}: DashboardSummaryCardsProps) {
  const cards = [
    {
      label: "Saldo mensal",
      value: balanceCents,
      className: balanceCents >= 0 ? "text-slate-950" : "text-red-700",
    },
    {
      label: "Receitas do mês",
      value: incomeCents,
      className: "text-emerald-700",
    },
    {
      label: "Despesas do mês",
      value: expenseCents,
      className: "text-red-700",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className={`mt-2 text-2xl font-bold ${card.className}`}>
            {formatCentsToBRL(card.value)}
          </p>
        </article>
      ))}
    </div>
  );
}

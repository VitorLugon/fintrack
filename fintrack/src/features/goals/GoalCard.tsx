import { GoalActions } from "@/features/goals/GoalActions";
import { GoalCurrentAmountForm } from "@/features/goals/GoalCurrentAmountForm";
import type {
  GoalListItem,
  GoalStatusValue,
} from "@/features/goals/goalTypes";
import { formatCentsToBRL } from "@/features/transactions/transactionRules";

type GoalCardProps = {
  goal: GoalListItem;
};

function getStatusLabel(status: GoalStatusValue) {
  if (status === "COMPLETED") {
    return "Concluída";
  }

  if (status === "CANCELLED") {
    return "Cancelada";
  }

  return "Em andamento";
}

export function GoalCard({ goal }: GoalCardProps) {
  const isCancelled = goal.status === "CANCELLED";
  const isCompleted = goal.status === "COMPLETED";

  return (
    <article
      className={`rounded-3xl border bg-white p-5 shadow-sm ${
        isCancelled ? "border-slate-200 opacity-75" : "border-slate-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-950">{goal.name}</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-700"
                  : isCancelled
                    ? "bg-slate-100 text-slate-600"
                    : "bg-blue-50 text-blue-700"
              }`}
            >
              {getStatusLabel(goal.status)}
            </span>
          </div>
          {goal.deadline ? (
            <p className="mt-2 text-sm text-slate-500">
              Prazo:{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                timeZone: "UTC",
              }).format(goal.deadline)}
            </p>
          ) : null}
        </div>

        <p className="text-lg font-bold text-slate-950">
          {goal.progress.percentage}%
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Valor atual</p>
          <p className="font-bold text-slate-950">
            {formatCentsToBRL(goal.currentAmountCents)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Valor alvo</p>
          <p className="font-bold text-slate-950">
            {formatCentsToBRL(goal.targetAmountCents)}
          </p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            isCompleted ? "bg-emerald-600" : "bg-blue-600"
          }`}
          style={{ width: `${goal.progress.cappedPercentage}%` }}
        />
      </div>

      <GoalCurrentAmountForm
        goalId={goal.id}
        currentAmountCents={goal.currentAmountCents}
        disabled={isCancelled}
      />

      <GoalActions goalId={goal.id} status={goal.status} />
    </article>
  );
}

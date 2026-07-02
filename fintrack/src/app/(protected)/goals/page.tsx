import type { Metadata } from "next";
import { GoalCreateForm } from "@/features/goals/GoalCreateForm";
import { GoalList } from "@/features/goals/GoalList";
import { listGoalsForCurrentUser } from "@/server/goals/queries";

export const metadata: Metadata = {
  title: "Metas",
};

export default async function GoalsPage() {
  const goals = await listGoalsForCurrentUser();

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[360px_1fr]">
      <aside>
        <div className="sticky top-6">
          <GoalCreateForm />
        </div>
      </aside>

      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Planejamento financeiro
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Metas financeiras
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Crie metas, atualize o valor acumulado e acompanhe o progresso
            percentual com segurança.
          </p>
        </div>

        <GoalList goals={goals} />
      </div>
    </section>
  );
}

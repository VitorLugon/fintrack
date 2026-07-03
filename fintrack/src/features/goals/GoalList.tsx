import { GoalCard } from "@/features/goals/GoalCard";
import type { GoalListItem } from "@/features/goals/goalTypes";

type GoalListProps = {
  goals: GoalListItem[];
};

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        Nenhuma meta financeira cadastrada ainda.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

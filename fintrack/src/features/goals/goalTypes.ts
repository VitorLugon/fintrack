export type GoalStatusValue = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type GoalListItem = {
  id: string;
  name: string;
  targetAmountCents: number;
  currentAmountCents: number;
  status: GoalStatusValue;
  deadline: Date | null;
  progress: {
    percentage: number;
    cappedPercentage: number;
    isCompleted: boolean;
    isExceeded: boolean;
  };
};

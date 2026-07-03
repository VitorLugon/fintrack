import { describe, expect, it } from "vitest";
import {
  goalCurrentAmountSchema,
  goalFormSchema,
} from "@/features/goals/goalSchemas";

const validGoal = {
  name: "Reserva de emergência",
  targetAmountReais: "10000,00",
  currentAmountReais: "1500,00",
  deadline: "2027-12-31",
};

describe("goalFormSchema", () => {
  it("aceita uma meta válida com data", () => {
    const result = goalFormSchema.safeParse(validGoal);

    expect(result.success).toBe(true);
  });

  it("aceita uma meta válida sem data", () => {
    const result = goalFormSchema.safeParse({
      ...validGoal,
      deadline: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita valor alvo zerado", () => {
    const result = goalFormSchema.safeParse({
      ...validGoal,
      targetAmountReais: "0,00",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita valor atual negativo", () => {
    const result = goalCurrentAmountSchema.safeParse({
      id: "goal-1",
      currentAmountReais: "-10,00",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita data inexistente mesmo com formato correto", () => {
    const result = goalFormSchema.safeParse({
      ...validGoal,
      deadline: "2027-02-31",
    });

    expect(result.success).toBe(false);
  });
});

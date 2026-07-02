import { describe, expect, it } from "vitest";
import { categoryFormSchema } from "@/features/categories/categorySchemas";

describe("categoryFormSchema", () => {
  it("aceita uma categoria válida", () => {
    const result = categoryFormSchema.safeParse({
      name: "Alimentação",
      type: "EXPENSE",
      color: "#10b981",
      icon: "utensils",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    const result = categoryFormSchema.safeParse({
      name: "A",
      type: "EXPENSE",
      color: "#10b981",
      icon: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita tipo inválido", () => {
    const result = categoryFormSchema.safeParse({
      name: "Bônus",
      type: "TRANSFER",
      color: "#10b981",
      icon: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita cor fora do formato hexadecimal", () => {
    const result = categoryFormSchema.safeParse({
      name: "Mercado",
      type: "EXPENSE",
      color: "verde",
      icon: "",
    });

    expect(result.success).toBe(false);
  });
});

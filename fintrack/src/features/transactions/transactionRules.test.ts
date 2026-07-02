import { describe, expect, it } from "vitest";
import {
  calculateTransactionSummary,
  parseMoneyToCents,
} from "@/features/transactions/transactionRules";

describe("parseMoneyToCents", () => {
  it("converte reais com vírgula para centavos", () => {
    expect(parseMoneyToCents("10,50")).toBe(1050);
    expect(parseMoneyToCents("1.250,75")).toBe(125075);
  });

  it("converte reais com ponto decimal para centavos", () => {
    expect(parseMoneyToCents("99.90")).toBe(9990);
  });

  it("rejeita valores inválidos ou zerados", () => {
    expect(parseMoneyToCents("0")).toBeNull();
    expect(parseMoneyToCents("-10")).toBeNull();
    expect(parseMoneyToCents("10,999")).toBeNull();
  });
});

describe("calculateTransactionSummary", () => {
  it("soma receitas, despesas e saldo em centavos", () => {
    const summary = calculateTransactionSummary([
      { amountCents: 500000, type: "INCOME" },
      { amountCents: 125050, type: "INCOME" },
      { amountCents: 200000, type: "EXPENSE" },
      { amountCents: 5099, type: "EXPENSE" },
    ]);

    expect(summary).toEqual({
      incomeCents: 625050,
      expenseCents: 205099,
      balanceCents: 419951,
    });
  });
});

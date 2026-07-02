import { z } from "zod";

export const transactionTypes = ["INCOME", "EXPENSE"] as const;

export type TransactionTypeValue = (typeof transactionTypes)[number];

export type TransactionSummaryInput = {
  amountCents: number;
  type: TransactionTypeValue;
};

export type TransactionCategoryOption = {
  id: string;
  name: string;
  type: TransactionTypeValue;
  color: string | null;
};

export function parseMoneyToCents(value: string) {
  const normalizedValue = value
    .trim()
    .replace(/^R\$\s?/, "")
    .replace(/\s/g, "");

  const decimalValue = normalizedValue.includes(",")
    ? normalizedValue.replace(/\./g, "").replace(",", ".")
    : normalizedValue;

  if (!/^\d+(\.\d{1,2})?$/.test(decimalValue)) {
    return null;
  }

  const [reaisRaw, centsRaw = ""] = decimalValue.split(".");
  const reais = Number(reaisRaw);
  const cents = Number(centsRaw.padEnd(2, "0"));
  const amountCents = reais * 100 + cents;

  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    return null;
  }

  return amountCents;
}

export function formatCentsToBRL(amountCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountCents / 100);
}

export function formatCentsToInputValue(amountCents: number) {
  const reais = Math.floor(amountCents / 100);
  const cents = String(amountCents % 100).padStart(2, "0");

  return `${reais},${cents}`;
}

export function calculateTransactionSummary(
  transactions: TransactionSummaryInput[],
) {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === "INCOME") {
        return {
          ...summary,
          incomeCents: summary.incomeCents + transaction.amountCents,
          balanceCents: summary.balanceCents + transaction.amountCents,
        };
      }

      return {
        ...summary,
        expenseCents: summary.expenseCents + transaction.amountCents,
        balanceCents: summary.balanceCents - transaction.amountCents,
      };
    },
    {
      incomeCents: 0,
      expenseCents: 0,
      balanceCents: 0,
    },
  );
}

export const moneyInputSchema = z
  .string()
  .trim()
  .min(1, "Informe o valor.")
  .refine((value) => parseMoneyToCents(value) !== null, {
    message: "Informe um valor em reais maior que zero. Ex.: 10,50.",
  });

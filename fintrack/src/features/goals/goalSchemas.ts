import { z } from "zod";

const moneyInputMessage = "Informe um valor válido em reais. Ex.: 100,00.";

function isValidDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function parseNonNegativeMoneyToCents(value: string) {
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

  if (!Number.isSafeInteger(amountCents) || amountCents < 0) {
    return null;
  }

  return amountCents;
}

export const positiveMoneyInputSchema = z
  .string()
  .trim()
  .min(1, "Informe o valor alvo.")
  .refine((value) => {
    const amountCents = parseNonNegativeMoneyToCents(value);

    return amountCents !== null && amountCents > 0;
  }, "O valor alvo deve ser maior que zero.");

export const nonNegativeMoneyInputSchema = z
  .string()
  .trim()
  .min(1, "Informe o valor atual.")
  .refine((value) => parseNonNegativeMoneyToCents(value) !== null, {
    message: moneyInputMessage,
  });

export const goalFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(80, "Use no máximo 80 caracteres."),
  targetAmountReais: positiveMoneyInputSchema,
  currentAmountReais: nonNegativeMoneyInputSchema,
  deadline: z
    .string()
    .refine((value) => value === "" || isValidDateInput(value), {
      message: "Informe uma data válida.",
    })
    .or(z.literal("")),
});

export const goalCurrentAmountSchema = z.object({
  id: z.string().min(1, "Meta inválida."),
  currentAmountReais: nonNegativeMoneyInputSchema,
});

export const goalIdSchema = z.object({
  id: z.string().min(1, "Meta inválida."),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
export type GoalCurrentAmountValues = z.infer<typeof goalCurrentAmountSchema>;

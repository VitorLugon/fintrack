import { z } from "zod";
import { moneyInputSchema, transactionTypes } from "./transactionRules";

const currentYear = new Date().getFullYear();

function isValidDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const transactionFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Informe um título com pelo menos 2 caracteres.")
    .max(80, "Use no máximo 80 caracteres."),
  description: z
    .string()
    .trim()
    .max(200, "Use no máximo 200 caracteres.")
    .or(z.literal("")),
  amountReais: moneyInputSchema,
  type: z.enum(transactionTypes, {
    error: "Selecione receita ou despesa.",
  }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
    .refine(isValidDateInput, "Informe uma data válida."),
  categoryId: z.string().trim().or(z.literal("")),
});

export const transactionUpdateSchema = transactionFormSchema.extend({
  id: z.string().min(1, "Transação inválida."),
});

export const transactionIdSchema = z.object({
  id: z.string().min(1, "Transação inválida."),
});

export const transactionFiltersSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).catch(new Date().getMonth() + 1),
  year: z.coerce.number().int().min(2000).max(currentYear + 5).catch(currentYear),
  type: z.enum(["ALL", ...transactionTypes]).catch("ALL"),
  categoryId: z.string().trim().catch(""),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;

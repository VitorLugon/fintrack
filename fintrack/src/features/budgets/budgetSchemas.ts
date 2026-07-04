import { z } from "zod";
import { moneyInputSchema } from "@/features/transactions/transactionRules";

const currentYear = new Date().getFullYear();

export const budgetFormSchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria de despesa."),
  month: z.number().int().min(1, "Mês inválido.").max(12, "Mês inválido."),
  year: z
    .number()
    .int()
    .min(2000, "Ano inválido.")
    .max(currentYear + 5, "Ano muito distante."),
  limitReais: moneyInputSchema,
});

export const budgetFiltersSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).catch(new Date().getMonth() + 1),
  year: z.coerce.number().int().min(2000).max(currentYear + 5).catch(currentYear),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
export type BudgetFilters = z.infer<typeof budgetFiltersSchema>;

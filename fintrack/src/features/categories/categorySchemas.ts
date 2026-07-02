import { z } from "zod";

export const categoryTypes = ["INCOME", "EXPENSE"] as const;

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(40, "Use no máximo 40 caracteres."),
  type: z.enum(categoryTypes, {
    error: "Selecione se a categoria é de receita ou despesa.",
  }),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Informe uma cor hexadecimal válida.")
    .or(z.literal("")),
  icon: z
    .string()
    .trim()
    .max(40, "Use no máximo 40 caracteres para o ícone.")
    .or(z.literal("")),
});

export const categoryUpdateSchema = categoryFormSchema.extend({
  id: z.string().min(1, "Categoria inválida."),
});

export const categoryIdSchema = z.object({
  id: z.string().min(1, "Categoria inválida."),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type CategoryTypeValue = (typeof categoryTypes)[number];
export type CategoryStatusValue = "ACTIVE" | "INACTIVE";

export type CategoryListItem = {
  id: string;
  name: string;
  type: CategoryTypeValue;
  status: CategoryStatusValue;
  color: string | null;
  icon: string | null;
  _count: {
    transactions: number;
    budgets: number;
  };
};

export function getCategoryTypeLabel(type: CategoryTypeValue) {
  return type === "INCOME" ? "Receita" : "Despesa";
}

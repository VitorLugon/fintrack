import { z } from "zod";

const currentYear = new Date().getFullYear();

export const dashboardFiltersSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).catch(new Date().getMonth() + 1),
  year: z.coerce.number().int().min(2000).max(currentYear + 5).catch(currentYear),
});

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>;

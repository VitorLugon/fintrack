import type { BudgetFilters } from "@/features/budgets/budgetSchemas";

type BudgetPeriodFilterProps = {
  filters: BudgetFilters;
};

export function BudgetPeriodFilter({ filters }: BudgetPeriodFilterProps) {
  return (
    <form className="flex flex-wrap items-end gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="month" className="text-sm font-medium text-slate-700">
          Mês
        </label>
        <input
          id="month"
          name="month"
          type="number"
          min={1}
          max={12}
          defaultValue={filters.month}
          className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="year" className="text-sm font-medium text-slate-700">
          Ano
        </label>
        <input
          id="year"
          name="year"
          type="number"
          defaultValue={filters.year}
          className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Filtrar
      </button>
    </form>
  );
}

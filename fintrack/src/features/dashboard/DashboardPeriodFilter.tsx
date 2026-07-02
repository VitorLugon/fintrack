import type { DashboardFilters } from "@/features/dashboard/dashboardSchemas";

type DashboardPeriodFilterProps = {
  filters: DashboardFilters;
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function DashboardPeriodFilter({ filters }: DashboardPeriodFilterProps) {
  return (
    <form className="flex flex-wrap items-end gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="month" className="text-sm font-medium text-slate-700">
          Mês
        </label>
        <select
          id="month"
          name="month"
          defaultValue={filters.month}
          className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
        >
          {monthNames.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
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
        Atualizar
      </button>
    </form>
  );
}

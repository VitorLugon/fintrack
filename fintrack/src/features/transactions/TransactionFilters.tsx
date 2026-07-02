import type { TransactionFilters as TransactionFiltersType } from "./transactionSchemas";
import type { TransactionCategoryOption } from "./transactionRules";

type TransactionFiltersProps = {
  filters: TransactionFiltersType;
  categories: TransactionCategoryOption[];
};

export function TransactionFilters({
  filters,
  categories,
}: TransactionFiltersProps) {
  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <label htmlFor="month" className="text-sm font-medium text-slate-700">
            Mês
          </label>
          <select
            id="month"
            name="month"
            defaultValue={filters.month}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map(
              (month) => (
                <option key={month} value={month}>
                  {String(month).padStart(2, "0")}
                </option>
              ),
            )}
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
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            defaultValue={filters.type}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="ALL">Todos</option>
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="categoryId"
            className="text-sm font-medium text-slate-700"
          >
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={filters.categoryId}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Filtrar
      </button>
    </form>
  );
}

export default function BudgetsLoading() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[360px_1fr]">
      <aside>
        <div className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white" />
      </aside>

      <div className="space-y-8">
        <div className="space-y-3">
          <div className="h-4 w-40 animate-pulse rounded-full bg-emerald-100" />
          <div className="h-9 w-64 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-5 w-full max-w-xl animate-pulse rounded-xl bg-slate-200" />
        </div>

        <div className="grid gap-4">
          {["orçamento-1", "orçamento-2", "orçamento-3"].map((item) => (
            <div
              key={item}
              className="h-44 animate-pulse rounded-3xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

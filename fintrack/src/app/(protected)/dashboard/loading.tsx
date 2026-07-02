export default function DashboardLoading() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div className="space-y-3">
        <div className="h-4 w-40 animate-pulse rounded-full bg-emerald-100" />
        <div className="h-9 w-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-xl bg-slate-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["saldo", "receitas", "despesas"].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white" />
        <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white" />
      </div>
    </section>
  );
}

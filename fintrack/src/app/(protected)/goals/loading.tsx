export default function GoalsLoading() {
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

        {["meta-1", "meta-2"].map((item) => (
          <div
            key={item}
            className="h-60 animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </section>
  );
}

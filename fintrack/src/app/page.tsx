const foundationItems = [
  "Next.js com App Router e TypeScript",
  "Tailwind CSS e layout responsivo",
  "Prisma preparado para PostgreSQL",
  "Login demo com sessão protegida",
  "Vitest e Testing Library configurados",
];

export default function Home() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-28">
      <div>
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
          Projeto de portfólio fullstack
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Suas finanças com mais clareza e menos complicação.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          O FinTrack reunirá receitas, despesas, categorias, orçamentos e metas
          em um único lugar. A base técnica está pronta para receber as
          funcionalidades do MVP.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/login"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            Acessar demo
          </a>
          <a
            href="/dashboard"
            className="rounded-xl border border-emerald-950/10 bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
          >
            Ver área interna
          </a>
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-xl shadow-emerald-950/5">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Primeira etapa
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Fundação preparada
        </h2>
        <ul className="mt-6 space-y-4 text-slate-700">
          {foundationItems.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800"
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-emerald-950/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-emerald-950"
        >
          FinTrack
        </a>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
          Base do projeto
        </span>
      </div>
    </header>
  );
}

"use client";

type BudgetsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function BudgetsError({ error, reset }: BudgetsErrorProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
          Erro em orçamentos
        </p>
        <h1 className="mt-2 text-2xl font-bold text-red-950">
          Não foi possível carregar os orçamentos.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-red-800">
          {error.message || "Tente novamente em instantes."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Tentar novamente
        </button>
      </div>
    </section>
  );
}

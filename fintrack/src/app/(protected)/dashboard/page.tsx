import type { Metadata } from "next";
import { requireCurrentUser } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireCurrentUser();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-emerald-950/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Área interna protegida
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Olá, {user.name}
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          A autenticação já está funcionando. O dashboard financeiro real será
          implementado em uma próxima etapa, sempre filtrando dados pelo usuário
          autenticado.
        </p>
      </div>
    </section>
  );
}

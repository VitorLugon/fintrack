import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/LoginForm";
import { getCurrentUser } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
            Acesso demonstrativo
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Entre para visualizar a área interna do FinTrack.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Nesta etapa, o projeto usa o usuário demo criado pela seed. O
            cadastro público ficará para uma etapa futura.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-950/10 bg-white p-6 shadow-xl shadow-emerald-950/5">
          <h2 className="text-2xl font-bold text-slate-950">Login</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use <strong>demo@fintrack.com</strong> e senha{" "}
            <strong>demo123</strong>.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}

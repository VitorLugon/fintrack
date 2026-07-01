import Link from "next/link";
import { logoutAction } from "@/server/auth/actions";
import { getCurrentUser } from "@/server/auth/session";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-emerald-950/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-emerald-950"
        >
          FinTrack
        </Link>

        {user ? (
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="font-medium text-slate-700 transition hover:text-emerald-800"
            >
              Dashboard
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-800 transition hover:bg-emerald-100"
              >
                Sair
              </button>
            </form>
          </nav>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

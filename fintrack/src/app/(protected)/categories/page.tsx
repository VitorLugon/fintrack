import type { Metadata } from "next";
import { CategoryCreateForm } from "@/features/categories/CategoryCreateForm";
import { CategoryList } from "@/features/categories/CategoryList";
import {
  listActiveCategoriesForTransactionForm,
  listCategoriesForCurrentUser,
} from "@/server/categories/queries";

export const metadata: Metadata = {
  title: "Categorias",
};

export default async function CategoriesPage() {
  const [categories, activeTransactionCategories] = await Promise.all([
    listCategoriesForCurrentUser(),
    listActiveCategoriesForTransactionForm(),
  ]);

  const activeCategoriesCount = activeTransactionCategories.length;
  const categoryItems = categories.map((category) => ({
    ...category,
    type: category.type,
    status: category.status,
  }));

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[360px_1fr]">
      <aside>
        <div className="sticky top-6 space-y-4">
          <CategoryCreateForm />

          <div className="rounded-3xl border border-blue-950/10 bg-blue-50 p-5 text-sm text-blue-900">
            <p className="font-semibold">Categorias para transações</p>
            <p className="mt-2 leading-6">
              Hoje existem {activeCategoriesCount} categorias ativas. Somente
              categorias ativas serão oferecidas como opção padrão ao criar
              novas transações.
            </p>
          </div>
        </div>
      </aside>

      <div className="space-y-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Área protegida
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Categorias
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Organize receitas e despesas por categoria. Cada usuário visualiza
            e altera apenas as próprias categorias.
          </p>
        </div>

        <CategoryList
          title="Categorias de despesa"
          description="Usadas para classificar gastos e futuramente alimentar orçamento e dashboard."
          type="EXPENSE"
          categories={categoryItems}
        />

        <CategoryList
          title="Categorias de receita"
          description="Usadas para classificar entradas de dinheiro."
          type="INCOME"
          categories={categoryItems}
        />
      </div>
    </section>
  );
}

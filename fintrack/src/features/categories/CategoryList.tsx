import { CategoryEditForm } from "@/features/categories/CategoryEditForm";
import type {
  CategoryListItem,
  CategoryTypeValue,
} from "@/features/categories/categorySchemas";

type CategoryListProps = {
  title: string;
  description: string;
  type: CategoryTypeValue;
  categories: CategoryListItem[];
};

export function CategoryList({
  title,
  description,
  type,
  categories,
}: CategoryListProps) {
  const filteredCategories = categories.filter(
    (category) => category.type === type,
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      {filteredCategories.length > 0 ? (
        <div className="grid gap-4">
          {filteredCategories.map((category) => (
            <CategoryEditForm key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          Nenhuma categoria deste tipo ainda.
        </div>
      )}
    </section>
  );
}

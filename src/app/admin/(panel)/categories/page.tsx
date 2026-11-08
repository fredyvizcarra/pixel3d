import { getAllCategories } from "@/lib/admin-data"
import { Button } from "@/components/ui/button"
import {
  deleteCategory,
  saveCategory,
  seedSuggestedCategories,
} from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  const items = await getAllCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Categorías</h1>
        <p className="mt-1 text-slate-500">
          Estas categorías aparecen como filtros en el catálogo.
        </p>
      </div>

      <form
        action={saveCategory}
        className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row"
      >
        <input
          name="name"
          required
          placeholder="Nombre de la categoría"
          aria-label="Nombre de la categoría"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
        <Button
          type="submit"
          className="rounded-full bg-[#662d91] hover:bg-purple-700"
        >
          Crear
        </Button>
      </form>

      {items.length === 0 && (
        <form action={seedSuggestedCategories}>
          <Button type="submit" variant="outline" className="rounded-full">
            Crear categorías sugeridas
          </Button>
        </form>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {items.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No hay categorías todavía.
          </p>
        ) : (
          <ul>
            {items.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between border-t border-slate-100 px-4 py-3 first:border-t-0"
              >
                <div>
                  <p className="font-medium text-slate-900">{category.name}</p>
                  <p className="text-xs text-slate-400">{category.slug}</p>
                </div>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

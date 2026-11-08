import Link from "next/link"
import { getCollectionsWithCounts } from "@/lib/products"
import { COLLECTION_THEMES, resolveTheme } from "@/lib/collection-themes"
import { CollectionForm } from "./collection-form"
import { deleteCategory } from "./actions"

export const dynamic = "force-dynamic"

const themeLabel = (value: string) =>
  COLLECTION_THEMES.find((theme) => theme.key === resolveTheme(value))?.label

export default async function AdminCollectionsPage() {
  const items = await getCollectionsWithCounts()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Colecciones</h1>
        <p className="mt-1 max-w-2xl text-slate-500">
          Cada colección es un &ldquo;mundo&rdquo; de la tienda con su propio
          tema visual. Las destacadas aparecen como tarjetas grandes en el
          inicio; las demás, como filtros del catálogo.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Nueva colección
        </h2>
        <CollectionForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Colecciones existentes ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Todavía no hay colecciones. Crea la primera arriba.
          </p>
        ) : (
          items.map((collection) => (
            <details
              key={collection.id}
              className="group rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 transition group-open:rotate-90">▸</span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {collection.name}
                      {collection.featured && (
                        <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                          Destacada
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      {themeLabel(collection.theme)} · {collection.productCount}{" "}
                      {collection.productCount === 1 ? "producto" : "productos"} · /colecciones/
                      {collection.slug}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/colecciones/${collection.slug}`}
                  target="_blank"
                  className="text-sm font-medium text-purple-700 hover:underline"
                >
                  Ver en la tienda ↗
                </Link>
              </summary>
              <div className="space-y-4 border-t border-slate-100 px-6 py-5">
                <CollectionForm collection={collection} />
                <form action={deleteCategory} className="border-t border-slate-100 pt-4">
                  <input type="hidden" name="id" value={collection.id} />
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Eliminar colección (los productos se conservan sin colección)
                  </button>
                </form>
              </div>
            </details>
          ))
        )}
      </section>
    </div>
  )
}

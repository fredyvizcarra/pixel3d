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
        <p className="eyebrow">Tienda</p>
        <h1 className="admin-h1 mt-2">Colecciones</h1>
        <p className="mt-2 max-w-2xl text-fog">
          Cada colección es un &ldquo;mundo&rdquo; de la tienda con su propio
          tema visual. Las destacadas aparecen como tarjetas grandes en el
          inicio; las demás, como filtros del catálogo.
        </p>
      </div>

      <section className="admin-card">
        <h2 className="mb-4 font-display text-base font-bold">
          Nueva colección
        </h2>
        <CollectionForm />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-base font-bold">
          Colecciones existentes ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="rounded-[20px] border border-dashed border-line p-8 text-center text-fog">
            Todavía no hay colecciones. Crea la primera arriba.
          </p>
        ) : (
          items.map((collection) => (
            <details
              key={collection.id}
              className="group rounded-[20px] border border-line bg-panel"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-fog transition group-open:rotate-90">▸</span>
                  <div>
                    <p className="font-semibold">
                      {collection.name}
                      {collection.featured && (
                        <span className="ml-2 rounded-full bg-blurple/25 px-2 py-0.5 text-xs font-medium text-hover-blurple">
                          Destacada
                        </span>
                      )}
                    </p>
                    <p className="font-mono text-xs text-fog">
                      {themeLabel(collection.theme)} · {collection.productCount}{" "}
                      {collection.productCount === 1 ? "producto" : "productos"} · /colecciones/
                      {collection.slug}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/colecciones/${collection.slug}`}
                  target="_blank"
                  className="text-sm font-medium text-hover-blurple hover:underline"
                >
                  Ver en la tienda ↗
                </Link>
              </summary>
              <div className="space-y-4 border-t border-line px-6 py-5">
                <CollectionForm collection={collection} />
                <form action={deleteCategory} className="border-t border-line pt-4">
                  <input type="hidden" name="id" value={collection.id} />
                  <button type="submit" className="text-sm text-fog hover:text-[#ff8aa3]">
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

import Link from "next/link"
import { getAllProducts } from "@/lib/admin-data"
import { Button } from "@/components/ui/button"
import { AdminProductTable } from "./admin-product-table"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ imported?: string }>
}) {
  const { imported } = await searchParams
  const items = await getAllProducts()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Productos</h1>
          <p className="mt-1 text-slate-500">
            Edita fotos, precio, stock y categoría. Los cambios se ven en el
            catálogo.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-full border-slate-300 text-slate-800 hover:bg-white">
            <Link href="/admin/products/import">Importar CSV</Link>
          </Button>
          <Button asChild className="rounded-full bg-[#662d91] text-white hover:bg-purple-700">
            <Link href="/admin/products/new">Nuevo producto</Link>
          </Button>
        </div>
      </div>

      {imported && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Se importaron {imported} productos.
        </p>
      )}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          Aún no hay productos. Crea uno o importa un CSV.
        </div>
      ) : (
        <AdminProductTable products={items} />
      )}
    </div>
  )
}

import Link from "next/link"
import { getAllProducts } from "@/lib/admin-data"
import { Button } from "@/components/ui/button"
import { AdminProductTable } from "./admin-product-table"

export const dynamic = "force-dynamic"

const LOW_STOCK = 3

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ imported?: string }>
}) {
  const { imported } = await searchParams
  const items = await getAllProducts()

  const stats = [
    { label: "Productos", value: items.length },
    { label: "Visibles", value: items.filter((p) => p.active).length },
    {
      label: "Poco stock",
      value: items.filter((p) => p.active && p.stock < LOW_STOCK).length,
      warn: true,
    },
    {
      label: "Sin foto",
      value: items.filter((p) => p.images.length === 0).length,
      warn: true,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1 className="admin-h1 mt-2">Productos</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/products/import">Importar CSV</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/products/new">+ Nuevo producto</Link>
          </Button>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[16px] border border-line bg-panel px-4 py-3.5">
            <dt className="font-mono text-[11px] tracking-[0.12em] text-fog uppercase">
              {stat.label}
            </dt>
            <dd
              className={
                stat.warn && stat.value > 0
                  ? "mt-1 font-display text-2xl font-bold text-ember-orange tabular-nums"
                  : "mt-1 font-display text-2xl font-bold tabular-nums"
              }
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {imported && (
        <p className="rounded-[12px] border border-spring-green/30 bg-spring-green/10 px-4 py-3 text-sm text-spring-green">
          Se importaron {imported} productos.
        </p>
      )}

      {items.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-line p-12 text-center">
          <p className="text-lg">Aún no hay productos.</p>
          <p className="mt-1 text-fog">Crea el primero o importa un CSV.</p>
          <Button asChild className="mt-5">
            <Link href="/admin/products/new">+ Nuevo producto</Link>
          </Button>
        </div>
      ) : (
        <AdminProductTable products={items} lowStock={LOW_STOCK} />
      )}
    </div>
  )
}

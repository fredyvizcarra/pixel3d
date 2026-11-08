import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllCategories } from "@/lib/admin-data"
import { getProductById } from "@/lib/products"
import { hasSupabaseStorage } from "@/lib/supabase-admin"
import { ProductForm } from "../product-form"

export const dynamic = "force-dynamic"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/products" className="font-mono text-xs text-fog hover:text-snow">
            ← Productos
          </Link>
          <h1 className="admin-h1 mt-2">{product.name}</h1>
        </div>
        {product.active && (
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="text-sm font-medium text-hover-blurple hover:underline"
          >
            Ver en la tienda ↗
          </Link>
        )}
      </div>
      <ProductForm
        product={product}
        categories={categories}
        storageReady={hasSupabaseStorage()}
      />
    </div>
  )
}

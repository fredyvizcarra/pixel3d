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
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Editar producto
        </h1>
        <p className="mt-1 text-slate-500">
          {product.slug} · cambia fotos, precio, stock y visibilidad
        </p>
      </div>
      <ProductForm
        product={product}
        categories={categories}
        storageReady={hasSupabaseStorage()}
      />
    </div>
  )
}

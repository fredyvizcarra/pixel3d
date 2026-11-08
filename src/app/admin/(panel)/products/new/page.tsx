import { getAllCategories } from "@/lib/admin-data"
import { hasSupabaseStorage } from "@/lib/supabase-admin"
import { ProductForm } from "../product-form"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Nuevo producto</h1>
        <p className="mt-1 text-slate-500">
          Completa los datos. El slug se genera automáticamente.
        </p>
      </div>
      <ProductForm
        categories={categories}
        storageReady={hasSupabaseStorage()}
      />
    </div>
  )
}

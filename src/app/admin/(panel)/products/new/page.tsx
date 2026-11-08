import Link from "next/link"
import { getAllCategories } from "@/lib/admin-data"
import { hasSupabaseStorage } from "@/lib/supabase-admin"
import { ProductForm } from "../product-form"

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="font-mono text-xs text-fog hover:text-snow">
          ← Productos
        </Link>
        <h1 className="admin-h1 mt-2">Nuevo producto</h1>
      </div>
      <ProductForm
        categories={categories}
        storageReady={hasSupabaseStorage()}
      />
    </div>
  )
}

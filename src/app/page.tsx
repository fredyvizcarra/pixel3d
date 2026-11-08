import { ProductList } from "@/components/product-list"
import { CatalogHero } from "@/components/catalog-hero"
import { getActiveProducts, getStorefrontCategories } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getStorefrontCategories(),
  ])

  return (
    <div className="min-h-screen bg-cosmic">
      <CatalogHero
        kicker="Tienda"
        title="Catálogo Pixel3D"
        description="Piezas de impresión 3D listas para comprar. Figuras, accesorios y más."
      />
      <div className="py-12">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-fog">
              No pudimos cargar el catálogo. Revisa que el proyecto de Supabase
              esté activo y que DATABASE_URL esté bien en .env.
            </p>
          </div>
        ) : (
          <ProductList products={products} categories={categories} />
        )}
      </div>
    </div>
  )
}

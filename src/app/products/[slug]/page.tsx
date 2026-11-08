import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"
import { CatalogHero } from "@/components/catalog-hero"
import { getProductBySlug } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || !product.active) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-cosmic">
      <CatalogHero
        kicker="Producto"
        title={product.name}
        description="Detalles, materiales y stock listo para enviar."
        allCaps={false}
      />
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <ProductDetail product={product} />
      </div>
    </div>
  )
}

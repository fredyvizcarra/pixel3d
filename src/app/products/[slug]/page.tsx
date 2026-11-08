import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/product-detail"
import { getCategoryById } from "@/lib/admin-data"
import { getThemeProps } from "@/lib/collection-themes"
import { getProductBySlug } from "@/lib/products"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || !product.active) return {}
  return {
    title: `${product.name} · Pixel3D`,
    description: product.description?.slice(0, 160) ?? undefined,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  }
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || !product.active) {
    notFound()
  }

  const collection = product.categoryId
    ? await getCategoryById(product.categoryId)
    : undefined
  const themeProps = getThemeProps(collection)

  return (
    <div className={cn(themeProps.className, "min-h-[70vh]")} style={themeProps.style}>
      <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-20 sm:px-6">
        <nav
          aria-label="Ruta"
          className="mb-8 font-mono text-xs tracking-[0.04em] text-[var(--w-muted)]"
        >
          <Link href="/" className="hover:text-[var(--w-text)]">
            Inicio
          </Link>
          {collection && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/colecciones/${collection.slug}`}
                className="hover:text-[var(--w-text)]"
              >
                {collection.name}
              </Link>
            </>
          )}
        </nav>
        <ProductDetail product={product} collectionName={collection?.name} />
      </div>
    </div>
  )
}

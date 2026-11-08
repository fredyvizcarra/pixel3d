import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductDetail } from "@/components/product-detail"
import { getCategoryById } from "@/lib/admin-data"
import { getThemeProps } from "@/lib/collection-themes"
import { getProductBySlug, getRelatedProducts } from "@/lib/products"
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

  const [collection, related] = await Promise.all([
    product.categoryId ? getCategoryById(product.categoryId) : undefined,
    getRelatedProducts(product),
  ])
  const themeProps = getThemeProps(collection)

  return (
    <div className={cn(themeProps.className, "min-h-[70vh]")} style={themeProps.style}>
      <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-20 sm:px-6 md:pt-10">
        <nav
          aria-label="Ruta"
          className="mb-8 flex flex-wrap gap-x-2 font-mono text-xs tracking-[0.04em] text-[var(--w-muted)]"
        >
          <Link href="/" className="hover:text-[var(--w-text)]">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          {collection ? (
            <Link
              href={`/colecciones/${collection.slug}`}
              className="hover:text-[var(--w-text)]"
            >
              {collection.name}
            </Link>
          ) : (
            <Link href="/#catalogo" className="hover:text-[var(--w-text)]">
              Catálogo
            </Link>
          )}
          <span aria-hidden="true">/</span>
          <span className="max-w-[40ch] truncate text-[var(--w-text)]" aria-current="page">
            {product.name}
          </span>
        </nav>

        <ProductDetail
          product={product}
          collection={collection ? { name: collection.name, slug: collection.slug } : null}
        />

        {related.length > 0 && collection && (
          <section aria-labelledby="related-title" className="mt-20">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2
                id="related-title"
                className="world-title text-[clamp(1.5rem,3vw,2.25rem)] leading-none"
              >
                Más de <span className="hl">{collection.name}</span>
              </h2>
              <Link
                href={`/colecciones/${collection.slug}`}
                className="text-sm font-semibold underline-offset-4 hover:underline"
              >
                Ver toda la colección →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

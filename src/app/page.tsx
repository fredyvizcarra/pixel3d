import { HomeHero } from "@/components/home/home-hero"
import { CustomOrderSteps } from "@/components/home/custom-order-steps"
import { CollectionGrid } from "@/components/collections/collection-grid"
import { ProductList } from "@/components/product-list"
import { SectionHead } from "@/components/section-head"
import { getActiveProducts, getCollectionsWithCounts } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [products, collections] = await Promise.all([
    getActiveProducts(),
    getCollectionsWithCounts(),
  ])

  const filterCollections = collections.filter(
    (collection) => collection.productCount > 0
  )

  return (
    <>
      <HomeHero />

      <section
        id="colecciones"
        aria-labelledby="colecciones-title"
        className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-16 sm:px-6 md:py-20"
      >
        <SectionHead
          id="colecciones-title"
          title="Elige tu mundo"
          description="Cada colección tiene su propio ambiente. Encuentra la pieza perfecta para ti o para regalar."
        />
        <CollectionGrid collections={collections} />
      </section>

      <section
        id="catalogo"
        aria-labelledby="catalogo-title"
        className="mx-auto max-w-[1200px] scroll-mt-20 px-4 pb-16 sm:px-6 md:pb-20"
      >
        <SectionHead
          id="catalogo-title"
          title="Todo el catálogo"
          description="Filtra por colección, busca por nombre u ordena por precio."
        />
        {products.length === 0 ? (
          <p className="py-12 text-center text-lg text-fog">
            Estamos preparando el catálogo. Vuelve pronto.
          </p>
        ) : (
          <ProductList products={products} categories={filterCollections} />
        )}
      </section>

      <section
        id="personalizados"
        aria-labelledby="personalizados-title"
        className="scroll-mt-20 border-t border-line bg-panel/40"
      >
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-20">
          <SectionHead
            id="personalizados-title"
            title="Tu pieza personalizada"
            description="¿No está en el catálogo? La diseñamos contigo."
          />
          <CustomOrderSteps />
        </div>
      </section>
    </>
  )
}

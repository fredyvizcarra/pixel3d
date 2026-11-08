import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { WorldArt } from "@/components/collections/world-art"
import { WorldTitle } from "@/components/collections/world-title"
import { ProductList } from "@/components/product-list"
import { getThemeProps, resolveTheme } from "@/lib/collection-themes"
import { getActiveProductsByCategory, getCollectionBySlug } from "@/lib/products"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)
  if (!collection) return {}
  return {
    title: `${collection.name} · Pixel3D`,
    description:
      collection.tagline ??
      `Piezas de impresión 3D de la colección ${collection.name}.`,
  }
}

const YARDS = ["10", "20", "30", "40", "50", "40", "30"]

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params
  const collection = await getCollectionBySlug(slug)
  if (!collection) notFound()

  const products = await getActiveProductsByCategory(collection.id)
  const theme = resolveTheme(collection.theme)
  const themeProps = getThemeProps(collection)

  return (
    <div className={cn(themeProps.className, "min-h-[70vh]")} style={themeProps.style}>
      {theme === "gameday" && (
        <div
          className="pointer-events-none absolute inset-x-0 top-5 flex justify-around font-[family-name:var(--font-saira)] text-[28px] font-black opacity-15"
          aria-hidden="true"
        >
          {YARDS.map((yard, index) => (
            <span key={index}>{yard}</span>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-[1200px] px-4 pt-14 pb-20 sm:px-6 md:pt-20">
        <nav aria-label="Ruta" className="mb-6 font-mono text-xs tracking-[0.04em] text-[var(--w-muted)]">
          <Link href="/" className="hover:text-[var(--w-text)]">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/#colecciones" className="hover:text-[var(--w-text)]">
            Colecciones
          </Link>
        </nav>

        <header className="relative mb-10 grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div className="relative z-10">
            <WorldTitle
              name={collection.name}
              as="h1"
              className="text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92]"
            />
            {theme === "magico" && (
              <p className="mt-4 flex items-center gap-3 font-mono text-xs tracking-[0.04em] text-[var(--w-a)] before:h-px before:w-14 before:bg-current/60 after:h-px after:w-14 after:bg-current/60">
                varitas · castillos · criaturas
              </p>
            )}
            {collection.tagline && (
              <p className="mt-4 max-w-[50ch] text-lg text-[var(--w-muted)]">
                {collection.tagline}
              </p>
            )}
            {theme === "gameday" && (
              <div className="mt-5 inline-flex overflow-hidden rounded-md font-mono text-[13px] font-bold">
                <span className="bg-[var(--w-a)] px-3 py-1.5">LOCAL 21</span>
                <span className="bg-[var(--w-b)] px-3 py-1.5">VISITA 17</span>
                <span className="bg-void px-3 py-1.5 text-[#ffd23f]">4º · 02:14</span>
              </div>
            )}
          </div>
          <WorldArt
            theme={theme}
            className="pointer-events-none hidden w-[220px] opacity-90 md:block"
          />
        </header>

        {products.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-current/30 px-6 py-16 text-center">
            <p className="text-lg">Estamos imprimiendo las primeras piezas de esta colección.</p>
            <p className="mt-2 text-[var(--w-muted)]">
              Vuelve pronto o{" "}
              <Link href="/#personalizados" className="underline underline-offset-4">
                pide una pieza personalizada
              </Link>
              .
            </p>
          </div>
        ) : (
          <ProductList products={products} showCategories={false} />
        )}
      </div>

      {theme === "navidad" && (
        <div
          className="h-2.5 bg-[repeating-linear-gradient(45deg,var(--w-b)_0_12px,#f6f0e2_12px_24px)]"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

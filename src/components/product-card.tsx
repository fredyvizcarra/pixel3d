import Link from "next/link"
import Image from "next/image"
import { formatPrice, isInStock } from "@/lib/product-utils"
import type { Product } from "@/db/schema"

interface Props {
  product: Product
}

const stockLabel = (product: Product): string => {
  if (!isInStock(product)) return "Agotado"
  if (product.stock <= 3) return `Últimas ${product.stock}`
  return "Disponible"
}

/**
 * Toma sus colores de los tokens --w-* del mundo que la contiene,
 * así se adapta sola a cada colección.
 */
export const ProductCard = ({ product }: Props) => {
  const mainImage = product.images[0]
  const inStock = isInStock(product)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--w-card-border)] bg-[var(--w-card)] text-[var(--w-card-text)] transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full overflow-hidden [background:var(--w-ph)]">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-mono text-xs text-[var(--w-card-muted)]">
            Foto próximamente
          </div>
        )}
        {!inStock && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-void/80 px-2.5 py-0.5 text-[11px] font-semibold text-snow">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3.5 pb-4">
        <h3 className="line-clamp-2 leading-snug font-semibold">{product.name}</h3>
        <p className="font-mono text-xs tracking-[0.04em] text-[var(--w-card-muted)]">
          {stockLabel(product)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-[17px] font-bold tabular-nums">
            {formatPrice(product.price)}
          </span>
          <span className="rounded-[10px] bg-[var(--w-a)] px-3 py-1.5 text-[13px] font-semibold text-[var(--w-a-text)] transition group-hover:brightness-110">
            Ver
          </span>
        </div>
      </div>
    </Link>
  )
}

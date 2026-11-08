import type { Product } from "@/db/schema"

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** Precio en centavos → "$349" o "$349.50" */
export const formatPrice = (priceInCents: number): string => {
  return priceFormatter.format(priceInCents / 100)
}

export const isInStock = (product: Product): boolean => {
  return product.stock > 0 && product.active
}

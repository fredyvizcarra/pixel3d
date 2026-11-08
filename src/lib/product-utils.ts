import type { Product } from "@/db/schema"

export const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(2)}`
}

export const isInStock = (product: Product): boolean => {
  return product.stock > 0 && product.active
}

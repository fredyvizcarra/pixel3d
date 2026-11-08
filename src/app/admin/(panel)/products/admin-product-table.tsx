"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MagnifyingGlassIcon, PhotoIcon } from "@heroicons/react/24/outline"
import type { AdminProduct } from "@/lib/admin-data"
import { formatPrice } from "@/lib/product-utils"
import { cn } from "@/lib/utils"
import { toggleProductActive } from "./actions"

interface Props {
  products: AdminProduct[]
  lowStock: number
}

type Filter = "all" | "visible" | "hidden" | "attention"

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "visible", label: "Visibles" },
  { key: "hidden", label: "Ocultos" },
  { key: "attention", label: "Requieren atención" },
]

export const AdminProductTable = ({ products, lowStock }: Props) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const filteredProducts = useMemo(() => {
    const needsAttention = (product: AdminProduct) =>
      product.images.length === 0 || (product.active && product.stock < lowStock)
    const term = searchTerm.trim().toLowerCase()
    return products.filter((product) => {
      if (filter === "visible" && !product.active) return false
      if (filter === "hidden" && product.active) return false
      if (filter === "attention" && !needsAttention(product)) return false
      if (!term) return true
      return (
        product.name.toLowerCase().includes(term) ||
        product.slug.toLowerCase().includes(term) ||
        (product.categoryName?.toLowerCase().includes(term) ?? false)
      )
    })
  }, [products, searchTerm, filter, lowStock])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar productos">
          {FILTERS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              aria-pressed={filter === option.key}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === option.key
                  ? "border-blurple bg-blurple text-snow"
                  : "border-line text-fog hover:border-fog hover:text-snow"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:max-w-xs">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-greyple" />
          <input
            id="admin-product-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre o colección"
            aria-label="Buscar productos"
            className="admin-input pl-9"
          />
        </div>
      </div>

      <p className="font-mono text-xs text-fog">
        {filteredProducts.length} de {products.length} productos
      </p>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-line p-12 text-center text-fog">
          No hay productos con ese filtro.
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-panel">
          {filteredProducts.map((product) => {
            const low = product.active && product.stock < lowStock
            return (
              <li
                key={product.id}
                className="grid grid-cols-[56px_1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 md:grid-cols-[56px_1.6fr_1fr_0.7fr_0.6fr_auto]"
              >
                <Link
                  href={`/admin/products/${product.id}`}
                  className="relative size-14 overflow-hidden rounded-[10px] bg-dark-charcoal"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      sizes="56px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <PhotoIcon className="absolute inset-0 m-auto size-5 text-ember-orange" />
                  )}
                </Link>

                <div className="min-w-0">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="block truncate font-semibold hover:text-hover-blurple"
                  >
                    {product.name}
                  </Link>
                  <p className="truncate font-mono text-xs text-fog md:hidden">
                    {formatPrice(product.price)} · stock {product.stock}
                    {product.categoryName ? ` · ${product.categoryName}` : ""}
                  </p>
                  <p className="hidden truncate font-mono text-xs text-greyple md:block">
                    /{product.slug}
                  </p>
                </div>

                <p className="hidden truncate text-sm text-fog md:block">
                  {product.categoryName ?? "Sin colección"}
                </p>

                <p className="hidden font-semibold tabular-nums md:block">
                  {formatPrice(product.price)}
                </p>

                <p
                  className={cn(
                    "hidden font-mono text-sm tabular-nums md:block",
                    low ? "text-ember-orange" : "text-fog"
                  )}
                >
                  {product.stock} pzs
                </p>

                <div className="flex items-center justify-end gap-2">
                  <form action={toggleProductActive}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      title={product.active ? "Ocultar de la tienda" : "Publicar en la tienda"}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                        product.active
                          ? "bg-spring-green/15 text-spring-green hover:bg-spring-green/25"
                          : "bg-snow/10 text-fog hover:bg-snow/20"
                      )}
                    >
                      {product.active ? "Visible" : "Oculto"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="hidden rounded-[10px] border border-line px-3 py-1.5 text-sm font-medium transition-colors hover:border-fog sm:block"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

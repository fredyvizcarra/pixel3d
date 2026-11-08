"use client"

import { useMemo, useState } from "react"
import { ProductCard } from "./product-card"
import type { Category, Product } from "@/db/schema"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type StockFilter = "all" | "in-stock" | "out"
type SortOption = "name" | "price-asc" | "price-desc" | "newest"

interface Props {
  products: Product[]
  categories?: Category[]
  /** Oculta los filtros por colección (en la página de una colección) */
  showCategories?: boolean
}

const chipClass = (active: boolean) =>
  cn(
    "rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
    active
      ? "border-[var(--w-a)] bg-[var(--w-a)] text-[var(--w-a-text)]"
      : "border-current/25 text-[var(--w-muted)] hover:border-current/60 hover:text-[var(--w-text)]"
  )

export const ProductList = ({
  products,
  categories = [],
  showCategories = true,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [stockFilter, setStockFilter] = useState<StockFilter>("all")
  const [sortOption, setSortOption] = useState<SortOption>("name")

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setCategoryId("all")
    setStockFilter("all")
    setSortOption("name")
  }

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    products.forEach((product) => {
      if (!product.categoryId) return
      counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1)
    })
    return counts
  }, [products])

  const visibleCategories = showCategories ? categories : []

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    const next = products.filter((product) => {
      const matchesSearch =
        term.length === 0 ||
        product.name.toLowerCase().includes(term) ||
        (product.description
          ? product.description.toLowerCase().includes(term)
          : false)

      if (!matchesSearch) return false

      if (categoryId === "none" && product.categoryId) return false
      if (
        categoryId !== "all" &&
        categoryId !== "none" &&
        product.categoryId !== categoryId
      ) {
        return false
      }

      if (stockFilter === "in-stock" && product.stock <= 0) return false
      if (stockFilter === "out" && product.stock > 0) return false

      return true
    })

    next.sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price
      if (sortOption === "price-desc") return b.price - a.price
      if (sortOption === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }
      return a.name.localeCompare(b.name, "es")
    })

    return next
  }, [products, searchTerm, categoryId, stockFilter, sortOption])

  const uncategorizedCount = products.filter(
    (product) => !product.categoryId
  ).length
  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    categoryId !== "all" ||
    stockFilter !== "all" ||
    sortOption !== "name"

  return (
    <div>
      <div className="mb-8 space-y-4">
        {visibleCategories.length > 0 && (
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label="Filtrar por colección"
          >
            <button
              type="button"
              onClick={() => setCategoryId("all")}
              className={chipClass(categoryId === "all")}
              aria-pressed={categoryId === "all"}
            >
              Todas
            </button>
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setCategoryId(category.id)}
                className={chipClass(categoryId === category.id)}
                aria-pressed={categoryId === category.id}
              >
                {category.name}
                <span className="ml-1 text-xs opacity-70">
                  {categoryCounts.get(category.id)}
                </span>
              </button>
            ))}
            {uncategorizedCount > 0 && (
              <button
                type="button"
                onClick={() => setCategoryId("none")}
                className={chipClass(categoryId === "none")}
                aria-pressed={categoryId === "none"}
              >
                Otras
                <span className="ml-1 text-xs opacity-70">
                  {uncategorizedCount}
                </span>
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex gap-2"
              role="group"
              aria-label="Filtrar por disponibilidad"
            >
              <button
                type="button"
                onClick={() => setStockFilter("all")}
                className={chipClass(stockFilter === "all")}
                aria-pressed={stockFilter === "all"}
              >
                Todo
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("in-stock")}
                className={chipClass(stockFilter === "in-stock")}
                aria-pressed={stockFilter === "in-stock"}
              >
                Disponibles
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("out")}
                className={chipClass(stockFilter === "out")}
                aria-pressed={stockFilter === "out"}
              >
                Agotados
              </button>
            </div>
            <label className="sr-only" htmlFor="catalog-sort">
              Ordenar productos
            </label>
            <select
              id="catalog-sort"
              value={sortOption}
              onChange={handleSortChange}
              aria-label="Ordenar productos"
              className="h-9 rounded-[12px] border border-current/25 bg-void/30 px-3 text-sm text-[var(--w-text)] outline-none focus-visible:border-[var(--w-a)] focus-visible:ring-2 focus-visible:ring-[var(--w-a)]/40"
            >
              <option value="name">A–Z</option>
              <option value="newest">Más nuevos</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>

          <div className="relative w-full max-w-[240px] sm:ml-auto">
            <Input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Buscar..."
              aria-label="Buscar productos"
              className="h-9 border-current/25 bg-void/30 pl-9 text-sm text-[var(--w-text)]"
            />
            <svg
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--w-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-[var(--w-muted)]">
          <p>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "producto" : "productos"}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="underline-offset-4 hover:text-[var(--w-text)] hover:underline"
            >
              Quitar filtros
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-[var(--w-muted)]">
            No hay productos con esos filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[440px]:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

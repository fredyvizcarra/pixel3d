import { and, asc, count, desc, eq, ne } from "drizzle-orm"
import { getDb } from "@/db"
import { categories, products, type Category, type Product } from "@/db/schema"

export type { Category, Product }

export const getActiveProducts = async (): Promise<Product[]> => {
  try {
    const db = getDb()
    return await db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(products.name)
  } catch (error) {
    console.error("No se pudieron cargar los productos", error)
    return []
  }
}

export const getStorefrontCategories = async (): Promise<Category[]> => {
  try {
    const db = getDb()
    return await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.name))
  } catch (error) {
    console.error("No se pudieron cargar las categorías", error)
    return []
  }
}

export const getProductBySlug = async (
  slug: string
): Promise<Product | undefined> => {
  const db = getDb()
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)

  return rows[0]
}

export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  const db = getDb()
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)

  return rows[0]
}

export type CollectionSummary = Category & { productCount: number }

/** Colecciones con su número de productos activos (para el inicio) */
export const getCollectionsWithCounts = async (): Promise<CollectionSummary[]> => {
  try {
    const db = getDb()
    const rows = await db
      .select({ category: categories, productCount: count(products.id) })
      .from(categories)
      .leftJoin(
        products,
        and(eq(products.categoryId, categories.id), eq(products.active, true))
      )
      .groupBy(categories.id)
      .orderBy(asc(categories.sortOrder), asc(categories.name))

    return rows.map((row) => ({
      ...row.category,
      productCount: Number(row.productCount),
    }))
  } catch (error) {
    console.error("No se pudieron cargar las colecciones", error)
    return []
  }
}

export const getCollectionBySlug = async (
  slug: string
): Promise<Category | undefined> => {
  const db = getDb()
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)

  return rows[0]
}

export const getActiveProductsByCategory = async (
  categoryId: string
): Promise<Product[]> => {
  const db = getDb()
  return db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.categoryId, categoryId)))
    .orderBy(products.name)
}

/** Otros productos activos de la misma colección (para "Más de esta colección") */
export const getRelatedProducts = async (
  product: Pick<Product, "id" | "categoryId">,
  limit = 4
): Promise<Product[]> => {
  if (!product.categoryId) return []
  try {
    const db = getDb()
    return await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.active, true),
          eq(products.categoryId, product.categoryId),
          ne(products.id, product.id)
        )
      )
      .orderBy(desc(products.createdAt))
      .limit(limit)
  } catch (error) {
    console.error("No se pudieron cargar productos relacionados", error)
    return []
  }
}

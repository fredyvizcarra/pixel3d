import { asc, eq } from "drizzle-orm"
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

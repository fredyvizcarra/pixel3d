import { asc, eq } from "drizzle-orm"
import { getDb } from "@/db"
import {
  categories,
  products,
  type Category,
  type Product,
} from "@/db/schema"
import { slugify } from "@/lib/slugify"

export type AdminProduct = Product & {
  categoryName: string | null
}

export const getAllProducts = async (): Promise<AdminProduct[]> => {
  const db = getDb()
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(products.name))

  return rows.map((row) => ({
    ...row.product,
    categoryName: row.categoryName,
  }))
}

export const getAllCategories = async (): Promise<Category[]> => {
  const db = getDb()
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name))
}

export const getCategoryById = async (
  id: string
): Promise<Category | undefined> => {
  const db = getDb()
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1)
  return rows[0]
}

export const ensureUniqueProductSlug = async (
  name: string,
  excludeId?: string
): Promise<string> => {
  const db = getDb()
  const base = slugify(name) || "producto"
  let candidate = base
  let suffix = 2

  while (true) {
    const rows = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, candidate))
      .limit(1)

    const existing = rows[0]
    if (!existing || existing.id === excludeId) {
      return candidate
    }

    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

export const ensureUniqueCategorySlug = async (
  name: string,
  excludeId?: string
): Promise<string> => {
  const db = getDb()
  const base = slugify(name) || "categoria"
  let candidate = base
  let suffix = 2

  while (true) {
    const rows = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, candidate))
      .limit(1)

    const existing = rows[0]
    if (!existing || existing.id === excludeId) {
      return candidate
    }

    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

export const findCategoryByNameOrSlug = async (
  value: string
): Promise<Category | undefined> => {
  const slug = slugify(value)
  const all = await getAllCategories()
  return all.find(
    (category) =>
      category.name.toLowerCase() === value.trim().toLowerCase() ||
      category.slug === slug
  )
}

export const createCategory = async (name: string): Promise<Category> => {
  const db = getDb()
  const slug = await ensureUniqueCategorySlug(name)
  const inserted = await db
    .insert(categories)
    .values({ name: name.trim(), slug })
    .returning()
  return inserted[0]
}

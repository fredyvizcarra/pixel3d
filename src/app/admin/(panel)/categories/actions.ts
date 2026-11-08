"use server"

import { requireAdmin } from "@/lib/require-admin"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { getDb } from "@/db"
import { categories, products } from "@/db/schema"
import { ensureUniqueCategorySlug } from "@/lib/admin-data"
import { normalizeAccentColor, resolveTheme } from "@/lib/collection-themes"

const revalidateStorefront = (slug?: string) => {
  revalidatePath("/")
  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")
  if (slug) revalidatePath(`/colecciones/${slug}`)
}

const readCollectionFields = (formData: FormData) => {
  const name = String(formData.get("name") ?? "").trim()
  if (!name) {
    throw new Error("El nombre de la colección es obligatorio")
  }

  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10)

  return {
    name,
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    theme: resolveTheme(String(formData.get("theme") ?? "")),
    accentColor: normalizeAccentColor(String(formData.get("accentColor") ?? "")),
    featured: formData.get("featured") === "on",
    sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
  }
}

export const saveCategory = async (formData: FormData): Promise<void> => {
  await requireAdmin()

  const id = String(formData.get("id") ?? "")
  const fields = readCollectionFields(formData)
  const db = getDb()
  const slug = await ensureUniqueCategorySlug(fields.name, id || undefined)

  if (id) {
    await db
      .update(categories)
      .set({ ...fields, slug })
      .where(eq(categories.id, id))
  } else {
    await db.insert(categories).values({ ...fields, slug })
  }

  revalidateStorefront(slug)
}

export const deleteCategory = async (formData: FormData): Promise<void> => {
  await requireAdmin()

  const id = String(formData.get("id") ?? "")
  const db = getDb()
  // Los productos no se borran: quedan sin colección
  await db
    .update(products)
    .set({ categoryId: null })
    .where(eq(products.categoryId, id))
  await db.delete(categories).where(eq(categories.id, id))
  revalidateStorefront()
}

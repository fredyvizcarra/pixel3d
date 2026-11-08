"use server"

import { requireAdmin } from "@/lib/require-admin"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { getDb } from "@/db"
import { categories } from "@/db/schema"
import { createCategory, getAllCategories } from "@/lib/admin-data"

export const saveCategory = async (formData: FormData): Promise<void> => {
  await requireAdmin()

  const name = String(formData.get("name") ?? "").trim()
  if (!name) {
    throw new Error("El nombre de la categoría es obligatorio")
  }
  await createCategory(name)
  revalidatePath("/")
  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")
}

export const seedSuggestedCategories = async (): Promise<void> => {
  await requireAdmin()

  const suggested = ["Figuras", "Accesorios", "Hogar", "Papelería", "Otros"]
  const existing = await getAllCategories()
  const existingNames = new Set(existing.map((item) => item.name.toLowerCase()))

  for (const name of suggested) {
    if (!existingNames.has(name.toLowerCase())) {
      await createCategory(name)
    }
  }

  revalidatePath("/")
  revalidatePath("/admin/categories")
}

export const deleteCategory = async (formData: FormData): Promise<void> => {
  await requireAdmin()

  const id = String(formData.get("id") ?? "")
  const db = getDb()
  await db.delete(categories).where(eq(categories.id, id))
  revalidatePath("/")
  revalidatePath("/admin/categories")
  revalidatePath("/admin/products")
}

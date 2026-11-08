"use server"

import { requireAdmin } from "@/lib/require-admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { getDb } from "@/db"
import { products } from "@/db/schema"
import { ensureUniqueProductSlug } from "@/lib/admin-data"
import { getProductById } from "@/lib/products"
import { hasSupabaseStorage, uploadProductImages } from "@/lib/supabase-admin"

const parsePriceToCents = (value: string): number => {
  const normalized = value.replace(",", ".").trim()
  const pesos = Number(normalized)
  if (Number.isNaN(pesos) || pesos < 0) {
    throw new Error("Precio inválido")
  }
  return Math.round(pesos * 100)
}

const parseStock = (value: string): number => {
  const stock = Number.parseInt(value, 10)
  if (Number.isNaN(stock) || stock < 0) {
    throw new Error("Stock inválido")
  }
  return stock
}

const parseExistingImages = (value: FormDataEntryValue | null): string[] => {
  if (!value || typeof value !== "string") return []
  try {
    const parsed = JSON.parse(value) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === "string")
  } catch {
    return []
  }
}

const collectFiles = (formData: FormData): File[] => {
  return formData
    .getAll("imageFiles")
    .filter((item): item is File => item instanceof File && item.size > 0)
}

export const saveProduct = async (formData: FormData): Promise<void> => {
  await requireAdmin()

  const id = String(formData.get("id") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const videoUrl = String(formData.get("videoUrl") ?? "").trim()
  const categoryIdRaw = String(formData.get("categoryId") ?? "")
  const active = formData.get("active") === "on"
  const existingImages = parseExistingImages(formData.get("existingImages"))

  if (!name) {
    throw new Error("El nombre es obligatorio")
  }

  const price = parsePriceToCents(String(formData.get("price") ?? "0"))
  const stock = parseStock(String(formData.get("stock") ?? "0"))
  const categoryId = categoryIdRaw || null
  const db = getDb()
  const productId = id || crypto.randomUUID()
  const slug = await ensureUniqueProductSlug(name, id || undefined)

  const files = collectFiles(formData)
  let uploaded: string[] = []
  if (files.length > 0) {
    if (!hasSupabaseStorage()) {
      throw new Error(
        "Falta Storage: agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env y reinicia el servidor"
      )
    }
    uploaded = await uploadProductImages(productId, files)
  }

  const images = [...existingImages, ...uploaded]
  const now = new Date()

  if (id) {
    await db
      .update(products)
      .set({
        name,
        slug,
        description: description || null,
        price,
        stock,
        images,
        videoUrl: videoUrl || null,
        active,
        categoryId,
        updatedAt: now,
      })
      .where(eq(products.id, id))
  } else {
    await db.insert(products).values({
      id: productId,
      name,
      slug,
      description: description || null,
      price,
      stock,
      images,
      videoUrl: videoUrl || null,
      active,
      categoryId,
    })
  }

  revalidatePath("/")
  revalidatePath("/admin/products")
  revalidatePath("/products")
  revalidatePath(`/products/${slug}`)
  redirect("/admin/products")
}

export const toggleProductActive = async (formData: FormData): Promise<void> => {
  await requireAdmin()

  const id = String(formData.get("id") ?? "")
  const product = await getProductById(id)
  if (!product) {
    throw new Error("Producto no encontrado")
  }

  const db = getDb()
  await db
    .update(products)
    .set({ active: !product.active, updatedAt: new Date() })
    .where(eq(products.id, id))

  revalidatePath("/")
  revalidatePath("/admin/products")
  revalidatePath("/products")
  revalidatePath(`/products/${product.slug}`)
}

export const deleteProduct = async (formData: FormData): Promise<void> => {
  await requireAdmin()

  const id = String(formData.get("id") ?? "")
  const db = getDb()
  await db.delete(products).where(eq(products.id, id))
  revalidatePath("/")
  revalidatePath("/admin/products")
  revalidatePath("/products")
  redirect("/admin/products")
}

"use server"

import { requireAdmin } from "@/lib/require-admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getDb } from "@/db"
import { products } from "@/db/schema"
import {
  createCategory,
  ensureUniqueProductSlug,
  findCategoryByNameOrSlug,
} from "@/lib/admin-data"

type CsvRow = {
  name: string
  description: string
  price: string
  stock: string
  category: string
  images: string
}

const parseCsv = (text: string): CsvRow[] => {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []

  const headers = splitCsvLine(lines[0]).map((header) =>
    header.trim().toLowerCase()
  )
  const nameIndex = headers.indexOf("name")
  const descriptionIndex = headers.indexOf("description")
  const priceIndex = headers.indexOf("price")
  const stockIndex = headers.indexOf("stock")
  const categoryIndex = headers.indexOf("category")
  const imagesIndex = headers.indexOf("images")

  if (nameIndex === -1 || priceIndex === -1) {
    throw new Error("El CSV debe incluir las columnas name y price")
  }

  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line)
    return {
      name: cols[nameIndex] ?? "",
      description: descriptionIndex >= 0 ? (cols[descriptionIndex] ?? "") : "",
      price: cols[priceIndex] ?? "0",
      stock: stockIndex >= 0 ? (cols[stockIndex] ?? "0") : "0",
      category: categoryIndex >= 0 ? (cols[categoryIndex] ?? "") : "",
      images: imagesIndex >= 0 ? (cols[imagesIndex] ?? "") : "",
    }
  })
}

const splitCsvLine = (line: string): string[] => {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  result.push(current.trim())
  return result
}

const parsePriceToCents = (value: string): number => {
  const pesos = Number(value.replace(",", ".").trim())
  if (Number.isNaN(pesos) || pesos < 0) {
    throw new Error(`Precio inválido: ${value}`)
  }
  return Math.round(pesos * 100)
}

export const importProductsCsv = async (formData: FormData): Promise<void> => {
  await requireAdmin()

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Selecciona un archivo CSV")
  }

  const text = await file.text()
  const rows = parseCsv(text)
  if (rows.length === 0) {
    throw new Error("El CSV no tiene filas para importar")
  }

  const db = getDb()
  let imported = 0

  for (const row of rows) {
    const name = row.name.trim()
    if (!name) continue

    let categoryId: string | null = null
    if (row.category.trim()) {
      const existing = await findCategoryByNameOrSlug(row.category)
      if (existing) {
        categoryId = existing.id
      } else {
        const created = await createCategory(row.category)
        categoryId = created.id
      }
    }

    const slug = await ensureUniqueProductSlug(name)
    const images = row.images
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean)

    await db.insert(products).values({
      name,
      slug,
      description: row.description.trim() || null,
      price: parsePriceToCents(row.price),
      stock: Number.parseInt(row.stock || "0", 10) || 0,
      images,
      active: true,
      categoryId,
    })
    imported += 1
  }

  revalidatePath("/admin/products")
  revalidatePath("/products")
  redirect(`/admin/products?imported=${imported}`)
}

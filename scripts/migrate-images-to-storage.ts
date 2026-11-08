/**
 * Copia las fotos de productos que NO están en Supabase Storage
 * (archivos locales en /public y fotos alojadas en Stripe) al bucket
 * "product-images", optimizadas a WebP, y actualiza los enlaces en la base de datos.
 *
 *   npx tsx scripts/migrate-images-to-storage.ts            # simulación (no cambia nada)
 *   npx tsx scripts/migrate-images-to-storage.ts --apply    # migra de verdad
 *
 * - Es idempotente: las fotos que ya están en Supabase se dejan igual.
 * - No borra los archivos originales.
 * - Antes de aplicar guarda un respaldo JSON con los enlaces anteriores.
 */
import "dotenv/config"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { createHash } from "node:crypto"
import sharp from "sharp"
import { eq } from "drizzle-orm"
import { closeDb, getDb } from "../src/db"
import { products } from "../src/db/schema"
import { ensureBucket, getSupabaseAdmin } from "../src/lib/supabase-admin"

const BUCKET = "product-images"
const MAX_SIZE = 1600
const QUALITY = 80
const apply = process.argv.includes("--apply")

const isInStorage = (url: string) =>
  url.includes(".supabase.co/storage/v1/object/public/")

const readSource = async (url: string): Promise<Buffer> => {
  if (url.startsWith("/")) {
    return readFile(path.join(process.cwd(), "public", decodeURIComponent(url)))
  }
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status} al descargar ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

const optimize = (input: Buffer) =>
  sharp(input)
    .rotate() // respeta la orientación de la cámara
    .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer()

const run = async () => {
  const db = getDb()
  const supabase = getSupabaseAdmin()
  const rows = await db.select().from(products)

  const pending = rows.filter((row) => row.images.some((url) => !isInStorage(url)))
  console.log(
    `${rows.length} productos · ${pending.length} con fotos por migrar · modo: ${apply ? "APLICAR" : "simulación"}`
  )

  if (apply) {
    await ensureBucket()
    const backupPath = path.join(
      process.cwd(),
      "scripts",
      `images-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`
    )
    await writeFile(
      backupPath,
      JSON.stringify(rows.map(({ id, slug, images }) => ({ id, slug, images })), null, 2)
    )
    console.log(`Respaldo de enlaces: ${path.relative(process.cwd(), backupPath)}`)
  }

  let migrated = 0
  let bytesBefore = 0
  let bytesAfter = 0
  const failures: string[] = []

  for (const product of pending) {
    const nextImages: string[] = []

    for (const [index, url] of product.images.entries()) {
      if (isInStorage(url)) {
        nextImages.push(url)
        continue
      }

      try {
        const original = await readSource(url)
        const optimized = await optimize(original)
        bytesBefore += original.length
        bytesAfter += optimized.length

        // Nombre estable: el mismo origen siempre genera el mismo archivo
        const hash = createHash("sha1").update(url).digest("hex").slice(0, 10)
        const objectPath = `${product.id}/${String(index + 1).padStart(2, "0")}-${hash}.webp`

        if (apply) {
          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(objectPath, optimized, { contentType: "image/webp", upsert: true })
          if (error) throw new Error(error.message)
          nextImages.push(supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl)
        } else {
          nextImages.push(`(storage)/${objectPath}`)
        }
        migrated += 1
      } catch (error) {
        // Si una foto falla, se conserva el enlace original para no perderla
        failures.push(`${product.slug}: ${url} → ${(error as Error).message}`)
        nextImages.push(url)
      }
    }

    if (apply) {
      await db
        .update(products)
        .set({ images: nextImages, updatedAt: new Date() })
        .where(eq(products.id, product.id))
    }
    console.log(`  ✓ ${product.slug} (${product.images.length} fotos)`)
  }

  const mb = (n: number) => (n / 1024 / 1024).toFixed(1)
  console.log(
    `\n${migrated} fotos ${apply ? "migradas" : "por migrar"} · ${mb(bytesBefore)} MB → ${mb(bytesAfter)} MB`
  )
  if (failures.length > 0) {
    console.log(`\n${failures.length} con error (se dejaron igual):`)
    failures.forEach((failure) => console.log(`  ✗ ${failure}`))
  }

  await closeDb()
}

run().catch(async (error) => {
  console.error(error)
  await closeDb()
  process.exit(1)
})

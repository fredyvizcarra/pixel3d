/**
 * Crea (o actualiza) las colecciones temáticas iniciales.
 * Es idempotente: se puede correr varias veces sin duplicar.
 *
 *   npx tsx scripts/seed-collections.ts
 */
import "dotenv/config"
import { eq } from "drizzle-orm"
import { closeDb, getDb } from "../src/db"
import { categories } from "../src/db/schema"

const COLLECTIONS = [
  {
    slug: "game-day",
    legacySlugs: ["nfl"],
    name: "Game Day",
    tagline: "Fútbol americano: cascos, trofeos y accesorios para el domingo.",
    theme: "gameday",
    sortOrder: 1,
  },
  {
    slug: "navidad",
    legacySlugs: [],
    name: "Navidad",
    tagline: "Esferas, estrellas y adornos que se ven increíbles con luz.",
    theme: "navidad",
    sortOrder: 2,
  },
  {
    slug: "mundo-magico",
    legacySlugs: [],
    name: "Mundo Mágico",
    tagline: "Varitas, castillos y búhos para tu librero de fantasía.",
    theme: "magico",
    sortOrder: 3,
  },
]

const run = async () => {
  const db = getDb()

  for (const { legacySlugs, ...collection } of COLLECTIONS) {
    const values = { ...collection, featured: true }
    let existing = (
      await db.select().from(categories).where(eq(categories.slug, collection.slug))
    )[0]

    for (const legacy of legacySlugs) {
      if (existing) break
      existing = (
        await db.select().from(categories).where(eq(categories.slug, legacy))
      )[0]
    }

    if (existing) {
      await db.update(categories).set(values).where(eq(categories.id, existing.id))
      console.log(`Actualizada: ${existing.name} → ${collection.name}`)
    } else {
      await db.insert(categories).values(values)
      console.log(`Creada: ${collection.name}`)
    }
  }

  await closeDb()
}

run().catch(async (error) => {
  console.error(error)
  await closeDb()
  process.exit(1)
})

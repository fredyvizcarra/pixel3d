import "dotenv/config"
import Stripe from "stripe"
import { closeDb, getDb } from "../src/db"
import { products } from "../src/db/schema"
import { productImagesMap } from "../src/lib/product-images"
import { buildUniqueSlug } from "../src/lib/slugify"

const DEFAULT_STOCK = 10

const run = async () => {
  const stripeKey = process.env.STRIPE_SECRET_KEY

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required")
  }

  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY is required to import products")
  }

  const stripe = new Stripe(stripeKey)
  const db = getDb()

  const stripeProducts = await stripe.products.list({
    expand: ["data.default_price"],
    active: true,
    limit: 100,
  })

  console.log(`Found ${stripeProducts.data.length} Stripe products`)

  for (const stripeProduct of stripeProducts.data) {
    const price = stripeProduct.default_price as Stripe.Price | null
    const unitAmount = price?.unit_amount

    if (!unitAmount) {
      console.warn(`Skipping ${stripeProduct.name}: no price`)
      continue
    }

    const localImages = productImagesMap[stripeProduct.id] ?? []
    const stripeImages = stripeProduct.images ?? []
    const images = [
      ...localImages,
      ...stripeImages.filter((image) => !localImages.includes(image)),
    ]

    const videoUrl =
      stripeProduct.metadata?.video ||
      stripeProduct.metadata?.videoUrl ||
      stripeProduct.metadata?.video_mp4 ||
      null

    const slug = buildUniqueSlug(stripeProduct.name, stripeProduct.id)

    await db
      .insert(products)
      .values({
        slug,
        name: stripeProduct.name,
        description: stripeProduct.description,
        price: unitAmount,
        stock: DEFAULT_STOCK,
        images,
        videoUrl,
        active: stripeProduct.active,
        legacyStripeId: stripeProduct.id,
      })
      .onConflictDoNothing({ target: products.slug })

    console.log(`Seeded: ${stripeProduct.name} (${slug})`)
  }

  await closeDb()
  console.log("Seed complete")
}

run().catch(async (error) => {
  console.error(error)
  await closeDb()
  process.exit(1)
})

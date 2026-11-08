import "dotenv/config"
import { getActiveProducts } from "../src/lib/products"
import { closeDb } from "../src/db"

const run = async () => {
  const rows = await getActiveProducts()
  console.log("count", rows.length)
  await closeDb()
}

run().catch(async (error) => {
  console.error(error)
  await closeDb()
  process.exit(1)
})

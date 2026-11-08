import "dotenv/config"
import postgres from "postgres"

const run = async () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL missing")
  }

  const sql = postgres(url, { prepare: false, ssl: "require" })

  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS "categories" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "slug" text NOT NULL,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      CONSTRAINT "categories_slug_unique" UNIQUE("slug")
    );
  `)

  await sql.unsafe(
    `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category_id" uuid;`
  )

  await sql.unsafe(`
    DO $$ BEGIN
      ALTER TABLE "products"
      ADD CONSTRAINT "products_category_id_categories_id_fk"
      FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id")
      ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `)

  console.log("schema updated")
  await sql.end()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})

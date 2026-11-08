import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  /** Frase corta que aparece en la tarjeta y portada de la colección */
  tagline: text("tagline"),
  /** Tema visual: "default" | "gameday" | "navidad" | "magico" (ver lib/collection-themes) */
  theme: text("theme").notNull().default("default"),
  /** Color de acento (#rrggbb) para colecciones con tema "default" */
  accentColor: text("accent_color"),
  /** Si aparece como "mundo" destacado en el inicio */
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  stock: integer("stock").notNull().default(0),
  images: text("images").array().notNull().default([]),
  videoUrl: text("video_url"),
  active: boolean("active").notNull().default(true),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  legacyStripeId: text("legacy_stripe_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}))

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

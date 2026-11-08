import postgres from "postgres"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import * as schema from "./schema"

type Db = PostgresJsDatabase<typeof schema>

let dbInstance: Db | null = null
let sqlInstance: ReturnType<typeof postgres> | null = null

export const getDb = (): Db => {
  if (dbInstance) return dbInstance

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is not set")
  }

  sqlInstance = postgres(url, { prepare: false })
  dbInstance = drizzle(sqlInstance, { schema })
  return dbInstance
}

export const closeDb = async (): Promise<void> => {
  if (!sqlInstance) return

  await sqlInstance.end()
  sqlInstance = null
  dbInstance = null
}

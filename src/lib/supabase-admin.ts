import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const PRODUCT_BUCKET = "product-images"

let supabaseAdmin: SupabaseClient | null = null

export const getSupabaseAdmin = (): SupabaseClient => {
  if (supabaseAdmin) return supabaseAdmin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Falta Storage: agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env"
    )
  }

  // Solo el origen (https://xxxx.supabase.co): si la variable trae "/rest/v1/"
  // u otra ruta, Storage responde "Invalid path specified in request URL"
  const projectUrl = new URL(url).origin

  supabaseAdmin = createClient(projectUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return supabaseAdmin
}

export const hasSupabaseStorage = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export const ensureBucket = async (): Promise<void> => {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase.storage.getBucket(PRODUCT_BUCKET)

  if (data) return

  const { error } = await supabase.storage.createBucket(PRODUCT_BUCKET, {
    public: true,
    fileSizeLimit: "10MB",
  })

  if (error && !error.message.toLowerCase().includes("already")) {
    throw new Error(error.message)
  }
}

const sanitizeFileName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-")
}

export const uploadProductImages = async (
  productId: string,
  files: File[]
): Promise<string[]> => {
  if (files.length === 0) return []

  await ensureBucket()
  const supabase = getSupabaseAdmin()
  const urls: string[] = []

  for (const file of files) {
    const safeName = sanitizeFileName(file.name) || "image.webp"
    const path = `${productId}/${Date.now()}-${safeName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage
      .from(PRODUCT_BUCKET)
      .upload(path, buffer, {
        contentType: file.type || "image/webp",
        upsert: false,
      })

    if (error) {
      throw new Error(`No se pudo subir ${file.name}: ${error.message}`)
    }

    const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return urls
}

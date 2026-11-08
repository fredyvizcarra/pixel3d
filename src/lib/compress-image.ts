/**
 * Reduce y comprime una foto en el navegador antes de subirla.
 *
 * Vercel rechaza peticiones de más de 4.5 MB, y una foto de celular pesa 3–6 MB.
 * Aquí se redimensiona a máx. 1600 px y se convierte a WebP (o JPEG si el
 * navegador no sabe generar WebP, como Safari antiguo). Resultado típico: 150–400 KB.
 */

const MAX_SIZE = 1600
const QUALITY = 0.82

const canvasToBlob = (canvas: HTMLCanvasElement, type: string) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY))

export const compressImage = async (file: File): Promise<File> => {
  // GIF animados: se suben tal cual para no perder la animación
  if (file.type === "image/gif") return file

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    return file // formato que el navegador no puede leer (p. ej. HEIC en Chrome)
  }

  const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  let blob = await canvasToBlob(canvas, "image/webp")
  if (!blob || blob.type !== "image/webp") {
    blob = await canvasToBlob(canvas, "image/jpeg")
  }
  if (!blob || blob.size >= file.size) return file

  const extension = blob.type === "image/webp" ? "webp" : "jpg"
  const baseName = file.name.replace(/\.[^.]+$/, "") || "foto"
  return new File([blob], `${baseName}.${extension}`, { type: blob.type })
}

/** Límite que dejamos por petición (Vercel corta en 4.5 MB) */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

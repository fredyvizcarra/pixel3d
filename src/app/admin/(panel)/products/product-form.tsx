"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import Image from "next/image"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PhotoIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import type { Category, Product } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { getThemeProps } from "@/lib/collection-themes"
import { compressImage, MAX_UPLOAD_BYTES } from "@/lib/compress-image"
import { formatPrice } from "@/lib/product-utils"
import { cn } from "@/lib/utils"
import { saveProduct, deleteProduct } from "./actions"

interface Props {
  product?: Product
  categories: Category[]
  storageReady: boolean
}

const SaveButton = ({ isEditing, disabled }: { isEditing: boolean; disabled?: boolean }) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || disabled} className="w-full">
      {pending ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
    </Button>
  )
}

const DeleteButton = () => {
  const [confirming, setConfirming] = useState(false)
  const { pending } = useFormStatus()

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="w-full text-center text-sm text-fog transition-colors hover:text-[#ff8aa3]"
      >
        Eliminar producto
      </button>
    )
  }

  return (
    <div className="rounded-[12px] border border-[#ff6b8a]/40 bg-[#ff6b8a]/10 p-3 text-sm">
      <p className="text-[#ffb3c2]">¿Eliminar este producto? No se puede deshacer.</p>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          formAction={deleteProduct}
          formNoValidate
          disabled={pending}
          className="rounded-[10px] bg-[#de2761] px-3 py-1.5 font-semibold text-snow hover:brightness-110"
        >
          Sí, eliminar
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-[10px] px-3 py-1.5 text-fog hover:text-snow"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export const ProductForm = ({ product, categories, storageReady }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [imageUrl, setImageUrl] = useState("")
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [compressing, setCompressing] = useState(0)

  // Estado para la vista previa en vivo
  const [name, setName] = useState(product?.name ?? "")
  const [price, setPrice] = useState(product ? (product.price / 100).toFixed(2) : "")
  const [stock, setStock] = useState(String(product?.stock ?? 10))
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "")
  const [active, setActive] = useState(product?.active ?? true)

  useEffect(() => {
    const urls = pendingFiles.map((file) => URL.createObjectURL(file))
    setPendingPreviews(urls)
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [pendingFiles])

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId]
  )
  const previewTheme = getThemeProps(selectedCategory)
  const previewImage = images[0] ?? pendingPreviews[0]
  const previewPrice = Math.round((Number(price.replace(",", ".")) || 0) * 100)
  const previewStock = Number.parseInt(stock, 10) || 0

  const handleAddImageUrl = () => {
    const nextUrl = imageUrl.trim()
    if (!nextUrl) return
    setImages((prev) => [...prev, nextUrl])
    setImageUrl("")
  }

  const handleImageUrlKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    event.preventDefault()
    handleAddImageUrl()
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  const handleSetCover = (index: number) => {
    setImages((prev) => {
      if (index === 0) return prev
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.unshift(item)
      return next
    })
  }

  const handleAddFiles = async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList).filter((file) => file.type.startsWith("image/"))
    if (incoming.length === 0) return
    setCompressing((prev) => prev + incoming.length)
    try {
      const compressed = await Promise.all(incoming.map(compressImage))
      setPendingFiles((prev) => [...prev, ...compressed])
    } finally {
      setCompressing((prev) => prev - incoming.length)
    }
  }

  const pendingBytes = pendingFiles.reduce((acc, file) => acc + file.size, 0)
  const tooBig = pendingBytes > MAX_UPLOAD_BYTES

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    void handleAddFiles(Array.from(event.target.files))
    event.target.value = ""
  }

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    void handleAddFiles(Array.from(event.dataTransfer.files))
  }

  const handleSave = async (formData: FormData) => {
    pendingFiles.forEach((file) => {
      formData.append("imageFiles", file)
    })
    await saveProduct(formData)
  }

  const photoCount = images.length + pendingFiles.length

  return (
    <form action={handleSave} className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="existingImages" value={JSON.stringify(images)} />

      {/* Columna principal */}
      <div className="grid gap-6">
        <section className="admin-card grid gap-4">
          <h2 className="font-display text-base font-bold">Información</h2>
          <label className="admin-label" htmlFor="product-name">
            Nombre
            <input
              id="product-name"
              name="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Casco de mesa en tus colores"
              className="admin-input"
            />
          </label>
          <label className="admin-label" htmlFor="product-description">
            Descripción
            <textarea
              id="product-description"
              name="description"
              rows={5}
              defaultValue={product?.description ?? ""}
              placeholder="Medidas, material, colores disponibles, si se puede personalizar..."
              className="admin-input"
            />
            <span className="admin-hint">Los saltos de línea se respetan en la tienda.</span>
          </label>
          <label className="admin-label" htmlFor="product-video">
            Video (opcional)
            <input
              id="product-video"
              name="videoUrl"
              type="url"
              defaultValue={product?.videoUrl ?? ""}
              placeholder="https://… (MP4 o enlace para insertar)"
              className="admin-input"
            />
          </label>
        </section>

        <section className="admin-card grid gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-base font-bold">Fotos</h2>
            <p className="font-mono text-xs text-fog">
              {photoCount} {photoCount === 1 ? "foto" : "fotos"} · la primera es la portada
            </p>
          </div>

          {(images.length > 0 || pendingPreviews.length > 0) && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((url, index) => (
                <li
                  key={`${url}-${index}`}
                  className="group relative overflow-hidden rounded-[14px] border border-line bg-dark-charcoal"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Foto ${index + 1}`}
                      fill
                      sizes="160px"
                      className="object-cover"
                      unoptimized
                    />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 rounded-full bg-blurple px-2 py-0.5 text-[11px] font-semibold text-snow">
                        Portada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1 p-1.5">
                    <button
                      type="button"
                      onClick={() => handleMoveImage(index, -1)}
                      disabled={index === 0}
                      className="grid size-7 place-items-center rounded-md text-fog hover:bg-snow/10 hover:text-snow disabled:opacity-30"
                      aria-label="Mover a la izquierda"
                    >
                      <ArrowLeftIcon className="size-4" />
                    </button>
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(index)}
                        className="grid size-7 place-items-center rounded-md text-fog hover:bg-snow/10 hover:text-snow"
                        aria-label="Usar como portada"
                        title="Usar como portada"
                      >
                        <StarIcon className="size-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="grid size-7 place-items-center rounded-md text-fog hover:bg-[#ff6b8a]/15 hover:text-[#ff8aa3]"
                      aria-label="Quitar foto"
                      title="Quitar foto"
                    >
                      <XMarkIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveImage(index, 1)}
                      disabled={index === images.length - 1}
                      className="grid size-7 place-items-center rounded-md text-fog hover:bg-snow/10 hover:text-snow disabled:opacity-30"
                      aria-label="Mover a la derecha"
                    >
                      <ArrowRightIcon className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
              {pendingPreviews.map((url, index) => (
                <li
                  key={url}
                  className="relative overflow-hidden rounded-[14px] border border-dashed border-blurple bg-blurple/10"
                >
                  <div className="relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
                    <img src={url} alt={`Nueva foto ${index + 1}`} className="h-full w-full object-cover" />
                    <span className="absolute top-2 left-2 rounded-full bg-cosmic/80 px-2 py-0.5 text-[11px] font-medium text-snow">
                      Nueva
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePendingFile(index)}
                    className="w-full px-2 py-2 text-xs text-fog hover:text-[#ff8aa3]"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}

          {storageReady ? (
            <div
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "rounded-[14px] border-2 border-dashed px-4 py-8 text-center transition-colors",
                isDragging ? "border-blurple bg-blurple/10" : "border-dim-grey"
              )}
            >
              <input
                ref={fileInputRef}
                id="product-files"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                aria-label="Elegir fotos"
                className="sr-only"
              />
              <PhotoIcon className="mx-auto size-7 text-fog" />
              <p className="mt-2 text-sm font-medium">Arrastra fotos aquí</p>
              <p className="mt-1 text-xs text-fog">
                JPG, PNG o WebP. Se optimizan solas y se suben al guardar.
              </p>
              {compressing > 0 && (
                <p className="mt-2 font-mono text-xs text-hover-blurple" aria-live="polite">
                  Optimizando {compressing} {compressing === 1 ? "foto" : "fotos"}…
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4"
              >
                Elegir fotos
              </Button>
            </div>
          ) : (
            <p className="rounded-[12px] border border-ember-orange/40 bg-ember-orange/10 px-4 py-3 text-sm text-ember-orange">
              Falta configurar Storage: agrega NEXT_PUBLIC_SUPABASE_URL y
              SUPABASE_SERVICE_ROLE_KEY en el .env y reinicia el servidor.
            </p>
          )}

          <details className="rounded-[12px] border border-line px-4 py-3">
            <summary className="cursor-pointer text-sm text-fog">
              Pegar URL de una foto que ya está en internet
            </summary>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                id="product-image-url"
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                onKeyDown={handleImageUrlKeyDown}
                placeholder="https://..."
                aria-label="URL de imagen"
                className="admin-input flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                Agregar
              </Button>
            </div>
          </details>
        </section>
      </div>

      {/* Columna lateral */}
      <aside className="grid gap-6 lg:sticky lg:top-6">
        <section className="admin-card grid gap-4">
          <label
            htmlFor="product-active"
            className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium"
          >
            <span>
              Visible en la tienda
              <span className="admin-hint block">
                {active ? "Los clientes lo pueden ver." : "Solo tú lo ves aquí."}
              </span>
            </span>
            <input
              id="product-active"
              type="checkbox"
              name="active"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative h-6 w-11 shrink-0 rounded-full bg-dim-grey transition-colors peer-checked:bg-spring-green/80 peer-focus-visible:ring-2 peer-focus-visible:ring-blurple after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-snow after:transition-transform peer-checked:after:translate-x-5"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="admin-label" htmlFor="product-price">
              Precio (MXN)
              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="349"
                className="admin-input tabular-nums"
              />
            </label>
            <label className="admin-label" htmlFor="product-stock">
              Stock
              <input
                id="product-stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                required
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                className="admin-input tabular-nums"
              />
            </label>
          </div>

          <label className="admin-label" htmlFor="product-category">
            Colección
            <select
              id="product-category"
              name="categoryId"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="admin-input"
            >
              <option value="">Sin colección</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          {tooBig && (
            <p className="rounded-[12px] border border-ember-orange/40 bg-ember-orange/10 px-3 py-2 text-xs text-ember-orange">
              Las fotos nuevas pesan {(pendingBytes / 1024 / 1024).toFixed(1)} MB. Guarda
              máximo unas 8–10 a la vez: quita algunas, guarda y luego agrega el resto.
            </p>
          )}
          <SaveButton isEditing={Boolean(product)} disabled={compressing > 0 || tooBig} />
          {product && <DeleteButton />}
        </section>

        <section aria-label="Vista previa" className="grid gap-2">
          <p className="font-mono text-[11px] tracking-[0.12em] text-fog uppercase">
            Así se verá en la tienda
          </p>
          <div
            className={cn(previewTheme.className, "overflow-hidden rounded-[20px] p-4")}
            style={previewTheme.style}
          >
            <div className="overflow-hidden rounded-[16px] border border-[var(--w-card-border)] bg-[var(--w-card)] text-[var(--w-card-text)]">
              <div className="relative aspect-square [background:var(--w-ph)]">
                {previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element -- puede ser blob: o URL externa
                  <img src={previewImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-mono text-xs text-[var(--w-card-muted)]">
                    Foto próximamente
                  </span>
                )}
                {!active && (
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-void/80 px-2.5 py-0.5 text-[11px] font-semibold text-snow">
                    Oculto
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 px-4 pt-3.5 pb-4">
                <p className="line-clamp-2 leading-snug font-semibold">
                  {name || "Nombre del producto"}
                </p>
                <p className="font-mono text-xs text-[var(--w-card-muted)]">
                  {previewStock <= 0
                    ? "Agotado"
                    : previewStock <= 3
                      ? `Últimas ${previewStock}`
                      : "Disponible"}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[17px] font-bold tabular-nums">
                    {formatPrice(previewPrice)}
                  </span>
                  <span className="rounded-[10px] bg-[var(--w-a)] px-3 py-1.5 text-[13px] font-semibold text-[var(--w-a-text)]">
                    Ver
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </form>
  )
}

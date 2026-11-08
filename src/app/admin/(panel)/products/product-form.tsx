"use client"

import { useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import Image from "next/image"
import type { Category, Product } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { saveProduct, deleteProduct } from "./actions"

interface Props {
  product?: Product
  categories: Category[]
  storageReady: boolean
}

const SaveButton = ({ isEditing }: { isEditing: boolean }) => {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[#662d91] px-6 text-white hover:bg-purple-700"
    >
      {pending
        ? "Guardando..."
        : isEditing
          ? "Guardar cambios"
          : "Crear producto"}
    </Button>
  )
}

export const ProductForm = ({ product, categories, storageReady }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [imageUrl, setImageUrl] = useState("")
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const urls = pendingFiles.map((file) => URL.createObjectURL(file))
    setPendingPreviews(urls)
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [pendingFiles])

  const handleAddImageUrl = () => {
    const nextUrl = imageUrl.trim()
    if (!nextUrl) return
    setImages((prev) => [...prev, nextUrl])
    setImageUrl("")
  }

  const handleImageUrlKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
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

  const handleAddFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    )
    if (incoming.length === 0) return
    setPendingFiles((prev) => [...prev, ...incoming])
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    handleAddFiles(event.target.files)
    event.target.value = ""
  }

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    handleAddFiles(event.dataTransfer.files)
  }

  const handleBrowseFiles = () => {
    fileInputRef.current?.click()
  }

  const handleSave = async (formData: FormData) => {
    pendingFiles.forEach((file) => {
      formData.append("imageFiles", file)
    })
    await saveProduct(formData)
  }

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = window.confirm(
      "¿Eliminar este producto? Esta acción no se puede deshacer."
    )
    if (!confirmed) {
      event.preventDefault()
    }
  }

  return (
    <form action={handleSave} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="existingImages" value={JSON.stringify(images)} />

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Nombre</span>
        <input
          name="name"
          required
          defaultValue={product?.name ?? ""}
          aria-label="Nombre del producto"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Descripción</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          aria-label="Descripción del producto"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">
            Precio (MXN)
          </span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={product ? (product.price / 100).toFixed(2) : "0"}
            aria-label="Precio en pesos"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Stock</span>
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product?.stock ?? 0}
            aria-label="Stock disponible"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Categoría</span>
          <select
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            aria-label="Categoría del producto"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="">Sin categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Video (URL)</span>
        <input
          name="videoUrl"
          type="url"
          defaultValue={product?.videoUrl ?? ""}
          placeholder="https://..."
          aria-label="URL de video"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
      </label>

      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={product?.active ?? true}
          className="h-4 w-4 rounded border-slate-300 text-purple-700"
        />
        Producto visible en la tienda
      </label>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-slate-700">Fotos</p>
          <p className="text-sm text-slate-500">
            Se suben a Supabase Storage al guardar. La primera foto es la
            portada del catálogo.
          </p>
        </div>

        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((url, index) => (
              <li
                key={`${url}-${index}`}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <div className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Foto ${index + 1} de ${product?.name ?? "producto"}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 rounded-full bg-[#662d91] px-2 py-0.5 text-[11px] font-medium text-white">
                      Portada
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1 p-2">
                  <button
                    type="button"
                    onClick={() => handleMoveImage(index, -1)}
                    className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-white"
                    aria-label="Mover foto a la izquierda"
                  >
                    ←
                  </button>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(index)}
                      className="rounded-md px-2 py-1 text-xs text-purple-700 hover:bg-white"
                      aria-label="Usar como portada"
                    >
                      Portada
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-white"
                    aria-label="Quitar foto"
                  >
                    Quitar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveImage(index, 1)}
                    className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-white"
                    aria-label="Mover foto a la derecha"
                  >
                    →
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pendingPreviews.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">
              Nuevas fotos (van a Storage al guardar)
            </p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pendingPreviews.map((url, index) => (
                <li
                  key={url}
                  className="relative overflow-hidden rounded-2xl border border-dashed border-purple-200 bg-purple-50"
                >
                  <div className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Nueva foto ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePendingFile(index)}
                    className="w-full px-2 py-2 text-xs text-red-600 hover:bg-white"
                    aria-label="Quitar foto nueva"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {storageReady ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={
              isDragging
                ? "rounded-2xl border-2 border-dashed border-purple-400 bg-purple-50 px-4 py-8 text-center"
                : "rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center"
            }
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              aria-label="Elegir fotos de tu computadora"
              className="sr-only"
            />
            <p className="text-sm font-medium text-slate-700">
              Arrastra fotos aquí o elige archivos
            </p>
            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG o WebP. Quedan en el bucket de Supabase, igual que en
              producción.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseFiles}
              className="mt-4 rounded-full border-slate-300 text-slate-800 hover:bg-white"
            >
              Elegir fotos
            </Button>
          </div>
        ) : (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Falta configurar Storage. En el .env agrega NEXT_PUBLIC_SUPABASE_URL
            y SUPABASE_SERVICE_ROLE_KEY (Project Settings → API en Supabase) y
            reinicia npm run dev.
          </p>
        )}

        <details className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-slate-600">
            Opcional: pegar URL (solo si la foto ya está en internet)
          </summary>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              onKeyDown={handleImageUrlKeyDown}
              placeholder="https://..."
              aria-label="URL de imagen"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddImageUrl}
              className="rounded-full border-slate-300 text-slate-800 hover:bg-white"
            >
              Agregar URL
            </Button>
          </div>
        </details>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SaveButton isEditing={Boolean(product)} />
        {product && (
          <Button
            type="submit"
            formAction={deleteProduct}
            onClick={handleDeleteClick}
            variant="outline"
            className="rounded-full border-red-200 text-red-700 hover:bg-red-50"
          >
            Eliminar
          </Button>
        )}
      </div>
    </form>
  )
}

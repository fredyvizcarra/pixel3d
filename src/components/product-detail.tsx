"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import { useCartStore } from "../../store/cart-store"
import { useMemo, useState } from "react"
import { formatPrice, isInStock } from "@/lib/product-utils"
import type { Product } from "@/db/schema"
import { cn } from "@/lib/utils"

interface Props {
  product: Product
}

export const ProductDetail = ({ product }: Props) => {
  const { addItem } = useCartStore()
  const inStock = isInStock(product)
  const allImages = useMemo(() => product.images, [product.images])
  const [selectedImage, setSelectedImage] = useState(allImages[0] ?? null)
  const [quantity, setQuantity] = useState<number>(1)

  const handleAddToCart = () => {
    if (!inStock) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: selectedImage,
      quantity,
    })
  }

  const handleIncrement = () =>
    setQuantity((prev) => Math.min(prev + 1, product.stock))

  const handleDecrement = () =>
    setQuantity((prev) => Math.max(prev - 1, 1))

  return (
    <div className="space-y-10 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:space-y-0">
      <div className="space-y-5">
        {selectedImage && (
          <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-not-quite-black">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        )}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {allImages.map((img, index) => (
              <button
                key={img + index}
                type="button"
                onClick={() => setSelectedImage(img)}
                aria-label={`Ver imagen ${index + 1}`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-[16px] border transition",
                  img === selectedImage
                    ? "border-blurple ring-2 ring-hover-blurple/40"
                    : "border-transparent hover:border-dim-grey"
                )}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {product.videoUrl && (
          <div className="overflow-hidden rounded-[24px] bg-void">
            {product.videoUrl.includes("http") &&
            product.videoUrl.endsWith(".mp4") ? (
              <video
                src={product.videoUrl}
                className="h-[480px] w-full object-cover"
                controls
                playsInline
              />
            ) : (
              <iframe
                src={product.videoUrl}
                className="h-[480px] w-full"
                title={`Video de ${product.name}`}
                allow="autoplay; encrypted-media; fullscreen"
              />
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-fog">Pixel3D</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-snow">
            {product.name}
          </h1>
          {product.description && (
            <p className="mt-4 text-lg leading-relaxed text-fog">
              {product.description}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm text-greyple">Precio</p>
          <p className="text-3xl font-extrabold text-snow">
            {formatPrice(product.price)}
          </p>
        </div>

        <div>
          <p className="text-sm text-greyple">Disponibilidad</p>
          <p
            className={
              inStock ? "text-base font-medium text-spring-green" : "text-base font-medium text-ekko-red"
            }
          >
            {inStock
              ? `${product.stock} unidades disponibles`
              : "Agotado temporalmente"}
          </p>
        </div>

        {inStock && (
          <div className="space-y-3">
            <p className="text-sm text-greyple">Cantidad</p>
            <div className="inline-flex items-center rounded-[12px] border border-dim-grey bg-not-quite-black px-2">
              <button
                type="button"
                onClick={handleDecrement}
                className="px-3 py-2 text-lg font-semibold text-snow hover:text-hover-blurple"
                aria-label="Disminuir cantidad"
              >
                –
              </button>
              <span className="px-4 text-lg font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={handleIncrement}
                className="px-3 py-2 text-lg font-semibold text-snow hover:text-hover-blurple"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          {inStock ? "Agregar al carrito" : "Agotado"}
        </Button>
      </div>
    </div>
  )
}

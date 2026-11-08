"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import { Button } from "./ui/button"
import { WorldTitle } from "./collections/world-title"
import { useCartStore } from "../../store/cart-store"
import { formatPrice, isInStock } from "@/lib/product-utils"
import { whatsappUrl } from "@/lib/contact"
import type { Product } from "@/db/schema"
import { cn } from "@/lib/utils"

interface Props {
  product: Product
  collection?: { name: string; slug: string } | null
}

const isDirectVideo = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url)

export const ProductDetail = ({ product, collection }: Props) => {
  const { addItem, items } = useCartStore()
  const inStock = isInStock(product)
  const images = product.images
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [justAdded, setJustAdded] = useState(false)
  const selectedImage = images[selectedIndex] ?? null

  const inCart = items.find((item) => item.id === product.id)?.quantity ?? 0
  const maxQuantity = Math.max(0, product.stock - inCart)

  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(() => setJustAdded(false), 4000)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  const handleAddToCart = () => {
    if (!inStock || quantity > maxQuantity) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: images[0] ?? null,
      quantity,
    })
    setQuantity(1)
    setJustAdded(true)
  }

  const stockLabel = !inStock
    ? "Agotado por ahora"
    : product.stock <= 3
      ? `¡Últimas ${product.stock} piezas!`
      : "Disponible"

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
      {/* Galería */}
      <div className="grid gap-4 md:grid-cols-[72px_1fr] md:gap-4">
        <div className="relative order-1 aspect-square w-full overflow-hidden rounded-[24px] [background:var(--w-ph)] md:order-2">
          {selectedImage ? (
            <Image
              key={selectedImage}
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="animate-in fade-in object-cover duration-300"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center font-mono text-sm text-[var(--w-card-muted)]">
              Foto próximamente
            </span>
          )}
          {!inStock && (
            <span className="absolute top-4 left-4 rounded-full bg-void/80 px-3 py-1 text-xs font-semibold text-snow">
              Agotado
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div
            className="order-2 flex gap-3 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-visible md:pb-0"
            role="group"
            aria-label="Fotos del producto"
          >
            {images.map((img, index) => (
              <button
                key={img + index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver foto ${index + 1}`}
                aria-pressed={index === selectedIndex}
                className={cn(
                  "relative size-[72px] shrink-0 overflow-hidden rounded-[14px] border-2 transition",
                  index === selectedIndex
                    ? "border-[var(--w-a)]"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image src={img} alt="" fill sizes="72px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {product.videoUrl && (
          <div className="order-3 overflow-hidden rounded-[24px] bg-void md:col-span-2">
            {isDirectVideo(product.videoUrl) ? (
              <video
                src={product.videoUrl}
                className="aspect-video w-full object-cover"
                controls
                playsInline
              />
            ) : (
              <iframe
                src={product.videoUrl}
                className="aspect-video w-full"
                title={`Video de ${product.name}`}
                allow="autoplay; encrypted-media; fullscreen"
              />
            )}
          </div>
        )}
      </div>

      {/* Información y compra */}
      <div className="lg:sticky lg:top-24">
        {collection ? (
          <Link
            href={`/colecciones/${collection.slug}`}
            className="eyebrow text-[var(--w-muted)] hover:text-[var(--w-text)]"
          >
            {collection.name}
          </Link>
        ) : (
          <p className="eyebrow text-[var(--w-muted)]">Pixel3D</p>
        )}

        <WorldTitle
          name={product.name}
          as="h1"
          highlight={false}
          className="mt-3 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.02]"
        />

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="font-display text-3xl font-bold tabular-nums">
            {formatPrice(product.price)}
          </p>
          <span
            className={cn(
              "rounded-full px-3 py-1 font-mono text-xs font-semibold",
              !inStock
                ? "bg-snow/10 text-[var(--w-muted)]"
                : product.stock <= 3
                  ? "bg-ember-orange/15 text-ember-orange"
                  : "bg-spring-green/15 text-spring-green"
            )}
          >
            {stockLabel}
          </span>
        </div>

        {inStock && (
          <div className="mt-7 flex flex-wrap items-stretch gap-3">
            <div className="inline-flex items-center rounded-[12px] border border-current/25">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                disabled={quantity <= 1}
                className="grid size-12 place-items-center transition hover:text-[var(--w-a)] disabled:opacity-40"
                aria-label="Disminuir cantidad"
              >
                <MinusIcon className="size-4" />
              </button>
              <span className="w-8 text-center text-lg font-semibold tabular-nums" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(prev + 1, Math.max(maxQuantity, 1)))}
                disabled={quantity >= maxQuantity}
                className="grid size-12 place-items-center transition hover:text-[var(--w-a)] disabled:opacity-40"
                aria-label="Aumentar cantidad"
              >
                <PlusIcon className="size-4" />
              </button>
            </div>
            <Button
              size="lg"
              variant="world"
              className="min-h-12 flex-1 py-3"
              onClick={handleAddToCart}
              disabled={maxQuantity === 0}
            >
              {maxQuantity === 0 ? "Ya tienes todo el stock en tu carrito" : "Agregar al carrito"}
            </Button>
          </div>
        )}

        <div aria-live="polite">
          {justAdded && (
            <div className="animate-in fade-in slide-in-from-top-1 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-spring-green/30 bg-spring-green/10 px-4 py-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-spring-green">
                <CheckCircleIcon className="size-5" />
                Agregado al carrito
              </span>
              <Link href="/checkout" className="font-semibold underline-offset-4 hover:underline">
                Ver carrito →
              </Link>
            </div>
          )}
        </div>

        <a
          href={whatsappUrl(`Hola, me interesa "${product.name}". ¿Se puede personalizar?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-[12px] border border-current/25 px-4 py-3 text-sm font-medium transition hover:border-current/60"
        >
          <ChatBubbleLeftRightIcon className="size-5" />
          ¿Lo quieres en otro color o con tu nombre? Pregúntanos
        </a>

        {product.description && (
          <div className="mt-8 border-t border-current/15 pt-6">
            <h2 className="eyebrow text-[var(--w-muted)]">Descripción</h2>
            <p className="mt-3 max-w-[60ch] leading-relaxed whitespace-pre-line text-[var(--w-muted)]">
              {product.description}
            </p>
          </div>
        )}

        <ul className="mt-8 grid gap-2 border-t border-current/15 pt-6 font-mono text-xs text-[var(--w-muted)]">
          <li>· Impreso en 3D en México</li>
          <li>· Envíos a todo México</li>
          <li>· Dudas o pedidos especiales por WhatsApp</li>
        </ul>
      </div>
    </div>
  )
}

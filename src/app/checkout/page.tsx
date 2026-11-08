"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  ChatBubbleLeftRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/product-utils"
import { whatsappUrl } from "@/lib/contact"
import { useCartStore, type CartItem } from "../../../store/cart-store"

/** Mensaje de pedido para WhatsApp (mientras se integra Mercado Pago) */
const buildOrderMessage = (
  items: CartItem[],
  total: number,
  customer?: { name?: string | null; email?: string | null }
) => {
  const lines = items.map(
    (item) =>
      `• ${item.quantity} × ${item.name} — ${formatPrice(item.price * item.quantity)}`
  )
  const who = customer?.name
    ? `\n\nMi nombre: ${customer.name}${customer.email ? ` (${customer.email})` : ""}`
    : ""
  return `Hola, quiero hacer este pedido en Pixel3D:\n\n${lines.join("\n")}\n\nSubtotal: ${formatPrice(total)}${who}\n\n¿Me confirman disponibilidad, envío y forma de pago?`
}

const PageHeader = ({ count }: { count?: number }) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div>
      <p className="eyebrow">Carrito</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-none font-black tracking-[-0.03em] uppercase">
        Tu carrito
      </h1>
    </div>
    {count !== undefined && count > 0 && (
      <p className="font-mono text-sm text-fog">
        {count} {count === 1 ? "pieza" : "piezas"}
      </p>
    )}
  </div>
)

const CartRow = ({ item }: { item: CartItem }) => {
  const { addItem, removeItem, deleteItem } = useCartStore()

  return (
    <li className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-[12px] bg-dark-charcoal sm:size-24">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-mono text-[10px] text-fog">
            Sin foto
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="leading-snug font-semibold">{item.name}</p>
            <p className="mt-0.5 font-mono text-xs text-fog">
              {formatPrice(item.price)} c/u
            </p>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-[10px] border border-line">
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label={`Quitar una unidad de ${item.name}`}
              className="grid size-9 place-items-center text-fog transition hover:text-snow"
            >
              <MinusIcon className="size-4" />
            </button>
            <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => addItem({ ...item, quantity: 1 })}
              aria-label={`Agregar una unidad de ${item.name}`}
              className="grid size-9 place-items-center text-fog transition hover:text-snow"
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => deleteItem(item.id)}
            className="inline-flex items-center gap-1.5 text-sm text-fog transition hover:text-[#ff8aa3]"
          >
            <TrashIcon className="size-4" />
            Quitar
          </button>
        </div>
      </div>
    </li>
  )
}

export default function CheckoutPage() {
  const { items } = useCartStore()
  const { data: session, status } = useSession()
  // El carrito vive en localStorage: esperamos a montar para no mostrar "vacío" por un instante
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const count = items.reduce((acc, item) => acc + item.quantity, 0)

  if (!mounted) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16">
        <PageHeader />
        <div className="mt-10 h-48 animate-pulse rounded-[20px] bg-panel" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <section className="bg-blueprint">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
          <p className="eyebrow">Carrito</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] leading-none font-black tracking-[-0.03em] text-balance uppercase">
            Tu carrito está <span className="text-hover-blurple">vacío.</span>
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-fog">
            Explora las colecciones y agrega tu primera pieza.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/#colecciones">Explorar colecciones →</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16">
      <PageHeader count={count} />

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section aria-label="Artículos" className="rounded-[20px] border border-line bg-panel p-5 sm:p-6">
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartRow key={item.id} item={item} />
            ))}
          </ul>
          <Link
            href="/#catalogo"
            className="mt-6 inline-block text-sm font-medium text-hover-blurple underline-offset-4 hover:underline"
          >
            ← Seguir comprando
          </Link>
        </section>

        <aside
          aria-label="Resumen de compra"
          className="rounded-[20px] border border-line bg-panel p-5 sm:p-6 lg:sticky lg:top-24"
        >
          <h2 className="font-display text-lg font-bold">Resumen</h2>

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-fog">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fog">Envío</dt>
              <dd className="text-fog">Se cotiza</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-bold tabular-nums">
              {formatPrice(total)}
            </span>
          </div>

          {status === "unauthenticated" && (
            <div className="mt-5 rounded-[12px] border border-line bg-cosmic/60 p-4 text-sm">
              <p className="font-medium">¿Quieres seguir tu pedido?</p>
              <p className="mt-1 text-fog">
                Entra con Google para ver tus pedidos en tu cuenta.
                También puedes pedir como invitado.
              </p>
              <Link
                href="/entrar?callbackUrl=/checkout"
                className="mt-2 inline-block font-medium text-hover-blurple underline-offset-4 hover:underline"
              >
                Entrar con Google →
              </Link>
            </div>
          )}

          <Button asChild size="lg" className="mt-5 w-full">
            <a
              href={whatsappUrl(buildOrderMessage(items, total, session?.user))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ChatBubbleLeftRightIcon className="size-5" />
              Hacer pedido por WhatsApp
            </a>
          </Button>
          <p className="mt-3 text-center text-xs text-fog">
            Te confirmamos disponibilidad, costo de envío y forma de pago por
            WhatsApp.
          </p>

          <ul className="mt-5 space-y-1.5 border-t border-line pt-5 font-mono text-xs text-fog">
            <li>· Envíos a todo México</li>
            <li>· Pago en línea con Mercado Pago muy pronto</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}

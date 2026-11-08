"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { whatsappUrl } from "@/lib/contact"
import { useCartStore } from "../../../store/cart-store"

export default function SuccessPage() {
  const { clearCart } = useCartStore()
  const { status } = useSession()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <section className="bg-blueprint">
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
        <p className="eyebrow">Pedido recibido</p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-none font-black tracking-[-0.03em] text-balance uppercase">
          ¡Gracias por <span className="text-hover-blurple">tu compra!</span>
        </h1>
        <p className="mt-5 max-w-[50ch] text-lg text-fog">
          Recibimos tu pago y ya estamos preparando tu pedido. Si tienes alguna
          duda, escríbenos por WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {status === "authenticated" ? (
            <Button asChild size="lg">
              <Link href="/cuenta">Ver mi cuenta</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/#colecciones">Seguir comprando</Link>
            </Button>
          )}
          <Button asChild size="lg" variant="outline">
            <a
              href={whatsappUrl("Hola, acabo de hacer un pedido en Pixel3D.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

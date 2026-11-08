"use client"

import { useCartStore } from "../../../store/cart-store"
import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"

export default function SuccessPage() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center">
      <Heading as="h1" size="md">
        Pago completado
      </Heading>
      <p className="mt-4 max-w-md text-fog">
        Gracias por tu compra. Tu orden está siendo procesada.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Continuar comprando</Link>
      </Button>
    </div>
  )
}

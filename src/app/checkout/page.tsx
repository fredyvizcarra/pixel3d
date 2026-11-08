"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CatalogHero } from "@/components/catalog-hero"
import { useCartStore } from "../../../store/cart-store"
import { checkoutAction } from "./checkout-action"

export default function CheckoutPage() {
  const { items, removeItem, addItem } = useCartStore()
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const handleDecrease = (id: string) => {
    removeItem(id)
  }

  const handleIncrease = (item: (typeof items)[number]) => {
    addItem({ ...item, quantity: 1 })
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="heading-display text-4xl">Tu carrito está vacío</h1>
        <p className="mt-4 text-fog">Explora el catálogo y agrega una pieza.</p>
        <Button asChild className="mt-8">
          <Link href="/">Ver catálogo</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cosmic">
      <CatalogHero
        kicker="Checkout"
        title="Resumen y pago"
        description="Revisa tus artículos, ajusta cantidades y finaliza el pedido."
      />
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <Card className="pb-6">
            <CardHeader>
              <CardTitle>Tus artículos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-6">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[16px] bg-not-quite-black p-4 sm:flex-row sm:items-center"
                  >
                    {item.imageUrl && (
                      <div className="relative h-24 w-24 overflow-hidden rounded-[16px] bg-void">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-snow">
                            {item.name}
                          </p>
                          <p className="text-sm text-fog">
                            ${(item.price / 100 || 0).toFixed(2)} c/u
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-snow">
                          ${((item.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrease(item.id)}
                          aria-label={`Quitar una unidad de ${item.name}`}
                        >
                          –
                        </Button>
                        <span className="text-base font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrease(item)}
                          aria-label={`Agregar una unidad de ${item.name}`}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="h-fit pb-6">
            <CardHeader>
              <CardTitle>Resumen de compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 text-sm text-fog">
                <div className="flex justify-between text-base text-snow">
                  <span>Subtotal</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>Calculados al pagar</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>Se cotiza</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-dim-grey pt-4 text-lg font-semibold text-snow">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>

              <form action={checkoutAction} className="space-y-4">
                <input
                  type="hidden"
                  name="items"
                  value={JSON.stringify(items)}
                />
                <Button type="submit" size="lg" className="w-full">
                  Proceder al pago
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

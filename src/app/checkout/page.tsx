"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "../../../store/cart-store";
import { checkoutAction } from "./checkout-action";

export default function CheckoutPage() {
  const { items, removeItem, addItem } = useCartStore();
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative w-full overflow-hidden rounded-b-3xl bg-black">
        <video
          src="/hero/hero-video.mp4"
          className="w-full h-60 object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="bg-black/30 rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80 mb-3">
            Checkout
          </div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Resumen y pago
          </h1>
          <p className="mt-3 text-base text-white/80 max-w-2xl">
            Revisa tus artículos, ajusta cantidades y finaliza el pedido.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <Card className="border border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Tus artículos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-6">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center"
                  >
                    {item.imageUrl && (
                      <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white">
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
                          <p className="text-base font-semibold text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            ${(item.price / 100 || 0).toFixed(2)} c/u
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">
                          ${((item.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => removeItem(item.id)}
                        >
                          –
                        </Button>
                        <span className="text-base font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => addItem({ ...item, quantity: 1 })}
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

          <Card className="border border-slate-200 shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Resumen de compra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex justify-between text-base text-slate-700">
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

              <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold text-slate-900">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>

              <form action={checkoutAction} className="space-y-4">
                <input
                  type="hidden"
                  name="items"
                  value={JSON.stringify(items)}
                />
                <Button
                  type="submit"
                  className="w-full rounded-full bg-[#662d91] hover:bg-purple-600 text-base py-6"
                >
                  Proceder al pago
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

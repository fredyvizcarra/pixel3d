"use server"

import { stripe } from "@/lib/stripe"
import { getProductById } from "@/lib/products"
import { redirect } from "next/navigation"

type CheckoutItem = {
  id: string
  name: string
  price: number
  quantity: number
}

export const checkoutAction = async (formData: FormData): Promise<void> => {
  const itemsJson = formData.get("items") as string
  const items = JSON.parse(itemsJson) as CheckoutItem[]

  if (!items.length) {
    throw new Error("El carrito está vacío")
  }

  const validatedItems = await Promise.all(
    items.map(async (item) => {
      const product = await getProductById(item.id)

      if (!product || !product.active) {
        throw new Error(`Producto no disponible: ${item.name}`)
      }

      if (item.quantity > product.stock) {
        throw new Error(
          `Stock insuficiente para ${product.name}. Disponibles: ${product.stock}`
        )
      }

      return {
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      }
    })
  )

  const line_items = validatedItems.map((item) => ({
    price_data: {
      currency: "mxn",
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  })

  redirect(session.url!)
}

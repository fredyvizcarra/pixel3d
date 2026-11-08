import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { formatPrice, isInStock } from "@/lib/product-utils"
import type { Product } from "@/db/schema"

interface Props {
  product: Product
}

export const ProductCard = ({ product }: Props) => {
  const mainImage = product.images[0]
  const inStock = isInStock(product)

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        {mainImage && (
          <div className="relative aspect-square w-full overflow-hidden bg-not-quite-black">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {!inStock && (
              <Badge className="absolute top-3 left-3 bg-void/80 text-snow">
                Agotado
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="flex-shrink-0 p-5 pb-3">
          <CardTitle className="line-clamp-2 text-lg font-extrabold normal-case tracking-tight">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col justify-between p-5 pt-0">
          {product.description && (
            <p className="mb-4 line-clamp-2 flex-shrink-0 text-sm text-fog">
              {product.description}
            </p>
          )}

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-extrabold text-snow">
                {formatPrice(product.price)}
              </p>
              {inStock && (
                <p className="text-xs text-greyple">{product.stock} disponibles</p>
              )}
            </div>
            <Button className="w-full">Ver detalles</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

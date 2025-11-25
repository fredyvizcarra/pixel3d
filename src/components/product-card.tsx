import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

interface Props {
  product: Stripe.Product;
}

export const ProductCard = ({ product }: Props) => {
  const price = product.default_price as Stripe.Price;

  return (
    <Link href={`/products/${product.id}`} className="block h-full group">
      <Card className="h-full flex flex-col overflow-hidden border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
        {product.images && product.images[0] && (
          <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader className="p-5 pb-3 flex-shrink-0">
          <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-2">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 pt-0 flex-grow flex flex-col justify-between">
          {product.description && (
            <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-shrink-0">
              {product.description}
            </p>
          )}

          <div className="mt-auto space-y-3">
            {price && price.unit_amount && (
              <p className="text-2xl font-bold text-slate-900">
                ${(price.unit_amount / 100).toFixed(2)}
              </p>
            )}
            <Button className="w-full bg-[#662d91] hover:bg-purple-700 text-white rounded-lg">
              Ver detalles
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

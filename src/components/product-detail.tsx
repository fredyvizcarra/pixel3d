"use client";

import Stripe from "stripe";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "../../store/cart-store";
import { useMemo, useState } from "react";

interface Props {
  product: Stripe.Product;
}

export const ProductDetail = ({ product }: Props) => {
  const { addItem } = useCartStore();
  const price = product.default_price as Stripe.Price;
  const priceAmount = price?.unit_amount ?? 0;
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] ?? null
  );
  const [quantity, setQuantity] = useState<number>(1);

  const galleryImages = useMemo(() => product.images ?? [], [product.images]);
  const videoUrl =
    product.metadata?.video ||
    product.metadata?.videoUrl ||
    product.metadata?.video_mp4 ||
    "";

  const handleAddToCart = () => {
    if (!priceAmount) return;
    addItem({
      id: product.id,
      name: product.name,
      price: priceAmount,
      imageUrl: selectedImage,
      quantity,
    });
  };

  const increment = () =>
    setQuantity((prev) => Math.min(prev + 1, 10));
  const decrement = () =>
    setQuantity((prev) => Math.max(prev - 1, 1));

  return (
    <div className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
      <div className="space-y-5">
        {selectedImage && (
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-slate-100">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        )}
        {galleryImages.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, index) => (
              <button
                key={img + index}
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                  img === selectedImage
                    ? "border-purple-500 ring-2 ring-purple-200"
                    : "border-transparent hover:border-slate-300"
                }`}
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

        {videoUrl && (
          <div className="rounded-3xl bg-black overflow-hidden">
            {videoUrl.includes("http") && videoUrl.endsWith(".mp4") ? (
              <video
                src={videoUrl}
                className="w-full h-[480px] object-cover"
                controls
                playsInline
              />
            ) : (
              <iframe
                src={videoUrl}
                className="w-full h-[480px]"
                allow="autoplay; encrypted-media; fullscreen"
              />
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-purple-500">
            Pixel3D
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">
            {product.name}
          </h1>
          {product.description && (
            <p className="mt-4 text-lg text-slate-600">
              {product.description}
            </p>
          )}
        </div>

        {priceAmount > 0 && (
          <div>
            <p className="text-sm text-slate-500">Precio</p>
            <p className="text-3xl font-semibold text-slate-900">
              ${(priceAmount / 100).toFixed(2)}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-slate-500">Cantidad</p>
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4">
            <button
              onClick={decrement}
              className="px-3 py-2 text-lg font-semibold text-slate-700 hover:text-purple-600"
            >
              –
            </button>
            <span className="px-4 text-lg font-semibold">{quantity}</span>
            <button
              onClick={increment}
              className="px-3 py-2 text-lg font-semibold text-slate-700 hover:text-purple-600"
            >
              +
            </button>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full rounded-full bg-[#662d91] hover:bg-purple-600"
          onClick={handleAddToCart}
        >
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
};

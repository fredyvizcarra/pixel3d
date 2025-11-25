import { stripe } from "@/lib/stripe";
import { ProductDetail } from "@/components/product-detail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await stripe.products.retrieve(id, {
    expand: ["default_price"],
  });
  const plainProduct = JSON.parse(JSON.stringify(product));
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
          <div className="bg-black/30 rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80 mb-4">
            Producto destacado
          </div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            {plainProduct.name}
          </h1>
          <p className="mt-3 text-base text-white/80 max-w-2xl">
            Detalles completos y materiales premium para tus proyectos.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductDetail product={plainProduct} />
      </div>
    </div>
  );
}

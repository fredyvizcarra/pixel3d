import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";

export default async function ProductsPage() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  return (
    <div className="min-h-screen bg-slate-50 ">
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
            Catálogo
          </div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Catálogo de Productos
          </h1>
          <p className="mt-3 text-base text-white/80 max-w-2xl">
            Explora nuestra colección completa de productos de impresión 3D.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center mb-12" />
        <ProductList products={products.data} />
      </div>
    </div>
  );
}

import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "@/components/carousel";
import { ScrollAnimate } from "@/components/scroll-animate";
import { ContactForm } from "@/components/contact-form";

export default async function Home() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 8,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* seccion 1 */}
      <section className="relative isolate overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <Image
            src="/hero/heroprinter.png"
            alt="Impresoras 3D de alta gama"
            fill
            priority
            className="object-cover opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/50" />
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 sm:px-8 md:flex-row md:items-center md:gap-16 lg:px-12 lg:py-32">
          <div className="relative z-10 max-w-2xl space-y-6 text-white">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium uppercase tracking-wide text-purple-300 ring-1 ring-inset ring-[#662d91]">
              Impresión 3D premium
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Fabricamos ideas con precisión industrial
            </h1>
            <p className="text-lg sm:text-xl text-slate-200">
              Pixel3D convierte tus ideas en piezas funcionales con impresión 3D
              profesional. Compra desde nuestro catálogo o solicita tu impresión
              personalizada.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#662d91] px-8 py-6 text-base font-medium text-white hover:bg-purple-400"
              >
                <Link href="/products">Explorar catálogo</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="rounded-full border border-white/40 bg-transparent px-8 py-6 text-base font-medium text-white hover:bg-white/10"
              >
                <Link href="/services">Conocer servicios</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200/80">
              <div>
                <p className="font-semibold text-white">
                  Alta precisión dimensional
                </p>
                <p>
                  Piezas confiables gracias a calibraciones y controles
                  constantes.
                </p>
              </div>
              <div>
                <p className="font-semibold text-white">Materiales premium</p>
                <p>Filamentos de alta calidad para acabados profesionales.</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex w-full max-w-md flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">
              Colección destacada
            </h2>
            <p className="text-sm text-slate-200">
              Modelos seleccionados por su popularidad y calidad de impresión.
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 ">
              <Carousel products={products.data.slice(0, 5)} />
            </div>
          </div>
        </div>
      </section>
      {/* seccion 2 */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Contenido izquierdo */}
            <ScrollAnimate delay={0}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    Trabajamos con el{" "}
                    <span className="text-[#662d91]">top</span> de impresoras
                    del mercado
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    En Pixel3D utilizamos exclusivamente impresoras{" "}
                    <span className="font-semibold text-slate-900">
                      BambuLab
                    </span>
                    , reconocidas mundialmente por su precisión, velocidad y
                    confiabilidad industrial. Esta tecnología nos permite
                    entregar piezas con la más alta calidad.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-start gap-2">
                      <div className=" flex h-10 w-10 items-center justify-center rounded-xl bg-[#662d91]/10">
                        <svg
                          className="h-6 w-6 text-[#662d91]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Precisión industrial
                      </h3>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Tolerancias de ±0.1mm garantizadas en cada impresión.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-start gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                        <svg
                          className="h-6 w-6 text-emerald-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Velocidad superior
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Hasta 5x más rápido que impresoras tradicionales.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-start gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                        <svg
                          className="h-6 w-6 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Confiabilidad 24/7
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Mantenimiento predictivo para producción continua.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-start gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                        <svg
                          className="h-6 w-6 text-purple-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Multi-material
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Soporte para más de 5 materiales técnicos desde PLA hasta
                      PETG.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimate>

            {/* Imagen derecha con animación */}
            <ScrollAnimate delay={200}>
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative">
                  {/* Efecto de glow sutil detrás de la imagen */}
                  <div className="flex justify-end gap-3 w-full">
                    <Image
                      src="/logo/bambulab-logo.png"
                      alt="BambuLab Logo"
                      width={180}
                      height={60}
                      className="h-14 w-auto object-contain"
                    />
                  </div>
                  <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-[#662d91]/30 via-purple-500/20 to-emerald-500/20 blur-3xl opacity-60" />

                  {/* Imagen grande sin card */}
                  <Image
                    src="/hero/x1.png"
                    alt="BambuLab X1 Carbon - Impresora 3D de alta gama"
                    width={750}
                    height={750}
                    className="relative z-10 w-full max-w-[600px] object-contain drop-shadow-2xl sm:max-w-[700px] lg:max-w-[750px]"
                    priority
                  />
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>
      {/* seccion 3 */}
      <section className="bg-slate-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <ScrollAnimate delay={0}>
            <div className="text-center space-y-4 mb-12">
              <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                Filamentos Premium
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Trabajamos con las mejores marcas del mercado
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Seleccionamos cuidadosamente nuestros proveedores para
                garantizar la máxima calidad en cada impresión.
              </p>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={150}>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 items-center justify-items-center">
              {/* Logo 1 */}
              <div className="group relative flex items-center justify-center w-full h-24 sm:h-28 transition-all duration-300 hover:scale-105">
                <Image
                  src="/logo/1.png"
                  alt="Marca de filamentos premium"
                  width={150}
                  height={80}
                  className="w-auto h-full max-h-20 sm:max-h-24 object-contain opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Logo 2 */}
              <div className="group relative flex items-center justify-center w-full h-24 sm:h-28 transition-all duration-300 hover:scale-105">
                <Image
                  src="/logo/2.png"
                  alt="Marca de filamentos premium"
                  width={150}
                  height={80}
                  className="w-auto h-full max-h-20 sm:max-h-24 object-contain opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Logo 3 */}
              <div className="group relative flex items-center justify-center w-full h-24 sm:h-28 transition-all duration-300 hover:scale-105">
                <Image
                  src="/logo/3.png"
                  alt="Marca de filamentos premium"
                  width={150}
                  height={80}
                  className="w-auto h-full max-h-20 sm:max-h-24 object-contain opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Logo 4 */}
              <div className="group relative flex items-center justify-center w-full h-24 sm:h-28 transition-all duration-300 hover:scale-105">
                <Image
                  src="/logo/4.png"
                  alt="Marca de filamentos premium"
                  width={150}
                  height={80}
                  className="w-auto h-full max-h-20 sm:max-h-24 object-contain opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>
      {/* seccion 4 */}
      <section className="bg-gradient-to-br from-[#662d91] via-purple-700 to-blue-700 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-8 lg:flex-row lg:items-center lg:gap-20 lg:px-12">
          {/* GIF lado izquierdo */}
          <div className="flex-1 flex items-center justify-center lg:justify-start">
            <div className="relative w-full max-w-lg">
              <Image
                src="/hero/purplegif.gif"
                alt="Animación 3D Pixel3D"
                width={600}
                height={600}
                className="w-full h-auto rounded-2xl"
                unoptimized
              />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

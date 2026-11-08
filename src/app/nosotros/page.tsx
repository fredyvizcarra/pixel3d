import Image from "next/image"
import Link from "next/link"
import { ScrollAnimate } from "@/components/scroll-animate"
import { ContactForm } from "@/components/contact-form"
import { HeroCard } from "@/components/hero-card"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-cosmic text-snow">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#3442d9_0%,_transparent_42%),linear-gradient(180deg,_#0e0f2d_0%,_#050614_100%)]" />
        <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col gap-10 px-6 pt-28 pb-16 sm:px-8 md:flex-row md:items-start md:gap-12 lg:px-8 lg:py-32">
          <div className="max-w-lg space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-fog">
              Sobre nosotros
            </p>
            <Heading as="h1" size="display">
              Fabricamos ideas con precisión industrial
            </Heading>
            <p className="max-w-[380px] text-base leading-relaxed text-fog">
              Pixel3D es un taller de impresión 3D en México. Convertimos ideas
              en piezas funcionales: catálogo listo para comprar o proyectos a
              medida.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="secondary">
                <Link href="#contacto">Hablar con nosotros</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/">Ver catálogo</Link>
              </Button>
            </div>
          </div>
          <div className="relative z-10 grid w-full gap-6 md:flex-1 lg:grid-cols-2">
            <HeroCard
              href="/"
              imageSrc="/hero/psyche.jpg"
              imageAlt="Fondo artístico del catálogo"
              number="01"
              title="Catálogo"
              description="Revisa nuestro catálogo de productos y encuentra la pieza ideal para tus proyectos."
              hoverTransform="scale(1.07) rotate(1.25deg)"
            />
            <HeroCard
              href="#contacto"
              imageSrc="/hero/polis.jpg"
              imageAlt="Fondo artístico de contacto"
              number="02"
              title="Contacto"
              description="¿Tienes dudas o un proyecto especial? Escríbenos y te ayudamos a encontrar la mejor solución."
              hoverTransform="scale(1.06) translateX(-1.5%) translateY(-1%)"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <ScrollAnimate delay={0}>
              <div className="space-y-8">
                <Heading as="h2" size="md">
                  Trabajamos con el top de impresoras del mercado
                </Heading>
                <p className="text-lg leading-relaxed text-fog">
                  En Pixel3D utilizamos exclusivamente impresoras{" "}
                  <span className="font-semibold text-snow">Bambu Lab</span>,
                  reconocidas por su precisión, velocidad y confiabilidad.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    [
                      "Precisión industrial",
                      "Tolerancias de ±0.1mm en cada impresión.",
                    ],
                    [
                      "Velocidad superior",
                      "Hasta 5x más rápido que equipos tradicionales.",
                    ],
                    [
                      "Confiabilidad 24/7",
                      "Producción continua con calibración constante.",
                    ],
                    [
                      "Multi-material",
                      "PLA, PETG y más filamentos técnicos.",
                    ],
                  ].map(([title, body]) => (
                    <div
                      key={title}
                      className="rounded-[16px] bg-dark-charcoal p-6"
                    >
                      <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-snow">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-fog">
                        {body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimate>

            <ScrollAnimate delay={200}>
              <div className="relative flex flex-col items-center">
                <div className="mb-4 flex w-full justify-end">
                  <Image
                    src="/logo/bambulab-logo.png"
                    alt="BambuLab"
                    width={180}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div className="relative w-full overflow-hidden rounded-[24px] bg-off-white p-4 sm:p-8">
                  <Image
                    src="/hero/x1.png"
                    alt="BambuLab X1 Carbon"
                    width={750}
                    height={750}
                    className="relative z-10 h-auto w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-[1200px] rounded-[24px] bg-off-white px-8 py-16">
          <ScrollAnimate delay={0}>
            <div className="mb-12 space-y-4 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-dim-grey">
                Filamentos premium
              </p>
              <Heading as="h2" size="sm" className="text-void">
                Las mejores marcas del mercado
              </Heading>
            </div>
          </ScrollAnimate>
          <ScrollAnimate delay={150}>
            <div className="grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-4">
              {["/logo/1.png", "/logo/2.png", "/logo/3.png", "/logo/4.png"].map(
                (src) => (
                  <Image
                    key={src}
                    src={src}
                    alt="Marca de filamentos premium"
                    width={150}
                    height={80}
                    className="h-20 w-auto object-contain sm:h-24"
                  />
                )
              )}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      <section id="contacto" className="px-6 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Image
              src="/hero/purplegif.gif"
              alt="Animación 3D Pixel3D"
              width={600}
              height={600}
              className="h-auto w-full rounded-[24px]"
              unoptimized
            />
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}

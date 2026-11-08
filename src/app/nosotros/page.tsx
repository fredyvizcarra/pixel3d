import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { SectionHead } from "@/components/section-head"
import { Button } from "@/components/ui/button"
import { whatsappUrl } from "@/lib/contact"

export const metadata: Metadata = {
  title: "Nosotros · Pixel3D",
  description:
    "Pixel3D es un taller de impresión 3D en México. Imprimimos con equipos Bambu Lab y filamentos de marcas reconocidas.",
}

const FEATURES = [
  {
    title: "Precisión industrial",
    body: "Tolerancias de ±0.1 mm en cada impresión.",
  },
  {
    title: "Velocidad",
    body: "Hasta 5 veces más rápido que equipos tradicionales.",
  },
  {
    title: "Confiabilidad",
    body: "Producción continua con calibración constante.",
  },
  {
    title: "Multimaterial",
    body: "PLA, PETG y más filamentos técnicos.",
  },
]

const FILAMENT_LOGOS = ["/logo/1.png", "/logo/2.png", "/logo/3.png", "/logo/4.png"]

const SOCIALS = [
  { label: "WhatsApp", value: "Respuesta el mismo día hábil", href: whatsappUrl() },
  { label: "Instagram", value: "@pixel3dmx", href: "https://www.instagram.com/pixel3dmx/" },
  { label: "TikTok", value: "@pixel3d83", href: "https://www.tiktok.com/@pixel3d83" },
]

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-blueprint border-b border-line">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div>
            <p className="eyebrow">Sobre nosotros</p>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[0.98] font-black tracking-[-0.03em] text-balance uppercase">
              Un taller de impresión 3D{" "}
              <span className="text-hover-blurple">hecho en México.</span>
            </h1>
            <p className="mt-5 max-w-[48ch] text-lg text-fog">
              Convertimos ideas en piezas reales: colecciones listas para
              comprar y proyectos a medida, impresos y revisados uno por uno.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="#contacto">Escríbenos</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#colecciones">Ver colecciones</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <div
              className="absolute inset-[12%] rounded-full bg-blurple/40 blur-3xl"
              aria-hidden="true"
            />
            {/* WebP animado convertido del GIF original (24 MB → 3.9 MB) */}
            <Image
              src="/hero/purple-shape.webp"
              alt=""
              width={560}
              height={594}
              unoptimized
              className="relative h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="equipo-title"
        className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-20"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead id="equipo-title" title="Imprimimos con Bambu Lab" />
            <p className="-mt-2 max-w-[52ch] text-lg text-fog">
              Usamos impresoras <span className="font-semibold text-snow">Bambu Lab</span>,
              reconocidas por su precisión, velocidad y confiabilidad. Así cada
              pieza sale con el mismo acabado, sea la primera o la número cien.
            </p>
            <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="border-t border-line py-4">
                  <h3 className="font-display text-sm font-bold tracking-[-0.01em] uppercase">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] text-fog">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <figure className="relative overflow-hidden rounded-[24px] bg-[#eef0f4] p-6 sm:p-10">
            <Image
              src="/logo/bambulab-logo.png"
              alt="Bambu Lab"
              width={140}
              height={56}
              className="absolute top-5 right-5 h-9 w-auto sm:h-10"
            />
            <Image
              src="/hero/x1.png"
              alt="Impresora Bambu Lab"
              width={750}
              height={750}
              sizes="(max-width: 1024px) 100vw, 560px"
              className="mx-auto h-auto w-full max-w-[460px]"
            />
          </figure>
        </div>
      </section>

      <section aria-labelledby="filamentos-title" className="border-y border-line bg-panel/40">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
          <h2 id="filamentos-title" className="eyebrow text-center">
            Filamentos de marcas reconocidas
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FILAMENT_LOGOS.map((src) => (
              <div
                key={src}
                className="grid h-24 place-items-center rounded-[16px] bg-white px-6"
              >
                <Image
                  src={src}
                  alt="Marca de filamento"
                  width={150}
                  height={80}
                  className="h-14 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contacto"
        aria-labelledby="contacto-title"
        className="mx-auto max-w-[1200px] scroll-mt-20 px-4 py-16 sm:px-6 md:py-20"
      >
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead id="contacto-title" title="¿Tienes una idea?" />
            <p className="-mt-2 max-w-[46ch] text-lg text-fog">
              Cuéntanos qué quieres imprimir. Te respondemos con una cotización
              y, si hace falta, un render para que apruebes antes de imprimir.
            </p>
            <ul className="mt-8">
              {SOCIALS.map((social) => (
                <li key={social.label} className="border-t border-line last:border-b">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="font-semibold">{social.label}</span>
                    <span className="flex items-center gap-2 font-mono text-sm text-fog transition-colors group-hover:text-snow">
                      {social.value}
                      <span aria-hidden="true">↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export const SiteFooter = () => {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Image
            src="/logo/pixel3d-w.png"
            width={140}
            height={35}
            alt="Pixel3D"
            className="h-6 w-auto"
          />
          <p className="max-w-xs text-sm leading-relaxed text-fog">
            Impresión 3D profesional. Piezas del catálogo y proyectos a
            medida.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium tracking-[0.013em] text-snow">
            Tienda
          </p>
          <Link href="/#colecciones" className="block text-sm text-fog hover:text-snow">
            Colecciones
          </Link>
          <Link href="/#catalogo" className="block text-sm text-fog hover:text-snow">
            Catálogo
          </Link>
          <Link href="/nosotros" className="block text-sm text-fog hover:text-snow">
            Nosotros
          </Link>
          <Link href="/checkout" className="block text-sm text-fog hover:text-snow">
            Carrito
          </Link>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium tracking-[0.013em] text-snow">
            Contacto
          </p>
          <Link href="/nosotros#contacto" className="block text-sm text-fog hover:text-snow">
            WhatsApp
          </Link>
          <a
            href="https://www.instagram.com/pixel3dmx/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-fog hover:text-snow"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@pixel3d83"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-fog hover:text-snow"
          >
            TikTok
          </a>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium tracking-[0.013em] text-snow">
            Pixel3D
          </p>
          <p className="text-sm leading-relaxed text-fog">
            Hecho en México. Filamentos premium e impresoras Bambu Lab.
          </p>
        </div>
      </div>
    </footer>
  )
}

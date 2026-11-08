"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useCartStore } from "../../store/cart-store"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/#colecciones", label: "Colecciones" },
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#personalizados", label: "Personalizados" },
  { href: "/nosotros", label: "Nosotros" },
]

export const Navbar = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const { items } = useCartStore()
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (pathname?.startsWith("/admin")) {
    return null
  }

  // El carrito vive en localStorage: solo se muestra el contador ya montado
  const showCount = mounted && cartCount > 0

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-cosmic/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center gap-6 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-85"
          aria-label="Pixel3D inicio"
        >
          <Image src="/logo/p.png" width={36} height={36} alt="" className="h-9 w-9" priority />
          <Image
            src="/logo/pixel3d-w.png"
            width={140}
            height={35}
            alt="Pixel3D"
            className="h-5 w-auto"
            priority
          />
        </Link>

        <div className="ml-auto hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-fog transition-colors hover:text-snow"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/checkout"
          aria-label={showCount ? `Carrito, ${cartCount} artículos` : "Carrito"}
          className="ml-auto flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-snow transition-colors hover:border-blurple md:ml-0"
        >
          <ShoppingCartIcon className="size-5" />
          <span className="hidden sm:inline">Carrito</span>
          {showCount && (
            <span className="rounded-full bg-blurple px-2 text-[11px] leading-5 font-semibold text-snow">
              {cartCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
          className="rounded-[10px] p-1.5 text-snow hover:bg-snow/10 md:hidden"
        >
          {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-line px-4 pb-4 md:hidden">
          <ul className="space-y-1 pt-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-[10px] px-3 py-2.5 text-snow hover:bg-snow/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

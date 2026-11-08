"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useCartStore } from "../../store/cart-store"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

export const Navbar = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const { items } = useCartStore()
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 54)
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const handleToggleMobile = () => {
    setMobileOpen((prev) => !prev)
  }

  const handleCloseMobile = () => {
    setMobileOpen(false)
  }

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-full max-w-[1200px] -translate-x-1/2 px-4 sm:px-6">
      <div
        className={
          isScrolled
            ? "mx-auto rounded-[16px] border border-snow/10 bg-not-quite-black/80 backdrop-blur-md"
            : "mx-auto rounded-[16px] border border-snow/10 bg-snow/5 backdrop-blur-md"
        }
      >
        <div className="flex items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80"
            aria-label="Pixel3D inicio"
          >
            <Image
              src="/logo/p.png"
              width={40}
              height={40}
              alt=""
              className="h-10 w-10"
            />
            <Image
              src="/logo/pixel3d-w.png"
              width={140}
              height={35}
              alt="Pixel3D"
              className="h-6 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-base font-medium tracking-[0.013em] text-snow hover:text-hover-blurple"
            >
              Catálogo
            </Link>
            <Link
              href="/nosotros"
              className="text-base font-medium tracking-[0.013em] text-snow hover:text-hover-blurple"
            >
              Nosotros
            </Link>
            <Link
              href="/nosotros#contacto"
              className="text-base font-medium tracking-[0.013em] text-snow hover:text-hover-blurple"
            >
              Contacto
            </Link>
            <Button asChild variant="login" size="sm" className="shrink-0">
              <Link href="/checkout" aria-label="Carrito de compras">
                <ShoppingCartIcon className="size-5" />
                Carrito
                {cartCount > 0 && (
                  <Badge className="bg-blurple text-snow">{cartCount}</Badge>
                )}
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/checkout" className="relative text-snow" aria-label="Carrito">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blurple text-xs font-semibold text-snow">
                  {cartCount}
                </span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleMobile}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mt-2 rounded-[16px] border border-snow/10 bg-not-quite-black/95 p-4 backdrop-blur-md md:hidden">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                onClick={handleCloseMobile}
                className="block rounded-[12px] px-4 py-2 text-snow hover:bg-snow/10"
              >
                Catálogo
              </Link>
            </li>
            <li>
              <Link
                href="/nosotros"
                onClick={handleCloseMobile}
                className="block rounded-[12px] px-4 py-2 text-snow hover:bg-snow/10"
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/nosotros#contacto"
                onClick={handleCloseMobile}
                className="block rounded-[12px] px-4 py-2 text-snow hover:bg-snow/10"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

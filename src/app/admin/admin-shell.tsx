"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowTopRightOnSquareIcon,
  ArrowUpTrayIcon,
  ArrowRightStartOnRectangleIcon,
  CubeIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { logoutAdmin } from "./login/actions"

const NAV = [
  { href: "/admin/products", label: "Productos", icon: CubeIcon, exact: false },
  { href: "/admin/categories", label: "Colecciones", icon: RectangleStackIcon, exact: false },
  { href: "/admin/products/import", label: "Importar CSV", icon: ArrowUpTrayIcon, exact: true },
]

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? ""

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href
    // "Productos" no debe marcarse activo en "Importar CSV"
    if (href === "/admin/products" && pathname.startsWith("/admin/products/import")) {
      return false
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-cosmic text-snow lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="sticky top-0 z-20 border-b border-line bg-panel/95 backdrop-blur lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-0 lg:px-4 lg:py-6">
          <Link href="/admin/products" className="flex items-center gap-2.5 lg:mb-8 lg:px-2">
            <Image src="/logo/p.png" width={28} height={28} alt="" className="size-7" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-sm font-bold tracking-[0.04em]">PIXEL3D</span>
              <span className="mt-1 font-mono text-[10px] tracking-[0.14em] text-fog uppercase">
                Admin
              </span>
            </span>
          </Link>

          <nav
            aria-label="Panel"
            className="-mx-1 flex flex-1 gap-1 overflow-x-auto lg:mx-0 lg:flex-col lg:overflow-visible"
          >
            {NAV.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-blurple text-snow"
                      : "text-fog hover:bg-snow/5 hover:text-snow"
                  )}
                >
                  <item.icon className="size-[18px]" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-1 lg:mt-auto lg:flex-col lg:items-stretch lg:border-t lg:border-line lg:pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm text-fog transition-colors hover:bg-snow/5 hover:text-snow"
            >
              <ArrowTopRightOnSquareIcon className="size-[18px]" />
              <span className="hidden sm:inline">Ver tienda</span>
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm text-fog transition-colors hover:bg-snow/5 hover:text-snow"
              >
                <ArrowRightStartOnRectangleIcon className="size-[18px]" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}

"use client"

import Link from "next/link"
import { logoutAdmin } from "./login/actions"

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/products"
              className="text-lg font-semibold text-slate-900"
            >
              Admin Pixel3D
            </Link>
            <nav className="hidden items-center gap-4 text-sm font-medium sm:flex">
              <Link
                href="/admin/products"
                className="text-slate-600 hover:text-purple-700"
              >
                Productos
              </Link>
              <Link
                href="/admin/categories"
                className="text-slate-600 hover:text-purple-700"
              >
                Categorías
              </Link>
              <Link
                href="/admin/products/import"
                className="text-slate-600 hover:text-purple-700"
              >
                Importar CSV
              </Link>
              <Link href="/" className="text-slate-600 hover:text-purple-700">
                Ver tienda
              </Link>
            </nav>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Salir
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  )
}

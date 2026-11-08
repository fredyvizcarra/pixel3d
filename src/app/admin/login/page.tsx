import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getAdminCookieName, verifyAdminSession } from "@/lib/admin-auth"
import { loginAdmin } from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>
}) {
  const { error, from } = await searchParams
  const token = (await cookies()).get(getAdminCookieName())?.value
  const session = await verifyAdminSession(token)
  if (session) {
    redirect("/admin/products")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-purple-600">
          Pixel3D
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Panel de administración
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Ingresa con el correo autorizado y la contraseña de admin.
        </p>

        {error && (
          <p
            className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <form action={loginAdmin} className="mt-6 space-y-4">
          <input type="hidden" name="from" value={from ?? "/admin/products"} />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">Correo</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              aria-label="Correo de administrador"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Contraseña
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              aria-label="Contraseña de administrador"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </label>
          <Button
            type="submit"
            className="w-full rounded-full bg-[#662d91] py-6 text-base hover:bg-purple-700"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}

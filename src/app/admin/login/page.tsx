import Image from "next/image"
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
    <div className="bg-blueprint flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[20px] border border-line bg-panel p-6 shadow-2xl sm:p-8">
        <div className="flex items-center gap-2.5">
          <Image src="/logo/p.png" width={28} height={28} alt="" className="size-7" />
          <span className="font-mono text-xs tracking-[0.14em] text-fog uppercase">
            Pixel3D · Admin
          </span>
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-[-0.02em]">
          Panel de administración
        </h1>
        <p className="mt-2 text-sm text-fog">
          Ingresa con el correo autorizado y la contraseña de admin.
        </p>

        {error && (
          <p
            className="mt-5 rounded-[12px] border border-[#ff6b8a]/40 bg-[#ff6b8a]/10 px-4 py-3 text-sm text-[#ffb3c2]"
            role="alert"
          >
            {error}
          </p>
        )}

        <form action={loginAdmin} className="mt-6 grid gap-4">
          <input type="hidden" name="from" value={from ?? "/admin/products"} />
          <label className="admin-label" htmlFor="admin-email">
            Correo
            <input
              id="admin-email"
              type="email"
              name="email"
              required
              autoComplete="username"
              className="admin-input"
            />
          </label>
          <label className="admin-label" htmlFor="admin-password">
            Contraseña
            <input
              id="admin-password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="admin-input"
            />
          </label>
          <Button type="submit" size="lg" className="mt-2 w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}

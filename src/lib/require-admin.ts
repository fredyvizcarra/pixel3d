import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAdminCookieName, verifyAdminSession } from "@/lib/admin-auth"

/**
 * Verifica la sesión de admin dentro de una server action.
 *
 * El middleware solo protege las páginas /admin/*; las server actions
 * pueden invocarse desde cualquier ruta, así que cada acción del panel
 * debe llamar a esto antes de tocar la base de datos.
 */
export const requireAdmin = async (): Promise<{ email: string }> => {
  const token = (await cookies()).get(getAdminCookieName())?.value
  const session = await verifyAdminSession(token)

  if (!session) {
    redirect("/admin/login")
  }

  return session
}

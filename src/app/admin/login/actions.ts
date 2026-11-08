"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  createAdminSession,
  getAdminCookieMaxAge,
  getAdminCookieName,
  validateAdminLogin,
} from "@/lib/admin-auth"

export const loginAdmin = async (formData: FormData): Promise<void> => {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const from = String(formData.get("from") ?? "/admin/products")

  const error = validateAdminLogin(email, password)
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error)}`)
  }

  const token = await createAdminSession(email)
  const cookieStore = await cookies()
  cookieStore.set(getAdminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAdminCookieMaxAge(),
  })

  const nextPath =
    from.startsWith("/admin") && !from.startsWith("/admin/login")
      ? from
      : "/admin/products"
  redirect(nextPath)
}

export const logoutAdmin = async (): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete(getAdminCookieName())
  redirect("/admin/login")
}

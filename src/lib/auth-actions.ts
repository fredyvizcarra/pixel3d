"use server"

import { signIn, signOut } from "@/auth"

/** Solo se permiten rutas internas como destino después del login */
const safeRedirect = (value: FormDataEntryValue | null): string => {
  const path = typeof value === "string" ? value : ""
  return path.startsWith("/") && !path.startsWith("//") ? path : "/cuenta"
}

export const signInWithGoogle = async (formData: FormData): Promise<void> => {
  await signIn("google", { redirectTo: safeRedirect(formData.get("callbackUrl")) })
}

export const signOutCustomer = async (): Promise<void> => {
  await signOut({ redirectTo: "/" })
}

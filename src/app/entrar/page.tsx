import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth, isGoogleConfigured } from "@/auth"
import { GoogleSignInButton } from "@/components/google-sign-in-button"

export const metadata: Metadata = {
  title: "Entrar · Pixel3D",
}

const BENEFITS = [
  "Ve el estado de tu pedido y tu guía de rastreo",
  "Consulta tu historial de compras",
  "Compra más rápido la próxima vez",
]

const ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    "Ese correo ya está registrado con otro método de acceso.",
  AccessDenied: "Cancelaste el acceso o Google no lo permitió. Intenta de nuevo.",
  Configuration:
    "El inicio de sesión no está configurado todavía. Escríbenos por WhatsApp si necesitas ayuda.",
}

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}

const safePath = (value?: string) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/cuenta"

export default async function SignInPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams
  const destination = safePath(callbackUrl)
  const session = await auth()

  if (session?.user) {
    redirect(destination)
  }

  const googleReady = isGoogleConfigured()
  const errorMessage = error
    ? (ERRORS[error] ?? "No pudimos iniciar sesión. Intenta de nuevo.")
    : null

  return (
    <section className="bg-blueprint">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <p className="eyebrow">Tu cuenta Pixel3D</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1] font-black tracking-[-0.03em] text-balance uppercase">
            Sigue tu pedido <span className="text-hover-blurple">capa por capa.</span>
          </h1>
          <ul className="mt-6 space-y-3 text-fog">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-[2px] bg-blurple" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[20px] border border-line bg-panel p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">Entrar o crear cuenta</h2>
          <p className="mt-2 text-sm text-fog">
            Usa tu cuenta de Google. Si es tu primera vez, la cuenta se crea sola.
          </p>

          {errorMessage && (
            <p role="alert" className="mt-5 rounded-[12px] border border-[#ff6b8a]/40 bg-[#ff6b8a]/10 px-4 py-3 text-sm text-[#ffb3c2]">
              {errorMessage}
            </p>
          )}

          <div className="mt-6">
            <GoogleSignInButton callbackUrl={destination} disabled={!googleReady} />
            {!googleReady && (
              <p className="mt-3 text-xs text-fog">
                Falta configurar AUTH_GOOGLE_ID y AUTH_GOOGLE_SECRET en el servidor.
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-line pt-5 text-sm text-fog">
            ¿Prefieres no crear cuenta?{" "}
            <Link href="/#catalogo" className="font-medium text-snow underline-offset-4 hover:underline">
              Puedes comprar como invitado
            </Link>
            .
          </div>
        </div>
      </div>
    </section>
  )
}

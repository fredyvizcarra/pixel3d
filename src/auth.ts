import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { getDb } from "@/db"
import { accounts, sessions, users, verificationTokens } from "@/db/schema"

/**
 * Cuentas de clientes (no del admin; el admin tiene su propio login).
 *
 * Variables de entorno:
 *   AUTH_SECRET          (ya existe)
 *   AUTH_GOOGLE_ID       Google Cloud → Credenciales → ID de cliente OAuth
 *   AUTH_GOOGLE_SECRET
 *
 * Configuración "lazy" para no abrir la conexión a la base de datos en el build.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  // JWT: la sesión vive en una cookie firmada y no consulta la base de datos en cada visita
  session: { strategy: "jwt" },
  pages: {
    signIn: "/entrar",
    error: "/entrar",
  },
  callbacks: {
    session: ({ session, token }) => {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
}))

export const isGoogleConfigured = (): boolean =>
  Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)

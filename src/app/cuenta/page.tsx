import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { signOutCustomer } from "@/lib/auth-actions"

export const metadata: Metadata = {
  title: "Mi cuenta · Pixel3D",
}

const memberSince = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
})

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/entrar?callbackUrl=/cuenta")
  }

  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  const name = user?.name ?? session.user.name ?? "Cliente Pixel3D"
  const email = user?.email ?? session.user.email
  const image = user?.image ?? session.user.image
  const initial = name.trim().charAt(0).toUpperCase()

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 md:py-16">
      <p className="eyebrow">Mi cuenta</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {image ? (
            <Image
              src={image}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-full border border-line"
            />
          ) : (
            <span className="grid size-16 place-items-center rounded-full bg-blurple font-display text-2xl font-bold">
              {initial}
            </span>
          )}
          <div>
            <h1 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight font-bold tracking-[-0.02em]">
              Hola, {name.split(" ")[0]}
            </h1>
            <p className="text-fog">{email}</p>
            {user?.createdAt && (
              <p className="mt-0.5 font-mono text-xs text-greyple">
                Cliente desde {memberSince.format(user.createdAt)}
              </p>
            )}
          </div>
        </div>
        <form action={signOutCustomer}>
          <Button type="submit" variant="outline" size="sm">
            Cerrar sesión
          </Button>
        </form>
      </div>

      <section aria-labelledby="pedidos-title" className="mt-12">
        <h2
          id="pedidos-title"
          className="font-display text-xl font-bold tracking-[-0.01em] uppercase"
        >
          Mis pedidos
        </h2>
        <div className="mt-5 rounded-[20px] border border-dashed border-line bg-panel/50 px-6 py-14 text-center">
          <p className="text-lg">Todavía no tienes pedidos.</p>
          <p className="mx-auto mt-2 max-w-[48ch] text-fog">
            Cuando compres, aquí verás el estado de cada pedido y su guía de
            rastreo.
          </p>
          <Button asChild className="mt-6">
            <Link href="/#colecciones">Explorar colecciones</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="bg-blueprint flex min-h-[70vh] items-center">
      <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6">
        <p className="eyebrow">Error 404 · capa no encontrada</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[0.98] font-black tracking-[-0.03em] text-balance uppercase">
          Esta pieza no <span className="text-hover-blurple">existe.</span>
        </h1>
        <p className="mt-5 max-w-[46ch] text-lg text-fog">
          El enlace puede estar mal escrito o el producto ya no está disponible.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </section>
  )
}

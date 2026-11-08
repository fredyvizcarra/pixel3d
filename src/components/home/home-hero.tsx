"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { VoxelPrinter, type HudState } from "./voxel-printer"

const SPECS = [
  { value: "0.12 mm", label: "altura de capa" },
  { value: "PLA / PETG", label: "materiales" },
  { value: "3–5 días", label: "producción" },
]

export const HomeHero = () => {
  const [hud, setHud] = useState<HudState>({
    label: "Pieza lista",
    layer: 7,
    progress: 1,
  })

  return (
    <section className="bg-blueprint border-b border-line">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:py-20">
        <div>
          <p className="eyebrow">Impresión 3D hecha en México</p>
          <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.98] font-black tracking-[-0.03em] text-balance uppercase">
            Lo imaginas.
            <br />
            Lo imprimimos <span className="text-blurple">capa por capa.</span>
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-fog">
            Piezas para tu equipo, tu árbol de Navidad y tu rincón mágico.
            Diseños propios o personalizados con tu nombre y tus colores.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#colecciones">Explorar colecciones →</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#personalizados">Pedir un diseño personalizado</Link>
            </Button>
          </div>
          <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs tracking-[0.04em] text-fog">
            {SPECS.map((spec) => (
              <div key={spec.label} className="flex gap-1.5">
                <dt className="sr-only">{spec.label}</dt>
                <dd className="font-semibold text-snow">{spec.value}</dd>
                <span aria-hidden="true">{spec.label}</span>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative h-[300px] md:h-[380px]" aria-hidden="true">
          <VoxelPrinter onHud={setHud} />
          <div className="absolute top-2 right-0 min-w-[172px] rounded-[10px] border border-line bg-panel/85 px-3 py-2.5 font-mono text-xs text-fog backdrop-blur">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-snow">
              <span className="size-[7px] rounded-full bg-blurple shadow-[0_0_8px_var(--color-blurple)]" />
              {hud.label}
            </p>
            <p>capa {hud.layer} / 7 · 0.12 mm</p>
            <div className="mt-2 h-[3px] overflow-hidden rounded-sm bg-line">
              <div
                className="h-full bg-blurple"
                style={{ width: `${Math.round(hud.progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { getThemeProps, resolveTheme } from "@/lib/collection-themes"
import type { CollectionSummary } from "@/lib/products"
import { cn } from "@/lib/utils"
import { WorldArt } from "./world-art"
import { WorldTitle } from "./world-title"

interface Props {
  collections: CollectionSummary[]
}

const pieces = (n: number) =>
  n === 0 ? "Próximamente" : `${n} ${n === 1 ? "pieza" : "piezas"}`

export const CollectionGrid = ({ collections }: Props) => {
  const featured = collections.filter((collection) => collection.featured)
  const others = collections.filter(
    (collection) => !featured.includes(collection) && collection.productCount > 0
  )

  if (featured.length === 0 && others.length === 0) return null

  return (
    <div className="space-y-6">
      {featured.length > 0 && (
        <div className="grid grid-cols-6 gap-4">
          {featured.map((collection, index) => {
            const theme = resolveTheme(collection.theme)
            const themeProps = getThemeProps(collection)
            const isWide =
              index === 0 ||
              (index === featured.length - 1 && (featured.length - 1) % 2 === 1)

            return (
              <Link
                key={collection.id}
                href={`/colecciones/${collection.slug}`}
                className={cn(
                  themeProps.className,
                  "group flex flex-col justify-end gap-2 overflow-hidden rounded-[20px] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7",
                  isWide
                    ? "col-span-6 min-h-[300px]"
                    : "col-span-6 min-h-[260px] md:col-span-3"
                )}
                style={themeProps.style}
              >
                <span className="absolute top-6 left-6 font-mono text-xs tracking-[0.04em] opacity-80 sm:left-7">
                  {pieces(collection.productCount)}
                </span>
                <WorldArt
                  theme={theme}
                  className={cn(
                    "absolute -z-10 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-6",
                    isWide
                      ? "top-4 right-0 w-[42%] max-w-[300px]"
                      : "top-4 -right-2 w-[44%] max-w-[240px]"
                  )}
                />
                <WorldTitle
                  name={collection.name}
                  as="h3"
                  className={
                    isWide
                      ? "text-[clamp(2.5rem,7vw,5.25rem)] leading-[0.9]"
                      : "text-[clamp(2rem,4.2vw,3rem)] leading-none"
                  }
                />
                {collection.tagline && (
                  <p className="max-w-[34ch] text-[var(--w-muted)]">
                    {collection.tagline}
                  </p>
                )}
                <span className="text-sm font-semibold">Ver colección →</span>
              </Link>
            )
          })}
        </div>
      )}

      {others.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm text-fog">Más colecciones:</span>
          {others.map((collection) => (
            <Link
              key={collection.id}
              href={`/colecciones/${collection.slug}`}
              className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium text-snow transition-colors hover:border-blurple"
            >
              {collection.name}
              <span className="ml-2 font-mono text-xs text-fog">
                {collection.productCount}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

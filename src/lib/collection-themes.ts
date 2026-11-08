import type { CSSProperties } from "react"
import type { Category } from "@/db/schema"

export const COLLECTION_THEMES = [
  {
    key: "default",
    label: "Simple (color propio)",
    description: "Fondo oscuro de la marca con el color de acento que elijas.",
  },
  {
    key: "gameday",
    label: "Game Day",
    description: "Campo de fútbol americano, yardas y letras de transmisión deportiva.",
  },
  {
    key: "navidad",
    label: "Navidad",
    description: "Verde profundo, dorado y nieve sutil.",
  },
  {
    key: "magico",
    label: "Mundo Mágico",
    description: "Morado nocturno, dorado y estrellas.",
  },
] as const

export type CollectionThemeKey = (typeof COLLECTION_THEMES)[number]["key"]

const THEME_KEYS = new Set<string>(COLLECTION_THEMES.map((theme) => theme.key))

export const resolveTheme = (value: string | null | undefined): CollectionThemeKey => {
  return value && THEME_KEYS.has(value) ? (value as CollectionThemeKey) : "default"
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export const normalizeAccentColor = (value: string | null | undefined): string | null => {
  const trimmed = (value ?? "").trim()
  return HEX_COLOR.test(trimmed) ? trimmed.toLowerCase() : null
}

/** Clase y estilos inline para envolver una sección con el tema de su colección */
export const getThemeProps = (
  category: Pick<Category, "theme" | "accentColor"> | null | undefined
): { className: string; style?: CSSProperties } => {
  const theme = resolveTheme(category?.theme)
  const accent = normalizeAccentColor(category?.accentColor)

  if (theme === "default" && accent) {
    return {
      className: "world world-default",
      style: { "--w-a": accent } as CSSProperties,
    }
  }

  return { className: `world world-${theme}` }
}

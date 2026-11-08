import {
  Cinzel,
  JetBrains_Mono,
  Onest,
  Saira_Extra_Condensed,
  Unbounded,
  Young_Serif,
} from "next/font/google"

/** Marca */
export const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-unbounded",
  display: "swap",
})

export const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
  display: "swap",
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
})

/** Fuentes de las colecciones: no se precargan, solo se usan en sus secciones */
export const sairaCondensed = Saira_Extra_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-saira",
  display: "swap",
  preload: false,
})

export const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-young-serif",
  display: "swap",
  preload: false,
})

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-cinzel",
  display: "swap",
  preload: false,
})

export const fontVariables = [
  unbounded,
  onest,
  jetbrainsMono,
  sairaCondensed,
  youngSerif,
  cinzel,
]
  .map((font) => font.variable)
  .join(" ")

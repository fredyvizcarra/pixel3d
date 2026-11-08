import type { Metadata } from "next"
import { Inter, Nunito } from "next/font/google"
import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-nunito",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Pixel3D — Catálogo de impresión 3D",
  description:
    "Compra piezas de impresión 3D en México. Figuras, accesorios y proyectos a medida.",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${nunito.variable}`}>
      <body className="flex min-h-screen flex-col bg-cosmic font-sans text-snow">
        <Navbar />
        <main className="w-full flex-grow">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

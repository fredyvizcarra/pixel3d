import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { fontVariables } from "@/lib/fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pixel3D · Impresión 3D en México",
  description:
    "Piezas de impresión 3D por colecciones: Game Day, Navidad, Mundo Mágico y más. Diseños propios y personalizados, con envío a todo México.",
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
    <html lang="es" className={fontVariables}>
      <body className="flex min-h-screen flex-col bg-cosmic font-sans text-snow">
        <Navbar />
        <main className="w-full flex-grow">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

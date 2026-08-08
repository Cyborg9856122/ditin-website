import type { Metadata } from "next"
import { Chakra_Petch, Barlow, IBM_Plex_Mono, Cairo } from "next/font/google"
import "./globals.css"

// Brand kit typography — all four are legitimately-licensed Google Fonts,
// so no substitution was needed:
//   Display        Chakra Petch
//   Body           Barlow
//   Measured values IBM Plex Mono (pixel pitch, nits, dimensions, etc.)
//   Arabic / Kurdish Cairo
const chakraPetch = Chakra_Petch({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

const barlow = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Ditin Displays — Display solutions across Iraq",
    template: "%s | Ditin Displays",
  },
  description:
    "Ditin Displays sells and rents LED walls, LCD video walls, commercial screens, interactive displays and outdoor displays. Browse the catalogue and request a quote.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} ${barlow.variable} ${ibmPlexMono.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-white text-ink">
        {children}
      </body>
    </html>
  )
}

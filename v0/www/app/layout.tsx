import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { siteName, siteOgImage, siteOrigin } from "@/lib/site"
import { cn } from "@/lib/utils"

// Every page builds its Open Graph image from a post or publication cover, and
// those are root-relative once the bundler hashes them. Social networks need an
// absolute address, so the production origin has to be declared here. Without
// it, Next falls back to localhost and every link preview points at a machine
// that is not on the internet. The origin itself lives in lib/site.ts, because
// share links need the same value and two copies would drift apart.
//
// The site-wide fallback image lives there too, as siteOgImage, and is only
// spread in when set: a page with no cover and no fallback carries no preview
// image rather than a wrong one. Setting the key to undefined would not do:
// it replaces an inherited value instead of deferring to it.
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  // Every page title ends with the site name; a page that is the site itself
  // sets an absolute title instead. Search results then show which site a
  // post belongs to without every page spelling it out.
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  ...(siteOgImage ? { openGraph: { images: [siteOgImage] } } : {}),
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

/**
 * The root layout carries only what every page needs: fonts, theme, analytics,
 * the metadata base. The header and footer live one level down in the (main)
 * route group, the first custom point, so a page that needs a different frame
 * can sit outside the group without fighting this one.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth antialiased motion-reduce:scroll-auto",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

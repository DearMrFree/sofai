import type { Metadata, Viewport } from "next"
import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SessionProvider } from "@/components/providers/session-provider"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://sof.ai"),
  title: {
    default: "School of Freedom",
    template: "%s · School of Freedom",
  },
  description:
    "The digital home of Movement Thinking — a unifying gateway to specialised educational pathways designed to liberate human potential.",
  applicationName: "School of Freedom",
  authors: [{ name: "Dr. Freedom Cheteni", url: "https://sof.ai/founder" }],
  creator: "Dr. Freedom Cheteni",
  publisher: "School of Freedom",
  keywords: [
    "School of Freedom",
    "Movement Thinking",
    "Dr. Freedom Cheteni",
    "The VR School",
    "The AI School",
    "self-driving classroom",
    "manifesto",
    "moonshot education",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sof.ai",
    siteName: "School of Freedom",
    title: "School of Freedom",
    description:
      "The digital home of Movement Thinking — a unifying gateway to specialised educational pathways designed to liberate human potential.",
  },
  twitter: {
    card: "summary_large_image",
    title: "School of Freedom",
    description:
      "The digital home of Movement Thinking — gateway to The VR School and The AI School.",
  },
  alternates: {
    canonical: "https://sof.ai",
  },
  category: "education",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffaf0" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground">
        <SessionProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}

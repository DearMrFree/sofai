import type { Metadata, Viewport } from "next"
import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SessionProvider } from "@/components/providers/session-provider"
import { SofaiChat } from "@/components/agent/sofai-chat"

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
    "The business gateway for School of Freedom, The VR School, and School of AI. One profile for individuals, corporations, schools, and partner entities.",
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
    "School of AI",
    "corporate education partnerships",
    "school district partnerships",
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
      "The business gateway for School of Freedom, The VR School, and School of AI. One profile for individuals, corporations, schools, and partner entities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "School of Freedom",
  description:
      "One profile and a clear gateway into The VR School, School of AI, and School of Freedom partnerships.",
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
          <SofaiChat />
        </SessionProvider>
      </body>
    </html>
  )
}

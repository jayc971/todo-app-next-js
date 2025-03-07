import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { LoadingProvider } from "@/contexts/loading-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "To-Do App",
  description: "A modern todo app built with Next.js and MongoDB",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LoadingProvider>
            <Header />
            <div className="flex-1">{children}</div>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
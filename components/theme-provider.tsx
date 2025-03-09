"use client"

import type React from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-background text-foreground">
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-pulse">Loading theme...</div>
        </div>
      </div>
    )
  }

  return (
    <NextThemesProvider
      {...props}
      enableSystem={true}
      enableColorScheme={true}
      storageKey="todo-app-theme"
      defaultTheme="system"
      attribute="class"
    >
      {children}
    </NextThemesProvider>
  )
}


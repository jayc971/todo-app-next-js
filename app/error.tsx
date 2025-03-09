"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-4 flex items-center justify-center min-h-[50vh]">
      <div className="bg-card p-8 rounded-lg shadow-md text-center max-w-md border border-border">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
        <p className="mb-6 text-muted-foreground">
          We encountered an error while loading your tasks. This might be due to a network issue or a problem with our
          servers.
        </p>
        <div className="mb-4 p-4 bg-muted rounded-md text-left overflow-auto max-h-32">
          <code className="text-sm text-red-500">{error.message}</code>
        </div>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}


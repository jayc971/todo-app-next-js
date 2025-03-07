"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-4xl mx-auto p-4 flex items-center justify-center min-h-[50vh]">
      <div className="bg-card p-8 rounded-lg shadow-md text-center max-w-md border border-border">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong!</h2>
        <p className="mb-6 text-muted-foreground">
          We encountered an error while loading your tasks. This might be due to a network issue or a problem with our
          servers.
        </p>
        <div className="mb-4 p-4 bg-muted rounded-md text-left overflow-auto max-h-32">
          <code className="text-sm text-destructive">{error.message}</code>
        </div>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}


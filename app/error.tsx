"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

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
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="mb-6 text-gray-600">
          We encountered an error while loading your tasks. This might be due to a network issue or a problem with our
          servers.
        </p>
        <div className="mb-4 p-4 bg-gray-100 rounded-md text-left overflow-auto max-h-32">
          <code className="text-sm text-red-600">{error.message}</code>
        </div>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}


"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { Loader2 } from "lucide-react"

interface LoadingContextType {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)

  // Use useCallback to ensure these functions don't change on re-renders
  const startLoading = useCallback(() => {
    console.log("Starting loading...")
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    console.log("Stopping loading...")
    setIsLoading(false)
  }, [])

  // Add beforeunload event listener to warn users about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        // Standard way to show a confirmation dialog before leaving
        e.preventDefault()
        e.returnValue = "Changes you made may not be saved. Are you sure you want to leave?"
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isLoading])

  // Log loading state changes for debugging
  useEffect(() => {
    console.log("Loading state changed:", isLoading)
  }, [isLoading])

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center border border-border">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-foreground">Saving changes...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}


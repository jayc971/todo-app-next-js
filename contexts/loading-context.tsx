"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { Loader2 } from "lucide-react"

interface LoadingContextType {
  isLoading: boolean
  isCrossColumnLoading: boolean
  startLoading: () => void
  stopLoading: () => void
  startCrossColumnLoading: () => void
  stopCrossColumnLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCrossColumnLoading, setIsCrossColumnLoading] = useState(false)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])
  const startCrossColumnLoading = useCallback(() => setIsCrossColumnLoading(true), [])
  const stopCrossColumnLoading = useCallback(() => setIsCrossColumnLoading(false), [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading || isCrossColumnLoading) {
        e.preventDefault()
        e.returnValue = "Changes you made may not be saved. Are you sure you want to leave?"
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isLoading, isCrossColumnLoading])

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        isCrossColumnLoading,
        startLoading,
        stopLoading,
        startCrossColumnLoading,
        stopCrossColumnLoading,
      }}
    >
      {children}
      {(isLoading || isCrossColumnLoading) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center border border-border">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
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


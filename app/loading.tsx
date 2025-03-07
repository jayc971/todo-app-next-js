import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-center mb-8">
        <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <div className="flex gap-2 mb-6">
          <div className="h-10 flex-1 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="mt-6">
          <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center border border-border">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-foreground">Loading your tasks...</p>
        </div>
      </div>
    </div>
  )
}


"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Tooltip } from "./tooltip"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-full bg-secondary text-secondary-foreground border border-secondary">
        <div className="h-[1.2rem] w-[1.2rem]"></div>
      </button>
    )
  }

  const tooltipContent = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-full bg-secondary text-secondary-foreground transition-colors border border-secondary hover:border-primary relative"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="h-[1.2rem] w-[1.2rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>
    </Tooltip>
  )
}


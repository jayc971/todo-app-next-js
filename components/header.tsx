"use client"

import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { ListTodo, KanbanSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { useTheme } from "next-themes"

export default function Header() {
  const pathname = usePathname()
  const isKanbanView = pathname === "/kanban"
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        <div className="font-bold text-xl text-primary">{isKanbanView ? "Task Board" : "Task List"}</div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={isKanbanView ? "/" : "/kanban"}>
                  <Button variant="outline" size="icon" className="rounded-full">
                    {isKanbanView ? (
                      <ListTodo className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                      <KanbanSquare className="h-[1.2rem] w-[1.2rem]" />
                    )}
                    <span className="sr-only">{isKanbanView ? "List View" : "Kanban View"}</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isKanbanView ? "Switch to List View" : "Switch to Kanban View"}</p>
              </TooltipContent>
            </Tooltip>
            <ThemeToggle />
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}


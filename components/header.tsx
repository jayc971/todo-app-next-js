"use client"

import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { ListTodo, KanbanSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

export default function Header() {
  const pathname = usePathname()
  const isKanbanView = pathname === "/kanban"
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <div className="font-bold text-xl text-primary">{isKanbanView ? "Task Board" : "Task List"}</div>
        <div className="flex items-center gap-2">
          <Link href={isKanbanView ? "/list" : "/kanban"}>
            <button className="p-2 rounded-full bg-secondary hover:bg-blue-500 hover:text-white text-secondary-foreground transition-colors">
              {isKanbanView ? (
                <ListTodo className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <KanbanSquare className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">{isKanbanView ? "List View" : "Kanban View"}</span>
            </button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}


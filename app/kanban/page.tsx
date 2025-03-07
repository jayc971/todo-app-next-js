import KanbanBoard from "@/components/kanban-board"
import { getTasks } from "@/lib/tasks"

export default async function KanbanPage() {
  const tasks = await getTasks()

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="mb-8 dark:hidden">
        <h1 className="text-3xl font-bold text-primary">Task Board</h1>
      </div>

      <KanbanBoard tasks={tasks} />
    </main>
  )
}


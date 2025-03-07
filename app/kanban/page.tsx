import KanbanBoard from "@/components/kanban-board"
import { getTasks } from "@/lib/tasks"
import Link from "next/link"

export default async function KanbanPage() {
  const tasks = await getTasks()

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Board</h1>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Back to List View
        </Link>
      </div>

      <KanbanBoard tasks={tasks} />
    </main>
  )
}


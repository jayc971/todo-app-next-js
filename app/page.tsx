import TaskList from "@/components/task-list"
import AddTaskForm from "@/components/add-task-form"
import { getTasks } from "@/lib/tasks"
import Link from "next/link"

export default async function Home() {
  const tasks = await getTasks()

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Next.js Todo App</h1>
        <Link
          href="/kanban"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Kanban Board
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AddTaskForm tasks={tasks} />
        <TaskList initialTasks={tasks} />
      </div>
    </main>
  )
}


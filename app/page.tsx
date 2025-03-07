import TaskList from "@/components/task-list"
import AddTaskForm from "@/components/add-task-form"
import { getTasks } from "@/lib/tasks"

export default async function Home() {
  const tasks = await getTasks()

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="mb-8 dark:hidden">
        <h1 className="text-3xl font-bold text-primary">Next.js Todo App</h1>
      </div>

      <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border border-border">
        <AddTaskForm tasks={tasks} />
        <TaskList initialTasks={tasks} />
      </div>
    </main>
  )
}


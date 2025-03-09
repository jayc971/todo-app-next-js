import TaskList from "@/components/task-list"
import AddTaskForm from "@/components/add-task-form"
import { getTasks } from "@/lib/tasks"

export default async function ListPage() {
  const tasks = await getTasks()

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border border-border">
        <AddTaskForm tasks={tasks} />
        <TaskList initialTasks={tasks} />
      </div>
    </main>
  )
}


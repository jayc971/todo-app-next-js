"use client"

import type { Task } from "@/lib/types"
import TaskItem from "./task-item"

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
      {initialTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
      ) : (
        <ul className="space-y-3">
          {initialTasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </ul>
      )}
    </div>
  )
}


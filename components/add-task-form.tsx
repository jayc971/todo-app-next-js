"use client"

import type React from "react"

import { useState } from "react"
import { addTask } from "@/lib/actions"
import { useRouter } from "next/navigation"
import type { Task } from "@/lib/types"
import { useOptimistic } from "react"

interface AddTaskFormProps {
  tasks: Task[]
}

export default function AddTaskForm({ tasks }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const router = useRouter()

  // Optimistic UI state for adding tasks
  const [optimisticTasks, addOptimisticTask] = useOptimistic(tasks, (state, newTask: Task) => [...state, newTask])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    // Create a temporary optimistic task
    const optimisticTask: Task = {
      _id: `optimistic-${Date.now()}`,
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    }

    // Optimistically update UI
    addOptimisticTask(optimisticTask)

    // Clear the input
    setTitle("")

    // Then perform the actual add
    await addTask(title.trim())
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        Add Task
      </button>
    </form>
  )
}


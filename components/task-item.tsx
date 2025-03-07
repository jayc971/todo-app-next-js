"use client"

import type { Task } from "@/lib/types"
import { deleteTask, updateTask } from "@/lib/actions"
import { Trash, Edit, Check } from "lucide-react"
import { useOptimistic, useState } from "react"

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)

  // Optimistic UI state for deletion
  const [optimisticTask, updateOptimisticTask] = useOptimistic(task, (state, { type, newTitle }) => {
    if (type === "delete") {
      return { ...state, _id: "deleted" }
    }
    if (type === "update") {
      return { ...state, title: newTitle }
    }
    return state
  })

  const handleDelete = async () => {
    // Optimistically update UI
    updateOptimisticTask({ type: "delete" })
    // Then perform the actual delete
    await deleteTask(task._id)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      // Optimistically update UI
      updateOptimisticTask({ type: "update", newTitle: editedTitle })
      setIsEditing(false)
      // Then perform the actual update
      await updateTask(task._id, editedTitle)
    } else if (editedTitle.trim() === "") {
      setEditedTitle(task.title)
      setIsEditing(false)
    } else {
      setIsEditing(false)
    }
  }

  // If the task has been optimistically deleted, don't render it
  if (optimisticTask._id === "deleted") {
    return null
  }

  return (
    <li className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200 group hover:shadow-md transition-shadow">
      {isEditing ? (
        <input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") {
              setEditedTitle(task.title)
              setIsEditing(false)
            }
          }}
        />
      ) : (
        <span className="text-gray-800">{optimisticTask.title}</span>
      )}
      <div className="flex space-x-2">
        {isEditing ? (
          <button
            className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-green-500 hover:bg-green-50"
            onClick={handleSave}
            aria-label="Save task"
          >
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <button
            className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:bg-blue-50"
            onClick={handleEdit}
            aria-label="Edit task"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
        <button
          className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50"
          onClick={handleDelete}
          disabled={isEditing}
          aria-label="Delete task"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </li>
  )
}


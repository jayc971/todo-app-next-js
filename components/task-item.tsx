"use client"

import type { Task } from "@/lib/types"
import { deleteTask, updateTask, toggleTaskCompletion, getTaskById } from "@/lib/actions"
import { Trash, Edit, Check, Square, CheckSquare } from "lucide-react"
import { useOptimistic, useState } from "react"
import { useLoading } from "@/contexts/loading-context"
import { useRouter } from "next/navigation"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import DeleteTaskDialog from "./delete-task-dialog"

interface TaskItemProps {
  task: Task
  index: number
}

export default function TaskItem({ task, index }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { startLoading, stopLoading, isLoading } = useLoading()
  const router = useRouter()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    disabled: isEditing || isLoading,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [optimisticTask, updateOptimisticTask] = useOptimistic(task, (state, { type, newTitle, completed }) => {
    if (type === "delete") return { ...state, _id: "deleted" }
    if (type === "update") return { ...state, title: newTitle }
    if (type === "toggle") return { ...state, completed }
    return state
  })

  const verifyTaskState = async (taskId: string, expectedTitle?: string, expectedCompleted?: boolean) => {
    try {
      const backendTask = await getTaskById(taskId)
      if (!backendTask) return false

      let isMatch = true
      if (expectedTitle !== undefined) isMatch = isMatch && backendTask.title === expectedTitle
      if (expectedCompleted !== undefined) isMatch = isMatch && backendTask.completed === expectedCompleted

      return isMatch
    } catch (error) {
      return false
    }
  }

  const handleDelete = async () => {
    setIsDeleteDialogOpen(false)
    updateOptimisticTask({ type: "delete" })
    startLoading()

    try {
      await deleteTask(task._id)
    } catch (error) {
      router.refresh()
    } finally {
      stopLoading()
    }
  }

  const handleEdit = () => {
    if (isLoading) return
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateOptimisticTask({ type: "update", newTitle: editedTitle })
      setIsEditing(false)
      startLoading()

      try {
        await updateTask(task._id, editedTitle)
        const isVerified = await verifyTaskState(task._id, editedTitle)
        if (!isVerified) router.refresh()
      } catch (error) {
        router.refresh()
      } finally {
        stopLoading()
      }
    } else if (editedTitle.trim() === "") {
      setEditedTitle(task.title)
      setIsEditing(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleToggleCompletion = async () => {
    const newCompletedState = !optimisticTask.completed
    updateOptimisticTask({ type: "toggle", completed: newCompletedState })
    startLoading()

    try {
      await toggleTaskCompletion(task._id, newCompletedState)
      const isVerified = await verifyTaskState(task._id, undefined, newCompletedState)
      if (!isVerified) router.refresh()
    } catch (error) {
      router.refresh()
    } finally {
      stopLoading()
    }
  }

  if (optimisticTask._id === "deleted") return null

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 rounded-md border border-border dark:border-gray-700 transition-all bg-white dark:bg-gray-800 ${
        isDragging ? "opacity-50" : ""
      } hover:shadow-md`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={handleToggleCompletion}
          className={`flex-shrink-0 transition-colors ${
            optimisticTask.completed
              ? "text-muted-foreground hover:text-green-500"
              : "text-primary hover:text-green-500"
          }`}
          aria-label={optimisticTask.completed ? "Mark as incomplete" : "Mark as complete"}
          disabled={isLoading}
        >
          {optimisticTask.completed ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
        </button>

        {isEditing ? (
          <div className="flex flex-1 min-w-0">
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="min-w-0 flex-1 p-2 border border-r-0 border-input rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") {
                  setEditedTitle(task.title)
                  setIsEditing(false)
                }
              }}
            />
            <button
              onClick={handleSave}
              aria-label="Save task"
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-l-0 border-input rounded-r-md transition-colors hover:bg-green-500 hover:border-green-500 hover:text-white"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className={`truncate ${optimisticTask.completed ? "line-through text-muted-foreground" : ""}`}>
            {optimisticTask.title}
          </span>
        )}
      </div>

      {!isEditing && (
        <div className="flex border border-border dark:border-gray-700 rounded-md overflow-hidden flex-shrink-0">
          <button
            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors hover:bg-blue-500 hover:border-blue-500 hover:text-white"
            onClick={handleEdit}
            aria-label="Edit task"
            disabled={isLoading}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors hover:bg-red-500 hover:border-red-500 hover:text-white"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isEditing || isLoading}
            aria-label="Delete task"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      )}

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        taskTitle={task.title}
      />
    </li>
  )
}


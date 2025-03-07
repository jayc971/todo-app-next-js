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

  // Setup sortable for drag and drop in list view
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    disabled: isEditing || isLoading,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Optimistic UI state for deletion and updates
  const [optimisticTask, updateOptimisticTask] = useOptimistic(task, (state, { type, newTitle, completed }) => {
    if (type === "delete") {
      return { ...state, _id: "deleted" }
    }
    if (type === "update") {
      return { ...state, title: newTitle }
    }
    if (type === "toggle") {
      return { ...state, completed }
    }
    return state
  })

  // Function to verify if frontend state matches backend state
  const verifyTaskState = async (taskId: string, expectedTitle?: string, expectedCompleted?: boolean) => {
    try {
      // Fetch the task from the backend
      const backendTask = await getTaskById(taskId)

      if (!backendTask) {
        console.error("Task not found in backend")
        return false
      }

      // Check if the title and completed state match
      let isMatch = true

      if (expectedTitle !== undefined) {
        isMatch = isMatch && backendTask.title === expectedTitle
      }

      if (expectedCompleted !== undefined) {
        isMatch = isMatch && backendTask.completed === expectedCompleted
      }

      return isMatch
    } catch (error) {
      console.error("Error verifying task state:", error)
      return false
    }
  }

  const handleDelete = async () => {
    // Close the dialog
    setIsDeleteDialogOpen(false)

    // Optimistically update UI
    updateOptimisticTask({ type: "delete" })

    // Show loading state
    startLoading()

    try {
      // Then perform the actual delete
      await deleteTask(task._id)
    } catch (error) {
      console.error("Error deleting task:", error)
      // If there's an error, refresh to get the latest state
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
      // Optimistically update UI
      updateOptimisticTask({ type: "update", newTitle: editedTitle })
      setIsEditing(false)

      // Show loading state
      startLoading()

      try {
        // Then perform the actual update
        await updateTask(task._id, editedTitle)

        // Verify that the frontend state matches the backend state
        const isVerified = await verifyTaskState(task._id, editedTitle)

        if (!isVerified) {
          console.log("Frontend and backend states don't match, refreshing...")
          // If they don't match, refresh the page to get the latest data
          router.refresh()
        }
      } catch (error) {
        console.error("Error updating task:", error)
        // If there's an error, refresh to get the latest state
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

    // Optimistically update UI
    updateOptimisticTask({ type: "toggle", completed: newCompletedState })

    // Show loading state
    startLoading()

    try {
      // Then perform the actual update
      await toggleTaskCompletion(task._id, newCompletedState)

      // Verify that the frontend state matches the backend state
      const isVerified = await verifyTaskState(task._id, undefined, newCompletedState)

      if (!isVerified) {
        console.log("Frontend and backend states don't match, refreshing...")
        // If they don't match, refresh the page to get the latest data
        router.refresh()
      }
    } catch (error) {
      console.error("Error toggling task completion:", error)
      // If there's an error, refresh to get the latest state
      router.refresh()
    } finally {
      stopLoading()
    }
  }

  // If the task has been optimistically deleted, don't render it
  if (optimisticTask._id === "deleted") {
    return null
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-card rounded-md border border-border hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={handleToggleCompletion}
          className={`text-primary hover:text-primary/80 transition-colors`}
          aria-label={optimisticTask.completed ? "Mark as incomplete" : "Mark as complete"}
          disabled={isLoading}
        >
          {optimisticTask.completed ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
        </button>

        {isEditing ? (
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 mr-2 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
          <span className={`text-foreground ${optimisticTask.completed ? "line-through text-muted-foreground" : ""}`}>
            {optimisticTask.title}
          </span>
        )}
      </div>

      <div className="flex">
        {isEditing ? (
          <button
            className="p-2 rounded-md text-white bg-green-500 hover:bg-green-600"
            onClick={handleSave}
            aria-label="Save task"
          >
            <Check className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              className="p-2 text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleEdit}
              aria-label="Edit task"
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </button>
            <div className="w-px bg-border"></div>
            <button
              className="p-2 text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isEditing || isLoading}
              aria-label="Delete task"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        taskTitle={task.title}
      />
    </li>
  )
}


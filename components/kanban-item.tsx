"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "@/lib/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CheckSquare, Clock, Square, Edit, Check, Trash, GripVertical } from "lucide-react"
import { updateTask, deleteTask, getTaskById } from "@/lib/actions"
import { useLoading } from "@/contexts/loading-context"
import { useRouter } from "next/navigation"
import DeleteTaskDialog from "./delete-task-dialog"

interface KanbanItemProps {
  task: Task
}

export default function KanbanItem({ task }: KanbanItemProps) {
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

  // Function to verify if frontend state matches backend state
  const verifyTaskState = async (taskId: string, expectedTitle: string) => {
    try {
      // Fetch the task from the backend
      const backendTask = await getTaskById(taskId)

      if (!backendTask) {
        console.error("Task not found in backend")
        return false
      }

      // Check if the title matches
      return backendTask.title === expectedTitle
    } catch (error) {
      console.error("Error verifying task state:", error)
      return false
    }
  }

  // Get status icon
  const getStatusIcon = () => {
    if (task.completed) {
      return <CheckSquare className="h-4 w-4 text-green-500" />
    }
    if (task.status === "inprogress") {
      return <Clock className="h-4 w-4 text-amber-500" />
    }
    return <Square className="h-4 w-4 text-blue-500" />
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoading) return
    setIsEditing(true)
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (editedTitle.trim() && editedTitle !== task.title) {
      setIsEditing(false)

      // Show loading state
      startLoading()

      try {
        // Perform the update
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

  const handleDelete = async () => {
    // Close the dialog
    setIsDeleteDialogOpen(false)

    // Show loading state
    startLoading()

    try {
      // Perform the delete
      await deleteTask(task._id)
    } catch (error) {
      console.error("Error deleting task:", error)
      // If there's an error, refresh to get the latest state
      router.refresh()
    } finally {
      stopLoading()
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card p-3 rounded-md shadow-sm border border-border hover:shadow-md transition-all ${isDragging ? "opacity-50" : ""}`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave(e as any)
              if (e.key === "Escape") {
                setEditedTitle(task.title)
                setIsEditing(false)
              }
              e.stopPropagation()
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="p-1 rounded-md text-white bg-green-500 hover:bg-green-600"
              aria-label="Save task"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div
              {...(isEditing || isLoading ? {} : { ...attributes, ...listeners })}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing p-1"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            {getStatusIcon()}
            <p className={`text-foreground ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </p>
          </div>

          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={handleEdit}
              className="p-1 text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Edit task"
              disabled={isLoading}
            >
              <Edit className="h-3 w-3" />
            </button>
            <div className="w-px bg-border"></div>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-1 text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Delete task"
              disabled={isLoading}
            >
              <Trash className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        taskTitle={task.title}
      />
    </div>
  )
}


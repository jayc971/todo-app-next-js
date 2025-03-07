"use client"

import { useState, useEffect, useRef } from "react"
import type { Task, Column } from "@/lib/types"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import KanbanColumn from "./kanban-column"
import KanbanItem from "./kanban-item"
import { updateTaskStatus, toggleTaskCompletion, getTaskById, updateTaskOrder } from "@/lib/actions"
import { useLoading } from "@/contexts/loading-context"
import { useRouter } from "next/navigation"

interface KanbanBoardProps {
  tasks: Task[]
}

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "inprogress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ])

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const { startLoading, stopLoading, isLoading } = useLoading()
  const router = useRouter()

  // Keep track of the task being dragged and its target column
  const dragInfoRef = useRef<{
    taskId: string | null
    sourceColumn: string | null
    targetColumn: string | null
    overTaskId: string | null
  }>({
    taskId: null,
    sourceColumn: null,
    targetColumn: null,
    overTaskId: null,
  })

  // Update columns when tasks change
  useEffect(() => {
    if (!isLoading) {
      setColumns([
        { id: "todo", title: "To Do", tasks: tasks.filter((task) => !task.status || task.status === "todo") },
        { id: "inprogress", title: "In Progress", tasks: tasks.filter((task) => task.status === "inprogress") },
        { id: "done", title: "Done", tasks: tasks.filter((task) => task.status === "done") },
      ])
    }
  }, [tasks, isLoading])

  // Use a more sensitive pointer sensor to ensure drag events are captured
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string

    // Find the task and its source column
    for (const column of columns) {
      const task = column.tasks.find((t) => t._id === taskId)
      if (task) {
        setActiveTask(task)
        // Store the task ID and source column
        dragInfoRef.current.taskId = taskId
        dragInfoRef.current.sourceColumn = column.id
        break
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Store the target information
    if (columns.some((col) => col.id === overId)) {
      // Dragging over a column
      dragInfoRef.current.targetColumn = overId
      dragInfoRef.current.overTaskId = null
    } else {
      // Dragging over a task
      // Find which column the task belongs to
      for (const column of columns) {
        if (column.tasks.some((task) => task._id === overId)) {
          dragInfoRef.current.targetColumn = column.id
          dragInfoRef.current.overTaskId = overId
          break
        }
      }
    }

    // Find the source and target columns
    const activeColumnIndex = columns.findIndex((col) => col.tasks.some((task) => task._id === activeId))

    if (activeColumnIndex === -1) return

    // If dropping over a column
    if (columns.some((col) => col.id === overId)) {
      const activeColumn = columns[activeColumnIndex]
      const overColumnIndex = columns.findIndex((col) => col.id === overId)

      // Skip if trying to move to the same column
      if (activeColumn.id === overId) return

      // Create new columns array
      const newColumns = [...columns]

      // Find the task
      const taskIndex = activeColumn.tasks.findIndex((task) => task._id === activeId)
      if (taskIndex === -1) return

      // Remove the task from the active column
      const [task] = newColumns[activeColumnIndex].tasks.splice(taskIndex, 1)

      // Update the task status
      task.status = overId

      // Update completed status based on column
      if (overId === "done") {
        task.completed = true
      } else if (task.completed) {
        task.completed = false
      }

      // Add the task to the over column
      newColumns[overColumnIndex].tasks.push(task)

      setColumns(newColumns)
    } else {
      // Dropping over another task - only allow moving to a different column
      const overColumnIndex = columns.findIndex((col) => col.tasks.some((task) => task._id === overId))

      if (overColumnIndex === -1) return

      const activeColumn = columns[activeColumnIndex]
      const overColumn = columns[overColumnIndex]

      // Skip if trying to reorder within the same column
      if (activeColumnIndex === overColumnIndex) return

      // Find the task indices
      const activeTaskIndex = activeColumn.tasks.findIndex((task) => task._id === activeId)
      const overTaskIndex = overColumn.tasks.findIndex((task) => task._id === overId)

      if (activeTaskIndex === -1 || overTaskIndex === -1) return

      // Create new columns array
      const newColumns = [...columns]

      // Remove the task from the source column
      const [task] = newColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1)

      // Update the task status
      task.status = overColumn.id

      // Update completed status based on column
      if (overColumn.id === "done") {
        task.completed = true
      } else if (task.completed) {
        task.completed = false
      }

      // Insert the task at the correct position in the target column
      newColumns[overColumnIndex].tasks.splice(overTaskIndex, 0, task)

      setColumns(newColumns)
    }
  }

  // Function to verify if frontend state matches backend state
  const verifyTaskState = async (taskId: string, expectedStatus: string, expectedCompleted: boolean) => {
    try {
      // Fetch the task from the backend
      const backendTask = await getTaskById(taskId)

      if (!backendTask) {
        console.error("Task not found in backend")
        return false
      }

      // Check if the status and completed state match
      const statusMatches = backendTask.status === expectedStatus
      const completedMatches = backendTask.completed === expectedCompleted

      return statusMatches && completedMatches
    } catch (error) {
      console.error("Error verifying task state:", error)
      return false
    }
  }

  // Function to update task in MongoDB
  const updateTaskInMongoDB = async (taskId: string, targetColumn: string, overTaskId: string | null) => {
    if (!taskId || !targetColumn) {
      console.error("Missing taskId or targetColumn for update")
      return false
    }

    try {
      // Determine the expected completed state
      const completed = targetColumn === "done"

      // Update the task status in the backend
      const result = await updateTaskStatus(taskId, targetColumn)

      if (!result.success) {
        throw new Error("Failed to update task status")
      }

      // If moved to done column, also mark as completed
      if (completed) {
        await toggleTaskCompletion(taskId, true)
      } else if (result.task?.completed) {
        await toggleTaskCompletion(taskId, false)
      }

      // If we're reordering within a column, update the order
      if (overTaskId) {
        await updateTaskOrder(taskId, overTaskId)
      }

      // Verify that the frontend state matches the backend state
      const isVerified = await verifyTaskState(taskId, targetColumn, completed)

      if (!isVerified) {
        console.log("Frontend and backend states don't match, refreshing...")
        // If they don't match, refresh the page to get the latest data
        router.refresh()
      }

      return true
    } catch (error) {
      console.error("Error updating task:", error)
      // If there's an error, refresh to get the latest state
      router.refresh()
      return false
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    // Get the drag info from the ref
    const { taskId, sourceColumn, targetColumn, overTaskId } = dragInfoRef.current

    // Reset active task
    setActiveTask(null)

    // If no over target or task didn't change columns and position, do nothing
    if (!over || !targetColumn || (sourceColumn === targetColumn && !overTaskId)) {
      // Reset drag info
      dragInfoRef.current = { taskId: null, sourceColumn: null, targetColumn: null, overTaskId: null }
      return
    }

    // Show loading state immediately
    startLoading()

    try {
      // Update the task in MongoDB
      await updateTaskInMongoDB(taskId!, targetColumn, overTaskId)
    } finally {
      // Stop loading after update attempt
      stopLoading()
      // Reset drag info
      dragInfoRef.current = { taskId: null, sourceColumn: null, targetColumn: null, overTaskId: null }
    }
  }

  // Handle drag cancel - reset drag info
  const handleDragCancel = () => {
    setActiveTask(null)
    dragInfoRef.current = { taskId: null, sourceColumn: null, targetColumn: null, overTaskId: null }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      // Use closestCorners collision detection for better accuracy
      collisionDetection={closestCorners}
      // Disable dragging while loading
      modifiers={isLoading ? [() => ({ x: 0, y: 0 })] : []}
    >
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>{activeTask ? <KanbanItem task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  )
}


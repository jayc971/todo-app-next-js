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
import { updateTaskStatus, getTaskById, updateTaskOrder } from "@/lib/actions"
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
  const {
    isLoading,
    startLoading,
    stopLoading,
    isCrossColumnLoading,
    startCrossColumnLoading,
    stopCrossColumnLoading,
  } = useLoading()
  const router = useRouter()

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

  useEffect(() => {
    if (!isLoading && !isCrossColumnLoading) {
      // Distribute tasks to columns based on status
      setColumns([
        {
          id: "todo",
          title: "To Do",
          tasks: tasks.filter((task) => task.status === "todo" || (!task.status && !task.completed)),
        },
        {
          id: "inprogress",
          title: "In Progress",
          tasks: tasks.filter((task) => task.status === "inprogress"),
        },
        {
          id: "done",
          title: "Done",
          tasks: tasks.filter((task) => task.status === "done" || (!task.status && task.completed)),
        },
      ])
    }
  }, [tasks, isLoading, isCrossColumnLoading])

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

    for (const column of columns) {
      const task = column.tasks.find((t) => t._id === taskId)
      if (task) {
        setActiveTask(task)
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

    if (columns.some((col) => col.id === overId)) {
      dragInfoRef.current.targetColumn = overId
      dragInfoRef.current.overTaskId = null
    } else {
      for (const column of columns) {
        if (column.tasks.some((task) => task._id === overId)) {
          dragInfoRef.current.targetColumn = column.id
          dragInfoRef.current.overTaskId = overId
          break
        }
      }
    }

    const activeColumnIndex = columns.findIndex((col) => col.tasks.some((task) => task._id === activeId))
    if (activeColumnIndex === -1) return

    if (columns.some((col) => col.id === overId)) {
      const activeColumn = columns[activeColumnIndex]
      const overColumnIndex = columns.findIndex((col) => col.id === overId)
      if (activeColumn.id === overId) return

      const newColumns = [...columns]
      const taskIndex = activeColumn.tasks.findIndex((task) => task._id === activeId)
      if (taskIndex === -1) return

      const [task] = newColumns[activeColumnIndex].tasks.splice(taskIndex, 1)
      task.status = overId

      // Only mark as completed if moving to "done" column
      task.completed = overId === "done"

      newColumns[overColumnIndex].tasks.push(task)
      setColumns(newColumns)
    } else {
      const overColumnIndex = columns.findIndex((col) => col.tasks.some((task) => task._id === overId))
      if (overColumnIndex === -1) return

      const activeColumn = columns[activeColumnIndex]
      const overColumn = columns[overColumnIndex]
      if (activeColumnIndex === overColumnIndex) return

      const activeTaskIndex = activeColumn.tasks.findIndex((task) => task._id === activeId)
      const overTaskIndex = overColumn.tasks.findIndex((task) => task._id === overId)
      if (activeTaskIndex === -1 || overTaskIndex === -1) return

      const newColumns = [...columns]
      const [task] = newColumns[activeColumnIndex].tasks.splice(activeTaskIndex, 1)
      task.status = overColumn.id

      // Only mark as completed if moving to "done" column
      task.completed = overColumn.id === "done"

      newColumns[overColumnIndex].tasks.splice(overTaskIndex, 0, task)
      setColumns(newColumns)
    }
  }

  const verifyTaskState = async (taskId: string, expectedStatus: string, expectedCompleted: boolean) => {
    try {
      const backendTask = await getTaskById(taskId)
      if (!backendTask) return false

      const statusMatches = backendTask.status === expectedStatus
      const completedMatches = backendTask.completed === expectedCompleted
      return statusMatches && completedMatches
    } catch (error) {
      return false
    }
  }

  const updateTaskInMongoDB = async (taskId: string, targetColumn: string, overTaskId: string | null) => {
    if (!taskId || !targetColumn) return false

    try {
      // Update task status, which will also update the completed state
      const result = await updateTaskStatus(taskId, targetColumn)
      if (!result.success) throw new Error("Failed to update task status")

      if (overTaskId) {
        await updateTaskOrder(taskId, overTaskId)
      }

      // Verify that both status and completed state were updated correctly
      const expectedCompleted = targetColumn === "done"
      const isVerified = await verifyTaskState(taskId, targetColumn, expectedCompleted)

      if (!isVerified) {
        router.refresh()
      }

      return true
    } catch (error) {
      router.refresh()
      return false
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { taskId, sourceColumn, targetColumn, overTaskId } = dragInfoRef.current
    setActiveTask(null)

    if (!targetColumn) {
      dragInfoRef.current = { taskId: null, sourceColumn: null, targetColumn: null, overTaskId: null }
      return
    }

    const isCrossColumnMove = sourceColumn !== targetColumn
    if (isCrossColumnMove) {
      startCrossColumnLoading()
    } else {
      dragInfoRef.current = { taskId: null, sourceColumn: null, targetColumn: null, overTaskId: null }
      return
    }

    try {
      await updateTaskInMongoDB(taskId!, targetColumn, overTaskId)
    } finally {
      if (isCrossColumnMove) {
        stopCrossColumnLoading()
      }
      dragInfoRef.current = { taskId: null, sourceColumn: null, targetColumn: null, overTaskId: null }
    }
  }

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
      collisionDetection={closestCorners}
      modifiers={isLoading || isCrossColumnLoading ? [() => ({ x: 0, y: 0 })] : []}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>{activeTask ? <KanbanItem task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  )
}


"use client"

import { useState } from "react"
import type { Task, Column } from "@/lib/types"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import KanbanColumn from "./kanban-column"
import KanbanItem from "./kanban-item"
import { updateTaskStatus } from "@/lib/actions"

interface KanbanBoardProps {
  tasks: Task[]
}

export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", tasks: tasks.filter((task) => !task.status || task.status === "todo") },
    { id: "inprogress", title: "In Progress", tasks: tasks.filter((task) => task.status === "inprogress") },
    { id: "done", title: "Done", tasks: tasks.filter((task) => task.status === "done") },
  ])

  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string

    // Find the task in the columns
    for (const column of columns) {
      const task = column.tasks.find((t) => t._id === taskId)
      if (task) {
        setActiveTask(task)
        break
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the columns
    const activeColumnIndex = columns.findIndex((col) => col.tasks.some((task) => task._id === activeId))
    const overColumnIndex = columns.findIndex((col) => col.id === overId)

    if (activeColumnIndex === -1) return

    // If dropping over a column
    if (columns.some((col) => col.id === overId)) {
      const activeColumn = columns[activeColumnIndex]
      const overColumn = columns[overColumnIndex]

      // Find the task
      const taskIndex = activeColumn.tasks.findIndex((task) => task._id === activeId)
      if (taskIndex === -1) return

      // Create new columns array
      const newColumns = [...columns]

      // Remove the task from the active column
      const [task] = newColumns[activeColumnIndex].tasks.splice(taskIndex, 1)

      // Update the task status
      task.status = overId

      // Add the task to the over column
      newColumns[overColumnIndex].tasks.push(task)

      setColumns(newColumns)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // If the task was dropped on a column, update the status in the database
    if (columns.some((col) => col.id === overId)) {
      await updateTaskStatus(activeId, overId)
    }

    setActiveTask(null)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>{activeTask ? <KanbanItem task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  )
}


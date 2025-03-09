"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/lib/types"
import TaskItem from "./task-item"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { useLoading } from "@/contexts/loading-context"
import { updateTaskOrder } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const { startLoading, stopLoading, isLoading } = useLoading()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      const sortedTasks = [...initialTasks].sort((a, b) => {
        if (a.completed && !b.completed) return 1
        if (!a.completed && b.completed) return -1
        return 0
      })
      setTasks(sortedTasks)
    }
  }, [initialTasks, isLoading])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    startLoading()

    try {
      const activeTask = tasks.find((task) => task._id === active.id)
      const overTask = tasks.find((task) => task._id === over.id)

      if (activeTask?.completed === overTask?.completed) {
        setTasks((items) => {
          const oldIndex = items.findIndex((item) => item._id === active.id)
          const newIndex = items.findIndex((item) => item._id === over.id)

          return arrayMove(items, oldIndex, newIndex)
        })

        await updateTaskOrder(active.id as string, over.id as string)
      }

      router.refresh()
    } catch (error) {
      router.refresh()
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="mt-6">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={isLoading ? [() => ({ x: 0, y: 0 })] : []}
        >
          <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-3">
              {tasks.map((task, index) => (
                <TaskItem key={task._id} task={task} index={index} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}


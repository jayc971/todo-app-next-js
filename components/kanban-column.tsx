import type { Column } from "@/lib/types"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import KanbanItem from "./kanban-item"
import { useLoading } from "@/contexts/loading-context"

interface KanbanColumnProps {
  column: Column
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const { isLoading } = useLoading()
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    disabled: isLoading,
  })

  // Define column header colors
  const getHeaderColor = () => {
    switch (column.id) {
      case "todo":
        return "text-blue-700 dark:text-blue-300"
      case "inprogress":
        return "text-amber-700 dark:text-amber-300"
      case "done":
        return "text-green-700 dark:text-green-300"
      default:
        return "text-gray-700 dark:text-gray-300"
    }
  }

  // Add highlight when column is being dragged over
  const getHighlightClass = () => {
    if (isOver) {
      return "ring-2 ring-primary ring-opacity-70"
    }
    return ""
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[250px] max-w-full md:max-w-[350px] rounded-md p-3 border border-border transition-colors ${getHighlightClass()}`}
    >
      <h3 className={`font-semibold mb-3 px-2 ${getHeaderColor()}`}>
        {column.title} <span className="text-sm ml-1 opacity-70">({column.tasks.length})</span>
      </h3>

      <SortableContext items={column.tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {column.tasks.map((task) => (
            <KanbanItem key={task._id} task={task} />
          ))}
        </div>
      </SortableContext>

      {column.tasks.length === 0 && (
        <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Drop tasks here</p>
        </div>
      )}
    </div>
  )
}


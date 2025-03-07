import type { Column } from "@/lib/types"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import KanbanItem from "./kanban-item"

interface KanbanColumnProps {
  column: Column
}

export default function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[250px] max-w-[350px] bg-gray-100 rounded-md p-3">
      <h3 className="font-semibold text-gray-700 mb-3 px-2">{column.title}</h3>

      <SortableContext items={column.tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {column.tasks.map((task) => (
            <KanbanItem key={task._id} task={task} />
          ))}
        </div>
      </SortableContext>

      {column.tasks.length === 0 && (
        <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500 text-sm">Drop tasks here</p>
        </div>
      )}
    </div>
  )
}


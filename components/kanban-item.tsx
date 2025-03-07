import type { Task } from "@/lib/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface KanbanItemProps {
  task: Task
}

export default function KanbanItem({ task }: KanbanItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing"
    >
      <p className="text-gray-800">{task.title}</p>
    </div>
  )
}


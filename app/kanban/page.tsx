import KanbanBoard from "@/components/kanban-board";
import { getTasks } from "@/lib/tasks";

export default async function KanbanPage() {
  const tasks = await getTasks();

  return (
    <main className="max-w-6xl mx-auto p-4">
      <KanbanBoard tasks={tasks} />
    </main>
  );
}

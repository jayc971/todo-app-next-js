"use client";

import type React from "react";
import { useState } from "react";
import type { Task } from "@/lib/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CheckSquare,
  Clock,
  Edit,
  Check,
  Trash,
  GripVertical,
} from "lucide-react";
import { updateTask, deleteTask, getTaskById } from "@/lib/actions";
import { useLoading } from "@/contexts/loading-context";
import { useRouter } from "next/navigation";
import DeleteTaskDialog from "./delete-task-dialog";

interface KanbanItemProps {
  task: Task;
}

export default function KanbanItem({ task }: KanbanItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const router = useRouter();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    disabled: isEditing || isLoading,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const verifyTaskState = async (taskId: string, expectedTitle: string) => {
    try {
      const backendTask = await getTaskById(taskId);
      if (!backendTask) return false;
      return backendTask.title === expectedTitle;
    } catch (error) {
      return false;
    }
  };

  const getStatusIcon = () => {
    if (task.completed) {
      return <CheckSquare className="h-4 w-4 text-green-500" />;
    }
    if (task.status === "inprogress") {
      return <Clock className="h-4 w-4 text-amber-500" />;
    }
    return null;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    setIsEditing(true);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (editedTitle.trim() && editedTitle !== task.title) {
      setIsEditing(false);
      startLoading();

      try {
        await updateTask(task._id, editedTitle);
        const isVerified = await verifyTaskState(task._id, editedTitle);
        if (!isVerified) router.refresh();
      } catch (error) {
        router.refresh();
      } finally {
        stopLoading();
      }
    } else if (editedTitle.trim() === "") {
      setEditedTitle(task.title);
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteDialogOpen(false);
    startLoading();

    try {
      await deleteTask(task._id);
    } catch (error) {
      router.refresh();
    } finally {
      stopLoading();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 p-4 rounded-md border border-border dark:border-gray-700 transition-all ${
        isDragging ? "opacity-50" : ""
      } hover:shadow-md`}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <div className="flex min-w-0">
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="min-w-0 flex-1 px-3 py-2 border border-r-0 border-input rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave(e as any);
                if (e.key === "Escape") {
                  setEditedTitle(task.title);
                  setIsEditing(false);
                }
                e.stopPropagation();
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 border-l-0 rounded-r-md transition-colors hover:border-green-500"
              aria-label="Save task"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              {...(isEditing || isLoading
                ? {}
                : { ...attributes, ...listeners })}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing p-1 flex-shrink-0"
            >
              <GripVertical className="h-4 w-4" />
            </div>
            {getStatusIcon()}
            <p
              className={`truncate ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </p>
          </div>

          <div className="flex rounded-md overflow-hidden flex-shrink-0 ">
            <button
              onClick={handleEdit}
              className="bg-gray-700 border border-gray-700 hover:border-green-300 p-1 text-gray-600 dark:text-gray-300 transition-colors hover:text-green-500 disabled:opacity-50 disabled:pointer-events-none rounded-l-lg"
              aria-label="Edit task"
              disabled={isLoading}
            >
              <Edit className="h-3 w-3" />
            </button>
            <div className="w-px bg-border dark:bg-gray-600"></div>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="bg-gray-700 border border-gray-700 hover:border-red-300 p-1 text-gray-600 dark:text-gray-300 transition-colors hover:text-red-500 disabled:opacity-50 disabled:pointer-events-none rounded-r-lg"
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
  );
}

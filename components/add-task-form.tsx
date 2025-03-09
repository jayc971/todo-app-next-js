"use client";

import type React from "react";
import { useState } from "react";
import { addTask } from "@/lib/actions";
import { useRouter } from "next/navigation";
import type { Task } from "@/lib/types";
import { useOptimistic } from "react";
import { PlusCircle } from "lucide-react";
import { useLoading } from "@/contexts/loading-context";

interface AddTaskFormProps {
  tasks: Task[];
  kanbanView?: boolean;
}

export default function AddTaskForm({
  tasks,
  kanbanView = false,
}: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask: Task) => [...state, newTask]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const optimisticTask: Task = {
      _id: `optimistic-${Date.now()}`,
      title: title.trim(),
      completed: false,
      status: "todo",
      createdAt: new Date(),
    };

    addOptimisticTask(optimisticTask);
    setTitle("");
    startLoading();

    try {
      const result = await addTask(title.trim());
      if (!result.success) throw new Error("Failed to add task");
      router.refresh();
    } catch (error) {
      router.refresh();
    } finally {
      stopLoading();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-0">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new task"
        className="flex-1 p-4 border border-input rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="p-4 bg-gray-100 hover:bg-green-100 dark:hover:bg-green-500 dark:bg-gray-700 border border-l-0 border-gray-400 hover:border-green-300 p-1 text-gray-400 dark:text-gray-300 transition-colors hover:text-green-500 disabled:opacity-50 disabled:pointer-events-none rounded-r-lg"
      >
        <PlusCircle className="h-4 w-4" />
      </button>
    </form>
  );
}

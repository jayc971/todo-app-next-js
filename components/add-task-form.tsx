"use client";

import type React from "react";
import { useState } from "react";
import { addTask } from "@/lib/actions";
import { useRouter } from "next/navigation";
import type { Task } from "@/lib/types";
import { useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useLoading } from "@/contexts/loading-context";

interface AddTaskFormProps {
  tasks: Task[];
}

export default function AddTaskForm({ tasks }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  // Optimistic UI state for adding tasks
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask: Task) => [...state, newTask]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    // Create a temporary optimistic task
    const optimisticTask: Task = {
      _id: `optimistic-${Date.now()}`,
      title: title.trim(),
      completed: false,
      status: "todo",
      createdAt: new Date(),
    };

    // Optimistically update UI
    addOptimisticTask(optimisticTask);

    // Clear the input
    setTitle("");

    // Show loading state
    startLoading();

    try {
      // Then perform the actual add
      const result = await addTask(title.trim());

      if (!result.success) {
        throw new Error("Failed to add task");
      }

      // Refresh to get the latest state
      router.refresh();
    } catch (error) {
      console.error("Error adding task:", error);
      // If there's an error, refresh to get the latest state
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
      <Button
        type="submit"
        disabled={!title.trim()}
        className="text-gray-400 transition-colors duration-200 ease-in-out rounded-l-none rounded-r-md border border-input bg-transparent hover:bg-primary/10 transition-colors duration-200 p-4 h-100"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </form>
  );
}

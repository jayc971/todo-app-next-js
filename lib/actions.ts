"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase, Task } from "./db"
import type { Task as TaskType } from "./types"

export async function addTask(title: string) {
  try {
    await connectToDatabase()

    const newTask = new Task({
      title,
      completed: false,
      status: "todo",
    })

    const savedTask = await newTask.save()
    revalidatePath("/")
    revalidatePath("/kanban")
    revalidatePath("/list")

    return {
      success: true,
      task: JSON.parse(JSON.stringify(savedTask)),
    }
  } catch (error) {
    console.error("Failed to add task:", error)
    return { success: false, error: "Failed to add task" }
  }
}

export async function deleteTask(id: string) {
  try {
    await connectToDatabase()
    await Task.findByIdAndDelete(id)
    revalidatePath("/")
    revalidatePath("/kanban")
    revalidatePath("/list")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function updateTask(id: string, title: string) {
  try {
    await connectToDatabase()
    const updatedTask = await Task.findByIdAndUpdate(id, { title }, { new: true })

    revalidatePath("/")
    revalidatePath("/kanban")
    revalidatePath("/list")

    return {
      success: true,
      task: JSON.parse(JSON.stringify(updatedTask)),
    }
  } catch (error) {
    console.error("Failed to update task:", error)
    return { success: false, error: "Failed to update task" }
  }
}

export async function updateTaskStatus(id: string, status: string) {
  try {
    await connectToDatabase()

    // Only mark as completed if status is "done"
    // "inprogress" tasks should not be marked as completed
    const completed = status === "done"

    const updatedTask = await Task.findByIdAndUpdate(id, { status, completed }, { new: true })

    revalidatePath("/")
    revalidatePath("/kanban")
    revalidatePath("/list")

    return {
      success: true,
      task: JSON.parse(JSON.stringify(updatedTask)),
    }
  } catch (error) {
    console.error("Failed to update task status:", error)
    return { success: false, error: "Failed to update task status" }
  }
}

export async function toggleTaskCompletion(id: string, completed: boolean) {
  try {
    await connectToDatabase()

    // When toggling completion in List view:
    // - Completed tasks should go to "done" status
    // - Uncompleted tasks should go to "todo" status
    const status = completed ? "done" : "todo"

    const updatedTask = await Task.findByIdAndUpdate(id, { completed, status }, { new: true })

    revalidatePath("/")
    revalidatePath("/kanban")
    revalidatePath("/list")

    return {
      success: true,
      task: JSON.parse(JSON.stringify(updatedTask)),
    }
  } catch (error) {
    console.error("Failed to toggle task completion:", error)
    return { success: false, error: "Failed to toggle task completion" }
  }
}

export async function updateTaskOrder(taskId: string, referenceTaskId: string) {
  try {
    await connectToDatabase()

    revalidatePath("/")
    revalidatePath("/kanban")
    revalidatePath("/list")

    return { success: true }
  } catch (error) {
    console.error("Failed to update task order:", error)
    return { success: false, error: "Failed to update task order" }
  }
}

export async function getTaskById(id: string): Promise<TaskType | null> {
  try {
    await connectToDatabase()
    const task = await Task.findById(id)

    if (!task) return null

    return JSON.parse(JSON.stringify(task))
  } catch (error) {
    console.error("Failed to fetch task:", error)
    return null
  }
}


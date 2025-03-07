"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase, Task } from "./db"

export async function addTask(title: string) {
  // Use edge runtime for this function
  const runtime = "edge"

  try {
    await connectToDatabase()

    const newTask = new Task({
      title,
      completed: false,
    })

    await newTask.save()
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to add task:", error)
    return { success: false, error: "Failed to add task" }
  }
}

export async function deleteTask(id: string) {
  // Use edge runtime for this function
  const runtime = "edge"

  try {
    await connectToDatabase()
    await Task.findByIdAndDelete(id)
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function updateTask(id: string, title: string) {
  // Use edge runtime for this function
  const runtime = "edge"

  try {
    await connectToDatabase()
    await Task.findByIdAndUpdate(id, { title })
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to update task:", error)
    return { success: false, error: "Failed to update task" }
  }
}

export async function updateTaskStatus(id: string, status: string) {
  // Use edge runtime for this function
  const runtime = "edge"

  try {
    await connectToDatabase()
    await Task.findByIdAndUpdate(id, { status })
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Failed to update task status:", error)
    return { success: false, error: "Failed to update task status" }
  }
}


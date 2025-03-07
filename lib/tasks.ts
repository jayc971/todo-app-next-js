import { connectToDatabase, Task } from "./db"
import type { Task as TaskType } from "./types"

export async function getTasks(): Promise<TaskType[]> {
  try {
    await connectToDatabase()
    const tasks = await Task.find({}).sort({ createdAt: -1 })

    return JSON.parse(JSON.stringify(tasks))
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return []
  }
}


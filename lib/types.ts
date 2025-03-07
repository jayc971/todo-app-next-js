export interface Task {
  _id: string
  title: string
  completed: boolean
  status?: string
  createdAt: Date
}

export type Column = {
  id: string
  title: string
  tasks: Task[]
}


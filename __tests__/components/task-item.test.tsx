import { render, screen, fireEvent } from "@testing-library/react"
import TaskItem from "@/components/task-item"
import type { Task } from "@/lib/types"

// Mock the server actions
jest.mock("@/lib/actions", () => ({
  deleteTask: jest.fn(() => Promise.resolve({ success: true })),
  updateTask: jest.fn(() => Promise.resolve({ success: true })),
}))

describe("TaskItem", () => {
  const mockTask: Task = {
    _id: "1",
    title: "Test Task",
    completed: false,
    createdAt: new Date(),
  }

  it("renders the task title", () => {
    render(<TaskItem task={mockTask} />)
    expect(screen.getByText("Test Task")).toBeInTheDocument()
  })

  it("shows edit input when edit button is clicked", () => {
    render(<TaskItem task={mockTask} />)

    // Find and click the edit button
    const editButton = screen.getByLabelText("Edit task")
    fireEvent.click(editButton)

    // Check if the input is now visible
    const input = screen.getByDisplayValue("Test Task")
    expect(input).toBeInTheDocument()
  })

  it("updates task title when save button is clicked", async () => {
    render(<TaskItem task={mockTask} />)

    // Find and click the edit button
    const editButton = screen.getByLabelText("Edit task")
    fireEvent.click(editButton)

    // Update the input value
    const input = screen.getByDisplayValue("Test Task")
    fireEvent.change(input, { target: { value: "Updated Task" } })

    // Click the save button
    const saveButton = screen.getByLabelText("Save task")
    fireEvent.click(saveButton)

    // Check if the title is updated (optimistically)
    expect(screen.getByText("Updated Task")).toBeInTheDocument()
  })
})


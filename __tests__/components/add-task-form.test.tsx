import { render, screen, fireEvent } from "@testing-library/react"
import AddTaskForm from "@/components/add-task-form"

// Mock the server actions and router
jest.mock("@/lib/actions", () => ({
  addTask: jest.fn(() => Promise.resolve({ success: true })),
}))

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

describe("AddTaskForm", () => {
  it("renders the form elements", () => {
    render(<AddTaskForm tasks={[]} />)

    expect(screen.getByPlaceholderText("Add a new task...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument()
  })

  it("disables the submit button when input is empty", () => {
    render(<AddTaskForm tasks={[]} />)

    const button = screen.getByRole("button", { name: /add task/i })
    expect(button).toBeDisabled()
  })

  it("enables the submit button when input has text", () => {
    render(<AddTaskForm tasks={[]} />)

    const input = screen.getByPlaceholderText("Add a new task...")
    fireEvent.change(input, { target: { value: "New Task" } })

    const button = screen.getByRole("button", { name: /add task/i })
    expect(button).not.toBeDisabled()
  })

  it("clears the input after form submission", async () => {
    render(<AddTaskForm tasks={[]} />)

    const input = screen.getByPlaceholderText("Add a new task...")
    fireEvent.change(input, { target: { value: "New Task" } })

    const form = input.closest("form")
    fireEvent.submit(form!)

    // Input should be cleared
    expect(input).toHaveValue("")
  })
})


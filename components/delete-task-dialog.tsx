"use client"

import { useState, useEffect } from "react"

interface DeleteTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskTitle: string
}

export default function DeleteTaskDialog({ isOpen, onClose, onConfirm, taskTitle }: DeleteTaskDialogProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible && !isOpen) return null

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 max-w-md p-6 m-4 rounded-lg shadow-lg border border-border dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2">Delete Task</h2>
        <p className="mb-6">Are you sure you want to delete the task "{taskTitle}"? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md transition-colors border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md transition-colors border border-red-500 hover:border-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}


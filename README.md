# Next.js To-Do Application

A modern, responsive to-do application built with Next.js, MongoDB, and Tailwind CSS. This application provides both a list view and a Kanban board view for task management.

## Features

- **Dual View System**: Switch between List view and Kanban board view
- **Drag and Drop**: Reorder tasks or move them between columns
- **Real-time Updates**: Changes in one view are immediately reflected in the other
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Optimistic UI Updates**: See changes immediately before they're confirmed by the server

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, Tailwind CSS
- **Backend**: Next.js Server Components and Server Actions
- **Database**: MongoDB
- **State Management**: React's built-in hooks (useState, useOptimistic)
- **Drag and Drop**: dnd-kit library
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React

## Views

### List View

The List view provides a traditional to-do list interface where you can:
- Add new tasks
- Mark tasks as complete/incomplete
- Edit task titles
- Delete tasks
- Reorder tasks by dragging them

### Kanban Board View

The Kanban board view organizes tasks into three columns:
- **To Do**: Tasks that haven't been started (unchecked in List view)
- **In Progress**: Tasks that are currently being worked on
- **Done**: Completed tasks (checked in List view)

Tasks can be dragged between columns to update their status.

## Synchronization

The application maintains synchronization between the List view and Kanban board view:
- Tasks in the "To Do" column appear unchecked in the List view
- Tasks in the "In Progress" and "Done" columns appear checked in the List view
- Checking a task in the List view moves it to the "Done" column in the Kanban view
- Unchecking a task in the List view moves it to the "To Do" column in the Kanban view

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB database

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:


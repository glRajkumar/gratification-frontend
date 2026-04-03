import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { Todo } from "@/types/app"

export function getTodos(params?: {
  status?: "pending" | "completed" | "missed"
  date?: string
}): Promise<Todo[]> {
  return sendApiReq({ method: "GET", url: endpoints.todos.list, params })
}

export function createTodo(data: {
  title: string
  categoryId?: string
  dueDate?: string
}): Promise<Todo> {
  return sendApiReq({ method: "POST", url: endpoints.todos.create, data })
}

export function updateTodo(
  id: string,
  data: Partial<{
    title: string
    categoryId: string
    dueDate: string
    status: "pending" | "completed" | "missed"
  }>,
): Promise<Todo> {
  return sendApiReq({ method: "PUT", url: endpoints.todos.update(id), data })
}

export function deleteTodo(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.todos.delete(id) })
}

export function completeTodo(
  id: string,
  data: {
    createJournalPoint: boolean
    journalPoint?: {
      title: string
      description?: string
      score: number
      tag: "positive" | "negative" | "neutral"
    }
  },
): Promise<{
  todo: Todo
  journalPointPrompt: { message: string; todoId: string; todoTitle: string } | null
}> {
  return sendApiReq({ method: "POST", url: endpoints.todos.complete(id), data })
}

import { api, endpoints } from "@/services/api"
import type { Todo } from "@/types/app"

export async function getTodos(params?: {
  status?: "pending" | "completed" | "missed"
  date?: string
}): Promise<Todo[]> {
  const { data } = await api.get(endpoints.todos.list, { params })
  return data
}

export async function createTodo(body: {
  title: string
  categoryId?: string
  dueDate?: string
}): Promise<Todo> {
  const { data } = await api.post(endpoints.todos.create, body)
  return data
}

export async function updateTodo(
  id: string,
  body: Partial<{
    title: string
    categoryId: string
    dueDate: string
    status: "pending" | "completed" | "missed"
  }>,
): Promise<Todo> {
  const { data } = await api.put(endpoints.todos.update(id), body)
  return data
}

export async function deleteTodo(id: string): Promise<void> {
  await api.delete(endpoints.todos.delete(id))
}

export async function completeTodo(
  id: string,
  body: {
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
  journalPointPrompt: {
    message: string
    todoId: string
    todoTitle: string
  } | null
}> {
  const { data } = await api.post(endpoints.todos.complete(id), body)
  return data
}

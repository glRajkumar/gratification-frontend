import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { TodoFormData } from "@/utils/schemas"
import type { Todo } from "@/types/app"

type UpdateTodoParams = { id: string } & Partial<
  TodoFormData & { status: "pending" | "completed" | "missed" }
>

type CompleteTodoParams = {
  id: string
  createJournalPoint: boolean
  journalPoint?: {
    title: string
    description?: string
    score: number
    tag: "positive" | "negative" | "neutral"
  }
}

export function getTodos(params?: {
  status?: "pending" | "completed" | "missed"
  date?: string
}): Promise<Todo[]> {
  return sendApiReq({ method: "GET", url: endpoints.todos.list, params })
}

export function createTodo(data: TodoFormData): Promise<Todo> {
  return sendApiReq({ method: "POST", url: endpoints.todos.create, data })
}

export function updateTodo({ id, ...data }: UpdateTodoParams): Promise<Todo> {
  return sendApiReq({ method: "PUT", url: endpoints.todos.update(id), data })
}

export function deleteTodo(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.todos.delete(id) })
}

export function completeTodo({ id, ...data }: CompleteTodoParams): Promise<{
  todo: Todo
  journalPointPrompt: { message: string; todoId: string; todoTitle: string } | null
}> {
  return sendApiReq({ method: "POST", url: endpoints.todos.complete(id), data })
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
} from "@/actions/todos"

const KEYS = {
  list: (params?: object) => ["todos", params],
}

export function useTodos(params?: {
  status?: "pending" | "completed" | "missed"
  date?: string
}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => getTodos(params),
  })
}

export function useCreateTodo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTodo,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["todos"] })
      toast.success("Todo created")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useUpdateTodo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Parameters<typeof updateTodo>[1]
    }) => updateTodo(id, body),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["todos"] })
      toast.success("Todo updated")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useDeleteTodo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["todos"] })
      toast.success("Todo deleted")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useCompleteTodo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Parameters<typeof completeTodo>[1]
    }) => completeTodo(id, body),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["todos"] })
      qc.invalidateQueries({ queryKey: ["journal"] })
      toast.success("Todo completed")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

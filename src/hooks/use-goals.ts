import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addGoalProgress,
  closeGoal,
} from "@/actions/goals"

const KEYS = {
  list: (params?: object) => ["goals", params],
}

export function useGoals(params?: {
  status?: "active" | "achieved" | "partial" | "missed"
  period?: "daily" | "weekly" | "monthly"
}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => getGoals(params),
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createGoal,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["goals"] })
      toast.success("Goal created")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateGoal,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["goals"] })
      toast.success("Goal updated")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["goals"] })
      toast.success("Goal deleted")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useAddGoalProgress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addGoalProgress,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["goals"] })
      toast.success("Progress logged")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useCloseGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: closeGoal,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["goals"] })
      qc.invalidateQueries({ queryKey: ["journal"] })
      toast.success("Goal closed")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

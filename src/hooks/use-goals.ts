import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Parameters<typeof updateGoal>[1]
    }) => updateGoal(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  })
}

export function useAddGoalProgress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      goalId,
      journalPointId,
    }: {
      goalId: string
      journalPointId: string
    }) => addGoalProgress(goalId, journalPointId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  })
}

export function useCloseGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Parameters<typeof closeGoal>[1]
    }) => closeGoal(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] })
      qc.invalidateQueries({ queryKey: ["journal"] })
    },
  })
}

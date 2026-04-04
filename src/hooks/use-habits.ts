import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  checkHabit,
  getHabitStats,
} from "@/actions/habits"
import type { HabitFormData } from "@/utils/schemas"

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  })
}

export function useHabitStats(id: string, days?: number) {
  return useQuery({
    queryKey: ["habits", id, "stats", days ?? 30],
    queryFn: () => getHabitStats(id, days),
    enabled: !!id,
  })
}

export function useCreateHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createHabit,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["habits"] })
      toast.success("Habit created")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useUpdateHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateHabit,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["habits"] })
      toast.success("Habit updated")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useDeleteHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteHabit,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["habits"] })
      toast.success("Habit archived")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useCheckHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: checkHabit,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["habits"] })
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

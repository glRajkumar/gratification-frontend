import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getJournalPoints,
  createJournalPoint,
  createQuickJournalPoint,
  getJournalPoint,
  updateJournalPoint,
  deleteJournalPoint,
  getDailyScore,
  addReflection,
  updateReflection,
  deleteReflection,
  getOnThisDay,
} from "@/actions/journal"
import type { JournalPointFormData, ReflectionFormData } from "@/utils/schemas"

const KEYS = {
  list: (params?: object) => ["journal", params],
  detail: (id: string) => ["journal", id],
  score: (date: string) => ["journal", "score", date],
}

export function useJournalPoints(params?: {
  date?: string
  week?: string
  month?: string
}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () => getJournalPoints(params),
  })
}

export function useJournalPoint(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => getJournalPoint(id),
    enabled: !!id,
  })
}

export function useDailyScore(date: string) {
  return useQuery({
    queryKey: KEYS.score(date),
    queryFn: () => getDailyScore(date),
    enabled: !!date,
  })
}

export function useCreateJournalPoint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createJournalPoint,
    onSuccess(data) {
      qc.invalidateQueries({ queryKey: ["journal"] })
      qc.invalidateQueries({ queryKey: ["streaks"] })
      qc.invalidateQueries({ queryKey: ["achievements"] })
      if (data.tag === "positive") {
        toast.success(`+${data.score} added to your score`)
      } else if (data.tag === "negative") {
        toast.success("Entry saved")
      } else {
        toast.success("Journal entry saved")
      }
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

// id closed over so the component just passes form data without id
export function useUpdateJournalPoint(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<JournalPointFormData>) =>
      updateJournalPoint({ id, ...body }),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["journal"] })
      toast.success("Entry updated")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useDeleteJournalPoint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteJournalPoint,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["journal"] })
      toast.success("Entry deleted")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

// journalPointId closed over for URL + cache key
export function useAddReflection(journalPointId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: ReflectionFormData) =>
      addReflection({ journalPointId, ...body }),
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEYS.detail(journalPointId) })
      toast.success("Reflection added")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

// journalPointId closed over for cache key; component passes { id, ...body }
export function useUpdateReflection(journalPointId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateReflection,
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEYS.detail(journalPointId) })
      toast.success("Reflection updated")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useDeleteReflection(journalPointId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteReflection,
    onSuccess() {
      qc.invalidateQueries({ queryKey: KEYS.detail(journalPointId) })
      toast.success("Reflection deleted")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useOnThisDay() {
  return useQuery({
    queryKey: ["journal", "on-this-day"],
    queryFn: getOnThisDay,
  })
}

export function useQuickCreateJournalPoint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createQuickJournalPoint,
    onSuccess(data) {
      qc.invalidateQueries({ queryKey: ["journal"] })
      qc.invalidateQueries({ queryKey: ["streaks"] })
      qc.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success(
        data.tag === "positive"
          ? `Quick entry: +${data.score}`
          : data.tag === "negative"
            ? `Quick entry: −${data.score}`
            : "Quick entry saved",
      )
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

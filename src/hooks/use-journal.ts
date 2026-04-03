import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getJournalPoints,
  createJournalPoint,
  getJournalPoint,
  updateJournalPoint,
  deleteJournalPoint,
  getDailyScore,
  addReflection,
  updateReflection,
  deleteReflection,
} from "@/actions/journal"
import type { Reflection } from "@/types/app"

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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] }),
  })
}

export function useUpdateJournalPoint(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Parameters<typeof updateJournalPoint>[1]) =>
      updateJournalPoint(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["journal"] })
    },
  })
}

export function useDeleteJournalPoint() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteJournalPoint,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] }),
  })
}

export function useAddReflection(journalPointId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { type: Reflection["type"]; content: string }) =>
      addReflection(journalPointId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detail(journalPointId) }),
  })
}

export function useUpdateReflection(journalPointId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: Parameters<typeof updateReflection>[1]
    }) => updateReflection(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detail(journalPointId) }),
  })
}

export function useDeleteReflection(journalPointId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteReflection,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: KEYS.detail(journalPointId) }),
  })
}

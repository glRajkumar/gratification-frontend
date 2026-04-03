import { api, endpoints } from "@/services/api"
import type {
  JournalPoint,
  JournalPointWithReflections,
  DailyScore,
  Reflection,
} from "@/types/app"

export async function getJournalPoints(params?: {
  date?: string
  week?: string
  month?: string
}): Promise<JournalPoint[]> {
  const { data } = await api.get(endpoints.journal.list, { params })
  return data
}

export async function createJournalPoint(body: {
  title: string
  description?: string
  date: string
  time?: string
  categoryId?: string
  score: number
  tag: "positive" | "negative" | "neutral"
}): Promise<JournalPoint> {
  const { data } = await api.post(endpoints.journal.create, body)
  return data
}

export async function getJournalPoint(
  id: string,
): Promise<JournalPointWithReflections> {
  const { data } = await api.get(endpoints.journal.get(id))
  return data
}

export async function updateJournalPoint(
  id: string,
  body: Partial<{
    title: string
    description: string
    date: string
    time: string
    categoryId: string
    score: number
    tag: "positive" | "negative" | "neutral"
  }>,
): Promise<JournalPoint> {
  const { data } = await api.put(endpoints.journal.update(id), body)
  return data
}

export async function deleteJournalPoint(id: string): Promise<void> {
  await api.delete(endpoints.journal.delete(id))
}

export async function getDailyScore(date: string): Promise<DailyScore> {
  const { data } = await api.get(endpoints.journal.score, { params: { date } })
  return data
}

export async function addReflection(
  journalPointId: string,
  body: { type: Reflection["type"]; content: string },
): Promise<Reflection> {
  const { data } = await api.post(
    endpoints.journal.addReflection(journalPointId),
    body,
  )
  return data
}

export async function updateReflection(
  id: string,
  body: Partial<{ type: Reflection["type"]; content: string }>,
): Promise<Reflection> {
  const { data } = await api.put(endpoints.reflections.update(id), body)
  return data
}

export async function deleteReflection(id: string): Promise<void> {
  await api.delete(endpoints.reflections.delete(id))
}

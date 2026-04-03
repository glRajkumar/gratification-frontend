import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type {
  JournalPoint,
  JournalPointWithReflections,
  DailyScore,
  Reflection,
} from "@/types/app"

export function getJournalPoints(params?: {
  date?: string
  week?: string
  month?: string
}): Promise<JournalPoint[]> {
  return sendApiReq({ method: "GET", url: endpoints.journal.list, params })
}

export function createJournalPoint(data: {
  title: string
  description?: string
  date: string
  time?: string
  categoryId?: string
  score: number
  tag: "positive" | "negative" | "neutral"
}): Promise<JournalPoint> {
  return sendApiReq({ method: "POST", url: endpoints.journal.create, data })
}

export function getJournalPoint(id: string): Promise<JournalPointWithReflections> {
  return sendApiReq({ method: "GET", url: endpoints.journal.get(id) })
}

export function updateJournalPoint(
  id: string,
  data: Partial<{
    title: string
    description: string
    date: string
    time: string
    categoryId: string
    score: number
    tag: "positive" | "negative" | "neutral"
  }>,
): Promise<JournalPoint> {
  return sendApiReq({ method: "PUT", url: endpoints.journal.update(id), data })
}

export function deleteJournalPoint(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.journal.delete(id) })
}

export function getDailyScore(date: string): Promise<DailyScore> {
  return sendApiReq({ method: "GET", url: endpoints.journal.score, params: { date } })
}

export function addReflection(
  journalPointId: string,
  data: { type: Reflection["type"]; content: string },
): Promise<Reflection> {
  return sendApiReq({
    method: "POST",
    url: endpoints.journal.addReflection(journalPointId),
    data,
  })
}

export function updateReflection(
  id: string,
  data: Partial<{ type: Reflection["type"]; content: string }>,
): Promise<Reflection> {
  return sendApiReq({ method: "PUT", url: endpoints.reflections.update(id), data })
}

export function deleteReflection(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.reflections.delete(id) })
}

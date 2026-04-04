import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type {
  JournalPointFormData,
  ReflectionFormData,
} from "@/utils/schemas"
import type {
  JournalPoint,
  JournalPointWithReflections,
  DailyScore,
  Reflection,
  OnThisDayGroup,
} from "@/types/app"

type UpdateJournalPointParams = { id: string } & Partial<JournalPointFormData>
type UpdateReflectionParams = { id: string } & Partial<ReflectionFormData>
type AddReflectionParams = { journalPointId: string } & ReflectionFormData

export function getJournalPoints(params?: {
  date?: string
  week?: string
  month?: string
}): Promise<JournalPoint[]> {
  return sendApiReq({ method: "GET", url: endpoints.journal.list, params })
}

export function createJournalPoint(data: JournalPointFormData): Promise<JournalPoint> {
  return sendApiReq({ method: "POST", url: endpoints.journal.create, data })
}

export function getJournalPoint(id: string): Promise<JournalPointWithReflections> {
  return sendApiReq({ method: "GET", url: endpoints.journal.get(id) })
}

export function updateJournalPoint({ id, ...data }: UpdateJournalPointParams): Promise<JournalPoint> {
  return sendApiReq({ method: "PUT", url: endpoints.journal.update(id), data })
}

export function deleteJournalPoint(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.journal.delete(id) })
}

export function getDailyScore(date: string): Promise<DailyScore> {
  return sendApiReq({ method: "GET", url: endpoints.journal.score, params: { date } })
}

export function addReflection({ journalPointId, ...data }: AddReflectionParams): Promise<Reflection> {
  return sendApiReq({
    method: "POST",
    url: endpoints.journal.addReflection(journalPointId),
    data,
  })
}

export function updateReflection({ id, ...data }: UpdateReflectionParams): Promise<Reflection> {
  return sendApiReq({ method: "PUT", url: endpoints.reflections.update(id), data })
}

export function deleteReflection(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.reflections.delete(id) })
}

export function getOnThisDay(): Promise<OnThisDayGroup[]> {
  return sendApiReq({ method: "GET", url: endpoints.journal.onThisDay })
}

export function createQuickJournalPoint(data: {
  score: number
  tag: "positive" | "negative" | "neutral"
  date: string
}): Promise<JournalPoint> {
  return sendApiReq({ method: "POST", url: endpoints.journal.quick, data })
}

import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { Habit, HabitWithTodayEntry, HabitStats } from "@/types/app"
import type { HabitFormData } from "@/utils/schemas"

export function getHabits(): Promise<HabitWithTodayEntry[]> {
  return sendApiReq({ method: "GET", url: endpoints.habits.list })
}

export function createHabit(data: HabitFormData): Promise<Habit> {
  return sendApiReq({ method: "POST", url: endpoints.habits.create, data })
}

export function updateHabit({
  id,
  ...data
}: { id: string } & Partial<HabitFormData>): Promise<Habit> {
  return sendApiReq({
    method: "PUT",
    url: endpoints.habits.update(id),
    data,
  })
}

export function deleteHabit(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.habits.delete(id) })
}

export function checkHabit({
  id,
  ...data
}: {
  id: string
  date: string
  completed: boolean
  note?: string
}): Promise<void> {
  return sendApiReq({
    method: "POST",
    url: endpoints.habits.check(id),
    data,
  })
}

export function getHabitStats(
  id: string,
  days?: number,
): Promise<HabitStats> {
  return sendApiReq({
    method: "GET",
    url: endpoints.habits.stats(id),
    params: days ? { days } : undefined,
  })
}

import { api, endpoints } from "@/services/api"
import type { Goal, GoalProgress, JournalPoint } from "@/types/app"

export async function getGoals(params?: {
  status?: "active" | "achieved" | "partial" | "missed"
  period?: "daily" | "weekly" | "monthly"
}): Promise<Goal[]> {
  const { data } = await api.get(endpoints.goals.list, { params })
  return data
}

export async function createGoal(body: {
  title: string
  categoryId?: string
  period: "daily" | "weekly" | "monthly"
  targetCount: number
  startDate: string
  endDate: string
}): Promise<Goal> {
  const { data } = await api.post(endpoints.goals.create, body)
  return data
}

export async function updateGoal(
  id: string,
  body: Partial<{
    title: string
    categoryId: string
    period: "daily" | "weekly" | "monthly"
    targetCount: number
    startDate: string
    endDate: string
  }>,
): Promise<Goal> {
  const { data } = await api.put(endpoints.goals.update(id), body)
  return data
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(endpoints.goals.delete(id))
}

export async function addGoalProgress(
  goalId: string,
  journalPointId: string,
): Promise<GoalProgress> {
  const { data } = await api.post(endpoints.goals.addProgress(goalId), {
    journalPointId,
  })
  return data
}

export async function closeGoal(
  id: string,
  body: {
    status: "achieved" | "partial" | "missed"
    summaryNote?: string
  },
): Promise<{ goal: Goal; journalPoint: JournalPoint }> {
  const { data } = await api.post(endpoints.goals.close(id), body)
  return data
}

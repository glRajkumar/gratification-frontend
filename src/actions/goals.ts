import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { Goal, GoalProgress, JournalPoint } from "@/types/app"

export function getGoals(params?: {
  status?: "active" | "achieved" | "partial" | "missed"
  period?: "daily" | "weekly" | "monthly"
}): Promise<Goal[]> {
  return sendApiReq({ method: "GET", url: endpoints.goals.list, params })
}

export function createGoal(data: {
  title: string
  categoryId?: string
  period: "daily" | "weekly" | "monthly"
  targetCount: number
  startDate: string
  endDate: string
}): Promise<Goal> {
  return sendApiReq({ method: "POST", url: endpoints.goals.create, data })
}

export function updateGoal(
  id: string,
  data: Partial<{
    title: string
    categoryId: string
    period: "daily" | "weekly" | "monthly"
    targetCount: number
    startDate: string
    endDate: string
  }>,
): Promise<Goal> {
  return sendApiReq({ method: "PUT", url: endpoints.goals.update(id), data })
}

export function deleteGoal(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.goals.delete(id) })
}

export function addGoalProgress(
  goalId: string,
  journalPointId: string,
): Promise<GoalProgress> {
  return sendApiReq({
    method: "POST",
    url: endpoints.goals.addProgress(goalId),
    data: { journalPointId },
  })
}

export function closeGoal(
  id: string,
  data: { status: "achieved" | "partial" | "missed"; summaryNote?: string },
): Promise<{ goal: Goal; journalPoint: JournalPoint }> {
  return sendApiReq({ method: "POST", url: endpoints.goals.close(id), data })
}

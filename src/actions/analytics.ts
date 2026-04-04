import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type {
  ScoreHistory,
  ScoreHistoryPoint,
  WeeklySummary,
  CategoryBreakdown,
  Correlation,
  CommunityStats,
} from "@/types/app"

export function getScoreHistory(days?: number): Promise<ScoreHistory> {
  return sendApiReq({
    method: "GET",
    url: endpoints.analytics.scoreHistory,
    params: days ? { days } : undefined,
  })
}

export function getHeatmap(year?: number): Promise<ScoreHistoryPoint[]> {
  return sendApiReq({
    method: "GET",
    url: endpoints.analytics.heatmap,
    params: year ? { year } : undefined,
  })
}

export function getWeeklySummary(week?: string): Promise<WeeklySummary> {
  return sendApiReq({
    method: "GET",
    url: endpoints.analytics.weeklySummary,
    params: week ? { week } : undefined,
  })
}

export function getCategoryBreakdown(params?: {
  from?: string
  to?: string
}): Promise<CategoryBreakdown[]> {
  return sendApiReq({
    method: "GET",
    url: endpoints.analytics.categoryBreakdown,
    params,
  })
}

export function getCorrelations(days?: number): Promise<Correlation[]> {
  return sendApiReq({
    method: "GET",
    url: endpoints.analytics.correlations,
    params: days ? { days } : undefined,
  })
}

export function getCommunityStats(): Promise<CommunityStats> {
  return sendApiReq({ method: "GET", url: endpoints.analytics.community })
}

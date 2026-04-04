import { useQuery } from "@tanstack/react-query"
import {
  getScoreHistory,
  getHeatmap,
  getWeeklySummary,
  getCategoryBreakdown,
  getCorrelations,
  getCommunityStats,
} from "@/actions/analytics"

export function useScoreHistory(days?: number) {
  return useQuery({
    queryKey: ["analytics", "score-history", days ?? 30],
    queryFn: () => getScoreHistory(days),
  })
}

export function useHeatmap(year?: number) {
  return useQuery({
    queryKey: ["analytics", "heatmap", year ?? new Date().getFullYear()],
    queryFn: () => getHeatmap(year),
  })
}

export function useWeeklySummary(week?: string) {
  return useQuery({
    queryKey: ["analytics", "weekly-summary", week ?? "current"],
    queryFn: () => getWeeklySummary(week),
  })
}

export function useCategoryBreakdown(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ["analytics", "category-breakdown", params],
    queryFn: () => getCategoryBreakdown(params),
  })
}

export function useCorrelations(days?: number) {
  return useQuery({
    queryKey: ["analytics", "correlations", days ?? 30],
    queryFn: () => getCorrelations(days),
  })
}

export function useCommunityStats() {
  return useQuery({
    queryKey: ["analytics", "community"],
    queryFn: getCommunityStats,
    staleTime: 60 * 60 * 1000,
  })
}

import { useQuery } from "@tanstack/react-query"
import {
  getPersonalityLabel,
  getWrapped,
  getPercentile,
  getScoreMilestones,
} from "@/actions/personality"

export function usePersonalityLabel() {
  return useQuery({
    queryKey: ["personality", "label"],
    queryFn: getPersonalityLabel,
    staleTime: 60 * 60 * 1000,
  })
}

export function useWrapped(month?: string) {
  return useQuery({
    queryKey: ["personality", "wrapped", month ?? "latest"],
    queryFn: () => getWrapped(month),
    staleTime: 60 * 60 * 1000,
  })
}

export function usePercentile() {
  return useQuery({
    queryKey: ["personality", "percentile"],
    queryFn: getPercentile,
    staleTime: 10 * 60 * 1000,
  })
}

export function useScoreMilestones() {
  return useQuery({
    queryKey: ["personality", "milestones"],
    queryFn: getScoreMilestones,
    staleTime: 2 * 60 * 1000,
  })
}

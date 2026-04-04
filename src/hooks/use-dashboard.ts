import { useQuery } from "@tanstack/react-query"
import { getDashboardContext } from "@/actions/dashboard"

export function useDashboardContext() {
  return useQuery({
    queryKey: ["dashboard", "context"],
    queryFn: getDashboardContext,
    staleTime: 5 * 60 * 1000,
  })
}

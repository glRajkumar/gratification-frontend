import { useQuery } from "@tanstack/react-query"
import { getStreaks } from "@/actions/streaks"

export function useStreaks() {
  return useQuery({
    queryKey: ["streaks"],
    queryFn: getStreaks,
  })
}

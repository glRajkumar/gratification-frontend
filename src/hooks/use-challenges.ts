import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getChallengeToday,
  completeChallenge,
  getChallengeHistory,
} from "@/actions/challenges"

export function useChallengeToday() {
  return useQuery({
    queryKey: ["challenges", "today"],
    queryFn: getChallengeToday,
    staleTime: 60 * 60 * 1000,
  })
}

export function useChallengeHistory() {
  return useQuery({
    queryKey: ["challenges", "history"],
    queryFn: getChallengeHistory,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCompleteChallenge() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: completeChallenge,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["challenges"] })
      toast.success("Challenge completed!")
    },
    onError(error) {
      toast.error(error?.message || "Failed to complete challenge")
    },
  })
}

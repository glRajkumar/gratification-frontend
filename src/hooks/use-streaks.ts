import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getStreaks,
  freezeStreak,
  invitePartner,
  acceptPartner,
  removePartner,
} from "@/actions/streaks"

export function useStreaks() {
  return useQuery({
    queryKey: ["streaks"],
    queryFn: getStreaks,
    staleTime: 2 * 60 * 1000,
  })
}

export function useFreezeStreak() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: freezeStreak,
    onSuccess(data) {
      qc.invalidateQueries({ queryKey: ["streaks"] })
      qc.invalidateQueries({ queryKey: ["journal"] })
      toast.success(`Streak protected! ${data.freezeTokens} tokens remaining.`)
    },
    onError(error) {
      toast.error(error?.message || "No freeze tokens available")
    },
  })
}

export function useInvitePartner() {
  return useMutation({
    mutationFn: (email: string) => invitePartner(email),
    onSuccess(data) {
      toast.success("Invite sent! Share the token with your partner.")
      return data
    },
    onError(error) {
      toast.error(error?.message || "Failed to invite partner")
    },
  })
}

export function useAcceptPartner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (token: string) => acceptPartner(token),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["streaks"] })
      toast.success("Partner streak started!")
    },
    onError(error) {
      toast.error(error?.message || "Invalid or expired invite token")
    },
  })
}

export function useRemovePartner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removePartner,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["streaks"] })
      toast.success("Partner streak removed")
    },
    onError(error) {
      toast.error(error?.message || "Failed to remove partner")
    },
  })
}

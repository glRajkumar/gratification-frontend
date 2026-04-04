import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getCurrentIntention, setIntention } from "@/actions/intentions"

export function useCurrentIntention() {
  return useQuery({
    queryKey: ["intentions", "current"],
    queryFn: getCurrentIntention,
    staleTime: 10 * 60 * 1000,
  })
}

export function useSetIntention() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: setIntention,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["intentions"] })
      toast.success("Weekly intention saved")
    },
    onError(error) {
      toast.error(error?.message || "Failed to save intention")
    },
  })
}

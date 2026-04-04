import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getSession, signIn, signOut, signUp } from "@/actions/auth"

export const SESSION_KEY = ["session"]

export function useSession() {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: getSession,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export function useSignIn() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: signIn,
    onSuccess() {
      qc.invalidateQueries({ queryKey: SESSION_KEY })
      toast.success("Welcome back!")
    },
    onError(error) {
      toast.error(error?.message || "Sign in failed")
    },
  })
}

export function useSignUp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: signUp,
    onSuccess() {
      qc.invalidateQueries({ queryKey: SESSION_KEY })
      toast.success("Account created — welcome!")
    },
    onError(error) {
      toast.error(error?.message || "Sign up failed")
    },
  })
}

export function useSignOut() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: signOut,
    onSuccess() {
      qc.clear()
      toast.success("Signed out")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

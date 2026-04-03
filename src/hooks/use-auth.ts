import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSION_KEY }),
  })
}

export function useSignUp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) => signUp(name, email, password),
    onSuccess: () => qc.invalidateQueries({ queryKey: SESSION_KEY }),
  })
}

export function useSignOut() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => qc.clear(),
  })
}

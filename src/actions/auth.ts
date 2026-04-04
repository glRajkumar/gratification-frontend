import { authClient } from "@/lib/auth-client"

export async function getSession() {
  const { data } = await authClient.getSession()
  return data
}

export async function signIn(payload: { email: string; password: string }) {
  const { data, error } = await authClient.signIn.email(payload)
  if (error) throw new Error(error.message ?? "Sign in failed")
  return data
}

export async function signUp(payload: { name: string; email: string; password: string }) {
  const { data, error } = await authClient.signUp.email(payload)
  if (error) throw new Error(error.message ?? "Sign up failed")
  return data
}

export async function signOut() {
  const { error } = await authClient.signOut()
  if (error) throw new Error(error.message ?? "Sign out failed")
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignIn, useSession } from "@/hooks/use-auth"
import { InputWrapper } from "@/components/ui/field-wrapper-rhf"
import { Button } from "@/components/ui/button"
import { signInSchema, type SignInFormData } from "@/utils/schemas"

export const Route = createFileRoute("/sign-in")({ component: SignInPage })

function SignInPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const signInMutation = useSignIn()

  if (session) {
    navigate({ to: "/", replace: true })
    return null
  }

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(data: SignInFormData) {
    signInMutation.mutate(data, {
      onSuccess: () => navigate({ to: "/" }),
    })
  }

  return (
    <div className="flex h-svh items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Welcome back to Gratification
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <InputWrapper
            name="email"
            control={form.control}
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <InputWrapper
            name="password"
            control={form.control}
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {signInMutation.error && (
            <p className="text-sm text-destructive">
              {signInMutation.error.message}
            </p>
          )}

          <Button type="submit" disabled={signInMutation.isPending}>
            {signInMutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-4">
          No account?{" "}
          <Link to="/sign-up" className="text-foreground underline underline-offset-3">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

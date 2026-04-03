import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router"
import { useSession } from "@/hooks/use-auth"
import { AppNav } from "@/components/common/nav"

export const Route = createFileRoute("/_app")({
  component: AppLayout,
})

function AppLayout() {
  const { data: session, isLoading } = useSession()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex h-svh items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

  if (!session) {
    navigate({ to: "/sign-in", replace: true })
    return null
  }

  return (
    <div className="flex h-svh">
      <AppNav />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

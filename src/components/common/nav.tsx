import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { useSignOut } from "@/hooks/use-auth"

const links = [
  { to: "/", label: "Dashboard", icon: "◈" },
  { to: "/journal", label: "Journal", icon: "◉" },
  { to: "/todos", label: "Todos", icon: "◻" },
  { to: "/goals", label: "Goals", icon: "◎" },
  { to: "/habits", label: "Habits", icon: "◐" },
  { to: "/analytics", label: "Analytics", icon: "◆" },
  { to: "/achievements", label: "Achievements", icon: "◑" },
  { to: "/categories", label: "Categories", icon: "◧" },
  { to: "/settings", label: "Settings", icon: "⊙" },
]

export function AppNav() {
  const signOutMutation = useSignOut()

  return (
    <nav className="flex w-52 shrink-0 flex-col gap-1 border-r bg-muted/30 p-3">
      <p className="px-2 py-3 text-sm font-semibold tracking-tight">
        Gratification
      </p>
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              "[&.active]:bg-accent [&.active]:text-accent-foreground [&.active]:font-medium",
            )}
          >
            <span className="text-base leading-none">{icon}</span>
            {label}
          </Link>
        ))}
      </div>
      <button
        onClick={() => signOutMutation.mutate()}
        disabled={signOutMutation.isPending}
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground mt-auto"
      >
        <span className="text-base leading-none">→</span>
        {signOutMutation.isPending ? "Signing out…" : "Sign out"}
      </button>
    </nav>
  )
}

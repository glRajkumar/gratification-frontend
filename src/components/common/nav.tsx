import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

const links = [
  { to: "/", label: "Dashboard", icon: "◈" },
  { to: "/journal", label: "Journal", icon: "◉" },
  { to: "/todos", label: "Todos", icon: "◻" },
  { to: "/goals", label: "Goals", icon: "◎" },
  { to: "/categories", label: "Categories", icon: "◈" },
]

export function AppNav() {
  return (
    <nav className="flex w-52 shrink-0 flex-col gap-1 border-r bg-muted/30 p-3">
      <p className="px-2 py-3 text-sm font-semibold tracking-tight">
        Gratification
      </p>
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
    </nav>
  )
}

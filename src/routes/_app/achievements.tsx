import { createFileRoute } from "@tanstack/react-router"
import { useAchievements } from "@/hooks/use-achievements"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_app/achievements")({
  component: AchievementsPage,
})

function AchievementsPage() {
  const { data: achievements = [], isLoading } = useAchievements()

  if (isLoading)
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>

  const unlocked = achievements.filter((a) => a.unlocked)
  const locked = achievements.filter((a) => !a.unlocked)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Achievements</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {unlocked.length} of {achievements.length} unlocked
        </p>
      </div>

      {unlocked.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Unlocked
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {unlocked.map((a) => (
              <div
                key={a.type}
                className="rounded-lg border bg-emerald-500/5 border-emerald-500/20 px-4 py-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-sm font-medium">{a.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.description}</p>
                {a.unlockedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(a.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {locked.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Locked
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {locked.map((a) => (
              <div
                key={a.type}
                className={cn(
                  "rounded-lg border px-4 py-3 opacity-50",
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl grayscale">{a.icon}</span>
                  <span className="text-sm font-medium">{a.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

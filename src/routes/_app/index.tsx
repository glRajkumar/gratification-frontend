import { createFileRoute, Link } from "@tanstack/react-router"
import { useDailyScore, useJournalPoints, useOnThisDay } from "@/hooks/use-journal"
import { useGoals } from "@/hooks/use-goals"
import { useTodos } from "@/hooks/use-todos"
import { useStreaks } from "@/hooks/use-streaks"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_app/")({ component: Dashboard })

const today = new Date().toISOString().slice(0, 10)

function Dashboard() {
  const { data: score } = useDailyScore(today)
  const { data: todayPoints = [] } = useJournalPoints({ date: today })
  const { data: activeGoals = [] } = useGoals({ status: "active" })
  const { data: pendingTodos = [] } = useTodos({ status: "pending" })
  const { data: streaks } = useStreaks()
  const { data: onThisDay = [] } = useOnThisDay()

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <span
              className={cn(
                "text-5xl font-bold tabular-nums",
                score && score.score > 0
                  ? "text-emerald-500"
                  : score && score.score < 0
                    ? "text-red-500"
                    : "text-foreground",
              )}
            >
              {score ? (score.score > 0 ? `+${score.score}` : score.score) : "0"}
            </span>
            <span className="text-sm text-muted-foreground">today's score</span>
          </div>
          {score && (
            <p className="text-xs text-muted-foreground mt-1">
              {score.count} journal {score.count === 1 ? "entry" : "entries"} logged
            </p>
          )}
        </div>

        {streaks && streaks.currentStreak > 0 && (
          <div className="flex flex-col items-center rounded-lg border px-3 py-2 shrink-0">
            <span className="text-2xl font-bold tabular-nums text-amber-500">
              {streaks.currentStreak}
            </span>
            <span className="text-xs text-muted-foreground">day streak</span>
            {streaks.nextMilestone && (
              <span className="text-xs text-muted-foreground mt-0.5">
                → {streaks.nextMilestone}
              </span>
            )}
          </div>
        )}
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Today's Journal</h2>
          <Link
            to="/journal"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </div>
        {todayPoints.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No entries yet.{" "}
            <Link to="/journal/new" className="underline hover:text-foreground">
              Add one
            </Link>
          </p>
        ) : (
          <div className="space-y-2">
            {todayPoints.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                to="/journal/$id"
                params={{ id: p.id }}
                className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
              >
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0",
                    p.tag === "positive"
                      ? "bg-emerald-500"
                      : p.tag === "negative"
                        ? "bg-red-500"
                        : "bg-muted-foreground",
                  )}
                />
                <span className="flex-1 truncate">{p.title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {p.tag === "positive"
                    ? `+${p.score}`
                    : p.tag === "negative"
                      ? `-${p.score}`
                      : "0"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {onThisDay.length > 0 && (
        <section>
          <h2 className="text-sm font-medium mb-3">On This Day</h2>
          <div className="space-y-3">
            {onThisDay.slice(0, 2).map((group) => (
              <div key={group.year}>
                <p className="text-xs text-muted-foreground mb-1.5">
                  {group.year} ({new Date().getFullYear() - group.year} year
                  {new Date().getFullYear() - group.year !== 1 ? "s" : ""} ago)
                </p>
                <div className="space-y-1.5">
                  {group.points.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      to="/journal/$id"
                      params={{ id: p.id }}
                      className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm hover:bg-accent"
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full shrink-0",
                          p.tag === "positive"
                            ? "bg-emerald-500"
                            : p.tag === "negative"
                              ? "bg-red-500"
                              : "bg-muted-foreground",
                        )}
                      />
                      <span className="flex-1 truncate">{p.title}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {p.tag === "positive"
                          ? `+${p.score}`
                          : p.tag === "negative"
                            ? `-${p.score}`
                            : "0"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-4">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Active Goals</h2>
            <Link
              to="/goals"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          {activeGoals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active goals.</p>
          ) : (
            <div className="space-y-1.5">
              {activeGoals.slice(0, 4).map((g) => (
                <div key={g.id} className="rounded-lg border px-3 py-2 text-sm">
                  <p className="truncate">{g.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {g.period} · target {g.targetCount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Pending Todos</h2>
            <Link
              to="/todos"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all →
            </Link>
          </div>
          {pendingTodos.length === 0 ? (
            <p className="text-sm text-muted-foreground">All caught up!</p>
          ) : (
            <div className="space-y-1.5">
              {pendingTodos.slice(0, 4).map((t) => (
                <div key={t.id} className="rounded-lg border px-3 py-2 text-sm">
                  <p className="truncate">{t.title}</p>
                  {t.dueDate && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Due {t.dueDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

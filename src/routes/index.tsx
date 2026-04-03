import { createFileRoute, Link } from "@tanstack/react-router"
import { useDailyScore, useJournalPoints } from "@/hooks/use-journal"
import { useGoals } from "@/hooks/use-goals"
import { useTodos } from "@/hooks/use-todos"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/")({ component: Dashboard })

const today = new Date().toISOString().slice(0, 10)

function Dashboard() {
  const { data: score } = useDailyScore(today)
  const { data: todayPoints = [] } = useJournalPoints({ date: today })
  const { data: activeGoals = [] } = useGoals({ status: "active" })
  const { data: pendingTodos = [] } = useTodos({ status: "pending" })

  return (
    <div className="p-6 space-y-6 max-w-3xl">
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
            <Link
              to="/journal/new"
              className="underline hover:text-foreground"
            >
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
                <div
                  key={g.id}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
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
                <div
                  key={t.id}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
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

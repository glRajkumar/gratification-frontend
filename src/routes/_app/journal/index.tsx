import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useJournalPoints, useDailyScore } from "@/hooks/use-journal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_app/journal/")({ component: JournalPage })

type View = "day" | "week" | "month"

function getWeekStr(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
      7,
    )
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`
}

function getMonthStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function JournalPage() {
  const [view, setView] = useState<View>("day")
  const [offset, setOffset] = useState(0)

  const now = new Date()
  const refDate = new Date(now)
  if (view === "day") refDate.setDate(now.getDate() - offset)
  else if (view === "week") refDate.setDate(now.getDate() - offset * 7)
  else refDate.setMonth(now.getMonth() - offset)

  const dateStr = refDate.toISOString().slice(0, 10)
  const weekStr = getWeekStr(refDate)
  const monthStr = getMonthStr(refDate)

  const queryParams =
    view === "day"
      ? { date: dateStr }
      : view === "week"
        ? { week: weekStr }
        : { month: monthStr }

  const { data: points = [], isLoading } = useJournalPoints(queryParams)
  const { data: score } = useDailyScore(dateStr)

  const label =
    view === "day"
      ? offset === 0
        ? "Today"
        : refDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : view === "week"
        ? weekStr
        : refDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Journal</h1>
        <Link to="/journal/new">
          <Button size="sm">New entry</Button>
        </Link>
      </div>

      <div className="flex gap-1 mb-4">
        {(["day", "week", "month"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => {
              setView(v)
              setOffset(0)
            }}
            className={cn(
              "px-3 py-1 text-sm rounded-md transition-colors capitalize",
              view === v
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setOffset((o) => o + 1)}
          className="text-muted-foreground hover:text-foreground px-1"
        >
          ‹
        </button>
        <span className="text-sm font-medium">{label}</span>
        <button
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          className="text-muted-foreground hover:text-foreground px-1 disabled:opacity-30"
        >
          ›
        </button>
        {view === "day" && score && (
          <span
            className={cn(
              "ml-auto text-sm font-semibold tabular-nums",
              score.score > 0
                ? "text-emerald-500"
                : score.score < 0
                  ? "text-red-500"
                  : "text-muted-foreground",
            )}
          >
            Score: {score.score > 0 ? `+${score.score}` : score.score}
          </span>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : points.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No entries for this period.
        </p>
      ) : (
        <div className="space-y-2">
          {points.map((p) => (
            <Link
              key={p.id}
              to="/journal/$id"
              params={{ id: p.id }}
              className="flex items-center gap-3 rounded-lg border px-4 py-3 hover:bg-accent text-sm"
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
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.title}</p>
                {p.date !== dateStr && (
                  <p className="text-xs text-muted-foreground">{p.date}</p>
                )}
              </div>
              <span
                className={cn(
                  "tabular-nums text-xs font-medium",
                  p.tag === "positive"
                    ? "text-emerald-500"
                    : p.tag === "negative"
                      ? "text-red-500"
                      : "text-muted-foreground",
                )}
              >
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
    </div>
  )
}

import { useState, useEffect } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { toast } from "sonner"
import { useDailyScore, useJournalPoints, useOnThisDay } from "@/hooks/use-journal"
import { useGoals } from "@/hooks/use-goals"
import { useTodos } from "@/hooks/use-todos"
import { useStreaks } from "@/hooks/use-streaks"
import { useDashboardContext } from "@/hooks/use-dashboard"
import { usePersonalityLabel, useScoreMilestones } from "@/hooks/use-personality"
import { useCurrentIntention } from "@/hooks/use-intentions"
import { useChallengeToday } from "@/hooks/use-challenges"
import { useSettings } from "@/hooks/use-settings"
import { QuickEntryDialog } from "@/components/common/quick-entry-dialog"
import { CompanionWidget } from "@/components/common/companion-widget"
import { MilestoneCelebration } from "@/components/common/milestone-celebration"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_app/")({ component: Dashboard })

const today = new Date().toISOString().slice(0, 10)
const dayOfWeek = new Date().getDay()

function Dashboard() {
  const [quickEntryOpen, setQuickEntryOpen] = useState(false)
  const [celebratingMilestone, setCelebratingMilestone] = useState<string | null>(null)

  const { data: score } = useDailyScore(today)
  const { data: todayPoints = [] } = useJournalPoints({ date: today })
  const { data: activeGoals = [] } = useGoals({ status: "active" })
  const { data: pendingTodos = [] } = useTodos({ status: "pending" })
  const { data: streaks } = useStreaks()
  const { data: onThisDay = [] } = useOnThisDay()
  const { data: context } = useDashboardContext()
  const { data: personality } = usePersonalityLabel()
  const { data: milestonesData } = useScoreMilestones()
  const { data: intention } = useCurrentIntention()
  const { data: challenge } = useChallengeToday()
  const { data: settings } = useSettings()

  // Score floor celebration (Phase 17.3)
  useEffect(() => {
    if (context?.scoreFloor?.improved) {
      toast.info(
        `Your floor is rising. Worst day this month (${context.scoreFloor.thisMonthWorst > 0 ? "+" : ""}${context.scoreFloor.thisMonthWorst}) was better than last month (${context.scoreFloor.lastMonthWorst > 0 ? "+" : ""}${context.scoreFloor.lastMonthWorst}).`,
        { duration: 8000 },
      )
    }
  }, [context?.scoreFloor])

  // Score milestone celebrations (Phase 15.4)
  useEffect(() => {
    if (milestonesData?.newMilestones?.length) {
      const first = milestonesData.newMilestones[0]
      setCelebratingMilestone(first.type)
    }
  }, [milestonesData?.newMilestones])

  const strengthPercent = streaks?.strengthPercent ?? 100
  const streakDimmed = strengthPercent < 100

  // Streak milestone check for celebrations (Phase 16.5)
  useEffect(() => {
    if (!streaks) return
    const milestones = [7, 14, 30, 60, 100, 365]
    const reached = milestones.find((m) => streaks.currentStreak === m)
    if (reached) {
      const key = `streak_celebrated_${reached}`
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1")
        setCelebratingMilestone(`streak_${reached}`)
      }
    }
  }, [streaks?.currentStreak])

  // Monday weekly intention (Phase 19.4)
  const isMonday = dayOfWeek === 1
  const showIntentionPrompt = isMonday && settings?.weeklyIntentionEnabled && !intention

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Milestone celebration overlay */}
      {celebratingMilestone && (
        <MilestoneCelebration
          type={celebratingMilestone}
          onDone={() => setCelebratingMilestone(null)}
        />
      )}

      {/* Quick entry dialog */}
      <QuickEntryDialog
        open={quickEntryOpen}
        onOpenChange={setQuickEntryOpen}
        date={today}
      />

      {/* Contextual greeting (Phase 17.4) */}
      {context?.greeting && (
        <p className="text-sm text-muted-foreground">{context.greeting}</p>
      )}

      {/* Score + streak + quick entry */}
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
          <div className="flex gap-2 mt-3">
            <Link
              to="/journal/new"
              className="text-xs border border-border rounded-md px-3 py-1.5 hover:bg-accent"
            >
              + New entry
            </Link>
            <button
              onClick={() => setQuickEntryOpen(true)}
              className="text-xs border border-border rounded-md px-3 py-1.5 hover:bg-accent"
            >
              ◦ Quick score
            </button>
          </div>
        </div>

        {/* Streak badge with gradual decay (Phase 16.1) */}
        {streaks && streaks.currentStreak > 0 && (
          <div
            className={cn(
              "flex flex-col items-center rounded-lg border px-3 py-2 shrink-0 transition-opacity",
              streakDimmed && "opacity-60",
            )}
          >
            <span
              className={cn(
                "text-2xl font-bold tabular-nums",
                strengthPercent === 100
                  ? "text-amber-500"
                  : strengthPercent === 80
                    ? "text-amber-400"
                    : "text-amber-300",
              )}
            >
              {streaks.currentStreak}
            </span>
            <span className="text-xs text-muted-foreground">
              {streakDimmed ? `${strengthPercent}% strength` : "day streak"}
            </span>
            {streaks.nextMilestone && (
              <span className="text-xs text-muted-foreground mt-0.5">
                → {streaks.nextMilestone}
              </span>
            )}
            {streaks.freezeTokens > 0 && (
              <span className="text-xs text-blue-400 mt-0.5">
                {streaks.freezeTokens}× freeze
              </span>
            )}
          </div>
        )}
      </div>

      {/* Score streak badge (Phase 16.2) */}
      {streaks && streaks.currentScoreStreak > 1 && (
        <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 px-4 py-2 flex items-center gap-3">
          <span className="text-violet-400 text-lg">◈</span>
          <div>
            <p className="text-sm font-medium">
              {streaks.currentScoreStreak}-day score streak
            </p>
            <p className="text-xs text-muted-foreground">
              Above your {streaks.avg30 > 0 ? "+" : ""}{streaks.avg30} average for {streaks.currentScoreStreak} days running
            </p>
          </div>
        </div>
      )}

      {/* Partner streak (Phase 16.4) */}
      {streaks?.partner && (
        <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sky-400 text-lg">⊕</span>
            <div>
              <p className="text-sm font-medium">
                Partner streak · {streaks.partner.currentStreak} days
              </p>
              <p className="text-xs text-muted-foreground">
                with {streaks.partner.partnerName}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              streaks.partner.partnerLoggedToday
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-muted text-muted-foreground",
            )}
          >
            {streaks.partner.partnerLoggedToday ? "Logged today" : "Not yet"}
          </span>
        </div>
      )}

      {/* Personality label (Phase 15.1) */}
      {personality && (
        <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
            You are
          </span>
          <div>
            <Link
              to="/wrapped"
              className="text-sm font-semibold hover:text-primary"
            >
              {personality.label}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {personality.description}
            </p>
          </div>
        </div>
      )}

      {/* Companion widget (Phase 20) */}
      <CompanionWidget
        avg7={context?.avg7 ?? 0}
        totalEntries={score?.count ?? 0}
        daysSinceEntry={context?.daysSinceEntry ?? 0}
        companionName={settings?.companionName ?? null}
      />

      {/* Weekly intention (Phase 19.4) — Monday prompt */}
      {showIntentionPrompt && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <p className="text-sm font-medium text-amber-400 mb-1">It's Monday</p>
          <p className="text-xs text-muted-foreground mb-3">
            Set a weekly intention to anchor the week.
          </p>
          <Link
            to="/intentions"
            className="text-xs border border-amber-500/30 text-amber-400 rounded-md px-3 py-1.5 hover:bg-amber-500/10"
          >
            Set intention →
          </Link>
        </div>
      )}

      {/* Current week intention display */}
      {intention && (
        <div className="rounded-lg border border-border px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1">This week's intention</p>
          <p className="text-sm">{intention.intention}</p>
          {intention.targetScore !== null && (
            <p className="text-xs text-muted-foreground mt-1">
              Target avg: {intention.targetScore > 0 ? "+" : ""}{intention.targetScore}
            </p>
          )}
        </div>
      )}

      {/* Daily challenge prompt (Phase 19.2) */}
      {challenge && !challenge.completed && (
        <div className="rounded-lg border border-border px-4 py-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              {challenge.category} challenge
            </p>
            <p className="text-sm">{challenge.prompt}</p>
          </div>
          <Link
            to="/challenges"
            className="text-xs border border-border rounded-md px-2.5 py-1 hover:bg-accent shrink-0"
          >
            Go →
          </Link>
        </div>
      )}

      {/* Today's Journal */}
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
            {" "}or{" "}
            <button
              onClick={() => setQuickEntryOpen(true)}
              className="underline hover:text-foreground"
            >
              quick score
            </button>
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
                <span className="flex-1 truncate">
                  {p.isQuick ? <span className="italic text-muted-foreground">{p.title}</span> : p.title}
                </span>
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

      {/* On This Day */}
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

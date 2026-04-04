import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Cell,
} from "recharts"
import {
  useScoreHistory,
  useHeatmap,
  useWeeklySummary,
  useCategoryBreakdown,
  useCorrelations,
  useCommunityStats,
} from "@/hooks/use-analytics"
import { useStreaks } from "@/hooks/use-streaks"
import { usePercentile } from "@/hooks/use-personality"
import { ScoreCard } from "@/components/common/score-card"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
})

const DAYS_OPTIONS = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "1y", value: 365 },
]

function scoreColor(score: number) {
  if (score > 0) return "#10b981"
  if (score < 0) return "#ef4444"
  return "#94a3b8"
}

function heatmapColor(score: number) {
  if (score === 0) return "bg-muted"
  if (score >= 10) return "bg-emerald-600"
  if (score >= 5) return "bg-emerald-500"
  if (score > 0) return "bg-emerald-300"
  if (score <= -10) return "bg-red-600"
  if (score <= -5) return "bg-red-500"
  return "bg-red-300"
}

function ScoreHistorySection() {
  const [days, setDays] = useState(30)
  const { data, isLoading } = useScoreHistory(days)

  const chartData = data
    ? data.data.map((d, i) => ({
        date: d.date.slice(5),
        score: d.score,
        avg: data.rollingAvg[i]?.avg ?? 0,
      }))
    : []

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Score History</h2>
        <div className="flex gap-1">
          {DAYS_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setDays(o.value)}
              className={cn(
                "px-2 py-0.5 rounded text-xs font-medium transition-colors",
                days === o.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart
            data={chartData}
            margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(chartData.length / 6)}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--background))",
              }}
            />
            <Bar dataKey="score" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={scoreColor(entry.score)} />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#6366f1"
              dot={false}
              strokeWidth={1.5}
              name="7d avg"
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}

function HeatmapSection() {
  const year = new Date().getFullYear()
  const { data = [], isLoading } = useHeatmap(year)

  const scoreMap = new Map(data.map((d) => [d.date, d.score]))

  const startDate = new Date(`${year}-01-01`)
  const startDow = (startDate.getDay() + 6) % 7 // Mon=0
  const daysInYear =
    (new Date(year, 11, 31).getTime() - startDate.getTime()) /
      86400000 +
    1

  const cells: { date: string; score: number }[] = []
  for (let i = 0; i < startDow; i++) cells.push({ date: "", score: 0 })
  for (let i = 0; i < daysInYear; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    cells.push({ date: dateStr, score: scoreMap.get(dateStr) ?? 0 })
  }

  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium">Year in Pixels — {year}</h2>
      {isLoading ? (
        <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-0.5 min-w-max">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    title={cell.date ? `${cell.date}: ${cell.score > 0 ? "+" : ""}${cell.score}` : ""}
                    className={cn(
                      "size-3 rounded-sm",
                      !cell.date
                        ? "opacity-0"
                        : cell.score === 0
                          ? "bg-muted"
                          : heatmapColor(cell.score),
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              <div className="size-3 rounded-sm bg-muted" />
              <span className="text-xs text-muted-foreground">No entries</span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <div className="size-3 rounded-sm bg-emerald-300" />
              <div className="size-3 rounded-sm bg-emerald-500" />
              <div className="size-3 rounded-sm bg-emerald-600" />
              <span className="text-xs text-muted-foreground">Positive</span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <div className="size-3 rounded-sm bg-red-300" />
              <div className="size-3 rounded-sm bg-red-500" />
              <div className="size-3 rounded-sm bg-red-600" />
              <span className="text-xs text-muted-foreground">Negative</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function CategorySection() {
  const { data = [], isLoading } = useCategoryBreakdown()

  const chartData = data.map((d) => ({
    name: `${d.categoryIcon} ${d.categoryName}`,
    score: d.score,
    fill: d.score >= 0 ? "#10b981" : "#ef4444",
  }))

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium">Category Breakdown</h2>
      {isLoading ? (
        <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(120, chartData.length * 36)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="hsl(var(--border))"
            />
            <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--background))",
              }}
            />
            <Bar dataKey="score" radius={[0, 2, 2, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}

function WeeklySummarySection() {
  const { data, isLoading } = useWeeklySummary()
  const { data: streaks } = useStreaks()

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium">This Week</h2>
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : data ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{data.summary}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Week score"
              value={data.totalScore > 0 ? `+${data.totalScore}` : String(data.totalScore)}
              highlight={data.totalScore > 0}
              negative={data.totalScore < 0}
            />
            <StatCard
              label="vs last week"
              value={
                data.scoreVsPrevWeek > 0
                  ? `+${data.scoreVsPrevWeek}`
                  : String(data.scoreVsPrevWeek)
              }
              highlight={data.scoreVsPrevWeek > 0}
              negative={data.scoreVsPrevWeek < 0}
            />
            <StatCard label="Todos done" value={String(data.todosCompleted)} />
            <StatCard
              label="Current streak"
              value={streaks ? `${streaks.currentStreak}d` : "—"}
            />
          </div>
          {(data.bestDay || data.worstDay) && (
            <div className="grid grid-cols-2 gap-3">
              {data.bestDay && (
                <div className="rounded-lg border px-3 py-2">
                  <p className="text-xs text-muted-foreground">Best day</p>
                  <p className="text-sm font-medium">
                    {data.bestDay.date}{" "}
                    <span className="text-emerald-500">+{data.bestDay.score}</span>
                  </p>
                </div>
              )}
              {data.worstDay && data.worstDay.score < 0 && (
                <div className="rounded-lg border px-3 py-2">
                  <p className="text-xs text-muted-foreground">Worst day</p>
                  <p className="text-sm font-medium">
                    {data.worstDay.date}{" "}
                    <span className="text-red-500">{data.worstDay.score}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}

function CorrelationsSection() {
  const { data = [], isLoading } = useCorrelations(30)

  if (isLoading) return null
  if (data.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium">Score Correlations</h2>
      <p className="text-xs text-muted-foreground">
        How each category affects your daily score (last 30 days).
      </p>
      <div className="space-y-2">
        {data.map((c) => (
          <div key={c.categoryId} className="flex items-center gap-3 rounded-lg border px-3 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.categoryName}</p>
              <p className="text-xs text-muted-foreground">
                {c.daysWithCategory} days · avg{" "}
                {c.avgScoreWithCategory > 0 ? "+" : ""}
                {c.avgScoreWithCategory}
              </p>
            </div>
            <span
              className={cn(
                "text-sm font-medium tabular-nums",
                c.percentDiff > 0 ? "text-emerald-500" : "text-red-500",
              )}
            >
              {c.percentDiff > 0 ? "+" : ""}
              {c.percentDiff}%
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatCard({
  label,
  value,
  highlight,
  negative,
}: {
  label: string
  value: string
  highlight?: boolean
  negative?: boolean
}) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-lg font-bold tabular-nums",
          highlight && "text-emerald-500",
          negative && "text-red-500",
        )}
      >
        {value}
      </p>
    </div>
  )
}

function CommunitySection() {
  const { data, isLoading } = useCommunityStats()
  const { data: percentile } = usePercentile()

  if (isLoading) return null

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium">Community</h2>
      <div className="grid grid-cols-2 gap-3">
        {percentile?.percentile !== null && percentile?.percentile !== undefined && (
          <div className="rounded-lg border px-3 py-2 col-span-2">
            <p className="text-xs text-muted-foreground">Your percentile</p>
            <p className="text-lg font-bold tabular-nums">
              Top{" "}
              <span className="text-primary">{100 - percentile.percentile}%</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Your avg ({percentile.userAvg > 0 ? "+" : ""}
              {percentile.userAvg}) is higher than {percentile.percentile}% of users
              this month
            </p>
          </div>
        )}
        {data && (
          <>
            <StatCard
              label="Community avg this week"
              value={data.weekAvgScore > 0 ? `+${data.weekAvgScore}` : String(data.weekAvgScore)}
              highlight={data.weekAvgScore > 0}
            />
            {data.topPositiveCategory && (
              <div className="rounded-lg border px-3 py-2">
                <p className="text-xs text-muted-foreground">Top category this week</p>
                <p className="text-sm font-medium">{data.topPositiveCategory}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function ShareSection() {
  const today = new Date().toISOString().slice(0, 10)
  const { data: scoreHistory } = useScoreHistory(7)

  const todayScore = scoreHistory?.data.find((d) => d.date === today)?.score ?? 0
  const weekAvg =
    scoreHistory && scoreHistory.data.length > 0
      ? Math.round(
          (scoreHistory.data.reduce((a, b) => a + b.score, 0) / scoreHistory.data.length) * 10,
        ) / 10
      : 0

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium">Share Your Score</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ScoreCard
          type="day"
          title={`Score · ${today}`}
          score={todayScore > 0 ? `+${todayScore}` : todayScore}
          subtitle="Today"
        />
        <ScoreCard
          type="week"
          title="7-Day Score"
          score={weekAvg > 0 ? `+${weekAvg}` : weekAvg}
          subtitle={`avg over ${scoreHistory?.data.length ?? 0} days`}
          graphData={scoreHistory?.data}
        />
      </div>
    </section>
  )
}

function AnalyticsPage() {
  return (
    <div className="p-6 max-w-3xl space-y-8">
      <h1 className="text-lg font-semibold">Analytics</h1>
      <WeeklySummarySection />
      <ScoreHistorySection />
      <HeatmapSection />
      <CommunitySection />
      <CategorySection />
      <CorrelationsSection />
      <ShareSection />
    </div>
  )
}

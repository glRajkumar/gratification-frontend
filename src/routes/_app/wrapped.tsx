import { useState, useRef } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { useWrapped, usePercentile } from "@/hooks/use-personality"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_app/wrapped")({ component: WrappedPage })

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

function currentMonthStr() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

function previousMonthStr() {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`
}

function friendlyMonth(monthStr: string) {
  const [year, mon] = monthStr.split("-")
  return `${MONTHS[parseInt(mon) - 1]} ${year}`
}

function WrappedPage() {
  const [month, setMonth] = useState(previousMonthStr())
  const [card, setCard] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useWrapped(month)
  const { data: percentile } = usePercentile()

  const totalCards = data && !data.empty ? 8 : 0

  function goNext() { setCard((c) => Math.min(c + 1, totalCards - 1)) }
  function goPrev() { setCard((c) => Math.max(c - 1, 0)) }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Loading your Wrapped…</div>
    )
  }

  if (!data || data.empty) {
    return (
      <div className="p-6 max-w-xl space-y-4">
        <h1 className="text-xl font-bold">Gratification Wrapped</h1>
        <MonthSelector value={month} onChange={setMonth} />
        <p className="text-muted-foreground">No entries found for {friendlyMonth(month)}.</p>
      </div>
    )
  }

  const cards = [
    // Card 0: Month score
    <WrappedCard key="score" title={`Your ${friendlyMonth(month)} Score`}>
      <div className="text-center space-y-2">
        <p
          className={cn(
            "text-7xl font-bold tabular-nums",
            (data.totalScore ?? 0) > 0
              ? "text-emerald-400"
              : (data.totalScore ?? 0) < 0
                ? "text-red-400"
                : "text-foreground",
          )}
        >
          {(data.totalScore ?? 0) > 0 ? `+${data.totalScore}` : data.totalScore}
        </p>
        <p className="text-muted-foreground">total score for the month</p>
      </div>
    </WrappedCard>,

    // Card 1: Best day
    <WrappedCard key="best" title="Your Best Day">
      {data.bestDay ? (
        <div className="text-center space-y-2">
          <p className="text-emerald-400 text-5xl font-bold">+{data.bestDay.score}</p>
          <p className="text-sm">{new Date(data.bestDay.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          {data.bestDay.title && (
            <p className="text-muted-foreground text-sm italic">"{data.bestDay.title}"</p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No best day data.</p>
      )}
    </WrappedCard>,

    // Card 2: Worst day
    <WrappedCard key="worst" title="Your Toughest Day">
      {data.worstDay ? (
        <div className="text-center space-y-2">
          <p className="text-red-400 text-5xl font-bold">{data.worstDay.score}</p>
          <p className="text-sm">{new Date(data.worstDay.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          {data.worstDay.title && (
            <p className="text-muted-foreground text-sm italic">"{data.worstDay.title}"</p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No data.</p>
      )}
    </WrappedCard>,

    // Card 3: Personality label
    <WrappedCard key="label" title="Your Personality">
      <div className="text-center space-y-3">
        <p className="text-4xl font-bold text-primary">{data.personalityLabel}</p>
        <p className="text-muted-foreground text-sm">Your score pattern this month</p>
      </div>
    </WrappedCard>,

    // Card 4: Top category
    <WrappedCard key="category" title="Top Category">
      {data.topCategory ? (
        <div className="text-center space-y-3">
          <p className="text-5xl">{data.topCategory.icon}</p>
          <p className="text-2xl font-bold" style={{ color: data.topCategory.color }}>
            {data.topCategory.name}
          </p>
          <p className="text-muted-foreground text-sm">drove the most score this month</p>
        </div>
      ) : (
        <p className="text-muted-foreground">No category data.</p>
      )}
    </WrappedCard>,

    // Card 5: Entries & reflections
    <WrappedCard key="entries" title="Your Activity">
      <div className="space-y-4 w-full">
        {[
          { label: "Full entries", value: data.entriesLogged ?? 0 },
          { label: "Quick entries", value: data.quickEntries ?? 0 },
          { label: "Reflections added", value: data.reflectionsAdded ?? 0 },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-lg font-bold tabular-nums">{value}</span>
          </div>
        ))}
      </div>
    </WrappedCard>,

    // Card 6: Streak peak
    <WrappedCard key="streak" title="Streak Peak">
      <div className="text-center space-y-2">
        <p className="text-amber-400 text-6xl font-bold">{data.streakPeak}</p>
        <p className="text-muted-foreground">day streak peak this month</p>
      </div>
    </WrappedCard>,

    // Card 7: Score graph
    <WrappedCard key="graph" title={`${friendlyMonth(month)} — Day by Day`}>
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.graphData ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              formatter={(v: number) => [v > 0 ? `+${v}` : v, "Score"]}
              labelFormatter={(l: string) =>
                new Date(l).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="score" radius={[2, 2, 0, 0]}>
              {(data.graphData ?? []).map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.score > 0 ? "#10b981" : entry.score < 0 ? "#ef4444" : "#94a3b8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {percentile?.percentile !== null && percentile?.percentile !== undefined && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Your avg ({percentile.userAvg > 0 ? "+" : ""}{percentile.userAvg}) is higher than{" "}
          <span className="font-semibold text-foreground">{percentile.percentile}%</span> of users
        </p>
      )}
    </WrappedCard>,
  ]

  return (
    <div className="p-6 max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Gratification Wrapped</h1>
        <MonthSelector value={month} onChange={(m) => { setMonth(m); setCard(0) }} />
      </div>

      {/* Card carousel */}
      <div ref={cardRef} className="relative">
        {cards[card]}

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={goPrev}
            disabled={card === 0}
            className="text-xs border border-border rounded-md px-3 py-1.5 disabled:opacity-30 hover:bg-accent"
          >
            ← Back
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setCard(i)}
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i === card ? "bg-foreground" : "bg-muted-foreground/30",
                )}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={card === totalCards - 1}
            className="text-xs border border-border rounded-md px-3 py-1.5 disabled:opacity-30 hover:bg-accent"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

function WrappedCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 min-h-64 flex flex-col items-center justify-center space-y-6">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">{title}</p>
      {children}
    </div>
  )
}

function MonthSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (m: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs border border-border rounded-md px-2 py-1 bg-background"
    >
      {Array.from({ length: 12 }, (_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - i - 1)
        const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        return (
          <option key={str} value={str}>
            {friendlyMonth(str)}
          </option>
        )
      })}
    </select>
  )
}

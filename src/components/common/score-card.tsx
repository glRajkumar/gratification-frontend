import { useRef } from "react"

export type ScoreCardType = "day" | "week" | "month" | "streak" | "milestone"

interface ScoreCardProps {
  type: ScoreCardType
  title: string
  score: number | string
  subtitle?: string
  label?: string
  color?: string
  graphData?: { date: string; score: number }[]
}

export function ScoreCard({
  type,
  title,
  score,
  subtitle,
  label,
  color,
  graphData,
}: ScoreCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  async function exportPng() {
    const el = cardRef.current
    if (!el) return

    try {
      const { default: html2canvas } = await import("html2canvas")
      const canvas = await html2canvas(el, { backgroundColor: "#09090b", scale: 2 })
      const link = document.createElement("a")
      link.download = `gratification-${type}-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch {
      await navigator.clipboard.writeText(
        `Gratification | ${title}: ${score}${subtitle ? ` — ${subtitle}` : ""}${label ? ` | ${label}` : ""}`,
      )
    }
  }

  const scoreNum = typeof score === "number" ? score : null
  const scoreColor =
    color ??
    (scoreNum !== null
      ? scoreNum > 0
        ? "#10b981"
        : scoreNum < 0
          ? "#ef4444"
          : "#94a3b8"
      : "#94a3b8")

  const maxVal = graphData ? Math.max(...graphData.map((d) => Math.abs(d.score)), 1) : 1

  return (
    <div className="space-y-2">
      <div
        ref={cardRef}
        className="rounded-xl border border-border bg-zinc-950 p-6 space-y-3 font-mono select-none"
        style={{ minWidth: 280 }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Gratification</p>
          <p className="text-xs text-zinc-600">{type}</p>
        </div>
        <p className="text-xs text-zinc-400">{title}</p>
        <p
          className="text-5xl font-bold tabular-nums"
          style={{ color: scoreColor }}
        >
          {typeof score === "number" && score > 0 ? `+${score}` : score}
        </p>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}

        {/* Mini sparkline */}
        {graphData && graphData.length > 0 && (
          <div className="flex items-end gap-px h-8 mt-2">
            {graphData.map((d, i) => {
              const h = Math.max(2, Math.round((Math.abs(d.score) / maxVal) * 32))
              const col =
                d.score > 0 ? "#10b981" : d.score < 0 ? "#ef4444" : "#334155"
              return (
                <div
                  key={i}
                  style={{ height: h, backgroundColor: col, flex: 1, borderRadius: 2 }}
                />
              )
            })}
          </div>
        )}

        {label && (
          <p className="text-xs text-zinc-400 pt-1 border-t border-zinc-800">
            {label}
          </p>
        )}
      </div>

      <button
        onClick={exportPng}
        className="text-xs border border-border rounded-md px-3 py-1.5 hover:bg-accent w-full"
      >
        Save as image
      </button>
    </div>
  )
}

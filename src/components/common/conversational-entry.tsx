import { useState } from "react"
import { cn } from "@/lib/utils"
import { useCreateJournalPoint } from "@/hooks/use-journal"

type Step = 0 | 1 | 2 | 3 | 4

const MOODS = [
  { value: 1, emoji: "😔", label: "Rough" },
  { value: 2, emoji: "😕", label: "Meh" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
]

interface ConversationalEntryProps {
  date: string
  onDone: () => void
  onExpand: () => void
}

export function ConversationalEntry({ date, onDone, onExpand }: ConversationalEntryProps) {
  const [step, setStep] = useState<Step>(0)
  const [mood, setMood] = useState<number | null>(null)
  const [impact, setImpact] = useState("")
  const [tag, setTag] = useState<"positive" | "negative" | "neutral">("positive")
  const [score, setScore] = useState(5)
  const { mutate: create, isPending } = useCreateJournalPoint()

  function handleSubmit() {
    if (!impact.trim()) return
    create(
      {
        title: impact.slice(0, 120),
        date,
        score,
        tag,
        mood: mood ?? undefined,
      },
      { onSuccess: onDone },
    )
  }

  return (
    <div className="space-y-6">
      {/* Step 0: Mood */}
      {step >= 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">How was your day?</p>
          <div className="flex gap-3">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => { setMood(m.value); if (step === 0) setStep(1) }}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 rounded-lg border py-2.5 text-xs transition-colors",
                  mood === m.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent",
                )}
              >
                <span className="text-xl">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Impact */}
      {step >= 1 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">What made the biggest impact today?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="A moment, event, or feeling…"
              className="flex-1 text-sm border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              onKeyDown={(e) => e.key === "Enter" && impact.trim() && setStep(2)}
              autoFocus
            />
            {impact.trim() && (
              <button
                onClick={() => setStep(2)}
                className="text-xs border border-border rounded-md px-3 hover:bg-accent"
              >
                Next
              </button>
            )}
          </div>
          <button
            onClick={onExpand}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Tell me more → Full form
          </button>
        </div>
      )}

      {/* Step 2: Tag */}
      {step >= 2 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Was that impact positive or negative?</p>
          <div className="flex gap-2">
            {(["positive", "negative", "neutral"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTag(t); setStep(3) }}
                className={cn(
                  "flex-1 text-sm border rounded-md py-2 transition-colors",
                  tag === t
                    ? t === "positive"
                      ? "border-emerald-500 text-emerald-500"
                      : t === "negative"
                        ? "border-red-500 text-red-500"
                        : "border-muted-foreground text-muted-foreground"
                    : "border-border hover:bg-accent",
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Score */}
      {step >= 3 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">How much did it affect your day?</p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={10}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="flex-1"
            />
            <span
              className={cn(
                "text-xl font-bold tabular-nums w-10 text-right",
                tag === "positive"
                  ? "text-emerald-500"
                  : tag === "negative"
                    ? "text-red-500"
                    : "text-foreground",
              )}
            >
              {tag === "positive" ? `+${score}` : tag === "negative" ? `−${score}` : score}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending || !impact.trim()}
            className="w-full mt-2 text-sm border border-border rounded-md py-2 hover:bg-accent disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Done"}
          </button>
        </div>
      )}
    </div>
  )
}

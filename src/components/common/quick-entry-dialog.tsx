import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useQuickCreateJournalPoint } from "@/hooks/use-journal"

const TAGS = [
  { value: "positive", label: "Positive", color: "text-emerald-500 border-emerald-500" },
  { value: "negative", label: "Negative", color: "text-red-500 border-red-500" },
  { value: "neutral", label: "Neutral", color: "text-muted-foreground border-muted-foreground" },
] as const

type Tag = "positive" | "negative" | "neutral"

interface QuickEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: string
}

export function QuickEntryDialog({ open, onOpenChange, date }: QuickEntryDialogProps) {
  const [score, setScore] = useState(5)
  const [tag, setTag] = useState<Tag>("positive")
  const { mutate, isPending } = useQuickCreateJournalPoint()

  function handleSubmit() {
    mutate({ score, tag, date }, {
      onSuccess() {
        onOpenChange(false)
        setScore(5)
        setTag("positive")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="p-6 space-y-5 max-w-xs w-full">
        <div>
          <p className="text-sm font-medium mb-1">How was today?</p>
          <p className="text-xs text-muted-foreground">Rate it — takes under 5 seconds.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Score</span>
            <span
              className={cn(
                "text-2xl font-bold tabular-nums",
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
          <input
            type="range"
            min={1}
            max={10}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        <div className="flex gap-2">
          {TAGS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTag(t.value)}
              className={cn(
                "flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors",
                tag === t.value ? t.color : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </Dialog>
  )
}

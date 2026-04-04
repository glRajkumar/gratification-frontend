import { useState } from "react"
import { cn } from "@/lib/utils"
import { useUpdateSettings } from "@/hooks/use-settings"

// Entry milestones → growth stage
function getStage(totalEntries: number): { stage: string; icon: string; label: string } {
  if (totalEntries >= 301) return { stage: "flourishing", icon: "🌳", label: "Flourishing" }
  if (totalEntries >= 101) return { stage: "growing", icon: "🌿", label: "Growing" }
  if (totalEntries >= 31) return { stage: "sprout", icon: "🌱", label: "Sprout" }
  return { stage: "seedling", icon: "🌾", label: "Seedling" }
}

// Score avg → mood state
function getMoodState(avg7: number): { mood: string; description: string } {
  if (avg7 > 5) return { mood: "active", description: "thriving" }
  if (avg7 >= 2) return { mood: "calm", description: "steady" }
  return { mood: "quiet", description: "resting" }
}

interface CompanionWidgetProps {
  avg7: number
  totalEntries: number
  daysSinceEntry: number
  companionName: string | null
}

export function CompanionWidget({
  avg7,
  totalEntries,
  daysSinceEntry,
  companionName,
}: CompanionWidgetProps) {
  const [naming, setNaming] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [dismissed, setDismissed] = useState(false)
  const { mutate: updateSettings } = useUpdateSettings()

  if (dismissed) return null

  const { icon, label } = getStage(totalEntries)
  const { mood, description } = getMoodState(avg7)
  const waiting = daysSinceEntry >= 2

  function handleNameSave() {
    if (!nameInput.trim()) return
    updateSettings({ companionName: nameInput.trim() })
    setNaming(false)
  }

  const displayName = companionName ?? "your companion"

  return (
    <div className="rounded-lg border border-border px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">Companion</p>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "text-4xl transition-all duration-500",
            mood === "active" && "animate-pulse",
            waiting && "opacity-60",
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {companionName ? companionName : displayName}
            </p>
            <span className="text-xs text-muted-foreground">· {label}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {waiting
              ? "Waiting for you. No rush."
              : mood === "active"
                ? `${description} — avg ${avg7 > 0 ? "+" : ""}${avg7} this week`
                : mood === "calm"
                  ? `${description} — avg ${avg7 > 0 ? "+" : ""}${avg7} this week`
                  : "Resting — here when you're ready"}
          </p>
        </div>
        {!companionName && (
          <button
            onClick={() => setNaming(true)}
            className="text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1"
          >
            Name
          </button>
        )}
      </div>

      {naming && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Give it a name…"
            maxLength={30}
            className="flex-1 text-sm border border-border rounded-md px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
            autoFocus
          />
          <button
            onClick={handleNameSave}
            className="text-xs border border-border rounded-md px-3 py-1 hover:bg-accent"
          >
            Save
          </button>
          <button
            onClick={() => setNaming(false)}
            className="text-xs text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

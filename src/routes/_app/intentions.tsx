import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useCurrentIntention, useSetIntention } from "@/hooks/use-intentions"
import { useCategories } from "@/hooks/use-categories"

export const Route = createFileRoute("/_app/intentions")({ component: IntentionsPage })

function IntentionsPage() {
  const [editing, setEditing] = useState(false)
  const [intentionText, setIntentionText] = useState("")
  const [targetScore, setTargetScore] = useState("")
  const [focusCategoryId, setFocusCategoryId] = useState("")

  const { data: intention, isLoading } = useCurrentIntention()
  const { data: categories = [] } = useCategories()
  const { mutate: setIntention, isPending } = useSetIntention()

  function handleSave() {
    if (!intentionText.trim()) return
    setIntention(
      {
        intention: intentionText.trim(),
        targetScore: targetScore ? parseInt(targetScore) : undefined,
        focusCategoryId: focusCategoryId || undefined,
      },
      {
        onSuccess() {
          setEditing(false)
        },
      },
    )
  }

  function startEdit() {
    setIntentionText(intention?.intention ?? "")
    setTargetScore(intention?.targetScore?.toString() ?? "")
    setFocusCategoryId(intention?.focusCategoryId ?? "")
    setEditing(true)
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  }

  return (
    <div className="p-6 space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold">Weekly Intention</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set a single intention to anchor your week.
        </p>
      </div>

      {intention && !editing ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
          <p className="text-xs text-amber-400 uppercase tracking-widest">This week</p>
          <p className="text-lg leading-relaxed">{intention.intention}</p>
          {intention.targetScore !== null && (
            <p className="text-sm text-muted-foreground">
              Target avg score: {intention.targetScore > 0 ? "+" : ""}{intention.targetScore}
            </p>
          )}
          {intention.focusCategoryId && (
            <p className="text-sm text-muted-foreground">
              Focus category:{" "}
              {categories.find((c) => c.id === intention.focusCategoryId)?.name ??
                "unknown"}
            </p>
          )}
          <button
            onClick={startEdit}
            className="text-xs border border-border rounded-md px-3 py-1.5 hover:bg-accent"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">What would make this a great week?</label>
            <textarea
              value={intentionText}
              onChange={(e) => setIntentionText(e.target.value)}
              placeholder="e.g. Focus on deep work and rest by 10pm each night."
              rows={4}
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Target avg score (optional)</label>
              <input
                type="number"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                placeholder="e.g. 5"
                className="w-full text-sm border border-border rounded-md px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Focus category (optional)</label>
              <select
                value={focusCategoryId}
                onChange={(e) => setFocusCategoryId(e.target.value)}
                className="w-full text-sm border border-border rounded-md px-2 py-1.5 bg-background"
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={!intentionText.trim() || isPending}
              className="flex-1 text-sm border border-border rounded-md py-2 hover:bg-accent disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save intention"}
            </button>
            {editing && (
              <button
                onClick={() => setEditing(false)}
                className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

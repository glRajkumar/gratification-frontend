import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useChallengeToday, useChallengeHistory, useCompleteChallenge } from "@/hooks/use-challenges"
import { useCreateJournalPoint } from "@/hooks/use-journal"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/_app/challenges")({ component: ChallengesPage })

const CATEGORY_COLORS: Record<string, string> = {
  Gratitude: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  Growth: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  Relationship: "text-pink-400 border-pink-400/30 bg-pink-400/5",
  Work: "text-sky-400 border-sky-400/30 bg-sky-400/5",
  Health: "text-teal-400 border-teal-400/30 bg-teal-400/5",
  Creativity: "text-violet-400 border-violet-400/30 bg-violet-400/5",
  Reflection: "text-orange-400 border-orange-400/30 bg-orange-400/5",
}

function ChallengesPage() {
  const [journalingFor, setJournalingFor] = useState(false)
  const [entryText, setEntryText] = useState("")

  const { data: challenge, isLoading } = useChallengeToday()
  const { data: history } = useChallengeHistory()
  const { mutate: complete, isPending: completing } = useCompleteChallenge()
  const { mutate: createEntry, isPending: creating } = useCreateJournalPoint()

  const today = new Date().toISOString().slice(0, 10)
  const colorClass = challenge ? (CATEGORY_COLORS[challenge.category] ?? "text-foreground border-border bg-card") : ""

  function handleWriteAndComplete() {
    if (!challenge || !entryText.trim()) return
    createEntry(
      {
        title: challenge.prompt.slice(0, 120),
        description: entryText,
        date: today,
        score: 3,
        tag: "positive",
      },
      {
        onSuccess(entry) {
          complete({ challengeKey: challenge.key, journalPointId: entry.id })
          setJournalingFor(false)
          setEntryText("")
        },
      },
    )
  }

  function handleMarkOnly() {
    if (!challenge) return
    complete({ challengeKey: challenge.key })
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading today's challenge…</div>
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold">Daily Challenge</h1>

      {challenge && (
        <div className={cn("rounded-xl border p-6 space-y-4", colorClass)}>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-medium">
              {challenge.category}
            </span>
            <span className="text-xs text-muted-foreground">· {challenge.date}</span>
            {challenge.completed && (
              <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                Completed
              </span>
            )}
          </div>

          <p className="text-lg leading-relaxed">{challenge.prompt}</p>

          {!challenge.completed && (
            <div className="space-y-3 pt-2">
              {journalingFor ? (
                <div className="space-y-3">
                  <textarea
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    placeholder="Write your response…"
                    rows={5}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleWriteAndComplete}
                      disabled={!entryText.trim() || creating}
                      className="flex-1 text-sm border border-border rounded-md py-2 hover:bg-accent disabled:opacity-50"
                    >
                      {creating ? "Saving…" : "Save as journal entry"}
                    </button>
                    <button
                      onClick={() => setJournalingFor(false)}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setJournalingFor(true)}
                    className="flex-1 text-sm border border-border rounded-md py-2 hover:bg-accent"
                  >
                    Write a response
                  </button>
                  <button
                    onClick={handleMarkOnly}
                    disabled={completing}
                    className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-2"
                  >
                    Mark complete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history && history.total > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Challenge History</h2>
            <span className="text-xs text-muted-foreground">{history.total} completed</span>
          </div>
          <div className="space-y-1.5">
            {history.completions.slice(-10).reverse().map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
              >
                <span className="text-xs text-muted-foreground w-24 shrink-0">{c.date}</span>
                <span className="flex-1 truncate text-muted-foreground">{c.challengeKey.replace(/_/g, " ")}</span>
                {c.journalPointId && (
                  <span className="text-xs text-emerald-500">+ entry</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

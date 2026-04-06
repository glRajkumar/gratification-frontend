import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateJournalPoint } from "@/hooks/use-journal"
import { useCategories } from "@/hooks/use-categories"
import { useSettings } from "@/hooks/use-settings"
import {
  InputWrapper,
  TextareaWrapper,
  SelectWrapper,
  RadioWrapper,
} from "@/components/ui/field-wrapper-rhf"
import { Button } from "@/components/ui/button"
import { ConversationalEntry } from "@/components/common/conversational-entry"
import { journalPointSchema, type JournalPointFormData } from "@/utils/schemas"

export const Route = createFileRoute("/_app/journal/new")({
  component: JournalNewPage,
})

const tagOptions = [
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
]

const moodOptions = [
  { value: "1", label: "😞 1" },
  { value: "2", label: "😕 2" },
  { value: "3", label: "😐 3" },
  { value: "4", label: "🙂 4" },
  { value: "5", label: "😄 5" },
]

const entryModeOptions = [
  { value: "morning", label: "Morning" },
  { value: "evening", label: "Evening" },
]

function JournalNewPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<"guide" | "full">("full")
  const { data: categories = [] } = useCategories()
  const { data: settings } = useSettings()
  const createMutation = useCreateJournalPoint()

  const today = new Date().toISOString().slice(0, 10)
  const hour = new Date().getHours()

  const form = useForm({
    resolver: zodResolver(journalPointSchema),
    defaultValues: {
      date: today,
      score: 1,
      tag: "positive",
      entryMode: hour < 12 ? "morning" : "evening",
    },
  })

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }))

  function onSubmit(data: JournalPointFormData) {
    createMutation.mutate(data, {
      onSuccess: (point) =>
        navigate({ to: "/journal/$id", params: { id: point.id } }),
    })
  }

  if (mode === "guide") {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">Guided Entry</h1>
          <button
            onClick={() => setMode("full")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Full form →
          </button>
        </div>
        <ConversationalEntry
          date={today}
          onDone={() => navigate({ to: "/journal" })}
          onExpand={() => setMode("full")}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">New Journal Entry</h1>
        <button
          onClick={() => setMode("guide")}
          className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-3 py-1.5"
        >
          Guide me
        </button>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <InputWrapper
          name="title"
          control={form.control}
          label="Title"
          placeholder="What happened?"
        />
        <TextareaWrapper
          name="description"
          control={form.control}
          label="Description"
          placeholder="Tell me more…"
          rows={3}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper name="date" control={form.control} label="Date" type="date" />
          <InputWrapper
            name="time"
            control={form.control}
            label="Time (optional)"
            type="time"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputWrapper
            name="score"
            control={form.control}
            label="Score (1–10)"
            type="number"
            min={1}
            max={10}
          />
          {categoryOptions.length > 0 && (
            <SelectWrapper
              name="categoryId"
              control={form.control}
              label="Category"
              options={categoryOptions}
              placeholder="Pick one"
            />
          )}
        </div>
        <RadioWrapper
          name="tag"
          control={form.control}
          label="Tag"
          options={tagOptions}
        />
        <RadioWrapper
          name="mood"
          control={form.control}
          label="Mood (optional)"
          options={moodOptions}
        />
        {settings?.morningEveningMode && (
          <RadioWrapper
            name="entryMode"
            control={form.control}
            label="Entry mode"
            options={entryModeOptions}
          />
        )}
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Saving…" : "Save entry"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/journal" })}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

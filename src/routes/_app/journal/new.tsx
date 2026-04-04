import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateJournalPoint } from "@/hooks/use-journal"
import { useCategories } from "@/hooks/use-categories"
import {
  InputWrapper,
  TextareaWrapper,
  SelectWrapper,
  RadioWrapper,
} from "@/components/ui/field-wrapper-rhf"
import { Button } from "@/components/ui/button"
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

function JournalNewPage() {
  const navigate = useNavigate()
  const { data: categories = [] } = useCategories()
  const createMutation = useCreateJournalPoint()

  const form = useForm<JournalPointFormData>({
    resolver: zodResolver(journalPointSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      score: 1,
      tag: "positive",
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

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-lg font-semibold mb-6">New Journal Entry</h1>

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

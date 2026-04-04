import { useRef, useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useJournalPoint,
  useUpdateJournalPoint,
  useDeleteJournalPoint,
  useAddReflection,
  useDeleteReflection,
} from "@/hooks/use-journal"
import { useCategories } from "@/hooks/use-categories"
import {
  InputWrapper,
  TextareaWrapper,
  SelectWrapper,
  RadioWrapper,
} from "@/components/ui/field-wrapper-rhf"
import { DialogWrapper } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  journalPointSchema,
  reflectionSchema,
  type JournalPointFormData,
  type ReflectionFormData,
} from "@/utils/schemas"
import { cn } from "@/lib/utils"
import type { Attachment, Reflection } from "@/types/app"
import {
  useUploadAttachments,
  useDeleteAttachment,
} from "@/hooks/use-attachments"

export const Route = createFileRoute("/_app/journal/$id")({
  component: JournalDetailPage,
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

const reflectionTypeOptions = [
  { value: "positive_aspect", label: "Positive aspect" },
  { value: "negative_aspect", label: "Negative aspect" },
  { value: "lesson_learned", label: "Lesson learned" },
  { value: "alternative_action", label: "Alternative action" },
  { value: "why_it_happened", label: "Why it happened" },
  { value: "custom", label: "Custom" },
]

const cognitiveDistortionOptions = [
  { value: "catastrophizing", label: "Catastrophizing" },
  { value: "all_or_nothing", label: "All-or-nothing thinking" },
  { value: "mind_reading", label: "Mind reading" },
  { value: "overgeneralization", label: "Overgeneralization" },
  { value: "personalization", label: "Personalization" },
  { value: "emotional_reasoning", label: "Emotional reasoning" },
  { value: "should_statements", label: "Should statements" },
  { value: "labeling", label: "Labeling" },
  { value: "magnification", label: "Magnification" },
]

const typeLabel: Record<Reflection["type"], string> = {
  positive_aspect: "Positive aspect",
  negative_aspect: "Negative aspect",
  lesson_learned: "Lesson learned",
  alternative_action: "Alternative action",
  why_it_happened: "Why it happened",
  custom: "Note",
}

const distortionLabel: Record<string, string> = {
  catastrophizing: "Catastrophizing",
  all_or_nothing: "All-or-nothing",
  mind_reading: "Mind reading",
  overgeneralization: "Overgeneralization",
  personalization: "Personalization",
  emotional_reasoning: "Emotional reasoning",
  should_statements: "Should statements",
  labeling: "Labeling",
  magnification: "Magnification",
}

type GuidedPrompt = { type: Reflection["type"]; label: string; placeholder: string }

const NEGATIVE_PROMPTS: GuidedPrompt[] = [
  { type: "why_it_happened", label: "What led to this?", placeholder: "What caused this to happen?" },
  { type: "alternative_action", label: "What could you do differently?", placeholder: "What would you change next time?" },
  { type: "positive_aspect", label: "Anything positive to take from this?", placeholder: "Even difficult situations have lessons…" },
]

const POSITIVE_PROMPTS: GuidedPrompt[] = [
  { type: "positive_aspect", label: "What made this possible?", placeholder: "What conditions helped this happen?" },
  { type: "lesson_learned", label: "How can you create more of this?", placeholder: "What would help repeat this outcome?" },
]

const ACCEPT = "image/*,audio/*,video/*"
const MAX_MB = 10
const MAX_FILES = 10

function MediaStrip({
  items,
  journalPointId,
  existingCount,
}: {
  items: Attachment[]
  journalPointId: string
  existingCount: number
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useUploadAttachments(journalPointId)
  const deleteMutation = useDeleteAttachment(journalPointId)

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    uploadMutation.mutate(files)
    e.target.value = ""
  }

  const remaining = MAX_FILES - existingCount
  const sizeLabel = (bytes: number | null) =>
    bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : ""

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">
          Attachments ({existingCount}/{MAX_FILES})
        </h2>
        {remaining > 0 && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="hidden"
              onChange={handleFiles}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="text-xs border rounded-md px-2.5 py-1 hover:bg-accent transition-colors disabled:opacity-50"
            >
              {uploadMutation.isPending
                ? `Uploading ${uploadMutation.progress}%…`
                : "Add files"}
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Images, audio, video · max {MAX_MB} MB per file · up to {MAX_FILES} total
      </p>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {items.map((a) => (
            <div key={a.id} className="relative group">
              {a.type === "image" && (
                <a href={a.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={a.url}
                    alt={a.filename ?? "attachment"}
                    className="h-24 w-24 object-cover rounded-lg border"
                  />
                </a>
              )}
              {a.type === "audio" && (
                <div className="rounded-lg border px-3 py-2 bg-muted/40 w-48">
                  <p className="text-xs text-muted-foreground truncate mb-1">
                    {a.filename ?? "Voice note"}
                  </p>
                  <audio src={a.url} controls className="w-full h-8" />
                  {a.size && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {sizeLabel(a.size)}
                    </p>
                  )}
                </div>
              )}
              {a.type === "video" && (
                <div className="rounded-lg border overflow-hidden w-40">
                  <video
                    src={a.url}
                    controls
                    className="w-full h-24 object-cover bg-black"
                  />
                  {a.filename && (
                    <p className="text-xs text-muted-foreground px-2 py-1 truncate">
                      {a.filename}
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={() => deleteMutation.mutate(a.id)}
                disabled={deleteMutation.isPending}
                className={cn(
                  "absolute -top-2 -right-2 size-5 rounded-full bg-destructive text-white text-xs",
                  "flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                )}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function JournalDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [addReflOpen, setAddReflOpen] = useState(false)
  const [promptMode, setPromptMode] = useState<GuidedPrompt | null>(null)

  const { data: point, isLoading } = useJournalPoint(id)
  const { data: categories = [] } = useCategories()
  const updateMutation = useUpdateJournalPoint(id)
  const deleteMutation = useDeleteJournalPoint()
  const addReflMutation = useAddReflection(id)
  const deleteReflMutation = useDeleteReflection(id)

  const editForm = useForm<JournalPointFormData>({
    resolver: zodResolver(journalPointSchema),
  })

  const reflForm = useForm<ReflectionFormData>({
    resolver: zodResolver(reflectionSchema),
    defaultValues: { type: "lesson_learned", content: "" },
  })

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }))

  function openEdit() {
    if (!point) return
    editForm.reset({
      title: point.title,
      description: point.description ?? undefined,
      date: point.date,
      time: point.time ?? undefined,
      categoryId: point.categoryId ?? undefined,
      score: point.score,
      tag: point.tag,
      mood: point.mood ?? undefined,
    })
    setEditOpen(true)
  }

  function onEditSubmit(data: JournalPointFormData) {
    updateMutation.mutate(data, { onSuccess: () => setEditOpen(false) })
  }

  function openPrompt(prompt: GuidedPrompt) {
    reflForm.reset({ type: prompt.type, content: "" })
    setPromptMode(prompt)
    setAddReflOpen(true)
  }

  function openFreeReflection() {
    reflForm.reset({ type: "lesson_learned", content: "" })
    setPromptMode(null)
    setAddReflOpen(true)
  }

  function onAddReflection(data: ReflectionFormData) {
    addReflMutation.mutate(data, {
      onSuccess: () => {
        reflForm.reset({ type: "lesson_learned", content: "" })
        setAddReflOpen(false)
        setPromptMode(null)
      },
    })
  }

  if (isLoading)
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  if (!point)
    return <div className="p-6 text-sm text-muted-foreground">Not found.</div>

  const cat = categories.find((c) => c.id === point.categoryId)
  const prompts = point.tag === "negative" ? NEGATIVE_PROMPTS : POSITIVE_PROMPTS

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "size-2 rounded-full shrink-0",
                point.tag === "positive"
                  ? "bg-emerald-500"
                  : point.tag === "negative"
                    ? "bg-red-500"
                    : "bg-muted-foreground",
              )}
            />
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                point.tag === "positive"
                  ? "text-emerald-500"
                  : point.tag === "negative"
                    ? "text-red-500"
                    : "text-muted-foreground",
              )}
            >
              {point.tag === "positive"
                ? `+${point.score}`
                : point.tag === "negative"
                  ? `-${point.score}`
                  : "0"}
            </span>
            {cat && (
              <span className="text-xs text-muted-foreground">
                {cat.icon} {cat.name}
              </span>
            )}
            {point.mood && (
              <span className="text-xs text-muted-foreground">
                mood {point.mood}/5
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {point.date}
              {point.time ? ` at ${point.time}` : ""}
            </span>
          </div>
          <h1 className="text-lg font-semibold">{point.title}</h1>
          {point.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {point.description}
            </p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="outline" size="sm" onClick={openEdit}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              deleteMutation.mutate(id, {
                onSuccess: () => navigate({ to: "/journal" }),
              })
            }
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">
            Reflections ({point.reflections.length})
          </h2>
          <Button variant="outline" size="sm" onClick={openFreeReflection}>
            Add reflection
          </Button>
        </div>

        {point.reflections.length === 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button
                  key={p.type}
                  onClick={() => openPrompt(p)}
                  className="text-xs border rounded-full px-3 py-1 hover:bg-accent transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {point.reflections.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reflections yet.</p>
        ) : (
          <div className="space-y-3">
            {point.reflections.map((r) => (
              <div key={r.id} className="rounded-lg border px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        {typeLabel[r.type]}
                      </p>
                      {r.cognitiveDistortion && (
                        <span className="text-xs bg-orange-500/10 text-orange-600 rounded px-1.5 py-0.5">
                          {distortionLabel[r.cognitiveDistortion]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{r.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteReflMutation.mutate(r.id)}
                    className="shrink-0"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MediaStrip
        items={point.attachments}
        journalPointId={id}
        existingCount={point.attachments.length}
      />

      <DialogWrapper
        open={addReflOpen}
        onOpenChange={(open) => {
          setAddReflOpen(open)
          if (!open) setPromptMode(null)
        }}
        title={promptMode ? promptMode.label : "Add Reflection"}
        action="Save"
        cancel="Cancel"
        onAction={reflForm.handleSubmit(onAddReflection)}
      >
        <div className="flex flex-col gap-3">
          {!promptMode && (
            <SelectWrapper
              name="type"
              control={reflForm.control}
              label="Type"
              options={reflectionTypeOptions}
              placeholder="Pick a type"
            />
          )}
          <TextareaWrapper
            name="content"
            control={reflForm.control}
            label="Content"
            placeholder={promptMode?.placeholder ?? "Write your reflection…"}
            rows={4}
          />
          {(point.tag === "negative" || !promptMode) && (
            <SelectWrapper
              name="cognitiveDistortion"
              control={reflForm.control}
              label="Thinking trap (optional)"
              options={cognitiveDistortionOptions}
              placeholder="Label a cognitive distortion"
            />
          )}
        </div>
      </DialogWrapper>

      <DialogWrapper
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Entry"
        action="Save"
        cancel="Cancel"
        onAction={editForm.handleSubmit(onEditSubmit)}
        contentCls="sm:max-w-md"
      >
        <div className="flex flex-col gap-3">
          <InputWrapper name="title" control={editForm.control} label="Title" />
          <TextareaWrapper
            name="description"
            control={editForm.control}
            label="Description"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-3">
            <InputWrapper
              name="date"
              control={editForm.control}
              label="Date"
              type="date"
            />
            <InputWrapper
              name="time"
              control={editForm.control}
              label="Time"
              type="time"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputWrapper
              name="score"
              control={editForm.control}
              label="Score"
              type="number"
              min={1}
              max={10}
            />
            {categoryOptions.length > 0 && (
              <SelectWrapper
                name="categoryId"
                control={editForm.control}
                label="Category"
                options={categoryOptions}
                placeholder="Pick one"
              />
            )}
          </div>
          <RadioWrapper
            name="tag"
            control={editForm.control}
            label="Tag"
            options={tagOptions}
          />
          <RadioWrapper
            name="mood"
            control={editForm.control}
            label="Mood (optional)"
            options={moodOptions}
          />
        </div>
      </DialogWrapper>
    </div>
  )
}

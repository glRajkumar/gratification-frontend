import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useGoals,
  useCreateGoal,
  useDeleteGoal,
  useCloseGoal,
} from "@/hooks/use-goals"
import { useCategories } from "@/hooks/use-categories"
import {
  InputWrapper,
  SelectWrapper,
  TextareaWrapper,
} from "@/components/ui/field-wrapper-rhf"
import { DialogWrapper } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  goalSchema,
  closeGoalSchema,
  type GoalFormData,
  type CloseGoalFormData,
} from "@/utils/schemas"
import { cn } from "@/lib/utils"
import type { Goal } from "@/types/app"

export const Route = createFileRoute("/goals")({ component: GoalsPage })

type StatusFilter = "all" | "active" | "achieved" | "partial" | "missed"

const periodOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

const closeStatusOptions = [
  { value: "achieved", label: "Achieved" },
  { value: "partial", label: "Partial" },
  { value: "missed", label: "Missed" },
]

function GoalsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active")
  const [createOpen, setCreateOpen] = useState(false)
  const [closing, setClosing] = useState<Goal | null>(null)
  const [closeOpen, setCloseOpen] = useState(false)

  const { data: goals = [], isLoading } = useGoals(
    statusFilter === "all" ? undefined : { status: statusFilter as Goal["status"] },
  )
  const { data: categories = [] } = useCategories()
  const createMutation = useCreateGoal()
  const deleteMutation = useDeleteGoal()
  const closeMutation = useCloseGoal()

  const createForm = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: { targetCount: 1, period: "weekly" },
  })

  const closeForm = useForm<CloseGoalFormData>({
    resolver: zodResolver(closeGoalSchema),
    defaultValues: { status: "achieved" },
  })

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }))

  function onCreateSubmit(data: GoalFormData) {
    createMutation.mutate(data, {
      onSuccess: () => {
        createForm.reset()
        setCreateOpen(false)
      },
    })
  }

  function openClose(goal: Goal) {
    setClosing(goal)
    closeForm.reset({ status: "achieved" })
    setCloseOpen(true)
  }

  function onCloseSubmit(data: CloseGoalFormData) {
    if (!closing) return
    closeMutation.mutate(
      { id: closing.id, body: data },
      { onSuccess: () => setCloseOpen(false) },
    )
  }

  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "all", label: "All" },
    { key: "achieved", label: "Achieved" },
    { key: "partial", label: "Partial" },
    { key: "missed", label: "Missed" },
  ]

  const statusColor: Record<Goal["status"], string> = {
    active: "text-blue-500",
    achieved: "text-emerald-500",
    partial: "text-amber-500",
    missed: "text-red-500",
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Goals</h1>
        <DialogWrapper
          open={createOpen}
          onOpenChange={setCreateOpen}
          trigger={<Button size="sm">New goal</Button>}
          title="New Goal"
          action="Create"
          cancel="Cancel"
          onAction={createForm.handleSubmit(onCreateSubmit)}
          contentCls="sm:max-w-md"
        >
          <div className="flex flex-col gap-3">
            <InputWrapper name="title" control={createForm.control} label="Title" placeholder="What do you want to achieve?" />
            <SelectWrapper
              name="period"
              control={createForm.control}
              label="Period"
              options={periodOptions}
              placeholder="Pick a period"
            />
            <InputWrapper name="targetCount" control={createForm.control} label="Target count" type="number" min={1} />
            <InputWrapper name="startDate" control={createForm.control} label="Start date" type="date" />
            <InputWrapper name="endDate" control={createForm.control} label="End date" type="date" />
            {categoryOptions.length > 0 && (
              <SelectWrapper
                name="categoryId"
                control={createForm.control}
                label="Category"
                options={categoryOptions}
                placeholder="Pick a category"
              />
            )}
          </div>
        </DialogWrapper>
      </div>

      <div className="flex gap-1 mb-4 border-b">
        {statusTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={cn(
              "px-3 py-1.5 text-sm border-b-2 -mb-px transition-colors",
              statusFilter === key
                ? "border-foreground text-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : goals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No goals here.</p>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const cat = categories.find((c) => c.id === goal.categoryId)
            return (
              <div key={goal.id} className="rounded-lg border px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{goal.title}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      {cat && <span>{cat.icon} {cat.name}</span>}
                      <span className="capitalize">{goal.period}</span>
                      <span>target: {goal.targetCount}</span>
                      <span
                        className={cn(
                          "capitalize font-medium",
                          statusColor[goal.status],
                        )}
                      >
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.startDate} → {goal.endDate}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {goal.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openClose(goal)}
                      >
                        Close
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(goal.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <DialogWrapper
        open={closeOpen}
        onOpenChange={setCloseOpen}
        title={`Close "${closing?.title}"`}
        action="Close goal"
        cancel="Cancel"
        onAction={closeForm.handleSubmit(onCloseSubmit)}
      >
        <div className="flex flex-col gap-3">
          <SelectWrapper
            name="status"
            control={closeForm.control}
            label="Outcome"
            options={closeStatusOptions}
            placeholder="Pick an outcome"
          />
          <TextareaWrapper
            name="summaryNote"
            control={closeForm.control}
            label="Summary note"
            placeholder="How did it go?"
          />
        </div>
      </DialogWrapper>
    </div>
  )
}

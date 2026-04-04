import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useHabits,
  useCreateHabit,
  useDeleteHabit,
  useCheckHabit,
  useHabitStats,
} from "@/hooks/use-habits"
import {
  InputWrapper,
  SelectWrapper,
  SwitchWrapper,
} from "@/components/ui/field-wrapper-rhf"
import { Button } from "@/components/ui/button"
import { DialogWrapper } from "@/components/ui/dialog"
import { habitSchema, type HabitFormData } from "@/utils/schemas"
import { cn } from "@/lib/utils"
import type { HabitWithTodayEntry } from "@/types/app"

export const Route = createFileRoute("/_app/habits")({
  component: HabitsPage,
})

const frequencyOptions = [
  { value: "daily", label: "Every day" },
  { value: "weekdays", label: "Weekdays (Mon–Fri)" },
  { value: "weekends", label: "Weekends (Sat–Sun)" },
  { value: "custom", label: "Custom days" },
]

const colorOptions = [
  { value: "#10b981", label: "Green" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Red" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#0ea5e9", label: "Sky" },
]

function HabitStatsPanel({ habitId }: { habitId: string }) {
  const { data, isLoading } = useHabitStats(habitId)

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!data) return null

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Strength</p>
          <p className="text-2xl font-bold">{data.strength}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold">
            {data.completedDays}/{data.scheduledDays}
          </p>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">Last 30 days</p>
        <div className="flex flex-wrap gap-0.5">
          {data.heatmap.map((cell) => (
            <div
              key={cell.date}
              title={cell.date}
              className={cn(
                "size-4 rounded-sm",
                !cell.scheduled
                  ? "bg-muted/30"
                  : cell.completed
                    ? "bg-emerald-500"
                    : "bg-red-200",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function HabitRow({ habit, today }: { habit: HabitWithTodayEntry; today: string }) {
  const checkMutation = useCheckHabit()
  const deleteMutation = useDeleteHabit()
  const [statsOpen, setStatsOpen] = useState(false)

  const isChecked = habit.todayEntry?.completed ?? false

  function toggle() {
    checkMutation.mutate({
      id: habit.id,
      date: today,
      completed: !isChecked,
    })
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
      <button
        onClick={toggle}
        disabled={checkMutation.isPending || !habit.scheduledToday}
        className={cn(
          "size-6 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors",
          isChecked
            ? "border-emerald-500 bg-emerald-500 text-white"
            : habit.scheduledToday
              ? "border-muted-foreground hover:border-foreground"
              : "border-muted opacity-40 cursor-not-allowed",
        )}
        style={isChecked ? {} : { borderColor: habit.color }}
      >
        {isChecked && <span className="text-xs leading-none">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span>{habit.icon}</span>
          <span
            className={cn(
              "text-sm font-medium",
              !habit.scheduledToday && "text-muted-foreground",
            )}
          >
            {habit.title}
          </span>
        </div>
        <p className="text-xs text-muted-foreground capitalize">
          {habit.frequency}
          {!habit.scheduledToday && " · not scheduled today"}
        </p>
      </div>

      <div className="flex gap-1">
        <DialogWrapper
          open={statsOpen}
          onOpenChange={setStatsOpen}
          trigger={
            <Button variant="ghost" size="sm">
              Stats
            </Button>
          }
          title={habit.title}
          cancel="Close"
          onAction={() => setStatsOpen(false)}
          action=""
        >
          <HabitStatsPanel habitId={habit.id} />
        </DialogWrapper>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteMutation.mutate(habit.id)}
          disabled={deleteMutation.isPending}
        >
          ×
        </Button>
      </div>
    </div>
  )
}

function HabitsPage() {
  const today = new Date().toISOString().slice(0, 10)
  const { data: habits = [], isLoading } = useHabits()
  const createMutation = useCreateHabit()
  const [createOpen, setCreateOpen] = useState(false)

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      frequency: "daily",
      targetCount: 1,
      color: "#10b981",
      icon: "◉",
      autoJournalOnComplete: false,
      autoJournalOnMiss: false,
    },
  })

  function onCreateSubmit(data: HabitFormData) {
    createMutation.mutate(data, {
      onSuccess: () => {
        form.reset()
        setCreateOpen(false)
      },
    })
  }

  const scheduledToday = habits.filter((h) => h.scheduledToday)
  const notScheduled = habits.filter((h) => !h.scheduledToday)
  const completedToday = scheduledToday.filter((h) => h.todayEntry?.completed)

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Habits</h1>
          {scheduledToday.length > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {completedToday.length}/{scheduledToday.length} done today
            </p>
          )}
        </div>
        <DialogWrapper
          open={createOpen}
          onOpenChange={setCreateOpen}
          trigger={<Button size="sm">New habit</Button>}
          title="Create Habit"
          action="Create"
          cancel="Cancel"
          onAction={form.handleSubmit(onCreateSubmit)}
          contentCls="sm:max-w-md"
        >
          <div className="flex flex-col gap-3">
            <InputWrapper
              name="title"
              control={form.control}
              label="Title"
              placeholder="e.g. Morning run"
            />
            <div className="grid grid-cols-2 gap-3">
              <InputWrapper
                name="icon"
                control={form.control}
                label="Icon"
                placeholder="◉"
              />
              <SelectWrapper
                name="color"
                control={form.control}
                label="Color"
                options={colorOptions}
                placeholder="Pick color"
              />
            </div>
            <SelectWrapper
              name="frequency"
              control={form.control}
              label="Frequency"
              options={frequencyOptions}
              placeholder="Select frequency"
            />
            <SwitchWrapper
              name="autoJournalOnComplete"
              control={form.control}
              label="Auto-log completion as journal point"
            />
          </div>
        </DialogWrapper>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : habits.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No habits yet. Create your first one.
        </p>
      ) : (
        <div className="space-y-4">
          {scheduledToday.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Today
              </p>
              {scheduledToday.map((h) => (
                <HabitRow key={h.id} habit={h} today={today} />
              ))}
            </div>
          )}
          {notScheduled.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Not scheduled today
              </p>
              {notScheduled.map((h) => (
                <HabitRow key={h.id} habit={h} today={today} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

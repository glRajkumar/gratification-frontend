import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(1, "Required"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Valid hex color required"),
  icon: z.string().min(1, "Required"),
})
export type CategoryFormData = z.infer<typeof categorySchema>

export const journalPointSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  date: z.string().min(1, "Required"),
  time: z.string().optional(),
  categoryId: z.string().optional(),
  score: z.coerce.number().int().min(1).max(10),
  tag: z.enum(["positive", "negative", "neutral"]),
})
export type JournalPointFormData = z.infer<typeof journalPointSchema>

export const reflectionSchema = z.object({
  type: z.enum([
    "positive_aspect",
    "negative_aspect",
    "lesson_learned",
    "alternative_action",
    "why_it_happened",
    "custom",
  ]),
  content: z.string().min(1, "Required"),
})
export type ReflectionFormData = z.infer<typeof reflectionSchema>

export const todoSchema = z.object({
  title: z.string().min(1, "Required"),
  categoryId: z.string().optional(),
  dueDate: z.string().optional(),
})
export type TodoFormData = z.infer<typeof todoSchema>

export const goalSchema = z.object({
  title: z.string().min(1, "Required"),
  categoryId: z.string().optional(),
  period: z.enum(["daily", "weekly", "monthly"]),
  targetCount: z.coerce.number().int().min(1),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
})
export type GoalFormData = z.infer<typeof goalSchema>

export const closeGoalSchema = z.object({
  status: z.enum(["achieved", "partial", "missed"]),
  summaryNote: z.string().optional(),
})
export type CloseGoalFormData = z.infer<typeof closeGoalSchema>

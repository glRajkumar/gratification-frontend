import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useTodos,
  useCreateTodo,
  useDeleteTodo,
  useCompleteTodo,
} from "@/hooks/use-todos"
import { useCategories } from "@/hooks/use-categories"
import { InputWrapper, SelectWrapper } from "@/components/ui/field-wrapper-rhf"
import { DialogWrapper } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { todoSchema, type TodoFormData } from "@/utils/schemas"
import { cn } from "@/lib/utils"
import type { Todo } from "@/types/app"

export const Route = createFileRoute("/todos")({ component: TodosPage })

type StatusFilter = "all" | "pending" | "completed" | "missed"

function TodosPage() {
  const [status, setStatus] = useState<StatusFilter>("pending")
  const [createOpen, setCreateOpen] = useState(false)
  const [completing, setCompleting] = useState<Todo | null>(null)

  const { data: todos = [], isLoading } = useTodos(
    status === "all" ? undefined : { status },
  )
  const { data: categories = [] } = useCategories()
  const createMutation = useCreateTodo()
  const deleteMutation = useDeleteTodo()
  const completeMutation = useCompleteTodo()

  const createForm = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: { title: "" },
  })

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }))

  function onCreateSubmit(data: TodoFormData) {
    createMutation.mutate(data, {
      onSuccess: () => {
        createForm.reset()
        setCreateOpen(false)
      },
    })
  }

  function markComplete(todo: Todo) {
    completeMutation.mutate(
      { id: todo.id, body: { createJournalPoint: false } },
    )
  }

  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "all", label: "All" },
    { key: "completed", label: "Completed" },
    { key: "missed", label: "Missed" },
  ]

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Todos</h1>
        <DialogWrapper
          open={createOpen}
          onOpenChange={setCreateOpen}
          trigger={<Button size="sm">New todo</Button>}
          title="New Todo"
          action="Create"
          cancel="Cancel"
          onAction={createForm.handleSubmit(onCreateSubmit)}
        >
          <div className="flex flex-col gap-3">
            <InputWrapper name="title" control={createForm.control} label="Title" placeholder="What needs to be done?" />
            <InputWrapper name="dueDate" control={createForm.control} label="Due date" type="date" />
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
            onClick={() => setStatus(key)}
            className={cn(
              "px-3 py-1.5 text-sm border-b-2 -mb-px transition-colors",
              status === key
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
      ) : todos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No todos here.</p>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => {
            const cat = categories.find((c) => c.id === todo.categoryId)
            return (
              <div
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border px-4 py-3"
              >
                {todo.status === "pending" && (
                  <button
                    className="size-4 rounded border shrink-0 hover:bg-accent"
                    onClick={() => markComplete(todo)}
                    title="Mark complete"
                  />
                )}
                {todo.status === "completed" && (
                  <span className="size-4 rounded border bg-emerald-500 shrink-0 flex items-center justify-center text-white text-xs">
                    ✓
                  </span>
                )}
                {todo.status === "missed" && (
                  <span className="size-4 rounded border bg-red-500 shrink-0 flex items-center justify-center text-white text-xs">
                    ✕
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm truncate",
                      todo.status !== "pending" && "line-through text-muted-foreground",
                    )}
                  >
                    {todo.title}
                  </p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                    {cat && <span>{cat.icon} {cat.name}</span>}
                    {todo.dueDate && <span>Due {todo.dueDate}</span>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(todo.id)}
                >
                  Delete
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

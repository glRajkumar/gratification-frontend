import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-categories"
import { InputWrapper } from "@/components/ui/field-wrapper-rhf"
import { DialogWrapper } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { categorySchema, type CategoryFormData } from "@/utils/schemas"
import type { Category } from "@/types/app"

export const Route = createFileRoute("/_app/categories")({ component: CategoriesPage })

function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()
  const [editing, setEditing] = useState<Category | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const createForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", color: "#6366f1", icon: "✦" },
  })

  const editForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  function openEdit(cat: Category) {
    setEditing(cat)
    editForm.reset({ name: cat.name, color: cat.color, icon: cat.icon })
    setEditOpen(true)
  }

  function onCreateSubmit(data: CategoryFormData) {
    createMutation.mutate(data, {
      onSuccess: () => {
        createForm.reset()
        setCreateOpen(false)
      },
    })
  }

  function onEditSubmit(data: CategoryFormData) {
    if (!editing) return
    updateMutation.mutate(
      { id: editing.id, body: data },
      { onSuccess: () => setEditOpen(false) },
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold">Categories</h1>
        <DialogWrapper
          open={createOpen}
          onOpenChange={setCreateOpen}
          trigger={<Button size="sm">New category</Button>}
          title="New Category"
          action="Create"
          cancel="Cancel"
          onAction={createForm.handleSubmit(onCreateSubmit)}
        >
          <CategoryForm form={createForm} />
        </DialogWrapper>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 rounded-lg border px-4 py-3"
            >
              <span
                className="size-3 rounded-full shrink-0"
                style={{ background: cat.color }}
              />
              <span className="text-base leading-none">{cat.icon}</span>
              <span className="flex-1 text-sm font-medium">{cat.name}</span>
              {cat.isDefault && (
                <span className="text-xs text-muted-foreground">default</span>
              )}
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(cat.id)}
                  disabled={cat.isDefault}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DialogWrapper
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Category"
        action="Save"
        cancel="Cancel"
        onAction={editForm.handleSubmit(onEditSubmit)}
      >
        <CategoryForm form={editForm} />
      </DialogWrapper>
    </div>
  )
}

function CategoryForm({
  form,
}: {
  form: ReturnType<typeof useForm<CategoryFormData>>
}) {
  return (
    <div className="flex flex-col gap-3">
      <InputWrapper
        name="name"
        control={form.control}
        label="Name"
        placeholder="e.g. Fitness"
      />
      <InputWrapper
        name="icon"
        control={form.control}
        label="Icon"
        placeholder="e.g. 🏋️"
      />
      <InputWrapper name="color" control={form.control} label="Color" type="color" />
    </div>
  )
}

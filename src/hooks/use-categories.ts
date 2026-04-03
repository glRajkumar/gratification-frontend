import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/categories"

const QUERY_KEY = ["categories"]

export function useCategories() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: getCategories })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess() {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Category created")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateCategory,
    onSuccess() {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Category updated")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess() {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Category deleted")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}

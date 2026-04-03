import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { CategoryFormData } from "@/utils/schemas"
import type { Category } from "@/types/app"

type UpdateCategoryParams = { id: string } & Partial<CategoryFormData>

export function getCategories(): Promise<Category[]> {
  return sendApiReq({ method: "GET", url: endpoints.categories.list })
}

export function createCategory(data: CategoryFormData): Promise<Category> {
  return sendApiReq({ method: "POST", url: endpoints.categories.create, data })
}

export function updateCategory({ id, ...data }: UpdateCategoryParams): Promise<Category> {
  return sendApiReq({ method: "PUT", url: endpoints.categories.update(id), data })
}

export function deleteCategory(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.categories.delete(id) })
}

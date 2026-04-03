import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAllowedPrimitive(value: unknown): value is allowedPrimitiveT {
  return ["string", "number", "boolean"].includes(typeof value)
}

export function parseAllowedPrimitive(value: allowedPrimitiveT): allowedPrimitiveT {
  if (typeof value !== "string") return value

  const trimmed = value.trim()

  if (trimmed === "true") return true
  if (trimmed === "false") return false
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed)

  return trimmed
}

export function optionTypeChecker<T>(key: keyof T) {
  return (option: any): option is T => !!option && typeof option === "object" && key in option
}

export const isSeparator = (item: any) => item === "---"
export const isOption = optionTypeChecker<optionT>("value")
export const isGroup = optionTypeChecker<groupT>("group")

export const getValue = (item: allowedPrimitiveT | optionT) => typeof item === "object" ? item.value : item
export const getLabel = (item: allowedPrimitiveT | optionT) => typeof item === "object" ? item.label : `${item}`

export function getKey(item: allowedPrimitiveT | optionT, i: number): string {
  const val = getValue(item)
  if (typeof val === "boolean") return `key-${val}`
  if (val === "---") return `${i}`
  return `${val}`
}
type allowedPrimitiveT = string | number | boolean

type optionT = {
  label: React.ReactNode
  value: allowedPrimitiveT
  className?: string
}

type groupT = {
  group: string
  options: (allowedPrimitiveT | optionT)[]
  className?: string
}

type optionsT = (allowedPrimitiveT | optionT | groupT)[]

type indicatorAtT = "right" | "left"
type menuOptionT = allowedPrimitiveT | optionT | (optionT & {
  variant?: "default" | "destructive"
  shortcut?: string
  disabled?: boolean
})

type menuGroupT = {
  group: string
  options: menuOptionT[]
  className?: string
  groupLabelCls?: string
}

type subMenuT = {
  submenu: string
  options: (menuOptionT | menuGroupT)[]
  triggerCls?: string
  contentCls?: string
}

type menuOptionsT = (menuOptionT | menuGroupT | subMenuT)[]

type menuInputOptionT = allowedPrimitiveT | optionT | (optionT & {
  disabled?: boolean
})

type menuInputGroupT = {
  group: string
  options: menuInputOptionT[]
  className?: string
  groupLabelCls?: string
}

type inputSubMenuT = {
  submenu: string
  options: (menuInputOptionT | menuInputGroupT)[]
  triggerCls?: string
  contentCls?: string
}

type menuInputOptionsT = (menuInputOptionT | menuInputGroupT | inputSubMenuT)[]

"use client"

import { useState } from "react"
import {
  cn, getKey, getLabel, getValue,
  isSeparator,
  isSubMenu,
  isGroupMenu,
  isInputSubMenu,
  isInputGroupMenu,
  parseAllowedPrimitive,
} from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

type commonCheckboxProps = {
  checked?: allowedPrimitiveT[]
  indicatorAt?: indicatorAtT
  onCheckedChange?: (value: allowedPrimitiveT, checked: boolean) => void
}

type commonRadioProps = {
  value?: allowedPrimitiveT
  indicatorAt?: indicatorAtT
  onValueChange?: (value: allowedPrimitiveT) => void
}

type commonSubMenuT = {
  itemCls?: string
  groupCls?: string
  groupLabelCls?: string
}

type commonPropsT = {
  trigger: React.ReactNode
  triggerCls?: string
  itemCls?: string
  groupCls?: string
  groupLabelCls?: string
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>
  onSelect?: (value: allowedPrimitiveT) => void
} & React.ComponentProps<typeof DropdownMenu>

// -------

type itemProps = {
  option: menuOptionT
  className?: string
  onSelect?: () => void
}
function Item({
  option,
  className,
  onSelect
}: itemProps) {
  const value = getValue(option)

  if (isSeparator(value)) return <DropdownMenuSeparator className={cn(className)} />

  const label = getLabel(option)
  const opt: any = typeof option === "object" ? option : {}
  const shortcut = opt?.shortcut

  return (
    <DropdownMenuItem
      {...opt}
      onSelect={onSelect}
      className={cn(className, opt?.className)}
    >
      {label}
      {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
    </DropdownMenuItem>
  )
}

type checkboxItemProps = {
  option: menuInputOptionT
  className?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  indicatorAt?: indicatorAtT
}
function CheckboxItem({
  option,
  className,
  checked = false,
  indicatorAt,
  onCheckedChange = () => { }
}: checkboxItemProps) {
  const value = getValue(option)

  if (isSeparator(value)) return <DropdownMenuSeparator className={cn(className)} />

  const label = getLabel(option)
  const disabled = (option as any)?.disabled

  return (
    <DropdownMenuCheckboxItem
      checked={checked}
      disabled={disabled}
      className={cn(className)}
      indicatorAt={indicatorAt}
      onCheckedChange={onCheckedChange}
    >
      {label}
    </DropdownMenuCheckboxItem>
  )
}

type radioItemProps = {
  option: menuInputOptionT
  className?: string
  indicatorAt?: indicatorAtT
}
function RadioItem({
  option,
  className,
  indicatorAt
}: radioItemProps) {
  const value = getValue(option)

  if (isSeparator(value)) return <DropdownMenuSeparator className={cn(className)} />

  const label = getLabel(option)
  const disabled = (option as any)?.disabled

  return (
    <DropdownMenuRadioItem
      value={`${value}`}
      disabled={disabled}
      className={cn(className)}
      indicatorAt={indicatorAt}
    >
      {label}
    </DropdownMenuRadioItem>
  )
}

type SubMenuProps = commonSubMenuT & {
  submenu: subMenuT
  onSelect?: (value: allowedPrimitiveT) => void
}
function SubMenu({
  submenu,
  itemCls,
  groupCls,
  groupLabelCls,
  onSelect
}: SubMenuProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={cn(submenu.triggerCls)}>
        {submenu.submenu}
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent className={cn(submenu.contentCls)}>
        {submenu.options.map((option, i) => {
          if (isGroupMenu(option)) {
            return (
              <DropdownMenuGroup key={option.group} className={cn(groupCls, option.className)}>
                <DropdownMenuLabel className={cn("pb-0.5 text-xs text-muted-foreground font-normal", groupLabelCls, option.groupLabelCls)}>
                  {option.group}
                </DropdownMenuLabel>

                {option.options.map((grOpt, j) => (
                  <Item
                    key={getKey(grOpt, j)}
                    option={grOpt}
                    className={itemCls}
                    onSelect={() => onSelect?.(getValue(grOpt))}
                  />
                ))}
              </DropdownMenuGroup>
            )
          }

          if (isSubMenu(option)) {
            return (
              <SubMenu
                key={getKey(option, i)}
                submenu={option}
                itemCls={itemCls}
                groupCls={groupCls}
                onSelect={onSelect}
              />
            )
          }

          return (
            <Item
              key={getKey(option, i)}
              option={option}
              className={itemCls}
              onSelect={() => onSelect?.(getValue(option))}
            />
          )
        })}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

type CheckboxSubMenuProps = commonSubMenuT & commonCheckboxProps & {
  submenu: inputSubMenuT
}
function CheckboxSubMenu({
  submenu,
  itemCls,
  groupCls,
  groupLabelCls,
  checked = [],
  indicatorAt,
  onCheckedChange = () => { }
}: CheckboxSubMenuProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={cn(submenu.triggerCls)}>
        {submenu.submenu}
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent className={cn(submenu.contentCls)}>
        {submenu.options.map((option, i) => {
          if (isInputGroupMenu(option)) {
            return (
              <DropdownMenuGroup key={option.group} className={cn(groupCls, option.className)}>
                <DropdownMenuLabel className={cn("pb-0.5 text-xs text-muted-foreground font-normal", groupLabelCls, option.groupLabelCls)}>
                  {option.group}
                </DropdownMenuLabel>

                {option.options.map((grOpt, j) => {
                  const v = getValue(grOpt)
                  return (
                    <CheckboxItem
                      key={getKey(grOpt, j)}
                      option={grOpt}
                      checked={checked.includes(v)}
                      className={itemCls}
                      indicatorAt={indicatorAt}
                      onCheckedChange={(checked) => onCheckedChange?.(v, checked)}
                    />
                  )
                })}
              </DropdownMenuGroup>
            )
          }

          if (isInputSubMenu(option)) {
            return (
              <CheckboxSubMenu
                key={option.submenu}
                submenu={option}
                checked={checked}
                itemCls={itemCls}
                groupCls={groupCls}
                indicatorAt={indicatorAt}
                groupLabelCls={groupLabelCls}
                onCheckedChange={onCheckedChange}
              />
            )
          }

          const v = getValue(option)
          return (
            <CheckboxItem
              key={getKey(option, i)}
              option={option}
              checked={checked.includes(v)}
              className={itemCls}
              indicatorAt={indicatorAt}
              onCheckedChange={(checked) => onCheckedChange?.(v, checked)}
            />
          )
        })}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

type RadioSubMenuProps = commonSubMenuT & commonRadioProps & {
  submenu: inputSubMenuT
}
function RadioSubMenu({
  submenu,
  itemCls,
  groupCls,
  groupLabelCls,
  value = "",
  indicatorAt,
  onValueChange = () => { }
}: RadioSubMenuProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={cn(submenu.triggerCls)}>
        {submenu.submenu}
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent className={cn(submenu.contentCls)}>
        <DropdownMenuRadioGroup value={`${value}`} onValueChange={onValueChange}>
          {submenu.options.map((option, i) => {
            if (isInputGroupMenu(option)) {
              return (
                <DropdownMenuGroup key={option.group} className={cn(groupCls, option.className)}>
                  <DropdownMenuLabel className={cn("pb-0.5 text-xs text-muted-foreground font-normal", groupLabelCls, option.groupLabelCls)}>
                    {option.group}
                  </DropdownMenuLabel>

                  {option.options.map((grOpt, j) => (
                    <RadioItem
                      key={getKey(grOpt, j)}
                      option={grOpt}
                      className={itemCls}
                      indicatorAt={indicatorAt}
                    />
                  ))}
                </DropdownMenuGroup>
              )
            }

            if (isInputSubMenu(option)) {
              return (
                <RadioSubMenu
                  key={option.submenu}
                  value={value}
                  submenu={option}
                  itemCls={itemCls}
                  groupCls={groupCls}
                  indicatorAt={indicatorAt}
                  groupLabelCls={groupLabelCls}
                  onValueChange={onValueChange}
                />
              )
            }

            return (
              <RadioItem
                key={getKey(option, i)}
                option={option}
                className={itemCls}
                indicatorAt={indicatorAt}
              />
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

type DropdownWrapperProps = commonPropsT & {
  options: menuOptionsT
}
function DropdownWrapper({
  trigger,
  options,
  triggerCls,
  itemCls,
  groupCls,
  groupLabelCls,
  contentProps,
  onSelect,
  ...props
}: DropdownWrapperProps) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger className={cn(triggerCls)}>
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent {...contentProps}>
        {options.map((option, i) => {
          if (isGroupMenu(option)) {
            return (
              <DropdownMenuGroup key={option.group} className={cn(groupCls, option.className)}>
                <DropdownMenuLabel className={cn("pb-0.5 text-xs text-muted-foreground font-normal", groupLabelCls, option.groupLabelCls)}>
                  {option.group}
                </DropdownMenuLabel>

                {option.options.map((grOpt, j) => (
                  <Item
                    key={getKey(grOpt, j)}
                    option={grOpt}
                    className={itemCls}
                    onSelect={() => onSelect?.(getValue(grOpt))}
                  />
                ))}
              </DropdownMenuGroup>
            )
          }

          if (isSubMenu(option)) {
            return (
              <SubMenu
                key={option.submenu}
                submenu={option}
                itemCls={itemCls}
                groupCls={groupCls}
                groupLabelCls={groupLabelCls}
                onSelect={onSelect}
              />
            )
          }

          return (
            <Item
              key={getKey(option, i)}
              option={option}
              className={itemCls}
              onSelect={() => onSelect?.(getValue(option))}
            />
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type DropdownCheckboxWrapperProps = commonPropsT & commonCheckboxProps & {
  options: menuInputOptionsT
}
function DropdownCheckboxWrapper({
  trigger,
  options,

  triggerCls,
  contentProps,
  itemCls,
  groupCls,
  groupLabelCls,

  checked: o_checked,
  onCheckedChange: o_onCheckedChange,

  indicatorAt,
  ...props
}: DropdownCheckboxWrapperProps) {
  const [i_checked, setIChecked] = useState<allowedPrimitiveT[]>([])

  function i_Checked(v: allowedPrimitiveT, c: boolean) {
    setIChecked(prev => !c ? prev.filter(p => p !== v) : [...prev, v])
  }

  const checked = o_checked ?? i_checked
  const onCheckedChange = o_onCheckedChange ?? i_Checked

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger className={cn(triggerCls)}>
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent {...contentProps}>
        {options.map((option, i) => {
          if (isInputGroupMenu(option)) {
            return (
              <DropdownMenuGroup key={option.group} className={cn(groupCls, option.className)}>
                <DropdownMenuLabel className={cn("pb-0.5 text-xs text-muted-foreground font-normal", groupLabelCls, option.groupLabelCls)}>
                  {option.group}
                </DropdownMenuLabel>

                {option.options.map((grOpt, j) => {
                  const v = getValue(grOpt)
                  return (
                    <CheckboxItem
                      key={getKey(grOpt, j)}
                      option={grOpt}
                      checked={checked.includes(v)}
                      className={itemCls}
                      indicatorAt={indicatorAt}
                      onCheckedChange={(checked) => onCheckedChange?.(v, checked)}
                    />
                  )
                })}
              </DropdownMenuGroup>
            )
          }

          if (isInputSubMenu(option)) {
            return (
              <CheckboxSubMenu
                key={option.submenu}
                submenu={option}
                checked={checked}
                itemCls={itemCls}
                groupCls={groupCls}
                indicatorAt={indicatorAt}
                groupLabelCls={groupLabelCls}
                onCheckedChange={onCheckedChange}
              />
            )
          }

          const v = getValue(option)
          return (
            <CheckboxItem
              key={getKey(option, i)}
              option={option}
              checked={checked.includes(v)}
              className={itemCls}
              indicatorAt={indicatorAt}
              onCheckedChange={(checked) => onCheckedChange?.(v, checked)}
            />
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type DropdownRadioWrapperProps = commonPropsT & commonRadioProps & {
  options: menuInputOptionsT
}
function DropdownRadioWrapper({
  trigger,
  options,

  triggerCls,
  itemCls,
  groupCls,
  groupLabelCls,
  contentProps,

  value: o_value,
  onValueChange: o_onValueChange,

  indicatorAt,
  ...props
}: DropdownRadioWrapperProps) {
  const [i_value, setIValue] = useState<allowedPrimitiveT>("")

  const value = o_value ?? i_value
  const onValueChange = o_onValueChange ?? setIValue

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger className={cn(triggerCls)}>
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent {...contentProps}>
        <DropdownMenuRadioGroup value={`${value}`} onValueChange={v => onValueChange(parseAllowedPrimitive(v))}>
          {options.map((option, i) => {
            if (isInputGroupMenu(option)) {
              return (
                <DropdownMenuGroup key={option.group} className={cn(groupCls, option.className)}>
                  <DropdownMenuLabel className={cn("pb-0.5 text-xs text-muted-foreground font-normal", groupLabelCls, option.groupLabelCls)}>
                    {option.group}
                  </DropdownMenuLabel>

                  {option.options.map((grOpt, j) => (
                    <RadioItem
                      key={getKey(grOpt, j)}
                      option={grOpt}
                      className={itemCls}
                      indicatorAt={indicatorAt}
                    />
                  ))}
                </DropdownMenuGroup>
              )
            }

            if (isInputSubMenu(option)) {
              return (
                <RadioSubMenu
                  key={option.submenu}
                  value={value}
                  submenu={option}
                  itemCls={itemCls}
                  groupCls={groupCls}
                  indicatorAt={indicatorAt}
                  groupLabelCls={groupLabelCls}
                  onValueChange={v => onValueChange(parseAllowedPrimitive(v))}
                />
              )
            }

            return (
              <RadioItem
                key={getKey(option, i)}
                option={option}
                className={itemCls}
                indicatorAt={indicatorAt}
              />
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export {
  DropdownWrapper,
  DropdownCheckboxWrapper,
  DropdownRadioWrapper,
}
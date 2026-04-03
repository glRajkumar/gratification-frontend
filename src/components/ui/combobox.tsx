import * as React from "react"
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import { cn, getKey, getLabel, getValue, isGroup, isOption, isSeparator } from "@/lib/utils"

const ComboboxRoot = ComboboxPrimitive.Root

function ComboboxValue(props: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground",
        "transition-colors hover:bg-accent hover:text-foreground",
        "[&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4" />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground",
        "transition-colors hover:bg-accent hover:text-foreground",
        "[&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    >
      <XIcon className="size-3.5" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
}) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      className={cn(
        "flex h-9 w-full items-center gap-0.5 rounded-md border border-input bg-transparent ps-3 pe-1 text-sm shadow-xs",
        "transition-colors",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20",
        "dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        className,
      )}
    >
      <ComboboxPrimitive.Input
        disabled={disabled}
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      <div className="flex shrink-0 items-center ms-auto">
        {showClear && <ComboboxClear disabled={disabled} />}
        {showTrigger && <ComboboxTrigger disabled={disabled} />}
      </div>
      {children}
    </ComboboxPrimitive.InputGroup>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<ComboboxPrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset" | "anchor">) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "group/combobox-content relative overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
            "max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin)",
            "min-w-[max(var(--anchor-width),10rem)] data-[chips=true]:min-w-(--anchor-width)",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(18rem,calc(var(--available-height)-2.5rem))] overflow-y-auto overscroll-contain scroll-py-1 p-1",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "data-empty:hidden",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 ps-2 pe-8 text-sm outline-none",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="pointer-events-none absolute end-2 flex size-4 items-center justify-center text-foreground">
        <CheckIcon className="size-3.5" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("pb-1", className)}
      {...props}
    />
  )
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function ComboboxCollection(props: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden py-6 text-center text-sm text-muted-foreground",
        "group-data-empty/combobox-content:flex group-data-empty/combobox-content:w-full group-data-empty/combobox-content:justify-center",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function ComboboxChips({ className, ...props }: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-transparent ps-3 pe-1 py-1 text-sm shadow-xs",
        "transition-colors",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20",
        "dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & { showRemove?: boolean }) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-5.5 w-fit items-center gap-1 rounded-sm bg-secondary px-1.5 text-xs font-medium text-secondary-foreground whitespace-nowrap",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "has-disabled:pointer-events-none has-disabled:opacity-50",
        showRemove && "pe-0.5",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          data-slot="combobox-chip-remove"
          className={cn(
            "ms-0.5 flex size-4 items-center justify-center rounded-sm text-muted-foreground",
            "transition-colors hover:bg-accent hover:text-foreground",
            "[&_svg]:pointer-events-none",
          )}
          aria-label="Remove"
        >
          <XIcon className="size-3" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chips-input"
      className={cn(
        "min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

type OptionItemProps = {
  option: allowedPrimitiveT | optionT
  className?: string
}

function OptionItem({ option, className }: OptionItemProps) {
  const value = getValue(option)
  const label = getLabel(option)
  const optCls = isOption(option) ? option.className : undefined

  return (
    <ComboboxItem value={value} className={cn(className, optCls)}>
      {label}
    </ComboboxItem>
  )
}

type OptionsBodyProps = {
  item: optionsT[number]
  index: number
  itemCls?: string
  groupCls?: string
}

function OptionsBody({ item, index, itemCls, groupCls }: OptionsBodyProps) {
  if (isGroup(item)) {
    return (
      <ComboboxGroup
        items={item.options as (allowedPrimitiveT | optionT)[]}
        className={cn(groupCls, item.className)}
      >
        <ComboboxLabel>{item.group}</ComboboxLabel>
        <ComboboxCollection>
          {(opt: allowedPrimitiveT | optionT) => (
            <OptionItem key={getKey(opt, 0)} option={opt} className={cn(itemCls)} />
          )}
        </ComboboxCollection>
      </ComboboxGroup>
    )
  }

  if (isSeparator(item)) {
    return <ComboboxSeparator key={`sep-${index}`} />
  }

  return (
    <OptionItem
      key={getKey(item as allowedPrimitiveT | optionT, index)}
      option={item as allowedPrimitiveT | optionT}
      className={cn(itemCls)}
    />
  )
}

type ComboboxWrapperProps<
  Value = unknown,
  Multiple extends boolean | undefined = boolean | undefined
> = ComboboxPrimitive.Root.Props<Value, Multiple> & {
  isLoading?: boolean
  placeholder?: string
  emptyMessage?: string
  triggerCls?: string
  contentCls?: string
  groupCls?: string
  itemCls?: string
}

function ComboboxWrapper<Value, Multiple extends boolean | undefined = false>({
  isLoading,
  placeholder,
  emptyMessage,
  triggerCls,
  contentCls,
  groupCls,
  itemCls,
  multiple,
  disabled,
  ...props
}: ComboboxWrapperProps<Value, Multiple>) {
  const multiAnchor = React.useRef<HTMLDivElement | null>(null)

  return (
    <ComboboxRoot multiple={multiple} disabled={disabled} {...props}>
      {multiple ? (
        <ComboboxChips ref={multiAnchor} className={cn("w-full", triggerCls)}>
          <ComboboxValue>
            {(values: allowedPrimitiveT[]) => (
              <>
                {values?.map((v) => (
                  <ComboboxChip key={String(v)}>
                    {String(v)}
                  </ComboboxChip>
                ))}

                <ComboboxChipsInput
                  placeholder={placeholder}
                  disabled={disabled}
                />

                <div className="flex shrink-0 items-center ms-auto">
                  <ComboboxClear disabled={disabled} />
                  <ComboboxTrigger disabled={disabled} />
                </div>
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
      ) : (
        <ComboboxInput
          placeholder={placeholder}
          disabled={disabled}
          showTrigger
          showClear
          className={cn("w-full", triggerCls)}
        />
      )}

      <ComboboxContent anchor={multiple ? multiAnchor : undefined} className={contentCls}>
        <ComboboxEmpty>
          {isLoading ? "Loading..." : (emptyMessage ?? "No options found")}
        </ComboboxEmpty>

        <ComboboxList>
          {(item: optionsT[number], i: number) => (
            <OptionsBody
              key={
                isGroup(item)
                  ? item.group
                  : isSeparator(item)
                    ? `sep-${i}`
                    : String(getValue(item as allowedPrimitiveT | optionT))
              }
              item={item}
              index={i}
              groupCls={groupCls}
              itemCls={itemCls}
            />
          )}
        </ComboboxList>
      </ComboboxContent>
    </ComboboxRoot>
  )
}

export {
  ComboboxRoot,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxValue,
  useComboboxAnchor,
  ComboboxWrapper,
  type ComboboxWrapperProps,
}
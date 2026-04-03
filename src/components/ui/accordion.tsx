"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ms-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm h-(--accordion-panel-height) transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

type accordionItemT = {
  value: string
  trigger: React.ReactNode
  content: React.ReactNode
  className?: string
  triggerCls?: string
  contentCls?: string
  disabled?: boolean
}

type accordionItemsT = accordionItemT[]

type accordionWrapperProps = {
  items: accordionItemsT
  itemCls?: string
  triggerCls?: string
  contentCls?: string
  collapsible?: boolean
} & Omit<React.ComponentProps<typeof AccordionPrimitive.Root>, "type" | "collapsible">

function AccordionWrapper({
  items,
  itemCls,
  triggerCls,
  contentCls,
  ...props
}: accordionWrapperProps) {
  return (
    <Accordion {...(props)}>
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className={cn(itemCls, item.className)}
          disabled={item.disabled}
        >
          <AccordionTrigger className={cn("items-center justify-start gap-2", triggerCls, item.triggerCls)}>
            {item.trigger}
          </AccordionTrigger>

          <AccordionContent className={cn(contentCls, item.contentCls)}>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionWrapper,
  type accordionItemT,
  type accordionItemsT,
}

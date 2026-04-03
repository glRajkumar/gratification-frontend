import * as React from "react"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn("transition-colors hover:text-foreground", className),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  )
}

type breadcrumbItemT = string | {
  label: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

type breadcrumbItemsT = breadcrumbItemT[]

type base = {
  itemCls?: string
  linkCls?: string
  pageCls?: string
}

type listBase = base & {
  separator?: React.ReactNode
  separatorCls?: string
}

type itemProps = base & {
  item: breadcrumbItemT
  isLast: boolean
}
function Item({
  item: itemObj,
  isLast,
  itemCls,
  linkCls,
  pageCls,
}: itemProps) {
  const item = typeof itemObj === "string" ? { label: itemObj } : itemObj

  return (
    <BreadcrumbItem className={cn(itemCls, item?.className)}>
      {isLast
        ? <BreadcrumbPage className={cn(pageCls)}>{item?.label}</BreadcrumbPage>
        : Object?.keys(item)?.length > 2
          ? <BreadcrumbLink
            {...item}
            className={cn("cursor-pointer", linkCls)}
          >
            {item?.label}
          </BreadcrumbLink>
          : <span className={cn(linkCls)}>{item?.label}</span>
      }
    </BreadcrumbItem>
  )
}

type fullItemsProps = listBase & {
  items: breadcrumbItemsT
}
function BreadcrumbFullItems({
  items,
  separator,
  separatorCls,
  ...rest
}: fullItemsProps) {
  return items.map((item, index) => {
    const isLast = index === items.length - 1

    return (
      <React.Fragment key={index}>
        <Item
          item={item}
          isLast={isLast}
          {...rest}
        />
        {!isLast && (
          <BreadcrumbSeparator className={cn(separatorCls)}>
            {separator}
          </BreadcrumbSeparator>
        )}
      </React.Fragment>
    )
  })
}

type dropdownProps = listBase & {
  hiddenItems: breadcrumbItemsT
  dropdownCls?: string
}
function BreadcrumbDropdown({
  hiddenItems,
  dropdownCls,
}: dropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BreadcrumbEllipsis />
      </DropdownMenuTrigger>

      <DropdownMenuContent className={cn(dropdownCls)}>
        {hiddenItems.map((itemObj, index) => {
          const item = typeof itemObj === "string" ? { label: itemObj } : itemObj
          return (
            <DropdownMenuItem
              key={`hidden-${index}`}
              render={item?.href
                ? <a href={item?.href} className="w-full">{item?.label}</a>
                : item?.onClick
                  ? <button onClick={item?.onClick} className="w-full text-start">{item?.label}</button>
                  : <span>{item?.label}</span>
              }
            />
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type wrapperProps = listBase & {
  items: breadcrumbItemsT
  maxItems?: number
  itemsBeforeCollapse?: number
  itemsAfterCollapse?: number
  collapseType?: "ellipsis" | "dropdown"
  containerCls?: string
  dropdownCls?: string
  listCls?: string
}
function BreadcrumbWrapper({
  items,
  maxItems = 4,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  collapseType = "ellipsis",
  containerCls,
  listCls,
  dropdownCls,
  separator,
  separatorCls,
  ...rest
}: wrapperProps) {
  const shouldCollapse = maxItems && items.length > maxItems

  if (!shouldCollapse) {
    return (
      <Breadcrumb className={cn(containerCls)}>
        <BreadcrumbList className={cn(listCls)}>
          <BreadcrumbFullItems
            items={items}
            separator={separator}
            separatorCls={separatorCls}
            {...rest}
          />
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const startItems = items.slice(0, itemsBeforeCollapse)
  const endItems = items.slice(-itemsAfterCollapse)
  const hiddenItems = items.slice(itemsBeforeCollapse, -itemsAfterCollapse)

  return (
    <Breadcrumb className={containerCls}>
      <BreadcrumbList className={listCls}>
        {startItems.map((item, index) => (
          <React.Fragment key={`start-${index}`}>
            <Item
              item={item}
              isLast={false}
              {...rest}
            />
            <BreadcrumbSeparator className={cn(separatorCls)}>
              {separator}
            </BreadcrumbSeparator>
          </React.Fragment>
        ))}

        <BreadcrumbItem>
          {
            collapseType === "ellipsis"
              ? <BreadcrumbEllipsis />
              : <BreadcrumbDropdown
                hiddenItems={hiddenItems}
                dropdownCls={dropdownCls}
              />
          }
        </BreadcrumbItem>

        {endItems.map((item, index) => {
          const isLast = index === endItems.length - 1

          return (
            <React.Fragment key={`end-${index}`}>
              <BreadcrumbSeparator className={cn(separatorCls)}>
                {separator}
              </BreadcrumbSeparator>
              <Item
                item={item}
                isLast={isLast}
                {...rest}
              />
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbWrapper,
  type breadcrumbItemT,
  type breadcrumbItemsT,
}

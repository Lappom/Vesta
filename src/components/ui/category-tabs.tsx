"use client"

import { cn } from "@/lib/utils"

type TabItem = {
  id: string
  label: string
}

type CategoryTabsProps = {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  className?: string
  "aria-label"?: string
}

export function CategoryTabs({
  items,
  value,
  onChange,
  className,
  "aria-label": ariaLabel = "Filtres",
}: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {items.map((item) => {
        const active = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "min-h-9 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-surface-card text-ink"
                : "text-muted-foreground hover:text-ink"
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

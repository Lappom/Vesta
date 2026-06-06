"use client"

import { cn } from "@/lib/utils"

type TabItem = {
  id: string
  label: string
  /** Accent dot color (hex) — category or status hint */
  accent?: string
}

type CategoryTabsProps = {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  className?: string
  label?: string
  "aria-label"?: string
}

export function FilterGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-hairline/60 bg-surface-soft/50 p-3 sm:space-y-4 sm:p-4",
        "space-y-3",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CategoryTabs({
  items,
  value,
  onChange,
  className,
  label,
  "aria-label": ariaLabel = "Filtres",
}: CategoryTabsProps) {
  return (
    <div className={cn("min-w-0 space-y-2", className)}>
      {label ? (
        <p className="text-caption-uppercase px-0.5 text-muted-foreground">
          {label}
        </p>
      ) : null}

      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex min-w-0 flex-wrap gap-1 rounded-2xl bg-surface-soft p-1"
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
                "inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2.5 sm:px-4",
                "min-h-11 text-sm font-medium transition-[color,background-color,transform]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset",
                "active:scale-[0.97] sm:min-h-9 sm:py-2",
                active
                  ? "bg-surface-card text-ink shadow-[0_1px_0_rgba(10,10,10,0.04)]"
                  : "text-muted-foreground hover:text-ink"
              )}
            >
              {item.accent ? (
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full transition-transform",
                    active ? "scale-110" : "opacity-70"
                  )}
                  style={{ backgroundColor: item.accent }}
                />
              ) : null}
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

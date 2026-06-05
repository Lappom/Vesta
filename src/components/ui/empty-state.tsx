import { cn } from "@/lib/utils"

type EmptyStateProps = {
  illustration?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  illustration,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl bg-surface-soft px-6 py-12 text-center",
        className
      )}
    >
      {illustration ? (
        <div className="mb-6 w-40 opacity-90">{illustration}</div>
      ) : null}
      <h3 className="font-display text-display-sm text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

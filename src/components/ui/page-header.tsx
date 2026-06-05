import { cn } from "@/lib/utils"

type PageHeaderProps = {
  caption?: string
  title: string
  description?: string
  illustration?: React.ReactNode
  className?: string
}

export function PageHeader({
  caption,
  title,
  description,
  illustration,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        {caption ? (
          <p className="text-caption-uppercase text-muted-foreground">{caption}</p>
        ) : null}
        <h1 className="text-display-sm text-ink">{title}</h1>
        {description ? (
          <p className="max-w-prose text-sm text-body">{description}</p>
        ) : null}
      </div>
      {illustration ? (
        <div className="hidden w-32 shrink-0 sm:block lg:w-40">{illustration}</div>
      ) : null}
    </header>
  )
}

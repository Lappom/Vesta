import { cn } from "@/lib/utils"

type HeroBandProps = {
  children: React.ReactNode
  illustration?: React.ReactNode
  className?: string
}

export function HeroBand({ children, illustration, className }: HeroBandProps) {
  return (
    <section
      className={cn(
        "grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-8",
        className
      )}
    >
      <div className="lg:col-span-7">{children}</div>
      {illustration ? (
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl bg-surface-soft p-4 lg:p-6">
            {illustration}
          </div>
        </div>
      ) : null}
    </section>
  )
}

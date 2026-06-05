import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statCardVariants = cva("rounded-xl p-5 lg:p-6", {
  variants: {
    variant: {
      pink: "bg-brand-pink text-white",
      teal: "bg-brand-teal text-white",
      lavender: "bg-brand-lavender text-ink",
      peach: "bg-brand-peach text-ink",
      ochre: "bg-brand-ochre text-ink",
      cream: "bg-surface-card text-ink",
    },
  },
  defaultVariants: {
    variant: "cream",
  },
})

type StatCardProps = React.ComponentProps<"div"> &
  VariantProps<typeof statCardVariants> & {
    label: string
    value: string | number
    detail?: string
  }

function StatCard({
  className,
  variant,
  label,
  value,
  detail,
  ...props
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), className)} {...props}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="mt-2 font-display text-display-sm">{value}</p>
      {detail ? <p className="mt-1 text-sm opacity-80">{detail}</p> : null}
    </div>
  )
}

export { StatCard, statCardVariants }

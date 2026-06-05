import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const featureCardVariants = cva("rounded-xl p-6 lg:p-8", {
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

type FeatureCardProps = React.ComponentProps<"div"> &
  VariantProps<typeof featureCardVariants>

function FeatureCard({ className, variant, ...props }: FeatureCardProps) {
  return (
    <div
      className={cn(featureCardVariants({ variant }), className)}
      {...props}
    />
  )
}

function FeatureCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-snug", className)}
      {...props}
    />
  )
}

function FeatureCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("mt-2 text-sm leading-relaxed opacity-90", className)} {...props} />
  )
}

export {
  FeatureCard,
  FeatureCardTitle,
  FeatureCardDescription,
  featureCardVariants,
}

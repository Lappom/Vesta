import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[transform,background-color,color,opacity,border-color] duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#1f1f1f]",
        outline:
          "border-hairline bg-background text-ink hover:bg-surface-soft",
        secondary:
          "border-hairline bg-surface-card text-ink hover:bg-surface-strong",
        ghost:
          "text-muted-foreground hover:bg-surface-soft hover:text-ink",
        destructive:
          "bg-brand-coral text-white hover:bg-brand-coral/90 focus-visible:ring-brand-coral/30",
        link: "text-ink underline-offset-4 hover:underline",
        "on-color":
          "border-hairline bg-background text-ink shadow-sm hover:bg-surface-soft",
        accent:
          "bg-brand-lavender text-ink hover:bg-brand-lavender/90",
        success:
          "bg-brand-mint text-ink hover:bg-brand-mint/90",
        progress:
          "bg-brand-ochre text-ink hover:bg-brand-ochre/90",
      },
      size: {
        default: "h-11 gap-1.5 px-5",
        xs: "h-8 gap-1 rounded-sm px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 rounded-md px-4 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 px-6",
        icon: "size-11",
        "icon-xs": "size-8 rounded-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-md",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

"use client"

import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>
>(function Button(
  { className, variant = "default", size = "default", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})

export { Button, buttonVariants }

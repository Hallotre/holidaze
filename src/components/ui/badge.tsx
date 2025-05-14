import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus:ring-2 focus:ring-pink-400 active:ring-2 active:ring-pink-500 transition-colors overflow-hidden cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-2 border-pink-600 bg-pink-600 text-white shadow-sm hover:bg-pink-700 hover:border-pink-700",
        secondary:
          "border-transparent bg-pink-100 text-pink-700 hover:bg-pink-200",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline:
          "border-2 border-pink-300 text-pink-600 hover:border-pink-400 hover:bg-pink-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

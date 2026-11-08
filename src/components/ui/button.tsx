import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[0.016em] transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-hover-blurple focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic",
  {
    variants: {
      variant: {
        default:
          "rounded-[12px] bg-blurple text-snow hover:bg-dark-blurple",
        secondary:
          "rounded-[12px] border border-not-quite-black bg-snow text-not-quite-black hover:bg-off-white",
        outline:
          "rounded-[12px] border border-line bg-transparent text-snow hover:border-fog hover:bg-snow/5",
        world:
          "rounded-[12px] bg-[var(--w-a)] text-[var(--w-a-text)] hover:brightness-110",
        ghost:
          "rounded-[12px] bg-transparent text-snow hover:bg-snow/10",
        login:
          "rounded-[16px] border border-void bg-snow text-void hover:bg-off-white",
        destructive:
          "rounded-[12px] bg-ekko-red text-snow hover:bg-ekko-red/90",
        link: "text-snow underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-base",
        sm: "h-9 rounded-[12px] px-4 text-sm",
        lg: "min-h-14 rounded-[12px] px-6 py-[19.5px] text-base",
        icon: "size-11 rounded-[12px]",
        "icon-sm": "size-8 rounded-[12px]",
        "icon-lg": "size-12 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

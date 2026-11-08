import * as React from "react"
import { cn } from "@/lib/utils"

const Input = ({ className, type, ...props }: React.ComponentProps<"input">) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-[12px] border border-dim-grey bg-not-quite-black px-4 py-3 text-base text-snow outline-none transition-colors placeholder:text-greyple focus-visible:border-blurple focus-visible:ring-2 focus-visible:ring-hover-blurple/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }

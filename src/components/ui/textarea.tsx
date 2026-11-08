import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = ({ className, ...props }: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content min-h-28 w-full rounded-[12px] border border-dim-grey bg-not-quite-black px-4 py-3 text-base text-snow outline-none transition-colors placeholder:text-greyple focus-visible:border-blurple focus-visible:ring-2 focus-visible:ring-hover-blurple/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

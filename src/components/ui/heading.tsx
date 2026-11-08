import { cn } from "@/lib/utils"

type HeadingLevel = "h1" | "h2" | "h3"

interface HeadingProps {
  as?: HeadingLevel
  size?: "sm" | "md" | "lg" | "display"
  className?: string
  children: React.ReactNode
}

const sizeClasses: Record<NonNullable<HeadingProps["size"]>, string> = {
  sm: "text-3xl sm:text-4xl",
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-6xl",
  display: "text-5xl sm:text-6xl lg:text-7xl",
}

export const Heading = ({
  as: Tag = "h2",
  size = "md",
  className,
  children,
}: HeadingProps) => {
  return (
    <Tag className={cn("heading-display", sizeClasses[size], className)}>
      {children}
    </Tag>
  )
}

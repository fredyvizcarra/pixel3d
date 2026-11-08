import { cn } from "@/lib/utils"

interface Props {
  name: string
  as?: "h1" | "h2" | "h3"
  className?: string
}

/** Título de colección con la última palabra en el color de acento del mundo */
export const WorldTitle = ({ name, as: Tag = "h2", className }: Props) => {
  const words = name.trim().split(/\s+/)
  const last = words.length > 1 ? words.pop() : null

  return (
    <Tag className={cn("world-title", className)}>
      {words.join(" ")}
      {last && (
        <>
          {" "}
          <span className="hl">{last}</span>
        </>
      )}
    </Tag>
  )
}

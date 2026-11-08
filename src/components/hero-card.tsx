"use client"

import Link from "next/link"
import { useState } from "react"

interface HeroCardProps {
  href: string
  imageSrc: string
  imageAlt: string
  number: string
  title: string
  description: string
  hoverTransform?: string
}

export function HeroCard({
  href,
  imageSrc,
  imageAlt,
  number,
  title,
  description,
  hoverTransform = "scale(1.07) rotate(1.25deg)",
}: HeroCardProps) {
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => {
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  return (
    <Link
      href={href}
      aria-label={imageAlt}
      className="group relative block min-h-[520px] overflow-hidden rounded-3xl border border-white/10 bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        role="img"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: hovered ? 0.95 : 0.8,
          filter: hovered
            ? "grayscale(0) saturate(1)"
            : "grayscale(0.35) saturate(0.85)",
          transform: hovered ? hoverTransform : "scale(1.04) translate3d(0,0,0)",
          transition: [
            "transform 7000ms cubic-bezier(0.22, 1, 0.36, 1)",
            "filter 2200ms cubic-bezier(0.22, 1, 0.36, 1)",
            "opacity 2200ms cubic-bezier(0.22, 1, 0.36, 1)",
          ].join(", "),
          willChange: "transform, filter, opacity",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

      <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-8 sm:hidden">
        <div className="text-3xl text-zinc-200">{number}</div>
        <div>
          <h4 className="heading-display mb-4 text-[30px]">{title}</h4>
          <p className="text-[16px] font-light leading-relaxed text-zinc-200">
            {description}
          </p>
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="absolute top-12 left-12 z-10 text-3xl text-zinc-200">
          {number}
        </div>
        <div className="absolute top-1/2 left-12 z-10 -translate-y-1/2">
          <h4 className="heading-display text-[30px]">{title}</h4>
        </div>
        <div className="absolute top-1/2 right-12 left-12 z-10 translate-y-12">
          <p className="text-[18px] font-light leading-relaxed text-zinc-200">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}

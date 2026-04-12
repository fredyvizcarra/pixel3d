"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HeroCardProps {
  href: string;
  imageSrc: string;
  imageAlt: string;
  number: string;
  title: string;
  description: string;
  hoverTransform?: string;
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
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className="group relative min-h-[520px] overflow-hidden rounded-3xl border border-white/10 bg-black block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: hovered ? 0.95 : 0.7,
          filter: hovered ? "grayscale(0) saturate(1)" : "grayscale(1) saturate(0)",
          transform: hovered ? hoverTransform : "scale(1) translate3d(0,0,0)",
          transition: [
            "transform 7000ms cubic-bezier(0.22, 1, 0.36, 1)",
            "filter 2200ms cubic-bezier(0.22, 1, 0.36, 1)",
            "opacity 2200ms cubic-bezier(0.22, 1, 0.36, 1)",
          ].join(", "),
          willChange: "transform, filter, opacity",
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />

      {/* mobile */}
      <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:hidden">
        <div className="text-3xl text-zinc-200">{number}</div>
        <div>
          <h4 className="mb-4 text-[30px] font-bold text-white">{title}</h4>
          <p className="text-[16px] font-light leading-relaxed text-zinc-200">
            {description}
          </p>
        </div>
      </div>

      {/* desktop */}
      <div className="hidden sm:block">
        <div className="absolute left-12 top-12 z-10 text-3xl text-zinc-200">
          {number}
        </div>
        <div className="absolute left-12 top-1/2 z-10 -translate-y-1/2">
          <h4 className="text-[30px] font-bold text-white">{title}</h4>
        </div>
        <div className="absolute left-12 right-12 top-1/2 z-10 translate-y-12">
          <p className="text-[18px] font-light leading-relaxed text-zinc-200">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

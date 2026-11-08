import type { CollectionThemeKey } from "@/lib/collection-themes"

interface Props {
  theme: CollectionThemeKey
  className?: string
}

/** Ilustración decorativa de cada mundo (sin logos ni marcas registradas) */
export const WorldArt = ({ theme, className }: Props) => {
  if (theme === "gameday") {
    return (
      <svg viewBox="0 0 200 140" className={className} aria-hidden="true">
        <g transform="rotate(-20 100 70)">
          <ellipse cx="100" cy="70" rx="88" ry="50" fill="#7a3b1c" />
          <ellipse cx="100" cy="70" rx="88" ry="50" fill="none" stroke="#4d230f" strokeWidth="4" />
          <path d="M28 50 Q100 30 172 50 M28 90 Q100 110 172 90" stroke="#f4f6f2" strokeWidth="6" fill="none" opacity=".9" />
          <rect x="62" y="64" width="76" height="6" rx="3" fill="#f4f6f2" />
          <g fill="#f4f6f2">
            <rect x="70" y="56" width="5" height="22" rx="2" />
            <rect x="84" y="56" width="5" height="22" rx="2" />
            <rect x="98" y="56" width="5" height="22" rx="2" />
            <rect x="112" y="56" width="5" height="22" rx="2" />
            <rect x="126" y="56" width="5" height="22" rx="2" />
          </g>
        </g>
      </svg>
    )
  }

  if (theme === "navidad") {
    return (
      <svg viewBox="0 0 160 180" className={className} aria-hidden="true">
        <line x1="80" y1="0" x2="80" y2="28" stroke="#e6b655" strokeWidth="3" />
        <rect x="66" y="26" width="28" height="18" rx="4" fill="#e6b655" />
        <circle cx="80" cy="108" r="66" fill="#c8303c" />
        <g stroke="#f6f0e2" strokeWidth="5" fill="none" opacity=".85">
          <path d="M18 90 Q80 70 142 90" />
          <path d="M14 112 Q80 92 146 112" />
          <path d="M20 134 Q80 114 140 134" />
        </g>
        <circle cx="58" cy="82" r="10" fill="#fff" opacity=".35" />
      </svg>
    )
  }

  if (theme === "magico") {
    return (
      <svg viewBox="0 0 160 180" className={className} aria-hidden="true">
        <g transform="rotate(28 80 90)">
          <rect x="74" y="10" width="12" height="150" rx="5" fill="#5a3a22" />
          <rect x="72" y="110" width="16" height="50" rx="6" fill="#3d2616" />
          <g fill="#d9b25f">
            <rect x="70" y="112" width="20" height="4" rx="2" />
            <rect x="70" y="124" width="20" height="4" rx="2" />
          </g>
        </g>
        <g fill="#d9b25f">
          <path d="M30 30 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" />
          <path d="M128 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" opacity=".8" />
          <circle cx="46" cy="70" r="2.5" />
          <circle cx="118" cy="16" r="2" />
        </g>
      </svg>
    )
  }

  // Tema simple: cubo isométrico de voxels en el color de acento
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      {[
        [80, 40],
        [56, 54],
        [104, 54],
        [80, 68],
        [56, 82],
        [104, 82],
        [80, 96],
      ].map(([x, y], index) => (
        <g key={index} transform={`translate(${x} ${y})`}>
          <path d="M0 -14 L24 0 L0 14 L-24 0Z" fill="var(--w-a)" style={{ filter: "brightness(1.35)" }} />
          <path d="M-24 0 L0 14 L0 42 L-24 28Z" fill="var(--w-a)" style={{ filter: "brightness(0.75)" }} />
          <path d="M24 0 L0 14 L0 42 L24 28Z" fill="var(--w-a)" style={{ filter: "brightness(0.5)" }} />
        </g>
      ))}
    </svg>
  )
}

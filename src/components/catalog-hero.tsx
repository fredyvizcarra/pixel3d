import { Heading } from "@/components/ui/heading"

interface CatalogHeroProps {
  kicker: string
  title: string
  description: string
  allCaps?: boolean
}

export const CatalogHero = ({
  kicker,
  title,
  description,
  allCaps = true,
}: CatalogHeroProps) => {
  return (
    <div className="relative isolate overflow-hidden rounded-b-[24px] bg-void">
      <video
        src="/hero/hero-video.mp4"
        className="h-64 w-full object-cover opacity-50 sm:h-72"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cosmic via-cosmic/70 to-cosmic/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-fog">
          {kicker}
        </p>
        {allCaps ? (
          <Heading as="h1" size="md">
            {title}
          </Heading>
        ) : (
          <h1 className="font-display text-4xl font-extrabold text-snow sm:text-5xl">
            {title}
          </h1>
        )}
        <p className="mt-4 max-w-2xl text-base text-fog">{description}</p>
      </div>
    </div>
  )
}

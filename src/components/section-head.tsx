interface Props {
  title: string
  description?: string
  id?: string
}

export const SectionHead = ({ title, description, id }: Props) => {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <h2
        id={id}
        className="font-display text-[clamp(1.6rem,3.6vw,2.4rem)] leading-[1.05] font-bold tracking-[-0.02em] text-balance uppercase"
      >
        {title}
      </h2>
      {description && <p className="max-w-[44ch] text-fog">{description}</p>}
    </div>
  )
}

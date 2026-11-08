export const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export const buildUniqueSlug = (name: string, suffix: string): string => {
  const base = slugify(name) || "producto"
  const shortSuffix = suffix.slice(-8).toLowerCase()
  return `${base}-${shortSuffix}`
}

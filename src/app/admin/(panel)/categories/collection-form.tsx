"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import type { Category } from "@/db/schema"
import { COLLECTION_THEMES, resolveTheme } from "@/lib/collection-themes"
import { saveCategory } from "./actions"

interface Props {
  collection?: Category & { productCount?: number }
}

const inputClass = "admin-input"

const SubmitButton = ({ isEditing }: { isEditing: boolean }) => {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-[12px] bg-blurple px-5 py-2 text-sm font-semibold text-snow hover:bg-dark-blurple disabled:opacity-60"
    >
      {pending ? "Guardando..." : isEditing ? "Guardar" : "Crear colección"}
    </button>
  )
}

export const CollectionForm = ({ collection }: Props) => {
  const isEditing = Boolean(collection)
  const idPrefix = collection?.id ?? "new"
  const [theme, setTheme] = useState(resolveTheme(collection?.theme))
  const [accent, setAccent] = useState(collection?.accentColor ?? "#662d91")

  return (
    <form action={saveCategory} className="grid gap-4">
      {collection && <input type="hidden" name="id" value={collection.id} />}

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <label className="admin-label" htmlFor={`${idPrefix}-name`}>
          Nombre
          <input
            id={`${idPrefix}-name`}
            name="name"
            required
            defaultValue={collection?.name}
            placeholder="Ej. Game Day"
            className={inputClass}
          />
        </label>
        <label className="admin-label" htmlFor={`${idPrefix}-sort`}>
          Orden
          <input
            id={`${idPrefix}-sort`}
            name="sortOrder"
            type="number"
            defaultValue={collection?.sortOrder ?? 0}
            className={inputClass}
          />
        </label>
      </div>

      <label className="admin-label" htmlFor={`${idPrefix}-tagline`}>
        Frase corta
        <input
          id={`${idPrefix}-tagline`}
          name="tagline"
          defaultValue={collection?.tagline ?? ""}
          maxLength={120}
          placeholder="Ej. Cascos, trofeos y accesorios para el domingo."
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <label className="admin-label" htmlFor={`${idPrefix}-theme`}>
          Tema visual
          <select
            id={`${idPrefix}-theme`}
            name="theme"
            value={theme}
            onChange={(event) => setTheme(resolveTheme(event.target.value))}
            className={inputClass}
          >
            {COLLECTION_THEMES.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="admin-hint">
            {COLLECTION_THEMES.find((option) => option.key === theme)?.description}
          </span>
        </label>

        {theme === "default" && (
          <label className="admin-label" htmlFor={`${idPrefix}-accent`}>
            Color de acento
            <span className="flex items-center gap-2">
              <input
                id={`${idPrefix}-accent`}
                name="accentColor"
                type="color"
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
                className="h-10 w-14 cursor-pointer rounded-[10px] border border-dim-grey bg-cosmic p-1"
              />
              <span className="font-mono text-xs text-fog">{accent}</span>
            </span>
          </label>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm" htmlFor={`${idPrefix}-featured`}>
          <input
            id={`${idPrefix}-featured`}
            name="featured"
            type="checkbox"
            defaultChecked={collection?.featured ?? true}
            className="size-4 accent-[#662d91]"
          />
          Mostrar como mundo destacado en el inicio
        </label>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  )
}

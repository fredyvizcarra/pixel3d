"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import type { Category } from "@/db/schema"
import { COLLECTION_THEMES, resolveTheme } from "@/lib/collection-themes"
import { saveCategory } from "./actions"

interface Props {
  collection?: Category & { productCount?: number }
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"

const SubmitButton = ({ isEditing }: { isEditing: boolean }) => {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-[#5865f2] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3442d9] disabled:opacity-60"
    >
      {pending ? "Guardando..." : isEditing ? "Guardar" : "Crear colección"}
    </button>
  )
}

export const CollectionForm = ({ collection }: Props) => {
  const isEditing = Boolean(collection)
  const idPrefix = collection?.id ?? "new"
  const [theme, setTheme] = useState(resolveTheme(collection?.theme))
  const [accent, setAccent] = useState(collection?.accentColor ?? "#5865f2")

  return (
    <form action={saveCategory} className="grid gap-4">
      {collection && <input type="hidden" name="id" value={collection.id} />}

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={`${idPrefix}-name`}>
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
        <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={`${idPrefix}-sort`}>
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

      <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={`${idPrefix}-tagline`}>
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
        <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={`${idPrefix}-theme`}>
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
          <span className="text-xs font-normal text-slate-500">
            {COLLECTION_THEMES.find((option) => option.key === theme)?.description}
          </span>
        </label>

        {theme === "default" && (
          <label className="grid gap-1.5 text-sm font-medium text-slate-700" htmlFor={`${idPrefix}-accent`}>
            Color de acento
            <span className="flex items-center gap-2">
              <input
                id={`${idPrefix}-accent`}
                name="accentColor"
                type="color"
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
              />
              <span className="font-mono text-xs text-slate-500">{accent}</span>
            </span>
          </label>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700" htmlFor={`${idPrefix}-featured`}>
          <input
            id={`${idPrefix}-featured`}
            name="featured"
            type="checkbox"
            defaultChecked={collection?.featured ?? true}
            className="size-4 accent-[#5865f2]"
          />
          Mostrar como mundo destacado en el inicio
        </label>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  )
}

import { Button } from "@/components/ui/button"
import { importProductsCsv } from "./actions"

export const dynamic = "force-dynamic"

export default function ImportProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Importar productos
        </h1>
        <p className="mt-1 max-w-2xl text-slate-500">
          Sube un CSV con encabezados: name, description, price, stock,
          category, images. El precio va en pesos (ej. 250 o 250.00). Las
          imágenes se separan con |.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <pre className="overflow-x-auto rounded-2xl bg-slate-50 p-4 text-xs text-slate-700">
{`name,description,price,stock,category,images
Gengar,Figura 3D,250,10,Figuras,/products/gengar/1.webp|/products/gengar/2.webp
Separador mágico,Separador de libros,80,15,Papelería,/products/separador/1.webp`}
        </pre>

        <form action={importProductsCsv} className="mt-6 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">
              Archivo CSV
            </span>
            <input
              type="file"
              name="file"
              accept=".csv,text/csv"
              required
              aria-label="Archivo CSV de productos"
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-purple-700"
            />
          </label>
          <Button
            type="submit"
            className="rounded-full bg-[#662d91] hover:bg-purple-700"
          >
            Importar
          </Button>
        </form>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { importProductsCsv } from "./actions"

export const dynamic = "force-dynamic"

export default function ImportProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Catálogo</p>
        <h1 className="admin-h1 mt-2">Importar productos</h1>
        <p className="mt-2 max-w-2xl text-fog">
          Sube un CSV con encabezados: name, description, price, stock,
          category, images. El precio va en pesos (ej. 250 o 250.00). Las
          imágenes se separan con |.
        </p>
      </div>

      <div className="admin-card">
        <pre className="overflow-x-auto rounded-[12px] border border-line bg-cosmic p-4 font-mono text-xs text-fog">
{`name,description,price,stock,category,images
Gengar,Figura 3D,250,10,Figuras,/products/gengar/1.webp|/products/gengar/2.webp
Separador mágico,Separador de libros,80,15,Papelería,/products/separador/1.webp`}
        </pre>

        <form action={importProductsCsv} className="mt-6 space-y-4">
          <label className="admin-label" htmlFor="csv-file">
            Archivo CSV
            <input
              type="file"
              name="file"
              accept=".csv,text/csv"
              required
              id="csv-file"
              className="block w-full text-sm text-fog file:mr-4 file:rounded-[10px] file:border-0 file:bg-blurple file:px-4 file:py-2 file:text-sm file:font-medium file:text-snow"
            />
          </label>
          <Button type="submit">
            Importar
          </Button>
        </form>
      </div>
    </div>
  )
}

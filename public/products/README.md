# Estructura de Imágenes de Productos

Este directorio contiene las imágenes locales de los productos.

## Estructura de Carpetas

Crea una carpeta por cada producto usando el **ID del producto de Stripe**:

```
products/
  prod_TGKUeXrau7h5aW/
    img1.jpg
    img2.jpg
    img3.jpg
    img4.jpg
  prod_ABC123XYZ/
    img1.jpg
    img2.jpg
    img3.jpg
```

## Cómo Agregar Imágenes

1. **Obtén el ID del producto de Stripe**
   - Ve a tu dashboard de Stripe
   - Copia el ID del producto (ej: `prod_TGKUeXrau7h5aW`)

2. **Crea la carpeta del producto**
   ```bash
   mkdir public/products/prod_TGKUeXrau7h5aW
   ```

3. **Agrega las imágenes**
   - Nombra las imágenes: `img1.jpg`, `img2.jpg`, `img3.jpg`, etc.
   - Optimiza las imágenes antes de subirlas (recomendado: 1200x1200px, <300KB)

4. **Actualiza el mapeo**
   - Abre `src/lib/product-images.ts`
   - Agrega el mapeo:
   ```typescript
   "prod_TGKUeXrau7h5aW": [
     "/products/prod_TGKUeXrau7h5aW/img1.jpg",
     "/products/prod_TGKUeXrau7h5aW/img2.jpg",
     "/products/prod_TGKUeXrau7h5aW/img3.jpg",
     "/products/prod_TGKUeXrau7h5aW/img4.jpg",
   ],
   ```

## Recomendaciones

- **Formato**: JPG o WebP (WebP es mejor para web)
- **Tamaño**: 1200x1200px máximo
- **Peso**: 100-300KB por imagen
- **Cantidad**: 3-4 imágenes por producto (como mencionaste)
- **Nombres**: Usa nombres consistentes (`img1`, `img2`, etc.)

## Optimización de Imágenes

Antes de subir, optimiza con:
- [TinyPNG](https://tinypng.com/)
- [ImageOptim](https://imageoptim.com/)
- [Squoosh](https://squoosh.app/)




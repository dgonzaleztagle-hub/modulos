# pos/product-importer

Estado: usable inicial endurecido

## Origen

- `D:\proyectos\truckpos_new\src\utils\productImport.ts`
- `D:\proyectos\ICEBUIN\src\utils\excelParser.ts`
- `D:\proyectos\ICEBUIN\src\utils\imageLoader.ts`

## Propósito

Normalizar e importar catálogos de productos desde planillas con columnas variables.

## Enfoque

- parser reusable por fila
- mapping flexible de encabezados
- validación separada de la transformación
- parsing tabular reusable para filas ya leídas desde Excel/CSV
- inferencia automática de categorías para catálogos vivos
- mapeo determinístico de imágenes por SKU para publicaciones rápidas

## Pendiente

- parser CSV puro para backend/node
- hooks para categorías y variantes


## Estado real

Ya entrega parsing y validación portable para importación de productos, lectura tabular reusable, categorización automática y mapeo de imágenes por SKU para sembrar catálogos vivos desde una planilla.

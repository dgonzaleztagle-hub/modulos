# ICEBUIN

Repo origen: `D:\proyectos\ICEBUIN`

## Conclusión

- tipo: `catálogo / tooling de importación`
- lectura general: app frontend con utilidades de parsing de Excel, carga de imágenes y generación de descripciones para catálogo
- valor reusable real: `medio`
- valor como referencia: `medio`

## Lo rescatable

- parser de Excel para productos con detección de columnas y normalización
- utilidades de mapeo de imágenes por SKU
- scripts auxiliares de generación de descripciones y sitemap

## Estado en `MODULOS`

- la lógica más reusable de importación, categorización y mapeo por SKU quedó absorbida dentro de `pos/product-importer`

## Lo que no justifica una familia grande

- no aparece workflow comercial o operativo nuevo más allá de importación/catalogación
- el corazón reusable está más cerca de tooling de catálogo que de producto entero

## Veredicto

- registrar como fuente secundaria para importación/catalogación
- si más adelante se repite este patrón con otros repos, podría absorberse dentro de `product-importer` o una familia de catálogo

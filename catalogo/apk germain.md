# apk germain

Repo origen: `D:\proyectos\apk germain`

## Conclusión

- tipo: `carpeta auxiliar / distribución móvil`
- lectura general: artefactos Android ya compilados para la versión pública y la variante `cocina` de Germain
- valor reusable real: `bajo`
- valor como referencia: `medio`

## Lo rescatable

- patrón de empaquetado PWA/TWA hacia Android
- configuración de `assetlinks` para deep links y asociación de dominio con app Android
- separación de variantes de publicación (`principal` y `cocina`) sobre la misma base web

## Lo que no justifica extracción propia

- no contiene repo fuente ni lógica de negocio editable
- no contiene flujos móviles nativos nuevos; solo binarios compilados y material de firmado/publicación
- el valor está en el proceso de distribución, no en módulos de aplicación

## Veredicto

- mantener como referencia de publicación Android para PWAs
- no tratar como cantera de código reusable

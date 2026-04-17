# Caso: CorredoresPro

## Tipo

`real-estate-operativo`

## Qué resolvió

- portal público y portales por rol para arrendatario/propietario
- contratos de arriendo y firma electrónica
- alertas de mora con criterio legal
- publicación de propiedades a canales externos
- mensajería operacional hacia clientes
- tablero financiero con proyección, ocupación y cobranza por tenant

## Piezas que ya viven en `MODULOS`

- `portals/role-based-portals`
- `integrations/property-publisher-core`
- `notifications/whatsapp-template-kit`
- `ops/arrears-alert-core`
- `ops/chilean-utils-core`
- `ops/report-pipeline-core`
- `pdf/rental-contract-outline-core`
- `pdf/tenant-branded-documents`

## Repos de origen

- `CorredoresPro`

## Observaciones

- el caso confirma una vertical inmobiliaria operativa suficientemente clara para existir como stack propio
- el borde reusable más fino no fue el PDF completo, sino outline contractual, severidad de mora y payloads/portales por rol
- aunque el repo no está terminado, la lógica madre ya está bastante visible y no depende de que el producto final haya cerrado todos sus bordes

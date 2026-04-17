# delivery/tracking-core

Estado: usable inicial endurecido

## Fuentes

- `acargoo`
- `rishtedar`
- `hojacero`

## Propósito

Concentrar tracking live de pedido o recorrido, ubicación de vehículo, hitos, ETA y progreso sin casarlo con una UI de mapa específica.

## Qué resuelve hoy

- snapshot portable de tracking con timeline, ubicación actual y vehículo live
- normalización de stops/etapas y cálculo de progreso del recorrido
- helpers de status para vista pública tipo apoderado o cliente final
- payload base para pintar un vehículo en mapa sin acoplarse a Google Maps o Leaflet

## Lectura de uso

Para un caso como transporte escolar, este core deja modelado el viaje y su progreso; la superficie visual puede vivir encima de `geo/map-surface-core` y `geo/route-planning-core`.

## Estado real

Ya tiene base portable sólida, cobertura de pruebas y borde técnico estable para seguimiento público, recorridos y ETA.

# route-planning-core

Helpers portables para geocoding y planificación de rutas con fallback Google, OSM/OSRM y haversine.

## Qué resuelve

- normaliza direcciones para búsqueda
- arma URLs y payloads para Google Geocoding, Google Routes y OSRM
- decodifica polyline de Google Routes
- estima rutas con fallback cuando no hay proveedor disponible

## Origen

- `acargoo/lib/acargoo/domain/maps-public.ts`

## Estado

`usable inicial endurecido`

## Estado real

Ya tiene fallbacks claros, pruebas sobre geocoding y estimación de ruta, y un contrato portable suficientemente estable para otros stacks.

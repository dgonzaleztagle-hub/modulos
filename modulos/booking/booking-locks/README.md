# booking/booking-locks

Estado: usable inicial endurecido

## Fuente principal

- `D:\proyectos\zeus\src\lib\booking-locks.ts`

## Ecos

- patrones equivalentes o aplicables en `rishtedar`

## Propósito

Resolver reservas retenidas por pago pendiente sin acoplarse a una tabla ni a un gateway único.

## Qué resuelve hoy

- detección de reservas pendientes expiradas
- reconciliación por adapters de pago
- fallback configurable cuando un adapter falla
- lista de reservas que siguen bloqueando capacidad

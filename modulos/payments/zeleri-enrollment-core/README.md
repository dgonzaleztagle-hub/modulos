# zeleri-enrollment-core

Core reusable para el flujo de enrolamiento de tarjetas de Zeleri.

Qué rescata:

- saneo portable de `baseUrl`, `token` y `secret`
- body firmado para crear enrollment
- request firmado para listar tarjetas enroladas por email
- body/request para crear orden con tarjeta enrolada
- body/request para confirmar cobro de una orden enrolada

Qué no incluye:

- `fetch` real
- persistencia de bookings
- lógica de fallback de producto
- render de iframes o UI de checkout

Origen: `zeus`, específicamente `src/lib/zeleri.ts` y el flujo `/api/zeus/enroll`.

## Estado

`usable inicial endurecido`

## Estado real

Ya concentra el enrolamiento, listado de tarjetas y confirmación de cobro con requests portables y borde técnico claro.

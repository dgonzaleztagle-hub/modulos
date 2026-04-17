# Caso: Donde Germain

## Tipo

Marca food / prospecto / experiencia pública

## Valor principal encontrado

- branding agresivo para restaurante
- identidad visual clara y muy consistente
- superficie pública con sensación premium-callejera
- micro-commerce real, no solo vitrina
- operación conectada en vivo con sesión de local
- tracking de pedidos con estética propia
- elementos de juego como capa experiencial y de retención

## Qué piezas aporta al sistema MODULOS

- referencia de branding restaurante con criterio fuerte
- patrón de `menu + cart + checkout + tracking` en una sola superficie pública
- patrón de `local abierto/cerrado` controlado por sesión viva
- panel admin liviano para cocina/jornada con métricas y cambio de estado
- PWA/Service Worker para experiencia instalable
- minijuego promocional conectado a captura por WhatsApp

## Qué tiene realmente

- `page.tsx`: landing cinematográfica con menú, carrito, checkout y control por sesión abierta/cerrada
- `track/[code]/page.tsx`: tracking realtime de orden con ticket visual y estados narrativos
- `admin/page.tsx`: panel operativo para pedidos, apertura/cierre de jornada y métricas
- `GermainGame.tsx`: minijuego tipo arcade como capa de engagement
- `layout.tsx` + `ServiceWorkerRegistrar.tsx`: base PWA dedicada para la experiencia pública
- `BRAND_SOUL.md`: dirección de arte y reglas de identidad muy claras

## Qué lo hace especial

- No separa branding y operación como si fueran mundos distintos; los mezcla bien.
- El pedido no se siente como checkout genérico, se siente como parte del universo de marca.
- El tracking de orden no es utilitario solamente; mantiene tono, energía y entretención.
- El admin no intenta ser backoffice enterprise, sino consola de cocina/jornada enfocada.
- El juego no está puesto porque sí: funciona como extensión de la experiencia y captura.

## Patrones que probablemente migraron o podían migrar a rishtedar

- `cms/editable-content-core` para superficies públicas editables
- `delivery/tracking-core` para tracking web por código
- superficie pública food con personalidad fuerte
- carrito y checkout incrustados en la experiencia de marca
- tracking dedicado por código
- thinking de operación viva ligado a sesión/turno
- uso de promo/entretenimiento como capa de valor, no solo descuento

## Cuándo abrir este caso

- cuando el cliente restaurante necesite diferenciación de marca
- cuando queramos evitar una web food genérica
- cuando queramos mezclar operación real con experiencia pública sin perder estilo
- cuando necesitemos inspiración para `stack-restaurante` con capa de marca fuerte

## Qué no hacer

- no confundir este caso con un core de POS
- no copiarlo como tema visual fijo para todos los restaurantes
- separar lo reusable del caso específico: aquí hay patrón y también hay mucha autoría

## Mi lectura

`donde-germain` no es solo una landing bonita. Es un caso donde la marca, el ordering, el tracking y la operación chica conviven dentro de una sola experiencia coherente. Por eso vale más como blueprint avanzado de restaurante que como simple referencia visual.

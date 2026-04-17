# caprex

Repo origen: `D:\proyectos\caprex`

## Linaje

- base reconocible en `zeus`
- lectura útil: `caprex` se comporta como una derivación de `zeus` orientada a biblioteca privada de contenido y grants corporativos

## Módulo: content library access core

- taxonomía: `CRM, pipeline y backoffice`
- rutas clave: `src/modules/caprex/types.ts`, `src/modules/caprex/store.ts`, `src/modules/caprex/resolvers.ts`
- problema que resuelve: vender y entregar carpetas privadas de contenido digital con acceso por usuario o empresa
- alcance real observado: assets, carpetas, offers, grants, purchases, sesiones de reproducción y settings de marca dentro de un mismo estado de plataforma
- dependencias externas: ninguna fuerte en la lógica base; hoy persiste en `localStorage`
- entidades y flujos principales: asset -> carpeta -> oferta -> compra/asignación -> grant -> acceso portal
- señales de modularidad: tipos claros, resolvers puros y separación razonable entre catálogo, acceso y sesión
- señales de acoplamiento o deuda: hoy es mock/local-first y no está conectado a backend real
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: manual access grants para cuentas empresa

- taxonomía: `auth y tenants`
- rutas clave: `src/modules/caprex/types.ts`, `src/modules/caprex/resolvers.ts`, `src/modules/caprex/mock-data.ts`
- problema que resuelve: habilitar acceso temporal a carpetas privadas para cuentas individuales o compartidas de empresa
- alcance real observado: grants por `user` o `company`, vigencia, expiración y resolución de acceso efectivo
- dependencias externas: ninguna en la lógica reusable
- entidades y flujos principales: cuenta/empresa -> grant -> carpeta accesible -> expiración
- señales de modularidad: reglas puras y muy portables
- señales de acoplamiento o deuda: usa sesiones mock y naming específico de la demo
- madurez estimada: `alto`
- potencial de reutilización: `alto`
- observación de extracción: `extraíble`

## Módulo: content commerce con modos subscription/manual/hybrid

- taxonomía: `pagos y checkout`
- rutas clave: `src/modules/caprex/types.ts`, `src/modules/caprex/mock-data.ts`, `src/components/caprex-platform/public-platform.tsx`
- problema que resuelve: ofrecer una misma biblioteca de contenido en modo suscripción, venta manual o híbrida
- alcance real observado: ofertas ligadas a carpetas con `mode`, `priceLabel`, `billingLabel`, beneficios y CTA
- dependencias externas: ninguna obligatoria en la lógica modelada
- entidades y flujos principales: carpeta -> offer -> purchase record -> grant
- señales de modularidad: modelo de negocio muy claro y transversal
- señales de acoplamiento o deuda: todavía sin integración de pago real ni billing engine
- madurez estimada: `medio`
- potencial de reutilización: `alto`
- observación de extracción: `requiere refactor`

## Módulo: portal privado de biblioteca preventiva

- taxonomía: `CMS, landing y contenido`
- rutas clave: `src/components/caprex-platform/portal-app.tsx`, `src/components/caprex-platform/admin-app.tsx`, `src/components/caprex-platform/shared.tsx`
- problema que resuelve: entregar una experiencia privada de consumo de contenido con marca, soporte y vistas diferenciadas entre admin y cliente
- alcance real observado: portal, admin, catálogo público y rutas privadas por carpeta
- dependencias externas: Next.js App Router
- entidades y flujos principales: sesión -> biblioteca visible -> carpeta -> asset/reproducción
- señales de modularidad: separación clara de superficies
- señales de acoplamiento o deuda: valor más fuerte en la experiencia ensamblada que en componentes individuales
- madurez estimada: `medio`
- potencial de reutilización: `medio`
- observación de extracción: `solo referencia`

## Veredicto

- no es solo landing comercial; aquí sí hay familia reusable
- lo más valioso es el patrón de `biblioteca privada con grants y cuentas compartidas`
- conviene leerlo en continuidad con `zeus`, no como invento completamente separado
- conviene tratarlo como satélite serio de `portals/access/content commerce`, no como referencia visual menor

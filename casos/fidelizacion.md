# Caso: fidelizacion

## Tipo

`loyalty-wallet`

## Qué resolvió

- programa de fidelización multi-tenant con branding por negocio
- tarjetas Google Wallet con geofencing y mensajes contextuales
- puntos, rachas, tiers y motores por tipo de programa
- agenda híbrida para verticales presenciales
- billing de suscripción con Flow y ciclo cliente/tarjeta/plan
- heurísticas accionables para retención, referidos y VIP

## Piezas que ya viven en `MODULOS`

- `booking/booking-rubro-config-core`
- `tenancy/billing-plan-catalog-core`
- `commerce/program-motor-config-core`
- `crm/advisor-insights-core`
- `crm/loyalty-ledger-core`
- `integrations/google-wallet-pass-core`
- `notifications/wallet-message-core`
- `notifications/push-notification-sw-core`
- `notifications/webpush-delivery-core`
- `payments/flow-subscription-core`

## Repos de origen

- `fidelizacion`

## Observaciones

- esta línea confirma un stack propio entre loyalty, wallet, agenda, push y suscripciones
- la parte más reusable está en el modelado del programa y en la construcción del pass, más que en la UI final
- la agenda suma, pero el corazón del repo está realmente en `wallet + loyalty + billing + insights`

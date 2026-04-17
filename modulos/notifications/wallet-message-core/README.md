# wallet-message-core

Helpers portables para normalizar mensajes wallet y decidir si deben notificar o caer en modo silencioso.

## Qué resuelve

- normaliza título y cuerpo con límites seguros
- aplica defaults por tipo de mensaje
- evita duplicados recientes
- hace throttling de notificaciones por ventana diaria

## Origen

- `fidelizacion/src/lib/walletNotifications.ts`

## Estado

`usable inicial endurecido`

## Estado real

Ya tiene reglas claras para normalización, silenciamiento por duplicado y throttling, así que funciona como base portable de mensajería wallet.

# google-wallet-pass-core

Encapsula la parte portable de Google Wallet para programas de fidelización: labels por tipo de programa, object IDs candidatos, payload de objeto y payload de clase.

## Extraído de

- `fidelizacion/src/lib/googleWallet.ts`
- `fidelizacion/src/lib/wallet/push.ts`

## Qué resuelve

- separar la forma de un pase Wallet del fetch/JWT/credenciales del integrador
- reutilizar geofencing, links a PWA y naming de programas
- construir candidatos de `objectId` sin depender del producto original

## Estado

`usable inicial endurecido`

## Estado real

Ya encapsula la parte portable de class/object payloads y candidatos de IDs para programas wallet reutilizables.

# credentials-encryption-core

Helpers portables para cifrar y descifrar credenciales sensibles usando `aes-256-gcm`.

## Qué resuelve

- derivación consistente de claves hexadecimales
- cifrado autenticado de payloads JSON
- descifrado seguro para credenciales de integraciones

## Origen

- `hojacero/lib/store/encryption.ts`

## Estado

`usable inicial endurecido`

## Estado real

Ya tiene roundtrip probado y borde técnico suficientemente claro para cifrar secretos portables dentro del ecosistema.

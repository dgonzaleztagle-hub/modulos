# agenda-email-core

Core reusable para notificaciones internas de agenda.

Qué rescata:

- routing de destinatarios por responsable
- ventana portable para decidir si corresponde mandar recordatorio
- payload HTML/texto de recordatorio de reunión
- payload HTML/texto de nueva reunión agendada

Qué no incluye:

- transporte real por email
- cron
- consultas a base de datos
- update de flags como `reminder_sent`

Origen: `hojacero`, específicamente `app/api/agenda/events/route.ts` y `app/api/agenda/reminder/route.ts`.

## Estado

`usable inicial endurecido`

## Estado real

Ya encapsula destinatarios, ventana de recordatorio y payloads de correo sin depender del transporte ni del cron original.

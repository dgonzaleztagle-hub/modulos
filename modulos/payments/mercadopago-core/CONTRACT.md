# Contrato propuesto

## Capacidades

- crear preferencia / checkout intent
- normalizar metadata de referencia externa
- verificar estado remoto de un pago
- decidir si un estado cuenta como pagado
- recibir y validar webhook
- devolver evento normalizado para la app consumidora

## Interface mínima

```ts
type MercadoPagoPaymentStatus =
  | "pending"
  | "authorized"
  | "in_process"
  | "approved"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";

interface CheckoutIntentInput {
  title: string;
  amount: number;
  externalReference: string;
  payerEmail?: string;
  successUrl?: string;
  failureUrl?: string;
  pendingUrl?: string;
  metadata?: Record<string, unknown>;
}

interface CheckoutIntentResult {
  provider: "mercadopago";
  preferenceId?: string;
  checkoutUrl?: string;
  externalReference: string;
}

interface NormalizedPaymentEvent {
  provider: "mercadopago";
  externalReference?: string;
  paymentId?: string;
  status: MercadoPagoPaymentStatus;
  approved: boolean;
  raw: unknown;
}
```

## Reglas ejecutivas

- el módulo no debe conocer tablas ni nombres de negocio
- la reconciliación de dominio vive fuera del módulo
- `externalReference` será la llave de enlace obligatoria

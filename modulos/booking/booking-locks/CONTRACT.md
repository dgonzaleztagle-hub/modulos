# Contrato propuesto

## Concepto

El módulo recibe bookings pendientes y adapters de pago; devuelve bookings normalizados y cuáles siguen bloqueando capacidad.

## Interface mínima

```ts
type BookingPaymentStatus = "pending" | "paid" | "failed";

interface BookingLike {
  id: string;
  paymentStatus: BookingPaymentStatus;
  paymentMethod?: string | null;
  paymentId?: string | null;
  createdAt: string;
}

interface PaymentGatewayAdapter {
  supports: (paymentMethod?: string | null) => boolean;
  resolveStatus: (booking: BookingLike) => Promise<BookingPaymentStatus>;
}
```

## Salida esperada

- booking actualizado
- motivo de resolución
- lista de bookings que siguen bloqueando agenda

## Regla ejecutiva

El módulo debe depender de adapters, no de Mercado Pago o Zeleri en duro.

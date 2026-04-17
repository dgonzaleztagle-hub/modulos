export function formatPhoneForWhatsApp(phone: string): string {
  let cleaned = String(phone || "").replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
  if (cleaned.startsWith("56")) return cleaned;
  if (cleaned.startsWith("9") && cleaned.length === 9) return `56${cleaned}`;
  if (cleaned.length === 8) return `562${cleaned}`;
  return `56${cleaned}`;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${formatPhoneForWhatsApp(phone)}?text=${encodeURIComponent(message)}`;
}

function renderTemplate(parts: string[]) {
  return parts.join("").replace(/\s+/g, " ").trim();
}

export function templateRecordatorioPago(input: {
  clientName: string;
  propertyName: string;
  amount: string;
  dueDay?: number;
}) {
  const dueText = input.dueDay ? `, con vencimiento el dia *${input.dueDay}* de este mes` : "";
  return renderTemplate([
    `Hola ${input.clientName}, le recordamos que el arriendo de *${input.propertyName}* `,
    `corresponde a *${input.amount}*${dueText}. `,
    "Quedamos atentos ante cualquier consulta. Saludos.",
  ]);
}

export function templateAvisoVencimientoContrato(input: {
  clientName: string;
  propertyName: string;
  endDate: string;
}) {
  return renderTemplate([
    `Hola ${input.clientName}, le informamos que su contrato de arriendo para *${input.propertyName}* `,
    `vence el *${input.endDate}*. `,
    "Lo invitamos a contactarnos para coordinar la renovacion o la entrega del inmueble. Saludos.",
  ]);
}

export function templateCobranza(input: {
  clientName: string;
  propertyName: string;
  amount: string;
  daysOverdue: number;
}) {
  return renderTemplate([
    `Hola ${input.clientName}, le comunicamos que tiene un pago pendiente de *${input.amount}* `,
    `por arriendo de *${input.propertyName}* con *${input.daysOverdue} dias* de atraso. `,
    "Le solicitamos regularizar su situacion a la brevedad para evitar acciones adicionales. ",
    "Estamos disponibles para coordinar el pago. Saludos.",
  ]);
}

export function templateCobranzaLegal(input: {
  clientName: string;
  propertyName: string;
  amount: string;
  daysOverdue: number;
}) {
  return renderTemplate([
    `Hola ${input.clientName}, le informamos formalmente que registra *${input.daysOverdue} dias de mora* `,
    `en el pago de arriendo de *${input.propertyName}* por un monto de *${input.amount}*. `,
    "Conforme a la *Ley 21.461*, nos encontramos en condiciones de iniciar el proceso de restitucion del inmueble. ",
    "Le instamos a regularizar esta situacion con caracter urgente. Saludos.",
  ]);
}

export function templateEntregaInmueble(input: {
  clientName: string;
  propertyName: string;
  endDate: string;
}) {
  return renderTemplate([
    `Hola ${input.clientName}, le recordamos que el contrato de *${input.propertyName}* vence el *${input.endDate}*. `,
    "Por favor coordine la entrega del inmueble con anticipacion. ",
    "Contactenos para agendar la revision final y entrega de llaves. Saludos.",
  ]);
}

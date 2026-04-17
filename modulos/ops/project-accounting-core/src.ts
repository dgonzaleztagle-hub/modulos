export interface ProjectClientRecord {
  id: string;
  name: string;
  email?: string;
  status: "active" | "inactive";
  startDate: string;
}

export interface ProjectPaymentRecord {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  description: string;
  status: "paid" | "pending";
  type: "implementation" | "maintenance";
  installment?: {
    current: number;
    total: number;
  };
}

export function computeProjectTotalRevenue(payments: ProjectPaymentRecord[]) {
  return payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

export function countActiveProjectClients(clients: ProjectClientRecord[]) {
  return clients.filter((client) => client.status === "active").length;
}

export function buildProjectClient(input: {
  id: string;
  name: string;
  email?: string;
  startDate?: string;
}) {
  return {
    id: input.id,
    name: input.name,
    email: input.email,
    status: "active" as const,
    startDate: input.startDate || new Date().toISOString(),
  };
}

export function buildProjectPayment(input: {
  id: string;
  clientId: string;
  amount: number;
  description: string;
  type: "implementation" | "maintenance";
  date?: string;
  installmentCurrent?: number;
  installmentTotal?: number;
}) {
  const payment: ProjectPaymentRecord = {
    id: input.id,
    clientId: input.clientId,
    amount: Number(input.amount || 0),
    description: input.description,
    date: input.date || new Date().toISOString(),
    status: "paid",
    type: input.type,
  };

  if (
    input.type === "implementation" &&
    Number.isFinite(input.installmentCurrent) &&
    Number.isFinite(input.installmentTotal)
  ) {
    payment.installment = {
      current: Number(input.installmentCurrent),
      total: Number(input.installmentTotal),
    };
  }

  return payment;
}

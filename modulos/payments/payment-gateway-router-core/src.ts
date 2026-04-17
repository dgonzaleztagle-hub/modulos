import crypto from 'node:crypto';

export type PaymentGatewayMethod = 'mercadopago' | 'flow' | 'transbank';

export type PaymentGatewayConfig = {
  method: PaymentGatewayMethod;
  credentials: Record<string, string>;
  testMode: boolean;
};

export type CreatePaymentParams = {
  orderId: string;
  amount: number;
  description: string;
  returnUrl: string;
  webhookUrl: string;
  customerEmail?: string;
};

export type PaymentRequestPlan = {
  method: PaymentGatewayMethod;
  endpoint: string;
  headers: Record<string, string>;
  body: string;
  checkoutResolver: (response: Record<string, unknown>) => {
    checkoutUrl: string;
    paymentId?: string;
  };
};

function assertCredential(value: string | undefined, label: string) {
  if (!value?.trim()) {
    throw new Error(`Missing ${label}`);
  }

  return value;
}

function buildMercadoPagoPlan(
  config: PaymentGatewayConfig,
  params: CreatePaymentParams,
): PaymentRequestPlan {
  const accessToken = assertCredential(
    config.credentials.accessToken,
    'Mercado Pago access token',
  );

  return {
    method: 'mercadopago',
    endpoint: 'https://api.mercadopago.com/checkout/preferences',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      items: [
        {
          title: params.description,
          quantity: 1,
          unit_price: params.amount,
          currency_id: 'CLP',
        },
      ],
      back_urls: {
        success: params.returnUrl,
        failure: params.returnUrl,
        pending: params.returnUrl,
      },
      auto_return: 'approved',
      notification_url: params.webhookUrl,
      external_reference: params.orderId,
      metadata: {
        order_id: params.orderId,
      },
    }),
    checkoutResolver: response => ({
      checkoutUrl: String(
        config.testMode ? response.sandbox_init_point : response.init_point,
      ),
      paymentId: typeof response.id === 'string' ? response.id : undefined,
    }),
  };
}

async function generateFlowSignature(params: string, secretKey: string) {
  return crypto.createHash('sha256').update(params + secretKey).digest('hex');
}

async function buildFlowPlan(
  config: PaymentGatewayConfig,
  params: CreatePaymentParams,
): Promise<PaymentRequestPlan> {
  const apiKey = assertCredential(config.credentials.apiKey, 'Flow apiKey');
  const secretKey = assertCredential(config.credentials.secretKey, 'Flow secretKey');

  const flowParams = {
    apiKey,
    commerceOrder: params.orderId,
    subject: params.description,
    amount: params.amount.toString(),
    email: params.customerEmail || 'cliente@ejemplo.cl',
    urlConfirmation: params.webhookUrl,
    urlReturn: params.returnUrl,
  };

  const paramsString = Object.entries(flowParams)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const signature = await generateFlowSignature(paramsString, secretKey);

  return {
    method: 'flow',
    endpoint: 'https://www.flow.cl/api/payment/create',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      ...flowParams,
      s: signature,
    }).toString(),
    checkoutResolver: response => ({
      checkoutUrl: `https://www.flow.cl/app/web/pay.php?token=${String(response.token)}`,
      paymentId:
        typeof response.flowOrder === 'string'
          ? response.flowOrder
          : response.flowOrder != null
            ? String(response.flowOrder)
            : undefined,
    }),
  };
}

function buildTransbankPlan(
  config: PaymentGatewayConfig,
  params: CreatePaymentParams,
): PaymentRequestPlan {
  const commerceCode = assertCredential(
    config.credentials.commerceCode,
    'Transbank commerceCode',
  );
  const apiKey = assertCredential(config.credentials.apiKey, 'Transbank apiKey');
  const baseUrl = config.testMode
    ? 'https://webpay3gint.transbank.cl'
    : 'https://webpay3g.transbank.cl';

  return {
    method: 'transbank',
    endpoint: `${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`,
    headers: {
      'Content-Type': 'application/json',
      'Tbk-Api-Key-Id': commerceCode,
      'Tbk-Api-Key-Secret': apiKey,
    },
    body: JSON.stringify({
      buy_order: params.orderId,
      session_id: params.orderId,
      amount: params.amount,
      return_url: params.returnUrl,
    }),
    checkoutResolver: response => ({
      checkoutUrl: `${String(response.url)}?token_ws=${String(response.token)}`,
      paymentId: typeof response.token === 'string' ? response.token : undefined,
    }),
  };
}

export async function createPaymentRequestPlan(
  config: PaymentGatewayConfig,
  params: CreatePaymentParams,
): Promise<PaymentRequestPlan> {
  switch (config.method) {
    case 'mercadopago':
      return buildMercadoPagoPlan(config, params);
    case 'flow':
      return buildFlowPlan(config, params);
    case 'transbank':
      return buildTransbankPlan(config, params);
    default:
      throw new Error('Unsupported payment gateway');
  }
}

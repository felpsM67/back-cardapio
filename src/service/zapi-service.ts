interface ZapiSendTextResponse {
  zaapId?: string;
  messageId?: string;
  id?: string;
}

interface ZapiStatusResponse {
  connected: boolean;
  smartphoneConnected: boolean;
  error?: string;
}

function getZapiConfig() {
  const instanceId = process.env.ZAPI_INSTANCE_ID;
  const instanceToken = process.env.ZAPI_INSTANCE_TOKEN;
  const clientToken = process.env.ZAPI_CLIENT_TOKEN;

  if (!instanceId || !instanceToken || !clientToken) {
    throw new Error(
      'Credenciais da Z-API não configuradas no arquivo .env.',
    );
  }

  return {
    baseUrl:
      `https://api.z-api.io/instances/${instanceId}` +
      `/token/${instanceToken}`,
    clientToken,
  };
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (!digits) {
    throw new Error('Telefone não informado.');
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

async function requestZapi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const { baseUrl, clientToken } = getZapiConfig();

  const response = await fetch(
    `${baseUrl}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': clientToken,
        ...options.headers,
      },
    },
  );

  const body = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    console.error('Erro retornado pela Z-API:', body);

    throw new Error(
      body?.message ||
        body?.error ||
        `Erro ao acessar a Z-API: ${response.status}`,
    );
  }

  return body as T;
}

async function getStatus(): Promise<ZapiStatusResponse> {
  return requestZapi<ZapiStatusResponse>(
    '/status',
    {
      method: 'GET',
    },
  );
}

async function sendText(
  phone: string,
  message: string,
): Promise<ZapiSendTextResponse> {
  if (!message.trim()) {
    throw new Error('A mensagem não pode estar vazia.');
  }

  return requestZapi<ZapiSendTextResponse>(
    '/send-text',
    {
      method: 'POST',
      body: JSON.stringify({
        phone: normalizePhone(phone),
        message: message.trim(),
      }),
    },
  );
}

export const zapiService = {
  getStatus,
  sendText,
};
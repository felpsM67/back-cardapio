import type {
  Request,
  Response,
  Router,
} from 'express';

interface ZApiWebhookBody {
  phone?: string;
  fromMe?: boolean;
  isGroup?: boolean;
  isNewsletter?: boolean;
  messageId?: string;

  text?: {
    message?: string;
  };
}

export default (router: Router): void => {
  router.post(
    '/webhooks/zapi/recebimento/:secret',

    async (
      request: Request<
        { secret: string },
        unknown,
        ZApiWebhookBody
      >,
      response: Response,
    ): Promise<void> => {
      try {
        const webhookSecret =
          process.env.ZAPI_WEBHOOK_SECRET;

        if (
          !webhookSecret ||
          request.params.secret !==
            webhookSecret
        ) {
          response.status(401).json({
            message: 'Webhook não autorizado.',
          });

          return;
        }

        const {
          phone,
          fromMe,
          isGroup,
          isNewsletter,
        } = request.body;
        const receivedMessage =
  request.body.text?.message
    ?.trim()
    .toLocaleLowerCase('pt-BR') ?? '';

const greetingWords = [
  'oi',
  'olá',
  'ola',
  'bom dia',
  'boa tarde',
  'boa noite',
  'menu',
  'cardápio',
  'cardapio',
  'pedido',
  'pedir',
];

const shouldReply = greetingWords.some(
  (word) =>
    receivedMessage === word ||
    receivedMessage.startsWith(`${word} `),
);
        /*
         * Impede responder:
         * - mensagens enviadas pela própria loja;
         * - mensagens de grupos;
         * - mensagens de canais;
         * - eventos sem telefone.
         */
        if (
          fromMe ||
          isGroup ||
          isNewsletter ||
          !phone
        ) if (!shouldReply) {
          response.status(200).json({
            received: true,
            ignored: true,
            reason: 'Mensagem não contém palavra de ativação'
          });

          return;
        }

        const instanceId =
          process.env.ZAPI_INSTANCE_ID;

        const instanceToken =
          process.env.ZAPI_INSTANCE_TOKEN;

        const clientToken =
          process.env.ZAPI_CLIENT_TOKEN;

        const menuUrl =
          process.env.MENU_URL;

        if (
          !instanceId ||
          !instanceToken ||
          !clientToken ||
          !menuUrl
        ) {
          throw new Error(
            'Variáveis da Z-API não configuradas.',
          );
        }

        const message = [
          'Olá! 👋',
          '',
          'Bem-vindo ao nosso atendimento.',
          '',
          'Confira o cardápio e faça seu pedido pelo link:',
          menuUrl,
        ].join('\n');

        const zapiResponse = await fetch(
          `https://api.z-api.io/instances/${instanceId}/token/${instanceToken}/send-text`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              'Client-Token':
                clientToken,
            },

            body: JSON.stringify({
              phone,
              message,
              delayTyping: 2,
            }),
          },
        );

        if (!zapiResponse.ok) {
          const errorBody =
            await zapiResponse.text();

          throw new Error(
            `Erro da Z-API: ${errorBody}`,
          );
        }

        const result =
          await zapiResponse.json();

        response.status(200).json({
          received: true,
          messageSent: true,
          result,
        });
      } catch (error) {
        console.error(
          'Erro no webhook da Z-API:',
          error,
        );

        /*
         * Retornamos 200 para evitar várias
         * tentativas repetidas do webhook.
         */
        response.status(200).json({
          received: true,
          messageSent: false,
        });
      }
    },
  );
};
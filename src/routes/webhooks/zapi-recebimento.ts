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

const ACTIVATION_WORDS = [
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

function shouldReplyToMessage(
  message?: string,
): boolean {
  const normalizedMessage = message
    ?.trim()
    .toLocaleLowerCase('pt-BR');

  if (!normalizedMessage) {
    return false;
  }

  return ACTIVATION_WORDS.some(
    (word) =>
      normalizedMessage === word ||
      normalizedMessage.startsWith(
        `${word} `,
      ),
  );
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
          process.env.ZAPI_WEBHOOK_SECRET?.trim();

        const receivedSecret =
          request.params.secret?.trim();

        if (
          !webhookSecret ||
          receivedSecret !== webhookSecret
        ) {
          response.status(401).json({
            message:
              'Webhook não autorizado.',
          });

          return;
        }

        const {
          phone,
          fromMe,
          isGroup,
          isNewsletter,
          text,
        } = request.body;

        /*
         * Ignora:
         * - mensagens enviadas pela loja;
         * - mensagens de grupos;
         * - mensagens de canais;
         * - eventos sem telefone.
         */
        if (
          fromMe ||
          isGroup ||
          isNewsletter ||
          !phone
        ) {
          response.status(200).json({
            received: true,
            ignored: true,
            reason:
              'Evento não deve receber resposta automática.',
          });

          return;
        }

        const shouldReply =
          shouldReplyToMessage(
            text?.message,
          );

        if (!shouldReply) {
          response.status(200).json({
            received: true,
            ignored: true,
            reason:
              'Mensagem sem palavra de ativação.',
          });

          return;
        }

        const instanceId =
          process.env.ZAPI_INSTANCE_ID?.trim();

        const instanceToken =
          process.env.ZAPI_INSTANCE_TOKEN?.trim();

        const clientToken =
          process.env.ZAPI_CLIENT_TOKEN?.trim();

        const menuUrl =
          process.env.MENU_URL?.trim();

        const missingVariables: string[] =
          [];

        if (!instanceId) {
          missingVariables.push(
            'ZAPI_INSTANCE_ID',
          );
        }

        if (!instanceToken) {
          missingVariables.push(
            'ZAPI_INSTANCE_TOKEN',
          );
        }

        if (!clientToken) {
          missingVariables.push(
            'ZAPI_CLIENT_TOKEN',
          );
        }

        if (!menuUrl) {
          missingVariables.push(
            'MENU_URL',
          );
        }

        if (
          missingVariables.length > 0
        ) {
          throw new Error(
            `Variáveis ausentes: ${missingVariables.join(
              ', ',
            )}`,
          );
        }

        const message = [
          'Olá! 👋',
          '',
          'Bem-vindo ao nosso atendimento.',
          '',
          'Confira o cardápio e faça seu pedido pelo link:',
          '',
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
            `Erro da Z-API (${zapiResponse.status}): ${errorBody}`,
          );
        }

        const result =
          await zapiResponse
            .json()
            .catch(() => null);

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
         * Mantém status 200 para impedir
         * repetições automáticas do webhook.
         */
        response.status(200).json({
          received: true,
          messageSent: false,

          error:
            error instanceof Error
              ? error.message
              : 'Erro desconhecido.',
        });
      }
    },
  );
};
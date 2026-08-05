import {
  badRequest,
  ok,
  serverError,
} from "../../helpers/http-helper";

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../protocols";

import { zapiService } from "../../service/zapi-service";

export class TestarZapiController
  implements Controller
{
  async handle(
    httpRequest: HttpRequest
  ): Promise<HttpResponse> {
    try {
      const telefone =
        httpRequest.body?.telefone;

      if (!telefone) {
        return badRequest(
          "Informe o telefone."
        );
      }

      const resultado =
        await zapiService.sendText(
          telefone,
          "✅ Integração com a Z-API funcionando!"
        );

      return ok({
        message: "Mensagem enviada com sucesso.",
        resultado,
      });
    } catch (error) {
      console.error(
        "Erro ao testar Z-API:",
        error
      );

      return serverError(error);
    }
  }
}
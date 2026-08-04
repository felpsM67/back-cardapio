import {
  ok,
  serverError,
} from "@/helpers/http-helper";

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/protocols";

import configuracoesService from "@/service/configuracoes-service";

export default class SalvarConfiguracoesController
  implements Controller
{
  async handle(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    try {
      const configuracao =
        await configuracoesService.salvar(
          httpRequest.body,
        );

      return ok(configuracao);
    } catch (error: unknown) {
      const erro =
        error instanceof Error
          ? error
          : new Error(
              "Erro ao salvar as configurações.",
            );

      return serverError(erro);
    }
  }
}
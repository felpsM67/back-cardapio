import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { created, serverError } from "@/helpers/http-helper";
import { ConfiguracoesService } from "@/service/configuracoes-service";

export class CriarConfiguracoesController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const service = new ConfiguracoesService();

      const configuracao = await service.criarConfiguracoes(
        httpRequest.body
      );

      return created(configuracao);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
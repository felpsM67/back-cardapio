import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { ok, notFound, badRequest, serverError } from "@/helpers/http-helper";
import { ConfiguracoesService } from "@/service/configuracoes-service";
import { updateConfiguracoesSchema } from "@/schemas";

export class UpdateConfiguracoesController implements Controller {
  private configuracoesService: ConfiguracoesService;

  constructor() {
    this.configuracoesService = new ConfiguracoesService();
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      const configuracoesData = updateConfiguracoesSchema.parse(
        httpRequest.body
      );

      const [affectedCount, updatedConfiguracoes] =
        await this.configuracoesService.atualizarConfiguracoes(
          Number(id),
          configuracoesData
        );

      if (affectedCount === 0) {
        return notFound({
          error: "Configurações não encontradas",
        });
      }

      return ok(updatedConfiguracoes[0]);
    } catch (error: any) {
      return badRequest(error);
    }
  }
}
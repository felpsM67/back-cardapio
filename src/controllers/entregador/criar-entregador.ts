import { created, serverError } from "@/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { EntregadorService } from "@/service/entregador-service";

export class CriarEntregadorController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const entregadorService = new EntregadorService();
            const entregadorCriado =
  await entregadorService.criar(
    httpRequest.body,
  );
            return created(entregadorCriado); 
        } catch ( error: any) {
            return serverError(error)
        }
    }
}